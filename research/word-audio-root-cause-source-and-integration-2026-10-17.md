# 第二语言单词音频独立研究：失败原因、读音权威、确定性生成与最低侵入集成

> **日期** 2026-10-17；**生产只读基线**：The-Second-Language@85355e200705f9fc55ff92dab36f85e569884d96。**前置项目全局审计**：research/project-complete-architecture-history-audit-2026-10-17.md（commit 70823c5ca75c58a1d56a1e651c0ac7587dfee417）。**任务范围**：先理解全项目及历史，再独立研究用户提出的两类单词：第一部分二级标题带 IPA、其余英文单词；探讨不费时的上下文读音。**本次没有启用词音、没有付款生成新云音频、没有申请新服务或修改生产代码、没有批准旧章升级**。

## 0. 从上次失败研究中必须纠正的七点

1. 项目在十月初**已做过** Azure、Polly、Google IPA/SSML 研究，并在十月九日用 Kokoro/Misaki 两个真实音素覆盖探针验证解析生效；照搬“存在 IPA Reader / 使用词典”不是新的工程价值。
2. Bella 在十月四日的三个独立单词试验得到本人 5 分，但用户后来反馈大量孤立词错误并在十月十日取消，主因不能从 5 分或 876 个已就绪片段推理。应追溯真实错音样本与原声、请求、返回。
3. 第一部分的 **H2 是包含义项说明的显示标题，绝非可靠的发声词形**。真实反例 flute 或 flutist 的 IPA 属于 flutist；上次统计 331 词形/337 对配对沿用首词抽取，会把“flute + flutist IPA”误算作有效配对，因此这些数只能是粗统计、不是声音可生成的权威列表。
4. Git 只提交五章，当前线上核对已七章；任何全项目比例必须注明分母来自哪种真实资料。旧章升级 v1.1 待批准，仅 Part1 文本，不应因新词音越权启动。
5. 十月十日后不是“当前服务能力不稳定”，而是 **后端在付费前直接禁止 kind=word 与 ipa**，还有数据库设置与本机队列双保险。接入要另建经用户授权的词音计划，不可绕开禁止校验或篡改原句音存量。
6. 外部词典的“有音标”和“有可分发可缓存的真实音频”不同；播放第三方 URL 也不等于取得商业再分发许可。没有验证 API、版权、口音、音频/音素一一匹配时不能直接作为永久课音源。
7. 用户不强求自然和真人，意味着**可以放弃生成式高级音色的优先权**，探索确定性的本地/开源发音引擎。但机械音仍必须念对词，不能把内容错误合理化为“不够自然”。

## 1. 明确真正任务：两条路线不同的权威等级

**A 类：PART:one 二级用法，末尾有美式 IPA。**
应按固定章节 digest、WORD/USE 定位发声单元；在原文结构中明确抽出真正 spokenForm，而非直接读第一英词。对于一个 H2 含两个可朗读形式的情况，必须解析“或/also called”并决定 IPA 指向哪一个；无法确定则标记待核实。**IPA 在这里是目标语言学事实，不是交给模型猜的提示词**。若不支持给定 IPA，允许无声和显示原因，不允许自称准确却静默调用普通拼写 TTS。

**B 类：PART:two/three 或第一部分短语细项中用户临时选中的其他词。**
不要求音频和上下文 100% 匹配。选择正常 en-US 词形默认读音、词典/程序缓存即可。仅已知同形异音且章内给出 USE 或局部上下文能确定时换读音；没有判据时允许“默认/备选”，不要求每个词都让 Codex 或大模型推理一次。特例包括 read 的过去时、wind 名词/动词、record 名词/动词、bass 的鱼/低音、live、lead、viola 等；同词性不一定同音，单纯 POS 不足以保证语义。

两类都须区分“词音内容是否准确”与“听感是否拟人”，而且**错误的词形到音标关系比声学模型的错误更早发生**。

## 2. 真实成稿数据核查——直接出现结构性错配

本次对主仓库现有五份正式 chapter.md 在 PART:one 中逐条核验：
- H2 总数 667、末尾 IPA 667、USE 总数 697。剩余 30 个 USE 位于列表或其它小用法，不自动具备音标。
- 349 个 H2 是早期“词 · 中文 /IPA/”；318 个 H2 是后期“词 中文 /IPA/”。单一中点分割算法不可靠，web/render.js 确实按“ · ”切割展示标题，缺点号的标题会保留中文说明在同一文本标签里。
- 从第一英词抽出的粗配对有 331 个不同拼写、337 个不同拼写+IPA。**这不是已经核准 337 个合成输入的证据**；flute/flutist 就给出一份明确反例。
- concert：名词“音乐会” /ˈkɑːnsərt/、动词“协调安排” /kənˈsɜːrt/，不能只按拼写缓存。
- viola：中提琴 /viˈoʊlə/、堇菜植物 /ˈvaɪələ/，同为名词；仅 POS 路由会失败。
- downstream、upstream：语法角色与重音可能不同，不能删除重音信息当作“同音”。
- 5 份章 Part2+Part3 粗抽英文总 17,021 tokens、3,472 种 spellings；这不是七章线上数，也不是形态词元化统计，但足以证明全量为普通词预生成音频浪费且容易误采无效字词。
- IPA 转换器 ipaToKokoro 对这五章的 H2 字符均通过正则许可，但至少 219 个含长度符号、27 个含 /ɝ/、21 个含 /ɚ/、148 个含拉丁 /e/ 的标题。这些映射可能改变音质或词典记法差异，“支持字符”绝不是“严格 IPA 读音已通过”。

**反例细节**（来自 chapters/2026-10-11/chapter.md）：
- 标题“flute 或 flutist 作为长笛演奏者的称呼 /ˈfluːtɪst/”，应发的词形至少不能默认是 flute；
- 标题“flute 或 fluting 建筑柱身及类似表面的纵向凹槽 /ˈfluːtɪŋ/”，同理；
- 用户未来也可能要求点主词 flute 本身，其 IPA 与 flutist/fluting 本不相同。

对于本文所谓“第一类二级标题含 IPA”，更严格的数据模型应是 (USE ID, displayHeading, selectedSpokenForm, sourceIPA, locale, provenance)，**不是(headingFirstToken,IPA)**。没有消歧的标题不自动付费/批量生成。

## 3. 最有价值的第一轮：先恢复旧词汇声音事故证据

旧方案在 10-09 曾支持词音，10-10 停用后成功原件与不可变索引仍保留。正式新合成前，应由本机有账户权限的 Codex 执行**只读**导出，不会影响既有财务/库：
- 从 PRACTICE_DB pronunciation_results 查询历史生成 digest、内容 digest、记录 digest；读取永久 OneDrive 对应完整请求/返回描述，识别 kind=word / descriptor.pronunciation 与 af_bella、model/provider/voicePolicyVersion、真实 input、TTS return size/mime/status。
- 合并临时 pronunciation_audio 的 calling/failed/outcome_unknown，不把这些状态当成功、也不主动重试；核查旧 chapter_audio_scopes/clips 与 retired 后包之间的引用差异。早期旧版本可能只凭文字区分，没有 phoneme 字段；不同版本的同词不能一律合并。
- 将可以找到原 MP3 的短词与当时实际音标、原本应该读出的 word、用户曾指出的错词做成对照；如果私人用户错误笔记未归档，标为缺证据，**绝不能从运行成功率反推音准**。
- 定量定义：TTS 实际说错 lexical identity、IPA 重音/音素失真、首音/尾音截断、重复/多音节失序、录音源损坏、缓存引用命中错误、页面提取错词、供应商重试产生不一致。这些是不同故障类别，需要不同修复。
- 每个失败样本保存 [实际呈现词、要求 IPA、真正发给 API 的字串、voice、返回 MP3 digest、人工听审结论、是否可由同输入重放]。如无私有音频权限，此项只能写为待核实，不启动公有随机实验冒充历史复现。

**关键决策门**：
- 若错在 UI 词形/IPA 对齐，换任何语音模型都会重复错误；先改解析层。
- 若错在 Misaki 映射，特定音素对照或 SSML/本地音素方案可能有效。
- 若错在 Kokoro 极短输入声学生成器，音素强制仍可能吞音/重复，应试低质量但确定的机器声音或合规录音，而不是继续扩样 Bella。
- 若错在 CDN/持久键身份/缓存，合成出新的文件只会掩盖系统问题；必须修复路径而非付款重录。

## 4. 是否真的有可用的“音标阅读器”？技术价值重新排序

### 4.1 已有资产/录音优先，但必须是真录音+可授权

Wiktionary/Commons 可能提供录音，然而一些词仅有 IPA、一些词的录音不是 en-US、一些多读音不能对应 USE。需通过 Meta/Wikimedia Commons 文件版权/署名与具体音频逐项核实；**不建议设计需要到公网随机下载并复制全词库 MP3 的默认链路**。

Merriam-Webster 官方 Dictionary API 对个人非商业开发一般允许免费账户，FAQ 明确 1,000 queries / API key / day、需要注册 key，超量/商业应用须许可，使用还有品牌要求。它可以成为真实的字典音频查询候选，尤其日课 40 主词的数量远小于日限；但具体词义、音标、录音可重分发权利仍需核对，不应自动上传所有响应到 OneDrive。它的书写型发音码不等于可直接对齐教材 IPA。官方：https://dictionaryapi.com/info/frequently-asked-questions

开源 CMUdict 是**音素词典而不是音频资源**。如果使用它，作用主要是给 B 类普通字词提供 ARPAbet 候选以及 homograph 信号；无法满足“查到一条就能播放”，也不会自动知晓章节用的是哪一个义项。公共 freeDictionaryAPI 的 audio URL 可能指向第三方托管地址；即使返回成功，也不能假设这些第三方地址可永久打包再分发。

### 4.2 不建议为每次 A 类点击实时访问“网页 IPA Reader”

用户所说的音标朗读网页若只提供 GUI 而无公开稳定合约、自动化接口和服务可用性承诺，则不宜成为个人 PWA 永久功能依赖；其后台同样可能是 Kokoro 类神经 TTS。必须在独立实验验证 API/服务条款和是否接受本章实际 IPA，不能把用户能在网页试听当成工程接口已经可用。

### 4.3 针对用户“自然度不强求”，更值得研究的是本地确定性合成

[eSpeak NG 官方字典文档](https://github.com/espeak-ng/espeak-ng/blob/master/docs/dictionary.md)说明其语言词表和发音规则以及专用音素助记符系统；不是把任意标准 IPA 塞入命令行就能读的通用“IPA 引擎”。其开源、可离线、机械音质和短语音高确定性，对 B 类比复杂云模型更具系统价值。如果 A 类要求跟目标 IPA 一致，须实现有证据可核对的 IPA→eSpeak 音素映射/例外词表，**不能仅凭调用成功宣布严格符合音标**。早期研究已经许诺“低价容易获得”，本次真正的新方向是“把单词发声从概率声学生成变为可复算数据生产”。

**本轮亲自进行的本地功能小实验**：执行主机预装 eSpeak 1.48.15（**不是 NG**）的 en-US 文字合成，对 beetle、birch、boggy、caterpillar、accordionist、record、read、wind、viola、resume 共 10 个词输出合法 WAV。22,050Hz 音频样本，时长约 0.666–1.030 秒。命令行 IPA 输出显示：
- record → /ɹˈɛkɚd/，默认倾向名词；
- read → /ɹˈiːd/，不自动选过去式；
- wind → /wˈɪnd/，不自动选缠绕动词；
- viola → /vaɪˈoʊlə/，不能匹配两种义项全部变体。
这证明本地机器可离线、无云 TTS 成本地为很短的词产生可解码文件，**还证明普通拼写朗读无法解决同形异音**；未进行人工听审、未验证音标注入能力，也不宣称旧引擎的准确率代表 NG 的准确率。不会以没有真实试听的 WAV 自动通过发布。

### 4.4 可控 IPA 供应商只是 A 类必要时的质量兜底

Google Cloud、Azure、Polly 是既有历史报告已列出的路线。关键不是支持 SSML 的标签，而是**具体 en-US voice/engine 是否支持章节实际使用的全部音素和重音写法**。例如 Google 官方 en-US 支持表采用音素 ɚ、ɹ、ʧ/ʤ、ʧ、长度指定等；五章多处存在 /ɝ/、ASCII /r/ 与 IPA 特殊记法，直接传入可能不匹配官方接受格式，要做经过验证的转写。Google SSML phoneme 覆盖还有一个词/语言范围的限定，不能假设任意“词组+一个 IPA”都可单标签解释。

若最终需要第三方付费的 IPA SSML：先确认个人账户能开通、地区/付款有效、能从现有 Cloudflare 按需路由、可持久化 MP3、API 权限及单个词真实费用；未做就写“可提供受控合成，现实接入待证实”，不应凭价格表宣布优胜。新的付费服务不能为所有日课另外安排一个订阅；只用极少数失败的 A 类补例外或替换单独音源。

### 4.5 备选：句子裁切并非默认最优

Bella 句子好于孤立单词，直觉可能建议把词放进承载短句后剪出来。但真实语音有连读、句子中重读和协同发音，纯字符串找不到毫秒边界。Whisper 或专用 forced aligner 可给候选位置，但裁切前后音素尤其辅音/尾音容易受损，且增加工程 CPU、生成/对齐时间并可能影响教学字音。可在别的音源全部不合格时做隔离 A/B 实验，不能未经试听直接称其优于机器短词；原项目 Whisper 的用户口语词级 timestamps 也不是 Bella 生成语音的可靠逐词切分证明。

## 5. 两轨最终建议（更贴合项目的工程价值）

### 5.1 不要先建一个通用“新单词 TTS 平台”

建议**一套小型词音索引层 + 两条不同的生产决策**，下游仍复用 OneDrive 和 D1：
- Part1: 从冻结章节 WORD/USE 的结构化使用记录提取多个候选 spokenForm 与现存 IPA，先检查是否已有经听审的历史原件；正常直接返回资产。如果 IPA/词形对齐无法确认，停止自动合成并提出核对。
- 普通选择: 复用内置或预先准备的 en-US 拼写字典/机器音频；对未知词手工动作触发一次异步生成并缓存，后续纯读取；不为页面渲染、逐词扫描或 3,472 个全体拼写提前付费。
- 优先采用无需实时外部 API 的本地确定性声源用于 B 类，A 类先小样实测原有 Misaki 强制音素与**独立**确定性音素声源，真实结果决定路线；用户可接受机械音，则更看重 lexical fidelity。
- 对含歧义词做极小的明确 exception table，按词义 USE + 句子位置指针或真实 tense/POS 选择；未解决时使用默认读音并标示“非上下文确认”。不让独立第三方 LLM 每次点击重新理解文本。

### 5.2 极小的数据身份，避免把整章/整个上下文重新存一遍

一份章节引用：
    ChapterPronunciationRef = (chapterDigest, useId, displayHeading, selectedSpokenForm, expectedIPA, sourceVersion)
一份音频原件：
    LexicalAudioAsset = (normalizedSpokenForm, locale, pronunciationEncoding, pronunciationCode, providerOrRecordingSource, engineVoiceVersion, audioDigest, licensing, verifiedStatus)
一份普通句内 token 选择：
    SelectedToken = (chapterDigest, sentenceId, tokenRange, normalizedSpokenForm, selectedPronunciationOrDefault)
三者靠 digest 和 clip id 关联，而不是把整章复制到每个词音请求；对用户权限和未生成状态继续沿用现有库规范。

为何不能仅把旧 IPA 写进音频 identity：如果实际目标是 flutist 但当前页面抽出了 flute，那么输入身份完全合法、内容却错。必须先校验目标词形+IPA 与真实 USE/词典词义对应。在新策略里先把输入结构从页面解析抽成可复查的纯数据，不另造内容意义规则。

### 5.3 上下文快速消歧策略（不要求语义完美）

优先级：
1. 用户就在 Part1 有明确 USE 的某词条：直接使用该 USE 已批准音标+spokenForm；
2. Part3 SENTENCE 明确引用某 USE，且该词语出现在句内并形态一致：尝试已验证的语法/词义绑定；
3. 词条只有一个可靠读音、或屈折规则无争议：默认；
4. 高频歧义表命中：用 already-known POS、时态、固定搭配、章节 sense hint 的轻量规则选择；
5. 仍存在几个实质不同的读音（如同为名词的 viola 或 bass）：显示默认读音和可点选的另一个读音，**不要求为一点概率提升每词实时调用 Codex**；
6. 用户纠正后只保存本章当前 token 的选择，不覆盖全词库同拼写的其他语义。

这把读音解析从“每次点击执行文本分析”转为“此前初始化时一次性建立小字典 + 普通词首次点击时 O(1) 索引 + 缓存读取”。**O(1) 是近似查表复杂度，不是实际网络延时毫秒保证**，iPhone 上实际 p50/p95 要通过上线前受保护试验测量。

## 6. 真正的实施路径及其对当前旧协议的零破坏性

**必须尊重目前**：web/audio-plan.js 的 chapter-sentences-only-v2；Worker POST /api/practice/pronunciation 提前拒绝所有 word/IPA；audio-worker 跳过 word，migrations/0011 和 0015 管理下一章句音，不可撤销。现行 Bella 声音路由非听力固定，不要未经同意通过新代码把原协议静默替换。

建议先做独立研究/原型命名：
- 新 lexical-audio resolver/read-only inventory：纯读取/查询语义和旧成功原件；A 类候选与 B 类拼写目标仅在显式点读操作返回，不能作为现有 POST 接口的“后门”。
- 在研究许可及用户确认新规则后，另建受控接口，例如 /api/lexical-audio/resolve、/api/lexical-audio/request、/api/lexical-audio/clip。请求必须服务器端核对 chapterDigest/USE/tokenRange，不可接收任意客户端 IPA 就扣费。生产代码暂不变更。
- 用户手势：第一部分 IPA 附近独立低干扰播放入口；第二/三部分保留“点击整句 Bella、点击标题跳首部、长按/双击答疑”，词音通过文本选择小菜单明确触发，防止 iOS 默认选择和答疑争抢。
- 资源：已有前端 30 条已解码音频内存策略可借鉴，但词音数量和声音负载不同，必要时为词音增加独立 LRU 配额；离线小包按内容摘要打包，禁止每词一次 OneDrive list/Graph refresh，也不得每次点击写多笔 KV。一次写入永久原件并核验后，成功资产永久复播无需收费。
- 分包：现有句子包与旧 manifest 不应被改造为收纳词音的“升级版”并覆盖。新增可选索引/词音包，也不能让“下一章默认满配句音”的计费开关悄悄包含词汇。
- 法律与来源：第三方词典文件未验证许可时仅存解析元数据/外部合法播放路径，或自行通过获许可模型生成；完整源字典不能无条件拷入仓库。
- 历史：只追加不可变新身份与章节关联；旧失败/未知扣费不得“为了修复”直接重试，旧 Part1 的收费原件优先复用，不丢弃。

## 7. 四种路线的工程对照和条件推荐

| 路线 | 词形正确性 | 指定 IPA | 需要额外服务 | 项目位置 |
| --- | --- | --- | --- | --- |
| 历史已保存并逐条核对的 Bella 单词音源 | 以原片段听审为准 | 视当年 descriptor | 无新调用 | **第一优先：能复用先复用** |
| 受版权许可的词典真录音 | 匹配精确 recording metadata 才算 | 依词/义匹配，不生成任意音标 | 词典账号/许可可能需要 | 例外/常用词补充 |
| eSpeak NG / 确定性本地声引擎 | 需词典与短词听审；内容更可复算 | **需独立音素符号转换或专用词典覆盖** | 可在现有本机批处理，须核安装/发布环境 | **B 类首选候选，A 类待受控实验** |
| 已有 Kokoro/Misaki 强制音素 | 已有真实格式探针，但短词故障仍待归因 | 接受专门 Misaki 音素，不是任意 IPA | 既有 OpenRouter | A 类现存便宜参照 |
| Google/Azure/Polly 合规 IPA SSML | 取决于实际声线与控制符验证 | 具体支持的 en-US 音标集 | 新云资源/支付，未开通验证 | A 类困难词可控兜底 |

**初步最佳选择不是“全词转 Google/Azure”。** 如果多数 B 类单词简单可听，离线确定性引擎最值得实测；A 类音标目标经转换器验证后分级提供，复杂例外保守停下；若实际音频存在大量早期正确历史资产，以逐条回读复用最划算。

## 8. 不靠堆模型的判别性实验和验收

先实测根因，而不是先选供应商：

**阶段 P0（只读、零费用）**
- 对**生产七章**和历史原件索引做有权只读快照；Git 五章是可复算的开发样本，另两章先从生产源取得并标源。输出：H2、USE、spokenForm、IPA 对齐正确率、相同拼写多音、历史声音资产 ready/unknown、哪些有源或纠错记录。
- 对列表 USE 和或/alias H2 做原始标题解析单测；flute/flutist/fluting、concert/viola 等必须拒绝误绑定。老资产先按真实 descriptor 命中，不复写数据。
- 收集真正错读的历史 MP3 配对；不可获得时如实标空，单独做新测试，不把新的测试叫作历史复现。

**阶段 P1（小样本隔离，若需收费须另有实际授权）**
- 先挑 30–60 个有信息量的目标：清晰常见、稀见/派生、极短/极长、重音/双元音/儿化、同形异音、短语和“或”标题；所有目标都标注经人工/词典核实的 spokenForm+IPA，用户报告的真实失败词优先。
- 比较原有 Bella 仅文字、Bella 强制 Misaki 音素、eSpeak NG 常规文字、独立的可强制音素引擎；同词独立念、短承载句念时分别记录。少数必须的 IPA/SSML 商业云音源仅在确实通过账户/许可检查后加入。
- 衡量 lexical identity、音节、主次重音、目标 IPA 差异、截断/多读、MP3/WAV 解码；Whisper 转写是“读没读错文字”辅助检查，不是 IPA 对错的严格判定。
- 尤其区分“同一个词和同一个音素，Bella 在短词错误但承载句正确”与“word+IPA 原本就选错”，两种结果导向完全不同的工程方案。
- 用户只要正常/可辨音，不必为自然度、男女声的提升重复花钱；测试失败的付费请求保留 immutable request/response 和 outcome_unknown 保护。

**阶段 P2（仅用户明确批准后）**
- 第一部分 H2 的显式播放优先上线；不是全部 USE 自动预配。
- 普通词采用选择后即时/异步准备，优先默认单读词，不给所有篇章批量生成。
- iPhone 实体测试：文本选择、长按答疑、双击请求、高光跳转、整句 Bella、切页中止、CacheStorage/Range、离线、词音重复播放不重新计费。
- 生产回归：只读报告、失败保护、资源限制、word 接口授权、原句音 876 历史摘要不变、已发布章/旧版不变、英语章节测试题音及雅思不受影响。

**拒绝上线门槛**：无法证明 H2 的 spokenForm 与 IPA 正确对应；需要向无官方接口/不明版权网页偷取录音；调用未知却自动重付；客户端词选择抢走原答疑/句读手势；重新写历史索引；新词音使 Bella 日课句音失败；未获旧章升级授权就改写章源。

## 9. 研究现状、未确认事项、对后续 Codex 的具体交接

**本轮已经得到**：对全仓架构和历史的独立复查；公开 5 章 667 H2 对 697 USE 以及不同标题语法的直接静态分析；真实 flutist/fluting 目标错配案例；音频旧收费与永续复用及 CPU 事故的因果分层；10 词本机 eSpeak 1.48.15 无云合成的“可产生 WAV”功能实验；官方 Google phoneme/eSpeak/Merriam-Webster/Wikimedia 文档与项目已有旧研究之间的差异分析。

**未证明，不能伪装成已完成**：Bella 短词的具体错误率及真正病因；Git 缺失的 10-13/14 两章 H2 计数；所有七章声学原件和旧收费音频实际 ready 数量；新 eSpeak NG 的正确听感和 A 类 IPA 注入；词典音频许可覆盖比例；任何新云 TTS 账户开通或真实费用；iPhone 首次点读延迟与成功率。

**下一轮工程应该先完成的最高价值调查**：利用项目已有安全发布/归档身份只读导出**历史失败词汇输入→录音 MP3→发音目标→收费/缓存身份**，以及七章实际 USE→spokenForm 对齐试验。两项完成后，才有足够根据决定 eSpeak NG 是主力、Kokoro 强制 IPA 是否足够，或到底有没有必要接入新的 IPA 云服务。不可直接开发完再回过头试错。

### 上游官方依据

- Google Cloud 音素表：https://cloud.google.com/text-to-speech/docs/phonemes
- Google Cloud SSML：https://cloud.google.com/text-to-speech/docs/ssml
- Azure Speech 音素 SSML：https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation
- Amazon Polly SSML：https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
- eSpeak NG 音素体系与词典：https://github.com/espeak-ng/espeak-ng/blob/master/docs/dictionary.md
- eSpeak NG 音素定义：https://github.com/espeak-ng/espeak-ng/blob/master/docs/phontab.md
- Merriam-Webster API：https://dictionaryapi.com/info/frequently-asked-questions
- Wikimedia Commons 录音/许可：https://meta.wikimedia.org/wiki/Wiktionary/Pronunciations
- CMUdict：https://github.com/cmusphinx/cmudict

### 已核查的项目依据

protocol/VOICE_ROUTING.md、AUDIO_CONFIGURATION.md、AUDIO_EXTENSION.md、STORAGE.md、CLOUDFLARE_RESOURCES.md、READER_INTERACTION.md、LEGACY_CHAPTER_UPGRADE_TEMPORARY.md、ANNOTATIONS.md、CONTENT.md；research/kokoro-words-sentences-feedback-2026-10-04.md、chapter-audio-configuration-2026-10-09.md、reader-point-audio-scope-2026-10-09.md、audio-bulk-resource-repair-2026-10-09.md、tts-provider-study-2026-10-01.md；trials/voice-lab/result.json；web/audio-plan.js、render.js、reader-speech.js、native-speech.js、audio-library.js；worker/src/pronunciation.js、pronunciation-store.js、audio-config.js；scripts/audio-worker.mjs、retire-word-audio.mjs；PR #14、#16、#17、#18、#27、#34、#39、#40、#41；chapters 2026-10-02/06/09/11/12 chapter.md。
