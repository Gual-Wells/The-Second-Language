param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$dailyMutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguageDaily')
if (-not $dailyMutex.WaitOne(0)) { $dailyMutex.Dispose(); exit 0 }
try {
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
$runtimeTemp = Join-Path $projectRoot '.cache/runtime-temp'
New-Item -ItemType Directory -Force -Path $runtimeTemp | Out-Null
$env:TEMP = $runtimeTemp
$env:TMP = $runtimeTemp
$env:WRANGLER_LOG_PATH = Join-Path $projectRoot '.cache/wrangler-logs'
if ($CredentialFile) { $env:SECOND_LANGUAGE_CREDENTIAL_FILE = (Resolve-Path -LiteralPath $CredentialFile).Path }
$nodeBin = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin'
if (Test-Path -LiteralPath (Join-Path $nodeBin 'node.exe')) {
  $env:PATH = "$nodeBin;$env:PATH"
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw '未找到 Node.js，无法执行日课领取脚本' }
$beijing = [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::UtcNow, 'China Standard Time')
$studyDate = $beijing.ToString('yyyy-MM-dd')
$logDirectory = Join-Path $projectRoot 'work/scheduler'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$logFile = Join-Path $logDirectory "$studyDate.log"
"[$([DateTimeOffset]::Now.ToString('o'))] starting $studyDate" | Out-File -LiteralPath $logFile -Append -Encoding utf8
# Claim before starting the model so a rest day can finish even when Codex is unavailable.
$ErrorActionPreference = 'Continue'
try {
  & node scripts/claim-run.mjs $studyDate 2>&1 | Out-File -LiteralPath $logFile -Append -Encoding utf8
  $claimExitCode = $LASTEXITCODE
} finally {
  $ErrorActionPreference = 'Stop'
}
if ($claimExitCode -ne 0) { throw "领取每日运行失败：退出码 $claimExitCode；日志 $logFile" }
$controlFile = Join-Path $projectRoot "work/runs/$studyDate/control.json"
$control = Get-Content -LiteralPath $controlFile -Raw -Encoding utf8 | ConvertFrom-Json
if ($control.rest) {
  "[$([DateTimeOffset]::Now.ToString('o'))] rest claimed; skipping Codex" | Out-File -LiteralPath $logFile -Append -Encoding utf8
  exit 0
}
$codexCommand = Get-Command codex -ErrorAction SilentlyContinue
if ($codexCommand) { $codexExecutable = $codexCommand.Source }
else {
  $codexExecutable = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/bin') -Filter codex.exe -Recurse -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $codexExecutable) { throw '未找到 Codex CLI' }
$modeText = & node scripts/daily-pipeline.mjs mode $studyDate
if ($LASTEXITCODE -ne 0) { throw '日课分工检查失败；保留原领取，不启动模型' }
$mode = ($modeText | ConvertFrom-Json).mode
if ($mode -eq 'rest') { exit 0 }
# Existing authored/legacy/temporary runs retain their original recovery path.
if ($mode -eq 'legacy') {
  $preparedText = & node scripts/digr-project.mjs daily $studyDate
  if ($LASTEXITCODE -ne 0) { throw 'DIGR项目材料准备失败；保留原领取，不启动模型' }
  $prepared = $preparedText | ConvertFrom-Json
  if ($prepared.skipped) { exit 0 }
  $prompt = [System.IO.File]::ReadAllText($prepared.prompt, [System.Text.Encoding]::UTF8)
}
# Windows PowerShell 5.1 promotes native stderr to an error record. Codex may write
# nonfatal warnings there, so judge this command by its actual process exit code.
$ErrorActionPreference = 'Continue'
try {
  if ($mode -eq 'pipeline') {
    & node scripts/run-daily-pipeline.mjs $studyDate --codex $codexExecutable 2>&1 |
      Out-File -LiteralPath $logFile -Append -Encoding utf8
  } else {
    & $codexExecutable --search -a never exec -C $projectRoot -m gpt-6.1-sol -c model_reasoning_effort=high -c agents.enabled=true -c agents.default_subagent_reasoning_effort=high --enable multi_agent -s danger-full-access $prompt 2>&1 |
      Out-File -LiteralPath $logFile -Append -Encoding utf8
  }
  $codexExitCode = $LASTEXITCODE
} finally {
  $ErrorActionPreference = 'Stop'
}
try {
  & node scripts/check-balances.mjs 2>&1 | Out-File -LiteralPath $logFile -Append -Encoding utf8
} catch {
  '任务已结束，额度核对暂不可用，请查看余额页的核实状态。' | Out-File -LiteralPath $logFile -Append -Encoding utf8
}
if ($codexExitCode -ne 0) { throw "Codex 运行失败：退出码 $codexExitCode；日志 $logFile" }
} finally { $dailyMutex.ReleaseMutex(); $dailyMutex.Dispose() }
