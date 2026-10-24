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
执行第二语言项目北京时间 $studyDate 的正式日课。先完整读取AGENTS.md、protocol/DAILY_RUN.md、protocol/RECOMMENDATION.md、protocol/CURRENT_AFFAIRS.md、protocol/QUALITY_WORKFLOW.md、protocol/QUALITY_SCALE.md、protocol/CONTENT.md、protocol/USAGE_LABELS.md、protocol/ETYMOLOGY.md、protocol/ANNOTATIONS.md、protocol/TEACHING_AUTHORING.md及领取到临时需求时的protocol/TEMPORARY.md。按实际输入和现行内容协议完成，不用上下文旧摘要替代。先恢复 work/runs/$studyDate 已有文件；未完成留具体resume.md，不因05:00开始生成就设发布截止。

定时入口已领取一次运行，幂等读取control.json；休息立即结束，本日已发布则回读确认后结束。旧章已经封存，不迁移、不补修、不用旧数量推算，按服务端现行新章序列取得章号。模型 gpt-6.1-sol/max，正式50主词；完整双教材、真实词族、所有义项和原例保持，难度适度上调且不按owner词表分桶。

新输入按 node scripts/prepare-vix.mjs $studyDate 固定；恢复反馈快照。用完整VIX候选与实际读取的现实材料双向选词，不能先取前50个rank。node scripts/current-affairs.mjs discover $studyDate 只是feed捷径；以 node scripts/current-affairs-pool.mjs find 检索完整来源池，结合live web补找有内容的真实文章。用current-affairs.mjs read或import固定读件，实际打开textPath通读相关原文；摘要、URL或工具成功不算读过。材料不足继续补读，不做全池爬取、来源配额或逐词新闻打分。科学、文化、社会、技术和人的真实处境都有内容价值；即用偏好在适合部分体现，不把整章写成核实/比较/风险的说教。

最终冻结前按TEACHING_AUTHORING以candidate-scope运行prepare-teaching-materials，逐词阅读完整Collins再Oxford；主词、各词族词形及明确引用独立补查，父条提到派生名不能算读完独立条目。确认全义与真实词族后按原协议冻结50词，再prepare-vix-marking/mark-vix/publish-vix，复用原副本和回执。已有冻结或标注必须原组原输入续作，不重抓热点来重新推荐，不重置VIX。

按TEACHING_AUTHORING复用不可变材料包，在teaching/authored逐词协同写完整第一、二部分、教材事实与全部相关原例去向。缺例由你针对该用法实际创作，禁止装配脚本自动抓第三部分句子补位。全义稳定后建设真实取材文章组，不设固定篇数/长度/体裁：词间及词内义项完全不按顺序，各篇按内容需要自由取用，整组真实覆盖所有用法。每篇隐藏USE后仍有充分现实内容和完整组织；不能将虚构中心切成展台或用孤立短句容纳剩余词。专业/历史/少见义补找适合的真实材料，不删义、不捏造采访或发生过的例子。

按QUALITY_SCALE将保质精简放进已有article-plan和语义审阅：自然共享背景，首稿装配时观察三部分总规模，清理重复解释/泛收尾；删改后复核目标义、对象、事实条件/归因、指代、译文和阅读密度。不限篇幅不是无限扩写，压成浓缩难句也不是减负。不设硬字数/减量率，不按USE数量惩罚多义词，不每天再造多份全文；保留有理解/叙事价值的较长段落。已有冻结选择、主词数、全义原例、来源与发布身份保持。

最终articles.json为唯一可装配终稿，ARTICLE身份与逐篇实际来源同源，SENTENCE全章唯一。node scripts/assemble-teaching.mjs $studyDate 输出候选；分别实际审阅教材原件与讲解/例句、每篇内容价值、全组逐义真用、事实和译文，记录实际纠错，不把材料记录和结构通过冒称语义审阅完成。采用候选后设置authoringPolicy=sourced-collection-v1，保留contentPolicy与sourcePolicy；source-notes采用导出的articles数组。按原pack-current-affairs、pack-chapter、publish-chapter发布并回读正文/来源摘要，之后才推送。固定选择、计费、休息、恢复保护按DAILY_RUN，不修改卷轴或雅思设计。按BALANCES末尾更新实际额度，不自动跨日重试，不泄露密钥。
"@
# Windows PowerShell 5.1 promotes native stderr to an error record. Codex may write
# nonfatal warnings there, so judge this command by its actual process exit code.
$ErrorActionPreference = 'Continue'
try {
  & $codexExecutable --search -a never exec -C $projectRoot -m gpt-6.1-sol -c model_reasoning_effort=max -s danger-full-access $prompt 2>&1 |
    Out-File -LiteralPath $logFile -Append -Encoding utf8
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
