"""Task-local Kaggle controls. Credentials never enter notebook source or logs."""
import argparse
import ast
import datetime
import hashlib
import json
import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
PRIVATE = ROOT / "private"
os.environ["KAGGLE_CONFIG_DIR"] = str(PRIVATE)
os.environ["TEMP"] = os.environ["TMP"] = str(ROOT / "tmp")
os.environ["PYTHONPYCACHEPREFIX"] = str(ROOT / "cache" / "pycache")
SECRETS = []
TOKEN = PRIVATE / "api-token.txt"
if TOKEN.exists():
    token = TOKEN.read_text(encoding="utf-8-sig").strip()
    SECRETS.append(token)
    os.environ["KAGGLE_API_TOKEN"] = token
LEGACY = PRIVATE / "kaggle.json"
if LEGACY.exists():
    config = json.loads(LEGACY.read_text(encoding="utf-8-sig"))
    SECRETS.append(config.get("key", ""))


def safe(value):
    text = str(value)
    for secret in SECRETS:
        if secret:
            text = text.replace(secret, "[REDACTED]")
    return re.sub(r"KGAT_[A-Za-z0-9_-]+", "[REDACTED]", text)


def save(name, data):
    target = ROOT / "outputs" / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(safe(json.dumps(data, ensure_ascii=False, indent=2, default=str)), encoding="utf-8")


def quotas(api):
    response = api.quota_view()
    out = {"queried_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "refresh_at": str(response.quota_refresh_time)}
    for label in ("gpu", "tpu"):
        q = getattr(response, label + "_quota", None)
        if q is not None:
            used = q.time_used.total_seconds()
            total = q.total_time_allowed.total_seconds()
            out[label] = {"total_seconds": total, "used_seconds": used, "remaining_seconds": max(0, total - used)}
    return out


def build_notebook(username):
    import nbformat
    code = (ROOT / "probe.py").read_text(encoding="utf-8")
    ast.parse(code)
    notebook = nbformat.v4.new_notebook(metadata={
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python"},
    }, cells=[
        nbformat.v4.new_markdown_cell("# Hostile dragon: Kaggle hardware probe\n\nPrivate short hardware/operator test. No generation, model weights, paid APIs or credential-bearing cells. A successful probe is not a successful coin."),
        nbformat.v4.new_code_cell(code),
    ])
    nbformat.validate(notebook)
    folder = ROOT / "notebooks" / "probe"
    folder.mkdir(parents=True, exist_ok=True)
    nbformat.write(notebook, folder / "dragon-probe.ipynb")
    title = "Hostile Dragon Hardware Probe 20261011"
    slug = "hostile-dragon-hardware-probe-20261011"
    metadata = {
        "id": username + "/" + slug,
        "title": title,
        "code_file": "dragon-probe.ipynb",
        "language": "python", "kernel_type": "notebook",
        "is_private": True, "enable_gpu": True, "enable_tpu": False,
        "enable_internet": True, "dataset_sources": [], "competition_sources": [],
        "kernel_sources": [], "model_sources": [],
    }
    (folder / "kernel-metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return folder, metadata["id"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["check", "push", "status", "fetch", "build"])
    parser.add_argument("--accelerator", default="NvidiaTeslaT4")
    parser.add_argument("--username")
    parser.add_argument("--retry-failed", action="store_true")
    parser.add_argument("--after-verification", action="store_true", help="One controlled re-probe after user confirmed verification, only for a completed CPU-only run")
    args = parser.parse_args()
    if args.action == "build":
        folder, kernel = build_notebook(args.username or "ACCOUNT_REQUIRED")
        print(json.dumps({"stage": "notebook_validated", "path": str(folder), "kernel": kernel}))
        return
    if not (TOKEN.exists() or LEGACY.exists()):
        data = {"stage": "credentials_required", "gpu_submitted": False}
        save("connection-status.json", data)
        print(json.dumps(data))
        sys.exit(2)
    from kaggle.api.kaggle_api_extended import KaggleApi
    api = KaggleApi()
    api.authenticate()
    username = args.username or api.get_config_value("username")
    if not username:
        raise RuntimeError("Account username is not available after authentication")
    if args.action == "check":
        quota = quotas(api)
        save("quota-before.json", quota)
        save("connection-status.json", {"stage": "authenticated", "username": username, "gpu_submitted": False, "quota": quota})
        print(json.dumps({"stage": "authenticated", "username": username, "quota": quota}))
    elif args.action == "push":
        quota = quotas(api)
        save("quota-before-probe.json", quota)
        if quota.get("gpu", {}).get("remaining_seconds", 0) < 600:
            raise RuntimeError("Not enough verified GPU quota for this probe; no run submitted")
        folder, kernel = build_notebook(username)
        receipt = ROOT / "outputs" / "probe-submission.json"
        if receipt.exists():
            if not (args.retry_failed or args.after_verification):
                raise RuntimeError("A probe already has a submission record; use status/fetch rather than repeat push")
            previous = json.loads(receipt.read_text(encoding="utf-8"))
            status = json.loads(str(api.kernels_status(previous["kernel"])))
            if args.after_verification:
                if previous.get("after_verification"):
                    raise RuntimeError("Post-verification probe was already submitted; inspect its results first")
                previous_version = json.loads(previous.get("response", "{}")).get("versionNumber")
                report_path = ROOT / "outputs" / ("remote-probe-v" + str(previous_version)) / "dragon-probe" / "hardware-probe.json"
                if status.get("status") != "COMPLETE" or not report_path.exists():
                    raise RuntimeError("Re-probe requires confirmed COMPLETE and a preserved hardware report")
                report = json.loads(report_path.read_text(encoding="utf-8"))
                if report.get("cuda_available") is not False:
                    raise RuntimeError("Previous run must be explicitly CPU-only")
            elif status.get("status") != "ERROR":
                raise RuntimeError("Retry requires a confirmed ERROR state, not a running or unknown result")
            history_name = "probe-submission-history-" + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ") + ".json"
            save(history_name, previous)
        # Preserve an intent before the mutation. A transport failure must not trigger duplicate submission.
        save("probe-submission.json", {"stage": "submitting", "kernel": kernel, "accelerator": args.accelerator, "after_verification": args.after_verification, "sha256": hashlib.sha256((folder / "dragon-probe.ipynb").read_bytes()).hexdigest()})
        response = api.kernels_push(str(folder), timeout="300", acc=args.accelerator)
        save("probe-submission.json", {"stage": "submitted", "kernel": kernel, "accelerator": args.accelerator, "after_verification": args.after_verification, "response": str(response)})
        print(json.dumps({"stage": "submitted", "kernel": kernel}))
    else:
        receipt = json.loads((ROOT / "outputs" / "probe-submission.json").read_text(encoding="utf-8"))
        kernel = receipt["kernel"]
        if args.action == "status":
            response = api.kernels_status(kernel)
            data = {"kernel": kernel, "response": str(response)}
            save("probe-run-status.json", data)
            print(safe(json.dumps(data)))
        else:
            version = json.loads(receipt.get("response", "{}")).get("versionNumber", "unknown")
            output = ROOT / "outputs" / ("remote-probe-v" + str(version))
            output.mkdir(exist_ok=True)
            api.kernels_output(kernel, path=str(output))
            save("quota-after-probe.json", quotas(api))
            reports = list(output.rglob("hardware-probe.json"))
            if reports:
                report = json.loads(reports[0].read_text(encoding="utf-8"))
                data = {
                    "stage": "gpu_probe_completed" if report.get("cuda_available") else "runtime_has_no_gpu",
                    "path": str(output), "kernel": kernel,
                    "model_generated": False,
                    "report": report,
                }
                save("hardware-result.json", data)
            else:
                data = {"stage": "no_hardware_report", "path": str(output), "kernel": kernel, "model_generated": False}
            print(json.dumps(data, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        data = {"stage": "operation_failed", "error_type": type(exc).__name__, "message": safe(exc)}
        save("last-operation-error.json", data)
        print(safe(json.dumps(data, ensure_ascii=False)))
        sys.exit(1)
