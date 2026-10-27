# 逐义真实语境：工程与协议实施记录

基线：2026-10-27，`codex/project-commemorative`，变更前HEAD `5573946b10023df3c9b83f0d02a139860afef2bc`。本轮前已有未提交的私有`work/research/`；不将其中第三方原件或来源片段整体推送公开Git。本轮落实新默认生产合同与下游支持，不另生成/发布教学章节，不重置VIX，不恢复已中止音频。正式第1章仍为2026-10-24《运动、材料与人的生活》，SHA256 `4cc6a2f9edee37555418c365c1da29033b43c1f6854a3ac2dddf2aa9e03f7a78`。

## 前置理解与真实研究边界

复盘DAILY_RUN、CONTENT、RECOMMENDATION、双教材材料交接/标签/词源、原质量规模与文章组制作、来源发现/原件封存、阅读器交互、声音申请与永久复用、答疑/测试/质量审查、复习抽取和实际任务目录。旧三部分的正式首章及压缩/DIGRX/350词尝试是理解必要负担的历史证据，不成为新格式预算或重新启动压缩竞赛的理由。全义和真实词族聚合继续，不能把多个义项或已标注派生身份误判为异常。

前一轮私有研究位于`work/research/authentic-use-20261027/`。它围绕正式首章有目的地试验20个旧USE身份：15项保留真实来源候选、4项教学fallback、1项待证；其中一项material只覆盖旧ID中的材料分支，不能冒称整个旧ID均已解决。独立审阅曾否决把真实指南/交谈/判决重写为百科小报告的草稿。采用缩编须同时保事实条件与原语言行为，题材真实、URL存在或词形命中均不足以证明合格。

94个既有原读件的词形探针曾对326个查询词形找到133个精确命中；436旧USE有候选、244无候选是发现阶段投影，不是语义覆盖率、全章成本或找不到合格材料的证明。小样成功不能线性保证680旧USE整章生产质量、工时或学习收益。上述私有目录不在普通工作归档的默认覆盖内，不将普通归档入队称为该研究包已永久封存；正式采用的来源按CURRENT_AFFAIRS独立保存原件和读件回执。

学习者研究及实际查阅的官方/原始资料见[learner-baseline](learner-baseline-2026-10-27.md)。英语二分项自述只能支持条件计算和不均衡能力先验；没有2026实卷评分标准和口语实测，不换算精确词汇量/CEFR。初期试配B2式一般阅读、B1式熟悉话题完整表达，B2式展开作伸展；必要时把相同沟通目标拆成短交换，不降低全义教学挑战。C0尚未经用户实际识词/表达校准，不能等于已发布首章50词。

## 用户确定的新默认

- 共享只自然允许，不为共享择词、检索、合篇或考核共现/共享率。
- 每个真实用法最终1–5份语境，3仅在逐份有充分独立收益时为甜区，否则一份取优；不要求三类候选各造一份。
- 高质保真缩编优先，必要短摘、有理由的独立例句回退分别真实比较。教材全义、独有信息、真实词族、标签和词源不缩减，原例全部保留可回查去向但不强制全部展示。
- 词内顺序为标题/音标、核心义/必要限制、所选语境及整块译文、其他说明。无独立第二/第三部分。
- 一份语境一个完整译文块，固定位置、默认马赛克、点击显隐且两种状态持久化。键为稳定账户+正文摘要+context；自然共享同一对象保持一致，换账户/版本隔离。缺身份或存储失败安全退为本次内存。

正式默认仍50主词、gpt-6.1-sol/max、北京时间05:00开始、默认休息、音频空选配。旧已冻结/已标注运行按原protocolCommit和原作者稿恢复，不重新推荐/重标/转码；旧正式首章与已颁资产不改。新的输入锁和selection显式绑定authentic-context-v1，防止新运行降级为旧作者合同。

## 已实现的通路与证据导航

1. `protocol/AUTHENTIC_CONTEXT.md`是语义主合同；DAILY_RUN、CONTENT、RECOMMENDATION、QUALITY_WORKFLOW/SCALE、TEACHING_AUTHORING、ANNOTATIONS与相关下游协议已对齐。`daily-prompt.txt`由实际run-daily.ps1读取，不再保留另一份漂移提示词；旧文章生产协议明确仅历史冻结恢复。
2. `web/usage-context.js`是浏览器/后台共享新解析器，`protocol/usage-context.mjs`只重导出；`teaching-units.js`抽取原定义解析，旧三部分兼容分支保留。每WORD至少1USE，每USE1–5份，局部引用及整块译文严格检查，没有空P2/P3。
3. `scripts/lib/usage-context-authoring.mjs`从私有逐词partOne/contexts/contextChoices装配。partOne只能放唯一CONTEXT_SLOT，不能直接夹入原始语境绕过证据。materialDigest及教材/原例去向仍由原作者层核验。正文逐字匹配作者稿后才打包。
4. 来源包仍用current-affairs-v1，但新contexts索引与正文逐对象同源。原件通过validateReadRecord实读，采用来源readDigest必需；pack-chapter将逐context作者证据与该采用原件摘要一一核对。同URL的另一版、缺失读件、被改正文或遗漏绑定均拒绝。新包上限1MiB，仅来源与context索引；全文不塞D1/公开Git，OneDrive仍存不可变原件。
5. `web/render.js`与`context-translations.js`呈现单流语境；安全隐藏内容不进入复制与无障碍名称，揭示不改变块高度。保纯净模式、准确长按/词双击答疑、用法定位与完整句点读。静态壳v50包含新模块。
6. Worker发布暂存/提交验证新FORMAT和作者策略，同源封存回读；`/api/session`的稳定readerUserId来自单人部署的固定WebAuthn身份，不从可变session/凭据列表推断。未来多用户必须换真实稳定subject，当前不是多用户实现。
7. 新音频范围仅contexts，旧章two/three按原格式；标题/释义/译文不发音，原成功声音身份不变。旧选配不隐式转换成新付费授权。测试保20不同主词/7听说，全文固定摘要；质检v2检每份整块译文、实际目标义及原语篇功能，缺原读件为needs_evidence。复习完整复制所选语境/译文并重映射身份，混合新旧格式明确分开。

## 独立复核发现并修复的缺口

- 原始语境可直接夹入partOne绕过作者sourceEvidence；现只允许插槽。
- 同USE重复插槽、共享声明缺局部REF、语境插在核心义前；现逐关系拒绝。
- example一旦写来源URL曾能跳过证据；现所有采用URL都需实际证据，纯独立fallback无URL才不要求来源读件。
- 独立来源回读没有Markdown曾误走旧articles合同；现由contexts自识别，并在有正文时核对精确索引。
- 主词只有词源、零USE曾能完成50词打包；现新解析器逐WORD拒绝，旧解析器未改。
- 作者readRecord曾仅检查非空，以URL连接另一来源台账；现实际读件摘要相同才可打包，不能用另一次同URL抓取替代。

以上是确定性边界修复，不把理由字段、结构齐全或来源摘要当作语义/版权/审美质量认证。

## 验证

全部使用D盘隔离、自写材料或既有固定原件；没有真实推理/TTS、VIX写入、正式测试提交或假认证。

- `check-usage-context-authoring`：43/43，含实际50词装配、1–5/增份、共享/就地关系、原例去向、原格式原件不变及零USE拒绝。
- `check-usage-context-packaging`：17/17，真实assemble→原读件→source pack→chapter pack，篡改/漏项/错版/缺读件拒绝、重复包不变；子进程网络显式阻断并有探针核对。
- `check-usage-context-backend`：50主词、49语境含自然共享的真实SQLite/Graph隔离贯通；发布/来源回读、默认控制、旧授权不转换、点读白名单、答疑/测试/质量/复习及稳定读者身份。
- `check-context-reader`：49项，402×874及320×620 Chromium触控仿真，译文持久化/跨页签/隐私、手势、来源、质量定位、新旧格式及音频界面。没有实体iPhone/Safari验收。
- 原teaching-authoring、current-affairs-package/backend、default-controls、audio-config、point-audio-validation（2742检查）、chapter-quality、chapter-tests/7口答、chapter-questions与daily/VIX标注/发布检查均通过；daily/VIX使用模拟网络，无真实冻结/发布。
- 52个变更/新增JS模块语法通过，实际daily PowerShell语法通过。旧正式长章阅读器103项与演示章103项均通过；另保留原阅读位置/边界/跳转回归。长章曾因检查硬编码“任意文”而假失败，实际标题是“现实选读”；修正测试为核对长按前后实际标题/part/句ID不变，并显式开高亮检查无误导航/声音，生产交互未因该失败改动。

## 运行目录和发布状态

实际Windows DailyCodex Action已核对指向本D工作区、05:00；没有触发任务或改变休息。Questions和AudioPreparation在D盘second-language-maintenance，必须实际同步才能消费新格式。同步前取得原命名互斥`Local\TheSecondLanguageQuestions`与`Local\TheSecondLanguageAudio`，未停止/强杀任务；D盘保存原文件及SHA回执，逐文件原子替换并校验导入闭包。

同步包括共享解析器/测试与质检合同、质量执行器、原件校验器及所需来源目录；保留维护目录的gpt-6.1-sol/xhigh、question-worker、私有配置、队列/账本及旧修改。runtime-sources在原roots后追加新生产根，维护AGENTS加现行作用域/历史说明边界，不整份覆盖。音频执行器处理服务器给定units，不本机重新解释正文，无需改其模型或启动收费任务。实际恢复副本/回执留在`.cache/authentic-use-release/`，不公开。

2026-10-27工程提交`9155166`已原子推送至main与codex/project-commemorative。deploy-app成功发布Worker与含API service binding的Pages网关：Worker版本`125be330-35e6-41ac-a40f-e77adfce678b`，本轮Pages部署[1eee7fbd](https://1eee7fbd.the-second-language.pages.dev)，正式入口仍为[第二语言](https://the-second-language.pages.dev/)。没有新增D1迁移。

北京时间17:25最终线上回读：7个关键静态模块字节与本地完全相同，capabilities为chapter-quality-v2-contexts，未认证session不泄露readerUserId。正式章仅2026-10-24，正文及服务端digest均与基线`4cc6a2f9…f7a78`相同；restRequested=true，下一章audio=[]，支持项contexts。11个同步运行模块/资源逐文件与当前源码相同。线上已认证账户跨登录行为由隔离后端验证，本次未冒用真实通行密钥模拟登录。完整回读回执在私有`.cache/authentic-use-release/after.json`。

末尾check-balances已完成：OpenRouter $3.985898686，低于现行三次最大流程预留；Cloudflare 10000 Neurons，腾讯9978调用为估算。章节库1,568,768/500,000,000字节，雅思库1,855,488，实验库86,016，近期缓存23,018,969/1,000,000,000，OneDrive 1,395,864,372/1,104,880,336,896。没有充值、付费模型/TTS、生产领取或VIX改动。余额页已更新，普通永久归档已排队，不能称归档已完成或私有研究包已永久保存。

当前发布的是工程与协议支持，不是新课程成稿、实测个人等级或学习收益证明。新默认用于下一尚未冻结运行，仍须用户按现有设置放行，首份新全章内容须完成实际语义/采用审阅。

## 尚需真实使用校准

C0词汇基础与口语任务起点尚待轻量实际反馈；新范式首份正式全章尚未生产，因此没有新格式整章语义验收、真实工时/阅读负担或长期保持数据。1–5份和三份甜区不是膨胀配额。语言函数正确和真实采用权限仍逐份审阅；长尾材料缺口允许诚实fallback，不无限扩搜。译文状态现为同浏览器持久化与同源页签同步，不是跨设备云同步。

无新订阅、付费API或常驻服务。开发使用正常Codex、检索及部署配额；未来取材/逐义编辑仍消耗已有Codex和网络资源，主动句音频或测试音频仍按原授权/费用保护执行，不能称为零成本自动生产。

## 追加：择词防降级补丁（2026-10-27）

用户进一步要求修补新偏好可能降低原择词质量的风险。本补丁只影响尚未冻结的推荐判断，不重新选择已发布第一章或其他冻结集合。

RECOMMENDATION增加“择词质量边界与冻结前反证复核”：先保持完整教学与原B2/C1方向的实质挑战，再优化互补与近期收益；B1式口语起步、A2式拆小和B2式阅读支架不作候选词/义/主题上限。实际查起点上限、取材便利、熟悉单主题和少义短小偏置。常见/熟悉/单义本身不判差，冷僻/长词/USE多也不自证优秀；有价值而难取材的意义可诚实fallback。固定正式首章仅作真实内容参照，680 USE、旧体量和词长不成门槛。

复核发生在完整教材范围读清之后、selection冻结及VIX标注之前。结合手边真正考虑过的候选判断替换是否值得，selection.md只留实际依据与必要处理；不新增比例、分数、固定反例/备选数、逐词审计、全池重搜或固定额外模型轮数。有证据时冻结前局部修复；冻结后沿原范围修正内容，选择不足前向纠偏，不解冻、不重标。

AGENTS、AUTHENTIC_CONTEXT、DAILY_RUN、QUALITY_WORKFLOW与实际daily-prompt同步约束，learner-baseline的levelMeaning/selectionGuidance也明确非上限和质量边界。实际DailyCodex Action已核对仍指当前D工作区05:00入口；run-daily动态读取更新后的模板，因此本机生产入口已生效。本轮没有Worker/网页/API格式改动，不需要重部署网页或同步独立维护消费者，原gpt-6.1-sol/max与休息/声音控制不变。

独立只读复核未发现固定审计、等级比例、旧体量门槛、自动惩罚熟悉单义词或解冻入口。check-daily-affairs增加真实feedback-snapshot CLI隔离验证：新先验完整deepEqual、原字节SHA256、仅一次自写Response注入、新快照重放不联网/不覆盖、旧无baseline快照不补写、无效旧件保留；同时核实际模板的完整材料→推荐复核→冻结顺序。该项及VIX marking、VIX publication均通过，后者11场景/99模拟API且真实网络0；这些只证明连线与不可变保护，不能认证新50词语义质量。没有新日课生产、真实VIX标注或付费模型/TTS，真正首轮质量仍须实际选词后验证。
