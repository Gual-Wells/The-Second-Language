# 可复用的课程制作工具

2026-10-24生产回退取证后建设。语义权威仍是 CONTENT、USAGE_LABELS、ETYMOLOGY、QUALITY_WORKFLOW 和 CURRENT_AFFAIRS；工具只固定原材料、装配作者成稿及检查引用，不选择词族、融合释义、生成例句或替作者审阅。50主词、全义、真实词族、Max、05:00开始生成保持。

## 一、先取得完整词族原件

固定VIX输入后，在最终冻结前，用候选范围文件准备材料。形状沿用selection的 `mainWords`：每项 `text` 与 `family:[{text}]`，候选不需伪造VIX身份。范围由Codex阅读教材后判断；新增真实派生和必要交叉引用要继续补查。

```sh
node scripts/prepare-teaching-materials.mjs DATE --scope=work/runs/DATE/candidate-scope.json
# 冻结后复用同一范围；补查项按主词列字符串数组，不改冻结selection
node scripts/prepare-teaching-materials.mjs DATE --additional=work/runs/DATE/additional-terms.json
```

没有额外补查项时省略additional。补查文件如 `{"compensate":["compensatory"]}`；它是查找意图，不自动把查到的条目纳入教学或新增VIX标注。

工具对主词、每个实际纳入的词族词形及明确补查项分别查询完整Collins、Oxford，再取得相关词源候选。不会从旧的混合lookup集合筛选来假装补查。返回 `work/runs/DATE/teaching/materials.json` 指向不可变逐词包，包内有实际全文、原件摘要、逐词查询结果及原例句标记候选。**实际打开各包，先读Collins后读Oxford及必要上下文**；查询无命中时检查拆行派生/词组/交叉引用，不据此断言不存在。无命中项不自动排除，匹配条目也可能不属本词族。

包的摘要记录真实输入，不能证明读过或理解正确。`□`/`◊`候选保留原始片段及定位，可能包括标签、译文、重复和非本族内容，必须回到完整条目判断。不能按自动提取的候选数量推断义项数量。词源不用逐义或逐断言建表。

材料按内容摘要保存，补查不覆盖先前原件；冻结前后同一教学范围可直接复用。补查导致材料包变化后，旧作者稿必须实际核查新增内容并更新其材料绑定，不能仅换摘要宣称复核完成。

## 二、第一、二部分协同写作

在 `work/runs/DATE/teaching/authored/word-W001.json` 等文件保存模型实际撰写的自然词族；每文件一主词。第一、二部分保持完整Markdown自由表达，不引入机械释义模板。结构如下（仅格式示意，不是教学成品）：

```json
{
  "wordId":"W001", "text":"compensate", "materialDigest":"实际逐词包SHA256",
  "partOne":"<!-- WORD:W001 -->\n# compensate\n\n**词源**：实际讲解……\n\n<!-- USE:U001 -->\n## compensate · 必要短标识 /实际美式音标/\n`融合后的核心义`\n\n实际句法、搭配、语域、限制与区别……",
  "partTwo":"<!-- WORD:W001 -->\n# compensate\n\n<!-- EXAMPLE:U001 -->\n实际原例或针对该义创作的英文例句。\n`准确译文`",
  "sourceCoverage":[{"sourceId":"实际collins或oxford条目ID","disposition":"该条各项事实、标签、短语及原例进入哪些用法；必要合并或非本族排除的具体解释"}],
  "exampleCoverage":[{"exampleId":"材料中实际example候选ID","uses":["U001"],"disposition":"原例在第二部分的具体去向；真正重复的合并关系或原片段的补足方式"}]
}
```

完整材料中每份现代教材条目都交代内容去向。每条标记原例候选交代第二部分去向；确为重复、非本族、同义词举例等不纳入时，uses为空数组并具体解释原因。不能用统一“无关”措辞批量跳过。保留全部相关原例；片段按正文规范恰当补足并说明，不伪装成原有完整句。必要补写例由Codex真实创作，针对该义，译文准确，不能自动从范文选第一句补位。

sourceCoverage和exampleCoverage承接既有教材/原例去向要求，不是通过打勾就能取得的语义认证。装配会检查来源和用法身份、是否缺记录；作者仍须核对实际正文是否真的保留内容、例句是否准确。无条件复制第三部分句子的装配回退不存在。模型判断确有教学价值时可以主动共享合适句子，不禁止合理复用。

## 三、真实取材、自由组稿

词汇材料与实际读件相互启发。全义集合稳定后，以有价值的现实内容形成文章组，篇数、体裁、长度按需要决定；每篇有完整内容，不用短句碎片收容剩余USE。科技、文化、社会、历史及专业材料都可以进入；恰当部分偏向现实表达和运用，不把全部作品收窄成比较/核实/谨慎的劝导。

**词间无顺序，词内各义也无顺序。** 不按USE、词典或第一二部分排列推进文章，同词不同义可以分到不同篇。全部文章的真实用法合计覆盖完整集合；允许自然复现、无目标词的承接句及一句合理多义。文章之间是否关联或连续、如何排序，由内容与阅读判断。

创作中的意图、材料缺口和具体续作保留article-plan.md/continuity.md/resume.md即可，不另造评分或层层审批。最终可装配稿的唯一权威是 `teaching/authored/articles.json`；article.md如果用于前期草稿或通读导出，明确其阶段，不能两份同时作为终稿。格式是数组：

```json
[
  {"id":"A01","title":"实际文章标题","sourceUrls":["实际读件URL"],"paragraphs":[
    [{"id":"S001","text":"一条完整英文原句。","translation":"准确的中文译文。","uses":["U007","U002"]}],
    [{"id":"S002","text":"一条有内容需要的承接句。","translation":"与上下文连续的译文。","uses":[]}]
  ]}
]
```

实际英文记录当然写英文，不照抄格式占位内容。段落数组保持自然段；全章SENTENCE身份唯一，不能每篇从S001重计。各篇sourceUrls指向实际读取并采用的source-notes来源；同篇可采用多份材料，跨篇可共享来源，不设数量配额。不要冒充原报道原文、采访或当事人话语；基于充分材料独立编排事实和解释，必要引用按来源权限处理。

```sh
node scripts/assemble-teaching.mjs DATE
```

输出 `teaching/chapter.md` 和 `teaching/article-sources.json`，不发布、不标VIX、不调用TTS。缺独立例句、漏材料去向、重复身份、未覆盖用法、原句与译文缺失会停止；不限制文章数量或用法顺序，也不能判断文章是否有价值。分别完成教材内容审阅、每篇文章内容审阅、全组逐义真用与译文审阅后，才采用装配稿。

## 四、沿现有通路发布

把确认的 `teaching/chapter.md` 采用为 `chapters/DATE/chapter.md`，meta增加 `authoringPolicy: "sourced-collection-v1"`，并继续保留 `contentPolicy: "etymology-fused-v1"`、`sourcePolicy: "current-affairs-v1"`。source-notes顶层的articles使用导出的article-sources.json数组，其他实际读件/facts/context按CURRENT_AFFAIRS建设。

原 `pack-current-affairs → pack-chapter → publish-chapter` 通路不变。pack-chapter会重新装配并要求正式正文与作者稿一致；之后修订在作者稿进行，重新检查与封存来源。检查不是内容质量的替身。正文ARTICLE编码、来源包篇目标题/身份/来源引用在服务端也核对，不能读到甲篇却看到乙篇的来源。

所有正文和来源仍在既有OneDrive原件及D1章级索引中，不新增逐词、逐义、逐篇数据库。点读沿全章唯一句子身份和文本缓存复用；标题、来源摘要与内部去向不是朗读单元。答疑、测试继续读取固定digest的整章。

已经发布的2026-10-24章保持原件和冻结选择；本次工具建设不等于重新发布、补造源材料已阅读或补齐语义内容。旧章只供研究制作工艺，不恢复正式目录。生产验收必须在实际新章中继续检查文章内容，不能把隔离fixture的结构通过称为真实新章质量已通过。
