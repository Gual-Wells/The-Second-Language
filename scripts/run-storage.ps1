param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageArchive')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
 $logPath = Join-Path $projectRoot '.cache/storage-upgrade/service.log'
 if (Test-Path -LiteralPath (Join-Path $projectRoot '.cache/storage-upgrade/request.json')) {
  "归档检查 $([DateTimeOffset]::Now.ToString('o'))" | Out-File -LiteralPath $logPath -Append -Encoding utf8
  $ErrorActionPreference = 'Continue'
  & $node scripts/storage-maintain.mjs 2>&1 | Out-File -LiteralPath $logPath -Append -Encoding utf8
  $archiveExitCode = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  if ($archiveExitCode -ne 0) { throw '永久归档未完成，请检查连接与本机归档状态。' }
 }
}
finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
