---
title: "第二语言项目：词源权威化与章节质检认证体系研究报告"
subtitle: "系统性词源资料调查 · CQA 独立质量审计设计 · 对话原文存档"
date: "2026-10-15"
lang: zh-CN
---

> **文档性质**：独立研究与产品设计报告；并非已经落地的功能协议或质检结果。  
> **研究范围**：本次对话中关于「词源权威化」与「章节质检申请」的两轮讨论，以及相关权威资料、实际仓库代码和运行协议。  
> **事实基准**：GitHub `Gual-Wells/The-Second-Language`，检索时的最近可见提交 `8bde74103ab5288940f453badec3029b43ae0e01`；仓库仍在演化，采纳前应重新核对当前分支。  
> **报告原则**：把已核实的外部事实、仓库现状、双方讨论形成的建议、尚待测量的问题严格分开；不得将预想的评分或者演示 UI 写成既成结果。  
> **原文附录**：附录 A 保存本对话的逐字用户发言；附录 B 归档本轮两份回复的可见文字内容。互动控件、网页引用标记与异步图像不是纯文本，不能视为逐像素聊天导出；此外，回复原文见同包独立《对话原文文本存档》。

# 执行摘要

第二语言项目现有生产链路已经包括 VIX 选词、每章 40 个主词、Collins 与 Oxford 双教材逐词内容整合、三部分课程结构、长篇范文用法覆盖、章节测试、Codex 答疑、Cloudflare/D1、OneDrive 不可变原件归档，以及本机异步任务队列。下一步最值得研究的两项能力，不是继续扩大一般性生成规模，而是建立可追溯的知识依据和可复核的质量监督。

**方向一：词源权威化（Etymology Authority）。** 核心需求是系统性来源，而不是几百或几千条词根表；不能让 AI 批量创造词源事实。调查显示：OED 及专业词源词典具有更强编纂权威，但一般不具备现成的批量复制许可；Wiktionary/Wiktextract 能提供百万级词形范围及机器可读词源字段，却不能仅据此认定学术权威。项目应采用「大规模来源索引 → 证据逐条定位 → 权威核验 → 授权合规展示」的分层策略，首先测量实际 VIX 集合的有效词源覆盖，而不是按平台总词条量做推断。

**方向二：章节质检申请（CQA）。** 用户在正式章节中申请，将版本固化后排入 Codex 队列；审核须输出逐词、逐用法、逐句及整体文章层面的可定位证据，再交由规则程序做完整性和门槛判定。CQA 不等同于现行章节测试，也不证明学习者掌握水平。最难的问题是**现有问答/测试 Worker 获取的主要是固定章节正文，而非完整双教材原词条及生产证据**。如果不扩充来源交接，最多能认证“章节内部经审核一致”，不能认证“Collins/Oxford 原材料完整保真”。

**总体建议**：先建立可验证的证据层；再用小规模真实章节和人为注入的已知缺陷测量误报、漏报；最后开启章节内按需申请与版本化证书。宁可将有证据缺失的结果标为「待核验」，也不能把高分等同于质量保障。

# 第一部分：需求与研究边界

## 1. 用户的核心要求

1. 词源信息不能依靠 AI 批量生成来承担事实权威，因为批量生产难以保证质量。
2. 不考虑只有数百或数千条收词的小规模材料；优先考察上万至数十万乃至百万级的系统性词典及数据库。
3. 资料形态不限于电子资源：专业纸质词典可以承担权威复核角色，电子数据承担自动化规模覆盖。
4. 在章节内部增加「质检申请」入口；排入 Codex 队列，对指定章节进行规范审查并给出合格认证或有依据的评分评价。
5. 对话原文与相关资料合成独立报告，供后续维护、再研究和实际实现使用。

## 2. 不在本报告中宣称完成的工作

- 尚未计算完整 VIX 词池与各词源资源的逐词覆盖率，也未实际批量导入任何第三方词典。
- 尚未获得 OED、Oxford Dictionaries API 或 Merriam-Webster API 的批量存储/重分发特别授权。
- 尚未对任何正式章节执行完整 CQA 审计，未形成实证的平均准确率或通过率。
- 尚未更改第二语言仓库的业务代码、数据库、前端或发布环境；本文全部接口、评分和数据库字段均为建议。

# 第二部分：词源权威化资料研究

## 3. 权威词源与规模化来源是两种不同资源

| 资源 | 可核实规模/特点 | 适用职责 | 核心限制 | 依据 |
|---|---|---|---|---|
| Oxford English Dictionary（OED） | 官方称超过 50 万词条，兼具历史释义及书证，按季度更新 | 学术复核的首选标准 | 访问和系统性使用受到许可约束 | [R01] |
| The Oxford Dictionary of English Etymology（Onions 等，1966） | 约 2.4 万主词条，覆盖超过 3.8 万词 | 专门词源核查、源流和义项史 | 较旧；不是可直接导入的自由数据库 | [R02] |
| Chambers Dictionary of Etymology | 超过 3 万词条，1999 版 | 另一套专业编纂资料 | 与 Barnhart 有资料渊源，不能当作完全独立证据 | [R03][R04] |
| Etymonline | 大型在线词源词典 | 深入阅读和疑难问题定位 | 批量抓取、存储及分发许可未核准 | [R05] |
| Oxford Dictionaries Lexical Data API | 官方结构化 `etymologies` 字段 | 如取得企业许可，可结构化获取 | 普通许可禁止系统性复制和长期缓存，且对 AI 结合使用有限制 | [R06][R07] |
| Merriam-Webster Collegiate API | 官方称超过 25 万条**释义**，提供 `et` 字段 | 辅助专业核验 | 25 万不是词源条数；自动或预录查询需书面批准 | [R08][R09] |
| Wiktionary / Wiktextract / Kaikki | 英语机器可读页面显示约 139 万不同词形（截至所见提取版本）；含词源字段 | 实际的规模化索引/候选知识层 | 众包质量不一；许可需署名/共享相同条款 | [R10][R11][R12] |
| GCIDE XML | 官方说明 131,566 词头；含历史词源标记 | 历史补充、离线结构化对照 | 由 1913 Webster 衍生，词源较旧；GPL 授权 | [R13] |

**计数约束**：词条、词形、释义、短语、包含词源的条目、可依法接入的条目是五个不同的分母。尤其 OED 的 50 万与 Wiktionary 的 139 万不能直接解读为可认证的词源数量。

## 4. 专业词典的使用价值

OED 是大型英语历史词典，适合校验首见时间、历史语义演变、同形异源与词源争议；Onions 的专门词源词典聚焦词汇源流，纸质版本也可在少量困难案例中作为精读依据。但 1966 年的词源解释须与现有修订版交叉核对。Chambers/Barnhart 兼具专业性与面向一般读者的可读性；若涉及同一词根，先排查其内容源流，不能机械把两个书名算作两份独立证明。

Etymonline 是有价值的专业索引和阅读入口，但在没有明确批量授权前，应按链接和人工参考来使用，不建立整站抓取任务。**“网上有人已经抓取”不能推导“项目有权使用该抓取数据”**。

## 5. 机器可读资料路线

Oxford 官方 API 具有词源元数据：Words/Entries 端点会返回 `etymologies`，还覆盖派生、语域、地区等元数据。[R06] 但是 API 开发者条款限制系统性复制、自动工具抓取、内容与 AI 工具结合，以及普通计划下缓存和长期储存；官方 FAQ 建议缓存需求联系 Enterprise。[R07] 这些限制与项目的 Codex 定时批量生产和 OneDrive 永久归档存在直接冲突。

Merriam-Webster API 的产品说明给出了 `et` 字段示例，证明词源可机器读取。[R08] 其非商业 API 条款也限制自动提交查询，除非经书面批准；因此不能默认把免费 API 当作数万词条的批量同步数据源。[R09]

Wiktextract 则明确提供 `etymology_text`、`etymology_templates`、`etymology_links` 及多源词源编号等字段。[R11] Kaikki 提供规律更新的完整 JSONL 导出；所见英语 Wiktionary 版的压缩全集约 2.8 GB，未压缩约 23.9 GB；这是多语言 Wiktionary 条目的原始提取量，**不是单纯英语词源数据体积**。[R10] 只提取 `lang_code=en`、与 VIX 匹配的主词和相应必要来源关系，可显著缩小本项目数据量。

Wiktionary 文字一般按 CC BY-SA 4.0/GFDL 许可使用，但其页面部分附属图片、音频或引文可能受不同权利限制。[R12] 第二语言自有许可不得覆盖来自 Wiktionary 的第三方内容。建议对这些数据分开建库、保留署名、版本及衍生内容的适用许可，并在展示层保持隔离。

GCIDE XML 提供 GPL 许可的大型离线资料，可作为历史词义、旧拼写、旧时期词源的补充；但其上游历史年代决定它不能优先于现代学术校勘。[R13]

## 6. 真正的“词源事实”应该如何建模

来源不能只按字面词形匹配。应至少区分：词形（surface form）、词元（lemma）、词性、同形异源组（homograph/etymology group）、被借入语言、借入路径、构词模式、语义转移、首次证据、争议/未知、原资料定位、许可与版本。

继承词、借词、英语内部派生词、后期古典词根组合、同源词和民间词源属于不同关系；不能把一串拉丁/希腊词根拆分自动升级为可信的词源历史说明。

**建议数据契约（概念性示例）**：

```json
{
  "entryKey": "<source-specific-identity>",
  "lemma": "<normalized-lemma>",
  "homographGroup": "<disambiguated-group>",
  "pos": "<part-of-speech>",
  "originPath": [],
  "semanticDevelopment": [],
  "sources": [
    {"provider": "...", "edition": "...", "entryLocator": "...", "revision": "...", "license": "..."}
  ],
  "certainty": "known|disputed|unknown",
  "verification": "verified|qualified|candidate|unresolved",
  "evidenceDigest": "<sha256>"
}
```

绝不根据字段存在就提升 `verification` 等级：`candidate` 只意味着已有词典提取，不意味着权威学术核验。

## 7. 第一轮数据覆盖实验的设计

**研究对象**：冻结一个版本的完整 VIX 通用英语索引，而不是测试几百个高频熟词。词元归并与派生词关系须保留原 VIX ID，不因别名覆盖而丢失词条。

**输出矩阵**：

- `matched_lemma`：可以确认存在对应的英语主词条；
- `has_etymology_text`：拥有实质词源段落；
- `has_structure`：可提取借入/继承/构词语言关系；
- `multi_etymology`：多词源/同形异源，必须人工审查；
- `reference_present`：文中有可定位出处或条目参考；
- `source_conflict`：不同来源结论冲突；
- `licensed_to_retain`：现有授权足以保留和展示哪类字段；
- `needs_manual_review`：疑难、缺证、无来源或对齐失败。

只有跑出完整覆盖率、分层抽样误差和许可清单，才能判断从候选源自动进入正式日课的边界。

# 第三部分：章节质检 CQA 体系

## 8. 现行工程真实基础

从仓库读取的文件显示：

- `protocol/DAILY_RUN.md`：每章 40 个主词、VIX 版本标注、逐词工作记录、三部分正文，固定版本发布；
- `protocol/QUALITY_WORKFLOW.md`：逐词保存 Collins/Oxford 内容去向，发布前双阶段语义审阅；
- `protocol/CONTENT.md`：强调义项不是标题字符串，必须沿完整交叉引用检查；
- `protocol/ANNOTATIONS.md`：`WORD`、`USE`、`SENTENCE` 等结构编码；
- `protocol/CHAPTER_TESTS.md`：现行正式理解测试，20 题，其中 7 道听说题，异步出题与审阅；测试成绩不授予正式认证；
- `protocol/CHAPTER_QUESTIONS.md` 与 `scripts/question-worker.mjs`：本机异步 Codex 工作与逐请求目录；
- `worker/src/questions.js`、`worker/src/chapter-tests.js`：排队、领取、租约、权限保护、历史章节摘要；
- `protocol/STORAGE.md`：D1 紧凑元数据与 OneDrive 永久内容寻址存储；
- `protocol/READER_INTERACTION.md`：iPhone 优先的标题、章节测试、答疑及跨版本阅读语义。

核心约束：现有 `question-worker.mjs` 领取任务后，将 `job.chapter.markdown` 存为本地 `chapter.md`，并以 `gpt-6-sol/high`、只读模式调用 Codex。`questions.js` 从对应章节 digest 读取全文，但普通问答任务对象并不包含两份词典的全部原始词条及逐词交接证明。因此，**新 CQA 如果原样复用问答数据负载，只能证明章节内部审查范围，不能证明原教材全量保真**。

## 9. 认证对象与界限

**CQA 证明的对象**是 `(chapterId, chapterDigest, qualityPolicy, evidenceSnapshot)` 这个固定实体。它不是学习者测试成绩；不是外部学术机构认证；不是英语全部语言知识的终极正确证明；也不自动覆盖该章节随后独立生成的测试题、音频、词源或纪念币。

应区分：

1. **正文结构通过**：程序检查完结构和必填覆盖；
2. **正文内部审阅通过**：基于章节自身审查意义、自洽性、译文和文章；
3. **来源保真已核验**：取得 Collins/Oxford 的足量原始材料与审查许可，逐词对照达到既定覆盖标准；
4. **完整 CQA 合格**：所有必检范围均覆盖、没有未关闭的重大缺陷、评分与证据门槛达到政策规定。

当证据缺失时，不应把 2 伪装成 3 或 4；应明确 `insufficient_evidence`。

## 10. 建议的质检维度与评分（未校准）

| 项目 | 建议权重 | 对应检查对象 |
|---|---:|---|
| 双教材来源忠实度与完整性 | 30 | 原词条、派生、交叉引用、语域和原有例句的去向 |
| 英语语义与用法正确性 | 25 | 义项、语法、词性、搭配、音标、语域、使用场景 |
| 三部分教学覆盖与对应 | 20 | 第一、二、三部分的 `USE` 覆盖与真实用法一致性 |
| 中文译文与教学表达 | 15 | 释义、对应译文、指代连续性及教学解释 |
| 篇章整体质量 | 10 | 结构、文体、语义推进及自然表达 |
| **合计** | **100** | **评分与资格门槛分离** |

建议先把 90 分作为**实验时的候选界线**，而不是正式认证标准。只有在人为植入错误及真实人工核验样本上测到模型评分一致性与误漏报率之后，才锁定正式阈值。一个存在明确 P0 致命问题的高分章节仍然必须判为不合格。

## 11. 缺陷等级与四类终态

| 等级 | 典型情况 | 推荐处理 |
|---|---|---|
| P0 致命 | 错误词源被标为权威、核心义项反向讲解、系统性内容伪造 | 阻断认证，要求修订 |
| P1 重大 | 关键义项漏教、错误用法、错误语域、用法标记明显造假 | 阻断认证，要求修订 |
| P2 一般 | 个别译文或教学说明有明显可改善之处 | 进入分项扣分和可定位建议 |
| P3 建议 | 可选措辞、表现手法、篇章结构优化 | 不自动认定缺陷 |

判定状态建议明确区分 `passed`、`failed`、`needs_evidence`、`incomplete`。网络/模型故障属于 `incomplete`，不是失败的教材质量。质检过程能产生一份评语不代表完成质检。

**反向约束**：项目明确接受因完整覆盖全部词义而产生一定教学编排感，因此不能仅因目标词密集、文风不够朴素、题材特殊就判 P1/P2。只有真实的语义、语言、组织、证据或教学问题才能形成缺陷。

## 12. 审计执行阶段

**阶段 0｜申请与快照**：接收用户申请，绑定正式章节 `digest`，生成幂等 `requestId`；同时锁定生产协议版本、VIX/教材版本、完整可复核工作证据摘要。若原证据不存在，早期呈现范围限制。

**阶段 1｜确定性审查**：运行编码、词数、顺序、正文结构、译文配对、所有 `USE` 至少被标记等程序检查；所有错误必须返回精准 `location` 和解析证据。

**阶段 2｜逐词双教材审查**：每个主词及衍生建立独立记录，读取原始 Collins/Oxford 对应词条与交接文档，确认“纳入、与何项重复合并、排除理由、尚不确定”四种去向，特别防止 Oxford 独有义项和无标题的交叉引用丢失。

**阶段 3｜跨部分语义审查**：检查第一部分所有用法与第二部分例句、第三部分相应句子的实际语义相符；出现词形绝不等于使用该义项。

**阶段 4｜全文连贯与译文审查**：整体阅读英文长文及中文译文，检查指代、事件顺序、风格、质量；不得机械要求固定体裁或长度。

**阶段 5｜反证与报告签发**：对 P0/P1 和证据冲突单独复核；规则程序统计审计是否覆盖所有必须对象、是否完成证据回读、是否存在阻断项。Codex 不能自己创造“已审核全部”的凭据。

NIST 的 AI RMF Measure 建议把测试集、指标、方法、局限和独立审查纳入评估记录；W3C PROV 用实体、活动与责任主体表达资料溯源。这些是设计方法上的外部参考，不代表项目已有 NIST 或 W3C 认证。[R14][R15]

## 13. 架构方案与数据契约

应新增独立 `chapter-quality` 业务模块，并在现有队列路由中支持 `kind=chapter-quality`。前端不得向质量审计接口提交任意来源文本伪装为权威教材；来源应由服务端/有权本机运行环境根据固定 ID 读取并验证。

**推荐 API（尚未实现）**：

```text
GET  /api/chapter-quality?chapter=<id>&digest=<sha256>
POST /api/chapter-quality                # requestId 幂等申请
GET  /api/chapter-quality/<requestId>    # 状态/概览
GET  /api/chapter-quality/<requestId>/report
POST /api/chapter-quality/<requestId>/retry   # 显式重试失败，不改变历史记录
POST /api/chapter-quality/jobs/claim          # 发布身份/受控本机 worker
POST /api/chapter-quality/jobs/<id>/heartbeat
POST /api/chapter-quality/jobs/<id>/complete
POST /api/chapter-quality/jobs/<id>/fail
```

业务记录（概念性）：

```json
{
  "requestId": "<uuid>",
  "chapterId": "YYYY-MM-DD",
  "chapterDigest": "<sha256>",
  "qualityPolicy": "CQA-v1-experimental",
  "sourceSnapshotDigest": "<sha256-or-null>",
  "state": "queued|running|needs_evidence|completed|failed|interrupted",
  "completedScope": ["structural", "internal_semantic"],
  "decision": "passed|failed|needs_evidence|incomplete",
  "totalScore": null,
  "findingsDigest": "<sha256>",
  "reportDigest": "<sha256>",
  "createdAt": "<ISO8601>",
  "finishedAt": null
}
```

子缺陷：`findingId, severity, category, wordId, useId, sentenceId, exactQuote, sourceLocator, rationale, evidenceState, suggestedAction, reviewState`。`exactQuote` 先以原文逐字验证；来源采用定位而非默认公开展示整个商业词典原文。

**恢复、成本与安全**：基于现有五分钟租约/每分钟心跳约定，只读模型执行，按词/阶段提交检查点并可续作；不能因失联自动重付不确定调用；无任务时不启动模型；任务完成后按项目额度及归档协议更新。报告保存在 OneDrive 内容寻址原件，D1 只记紧凑索引。正文、测试与历史质检报告均不可原地覆盖。

## 14. 用户界面与生命周期

入口放在当前章节标题下的工具组或与「章节测试」相邻，不添加始终占用空间的顶栏按钮，也不触发正文长按/双击的既有手势。打开侧页/弹窗展示：

- 未申请：显示「申请质检」，说明范围与依赖本机 Codex；
- 排队中/执行中：显示申请号、锁定摘要、完成范围和待处理状态；不得承诺固定完成时间；
- 完成：显示认证状态、各维度分数、阻断缺陷、P2/P3 建议及精确位置；
- 证据不足：明确缺哪个原始教材或哪项质量证据，不给虚假分数；
- 历史记录：按版本摘要查看旧报告，修订产生新 digest 后旧合格记录不可自动继承。

报告中的位置可链接 `WORD/USE/SENTENCE`，阅读器按现有稳定帧跳转；不能改写旧章节正文或重置阅读位置。失败重试与重复新审计必须清楚区分，前者沿用原 ID，后者是另一份审计活动。

## 15. 测试验收门槛

1. **回归测试**：不破坏正式章节、测试、答疑、雅思、音频、VIX 及现有身份、存储和归档。
2. **定位测试**：至少人工插入遗漏义项、错义词、错误例句、错误 `USE`、错误标注、误译和跨句指代混乱等故障；记录能否识别且定位准确。
3. **误报测试**：选择语义正确但文章风格特殊、词汇覆盖密集的章节，验证不会因审美偏好大面积扣分。
4. **证据缺失测试**：故意断开词典证据、原件回读或工作文档，最终必须输出 `needs_evidence` / `incomplete`，不得签发完整认证。
5. **队列测试**：重复点击、请求丢响应、锁超时、孤儿任务、失败重试、重复回调、先后顺序、电脑离线及章节新修订。
6. **存储测试**：OneDrive 写入后回读 SHA；不得因单次故障生成两份不同证书或丢失旧审计。
7. **UI 测试**：iPhone Safari 正文位置、三部分导航、沉浸模式、弹层焦点及无障碍状态；不把实验截图当作真机验收。
8. **认证门槛校准**：由明确的人工基准缺陷建立最小校准集，记录 precision/recall、严重度误判与重复运行稳定性，然后再决定阈值。

# 第四部分：合并路线、价值与决策

## 16. 两项进化方向如何结合

二者共有的底层需求是**版本化证据**：词源权威化要求每条语言历史断言知道来自哪本书/哪次数据提取；CQA 要求每条评判知道基于哪个章节、哪份教材、哪一次审核与哪套标准。两者应共享来源引用、摘要、许可字段与不可变报告机制，但不能共享不相同的认证结果。

建议资产层划分：

| 资产 | 单独审核范围 | 是否自动受 CQA 认证覆盖 |
|---|---|---|
| 章节正文 | CQA | 是，按 CQA 策略 |
| 历史词源资料 | EQA（词源权威核验） | 否 |
| 章节理解测试 | TQA（无歧义与答案正确性） | 否 |
| 预生成/按需语音 | AQA（发音、对齐、缺损） | 否 |
| 学习者答卷 | 学习成果记录 | 否，属于个人测评 |

不能用单次学习者测试满分去证明教材优秀；也不能因为教材 CQA 合格就为未生成的随机试题背书。

## 17. 优先顺序和停止条件

**P0：构建证据清单。** 冻结 VIX 和有代表性的正式章节，确认词典原件是否可依法访问、逐词工作证据是否存在，定义缺失证据时的终态。

**P1：词源离线覆盖实验。** 对完整 VIX 词池在许可允许范围内进行 Wiktextract 匹配，测量有效、歧义、多源、无词源比例；挑样本交叉查 OED/Onions/Chambers。若未证明数据准确且许可可行，暂不加入正式内容。

**P2：CQA 离线审计验证。** 在若干真实章节上测人工已知缺陷、假阳性和语义覆盖，建立完整报告格式和门槛。若缺少双教材原件，先交付明确标记的「章节内审」，不要升级名称。

**P3：CQA 正式按需申请。** 在不破坏阅读器与原队列的前提下上线，存储不可变报告，支持重试与历史检索。独立词源 EQA/TQA/AQA 延后规划。

**明确停止条件**：资料授权不成立、可审证据无法取得、关键缺陷识别率不可接受、虚假认证率偏高或回归测试破坏既有功能时，不推进完整认证发布。

# 第五部分：资料索引与证据等级

以下 URL 是可自行访问的权威入口或研究材料；资料取得方式不同，报告中的规模数字与许可陈述以各条对应来源核实为准。

| ID | 名称与性质 | URL |
|---|---|---|
| R01 | OUP，OED 2026 年 9 月更新公告 | https://corp.oup.com/news/new-to-the-oxford-english-dictionary-september-2026/ |
| R02 | Google Books，Onions 等《The Oxford Dictionary of English Etymology》书目说明 | https://books.google.com/books/about/The_Oxford_dictionary_of_English_etymolo.html?hl=en&id=004YAAAAIAAJ&output=html_text |
| R03 | Hachette/Chambers 出版页 | https://www.hachette.co.uk/titles/chambers-2/chambers-dictionary-of-etymology/9780550142306/ |
| R04 | WorldCat，Barnhart/Chambers 书目源流 | https://search.worldcat.org/title/Chambers-dictionary-of-etymology/oclc/41581681 |
| R05 | Online Etymology Dictionary 官方站点 | https://www.etymonline.com/ |
| R06 | Oxford Dictionaries Lexical Data API 官方说明 | https://developer.oxforddictionaries.com/lexical-data-api |
| R07 | Oxford Dictionaries API 授权条款与 FAQ | https://developer.oxforddictionaries.com/api-terms-and-conditions?tab=noncommercial ; https://developer.oxforddictionaries.com/faq |
| R08 | Merriam-Webster Collegiate Dictionary API 产品页 | https://dictionaryapi.com/products/api-collegiate-dictionary |
| R09 | Merriam-Webster API 非商业条款 | https://dictionaryapi.com/info/terms-of-service |
| R10 | Kaikki 英语版数据下载与版本 | https://kaikki.org/dictionary/English/ ; https://kaikki.org/dictionary/rawdata.html |
| R11 | Wiktextract 字段定义 | https://github.com/tatuylonen/wiktextract/blob/master/README.md |
| R12 | Wiktionary 版权政策 | https://en.wiktionary.org/wiki/Wiktionary:Copyrights |
| R13 | GCIDE XML 官方镜像/许可 | https://www.ibiblio.org/webster/ |
| R14 | NIST AI RMF Measure 核心要求 | https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ |
| R15 | W3C PROV-O 溯源标准 | https://www.w3.org/TR/prov-o/ |
| R16 | NIST，机器生成报告评价论文（SIGIR 2024） | https://www.nist.gov/publications/evaluation-machine-generated-reports |
| G01 | 第二语言项目仓库 | https://github.com/Gual-Wells/The-Second-Language |
| G02 | 逐词质量协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/QUALITY_WORKFLOW.md |
| G03 | 正式日课协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/DAILY_RUN.md |
| G04 | 双教材处理协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/CONTENT.md |
| G05 | 三部分关联编码 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/ANNOTATIONS.md |
| G06 | 正式章节测试协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/CHAPTER_TESTS.md |
| G07 | 章节答疑协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/CHAPTER_QUESTIONS.md |
| G08 | 存储协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/STORAGE.md |
| G09 | 阅读器交互协议 | https://github.com/Gual-Wells/The-Second-Language/blob/main/protocol/READER_INTERACTION.md |
| G10 | Codex 任务执行器 | https://github.com/Gual-Wells/The-Second-Language/blob/main/scripts/question-worker.mjs |
| G11 | 后端问答队列 | https://github.com/Gual-Wells/The-Second-Language/blob/main/worker/src/questions.js |
| G12 | 正式章节测试路由 | https://github.com/Gual-Wells/The-Second-Language/blob/main/worker/src/chapter-tests.js |

**证据等级声明**：R01/R03/R06/R07/R08/R09/R10/R11/R12/R13/R14/R15 为机构/项目官方文件；R02/R04 为可靠书目资料；R16 为学术研究；Gxx 为项目源码与协议。有关授权的解释是工程风险判断，不替代律师审查或取得权利人正式许可。

# 附录 A：本对话用户原文（逐字）

**U1｜关于词源权威化**  
探索一下第二语言项目可能仅剩不多的进化方向，即词源权威化，这部分不能依赖ai生成，因为批量生产质量必然难以保证，去找找有没有权威电子或纸质信息源，只有几百几千个的别看了，需要找的是那种系统性的

**U2｜关于章节质检申请**  
还可以考虑增加一个功能 质检申请 在章节内点击质检申请 向codex排队申请质检本章节 给出合格认证或者其他评分评价之类的规范分析 研究一下

**U3｜报告编纂要求**  
把我们的对话原文与相关资料提高成报告

# 附录 B：对话文字留存说明

本报告另附 `conversation_text_archive.md`，将 U1、A1（两段回复）、U2、A2（两段回复）、U3 的可见文字按发生顺序整理，保留了表格主要文本、推荐结论与项目边界；对于交互式演示卡片，记录用户可见内容与其演示性质，而不冒充软件已上线。**该独立附录是文字归档，不是平台生成的原生聊天导出文件**。后续若获得原生导出，应逐消息比对并用原生导出替换，以满足严格意义上的全文逐字复原。

# 附录 C：实施决策记录

- **已确认的研究目标**：系统性词源资料、不依赖 AI 批量生成；按需 Codex 章节质检、规范报告与合格判定。
- **已检索的事实**：大规模词源资源存在；官方 API 提供字段但许可限制明显；现有仓库能承载排队与版本化存储，缺少完整独立审计及来源证明。
- **未作的产品决定**：是否购买专业授权、是否采用 CC BY-SA 词源内容、正式 CQA 通过分数、是否自动修订、是否将质量评分公示、是否启用词源独立认证。
- **强烈建议的约束**：原始来源与 AI 归纳分离；缺证不得认证；旧报告不能转移到新 digest；重大缺陷不能被总分抵消；与现有测试、音频、纪念币认证严格分离。
