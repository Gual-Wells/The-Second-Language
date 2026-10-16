# 第二语言：全阅读器 IPA 二级标题例外 + 其余 iPhone 原生点读的独立研究

**2026-10-17｜研究报告，不是已实施的功能。** 本轮基于 `Gual-Wells/The-Second-Language@9532fbca9dcea808b27f79bc9cc2ef4f2f3a8eb6` 的源码、正式音频协议、历史试听/撤销记录、真实五章及供应商/Apple/WebKit 官方文档研究。项目审计基线见 `research/project-complete-architecture-history-audit-2026-10-17.md`。不改日课、考试、历史付费音频或待批旧章升级计划，不开通/收费测试第三方语音。本报告**取代此前“保留 Bella 整句点读”的方案建议**；该方案不符合用户最新要求。

## 1. 不可改变的目标语义

项目**整个章节阅读器**的点读分为且仅分为两类：

**唯一的专用音标音频：第一部分，确有对应 IPA 的二级标题 H2。** 用户明确点按这个 H2（可让可视 IPA 作为同一目标）时，读取这个 H2 所属的原始 IPA，经真正支持音素控制的发音合成器输出。不是第一部分全部文字，也不是第一部分所有 USE，不需要先根据中文释义/英文拼写做词义消歧。无 IPA 的 H2 也不进入特殊路线。成功音频可永久缓存；不兼容/错误提示，不悄悄用英文拼写朗读冒充 IPA。

**其余全部章节内点读：iPhone 原生 Web Speech API。** 第一部分一级词头、词源、释义与例句、细用法/列表，第二部分所有英文词及整句，第三部分所有英文词及整句以及符合点读意图的其它英文正文，统一 `SpeechSynthesisUtterance` → `speechSynthesis.speak()`。不走 Bella、OpenRouter、OneDrive MP3 获取、后台付费合成或普通单词词典/TTS 查询。句子是否按完整句朗读是**点读单位**问题，不是例外声源：第二、三部分仍可点句并由 iPhone 自己完整朗读。

本报告针对**章节阅读器点读**。正式章节测试七道音频题、雅思听力材料、口语考官及已有考试音频是其它独立业务，尚不在此次决定的替换范围内，不能通过替换全局 `protocol/voices.mjs` 把它们也破坏。中文段落默认不属于“英语点读”；若要中文点读也可用 iPhone 系统 `zh-CN`，需在产品明确选择，不应自动给所有中文释义配音。

## 2. 当前真实工程状态与以前方案的冲突

检视 `web/app.js`、`reader-speech.js`、`native-speech.js`、`pure-reader.js`、`reader-focus.js`、`render.js`、`audio-plan.js`、`audio-library.js`、`audio-config.js`、`index.html`、`sw.js`；`worker/src/pronunciation.js`、`worker/src/audio-config.js`、`scripts/audio-worker.mjs`、`migrations/0011_sentence_audio_only.sql`、`0015_daily_full_audio.sql`；`AGENTS.md`、`protocol/AUDIO_CONFIGURATION.md`、`READER_INTERACTION.md`、`VOICE_ROUTING.md`、`STORAGE.md`、`web/DESIGN.md`。

1. **Native 实现有基础，但不能直接激活旧文件。** 当前 `web/app.js` 初始化 `installReaderSpeech`，不是 `installNativeSpeech`。历史 `web/native-speech.js` 用了 Web Speech 和 caret 坐标识词，但初始化需要 `#speechVoice` 与 `#speechRate` 等已不在现行 `index.html` 中的旧控件，也认为 `#speechMode` 是 select，而当前它只是“点读”说明按钮。直接一行替换 import 会运行失败。
2. **H2 已具备精确 IPA DOM 定位。** `render.js` 第一部分给 H2 建 `sense-block`、`sense-head`，`h2.dataset.heading` 保留完整原词条，`span.sense-ipa` 单独显示末尾 `/IPA/`，`sense.dataset.useId` 对应用法身份。应仅以 `part=one + h2 + span.sense-ipa` 作为专用触发条件。这样不会把一级主词、词源、列表 USE 和第一部分其它正文误路由到云端。
3. **现有原生/远程朗读与手势存在捕获顺序冲突。** `reader-speech.js` 在 `#article` 捕获 click；`pure-reader.js` 在外层阅读滚动区处理 pointer、单/双击，然后 300ms 定时器合成 `new MouseEvent('click')` 重发；650ms 长按打开答疑，第二/三部分双击英文词打开句内解析，双击其它阅读区切纯净模式。直接给全局 click 加 speechSynthesis 既会抢答疑/跳转，又可能在 WebKit 里因**模拟事件不带可信用户激活**而发不出声。必须由一个语音/手势仲裁入口拥有本次操作。
4. **第二部分一级标题目前点击是跳回第一部分，第三部分开启 USE 高光后点击优先跳义项。** 若要求这些正文**也能原生点读**，需要提供保留跳转的独立可见操作（如标题旁“词义 ›”或句子的既有用法导航），而不是偷偷删掉原有跳转，或保留它致使“其它全部原生”名存实亡。高光处不得一次点击同时跳转/朗读。
5. `reader-focus.js:wordAtPoint` 已能处理句中英文目标坐标和跨行文本节点，应扩展复用来判断任意普通英文单词；不是每个点击全文 NLP，也不是误把中文、按钮、音标字符当英文单词。
6. 原停止控件管理 `AudioBufferSource`，新方案必须同时取消 native `speechSynthesis.cancel()` 与 IPA 音频播放器，清理在途异步请求，并在切章、切部分、读者隐藏、弹窗、转练习、退出登录时同步停声。
7. `web/sw.js` shell `v35` 正缓存旧 `reader-speech.js`、`audio-library.js`。正式切换时必须变更模块 cache keys/Service Worker 核心列表与版本，测试 iOS 更新时新旧 JS 混用及历史包仍可读取。

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

## 6. 保持原书阅读交互、但让所有非 H2 读音实际可用

阅读器现有语义比一个 click 复杂。建议**一处统一 handoff** 负责用户指令优先级：
1. 浏览器/页面显式控制（跳转按钮、设置、链接、考试按钮）按原职责工作；
2. 第一部分符合 H2 + IPA 才触发专用 `IPAClipPlayer`，不要响应所有 `sense-block`；
3. 其它阅读区域中明确识别出的英语单词/句子由 `NativeSpeechPlayer` 播放；已确立的第二/三部分整句仍可作为一个 utterance 来念，额外词级选择复用 `wordAtPoint`；
4. 长按 650ms 答疑、双击句内单词、双击其它空白纯净阅读、触屏拖动、文本选择等必须保持可达，不能单击抢占这些动作；
5. 第一部分普通 H1 点读应是 native（此前完全不朗读），第二部分一级标题单击原先是“跳第一部分”，按新目标应允许 native 点读，同时给词义跳转保留**清晰独立的可见入口**；第三部分高光开启时的 USE 跳转优先级也应保留，并提供可主动选取的 native 读句/读词操作。不要一次动作同时触发两个效果。

控件保持原 2008 蓝灰主题和常态阅读位置，不另铺显眼浮层；音频停止按钮统一同时取消 IPA 音频、native speech 与尚未完成的异步请求。切章/切部分/打开练习/隐藏页面/退出登录/用户明确停音均停止，避免上次点读迟到后跨章节播放。

**设计原则**：新架构“声源二分类”很简单，复杂度应只保留在现有阅读器的手势仲裁和任务可靠性层。不得为普通单词做 POS/大模型词义推断、外部词典检索、跨章语音 MP3 生产或专用缓存数据库。

## 7. 不能忽略的后台费用：取消“无人播放却继续自动生成 Bella”的路径

现行 `protocol/AUDIO_CONFIGURATION.md` 和 `worker/migrations/0015_daily_full_audio.sql` 固定下一章默认 `["two","three"]`，发布正式章节时原子创建 Bella 整句音频请求，`scripts/audio-worker.mjs` 独立每分钟运行并通过 `/api/practice/pronunciation` 从 OpenRouter 申请收费。项目对一章“配音完成”的历史定义建立在这些申请完成之上。**如果只改前端，Bella 句音在阅读器无需求时仍会照常付费生成**，必须将它作为迁移阻断点。

推荐正式迁移（此次只做研究，不执行）：
- 章发布保持原子事务和正文/VIX 不变，但是将新章节**阅读器 Bella 句音默认计划改为关闭**。不仅要调整当前 `audio_next_config`，还要改其“消费一次性选择后恢复满配”以及现行自动入队逻辑，以免一天后重新生效。用新的迁移/策略版本实现，不反写 0015 等历史迁移。
- 音频配置的“新章满配 Bella、已有章补配”界面应改为历史状态只读或退出**阅读器日常生成**入口；迁移前需检查已有待执行的用户批准申请和一次性配置。停止新自动扣费不代表能无记录丢弃先前明确同意的收费任务。
- 已开始实际供应商调用或结果未知的历史任务保留原状态，未知收费不自动重新调用；已成功的旧 MP3、请求/返回、OneDrive 永久音频、D1 不可变 `pronunciation_results`、`chapter_audio_scopes/chapter_audio_clips`、旧包、旧章节版本均保留。已有考试题音另存的身份与关联继续工作。旧业务是否提供只读复播接口可另定，但不能把云盘无法访问当作尚未生成而重付。
- `worker/src/pronunciation.js` 目前先于付费硬拒绝非 `kind=sentence` 及任何 `ipa`。新 IPA 生成不能偷用原 kind=sentence 接口或删除门禁后让任意客户端提交 IPA 花钱。采用独立受鉴权/预算/章节版本校验的 IPA 生成入口或扩展有明确读音类型的新策略版本；只有服务端从真实固定 H2/USE 取到 IPA 后才允许收费。调用未知仍执行原项目“保留账本、禁止重复付费”原则。
- 新 IPA 声音使用最小身份：`SHA256(canonicalIPA, locale=en-US, phonemeTransformVersion, engine, voice, engineVersion, format)`，并以 `(chapterDigest, useId, originalIPA, assetId)` 做章节关联。必须把原始课程 IPA 与供应商转换结果同时保留，音标相同的 H2 可跨章节复用；**不能**按英语拼写缓存相同读音或按 USE 全部预生。H2 已有 335 种不同 IPA 的五章样本；先按需首次合成、成功永久保存，是否允许提前批量预备应另经实际费用和权限确认。
- 更新 `AGENTS.md`、`protocol/READER_INTERACTION.md`、`AUDIO_CONFIGURATION.md`、`VOICE_ROUTING.md`、`STORAGE.md`、`web/DESIGN.md` 与真实 settings 文案：非考试的 Bella 句音不再是默认日课成本。**不要全局替换 `protocol/voices.mjs`：雅思人物声线、口语考官、独立章节测试的冻结题音继续原路线。**
- `web/audio-library.js` 和 `sw.js` 退出阅读器句音自动预下载，保留历史音频缓存兼容、账户退出清理和考试私有音频缓存界线；将无意义的“自动下载本章句音”设置移除或解释为“已准备好的 IPA H2 音频可选预取”，前者更简单。

## 8. 可证伪的验收矩阵与优先实验

| 验收焦点 | 真实用例与判据 |
|---|---|
| 唯一 IPA 门禁 | 五章 667 个带 IPA H2 命中专用音源；另 30 个非 H2 USE、所有 H1、所有第一部分普通英语及第二/三部分英文均不能命中专用音源 |
| 同形异音 | `concert` 名词/动词、`viola` 中提琴/植物、`upstream/downstream` 重音变体分别按所属 H2 的**真正 IPA**定位；`flute 或 flutist` 不按第一英语 token 猜 |
| 符号适配 | 五章 335 个 IPA 全量离线预校验，257 个严格直接匹配/410 个记法需处理有逐项结果；转换版本锁定，失败不假冒成功 |
| 多词 IPA | 16 个多词 IPA 逐项测试；英文词和音素组数量一一对齐不能直接替代真人语言学/听觉测试 |
| 全原生非 IPA | Part1 H1/词源/正文、Part2 标题/例句、Part3 正文/整句在实际 iPhone 主屏幕 PWA 调用 speechSynthesis，不出现旧 Bella 生成/读文件请求 |
| 用户操作 | 单击、快双击、长按、页面拖动、选字、纯净阅读、句内答疑、亮色 USE 高光跳转、第二部分回词义，无意外双动作与不可访问的朗读区域 |
| 生命周期 | 连续点读不同单词、混用 IPA/native、点停止、切章/切部分、打开练习、断网、后台恢复和退出登录后无滞留声音 |
| 声线兼容 | iOS Safari 和主屏幕 PWA、`getVoices` 初始空及 `voiceschanged`，默认 en-US 和可用本地声音，系统拒绝时明确报错而非云声 fallback |
| 账本与付费 | 新章发布时**Bella 句音自动付费申请=0**，之后恢复设置也不重新启动；旧 pending/calling/outcome_unknown 数据有安全归档/人工核对 |
| 全站隔离 | 已付费 MP3、OneDrive/D1 旧索引和 876 单元历史核对记录不丢；正式七道音频章测试、雅思题音和原声答卷均保持 |
| PWA 发布 | 320/393px 手机视口、Service Worker 预缓存/壳新版本、模块 import 版本一致、蓝灰主题/阅读坐标不漂移 |

**下一次真正工程任务最值得先做的 3 个小实测**：
1. 先在真实 iPhone 主屏幕 PWA 用一个隔离控件检验 speechSynthesis 的首次 tap、延迟 300ms 再调用、停止/前后台、空 voices 和双击竞争；不应先大改正式阅读器。
2. 选真实 H2 的 20–30 个 IPA，对 Google/Azure/既有 Misaki 条件化做有限、用户明确授权的真人听审；尤其测试 410 条记号映射群里的代表样本与 16 个短语。如果用户根本没有可用的云支付渠道，则如实报告供应商可行性边界，转而验证一个**真正接受音素序列**的免费本地引擎，不依赖无契约的网页 IPA Reader。
3. 用已有主库/音频服务身份**只读核实**七章当前 H2 IPA、下一章自动请求配置与所有非终态 Bella 任务，先预演“停止新句音生成但保留历史资产”的变更，再形成可回滚的生产 PR。

## 9. 结论

**方案价值高且边界清晰：H2 有 IPA 才用音素合成，其余阅读器点读完全 iPhone 原生；不需要额外词典库、机器学习上下文判读或保留 Bella 整句阅读路径。** 最大两个真实风险不是概念可行性，而是（1）IPA 文本不完全符合供应商 en-US 音素规格以及多词标签约束，（2）项目现有 300ms 模拟点击与 iOS speechSynthesis 用户激活、后台默认 Bella 付费队列彼此冲突。两者都可以通过隔离先验验证和小范围 non-destructive 迁移解决。未经 iPhone 真机、供应商真实合成及历史任务确认时，只应称“可实现、需验证”，**绝不称已上线或音质已达标**。

**官方依据**：
- Google SSML: https://docs.cloud.google.com/text-to-speech/docs/ssml
- Google en-US 音素表: https://cloud.google.com/text-to-speech/docs/phonemes
- Azure IPA: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation
- Amazon Polly SSML: https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html
- Web Speech: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
- SSML 非保证: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/text
- WebKit getVoices: https://developer.apple.com/documentation/webkitjs/speechsynthesis/1634378-getvoices
- WebKit voices bug: https://bugs.webkit.org/show_bug.cgi?id=290497
- WebKit iOS embedder history: https://bugs.webkit.org/show_bug.cgi?id=239816
- eSpeak NG: https://github.com/espeak-ng/espeak-ng
- eSpeak NG CLI: https://manpages.debian.org/trixie/espeak-ng/speak-ng.1.en.html

**证据说明**：仓库源码、五章音标统计、WebKit/云服务文档均做了只读核对；此次**未**取得私人 iPhone 设备上的新手势测试、在线七章完整内容、Google/Azure/Polly 真实收费调用、用户账户付款条件，也未建立一份 DIGR 正式可核验运行账本。以上未测项均在正文中单独标注，不能以文字方案或脚本测试替代实际音频/付费安全验收。
