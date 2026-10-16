# 第二语言：单词音频双轨重启及低耗时上下文读音研究（2026-10-17）

> **性质**：独立工程可行性研究与设计建议；没有执行付费合成、没有启用词汇点读、没有改动生产协议或发布代码。本文描述的是拟议方案，不是已上线功能。
>
> **项目核查基线**：main @ 471a9fbf2d12351e5e579cd387556ac8f1e2679e（2026-10-16 15:05:34 UTC 的仓库版本）；外部供应商文档截至 2026-10-17 调研。个人账号、支付状态与端到端试听未在本次研究中验证。

## 0. 结论与决策

**值得重启，但不应直接回滚 2026-10-10 停用单词音频的决定。**

采用独立于原 Bella 整句管线的双轨路由：

- **A 轨：第一部分具有明确音标的二级用法标题**。以章节中实际列出的词形 + IPA + 美式口音为准，先命中经核对的历史资产/合法词典录音；缺失时使用可明确指定音素的 TTS 合成。原 Kokoro/Misaki 音素覆盖可作廉价候选，但仅“字符可转换”不足以宣称语音正确。必要时转向支持明确 IPA SSML 的 Google Cloud、Azure 或 Amazon Polly；不能假设用户已经具备这些账户的计费能力。
- **B 轨：其余单词**。优先查已有词典音频（录音须有授权、口音与具体读音元数据）；未找到时可普通文本 TTS 或本地确定性语音合成。音质、自然度不设高要求，但不能把音频内容错误当作可接受的机械音色。
- **上下文**：每次点击只查已发布的词条/候选/轻量规则，不触发大型模型。阅读中的义项标记比句子猜测权威更高；在可确定 POS/lemma 的情况下选读音，少数难例回退常用读音或让用户选读音。不把“上下文完全精确”作为发布前置。
- **实施原则**：全新词汇路线、旧整句路线严格隔离；同样复用 OneDrive 永久文件底座、PRACTICE_DB 紧凑索引、请求幂等与未知计费保护；不自动重新生成历史资产、不改变整句满配默认、不默默给所有词批量付费生成。

选择顺序是：**有权可用且匹配读音的词典录音 → 可严格指定音素的稳定合成 → 普通拼写 TTS → 可见的不确定/失败状态**。对 A 轨，如果必须忠实于已给 IPA，不能无声降级到忽略音标的普通 TTS；对 B 轨可允许这种降级并标记来源与准确性等级。

## 1. 实际仓库证据：当前架构与过去故障保护

### 1.1 当前约束

- AGENTS.md、README.md、protocol/AUDIO_CONFIGURATION.md 确认，2026-10-10 用户停用词汇点读，2026-10-12 默认只生成第二部分 EXAMPLE 整句、第三部分 SENTENCE 整句，非听力保持 Kokoro af_bella。
- web/audio-plan.js：audioParts 仅 ['two','three']，pointAudioPolicy 为 chapter-sentences-only-v2；audioUnits 仅抽取上述两类句子；isChapterAudioRequest 要求 kind=sentence 且不接受 phonemes。
- worker/src/pronunciation.js：POST 请求如果 kind != sentence 或包含 ipa 会在收费前拒绝；worker/migrations/0011_sentence_audio_only.sql 移除旧 one 选项。单纯显示词汇按钮并不能使后端恢复发音。
- scripts/audio-worker.mjs 明确跳过任何 kind=word；worker/src/audio-config.js 的 audioDescriptor 虽仍保留带音素的历史请求描述，却不意味着当前新词汇收费调用仍获许可。
- web/reader-speech.js 已保留 reader 的 IPA 转换及 AudioContext 解码代码，但用户交互只允许例句和范文句子；第二部分词汇标题只跳转到第一部分。改动应遵循 web/DESIGN.md、protocol/READER_INTERACTION.md，不破坏既有长按/双击答疑、纯净阅读、高光导航。
- protocol/VOICE_ROUTING.md 及 research/chapter-audio-configuration-2026-10-09.md 记载过去的 Misaki Markdown 音素覆盖语法 [text](/phonemes/)；两条故意令显示词为 record、实际音素指向 Hello/Goodbye 的探针返回可解码 MP3，并由 Whisper 得到预期内容。它证明该路由曾解析音素控制，**没有**证明每个短单词都正确、稳健或和教材 IPA 严格一致。
- research/audio-bulk-resource-repair-2026-10-09.md 记录 Worker 超资源 HTML 500、OneDrive/账本未知计费等真实故障，要求保留未知结果而非自动重复付费；最终三章 876 条合法句音频资产核验。新词路由必须继承保护，而不是重复过去每次点击扫描整章的昂贵请求模式。

用户所述“Bella 整句稳定，孤立单词频繁错误”作为本次问题的已知观察；**仓库中的两次音素探针不能给出孤立词实际错误率**。因此，不以“换一个 prompt 就能解决”作为结论。

### 1.2 五章本轮实际静态统计

程序性读取并分析以下当前提交的五份章节 Markdown：chapters/2026-10-02/chapter.md、2026-10-06、2026-10-09、2026-10-11、2026-10-12。只在 <!-- PART:one --> 至下一部分之间统计 ## 标题，检查末尾 /IPA/ 格式，并逐一送入当前 web/audio-plan.js:ipaToKokoro 同等字符/替换规则测试；未发生模型合成。

| 章节 | 二级标题 | 含 IPA | 现有转换规则接纳 | 本章不重复词形+IPA |
| --- | ---: | ---: | ---: | ---: |
| 2026-10-02 | 66 | 66 | 66 | 49 |
| 2026-10-06 | 153 | 153 | 153 | 59 |
| 2026-10-09 | 130 | 130 | 130 | 74 |
| 2026-10-11 | 150 | 150 | 150 | 71 |
| 2026-10-12 | 168 | 168 | 168 | 84 |
| **合计** | **667** | **667** | **667** | **五章合计去重后 337** |

跨五章：**331 个不同的提取词形、337 组不同词形与 IPA**，存在同一词形的多读音或记法差异（例：downstream、upstream、concert、flute、viola）；**不能按纯 spelling 去重或覆盖**。表格“转换规则接纳”只代表未触发不支持字符，不代表读音正确或不同音标一定具有可感知差异。原始标题存在“词形 · 中文解释 /IPA/”以及“词形 中文解释 /IPA/”两种格式，词形提取须走结构解析而非直接朗读整行；多个标题还包含短语。部分 USE 仅为列表项，不具有本次定义的二级标题 IPA，按 B 轨或无声处理。

## 2. 技术选项核查：不要混淆“音标数据”和“音标合成”

| 路线 | 有真正的音频吗 | 能指定给定 IPA 吗 | 工程判断 |
| --- | --- | --- | --- |
| **历史 Kokoro + Misaki**（OpenRouter 现有链路） | 是 | 特定 Misaki 音素写法，可由 IPA 转换；不能将任意 IPA 原样传入 | 依赖既有账号、存储、音色；最小改造候选；短词稳定性仍需独立听审 |
| **Google Cloud Text-to-Speech，选支持 phoneme 的声音** | 是 | 官方 SSML phoneme alphabet=ipa | 标准、可验证、供应商维护；需要新的 GCP API 权限和计费，不能假设已能付款 |
| **Microsoft Azure Speech，选择支持该标签的 en-US 音色** | 是 | 官方 SSML IPA、SAPI/UPS 及定制词典 | 可控制读音；额外账号/服务开通和计费复杂度 |
| **Amazon Polly Standard/Neural** | 是 | phoneme SSML 官方支持（需按具体声音/引擎验证） | 音素精确控制候选，短词不必使用生成式高级音色；AWS 账户成本不可忽略 |
| **CMU Pronouncing Dictionary（CMUdict）** | **否，仅音素词典** | ARPAbet，多读音候选 | 可快速查询发音和判断歧义，不能当作录音服务；需转换/复核，不等于章节 IPA |
| **Wiktionary / Wikimedia Commons** | **有些词有真实音频** | 通过页面 IPA、口音标记和录音元数据匹配；不能任意由 IPA 生成 | 无须调用 TTS 的优先音源；覆盖率并非 100%；授权和音频来源需逐文件核对 |
| **Kaikki / Wiktextract** | 数据集含 IPA、音频 URL 等元数据 | 只是数据，不是语音合成器 | 可做离线词典索引；全量数据很大，不应为单人 PWA 整包下载 |
| **eSpeak NG** | 是，可离线机器朗读 | 使用自身音素助记符体系/发音规则，不能误以为任意标准 IPA 串都是其直接音频输入 | 声音机械但便宜、确定；若引入额外音标映射，需要正确性测试；更适合 B 轨或最后备用 |
| **Piper / 特定派生分支** | 是，可自部署 | 取决于具体版本、phoneme ID/输入特性，不等于所有 Piper 发行版都接受原样 IPA | 自托管维护、模型权重与适配器成本高于单次单词语音；不是第一优先 |
| **在线 IPA reader 网页** | 网页可能能试听 | 仅凭页面播放无法推定有公共稳定 API | **不作为生产依赖**，除非验证其公开 API、服务条款、音标支持和可下载许可 |
| **iPhone/Web Speech SpeechSynthesis** | 设备端播放 | 没有可跨浏览器依赖的规范化 IPA 注入保证 | 适合普通拼写即时兜底；音色及缓存行为不稳定，不能冒称已按照章节 IPA 发声 |

官方依据：
- Misaki 上游：https://github.com/hexgrad/misaki/blob/main/README.md
- Microsoft：https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation
- Google：https://docs.cloud.google.com/text-to-speech/docs/ssml 和 https://cloud.google.com/text-to-speech/docs/phonemes
- Polly：https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
- CMUdict：https://github.com/cmusphinx/cmudict
- Wikimedia 发音音频：https://meta.wikimedia.org/wiki/Wiktionary/Pronunciations
- Kaikki 全量规模与格式：https://kaikki.org/dictionary/rawdata.html
- eSpeak NG：https://github.com/espeak-ng/espeak-ng/blob/master/docs/dictionary.md

**核心辨析**：将 IPA 转写为 ARPAbet/Misaki/eSpeak 音素不是无损字符串替换；重音、弱读、r 音、长度和音节边界可能改变。当前 ipaToKokoro 存在 /ɝ/ → ɜɹ、/ɚ/ → əɹ、/e/ → ɛ、移除 ː 等正规化，必须建立词汇级听测，而不能用正则合法率代替质量。

## 3. A 轨：二级标题已给 IPA 的稳健实现

### 3.1 权威输入

从冻结的章节版本取：
- chapterId、chapterDigest、PART:one、WORD ID、USE ID；
- 二级标题的英语实际词形和末尾 IPA，要求末尾明示音标，剔除中文说明；
- locale 默认 en-US；词组可保持完整词组，不误拆为单个英语单词；
- 归一化记录保留 **原 IPA** 和目标合成器音素串，二者必须区分。

IPA 是选音依据，**不是需要被朗读的文字**。不能将“beetle 指…… /ˈbiːtəl/”直接交 TTS，也不能依赖 Bella 从中文解释推断声学形式。

### 3.2 路由及复用

1. 查与相同词形、locale、确切 IPA/已验收音素、权限条件匹配的不可变历史资产。
2. 查带 pronunciation 标签的许可录音；有多种录音只使用发音标记匹配、口音正确且可授权的版本，不能“搜到一个同拼写 MP3 就用”。
3. 词典无录音则优先试用既有 Kokoro Misaki 受控音素路径，进行小样本特殊读音测试；若短词错误仍多，整条 A 轨改用经过试听验证的 IPA SSML 服务，而不让同一问题重复上线。
4. 明确不支持的 IPA 或服务报错 → 显示“该发音待核对”，**不**默默退为错误拼写读法；普通词的 B 轨不能覆盖 A 轨音标权威。
5. 对常用词的同形异音，如 record / present / wind / live / read / lead / tear，准备人工确认的例外映射；按完整词形+IPA 保持独立生成身份。

### 3.3 为什么与原孤立单词失败不同

这里关键不是希望语音模型“理解更多”，而是让**音素序列独立于模型自由的文字转读**。对于模型短输入会吐出错误内容、吞音或重复的场景，音素控制可能缓解“读错哪个词”，但不保证消除模型的短语音生成失败。成功门槛是：短音频可解码，听觉目标词准确，声学长度及尾音无明显吞截。真正的失败仍必须切换合成器或词典，而非无限重试 Bella。

## 4. B 轨：其余单词、派生形式、正文任意选词

**推荐“词典查询→已有录音→普通 TTS→设备机械音兜底”的阶梯，而非每次请求一个 AI。**

- 首次由用户有意识选中的词才查询；相同拼写 + locale + 选择读音 + 音源版本，永久复用。不因滚动或页面渲染自动为全文请求音频。
- 可选 CMUdict/本机静态词典获得北美常见 ARPAbet 与候选数量；它仅用于提供音素和歧义提示。真实音频从合法录音或合成器获得。
- 对 Wiktionary 的 Commons 录音建立 provenance：源页面、文件名、Commons URL、许可、作者/署名、locale、IPA 或可追溯的读音标签。源数据来自 Wiktionary 并不意味着所有声音使用相同许可证；如需再分发、改编或打包，应逐个检查版权及署名/相同方式共享条件；未核实授权不复制到私有 OneDrive。必要时只使用合规外链或转而自己合成。
- 默认先精确词形/变体 lookup；查无时词形规则归一（复数、过去式、分词）必须核对实际读音，不可将词根音频冒充派生词。缩略词、人名、专有名词、外来语和短语独立标识并保守处理。
- 使用设备 Web Speech 可省服务成本，但不能保证离线声音一致，也不能用它满足 A 轨严格 IPA；默认不要悄然切换现有 Bella 句子声音。
- 若用户明确不强求真人感，那么机械音更可接受，但最重要的质量仍是“真正在念这个词”。判断音频可解码和 ASR 文本匹配是必要的自动检查线索，不足以代替极少量听审。

## 5. 如何低耗时地尽可能匹配上下文读音

无需对每个点击进行一次大语言模型调用；可以在**发布章节或首次解析时离线预计算**。优先级：

1. **章节第一部分已登记的 USE → IPA**：对于 A 轨完全精确；第三部分 SENTENCE 可已有 USE 引用，因此有条件反向关联某些目标词。
2. **单词已有显式读音、词性或句法结构**：单一候选直接命中；若同词多个读音，依据上下文词性、词形、固定词组和例外规则挑选。
3. **局部的轻量词性标注/规则**：对 read（时态）、record（名动重音）、wind（动/名）、present 等高价值案例可做有限规则；POS 不能彻底区分 bass（两种名词）或同词性不同义项。
4. **不足以确认时常用读音回退或给两个选项**：明确标为“默认读音/另一个常见读音”；用户允许上下文正确性不强求，因此不应为极端歧义阻塞整章或引入频繁收费推理。
5. **用户一次性纠正**：保存针对“章节版本+具体 token”的显式选读，不污染其他词义、不覆盖不可变旧音频。

建议的快速数据结构：
- chapterPronunciationMap[chapterDigest][useId] = {spelling, ipa, locale}
- lexicalCandidates[spelling+locale] = [{ipaOrArpabet, source, audioAsset, posHints, confidence}]
- wordOccurrence[chapterDigest+sentenceId+tokenOffset] = {spelling, matchedUseId?, selectedPronunciation?, resolution}
- selected audio identity 包含 provider、voice、format、phonemeEncoding、phonemes 或 canonical spelling、locale、policyVersion、sourceRecordingHash 等必要身份字段。

对含句子身份且上下文足够的词，发布时一次性处理更便宜；对未知选词，只在首次点击查索引，重复读音零模型推理、零再次合成。对 40 主词及若干二级派生词的数据量，静态 lookup/规则处理远小于云端语音调用的开销，但**毫秒级时延不是已实测结论**，须在 iPhone 和 Cloudflare 上正式测量。

“从 Bella 整句 MP3 中把词切下来”不建议作为首选：需要词级时间对齐，切下来的辅音边界、连读、弱读、词尾可能被截断。可以把既有句子当多读音听审参照；日后若引入有可靠 alignment 的段落音轨，再考虑句内可定位播放。若用短载体句生成后裁词，必须先实际验证裁切和对齐的耗时、质量与失败率，不能声称靠字符串就可精确裁音频。

## 6. 与当前系统最小侵入的设计

### 6.1 新接口，而非拆掉原整句保护

建议新建独立的词汇音频解析入口（命名待代码阶段定稿），不改变现有 POST /api/practice/pronunciation 的 sentence-only 校验，也不改 0011/0015 迁移语义：

- resolve：传入章节身份与 USE ID，或者句子 ID + token 范围，返回已有资产及受控候选，严禁直接把未受信文本当已获准付费生成。
- request：若用户选择新词的生成，按已验证的候选词形/IPA 请求异步生成，并返回原子 claim 状态；成功后存入 OneDrive 及 PRACTICE_DB。失败按 failed/unknown 状态保存，不自行换计费音源重试。
- playback：优先历史成功原件/私有缓存，沿用 Range/退登清理；第三方录音须按实际授权设计缓存或外链，不假设可永久复制。
- packaging：可额外生成“词汇可选包”，**不**更改现有 chapter-sentences-only-v2 句子包的含义；下一章默认仍是第二、三部分完整句子。
- storage：仍要保留供应商 raw response、音源、合成器版本、批准的词形与 IPA、实际音频 digest；历史只读描述与付款身份不更改。

### 6.2 阅读器操作冲突

- 第一部分二级标题原有词形与 IPA：可在 IPA 相邻新增小型播放控件，避免整行点击朗读中国字或触发原有跳转。对纯列表 USE 无 IPA 不擅自补。
- 第二/三部分其他单词：不要恢复过去的“任意点击就点词”抢占句子点读；建议保留已有整句单击，使用选中文字后的轻量菜单“单词发音”，或在答疑选择菜单中增设分离操作。长按答疑、双击释义/上下文问答和 iPhone 原有文本选择必须回归测试。
- 音频依旧必须来自用户手势触发，调用 AudioContext.resume 必须位于 tap 原回调，不能在异步 await 之后才尝试解锁。
- 不新增整页隐藏自动批量预读；无已有音频则文字照常显示；不得因音频失败重建章节、变更 VIX、阻碍原整句音频工作。

### 6.3 版本、授权、隐私

- 新策略显式版本化：lexical-audio-v1；保存来源等级 recorded-verified / ipa-synth-verified / plain-tts / device-fallback / pending-review。
- provider 或 phoneme-mapping 的任何变更必须产生新的 asset identity，不覆盖旧声音。
- 借用成功索引和归档恢复思路，但跨不同音源不应简单复用 Bella 的 model+voice 身份；索引应能表示真实录音、模型合成两类 provenance。
- 语音输入不含私人练习原声或登录密钥；用户真正选择前不把整章文本发往外部发音站点。
- iOS 音频兼容：Commons 的 Ogg 需要验证当前 Safari 解码链，能取得合法 MP3 转码的才走现有解码路径；不默认音频都为 MP3。

## 7. 费用、耗时和维护权衡

### 7.1 付费合成的物理成本通常不是主矛盾

337 个不同词形+IPA 的首次短语音在单词文本量上极小。仅作为**情景算例**，每个受控请求若平均计费 60 个字符，合计约 20,220 计费字符：

- 旧研究所用 Kokoro $0.62–$0.99 / 百万字符：约 $0.0125–$0.0200；这**仅是复用旧单价的条件估算，不是 2026-10-17 已核价承诺**。
- Google Cloud Standard 官方公布超过相应免费使用量后 $4 / 百万字符：相同字符约 $0.081；SSML 内容会计入字符，适用声音和计费具体以官方价格页与账户为准。启用免费额度可能仍要求先开通 billing。
- 音源检索的网络次数、版权核查、模型听审、失败重试和服务器存储成本不由上述字符价涵盖；若要调用 Azure/AWS/Google 需另核验实际开通和付款可行性。

来源：https://cloud.google.com/text-to-speech/pricing

如果在章节首次发布时已经将候选和确切音频原件准备妥当，用户重复点击的云 TTS 成本为零；**最影响用户感知耗时的是首次远程网络请求、录音来源查询和失败恢复，而非几十个单词的字符收费**。

### 7.2 目标时延是待验收 SLO，不是现有测量

建议首轮验收目标：
- 命中浏览器已下载音频：点击后能直接恢复播放，不允许再访问 TTS；
- 命中永久云资产：单次受保护读取，收集 iPhone 实际 p50/p95；
- 未命中词典录音：词典索引先本地批量/后台预建，避免每次访问外站数次；
- 首次合成：异步生成 + 用户能看见进度，不能假装即时；缓存后不再请求；
- 查询超时、失败/未知计费保护不可自动重复付费。

不给出未实测的“毫秒级”或“几秒完成”硬保证；只有实际线上试验才能核实。

## 8. 建议的分阶段验证与是否上线的门槛

**P0：只读离线核查（无付费）**
- 对全部正式章节扫描 H2 的词形、IPA、同形异音、短语、unsupported、空值及版本稳定性，输出每章数据清单；修正当前展示标题与结构词形提取差异。
- 为 120 条样本创建独立验收集：40 条明确 IPA（覆盖长短词、双元音、r 音、重音、短语）；40 条普通英语词（含派生形式）；20 条上下文同形异音；20 条专名、缩写、未知词及异常路径。确保所有例子可回溯原章节或单独指定测试输入，不改正式正文。
- 枚举允许重用的历史资产及外部录音许可，验证 URL、音频格式和归属；对本地 CMUdict 录音覆盖率须区别“有转写”和“有真实音频”。

**P1：隔离的音源盲测（用户允许少量付费时）**
- 词典录音、现有 Kokoro 强制音素及任选一个经确认可付款的 IPA SSML 服务分别合成/试听**同一批**词，尤其短词、异读词与模型曾失败的样本。
- 逐条核对：是否正确词形、重音、长短元音、音节数、尾音、重复/截断、短静音和 MP3 可解码性；ASR 可以辅助筛查但不能自证 IPA 正确。
- 对 120 条样本明确记录“准确通过/失败原因/供应商不支持/未测试”并做逐路径成功率；无需追求真人感，但 A 轨出现错读不得自动标为合格。
- 若 Kokoro 短词仍大量失败，终止 A 轨 Kokoro 试探，不继续批量重试；切换实测有效的 IPA SSML 或授权词典录音。

**P2：小范围可回退上线**
- 先只开放第一部分 H2 明确 IPA 的人工点击；已付费成功资产只读复用。新生成仍需单独预算许可。
- 再开放任意单词的选择菜单，优先使用 B 轨已有词典读音。用户不要求语义完美，歧义词允许显式的“默认读音”。
- 验证长按答疑、双击词问答、IPA 的可访问性、整句单击、音频停止、离线与 Range、复播 0 次新增生成、iPhone 真机、账本去重与未知费用保护。
- 维持独立开关：关闭所有词音后，原 Bella 例句/范文满配仍和现状完全一致。

**发布门槛**：完整授权链、音源状态与内容身份清晰；A 轨必须已证实针对给定 IPA 的可靠发音；B 轨不得无声替换句子或强迫每次点击付费；出错不会引起再次付费或丢失永久原件。没有达到门槛时仅交付研究或隔离测试，不上线。

## 9. 本轮未做及下一步工程优先级

**已经完成**：确认仓库架构与停用点、读取代表性协议/迁移/工作代码、对五章实际 IPA 标题做静态复用统计、查阅多类音源官方文档并形成两轨方案。

**尚未完成，不得冒充**：用户账号对 Azure/Google/AWS 的真实调用、在线词典录音抽样下载与许可审阅、真实 TTS 付费生成、用户听审、iPhone 真机延迟统计、全仓 H2 数据扫描（本轮统计为五份列明的当前版本）、前后端工程实现或部署。

**工程优先级**：先做完全不付费的“现有词汇音标 → 音源 resolver → 成本与许可报告”，再做 A 轨小样本受控音素试听；确认哪条路线真的不再错读后才开放收费生成、词汇按钮及普通单词的可选点读。此顺序比抢先上线全部单词更能避免重复 Bella 旧错误。

---

## 10. 仓库内部依据

- AGENTS.md；README.md；OPERATIONS.md
- protocol/AUDIO_CONFIGURATION.md；protocol/VOICE_ROUTING.md；protocol/AUDIO_EXTENSION.md；protocol/READER_INTERACTION.md
- research/chapter-audio-configuration-2026-10-09.md（Misaki 两个真实音素控制探针、资产标识）
- research/reader-point-audio-scope-2026-10-09.md（旧标题点读及点击规范）
- research/audio-bulk-resource-repair-2026-10-09.md（CPU 资源故障、未知计费/原件保护）
- research/daily-pronunciation-value-2026-10-04.md；research/audio-delivery.md；research/tts-provider-study-2026-10-01.md
- web/audio-plan.js；web/reader-speech.js；web/render.js；worker/src/pronunciation.js；worker/src/pronunciation-store.js；worker/src/audio-config.js；scripts/audio-worker.mjs
- worker/migrations/0011_sentence_audio_only.sql；worker/migrations/0015_daily_full_audio.sql
- chapters/2026-10-02/chapter.md；2026-10-06；2026-10-09；2026-10-11；2026-10-12

**范围说明**：该报告只是新增研究文档。现有“词汇点读已停用、第二/三部分 Bella 整句音频默认满配”的权威协议保持不变；是否更改须在未来明确的实现任务中单独实施。
