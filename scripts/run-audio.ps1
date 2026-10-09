param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageAudio')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
 & $node scripts/audio-worker.mjs
 if ($LASTEXITCODE -ne 0) { throw 'Audio request needs review; existing assets preserved.' }
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
