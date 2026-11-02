# 以VIX具体用法为入口的真实语境发现

2026-11-02用户确认：80%是研究目标，低于目标仍可正常发布。观察两项：全部USE中至少有一份合格真实语境的用法覆盖率、最终去重context中真实语境占比。它们不是出版闸门，不可为指标删义、重选容易取材的词、改kind或堆重复。实际错义、事实、翻译与采用条件仍按原质量协议处理。

## 来源池与主动通道

现有发布者目录、RSS只承担发现线索，不承诺覆盖VIX。保留原目录的质量经验，新增resources/current-affairs/context-channels.json：办事/操作、技术工作、公开对话、真实报道、文学历史、专业使用、开放网交叉检索。作者按实际义、词性、构式、对象、限制及原文要完成的交际行为选择路线；domainHints只是可能有用的出版者，不是默认全局域过滤或通用采用许可。已有原文足够时直接核同版原件，不每义强制重搜。

当一个词的新闻义容易找到而表达义/专业义缺材，按缺义向外找，不能让新闻覆盖决定教学范围。open-web-crosscheck允许走出固定目录，寻找原始发布者。SKELL等语料工具可提供搭配/构式线索，自动例句与相似词不能替代读原文、核具体意义、连续语境和采用条件；本实现不接未核实的隐藏接口或付费订阅。

## 五任务的实际操作

各任务先读完整双教材，写本组10词的完整partOne义项骨架、分配的WORD/USE和材料摘要，再运行：

```
node scripts/context-discovery.mjs targets DATE task-N
node scripts/current-affairs-pool.mjs channels
node scripts/context-discovery.mjs plan DATE task-N --intents FILE
```

FILE为作者编写的数组，每项含useId、channelId、situation、senseConstraint、queries。queries沿真正搜索工具的q及可选domains，每项计划最多4条同批实际请求；不能只搜主题，必须携带目标词/表达，必要时另查真实词形或构式。计划固定productionPlanDigest、VIX输入、selection、教材摘要及当时词义骨架；不替作者生成意义，不自动推荐、爬取全池或执行搜索。

正常检索实际屈折、代词替换或离合构式时，可显式给searchForms及formBasis，保存该变体与教材/构式的真实依据；不得用完全不同的同主题词冒充目标词形。计划保原head forms和实际searchForms，不能机械要求每个查询都原样出现词典的占位代词或基本形。

计划返回的request须实际交给live search。保存真实返回JSON及真正请求/返回时间，再执行observe的--plan、--query、--result、--requested-at、--received-at。observe保留实际q/domains与完整返回和用法关联；它只证明所声明材料的绑定，不能机器认证工具事实或已经理解来源。失败也真实保存；日志概述不得反造旧搜索。词义骨架实质改变后先核差异，不能把旧搜词结果冒充新义研究。

从结果取得原文，实际打开textPath读必要前后文。按原AUTHENTIC_CONTEXT比较保真缩编、短摘与教学例句；不把关键词命中、同主题或作者用目标词复述事实当作原文真用。对原本准备回退的常见义，检查是否只查了一个体裁或邻义；有具体缺口再做独立交叉发现，不设固定候选数、检索轮数或无限搜到80%。

## 池外发布者与原文准入

池外页面先实际核发布者身份、内容角色、正文域名、编辑/证据依据和采用条件。核验记录含schemaVersion:1、name、home、articleHosts、role、publisherEvidence、editorialBasis、rightsBoundary、verifiedAt；publisherEvidence定位真实工具/官方原件。role仅允许原始办事、技术、报道、对话、叙述、研究或机构记录角色。descriptor不是“质量通过”证书，正文仍须逐份判断。

用admit DATE task-N --file FILE保存本任务准入，得到external-身份及不可变描述文件。read/import仍传--source，并加--admission FILE；只允许逐一核验的HTTPS正文域，不能通配或改已有发布者ID。各组不并发改resources/current-affairs/sources.json。准入数据随实际读取凭据进入私有原件和采用证据，封存后不依赖任务目录或当前全球来源表。版权/署名、地区、版本、第三方内容例外仍按实际原文，访问成功和新域准入不等于允许公开复制。

## 真实语境观测与成品审阅

新prepare-vix与selection在冻结前同时写authenticityPolicy:authentic-context-observed-v1。旧锁不补写、旧章不倒改。每份sourceEvidence可保authenticUse：discourse、passage、communicativeAct、uses。passage是固定原文的实际相关原段，不是摘要；uses逐项含useId、headForm、surface、senseMatch，定位原词形、当前具体义/构式及事实依据。它是可回核教学事实，不是隐藏思维链。共享context的每个真实所选义分别有依据，不能用一个词证明所有引用。

完整验证器核所引原段确在同摘要原文内、实际词形存在、WORD/USE/词形身份及原文闭合；是否真为该义、是否保原话语功能、缩编自然度与译文仍由实际语义审阅决定。教材自写原例、词典展示例、搜索摘要及自行编造情节不因URL或kind而计为已核真实语境。

coverage DATE task-N输出本组观测；merge输出teaching/pipeline/authenticity-status.json供第一条总装实际读。数据区分已形成原文见证的真实语境、仅按kind声明的材料、未覆盖USE和未充分核实context。不把未写新见证的旧材料直接判错，也不把仅声明的数量当经过独立审阅的成功率。未达到目标继续有价值的定点研究，或按完整、可靠的现稿正常发布；不得无限返工或为数字阻止合格课程交付。

pack-current-affairs从最终作者稿与采用原文重算，随私有证据绑定原输入并保存公开的轻量比例/缺口观测；完整验证器恢复时重算，伪填数字或引用不在原件会拒绝。目标未达本身不拒绝封存、签名或发布。原PUBLICATION_REVIEW/完整验证/永久GET回读/当前指针保护、全义教学、蓝银阅读与整块译文、默认休息及空音频保持。比例和工具通过不证明学习收益，也不证明已覆盖整个VIX；实际新章与有代表性的缺口样本须分别观察。

新正式章采用chapterSizePolicy:thirty-main-words-v1，30主词、三条十词任务；旧冻结50词及five-by-ten-v1原样恢复。词数改变不删词族/义项，不改变80%研究目标和原生DIGR执行语义。
