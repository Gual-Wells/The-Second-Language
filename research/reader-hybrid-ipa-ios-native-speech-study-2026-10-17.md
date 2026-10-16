# 第二语言补充点读研究：Bella 原有核心音频保持不变，IPA H2 与 iPhone 原生仅填补空白

> **2026-10-17 纠错修订。** 本研究原初提交 fae8995a00a8fcc18db6be82ab997c33e83f68ad **错误理解用户需求**，建议将整个章节阅读器的 Bella 整句替换成 iPhone 声音并关停自动音频队列。那是错误提案，不应实施。**本版本整体替换该错误建议，明确保留 Bella 原有权限、自动生产、资产与原声音色协议，只增加 Bella 未覆盖的点读能力。** 这是研究建议，非生产协议变更，未实际部署或发生付费声音请求。

证据版本：源仓库 `Gual-Wells/The-Second-Language@9532fbca9dcea808b27f79bc9cc2ef4f2f3a8eb6`，完整项目前置审计 `research/project-complete-architecture-history-audit-2026-10-17.md`。既有协议 `AGENTS.md`、`protocol/VOICE_ROUTING.md`、`AUDIO_CONFIGURATION.md`、`READER_INTERACTION.md`、`STORAGE.md` 的 Bella 范围仍是权威；本文件的研究不能私自取代其实际运行规则。

## 1. 正确的三路读音架构——**补充**而非替代

| 对象 | 现有/拟新增声音 | 权限优先级 |
| --- | --- | --- |
| 第二部分例句整句点读 | **既有 Kokoro Bella 原件/按需生成/章节默认预备**，原样保持 | 最高：Bella 已覆盖 |
| 第三部分范文整句点读 | **既有 Kokoro Bella**，含原本高光跳义项优先级 | 最高：Bella 已覆盖 |
| 非听力教学考官、章节测试有声题、雅思与其它音频业务 | **既有正式 Bella/角色音色/原声分析链路** | 既有范围，不得触碰 |
| **第一部分具有对应 `/IPA/` 的二级标题 H2** | 专用受控音标发音生成器；按所属 H2 的实际 IPA 发声 | Bella 原本已停用词汇点读，作为新增补充 |
| 第一部分 H1 主词标题、非 H2 细用法/列表、其它可点读英文词 | **iPhone `speechSynthesis` 原生英语朗读** | 不覆盖 Bella 现行完整句 |
| 第二/第三部分句内**单词单独点读**、其它 Bella 未覆盖的独立词 | **iPhone 原生英语朗读** | 须用不同的用户动作避免和 Bella 单击整句冲突 |
| 译文/中文正文、非点读控件 | 不自动朗读；如另申请中文点读再单独定义原生语言 | 不抢既存交互 |

一句话：**Bella 管已有的完整句子与全项目正式语音；音标引擎只管第一部分带音标 H2；iPhone 只管目前没有归 Bella 的“词级点读空白”。**

“第一部分二级标题用 IPA”中的**二级标题**是精确边界。即使某个列表细用法有 `USE` 编码，也不能以此冒充 H2 音标发音。没有 IPA 的 H2 应进入原生/不可点读的正常文字政策，而不是编造 IPA。

“其它全部使用原生”指**Bella 已有权限之外用户新增的点读功能**；绝不是说第二、三部分原有整句 Bella 朗读要改成 iPhone。**原有句音自动生成、费用预测、下章一次性配置、预下载、不可变录音索引等全部保留。**

## 2. 在当前代码中，补充层应落在哪里

源码已核对：`web/app.js` 装载的是 `installReaderSpeech`，它调用 `/api/practice/pronunciation` 完成既有 Bella 整句点读，使用 `web/audio-library.js` 检索永久缓存与音频包；`web/audio-plan.js` 将允许类型严格限于 `part two/three` 的 `kind=sentence`。**该旧 API 的 sentence-only 门禁应原样保留**；不能为补词音而放开收费入口，更不能停用 Bella 句音。

第一部分 H2 则已有 `web/render.js` 中 `.sense-block > .sense-head > h2`、`span.sense-ipa` 与 `dataset.useId`。新增的 IPA 点击必须从**当前 H2 的末尾 IPA**取值，并经独立、权限隔离的音素生成服务处理，严格过滤 Part1/H2/真实 IPA，不得重用句子 POST 冒充 `kind=sentence`。同一 H2 里英文展示文本可能有“flute 或 flutist”，不应按第一个英文词猜语音目标；受控 IPA 的要求来自标题原标注。

现存 `web/native-speech.js` 虽已具备 `SpeechSynthesisUtterance`、`en-US`、坐标抽词和停止功能，但是**旧界面依赖** `speechVoice`、`speechRate` 和下拉 `speechMode` 不存在于当前 `web/index.html`。应提取纯语音服务能力，作为补充点读适配器装入现有 `reader-speech.js` 或单个仲裁层，而不是把 `app.js` 的 Bella 实例替换成旧 native 实例。

现有 `web/pure-reader.js` 具有 300 ms 单击/双击判别、650 ms 长按答疑、`reader-focus.js` 的 `wordAtPoint`、`reader-speech.js` 的 article click 捕获。**同一次触摸序列必须只有一个动作**；双击句内词答疑、长按答疑、第二部分标题跳词、第三部分高光跳 USE 以及已有整句 Bella 都不能被新增补读抢走。

## 3. 五个真实章节的 IPA 输入证据，不能简写为“合成器自然支持”

只读扫描 Git 中 `2026-10-02/06/09/11/12` 五章 Part 1，数据如下（线上历史研究确认另有 10-13/14 两章，但它们的最新章节全文不在本次可用 Git 源中，不应将五章数据当全七章）。

| 章 | 含 IPA 的二级 H2 | 不属于 H2 的其它 USE |
|---|---:|---:|
| 10-02 | 66 | 0 |
| 10-06 | 153 | 14 |
| 10-09 | 130 | 0 |
| 10-11 | 150 | 11 |
| 10-12 | 168 | 5 |
| **合计** | **667** | **30** |

667 个 H2 全部带有末尾 IPA；共有**335 种不同的 IPA 字符串**。早三章有 **349** 个 `word · 释义 /IPA/` 格式，后两章有 **318** 个 `word 中文说明 /IPA/` 格式；现有 HTML 渲染的“按中点分割词形”不适于做读音权威，但这不妨碍直接绑定末尾真实 IPA。

**严格字面匹配 Google 官方 en-US 音素表的静态试验**：用其官网音素表所列多字元音和单字辅音/元音 + 音节边界/重音符号做最长匹配，得到 **257/667** H2 的 IPA 可以在**未经音标转换的文档记法**下完全匹配；**410/667** 含需要预处理、映射或核对的符号。这是**语法兼容预筛，不是已向 Google 发送 API、不是 410 处必然不合格**。典型差异包括 `ɝ` 对 `ɚ`、`r` 对 `ɹ`、`i` 对 `iː`、`u` 对 `uː`、`e` 对 `ɛ`、`ɑ`/`ɔ` 的长音写法及多词空格。特别地，不能将元音转换都视为语音学上无损，也不能把现存 `ipaToKokoro` 规则未经审核就照搬到 Google/Azure。官方表：https://cloud.google.com/text-to-speech/docs/phonemes 。

**另有 16/667 个 H2 使用含空格的多词 IPA**，如 `human ecology /ˈhjuːmən iˈkɑːlədʒi/`、`at a snail's pace /æt ə ˈsneɪlz peɪs/`、`dawn chorus /ˈdɔːn ˌkɔːrəs/`、`pine for /paɪn fɔːr/`。对这 16 个词组做了真实章节 token 检验：标题英文词数与空格分割后的音素组数**全部一致**。这是构建“一词一 `<phoneme>`”方案的良好起点，但仍需验证实际语言连续性；Google 官方将一个 phoneme 标签定义为一个词的自定义读音，不能把多词串直接塞入一个标签后断言其符合契约：https://docs.cloud.google.com/text-to-speech/docs/ssml 。

**重要：不需要从 H2 的第一个英文词去猜发音词形。** 例如源章存在 `flute 或 flutist ... /ˈfluːtɪst/` 与 `flute 或 fluting ... /ˈfluːtɪŋ/`，旧 first-token 算法错误配对，新的专用通路只依据该 H2 的 IPA 合成。若供应商语法仍强制提供可读字串，必须保留正确的文字 fallback 映射或选可接受纯音素的引擎，不能把 `flute` 错误拼写当作 `flutist` 的同音词。

## 4. IPA 发音生成方案的实际能力等级

### A. 官方 IPA SSML 引擎——最容易形成可维护的工程 API

**Google Cloud Text-to-Speech** 的 `<phoneme alphabet="ipa" ph="...">word</phoneme>` 属正式支持的 API，并给出明确 en-US 字母表。它是带音素控制的文字 TTS，而不是只有 IPA 的无字形原生引擎；但只要 ph 控制真正生效，在教学功能上满足“音标决定读音”。限制：每个标签主要面向单词；335 种 IPA 的原始记法有未核对的差异，不能“原样批量直送”。

**Azure Speech** 同样提供 `<phoneme alphabet="ipa" ph="...">`，不支持的符号会导致 HTTP 400；其文档明确讲述 IPA 重音前必须考虑音节标注规则：https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation 。适合对照测试，但不能直接承诺用户 Azure 支付/区域服务可用。

**Amazon Polly** 官方兼容表说明 phoneme 在 Standard 等引擎中的支持，并非所有 Generative 音色完全支持：https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html 。传统声音可以作为音质不求拟人、只求稳定辨认的控制组，但服务账户/付款仍未经验证。

**Kokoro + Misaki** 已在本项目早期用两个真实音素覆盖测试确认控制符生效，但历史孤立单词反复错读并最终停用；控制入口有效**不等于声学正确率得到验证**。不得无新对照就重新默认采用 Bella；更不能绕开现有句音 API 的 `kind=sentence` 门禁。

### B. “真正只接受 IPA”与网页音标朗读器

如果坚持**供应商连英文字形都不能收到**，Google/Azure 类 SSML 实际上不严格属于“纯 IPA 裸输入”：其标签通常需要可读文本 fallback。这是输入协议形式的差异，不代表 phoneme 指定无效。纯音素引擎必须检查支持的音素词表、重音、停顿、输出 WAV/MP3、端点是否正式开放。

**eSpeak NG** 开源且支持简短 WAV，然而 CLI `--ipa` 是**输出 IPA 转录**开关，不是把普通标准 IPA 作为输入的开关；其内部有自己的语音音素编码，严格 IPA 控制需要额外映射，不能包装成“一行命令直接读教材 IPA”。依据：https://github.com/espeak-ng/espeak-ng 、https://manpages.debian.org/trixie/espeak-ng/speak-ng.1.en.html 。

不建议把没有公开授权 API 的通用在线“IPA Reader”网页作为生产依赖，也不能未经核实爬取它的返回音频、复制或再分发。**优先直接验证官方 phoneme API，或选择维护中且真能接收独立音素流的引擎。**

**本轮没有任何新 Google/Azure/Polly 合成收费实测，也没有确认当前用户账号对这些平台的地区/支付支持。** 推荐度取决于独立实测。第一轮技术实验应用 20–30 个高信息价值 H2（rhotic 长音、重音、音节、音素未映射、多词）与真实指定 IPA 对照，保留 request、最终 IPA、音频 digest、人工听审，不靠 ASR 文本一致自动通过。

## 5. iPhone 原生语音不是“把 IPA 也丢进 SpeechSynthesisUtterance”

Safari/WebKit 提供 `window.speechSynthesis`、`SpeechSynthesisUtterance` 和 `speechSynthesis.getVoices()`，应用提供朗读文本、`en-US`、语速和可选 Voice 之后由系统发声。WebKit/Apple 文档：https://developer.apple.com/documentation/webkitjs/speechsynthesis/1634378-getvoices ；MDN：https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance 。

**实际限制**：
- `SpeechSynthesisUtterance.text` 支持纯文本，SSML 在不支持的设备上可能被直接去标签。不能将任意 IPA 注入 iPhone 原生然后假定它按 IPA 念，所以 H2 才真正需要独立引擎：https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/text 。
- `getVoices()` 可能最初返回空数组，后续触发 `voiceschanged`；已安装的高级 iOS 声音也不一定会全部出现在网页列表。公开 WebKit issue #290497 在 2025 年记录了这一兼容问题：https://bugs.webkit.org/show_bug.cgi?id=290497 。不保证用户能够使用所有系统增强声线。
- 设备原生**不等于已证实始终离线**，可用 `SpeechSynthesisVoice.localService` 和断网实机测试；本项目无需再向 OpenRouter 为这些点读付费，但系统是否联网由所选 voice/OS 实现决定。
- Safari 网页、主屏幕安装后的 PWA 及 WKWebView 历来存在差异；WebKit issue #239816 是历史证据而非今天所有版本均失效的断言：https://bugs.webkit.org/show_bug.cgi?id=239816 。目标必须包括实际用户 iPhone 主屏幕 PWA。
- `speechSynthesis.speak()` 的调用应位于可信用户手势中。当前 `pure-reader.js` 用 300 ms timer 构造程序 click，**不能由它的模拟 click 通过桌面测试就推定 iOS 必然允许合成发声**。可先在小型 PWA 试验里比较 (A) 单击 300ms 后直接发声与 (B) 首次可信 pointerup/click 内发声、第二击立即 cancel；前者更不打扰双击，后者更稳于用户激活但可能在双击开始瞬间出现极短声音。待真机实验选定，不能凭空给出首音延迟或无闪断承诺。
- 原生声音应即时一次性播放目标文字，不会返回音频字节。因此无需对普通词和整句在云端生成 MP3、存 D1 或做永久音频包；`speechSynthesis.cancel()` 控制停止；`onerror` 只显示错误，不触发 Bella fallback。

## 6. 两种补充点读如何不抢 Bella 的交互

**基本原则：对“同一块句子文本”的既有轻点动作保留 Bella 完整句读；若用户想要该句中的单个词，请以另一种明确手势/可见指令选择“读词”原生。** 例如选中英语词后在轻量动作菜单里出现“读词”；要在 iPhone 真机检查它与原有双击句中词答疑、650ms 长按答疑和原生文本选择的竞争，不可想当然地劫持原长按。必要时可让顶部原“点读”入口开放**仅影响补充词音交互的词级模式**，但默认 Bella 的句读绝不消失。

- `part=one` 且当前命中**带 span.sense-ipa 的 H2**，优先音标发音；此路径不要自动调用 iPhone 拼写朗读作为“伪 IPA”降级。
- `part=one` 的 H1/其它英文单词、列表里细用法、词源说明的英文词，经明确词级点按→iPhone 原生（不会启动 Bella）。
- `part=two` 的完整 `.example-pair p` 轻点→现有 Bella 流程，**与当前行为一致**。标题 H1 原来的单击跳 Part1，保留；若要对这个 H1 读词，新增不冲突的入口，不能为了原生词音废除跳转。
- `part=three` 的完整 `.story-sentence` 轻点→现有 Bella；开启 USE 高光时优先保留跳转。这是现存正式约束。对里面的单个英文 token 发出独立“读词”指令才进入 iPhone 原生；禁止一次普通点击既发 Bella 整句又发原生单词。
- 所有控件、中文译文、纯净模式与测试页维持历史语义；中文是否启用系统朗读另行授权。
- 新增统一 `speechStop` 停止协调：Bella Web Audio/等待状态按原逻辑；IPAClipPlayer 停自身缓存/请求；NativeSpeechPlayer 用 `speechSynthesis.cancel()`。停止其它补充播放器不能删除 Bella 的已付费缓存；切章/切部分/弹窗/练习/后台/退出账号都停全部正在播放的声音。
- iOS WebKit 对 `speechSynthesis.speak()` 的用户激活处理不应假设与 Web Audio `prepareTap()` 相同。原有 `pure-reader` 在 300ms 计时器后转发 `new MouseEvent`，非可信手势。先独立实机试验直接 gesture 和延迟 gesture 的朗读可用性，再整合 native 服务，防止为保留 Bella 双击保护而引入不出声 bug。

**不会增加第二套阅读器“主点读模式”。** 完整句仍以 Bella 为最高优先级，补读只是处理新的显式词级意图。视觉需按原 2008 蓝灰主题、保持正文位置/可读性，新增控件越少越好。

## 7. **绝不可干预**的 Bella 生产、计费与永久资产

以下是对初稿错误建议的明确撤销：

1. **保留** `protocol/AUDIO_CONFIGURATION.md` 对第二部分例句和第三部分范文的默认满配策略；新章首次发布原子入队、已有章节可报价补齐、下一章一次性调整及使用后恢复 `["two","three"]` 全部保留。
2. **保留** `worker/src/audio-config.js`、`scripts/audio-worker.mjs` 的句子准备队列与失败/未知计费状态处理；**保留** `worker/migrations/0015_daily_full_audio.sql` 默认值及发布配套代码。**不引入**关闭自动生成的迁移，也不把语音额度从日课预算中删除。
3. **保留** `web/reader-speech.js` 对 Bella 完整例句/范文点读；`web/audio-library.js` 现行缓存、预下载与老包 Range 保持；`web/index.html` 原有“自动下载本章已有音频”和章节音频配置入口保留。这些均非“无效设置”。
4. **保留** `worker/src/pronunciation.js` 在收费前拒绝词汇与 IPA 请求的旧 API 门禁。新的 H2 IPA 生成应有**独立**、经授权和账本保护的实现；不要偷改旧接口令其既管理 Bella 又处理另一供应商而扩大损失面。
5. **保留** `protocol/VOICE_ROUTING.md` 既有 Bella/其它角色完整规则。正式雅思、听力、口语、章节测试、临时测试用声、原声分析独立管理且不改声线。
6. **保留** 所有已付费 Bella MP3、请求/返回、OneDrive 内容、`pronunciation_results`、`chapter_audio_scopes`、`chapter_audio_clips` 以及历史包和快照。**不要让新增 IPA clip 与 Bella 完整句共享易冲突的音频 identity。**
7. 对新 H2 IPA，另设少量授权受控生成，校验 `chapterDigest + USE/H2 + rawIPA`，生成资产按 `IPA + phonemeTransformVersion + engine + voice + format` 等去重；未知收费结果不重付，成功后长期缓存。**不要在每次登录、每次点开章节或者默认日课中批量生成所有 H2 IPA**；实际费用报价后再安排适合的批量许可。
8. Native 补读只依赖用户 iPhone 的 Web Speech，不向 OpenRouter、D1、OneDrive 发音频生成请求，也不会影响现有 Bella 的收费身份。它的声音“不够自然”是受接受的取舍，但不意味上下文同形异音全正确。

**最容易测试的架构不变量**：发布一个新的正式日课以后，原本的 Bella 二三部分音频准备计划与身份和原协议完全一样；与此同时 Part1 带 IPA H2 只产生专用 IPA 请求，普通原生读词无收费音频请求。

## 8. 可执行的验收矩阵（含 Bella 非破坏性证明）

| 测试场景 | 正确结果 |
|---|---|
| Part1 带 IPA 的 667 个 H2（现存五章） | 准确归属 H2 → IPAClipPlayer；其它 30 个非 H2 USE 无专用 IPA |
| Part1 H1、词源、普通词、非 H2 用法 | 只在明确触发读词时由 NativeSpeechPlayer 读取对应英文目标 |
| Part2 例句整句轻点 | 原 Bella 音频按旧身份、旧缓存/按需播放，**不改变成 iPhone** |
| Part3 范文整句轻点 | 原 Bella 句音；高光 USE 跳转仍优先 |
| Part2/3 句内单词显式“读词” | iPhone 原生语音；不顺便触发 Bella 整句、长按/双击答疑 |
| Part2 主词标题轻点 | 原“返回第一部分对应主词”稳定帧跳转；独立词音才是 native |
| 同形异音 H2：concert、viola；flute/flutist | 依标题 IPA 而非首个英文 token 生成 |
| IPA 静态兼容 | 335 种不同 IPA 校验；257/667 字面兼容、410/667 存在记法差异是离线预筛，非语音质量指标 |
| 16 条多词 IPA | 分词映射不影响 Bella，实际读音需额外受控合成和真人听审 |
| 单击/双击/长按/滚动/纯净/切页 | 每个手势唯一动作；三种播放器可共享停止/离开生命周期 |
| **正式新章发布** | **Bella [two,three] 现行默认入队，费用预估、后台队列和复用行为不变** |
| **旧章及历史声音** | Bella 音频包、OneDrive/D1 索引、未知扣费与旧版本继续受保护；不迁移、不清理 |
| **正式考试/雅思/口语** | 继续既有 Bella/多角色声音体系与用户录音/答卷系统 |
| iPhone 原生补读 | Safari 和添加主屏幕的 PWA 实测 `getVoices`、空列表、用户激活、断网和停止，失败不绕过协议回退付费 Bella |

## 9. 技术选型和下一步的**窄范围**研究

**IPA 供应商**：Google Cloud 与 Azure Speech 的 `<phoneme alphabet="ipa" ph="...">` 均为有文档的读音控制入口，Amazon Polly 的部分引擎也支持，现有 Kokoro/Misaki 强制音素为项目历史参照。上述事实不等于用户账号现在已开通成功或 335 种 IPA 都能不加校验直接上传。当前五章 667 H2 中有 410 处不符合所用 Google 官方 en-US 音素表**严格书写匹配**（i/u、ɝ、r、e、长音及多词等差异）；这是记法适配工作量，不是供应商实际拒绝率。

**iOS 原生**：已有历史模块能调用 Web Speech，但现行界面不再有该模块依赖的旧 `speechVoice/speechRate` 控件，不能直接恢复。应开发独立的小型 NativeSpeechPlayer 并与现行 Bella 播放器并行复用 gesture coordinator。`getVoices` 可延迟就绪，语音系统可能提供不同质量声线；不保证所有已下载 iPhone Voice 在 PWA 中可选或完全离线。Safari 与主屏幕 PWA 要分别真机验收。

**分步证据优先级**：
1. 使用正式 PWA 相同手势架构，真机测试“**Bella 单句轻点保持不变 + 选中句内单词用 native 补读**”的双动作防护与用户激活。不同手势必须互不污染。
2. 对五章 335 种独立 IPA 做离线规范适配单测；用约 20–30 个高信息量标题对合成服务进行小样听审（需要实际可用账号和明确计费授权）。对 16 个多词 IPA 做字词/音素对齐核查。
3. 对二、三部分 Bella 真实再生/存储行为做只读回归，验证任何补读改造后新章仍正常产生所需句音与永久索引。**无需**改自动音频计划，无需停音频后台服务，也不必迁移历史章。

**未验收内容**：本次没有 iPhone 真机，未请求 Google/Azure/Polly 付费 API，未取得所有七章线上原始 IPA，未完成语言学真人听审；不能把“理论上可实现”说成已上线，更不应撤销 Bella 核心能力。

## 10. 可核对的关键来源

主仓库：`AGENTS.md`；`protocol/VOICE_ROUTING.md`、`AUDIO_CONFIGURATION.md`、`READER_INTERACTION.md`、`STORAGE.md`；`web/DESIGN.md`、`app.js`、`reader-speech.js`、`native-speech.js`、`pure-reader.js`、`reader-focus.js`、`render.js`、`audio-plan.js`、`audio-library.js`、`index.html`；`worker/src/pronunciation.js`、`audio-config.js`；`scripts/audio-worker.mjs`；`chapters/2026-10-{02,06,09,11,12}/chapter.md`；历史 10/9 PR #14/#16/#17/#18、10/10 PR #27、10/12 PR #34。原报告 fae8995a 的取消 Bella 建议为**错误且不适用**的历史提交内容。

官方文档：
- Google Cloud SSML：https://docs.cloud.google.com/text-to-speech/docs/ssml
- Google en-US 音素表：https://cloud.google.com/text-to-speech/docs/phonemes
- Azure 读音控制：https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation
- Polly SSML：https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
- Apple/Web Speech：https://developer.apple.com/documentation/webkitjs/speechsynthesis/1634378-getvoices 与 https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
- WebKit 声线覆盖历史：https://bugs.webkit.org/show_bug.cgi?id=290497
