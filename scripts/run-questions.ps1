param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$codex = Get-Command codex -ErrorAction SilentlyContinue
if ($codex) { $env:SECOND_LANGUAGE_CODEX_EXECUTABLE = $codex.Source }
else { $env:SECOND_LANGUAGE_CODEX_EXECUTABLE = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/bin') -Filter codex.exe -Recurse -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName }
if (-not $env:SECOND_LANGUAGE_CODEX_EXECUTABLE) { throw '未找到 Codex CLI' }
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageQuestions')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
 & $node scripts/question-worker.mjs
 if ($LASTEXITCODE -ne 0) { throw '答疑任务未完成；已保存资料，可在页面重新处理。' }
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
