param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
$runtimeTemp = Join-Path $projectRoot '.cache/runtime-temp'
New-Item -ItemType Directory -Force -Path $runtimeTemp | Out-Null
$env:TEMP = $runtimeTemp
$env:TMP = $runtimeTemp
$services = Join-Path $projectRoot '.cache/local-services.json'
if (Test-Path -LiteralPath $services) {
 $networkProxy = (Get-Content -LiteralPath $services -Raw | ConvertFrom-Json).networkProxy
 if ($networkProxy) { $env:HTTPS_PROXY = $networkProxy; $env:HTTP_PROXY = $networkProxy }
}
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$codex = Get-Command codex -ErrorAction SilentlyContinue
if ($codex) { $env:SECOND_LANGUAGE_CODEX_EXECUTABLE = $codex.Source }
else { $env:SECOND_LANGUAGE_CODEX_EXECUTABLE = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/bin') -Filter codex.exe -Recurse -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName }
if (-not $env:SECOND_LANGUAGE_CODEX_EXECUTABLE) { throw 'Codex CLI was not found.' }
$registered = Join-Path $projectRoot '.cache/scroll-base/registered.json'
if (-not (Test-Path -LiteralPath $registered)) { throw 'Shared original craft base has not been verified.' }
$env:SECOND_LANGUAGE_SCROLL_BASE_DIGEST = (Get-Content -LiteralPath $registered -Raw | ConvertFrom-Json).manifestDigest
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageScrollProduction')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
 & $node scripts/scroll-worker.mjs
 if ($LASTEXITCODE -ne 0) { throw 'Scroll production stopped. Saved progress remains available.' }
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
