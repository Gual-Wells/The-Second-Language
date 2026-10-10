param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
$runtimeTemp = Join-Path $projectRoot '.cache/runtime-temp'
New-Item -ItemType Directory -Force -Path $runtimeTemp | Out-Null
$env:TEMP = $runtimeTemp
$env:TMP = $runtimeTemp
$env:WRANGLER_LOG_PATH = Join-Path $projectRoot '.cache/wrangler-logs'
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageArchive')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
 $logPath = Join-Path $projectRoot '.cache/storage-upgrade/service.log'
 New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null
  $ErrorActionPreference = 'Continue'
  & $node scripts/storage-maintain.mjs 2>&1 | Out-File -LiteralPath $logPath -Append -Encoding utf8
  $archiveExitCode = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  if ($archiveExitCode -ne 0) { throw '永久归档未完成，请检查连接与本机归档状态。' }
}
finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
