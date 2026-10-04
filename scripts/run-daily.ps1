param([string]$CredentialFile)
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
$OutputEncoding = $utf8
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
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
$prompt = @"
执行第二语言项目北京时间 $studyDate 的一次正式定时运行。先阅读本仓库 AGENTS.md、protocol/DAILY_RUN.md、protocol/QUALITY_WORKFLOW.md、protocol/CONTENT.md、protocol/TEMPORARY.md 和 protocol/ANNOTATIONS.md。定时入口已先调用 scripts/claim-run.mjs；幂等读取 work/runs/$studyDate/control.json 确认结果。若已领取休息，立即结束。否则优先处理已领取的一次性临时需求，再继续当天恰好 40 主词的正式课程。逐词保存双教材内容和全部相关例句的去向；第一、第二部分按自然词族协同建设；第三部分保留权威草稿与简短连续性记录，发布前分别审阅教材保真和文章真实用法。允许无目标用法句只有句子编码与译文，不附虚假 USE。使用 work/ 中间文档续作，同日期不得重选或重复发布。若未完成，写具体 resume.md。按协议进行必要的 GitHub 与 Cloudflare 发布，不把临时页当正式章节，不泄露密钥。
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
