# 双教材用法标签核查与既有章节纠错

日期：2026-10-09。范围：实际项目教材的标签系统、三个已发布章节中本轮核实的说明及归义错误。本文不宣称已独立重新审计全部 120 个主词的每一句内容。

## 依据及边界

**VERIFIED**：直接读取 VIX 固定快照 `8dbe5ba9cc6a7b761cfc5dd0f8a813c1dcb94150` 下的两份完整教材文件，并回查 `work/runs/<date>/words/<word>.md` 的逐词原文、原例句与内容映射。

| 文件 | SHA-256 |
|---|---|
| `textbook/Collins_COBUILD_Chat_Project.md` | `cf35b72932429ca37060862d409094fee8bbadef8b9e34f3cc3886f19b087634` |
| `textbook/Oxford_English_Chinese_Chat_Project.md` | `2bb3812361347c869af310843e013ee41af1078317376e34470cf94b8b6f6cd8` |

实际 Oxford 文件有 `Phr & Deriv`、`colloq.`、`archaic`、`hist.` 等缩写与中文标记。不能只凭文件标题或现代网站的版次介绍，假定它的排版和标签与当前 OALD 网站完全一致。官方网站用于解释维度和补充核实；当前课程归义、例句保留和标签原文仍以这两份固定文件为依据。

资料收集、标签检索计数及生产摘要校验结果留在本地 `.cache/usage-labels-2026-10-09/`、`.cache/learning-quality-2026-10-09/`。计数是文本匹配数，可能包含重复条目，不能当作精确的独立义项数。逐词原材料继续使用现有永久工作文档归档链路，不另复制整本教材进项目仓库。

## 实际系统

| 维度 | Collins 文件中的标记 | Oxford 文件中的标记 | 核查结论 |
|---|---|---|---|
| 媒介 | `SPOKEN`、`WRITTEN` | `colloq. [口]` 等语体标记 | 口语化与口头专用不同；两书也不是完全同构的体系。 |
| 正式程度 | `FORMAL`、`INFORMAL` | `formal [正式]`、`colloq.`、`slang` | Collins 同时存在正式且口头、非正式且书面的组合；不能把正式直接翻成书面。 |
| 文学、修辞 | `LITERARY` | `literary [文学用语]`、`poet. [诗]` | 文学或诗歌用途不自动表示已过时、生僻。 |
| 时代、历史、频度 | `OLD-FASHIONED`；其他必须按实际词条核查 | `archaic [古义]`、`hist. [史义]` 等 | 古旧表达与历史制度名称不同。未标记不能证明高频，也不能证明少见。 |
| 地域 | `AM`、`BRIT`、组合及方言标记 | `US`、`Brit.`、`N. Amer.`、`Austral.`、`NZ`、`dial.` | 要区分读音、拼写、义项的地域作用范围；`also` 与 `chiefly` 不得丢失。 |
| 领域 | `TECHNICAL`、`COMPUTING`、`MEDICAL`、`LEGAL`、`JOURNALISM` 等 | `Geol.`、`Chem.`、`Law`、`Eccl.`、`Naut.` 等 | 具体领域优先；专业用法不能统一变成正式或学术。 |
| 态度、交际效果 | `APPROVAL`、`DISAPPROVAL`、`EMPHASIS`、`RUDE`、`OFFENSIVE`、`HUMOROUS` 等 | `derog.`、`joc.`、`euphem.`、`offensive` 等 | 保留褒贬、冒犯强度、委婉和强调，不仅解释字面意义。 |

此外，Collins 的 CEFR、频率符号、词性与方括号句法模式，Oxford 的词性、及物性、数和位置限制，都需要理解，但不应误当语域。`esp.`、`usu.`、`often` 等表达偏好，不能升级为排他规则。

## 教学决定

**USER-DECISION**：目标是章节学完后基本掌握所教词汇，包括不同义项及其实际适用语境。为了全量用法覆盖而牺牲部分范文的普通读物自然度是已接受的取舍。不能以低频、难安放或故事不够自然为由删去教材义项、词族或原例句；也不能把特殊义项一律降为“可以不用学”。

仍须纠正真实的英文语义、语法、语域错配、译文和事件连续性问题。说明标签的目的，是知道什么时候怎样使用；不是把所有词贴成一套高频／低频的背诵优先级。

落实位置：`protocol/USAGE_LABELS.md` 是标签语义与审阅要求的统一入口，`CONTENT.md`、`QUALITY_WORKFLOW.md`、`DAILY_RUN.md` 和根 `AGENTS.md` 引用它。正文利用既有义项说明段落，不增加新的 UI 标签组件或正文部分。

## 本轮既有内容修正

生产基线为 2026-10-02、2026-10-06、2026-10-09 三章的固定摘要正文，均先与后端记录的 SHA-256 校验。WORD、USE、SENTENCE 编码保持原状。

| 章节 | 修正及依据 |
|---|---|
| 10-02 | `legislation` 的原 `EXAMPLE:U043` 中目标词表示法律文本，改归 `U042`；保留原句和译文，给“立法过程”补一个确切体现议会职能的例句。补 `ecosystem` 的生态学专业说明、法律文本义 `legislation` 及 `outweigh` 的正式说明。随军流动医院义保留，撤去未记录独立证据的“较少见”断言。 |
| 10-06 | 补地表盆地、`contingency` 作定语、`precautionary`、`bear witness to a fact` 的已核实领域或正式说明。不将这些标签扩散到同词其他义项。`climatical`、`droughty`、`shelterer`、`witness` 抽象名词及新西兰围养地 `runoff` 的少见判断没有在当前教材／工作文档中找到独立依据，改为明确的形式、对象与义项区分；并非反向宣称它们常见。 |
| 10-09 | `freshwater` 乡下学校义实际只有美国地域标记，没有古旧标记，撤去“美国旧式”。`reclaim` 驯服义无旧式标记，撤去“较旧”。补一般减轻义 `mitigation`、恢复名誉义 `rehabilitate`、植被义 `vegetation` 的正式说明。清除教材名和内部 USE 编码等面向制作流程的文字，替换为学习者需要的具体说明。`deteriorative`、`mitigatory`、名词 `reclaim`、`tributarily`、`tributariness` 撤去同样缺少独立依据的频度断言，但完整保留其义项、例句和范文用法。 |

有实际来源的古义、历史义、口语、地域、专业等说明继续保留，例如 `drought` 干渴古义、`ordinance` 布局古义、`tributary` 进贡历史义、`precautions` 避孕口语义、`density` 愚钝的口语贬义。原文只写“尤指”的地方仍保留这一边界。

三个第三部分全文保持不变；第二、三章英文例句与译文保持不变，第一章保留全部原例句与译文且只增一例。第一、二章历史元数据中的“课”同步显示为“章”。不重新选词、写 VIX、领取日课或重新生成语音。

## 验证及发布边界

必要检查：三章逐一执行 `pack-chapter.mjs`；比较修改前后 40 主词和全部 USE／SENTENCE 身份；逐条比较范文和原例句；运行已有 `check-publishing-closure.mjs`，验证历史摘要可回读且纠错发布不会消耗下一章音频配置。最终生产发布还要确认新摘要可读取、旧摘要仍可读取及章节目录仍为三章。

结构检查无法替代逐义语义审阅。本轮没有实测长期记忆率，也没有声称达到某个 CEFR、IELTS 分数或掌握率。当前能够保证的是明确的教学目标、可回查的标签依据，以及本轮具体修正的内容与数据不变量。

## 官方补充资料

- [Oxford 的标签说明](https://www.oxfordlearnersdictionaries.com/about/english/labels.html)：核实正式、非正式、文学、时代、态度及领域维度的解释。
- [Collins：Grammar and register](https://collins.co.uk/blogs/collins-elt/grammar-and-register)：核实语法形式和语域、口头与书面场景的关系。
- [Collins：Nonstandard usage or error](https://collins.co.uk/blogs/collins-elt/nonstandard-usage-or-error-where-should-we-draw-the-line)：核实不能脱离使用场景把非标准表达一概视为错误的边界。
- [Collins：climatic](https://www.collinsdictionary.com/us/dictionary/english/climatic)：补查 `climatical` 为变体，不把未记录的低频判断伪装成教材原标签。

外部页面会变化；实际教材文件的不可变定位和摘要在上表，既有课程仍可按自己的 VIX 与协议版本恢复。
