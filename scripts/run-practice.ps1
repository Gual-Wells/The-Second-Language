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
  if (-not $next.requestId -and -not $next.attemptId -and -not $next.listeningAttemptId -and -not $next.readingAttemptId -and -not $next.speakingPrepareId -and -not $next.speakingAttemptId -and -not $next.speakingAttentionId) { exit 0 }
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
执行第二语言项目的一次独立雅思练习工作。阅读 AGENTS.md、protocol/EXPRESSION.md；听力工作同时读 protocol/LISTENING.md，阅读读 protocol/READING.md，原声读 protocol/SPEAKING_PIPELINE.md 及 protocol/SPEAKING_RUNTIME.md，口语写作读 research/ielts-speaking-writing-questions.md。先回读 work/expression 中相同 ID 材料，继续未完成任务。当前待建设申请 ID：$($next.requestId)；文字答卷 ID：$($next.attemptId)；听力答卷 ID：$($next.listeningAttemptId)；阅读答卷 ID：$($next.readingAttemptId)；原声待转换 ID：$($next.speakingPrepareId)；原声待分析 ID：$($next.speakingAttemptId)；原声待核对 ID：$($next.speakingAttentionId)。先用 node scripts/practice-job.mjs next 确认当前队列。申请用 claim ID 领取，仅建设 skills 选择的组件，听力与阅读各按 profiles 的 full/mini 建设，format=ielts-v2，profiles 必须原样交接；微缩二十四题、全部题型、平均及以上难度，完整四十题按真实雅思规格，按听力、阅读、写作、口语排序，读取第一章至申请时固定来源；自然题目优先，焦点章显著偏好但不机械植词。保留候选题驳斥、权威文稿、隐藏示范及续作材料。声音读取 protocol/VOICE_ROUTING.md：所有非听力场景固定 Kokoro Bella；听力先按整份脚本为人物均衡随机分配授权音色，使用 practice-audio.mjs cast 冻结，同一人固定，同场不同人可辨认，男女角色按雅思情境不为均衡而改变，不采用已否决的调音。听力按 LISTENING.md 和题量规格生成四段题组、译文、答案证据与实际音频；用 practice-audio.mjs 走 Cloudflare 生成、拼接计时、转写复核及私有上传。口语三个 Part，考官音频及可见 Part 2 卡片；写作两个 Task 与可核对数据表。阅读须三篇完整文章和相应四十/二十四题，全文、译文、题面、允许答案和原文证据闭合。所选组件全部审阅完成后 publish 原子发布。原声 preparing 用 node scripts/speaking-practice.mjs prepare ID 转换原文件、不裁剪或修复话语，后台自动多路采集；ready 用 speaking-practice.mjs claim 保真回收全部请求/返回与原声，Codex 深度核对后 complete。needs_attention 用 speaking-practice.mjs inspect ID 读取私有 manifest 核对故障和可用证据，不能重付未知结果；需要细节时可经 details 添加 Qwen 补听，腾讯按真实已确认原话使用已有本机 adapter。参考 SPEAKING_RUNTIME.md。文字答卷用 review-claim 与 review-complete；听力用 listening-claim 与 listening-complete，阅读用 reading-claim 与 reading-complete，原始判题与实际播放条件保真接管，不换算未经校准的 IELTS 分数。没有录音时口语转写只评价文字维度。OpenRouter 余额不足保留已有音频和返回，声音任务挂起到北京次日确认充值后续作，禁止重复付费重做、禁止发布缺音频的整套练习，其他可独立完成任务继续。不得修改日课、VIX、临时页。中断时写清具体下一步。
"@
  $ErrorActionPreference = 'Continue'
  try {
    & $codexExecutable -a never exec -C $projectRoot -m gpt-6-sol -c model_reasoning_effort=high -s danger-full-access $prompt 2>&1 |
      Out-File -LiteralPath $logFile -Append -Encoding utf8
    $exitCode = $LASTEXITCODE
  } finally { $ErrorActionPreference = 'Stop' }
  if ($exitCode -ne 0) { throw "Codex 表达练习运行失败：$exitCode；日志 $logFile" }
} finally { $mutex.ReleaseMutex(); $mutex.Dispose() }
