# 第二语言：项目状态与专家认识交接

> 用途：让一个未读旧对话的 Agent B，凭本文件和仓库恢复判断能力；也为下一项目保留可迁移经验。不是聊天摘录、功能任务单或新一轮重构授权。用户已宣布当前建设封顶，本次只制作交接。

## SNAPSHOT — 创建本文件之前的真实基线

| 项目 | 核对结果 |
| --- | --- |
| 生成日期 / 时区 | 2026-10-07，Asia/Shanghai；基线核对至北京时间 00:13:22 |
| Repository | `Gual-Wells/The-Second-Language`，origin `https://github.com/Gual-Wells/The-Second-Language.git` |
| 实际工作树 | `C:\Users\huawei\Documents\Codex\2026-09-30\github-vix\work\ielts-expression` |
| 对话环境的 cwd | `C:\Users\huawei\Documents\ChatGPT\第二语言`，当前仅有 `.git`，**不是实际项目源码目录** |
| 基准本地 branch / HEAD | `codex/chapter-library-2026-10-06` / `755087c8dafceb194eab6cd7f685ba2ed8d98806` |
| GitHub main | `6ba1e235362b402c43bc77ab4db912590af67e1d`；本轮直接 GitHub ref API 与 branch API 一致 |
| 两者 tree | 同为 `cbf4d7bbf6cc2c71b1ca4137c28f6f9b17760d9e`；SHA 差异来自 PR 合并，源码无差异 |
| 创建交接前 working tree | dirty；**无 tracked 修改**，只有下述四个 untracked 目录 |
| 产品阶段 | 单用户工程骨架、存储、答疑与 iPhone 界面已建设并发布；转入实际使用。不是多人 SaaS，不是 IELTS 官方认证系统 |
| 正式站 | `https://the-second-language.pages.dev/`；本轮 GET `sw.js` 确认 `second-language-shell-v23` |

基线 untracked 目录必须保留：

1. `chapters/2026-10-06/`：真实第二章，含 `chapter.md`、`meta.json`、`chapter.json`；本轮生产读取确认已发布。它没有进入本地 Git 提交，**不等于没有上线或可以删掉**。
2. `research/iphone-17-aesthetics-2026-10-06/`。
3. `research/iphone-17-design-2026-10-06/`。
4. `research/iphone-17-pages-2026-10-06/`。

后三者是本机研究、原型与截图，其中包含被否决设计和合成界面数据；不作为当前产品权威，不自动全部提交。`work/`、`.cache/` 中还有被忽略的教材缓存、续作文档、原声、答卷、恢复材料及凭据；Git clean 不能证明这些不存在。创建本文件后的 dirty 状态请重新检查，不把交接文件当作交接前遗漏。

### 可信度约定

- **VERIFIED**：本轮源码、Git、测试或在线只读实际核对。
- **USER-DECISION**：用户明确决定；实现程度另述。
- **HISTORICAL**：此前实验或发布记录，本轮不重复花钱验证。
- **WORKING-HYPOTHESIS**：规划或解释，尚未充分测量。
- **UNKNOWN**：不能可靠确定。

本文件保存结论、理由、事实和可验证入口，不保存隐藏思维链、私密回答或任何凭据。冲突时优先核对生效代码与当前用户要求；旧 research 不能覆盖后续已验证实现。

## PROJECT MISSION

第二语言是用户自己的英语学习平台：把权威词典、VIX 词汇索引、Codex 内容建设、PWA 阅读和反馈关联起来，形成可独立学习的长期资产。重点是词义和用法完整、例句可理解、文章能内化表达，之后通过真实雅思形式练习听读写说。AI 负责语义判断与教学，脚本负责确定性传输、结构校验、索引、状态和发布。

日常正文始终只有三部分：词汇与用法、例句与翻译、任意文。第四部分是独立按申请建设的雅思练习册，不嵌进当天 Markdown。章节答疑围绕固定整章及会话提供中文解释，不改变选词或题库。永久资料可回看、复用与恢复；临时测试/复习页有生命周期。

当前具体目标已经完成：闭环修复、个人永久存储、安静后台服务、iPhone 全页面交互升级、章节显示单位及章节册。当前任务是迁移知识；下一项目的需求尚未给出，B 不应自行安排新功能、强制教学改革或大重构。

## USER INTENT AND HARD CONSTRAINTS

### 用户已经确定，不能以“优化”之名改掉

- **单人、iPhone 17 标准版优先**。本轮没有桌面设计要求。保持原 2008 蓝灰、高光、边框、分段控件的美学；功能承载不构成变丑的理由，视觉与真实操作体验是验收对象。不要把 Agent 的过程提示词、内部字段或运维细节塞进页面。
- **日课显示以“章”为单位**。历史 `number` 的“课”仅在显示层转换，不能为了文字统一重写正文、摘要或历史元数据。内部工作流仍可叫日课，新章 `number` 用“第 N 章”。
- **40 个主词、完整双教材内容、全部相关例句、真实义项覆盖**。不得缩成单词小卡、只取常用义或“至少一例”即结束；派生词不占 40 主词配额。第三部分不预设体裁、长度或场景数，不为工程便利缩删难用义项。
- **VIX 推荐仍是带倾向的候选判断**，不是人为主题选材或固定模型评分替代。辅助索引去重、未标注候选、真实 `YY-MM-DD` 日期标注、实际纳入的派生/变体一并标记。反馈可影响判断，不擅自换成审计建议的强制学习者模型。
- **雅思申请只有完整 / 微缩两种四科全流程**：听力→阅读→写作→口语；不能恢复按科勾选、混合规格或专项训练。微缩保留全部题型呈现形式，排除通常难度分布下段；完整卷按真实 IELTS 的自然结构与难度建设。
- **雅思来源资格是第一章至申请时最新已发布章**，焦点章注意力显著优先；真实题目形式优先于本章词汇命中，本章不适合可使用旧章。不得为上下文减负把历史资格暗改成最近 N 章。
- **参考答案是隐藏的约 7.5 方向示范**，不是唯一答案或苛责模板。口语必须用原声依据，正常口音、弱读与犹豫不能机械判错，文字不能证明发音，不能虚构官方成绩。
- **最终声音政策**：非听力一律 Kokoro Bella；听力使用既定九女/五男池训练差异性，同人同声、尊重人物与性别，按台词量均衡。不是每句随机选声。
- **全部有业务价值的永久资料保存**：正式章及版本、点读/练习音频、参考、答卷、原声、真实模型返回、反馈和工作文稿。临时页 48 小时清理；缓存与登录凭据不是永久学习原件。不能用“永久保存”要求每个可重建缓存或每次空轮询日志都永久复制。
- **已有收费产物复用**。换数据库、缓存过期、失联、升级前端不能成为再收费生成的理由。结果未知时保留并核对，不靠新任务 ID 绕过保护。
- **预下载默认开启，只一个开关**。打开章先读正文/索引，再按章下载已有音频包；关闭则按需读取。不做邻近词预测、不细粒度滚动计算、不自动合成整章点读。
- **额度末尾查询、产品读上次记录**。按用户申请的完整学习流程估算，不按 Agent 的“一次操作”；各池使用各自单位，严格低于三倍最大流程上端才告警。Whisper 只管理每日免费额度，不设计充值。取消缺钱次日/每小时自动恢复，充值后还须用户明确续作。
- **用户休息安排不能替他改**。一次性休息只影响下一次日课定时运行；雅思/答疑有独立通路，不能因为休息一章就停所有服务。

### 协作和资源选择

**USER-DECISION**：用户对已委托目标授予调查、安装、配置、修复、验证、提交、GitHub 发布和部署的持续授权，偏好自主完成＋简明告知，而非每个命令重复确认。重要方向变更、真实平台拒绝和新增持续成本必须说明；不把授权扩大到任意新项目、购买付款、代发消息或不可恢复大删除。真实审批/平台限制仍有效。

用户偏好可靠国际品牌；早期希望长期存储零账单，后来因独立于本项目的产品价值接受 Microsoft 365 家庭版个人 OneDrive 订阅。不能将这次接受外推成愿意无限增购云服务。新资源同时验证可用支付、价格、质量及项目兼容，优先“标准合格后的性价比”，普通发音不奖励高成本边际提升。

**HISTORICAL / USER-DECISION**：可用支付包括微信、支付宝、银联储蓄卡、Apple 礼品卡；中行万事达曾讨论，但当前卡是否已开/可绑未核实。OpenRouter 银联卡添加失败，后来用户发现一次性微信/支付宝充值并成功继续真实调用；不要把订阅绑卡能力和一次性充值混为一谈。Azure/直连国际账户、学生通道尚未配置成生产依赖，学籍不自动等于服务额度。当前既有资源足够，B 不需要重跑开户研究。

用户允许独立判断、推翻其非专业技术设想；外部报告只能提供问题和线索。最终以现有产品行为、实测和用户目标为准，不以报告作者等级或审计评分代替事实。

## CURRENT SYSTEM MODEL

### 1. 组件与责任

```text
iPhone PWA / 原生 HTML CSS JS
    ↓ 同源请求、通行密钥及 session
Cloudflare Pages 网关（API service binding）
    ↓
主 Worker the-second-language-api
    ├─ DB：认证、设置、章节版本/指针、阅读、答疑、余额、存储关系
    ├─ PRACTICE_DB：练习册、题目、答卷、采集队列、点读成功索引
    ├─ CHAPTERS / PRACTICE_MEDIA KV：近期正文与故障兼容副本
    ├─ Workers AI Whisper；OpenRouter 推理和共享钱包
    └─ Microsoft Graph → 个人 OneDrive 应用目录（永久文件）

Windows 日课 / 雅思 / 答疑任务 → 既有 Codex CLI 登录 → 教学与内容判断
Windows 独立归档任务 → 普通脚本 → 补归档、音频包、恢复快照
```

两份 D1 是独立业务库，**并非账户免费用量隔离**。Graph 是文件 API，不是 SQL 数据库或公共 CDN。本机 Codex 与普通轮询分开；电脑离线不消灭云端已有资产，但新教学工作必须等机器、会话、网络和 CLI 登录恢复。空队列不启动 Codex，仍有网络/Cloudflare 用量。

### 2. 日课与版本

`run-daily.ps1` 在模型前领取 `claim-run.mjs`，同日幂等且一次消耗设置。休息直接退出；不休息才启动内容流程。选词完整确定→VIX 标注/提交→同日逐词建设→第一/二部分协同→第三部分权威草稿与续作→两次语义审阅→pack→暂存/提交→线上回读→推送。

工作身份是目标日期、VIX 输入/标注提交、协议提交和最终正文 SHA-256；章节修订产生新 digest，过去正文、答疑和练习固定来源继续可读。VIX 已标注后中断必须继续同一组，不重复推荐。旧暂存版本重发不能倒退当前指针，当前版本重发不能改发布时间。

`WORD`、`USE`、`SENTENCE` 是正文隐藏结构身份：一个词形出现不是义项覆盖证据。第二部分 `EXAMPLE:U…` 当前只是用法引用，可重复；独立例句 E 编码仍是未来预留，未联合更新打包器、阅读器和复习提取前不能启用新语法。

### 3. 雅思、作答与教学闭环

申请固定 `ielts-bundle-v1`；产物 `ielts-v2`。申请持久保存全部已发布章的 ID/date/digest 和焦点身份，不是复制所有章节全文。Codex 看完整清单，焦点章和主题入围旧章回读正文；选题仍以自然 IELTS 任务为先。日课不因此变成“出题选材系统”。

试卷 publish 校验四科、题量/题型、证据、媒体和申请身份，不能发布缺声音组件的整套卷。参考答案在未揭示时不下发，Part 1/3 题文默认为音频、主动查看记录条件；Part 2 题卡保持可见。听读保留 session、计时、辅助条件和答案证据，写作/文字补充形成不可变 attempt，原声形成独立 speaking attempt；重答新身份，旧卷不跟新范文静默重评。

原声：主动录制/上传→私有原件→本机 ffmpeg 只转换完整 PCM16/16kHz/单声道 WAV→云端固定四路逐轮采集→完整 raw/parsed/metadata/request→本机 Codex 接管→持久反馈/PWA。当前状态为 preparing、collecting、waiting_credit、ready、reviewing、reviewed、needs_attention；采集 job 自有状态，不要混同答卷状态。

### 4. 章节答疑

当前章 digest＋整章全文＋完整会话直接提供给只读教学进程，无需设计选句/选词范围工具。按同章提交顺序领取、续租和幂等回推，未读序号驱动红点。`question-worker.mjs` 用隔离目录、`--ignore-user-config`、只读 sandbox、`openai_qa` HTTPS provider、输出 schema；教材/问题中的指令视作资料，不交给工具执行。个人全访问配置不取消这个专用进程隔离。

### 5. 存储的真实边界

OneDrive 应用目录是永久文件基座，仅 `Files.ReadWrite.AppFolder + offline_access`；后端刷新凭据 AES-GCM 存 D1，密钥是 Worker secret；本机副本 DPAPI 当前 Windows 用户加密。不得把预授权下载 URL、Graph token 或发布身份给浏览器。

成功点读以 `pronunciation_results` 整数 ID＋三个完整 32 字节摘要保存生成身份、音频内容和原始请求/返回记录；内容直接摘要寻址，避免每片段重复三份 storage 登记。`chapter_audio_scopes` 每章版本一次，`chapter_audio_clips(scope_id,result_id)` 关联。成功结果/关联不可修改删除；新策略是新身份。待生成、失败、未知结果仍在状态表；永久写失败保留应急音频，migrate 只补存，不能重合成。

**已实施的压缩/紧凑化有明确范围**：没有把所有试卷、参考答案、文字答卷和消息全文都移出 SQL。当前 D1 仍保留必要关系及这类业务内容；OneDrive 有其永久快照/大文件，不等于线上 SQL 副本已经轮换。不能承诺 D1 全业务增长已经数学有界。

归档不是每次分析同步扫描全历史：收尾排队→独立普通任务 migrate→只为新增章关联 packs（8 MiB 包）→backup。永久数据按 rowid 索引游标、固定最大 rowid 分页；大追加表用不可变检查点＋新增页，其余小表完整快照。数据页 gzip、工作材料按任务组压缩分块、摘要去重。恢复清单在本机重建库、外键/完整性与字节验证后才发布；检查点在独立索引发布后推进。恢复索引 `recovery-index.json` 在 OneDrive，`storage-restore.mjs --direct` 不依赖生产 D1 或 publisher。

## CURRENT IMPLEMENTATION STATE

### 本轮可验证的状态

截至北京时间 2026-10-07 00:11–00:13 的只读快照：

| 事项 | 实际情况 |
| --- | --- |
| 已发布章节 | 两章：2026-10-02（第 1 课原件）、2026-10-06（第 2 课原件）；v23 均显示“章” |
| 章节版本 / 当前指针 | 两份 revision、两份 published_chapters；未在本次另生成章 |
| 正式雅思库 | practice_requests / practice_sets / practice_attempts / speaking_attempts 均 0 |
| 点读 | pronunciation_results 7 份；不是 7 种音色，也不是全部词库已生成 |
| 待补存 / 待章音频包 | storage_pending=0，chapter_audio_work=0；仅代表查询时刻 |
| 已应用迁移 | DB 0001–0008；PRACTICE_DB 0001–0008，含紧凑结果与章关联 |
| D1 实际物理空间 | DB 716800 bytes；PRACTICE_DB 335872 bytes，来源查询 meta.size_after；不是容量预测 |
| OneDrive | active=true、personal、normal；quota.total=1104880336896 bytes，约 1 TB |
| 容量读数局限 | Graph used=1255767 bytes，但登记文件 bytes 总计 59649733（436 份登记）；明显不同，不拿 delayed quota 当当前精确占用，也不把旧登记当全文件总量 |
| 本机最新完成恢复清单 | createdAt=2026-10-06T10:15:11.438Z、version=2、directResources=true、34 份结构/数据页条目；不是 34 个独立快照 |
| 四个 Windows 任务 | Daily / Practice / ChapterQuestions / PermanentArchive 均 Ready，最近退出码 0；全部指向无控制台 BackgroundTask 程序 |

**VERIFIED 工程**：日课/休息/临时控制、章节版本发布、完整/微缩四科接口、听读计分与批改队列、文字重试身份、原声揭示顺序、四路保真采集代码、点读永久复用/Range、答疑队列、OneDrive 读取/归档/恢复入口、额度记录、前端分层和 v23 章节册。

本轮最小健康检查通过：`check-publishing-closure`、`check-practice-closure`、`check-chapter-questions`、`check-compact-pronunciation`、`check-storage-read`、`check-storage-scan`（3 项）、`check-reader-ui`（真实 40 词章、69 项，无 JS 错误）。这些是隔离 SQLite/API/浏览器模拟，不生成正式材料、不调用付费模型。

**HISTORICAL 已实际验证**：真实模型采集与声音试听、真实答疑分析回推、Bella 资产 Graph 往返/206/包复用、普通恢复及仅 Microsoft 授权的直接恢复。证据见下方地图。此前直接恢复重建 main 1208 行、practice 11 行、1338 份工作材料，不是当前实时行数；本轮没有再做整库恢复或重复付费音频测试。

**未充分验证**：整套正式 IELTS 原创内容→长听力→全部答卷→多路原声→最终教学反馈的真实账单与质量；目前正式库没有试卷。iPhone Safari 真机键盘/后台/录音中断及最终 v23 触摸体验未以模拟替代；长期 retention、难度统计、长期 token 刷新和大规模 Graph 节流也未凭小样本宣称验收。

最后三次稳定工程节点：PR #9 闭环修复；PR #10 iPhone 交互/README（v22）；PR #11 章节册与“章”显示（v23）。报告 `closed-loop-review` 中“v21、前端优化待做”是该阶段历史，已被后两次实现取代。

## IMPORTANT DECISIONS AND WHY

1. **混合 SQL＋永久文件，而非追求 D1 最小化**：用户愿意接受一点冷读延迟，但不希望迎合其分层草图损失软件现实性。研究曾提出 4096 文件目录/槽位/全关系外置；复盘后因检索、跨文件一致性、既有外键和请求复杂度拒绝将其作为必建方案。最终优先外置大字节与重复描述，保留有用小关系，成功点读用紧凑不可变 SQL。全历史资格和未知计费保护不受存储形状支配。
2. **OneDrive 订阅是独立个人资产**：零月费分散存储、GitHub 分仓音频、免费 VM/多家小免费库都讨论过；没有作为生产依赖。个人套件生态、1 TB、国际品牌及其他项目共用价值促使用户订阅。家庭版是每成员个人额度，不把多人额度当单个应用 6 TB 池。实际续费套餐金额/试用截止当前未知，不把早期 398/498/$99.99 比较写成已确认账单。
3. **脚本轮询＋有任务才 Codex**：利用现有登录避免另买教学模型 API，不把 Chat 对话作为唯一可靠后台队列。分钟/半小时轮询各有合理职责；“无额外模型消耗”只针对空检查，不包括真正答疑、网络、免费账户配额和电力，也不代表真正实时或 24/7 在线。
4. **安静启动器而非只隐藏 PowerShell**：用户电脑频繁蓝窗影响日用。`-WindowStyle Hidden` 可能先创建控制台；C# 无控制台进程＋`CreateNoWindow` 才是采用方案，不依赖 VBScript、管理员密码或常驻可见终端。任务安装只替换 action，保留触发器/用户/休息/IgnoreNew。
5. **Kokoro 专一化主力**：按用户亲试听阈值，Bella 的清晰自然优势足够，普通发音不值得高价模型的边际改进；听力可以保留其他声线训练自然差异性。此前 Heart 高评不是最后默认决策，男声调音被拒绝后采用降低标准的原始五男池。
6. **多路声音证据不是多模型投票评分**：Whisper 擅长识别及 ASR 时间，不等于声音诊断；Google/Qwen/OpenAI 的原声观察有增量也会虚构音素。把全原包交 Codex、审查语言学前提，比相信一致性/低分更符合教学目标。第四路 GPT Audio 后来作为增量固定主路，早期“GPT 太贵可删”的建议已被用户更新。
7. **完整范围清单＋按主题回读**：用户要第一章至现在的资格，不是每次将所有全文灌入上下文。审计提出 bounded window 有真实成本动机，但不能擅自缩窄范围；导航索引可增量维护，入围原文仍须回读，不用摘要冒充教材证据。
8. **纯净阅读解决承载与美学冲突**：重新排满工具栏的版本被用户否决。双击阅读区进入/退出纯净模式保留原常态美学；答疑常态顶栏可见，纯净模式故意隐藏外围。不是再加浮动退出按钮。设置/试卷在自身窗口内分层，而非把所有功能塞常驻主页面。
9. **原问题整章上下文**：章节文本相对小，固定全文＋会话比选句范围工具更简单可靠；没有为用户问“这句里的用法”额外增加复杂定位操作，也没把整章内容暴露给任意工具进程。
10. **题型约束与测量成绩分离**：微缩全题型来自用户，而非官方要求一份卷包含每种形式。难度 standard/above 由独立内容审阅承担，代码只能校验声明与结构；24 题不能乘比例当官方 band。工程完整不能替代实际教学效度。

## INVARIANTS AND REGRESSION TRAPS

### 内容与历史身份

- 先 claim 再模型；休息消费幂等，同日工作优先读已有 `work/runs`。不要用“重试”重推荐/重标注。来源固定同一 VIX commit，标注标签跨年不复用旧 MM-DD。
- Collins/Oxford 完整内容并集，相关交叉引用/派生拆行/同名主题不可仅凭第一个搜索命中遗漏。Oxford 音标不自动等于美式；派生靠语义判断，不用外形规则认词族。
- 用法正确与自然文脉必须人工式模型审阅；结构测试仅证明数目、顺序、码和译文配对，不证明释义正确或第三部分真实覆盖。
- revision、题目、参考、原答卷、model raw 和原声不可被后来版本静默改写。发布当前指针不能被旧 commit 倒退；固定来源读 digest，历史读取的 UI 状态也分开。

### 提交、揭示与收费

- 文字 attempt 的客户端 ID/正文先固定；失败重发同身份，改正文同 ID 冲突，新答新 ID。原声提交后才揭示不能被误标答前看参考；收起答案不撤销揭示记录。
- 固定四路为 Whisper `@cf/openai/whisper-large-v3-turbo`、`google/gemini-3.8-flash`、`qwen/qwen3.8-omni-flash`、`openai/gpt-audio`；以 `contract.mjs` 和路线注册为准，不凭名称猜 GPT Structured Outputs 能力。
- Whisper 首轮不带题目、范文或校对稿；`vad_filter=false`、默认 beam。Gemini/Qwen 支持当前 Schema 请求，GPT Audio 用最终 JSON prompt＋结构核验，不强塞不支持的 response_format。每路 maxTokens=12288 是容量，不是预计账单或所有思考 token 的保证上限。
- 完整返回可带 thinking/usage/真实 provider；原文保留。单元素数组只在其中对象独立满足 schema 后解包并留 parseMethod；HTTP 200、扣款或自述“已听完整”都不能单独认证质量。
- 402 共享池阻断；401 凭据、403 author banned、地区失败、429/5xx 各有不同 failureScope。未知结果 `outcome_unknown` 不自动重付；有成功返回先复用。父练习申请也要停止，不能六小时租约过后普通队列又领走继续烧钱。
- 同模型多次补听不是独立共识；Whisper 和 GPT 同属 OpenAI，也不是四家独立听审。无声学依据不造 F0、音素概率、confidence、精确时间或完整 band。
- 腾讯专项用本人确认原话及原声起点，不能用范文当参考评测原答；Qwen 代偿只提供定性信息，不能代造腾讯测量。

### 存储与部署

- 原件暂时不可读 ≠ 未生成；Graph 401/429/5xx/校验失败不能触发重付。音频 Range 必须正确，私有下载不公开 Microsoft 预授权 URL。D1/Graph 没有跨系统原子事务，容许未引用块，靠既有幂等身份提交。
- 新章先永久存、回读验证再提交，KV 三十天缓存失效仍可读永久历史。归档排队 ≠ 归档完成；失败不能宣称成功。
- rowid 游标不能被 OFFSET/每页重新扫全历史替代。当前导出依赖 rowid，直接改 `WITHOUT ROWID` 会破坏它。只有触发器保证的追加表可增量，不把有更新的小表冒充不可变。
- 快照必须保留所有旧版本需要的原件，排除备份自己和临时页/登录会话，避免递归膨胀。不能用只含点读三表的模拟尺寸充当两库全空间。
- 归档直接查询预算按 UTC 日累计 `rows_read`，250 万行保护线；只覆盖归档，不是整个账户余额。压缩字节不减少按行读取计费。120 MiB 检查、160 MiB 前维护，200 MiB 是应急而非正常目标；点读另有 31 MiB 应急副本/200 MiB 实际库保护。
- 正式部署必须 `scripts/deploy-app.mjs`：Worker→gateway build→带 API service binding 的 Pages dist。**直接部署 `web/` 会让 `/api/*` 返回 HTML**；历史确实发生，不能用 Pages 上传成功冒充后端可用。
- 模块、SW、清单、图标 URL 同版，新模块进 CORE；保留章节缓存身份与隐私规则，余额/私有原声不加入离线 shell cache。

### iPhone 的行为细节

- 纯净手势等待约 300ms，不吞掉单击点读/索引等业务操作。原始点击先唤醒 AudioContext；冷启动时该操作曾耗约 433ms，所以第一击时间在 prepareTap 后记录，否则首次双击失败。重放事件用 WeakSet 避免递归。
- 正文 `touch-action: pan-x pan-y` 避免浏览器先接管双击缩放；滚动、长按、输入、音视频、多指不触发纯净切换。阅读位置用可见句锚补偿几何变化，不只粗放恢复 scrollTop。
- 未提交笔记按章 digest 本机保存；设置刷新不覆盖 dirty 编辑；发送答疑期间可写下一问，成功只清理仍匹配提交内容的字段。
- 雅思按科目/Task/Part 保留不同草稿与滚动位置；提交某题不能重建其他题。写作两个 Task 共用截止时间，重开不重置；Part 2 计时独立于播放器/录音。上传期间不重录/替换，仅成功清理同 attempt 的 IndexedDB 草稿。
- 章册默认全目录、日历同窗；从目录选部分恢复该部分，`showPart(part,true,false)` 避免新章还未恢复 RAF 时误保存零位置。历史课号只转换展示。
- 同时只开一个模态框，关闭子页回父设置；断网应提示重新连接，不假装需要重新注册 passkey。模型文本安全排版，不执行返回 HTML 或资源。

## KNOWN FAILURES AND DEAD ENDS

| 路径 | 结果 / 为什么不继续 |
| --- | --- |
| 大规模音频实验逐片段 KV 记录 | 220 片段约 1138 写入，越过账户每日 1000 次免费写；新 namespace 不隔离配额，反馈 put 也失败。改为已合成静态试听文件＋独立 D1 反馈/本机草稿，不能再重现 |
| 把一次 KV 写限额说成全项目瘫痪 | 错误；写、读、D1、静态页、模型余额分别检查。事故曾阻碍章节缓存发布，但不是所有服务统一下线 |
| iPhone 原生发音作为最终主力 | 用户觉得机械、属于上个技术时代；保留研究历史，不作为 Bella 已采纳后的正常替代 |
| 高价国际男声继续筛选 | 用户认为费用和支付不确定不值得，转为 Kokoro；没有必要为男声再新增账户/长期费用 |
| 男声降噪、提亮等后处理 | 用户最终全部否决。不要把处理实验版当五男池资产；最后接受的是降低阈值后的原始声线 |
| 腾讯全录音自由说代替主链 | 既有复测 ASR 没改善；常规不加入第五路，只在有目标、本人原话已确认时做句子/单词专项 |
| Gemini 2.5 Flash/Lite 候选 | 返回过 schema，但有改词、错误纠音，路线禁用；不是因为不能传音频。与已启用的 3.8 Flash 分清 |
| Whisper 增 beam/提供范文提示 | 不保证改善，还可能混入预期文本；正常四路首轮独立，不提前灌校对答案 |
| GPT Audio 强制 Structured Outputs / 只回“稍后分析” | 当前此 profile 用 prompt-only 最终 JSON；承诺稍后不是产物，不因 HTTP 200 算完成 |
| 本机直接调 OpenRouter | 曾撞地区/IP限制；生产走 Cloudflare。报告中的 account/provider eligibility 与请求级 geo 不同，换出口不保证解除；不把云端 Codex当合法解锁万能方案，不伪造地区/支付资料 |
| API/Cloudflare OAuth 401、缺 workers/pages/KV scope | 属凭据过期或具体授权范围，不是模型不行；使用实际设备码续期，旧码不可复用、不能打印 token |
| 内置 openai provider 重写 / WebSocket答疑 | CLI 不允许覆盖内置 provider，WS 会长回退；采用独立 `openai_qa` HTTPS 配置，保留既有登录 |
| 仅 PowerShell Hidden | 仍可能闪蓝窗；采用版本化 BackgroundTask.exe，不靠用户忍受 |
| 全文件目录化、固定4096头和槽位 | 研究后认为迁出范围过大、状态检索复杂，不是已上线方案；紧凑混合库才是当前实现 |
| `special/approot/children` 直接建子目录 | 实测创建失败；先解析应用目录实际 itemId 再操作，不从示例推断全部 Graph 小文件 CAS 可靠 |
| Git HTTPS正常推送 | 本机多次连接 reset/443失败；可用 GitHub API按树/元数据提交同一 commit，核对 hash，并经PR合并；不是授权不够，不能报已推送却只有本地commit |
| 堆常驻控件的阅读改版 | 用户因美学下降否决；双击纯净模式及同窗分层是替代，不以工程覆盖率劝用户接受丑版 |
| 审计提出learner model/自动复习/云Scheduler | 不是已确定建设任务，也没有因此放弃所有历史资格。属于下一阶段可讨论方向，不能按外部评分擅自启动 |

## REPOSITORY EVIDENCE MAP

只按当前任务选择入口，不要求一次读全仓库。

| 认识 | 最短验证导航 |
| --- | --- |
| 产品与操作总览 | `README.md`、`AGENTS.md`、`OPERATIONS.md`；现行执行规则优于阶段性 research |
| 日课控制 / 推荐 / 教材保真 | `protocol/DAILY_RUN.md`、`RECOMMENDATION.md`、`QUALITY_WORKFLOW.md`、`CONTENT.md`；`claim-run.mjs`、`vix-candidates.mjs`、`mark-vix.mjs`、`pack-chapter.mjs` |
| 章节结构与显示 | `protocol/ANNOTATIONS.md`；`web/render.js`、`annotations.js`、`app.js:openChapter/showPart`、`chapters.js:chapterNumber/createChapterBook` |
| 雅思全历史申请与规格 | `protocol/EXPRESSION.md`、`PRACTICE_SIZES.md`；`worker/src/practice.js:practiceRoute`、`web/exam-spec.js`；`worker/src/listening.js:validateListening`、`reading.js:validateReading`、`objective.js:validateCoverage` |
| 听读 / 隐藏答案 / 作答 | `protocol/LISTENING.md`、`READING.md`；`worker/src/listening.js`、`reading.js`、`objective.js`、`practice.js:publicQuestion`；`web/listening.js`、`reading.js`、`objective.js` |
| 四路请求及数据要求 | `protocol/speaking/contract.mjs:profiles/collectionSchema/detailSchema`、`routes.mjs:failureScope/compensationPlan`、`scripts/lib/speaking/collect.mjs:openRouterRequest/collectWhisper` |
| 原声闭环 | `protocol/SPEAKING_RUNTIME.md`、`SPEAKING_PIPELINE.md`；`worker/src/speaking.js`、`worker/speaking/collector.mjs:collectNext`、`control.mjs`、`scripts/speaking-practice.mjs`、`web/recorder.js` |
| 发音/听力选声 | `protocol/voices.mjs:castAudioPlan/synthesisVoice`、`VOICE_ROUTING.md`；`worker/src/pronunciation.js`、`pronunciation-store.js:savePronunciationResult`、`scripts/practice-audio.mjs` |
| 答疑隔离与回推 | `protocol/CHAPTER_QUESTIONS.md`；`worker/src/questions.js`、`scripts/question-worker.mjs`、`web/questions.js` |
| 永久文件 / 紧凑结果 | `protocol/STORAGE.md`；`worker/src/storage.js:permanentBucket/archivalBucket/chapterText/storageRoute`、`private-assets.js`；practice migrations 0007/0008 |
| 归档 / 读取预算 / 恢复 | `scripts/storage-upgrade.mjs`、`storage-maintain.mjs`、`storage-restore.mjs`；`scripts/lib/storage-scan.mjs:rowidPages/permanentRows`、`archive-read-budget.mjs`、`recovery-snapshot.mjs`、`work-archives.mjs` |
| 额度与腾讯代算 | `protocol/BALANCES.md`、`task-quotas.mjs`；`worker/src/balances.js`、`scripts/check-balances.mjs`、`lib/account-quotas.mjs`、`tencent-quota-ledger.mjs`、`web/balances.js` |
| 交互与美学 | `web/DESIGN.md`、`protocol/READER_INTERACTION.md`；`pure-reader.js`、`settings.js`、`practice-workspace.js`、`text.js`、`styles.css` |
| 发布/任务 | `scripts/deploy-app.mjs`、`worker/gateway/build.mjs`、`worker/wrangler.jsonc`；`BackgroundTask.cs`、`install-background-tasks.ps1`、`run-daily.ps1`、`run-practice.ps1`、`run-storage.ps1` |
| 真实恢复/声音证据 | `research/service-and-storage-release-2026-10-06.md`、`openrouter-speech-evidence-2026-10-04.md`、`voice-style-feedback-2026-10-04.md`；原声及实际账户材料仅在私有忽略目录 |
| 审计与容量边界 | `research/external-audit-functional-review-2026-10-04.md`、`closed-loop-review-2026-10-06.md`、`storage-scan-fix-2026-10-06.md`、`d1-storage-design-review-2026-10-06.md`、`d1-production-registry-capacity-2026-10-06.json` |

主库 schema 在 `worker/migrations/`，练习库在 `worker/practice_migrations/`，正式迁移权威各到0008。`worker/speaking/schema.sql` 是早期独立部署参考，**不要把它再当第二个生产schema应用**。`research/d1-bounded-storage-design-2026-10-06.md` 是已修正的候选，不是生产代码；容量 JSON 也不是实际物理空间观测。

## ENVIRONMENT AND OPERATIONS

### 快速本机操作

从实际根目录运行，Windows PowerShell；Node 已有运行时：

```powershell
$projectRoot = 'C:\Users\huawei\Documents\Codex\2026-09-30\github-vix\work\ielts-expression'
Set-Location -LiteralPath $projectRoot
$runtimeNode = 'C:\Users\huawei\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $runtimeNode scripts/serve.mjs
```

本机 demo 在 `http://127.0.0.1:4173`，不是正式数据；数据库检查需 Node 的 `node:sqlite` 支持。前端原生模块，不安装 React/Vue 来改一个页面。Wrangler 已在 `worker/node_modules`。Python可用于文字/本机文件，不用重装环境。

浏览器验证 `scripts/check-reader-ui.mjs`：Playwright 正常 import，不存在则回退忽略目录 `.cache/browser-tools/package/index.mjs`；默认 Chrome 路径 `C:/Users/huawei/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe`，可用 `BROWSER_EXECUTABLE` 覆盖。`UI_CHAPTER_DIR=chapters/2026-10-06` 使用真实章节，不设置则 demo。输出 `.cache/reader-ui/`；402×874 CSS视口/触摸模拟不能冒称 iOS Safari 真机。

四个计划任务：日课03:00北京时间、雅思30分钟、答疑1分钟、永久归档5分钟；本次全部 Ready/最近0。任务 action 的实际exe位于忽略 `.cache/task-runner/`，源码纳入仓库。换工作树/电脑先核对 action、用户会话、凭据与续作文档，不仅改当前cwd。不要为交接重新安装/暂停它们。

### 凭据只说明配置位置

本机正式 publisher 配置现位于：
`C:\Users\huawei\Documents\Codex\2026-09-30\github-vix\outputs\second-language\.cache\deployment-secrets.json`。
设置 `SECOND_LANGUAGE_CREDENTIAL_FILE` 指向它；优先可使用 `SECOND_LANGUAGE_API_URL` / `SECOND_LANGUAGE_PUBLISH_TOKEN`，否则 resolver 在项目 `.cache/deployment-secrets.json` 查找。**不要打印文件内容或把 token 写入文档/命令文本**。

腾讯私有配置 `.cache/speaking-provider.json`；Microsoft DPAPI授权位置由 `scripts/lib/onedrive-local.mjs` 管理；Wrangler OAuth 默认配置由 `scripts/lib/cloudflare-local.mjs` 读取。OpenRouter和Graph相关 secret在Cloudflare后端，浏览器不持有。复制DPAPI密文到另一Windows用户不会自动可用；重新完成同一Microsoft应用设备授权，不扩大到整个网盘、不要求client secret。`.cache/publish-*.mjs` 是本机回退辅助，不是B新clone必需依赖。

若CLI网络Git失败，用现有GitHub connector/API读取真实ref/commit/tree；不要把搜索索引当Git权威。发布既有token可由本机Gitcredential helper内部取得，不回显。上一轮通过API构建与本地完全同一tree/commit，再PR合并；重试先查PR/ref是否已成功，防重复提交。新工作不能只因local main旧就强推main，核对远端新增内容。

Cloudflare部署无额外页面发布授权询问，走既有任务授权；真实OAuth过期/缺scope须说明并用当次device code引导用户。文档更新无需重新部署PWA或迁移库。

### 完成与恢复

- 工程/发布任务末尾执行 `node scripts/check-balances.mjs`：实际核对并更新余额页，finally排永久归档；失败不撤回正文、不重生成。空队列不运行此核对。
- 常规 `storage-maintain` 最多三次文件操作重试、15分钟间隔；达到日读取保护线停止当前需求。**文件归档有限重试不是额度不足自动恢复模型**。
- 恢复先 `storage-restore.mjs --direct` 到独立新目录，核对完整性/外键/字节；旧KV副本未经确认不清。重授权后仍需正确应用目录身份。
- 听力/考官音频先plan冻结角色、后实际生成/核听/时长与文本核验；没有从“模型好听”推断所有长音频合格。新音色/参数改变有效身份与估算，旧产物保留。

## OPEN PROBLEMS AND UNCERTAINTIES

1. **真实IELTS验收仍待首次申请**。0套/0答卷是当前事实。首次真实完整或微缩应验证内容自然、微缩全形式不生硬、音频时长/人物一致、四科提交/揭示/批改回推和账单。不要把为了测试写正式假卷当作验收。
2. **容量优化不等于永不触限**。两库目前极小，成功点读三表本地模拟50万/70万/100万条及一章关联约94.04/132.00/188.63 MiB；这是指定表模型，不含全部业务/碎片/故障副本。其它永久SQL全文仍增长，旧分区迁出与全业务容量入口尚未全面实现。120/160 MiB或类别实际增长触发具体维护，不能先按一个过度复杂全目录系统重构。
3. **OneDrive不是精确实时计量器**。本轮quota.used与登记总量不匹配；总容量、订阅状态、文件数、授权长期续期和节流须按真实增长复核。文件小样本验证不证明大规模性能或删除应用目录后自动恢复；付费订阅的静态持有成本仍存在。
4. **长期存储预测是情景**：用户确定0–3套/周，平均偏上1.5套/周；每套平均偏上1.5次回答周期，约78套/117回答周期每年。后一个1.5不是被前一个替代，更不应算成只答一次。词库约1.5万以上并含派生/多义/句子音频，不能按每词一段估算。`storage-capacity-forecast`是真实短音频校准后的敏感性研究，不是未来量的承诺。
5. **财务估算仍待真实全套校准**：Kokoro规划$0.62/M字符、Whisper46.63Neurons/分钟、四路/补听经验费用由`task-quotas.mjs`计算；这是2026-10-05规划资料，不在交接时声称重新查到最新报价。完整组合规划上端约$1.3769，不是纯TTS价格，也不是严格账单上限。口语14/18/22份是估算情景；官方无固定总问句数，**不能机械出18份录音任务**。
6. **腾讯套餐查询仍未接通**。用户9.9元一万计费次，截图已用22/剩9978，2027-10-02到期；实时现金API不是包余额。DescribePidOrders得到InvalidAction/ActionNotFound，不能据此断言所有官方API都不存在。基准＋项目脚本身份账本代算，只涵盖本项目；自由说20词向上取整、单词/句子一次完成计次，未知调用待核对，截图22不重扣。外部使用/新包须用户再校准。
7. **原声模型观察未做音素人工真值大样本认证**，多路或schema不保证准确。完整链与少路ablation可能有价值，但用户允许低频合理成本的固定增量链；不可因工程洁癖自动删除第四路。
8. **上下文负担要区分两种**：日课全用法文章确有内在复杂度，已有逐词资料与权威草稿续作减轻；雅思source_json全资格元数据逐步增长，不等于每次全历史全文。未来导航索引可帮助，不能借“选材”绕开VIX日课推荐或缩窄雅思范围。
9. **长期learner model/自动复习/统计测量难度未建设**。用户没有授权审计那套30天冻结计划作为自动任务。实际使用反馈可支持后续讨论，工程全套通过不等于长期学习效果已证。
10. **确认发现的文字冲突**：`protocol/speaking/contract.mjs:codexHandoffPrompt`仍含“until the next Beijing day and verified recharge”，与`BALANCES`/`SPEAKING_PIPELINE`及当前USER-DECISION不自动跨日相冲突。collector明确续作保护已有测试通过；B读材料时以现行决定为准，不把旧prompt当自动重试授权。本次只记录，未改代码。修这处措辞需作为独立小修，勿启动架构改造。

审计提到的排序bug已修：`worker/src/practice.js`采用单一skillOrder两侧一致；`.objective-stimulus`边线和pagehide重复问题已有后续处理，复查以实际代码为准，不能按旧报告再修一遍。CI统一入口、CURRENT SYSTEM权威页是形式建议，不应据此宣布工程功能不完整；本文件也不取代协议/源码成为永恒同步副本。

## CURRENT FRONTIER

**A的最后稳定状态**：v23已上线；PR #11合并；真实40词与demo两轮各69项前端检查，上一轮正式12文件一致/同源session JSON/匿名practice401通过。本轮重新核对Git树、在线shell、生产统计与最小专项检查。用户宣布建设封顶，唯一新增工作是本交接包，没有正在半完成的tracked功能修改。

**现在B最自然的动作**：先读本文件启动地图，确认自己的工作树和当前main，区分旧状态快照与新运行变化，然后回应用户下一项目的实际需求。可以借用本项目的判断方法和可复用设施，但不自动去跑日课、领取雅思、补测收费音频、清私有文件或重构数据库。

触发后才继续第二语言的方向：

| 触发 | 可做的下一步 | 验收条件 |
| --- | --- | --- |
| 用户要求首次正式练习 / 已有新申请 | 按next只读查状态，按现行规格建设原计划 | 自然原创材料、全科/题型/声音完整，真实提交与反馈，账单保留 |
| 用户报告iPhone问题 | 原真机复现路径→对应模块最小修→隔离回归 | 真机任务完成、草稿/位置保留、视觉未退化，非只截图无溢出 |
| 实际SQL容量或读取接近保护线 | 找最大增长类别，设计有证据的局部归档/迁出 | 固定历史可查、已收费资产复用、未知结果不失、独立恢复核验 |
| 用户指定新项目 | 从需求/现有资源出发设计，不预设2008或语言教学约束 | 新项目自己的功能与用户体验标准，不靠复制旧架构验收 |

交接完成的验收：B只读此文件即可找对repo/凭据入口（不获取秘密）、理解固定规则与为何采用当前方案、识别真实验收缺口、选择必要检查；不需要读取长对话来防上述回归。Git发布本文件不需要改PWA版本。

## B STARTUP MAP

1. **定位与状态**：从本文件路径进入真实项目；`git remote -v`、`git branch --show-current`、`git rev-parse HEAD`、`git status --short`。基线4个untracked不是垃圾，背景任务可能又产新文件。新clone只含Git内容，不含已发布第二章/忽略证据；要从授权后端或永久资料取，不以clone缺失宣称数据丢失。
2. **总体执行规则**：`AGENTS.md`→`README.md`→`OPERATIONS.md`；这里只恢复入口和边界，不无差别扫research。用户后续指示可以更新决策，本交接不冻结新偏好。
3. **两个最高风险面**：`protocol/STORAGE.md`＋`worker/src/pronunciation-store.js`；`protocol/EXPRESSION.md`＋`PRACTICE_SIZES.md`。分清永久文件与SQL实际留存、全历史资格与实际回读；read-only统计优先。
4. **按任务读一条链**：界面读DESIGN/READER_INTERACTION及对应web模块；章节内容读DAILY_RUN/QUALITY_WORKFLOW；原声读SPEAKING_PIPELINE/RUNTIME和contract/routes；答疑读CHAPTER_QUESTIONS/question-worker。没有任务不读所有长报告。
5. **最小检查**：默认`check-publishing-closure`＋`check-practice-closure`；界面任务再跑`check-reader-ui`，存储/声音/答疑按地图选对应专项。本轮已通过，不因接手机械重跑全部，不调用真实模型测环境是否好。
6. **接用户当前任务**：新项目优先问清缺失的实际目标并推进可确定部分；已有发布授权不重复申请常规权限，新增购买或真实OAuth缺失才需要用户操作。声明新增持续成本和真实未验证点。

## COMPRESSED EXPERT MEMORY — 跨项目可迁移但不能照搬的认识

- **“完整、保真、可恢复”是业务语义**。原始数据、工作稿、展示稿、当前指针和缓存各有身份，不能为了输出漂亮偷偷改原件。过程文档的价值是使下一轮能恢复具体判断，而不是制造仪式性表格/计数。
- **最高效的系统常是模型做判断、脚本做确定性控制**。把AI内容工作封装成可领取/幂等提交/证据保留，不要求Agent在一个巨大聊天里维持全部状态。空轮询、文件归档与真正推理分开，是可复制机制；本项目具体CLI/provider参数不是永远适用的接口事实。
- **成功输出与消费结果未知是不同状态**。最易被忽略的工程成本是错误地把网络断开当没收费，然后重跑；有效身份、原包、状态和明确重试范围比“exactly once”口号有用。
- **用户真正反对的是无收益复杂度与审美牺牲**，不是拒绝软件工程。单开关按章预下载、整章答疑、保留原版＋纯净模式，比精细词邻域预测、强选句器、拥挤常驻栏更吻合任务。未来项目也先做实际使用流程，再决定粒度。
- **“免费大平台”仍有账户共享限额和操作成本**。容量、rows_read、写次数、CPU/外部请求预算、模型钱包不能混在一个“额度够不够”里。把一个全量步骤改成批量并不必然省行计费；压缩存储不自动省请求。
- **廉价模型数据常有价值，廉价诊断未必可信**。保留原包并让主Agent审阅可以提取增量，不能让schema或供应商共识替代事实；判断一个批评前先核对其理论前提。新的增量资源可以进固定主链，不一定只能“替换”或“按需”，但要由实际教学/产品价值证明。
- **不同场景阈值不同**：单词学习清晰度、口语考官自然性、听力多人物抗干扰并非一个全局音质排行榜。早期评分只是场景证据；后来用户放宽男声标准不矛盾。新项目应重新确认使用任务，不移植本项目Bella/五男池为通用质量结论。
- **资源价格要按用户任务账单算**。一套练习含生成、考官、Whisper核听、回答多路与补听，不能拿TTS千字符单价代替全部成本；API调用数量规划也不能反过来强行塑造真实考试。经常性的“合理低价”依旧要用户愿意持有，而非Agent自认便宜。
- **漂亮的容量模型不是生产安全证明**。字节压缩、关系简化、备份游标、故障副本和永久资格必须一起验；不应为了迎合用户给出的层数把SQL全面迁出。保留代价并明确未实施部分，比宣传“几乎永不触限”更可信。
- **外部审计最大的用处是提出可复核问题**。真实排序、发布倒退、重试重复、辅助条件和任务收尾bug值得修；可维护性评分、框架化测试、公众SaaS比较不自动成为单人产品要求。先找实际坏掉的行为，再决定修复规模。
- **迁移有两种**：源码/部署迁移与有效认识迁移。新clone能启动代码，不等于有私有工作材料、授权、任务action或历史版本；新Agent有本文件，也不等于所有旧研究成为当前事实。启动先确认边界，避免用好心重构毁掉已经成功的私人系统。

本文件不安排通知、休息、充值、任务暂停或下一项目实现；这些须由用户当前指示及现行协议决定。交接后的源码、配置、余额与生产数据都会继续变化，请把此文件作为带时间的认识入口，而非覆盖现实的静态权威。
