# 每日课程运行协议

2026-10-27起尚未冻结的新运行执行AUTHENTIC_CONTEXT单正文。旧已冻结selection没有authoringPolicy或为sourced-collection-v1，沿原protocolCommit/作者稿继续旧合同，不静默升级、重选或重标。新默认由本文件、AUTHENTIC_CONTEXT、RECOMMENDATION、CONTENT、QUALITY_WORKFLOW、QUALITY_SCALE、ANNOTATIONS和TEACHING_AUTHORING共同执行；版本化提示词为daily-prompt.txt。

正式50推荐主词，gpt-6.1-sol/ultra，启用live search，每日北京时间05:00开始生成；没有保证发布截止。完整双教材、真词族、全义、标签/词源和总体不降难保持。默认休息、音频不生成，本次改造不自动触发新章。

## 领取与恢复

先按北京时间确定DATE，运行`node scripts/claim-run.mjs DATE`，恢复work/runs/DATE/control.json。休息即结束，不标VIX、不生产/发布日课或临时页；本日已发布回读确认后结束。日课关闭休息只放行下一次新领取，同次原子领取复位，重试同领取结果，rest_revision保护后来设置；不倒改已领取运行。Windows入口在启动模型前领取，休息不消耗模型调用。

新增工作/缓存/日志实际存D。当前定时任务应指向实际D工作区的run-daily.ps1；不热迁其他任务、不改全局USERPROFILE。安装、静默启动、备份和恢复见OPERATIONS/STORAGE。

若有temporaryRequest，按TEMPORARY独立处理；复习/测试不是正式章，不标VIX。正文格式按其固定来源和对应合同，不借本次升级重建旧试卷、成绩或已颁发卷轴。

## 推荐前输入

1. prepare-vix首次固定VIX、教材、词源输入；以后只读原commit，不刷新main。缺可核验输入锁保留待核，不重选。
2. feedback-snapshot首次固定实际目标/反馈以及protocol/learner-baseline.json和摘要。已有快照原样复用，后来的反馈不能重选已冻结范围。
3. 实际读取RECOMMENDATION及反馈。初始先验：阅读接受较强、熟悉事简单表达、陌生事难启动；一般阅读B2式试配，熟悉题B1式完整表达/B2式展开伸展。此为任务难度范围，不是个人已测等级或词汇量，具体认识词未知。区分构思、词义、搭配句法、声音提取与互动缺口，再决定新词能补什么。
4. 结合完整VIX未标注候选、真实材料与现有可表达资源，平衡表达覆盖面/深度/多样性/口语支撑。owner仅唯一占有归属，必须结合原始词表成员关系及实际教材内容；不以最高表标签、命中率、图密度、主题数、少义或冷僻打分。总体挑战不降，熟词进阶用法可有价值。
5. 按CURRENT_AFFAIRS按需取材，read/import后实际读相关原文，真实材料与候选双向启发；不先取前50再装饰新闻。共享只是自然关系中的普通情况，不主动搜索、合并、计划或考核共享，也不把同文出现当表达内聚。

## 全范围确定与VIX原时点标注

冻结前执行RECOMMENDATION的“择词质量边界与冻结前反证复核”：完整教学和原B2/C1实质挑战先保持，再优化互补与近期收益；B1口语起点/A2拆小/B2阅读支架不构成择词上限。实际检查起点变上限、取材便利、熟悉单主题和短小/表面难度偏置，按可得固定正式参照及真实候选内容判断，不凭比例或字段签发质量。selection.md只留真实取舍，发现问题局部修复后再冻结；不新增分数、逐词审计、固定反选量或无限检索。已冻结选择不因本补丁重选/重标。

冻结前按TEACHING_AUTHORING以candidate-scope准备不可变材料，逐主词/真实派生/必要引用独立查两书，先完整Collins后Oxford。父条提名不算读派生条目，缺标题继续查拆行/同名组/引用。全义/真实词族范围读清后，在selection.md写实际取舍；selection.json一次冻结studyDate、vixInputCommit、vixMarkLabel、authoringPolicy:authentic-context-v1、恰50个mainWords及实际family。每有VIX身份的成员留entryId/globalRank/text，无身份派生不造标注；选择完整范围，不是原文命中义子集。

vixMarkLabel为真实YY-MM-DD，由studyDate.slice(2)取得。冻结后prepare-vix-marking建立独立副本，再用同副本mark-vix和publish-vix。原缓存只读；副本绑定原输入与selection摘要，成功或回包丢失先找同一回执/commit，不重复写，不向冻结selection后加策略字段。meta.vixCommit取本次核实回执。时间/标签/输入不符停在原物核对，不重抓main或重选。

## 逐义制作

主词字典序，词源集中主词层，双教材按真实词性、对象、结构、语域融合，全部独有教学事实保留。每个真正用法独立USE，旧ID多个真实分支在新章按语义区分，不按“或”字机械切。标签/音标/限制准确，原例全部可追索并进入候选判断，但不默认把全部旧原例显示在正文。

按AUTHENTIC_CONTEXT逐义寻找实际使用目标义的材料；优先高质保真缩编，必要短摘，缺合适真实候选则独立教学例句并有具体原因。只保目标所需局部，不要求读者理解全文；保事实、否定/例外/时态/指代及原交流功能，不统一改成知识摘要、捏造故事或植入目标词后冒称原用法。

每用法最终1–5份；3仅在各份有充分独立增量时较理想，不设最低三份。不强凑候选类型/数目，多份各有不可替代搭配/对象/语域/交际收益，否则单份取优。共享可自然出现但不主动追求；已经自然选中同段时复用稳定contextId并在每义旁放引用，不重复造文。

逐词作者稿只有partOne、contexts、contextChoices及教材/原例去向，新输入锁teachingLayoutVersion:2对应逐词layoutVersion:2；新输入锁及作者稿另写quickGlossVersion:1。按CONTENT逐词形标音标及词性，最后一个词性后附逐义编写的快释，语境前一次完成全部融合解释，唯一CONTEXT_SLOT位于每USE末尾，不再例后补讲。英文保自然段、完整句唯一SENTENCE ID，只标实际目标义；每份语境写一个整块连贯译文，不逐句翻译。译文固定位置、默认马赛克、点击显隐按账户/正文digest/context持久，正文无提示文字或逐份来源／教学例句附层。格式精确见ANNOTATIONS；成品不显示内部审核过程。

## 审阅、装配、发布

按QUALITY_WORKFLOW实际审阅教材全义及原例去向、每份所选目标义/句法语域、来源事实与原话语功能、多份的独立增量、英文自然度与整块译文。必要定点返修、重择候选；不把结构/字段通过当语义或学习收益证明，不重复整章竞赛、不设逐义字数或共享率目标。

assemble-teaching输出同源chapter.md及context-sources.json，采用前实际审阅，正式正文须逐字匹配作者稿装配。meta保留contentPolicy:etymology-fused-v1和sourcePolicy:current-affairs-v1，设置authoringPolicy:authentic-context-v1。source-notes采用contexts数组和实际读件/关键事实/边界，逐采用来源核对用途。

pack-current-affairs→pack-chapter→publish-chapter沿原封存通路，正文与来源分别摘要，OneDrive回读通过再提交/推送；D1存轻量引用，不放新闻全文。旧版本重放不得覆盖新当前指针，同版本重发不刷新发布时间；修订显式新正文/来源，原件和历史绑定保留。新章不放空三PART/ARTICLE壳骗校验。

章号由服务端新正式序列确认；旧流程封存，不从历史数量推算新章。音频默认空；新格式仅contexts选配、只完整英文句可点读，旧two/three不自动转新付费授权。首次发布按同格式一次性设置原子消费并复位，休息/重发不消费；已成功缓存/收费原件/未知计费保护保持。文字发布不等待音频。雅思、答疑、质检、章节测试、首次认证和卷轴继续各自固定全文与独立生命周期，不造通过、不改艺术品。

中断具体记录resume，保同输入/选择/原读件/已审词族，只续缺项。额度、网络或云盘失败不宣称完成，不重新推荐标注或无授权跨日收费重试；按BALANCES任务末尾核实各方额度与容量，不自动付款。05:00只为开始时间，不因工作未完而虚报发布。

### 明确撤回已领取的休息

休息领取后再关闭设置不等于本次运行恢复；它只放行下一次新领取日期。只有用户明确撤回该日期的休息，运维才可在run_rest_overrides写入与原claimed_at绑定的不可变授权及理由；原run_claims行保留。领取和发布暂存共同读取同一有效状态；不能只改本机control.json或清空原休息记录。恢复只作用于指定运行，不消费后来为其他日期设置的安排。2026-10-24原休息的明确撤回仍是该日期专用历史授权，不代表以后默认开工。

### 用户明确撤回整章并要求重新生产

常规定时任务不得自行撤章或重选。2026-10-24用户明确要求撤回当日第一章、对应VIX记录、恢复序列并手动触发一次发布，这是该次冻结保护的授权例外。原件、来源绑定、收费结果与未知计费状态保留；chapter_withdrawals保存原digest、选词摘要、标注commit和撤回前紧凑状态。formal_chapter_sources排除已撤回版本，正式目录、章号、后台新处理及认证资格共同采用此作用域。原版本暂存／提交及原运行摘要重放均被拒绝，不能靠重新提交旧产物恢复。

运维核对当前指针与原运行后，先保存可恢复副本，再撤去该指针及daily_runs当前锁；保留run_claims与已有有效休息撤回授权，不消费后续休息设置。只对该章实际标注身份作VIX前向撤销提交，不改Git历史或其他章标记。原chapters/<date>移至chapters/withdrawn/<date>-<digest前8位>，原work/runs/<date>移至D盘work/withdrawn相同身份目录；该目录不是续作输入或正式章节。确认目录为空、下一章号为1、VIX撤标已回读后才唤醒正式DailyCodex。新运行在原日期重新固定当前VIX输入与选词；后续中断照常冻结续作，不因此获得无限重选权。正式发布与后台音频仍走原通路。
