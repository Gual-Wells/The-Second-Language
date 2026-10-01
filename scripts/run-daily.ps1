$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
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
$prompt = @"
执行第二语言项目北京时间 $studyDate 的一次正式定时运行。先阅读本仓库 AGENTS.md、protocol/DAILY_RUN.md 和 protocol/TEMPORARY.md 和 protocol/ANNOTATIONS.md，严格先执行 scripts/claim-run.mjs。若领取到休息标志，立即跳过当天日课和临时推送，保存结果后结束。否则优先处理已领取的一次性临时推送需求，再继续当天恰好 40 主词的正式课程。使用本仓库 work/ 中的中间文档续作；同日期不得重选已确定的词或重复发布。若工作未完成，记录具体 resume.md。按协议进行必要的 GitHub 与 Cloudflare 发布，不把临时页当正式章节，不泄露密钥。
"@
# Windows PowerShell 5.1 promotes native stderr to an error record. Codex may write
# nonfatal warnings there, so judge this command by its actual process exit code.
$ErrorActionPreference = 'Continue'
try {
  & $codexExecutable -a never exec -C $projectRoot -m gpt-6-sol -c model_reasoning_effort=high -s danger-full-access $prompt 2>&1 |
    Out-File -LiteralPath $logFile -Append -Encoding utf8
  $codexExitCode = $LASTEXITCODE
} finally {
  $ErrorActionPreference = 'Stop'
}
if ($codexExitCode -ne 0) { throw "Codex 运行失败：退出码 $codexExitCode；日志 $logFile" }
