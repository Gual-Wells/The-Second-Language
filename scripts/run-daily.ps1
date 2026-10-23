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
执行第二语言项目北京时间 $studyDate 的一次正式定时运行。先完整阅读本仓库 AGENTS.md、protocol/DAILY_RUN.md、protocol/RECOMMENDATION.md、protocol/CURRENT_AFFAIRS.md、protocol/QUALITY_WORKFLOW.md、protocol/CONTENT.md、protocol/ETYMOLOGY.md、protocol/TEMPORARY.md 和 protocol/ANNOTATIONS.md，按现行实事与 VIX 协同协议建设新章。旧章已经封存，不属于本次正式项目；不做旧章兼容、迁移、补修或历史选词恢复。新正式章节从第1章开始，按服务端现行新章序列取得章号，不用旧章数量或历史最大章号推算。

定时入口已先调用 scripts/claim-run.mjs；幂等读取 work/runs/$studyDate/control.json 确认结果。若已领取休息，立即结束；若本日已发布，回读确认后结束，不重复生产。否则先恢复本日期已有运行状态、输入和工作文档，再处理已领取的一次性临时需求及当天恰好40主词的正式课程。旧章不作为本次新章的迁移待办。

对于尚未固定选词的新运行，先执行 node scripts/prepare-vix.mjs $studyDate，读取固定的 vix-source.json、VIX候选和教材原输入，再执行 node scripts/current-affairs.mjs discover $studyDate。已有本日期材料时先恢复原快照，需要补充可按协议追加，不静默覆盖已读来源。discover 默认只查协议白名单的小组来源；实际材料不足时按需要扩大，不设置用户未要求的新闻条数、地区配比或请求配额，不每日全池爬取。逐篇运行 node scripts/current-affairs.mjs read $studyDate --source <sourceId> --url <officialArticleUrl> 取得要采用的材料，并实际打开返回的 textPath 阅读完整相关正文；命令成功、元数据、标题、搜索摘要或抓到网页不等于你已经读完。记录已读范围、原文出处、时间及限制，未读到正文不得编造事实。把现实材料与VIX、学习目标及反馈双向判断后确定40主词；不能先固定40词再找新闻装饰，不能以固定评分、词频榜、义项数或多义复杂度代替判断、降权或删义。

尚无 work/runs/$studyDate/feedback.json 时运行 node scripts/feedback-snapshot.mjs $studyDate 保存并实际读取学习目标与反馈；已有快照恢复使用，不以新反馈重选。用 node scripts/vix-candidates.mjs --vix=<vix-source.json的localDirectory> --out=work/runs/$studyDate/candidates.json 查看完整未标记候选及词表说明，按需要读取其候选范围而非只取前40个rank。ownerCollectionId只是优先级占有后的唯一归属；低阶owner仍可在原始高阶表中，sourceCollectionIds保留该关系。不能按owner桶或最高标签一刀切难度，须读取具体教材用法及实际需求。整体挑战在原基础上适度上调，以B2/C1的较广较精确理解与表达为参照，不因追求生活实用降低难度，也不靠堆冷僻词或长句充难。

冻结40词前，读完拟选主词与真实相关派生、交叉引用的完整Collins/Oxford内容，复用words文档明确全义及词族范围，不要求先写完三部分。选择的是完整词族教学范围，义项只参与判断选哪个词，选定后全部相关义项教授，不能只教新闻命中义或日常义。真实同族聚合，不把派生重复占主词名额，不用词形规则强合族。在selection.md简记近期能多理解/表达什么、已读现实材料实际如何影响候选或词族组合、为什么整体难度没有回落；不做每词评分/固定占比/新闻命中配额。第三部分创作时读取该意图，在article-plan.md设计现实问题、信息、行动或因果如何推进作品，用本章用法完成这种理解或表达。不能只做新闻开头与链接挂靠；发布前对照选择意图与实际全文独立审阅是否兑现，同时保持全义真用、事实边界和连续译文。判断留在既有工作文档，不放入公开来源包或新增第四部分。

如果本日期已有 selection.json 冻结或已标VIX，必须沿原组选词和原输入续作，不重抓热点、不重新推荐，也不把旧运行转换为新格式。本次偏好更新只影响尚未冻结的选择，不重置VIX或付费产物。prepare-vix 对合法原输入锁只做同commit恢复/校验，不刷新main；材料失效或事实需更正时按现行协议补充核实和修正文稿，保留原40主词、真实词族和全部义项，不用新材料覆盖原输入。标注原输入提交与标注后提交分别记录，标注数可以大于40。

冻结selection后运行 node scripts/prepare-vix-marking.mjs $studyDate，mark-vix与publish-vix均以 --vix=work/runs/$studyDate/vix-marking --selection=work/runs/$studyDate/selection.json 执行。原 .cache/vix/commit 输入只读；续作复用工作副本，不覆盖未提交标注。publish-vix落盘vix-publication.json并核对原提交，重复运行复用，回包未知先核对，不另造业务提交；meta.vixCommit读取已验证回执的vixCommit，不能只填任意合法SHA，不修改冻结selection。章节发布会要求本次回执与来源/选词一致，并回读正文和来源摘要。远端main确实变化且不含本次提交时停留原输入核对，不刷新或重选。

逐词保存双教材内容和全部相关例句的去向；第一、第二部分按自然词族协同建设；第三部分保留唯一权威草稿与简短连续性记录，发布前分别审阅教材保真、全义真用、事实与创作边界及连续译文。允许无目标用法句只有句子编码与译文，不附虚假USE。实事出处按现行协议留来源材料，不能把机构或倡议者自述冒充独立新闻定论。使用 work/ 中间文档续作，同日期不得重选或重复发布；未完成写具体 resume.md，不把文字完成或结构通过冒称语义审阅完成。所有工作按 protocol/BALANCES.md 在末尾核对各方额度并更新余额页；不实现额度不足后的自动跨日重试。按协议进行必要的GitHub与Cloudflare发布，不把临时页当正式章节，不修改卷轴或雅思通路，不泄露密钥。
"@
# Windows PowerShell 5.1 promotes native stderr to an error record. Codex may write
# nonfatal warnings there, so judge this command by its actual process exit code.
$ErrorActionPreference = 'Continue'
try {
  & $codexExecutable --search -a never exec -C $projectRoot -m gpt-6.1-sol -c model_reasoning_effort=xhigh -s danger-full-access $prompt 2>&1 |
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
