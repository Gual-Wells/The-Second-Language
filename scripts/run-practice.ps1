# Keep UTF-8 BOM for Windows PowerShell 5.1 scheduled tasks.
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
if (Test-Path -LiteralPath (Join-Path $nodeBin 'node.exe')) { $env:PATH = "$nodeBin;$env:PATH" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw '未找到 Node.js' }
$mutex = New-Object System.Threading.Mutex($false, 'Local\TheSecondLanguagePractice')
if (-not $mutex.WaitOne(0)) { exit 0 }
try {
  $nextRaw = & node scripts/practice-job.mjs next
  if ($LASTEXITCODE -ne 0) { throw '读取表达练习队列失败' }
  $next = $nextRaw | ConvertFrom-Json
  if (-not $next.requestId -and -not $next.attemptId) { exit 0 }
  $logDirectory = Join-Path $projectRoot 'work/scheduler'
  New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
  $logFile = Join-Path $logDirectory "practice-$([DateTimeOffset]::Now.ToString('yyyyMMdd-HHmmss')).log"
  $codexCommand = Get-Command codex -ErrorAction SilentlyContinue
  if ($codexCommand) { $codexExecutable = $codexCommand.Source }
  else {
    $codexExecutable = Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'OpenAI/Codex/bin') -Filter codex.exe -Recurse -File |
      Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
  }
  if (-not $codexExecutable) { throw '未找到 Codex CLI' }
  $prompt = @"
执行第二语言项目的一次独立雅思表达练习工作。阅读 AGENTS.md、protocol/EXPRESSION.md 和 research/ielts-speaking-writing-questions.md，并先阅读 work/expression/ 中相同 ID 的已有材料，继续未完成任务。当前待建设申请 ID：$($next.requestId)；待批改答卷 ID：$($next.attemptId)。若有待建设申请，使用 node scripts/practice-job.mjs claim ID 领取，按固定来源摘要读取第一章至申请时全部章节清单；深入阅读焦点章及真实候选来源，反复发散、驳斥题目，保留工作文档，再写原创口语与写作题、隐藏参考答案和自然来源链接，最后用 publish 发布。若有待批改答卷，使用 review-claim 领取，独立分析后写简洁有帮助的反馈 JSON，再用 review-complete 提交。没有录音时，口语转写只可评价文字维度。不得修改日课、VIX 或临时页。若运行中断，写明具体续作步骤。
"@
  $ErrorActionPreference = 'Continue'
  try {
    & $codexExecutable -a never exec -C $projectRoot -m gpt-6-sol -c model_reasoning_effort=high -s danger-full-access $prompt 2>&1 |
      Out-File -LiteralPath $logFile -Append -Encoding utf8
    $exitCode = $LASTEXITCODE
  } finally { $ErrorActionPreference = 'Stop' }
  if ($exitCode -ne 0) { throw "Codex 表达练习运行失败：$exitCode；日志 $logFile" }
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
