"""Short Kaggle hardware/operator probe; no model download or generation."""
import datetime
import importlib.util
import json
import pathlib
import platform
import shutil
import subprocess
import time
import urllib.request


def probe(output_dir):
    start = time.monotonic()
    result = {
        "stage": "hardware_probe",
        "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "python": platform.python_version(),
        "system": platform.system(),
        "gpu_devices": [],
        "model_generated": False,
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    result["disk_free_gib"] = round(shutil.disk_usage(output_dir).free / 2**30, 2)
    for name in ("torch", "flash_attn", "xformers", "flex_gemm", "cumesh", "o_voxel"):
        result.setdefault("installed_modules", {})[name] = importlib.util.find_spec(name) is not None
    try:
        import torch
        result["torch_version"] = torch.__version__
        result["torch_cuda_version"] = torch.version.cuda
        result["cuda_available"] = torch.cuda.is_available()
        if result["cuda_available"]:
            for index in range(torch.cuda.device_count()):
                prop = torch.cuda.get_device_properties(index)
                device = {
                    "index": index,
                    "name": prop.name,
                    "total_vram_gib": round(prop.total_memory / 2**30, 2),
                    "compute_capability": list(torch.cuda.get_device_capability(index)),
                }
                with torch.cuda.device(index):
                    try:
                        device["bf16_native"] = bool(torch.cuda.is_bf16_supported(including_emulation=False))
                    except TypeError:
                        device["bf16_native"] = bool(prop.major >= 8)
                    for label, dtype in (("fp16", torch.float16), ("bf16", torch.bfloat16)):
                        try:
                            q = torch.randn((1, 4, 128, 64), device=f"cuda:{index}", dtype=dtype)
                            y = torch.nn.functional.scaled_dot_product_attention(q, q, q)
                            torch.cuda.synchronize(index)
                            device[f"sdpa_{label}"] = {"completed": True, "finite": bool(torch.isfinite(y).all().item())}
                            del q, y
                        except Exception as exc:
                            device[f"sdpa_{label}"] = {"completed": False, "error": str(exc)[:400]}
                    torch.cuda.empty_cache()
                result["gpu_devices"].append(device)
            result["candidate_route"] = (
                "trellis2_native_low_vram_candidate"
                if any(d["total_vram_gib"] >= 23 and d["bf16_native"] for d in result["gpu_devices"])
                else "requires_legacy_gpu_adaptation_not_validated"
            )
        else:
            result["candidate_route"] = "no_gpu_assigned"
    except Exception as exc:
        result["torch_error"] = str(exc)[:400]
        result["candidate_route"] = "torch_unavailable"
    try:
        p = subprocess.run(["nvcc", "--version"], capture_output=True, text=True, timeout=15)
        result["nvcc"] = p.stdout[-1200:] if p.returncode == 0 else "unavailable"
    except (OSError, subprocess.TimeoutExpired):
        result["nvcc"] = "unavailable"
    for label, url in {
        "github": "https://api.github.com/repos/microsoft/TRELLIS.2",
        "model_config": "https://huggingface.co/microsoft/TRELLIS.2-4B/resolve/main/pipeline.json",
    }.items():
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "SecondLanguage-coin-test"})
            with urllib.request.urlopen(req, timeout=20) as response:
                result.setdefault("network", {})[label] = {"status": response.status, "bytes_sampled": len(response.read(4096))}
        except Exception as exc:
            result.setdefault("network", {})[label] = {"error": str(exc)[:250]}
    result["elapsed_seconds"] = round(time.monotonic() - start, 2)
    destination = output_dir / "hardware-probe.json"
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    probe(pathlib.Path("/kaggle/working/dragon-probe"))
