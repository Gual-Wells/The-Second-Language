# 第四部分学术阅读

先读 EXPRESSION.md 和 PRACTICE_SIZES.md，从领取快照中的 skills、profiles 读取本次任务。来源为第一章到申请时最新章的固定摘要清单；候选来源回读正文，焦点章显著优先，题目自然关联即可，不做词汇命中配额。

## 内容建设

在 work/expression/<request-id>/reading 自由保存主题候选、三篇权威稿、题组、驳斥与实际独立作答、来源和续作说明。full 为三篇共四十题、2150–2750 词、六十分钟；每篇合理分配十至十五个计分空位，总数严格四十。mini 为三篇各八题、共二十四题、1400–1900 词、三十五分钟，完整题型覆盖与平均及以上难度必须共同满足。

写自然的学术通识长文，叙述、说明、论证可变化；至少保留有实质关系与推理的篇章。内容不依赖专业背景即可理解，有专用术语时解释。使用可靠公开依据时固定来源，不虚构实验、统计和真实机构观点；原创假设须清楚，不把外部知识当成试题答案。相关用语来自课程的自然延伸，但不能把第三部分创作稍作改名当考试文章。

先完成原文，再建设题目，最后从冻结原文独立作答。逐题记录唯一/合理允许答案、段落证据、转述关系及干扰项为什么不成立。False 必须有矛盾证据，Not Given 是原文不能决定；Yes/No 对应作者观点而非任意事实。标题不可重复用，正文取词的填空答案必须存在于原文，字数/数字上限必须一致。配对、摘要等题型不机械要求全都按原文顺序；按各官方题型本身的顺序规则组织。只提高语言理解难度，不靠含糊、遗漏或无答案提升难度。

三篇逐篇定稿后检查整套题型、字数、题量、材料与答案版本。译文逐段配对、语义连续，默认只在提交后或主动精读时返回。不能让参考译文透露到提交前题面。试卷纠正采用新版本，旧答卷绑定旧版。

## 发布产物

set.json 的 format=ielts-v2，profiles 原样复用申请。reading 数组每篇包含 id、title、instructions、paragraphs、questions、keys、links，可有 visual。paragraphs 包含唯一 id、可见字母 label、原文 text、译文 translation。每题 id 在全套唯一，number 是总卷连续计分空位；type 为 gap/single/multi/matching/diagram，family 使用完整目录，groupId、instructions、difficulty、difficultyReason 不缺。gap 另有 maxWords、allowNumber、numberOnly（仅数字时）；其他类型给 options(id,text)，多选给 answerCount。共享题面可用 stimulus.text、headers/rows、steps；图示用结构化 visual，参考 LISTENING.md。

keys 每题为 id、accepted、explanation、evidence（段落 id 列表）。False/Not Given 或 No/Not Given 的说明尤其须交代决定性缺失或反证。判断选项身份为 TRUE/FALSE/NOT_GIVEN 或 YES/NO/NOT_GIVEN，显示文字写自然的 True/False/Not Given 与 Yes/No/Not Given。

最后 node scripts/practice-job.mjs publish <request-id> set.json。后端检查来源快照、结构、词数、题量、题型覆盖、申报难度和答案对应；Codex 对语义、自然性与真实难度负责，不用结构成功冒充内容质量认证。

## 阅读、作答与分析

iPhone 在文章/题目间切换，三篇导航保存各篇文章和题面的位置；桌面可同时显示。正常测验计时，精读可提前揭示；离开/隐藏页面保留草稿和中断条件，超时不销毁本人答案而记录超时。提交后原始答案不可改写，重答新建尝试；返回允许答案、解释、译文、原文证据与课程回链。

node scripts/practice-job.mjs reading-claim 回收完整原文、译文、题目、证据、答卷、判分与条件。Codex 区分内容缺陷和理解问题，保持原始判分不变，给有证据的 summary、少量 priorities、nextStep；不要从一个错题直接断言词汇或能力缺陷。若题有缺陷先明确它，不苛责学习者。用 reading-complete <attempt-id> review.json 反馈。微缩不换算官方 band，也不与完整正确数混算。

官方依据：https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading 。微缩题量是本项目选择，非官方等值考试。
