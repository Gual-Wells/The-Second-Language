# 第四部分口语题目音频：考试形式、工具与选择

研究日期：2026-10-04，北京时间。本文件为方案建议，不启用正式音频入口，不改变写作题目或隐藏参考答案的既有语义。本轮查询官方接口与资料，没有进行 TTS 合成或音质验收。

后续实测更新（同日）：独立试听页已经生成微软 Harry、Kokoro George、Aura-2 Apollo 共九段音频，全部通过解码及 Whisper 文字复核。本人认为 Harry 与 Apollo 合格，分别适合标准听力和较有互动感的口语提问；George 因声音低沉不采用。Google 首次及明确要求的重试均由 Cloudflare 返回地区 403，故下文的 Google 首选属于实测前建议，当前不能作为可运行默认。正式 PWA 音频入口尚未启用。听力新增方案与成本见 `ielts-listening-feasibility-2026-10-04.md`。

## 考试形式与产品建议

IELTS 口语是与考官进行交流。Part 1 和 Part 3 为口头提问；Part 2 给可阅读任务卡，有一分钟准备和最长两分钟陈述。因此不建议所有口语文本一律隐藏。[IELTS 官方形式](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking)

建议 Part 1/3 逐题播放已生成的考官音频，默认不显示题目文字；可以重听，也可主动查看原文。后端记录查看/重听情况，帮助分析练习条件，但不自行扣 IELTS 分。Part 2 播放考官引导，任务卡及提示点保持可见，准备计时从音频播放完成且题卡显示后开始；题卡在作答期间仍可查看。跟问使用口头题目的呈现。全部参考答案继续默认隐藏，以文本提供；写作题保持当前文本/图表呈现。

这是固定题目的练习模拟。要根据考生刚说的内容临场追问，须增加独立对话出题环节；固定音频本身不能假装实现真实考官的动态讨论。也不将口语练习变成只允许听一次的听力考试。

## 现有资源池足够生成文件

本轮真实读取 `https://openrouter.ai/api/v1/models?output_modalities=speech`，返回 23 个专用语音输出模型。普通 `/models` 默认结果没有完整列出这组模型；仅沿用此前音频输入目录会漏掉 TTS。完整价格快照另存 `outputs/openrouter-tts-catalog-2026-10-04.json`。

OpenRouter 已支持 `POST /api/v1/audio/speech`，返回音频二进制和 X-Generation-Id，可沿用现有钱包，由 Cloudflare 请求。无需注册新的 Google、微软或 Fish 账户。目录可用不代表本人账号的每个端点均已调用成功，正式候选须通过实际后端生成验证。[OpenRouter 专用 TTS 接口](https://openrouter.ai/docs/guides/overview/multimodal/tts)

本轮专用目录没有 GPT-4o Mini TTS，尽管接口文档仍用它举例，不把示例视为当前可用端点。已测试的 GPT Audio 是可以输出音频的通用模型，但精确照稿读题优先专用 TTS。Whisper 只作转写；已用的 Qwen Omni/Gemini Flash 也不能仅凭能分析声音就视为专用合成接口。Qwen TTS 是另外的模型，计费不同。

Cloudflare 既有账户另有 `@cf/deepgram/aura-2-en`，可作独立账户池的合成候选。腾讯 SOE 账户并不等于已经开通腾讯 TTS；不为本次需求增加开户环节。iPhone 原生朗读可作练习辅助，但当前浏览器机制不能可靠导出所选原生声音为发布音频文件，不作为固定文件生产通路。

## 费用与优先选择

统一按预算汇率 7 元/美元。示例一题组约 3,000 英文字符、3 分钟题目音频，一个月 10 题组；这是规划例子，不是本项目确定题量。只合成题目与必要考官指令，不合成参考答案。重播复用文件，不再产生合成费用。对象存储、请求、校验、重试与充值手续费另计。

| 候选 | 当前计费与人民币换算 | 示例每题组 / 每月 | 建议 |
|---|---|---:|---|
| Gemini 3.8 Flash TTS | 输入 $0.5/M 文本 token，输出 $9/M 音频 token；按 25 音频 token/秒估计输出 ¥0.0945/分钟 | 约 ¥0.29 / ¥2.9 | 综合首选试听，明确照稿与语气配置适合考官问句 |
| Gemini 3.8 Flash Lite TTS | 输入 $0.5/M，输出 $6/M；输出约 ¥0.063/分钟 | 约 ¥0.19 / ¥1.9 | 节约方案，差额很小，质量同样合格时再比较 |
| Microsoft MAI-Voice-2.1 | $22/M 字符，¥0.154/千字符 | ¥0.462 / ¥4.62 | 高质量候选；若听审更自然、忠实，可采用，增费合理 |
| Kokoro 82M | 最低端点 $0.62/M 字符；另列端点 $4/M，¥0.00434–0.028/千字符 | ¥0.013–0.084 / ¥0.13–0.84 | 极低成本候选；实际语音合格可选，不能只因最低价格断言质量 |
| Fish S2.1 Pro | $15/M UTF-8 字节，¥0.105/千字节；普通英文近似每字符一字节 | ¥0.315 / ¥3.15 | 自然表达候选，英文音色选择及精确读题须验证 |
| Qwen Audio 3.0 TTS Plus | $20/M 字符，¥0.14/千字符 | ¥0.42 / ¥4.2 | 可用候选，成本并不等同廉价的 Qwen 原声分析 |
| Cloudflare Aura-2 English | $0.03/千字符，¥0.21/千字符 | ¥0.63 / ¥6.3 | 独立池备用候选，无需新账户，仍需验收 |

当前价格依据：[Gemini Flash TTS](https://openrouter.ai/google/gemini-3.8-flash-tts)、[Lite](https://openrouter.ai/google/gemini-3.8-flash-lite-tts)、[Microsoft](https://openrouter.ai/microsoft/mai-voice-2.1)、[Kokoro 端点价格](https://openrouter.ai/hexgrad/kokoro-82m)、[Fish 字节计价](https://openrouter.ai/fish-audio/s2.1-pro)、[Qwen TTS Plus](https://openrouter.ai/qwen/qwen-audio-3.0-tts-plus)、[Cloudflare](https://developers.cloudflare.com/workers-ai/models/aura-2-en/)。Gemini 每秒 25 音频 token 来源为 [Google 官方计价说明](https://cloud.google.com/text-to-speech/pricing)，实际 OpenRouter 扣费须由 generation 记录核对。当前 Google 价格可能变化，不把促销长期固定。

微软原厂将 MAI-Voice-2.1 定位为较高保真自然表达模型，并提供英、美、澳等英语语言选项；这是厂商能力声明，不是本项目已经验收的结果。[微软官方](https://microsoft.ai/models/mai-voice-2-1/)

明确建议：先试听 Gemini 3.8 Flash TTS、MAI-Voice-2.1 和 Kokoro 的相同短题组。若 Flash 明显合格，就可作默认；微软有实质改善则接受每月约一两元级差额；Kokoro 同样合格且自然时可采用，性价比会很突出。Lite/Fish 留后续候选，不为每个目录模型各做大规模测评。不能根据原声分析质量推断同品牌 TTS 质量。

## 质量与生成要求

固定成熟考官音色，自然中性、清楚、正常交谈速度；英国或其他清楚的英语口音均可，不要求所有题目只用美音。避免戏剧表演、背景声和声音克隆。逐题独立文件让重听、换题与复用更方便。

最重要的是题文忠实：不得增删改写问题、否定、比较对象、数量或条件，不把风格指令/Markdown 念出来，不长时间空白、不截尾、不突然换声。Google 3.8 TTS 将 input 当作照稿文本，语气须放 `provider.options` 内的 `speech_metadata.style`；其他厂商依各自真实支持项配置，不能照搬参数。[Google 生成要求](https://ai.google.dev/gemini-api/docs/speech-generation.md)、[OpenRouter 参数](https://openrouter.ai/docs/guides/overview/multimodal/tts)

生成后可用 Whisper 回转写检查明显漏词/改词，但 ASR 比对不是人耳的自然度验收，识别错误也不直接要求重生成。先完成同一小题组的完整听审，再把实测通过的声音加入运行协议；无需用四路回答分析全套去验每个短问题。

## 工程闭环建议

Codex 定稿原创题目、隐藏参考答案及独立考官指令 → Cloudflare 专用合成任务 → 私有保存不可变音频与清单 → 完成题文/声音核对 → 发布练习题音频关联 → PWA 点按播放与录音作答 → 现有四路回答采集及 Codex 分析。

权威题文仍保留在独立练习库，绑定题目版本与摘要；隐藏是对读者的呈现策略，不是删除文本。音频身份包含题目版本、实际朗读文字、模型/端点、声音及参数。参考答案保持独立隐藏身份，不与题文揭示混用。Part 1/3 的列表、搜索摘要、书架和 API 也要防止提前泄题，仅返回题型/中性标题；主动查看原文后才下发文本。Part 2 返回可见题卡，但考官跟问仍按口头题目处理。

音频放独立私有媒体对象，D1 存索引，不把 base64 塞正文或题目 JSON。读取经同域登录接口，支持 iPhone 的 Range 与 MIME；选定供应商实际支持 MP3 时优先 MP3，PCM 必须正确封装或转换后播放，不能只改扩展名。当前正式私有桶仍待配置，不能宣称已具备线上音频发布。

播放与录音互斥，答题前先停止声音，保存是正常播放还是提前查看原文；iPhone 由用户点按启动，不依赖自动播放。2008 风格沿用既有题卡和低视觉权重按钮，不建设另一个视觉体系。

OpenRouter TTS 与回答分析共用钱包：缺钱保存定稿/成功音频，次日核对充值后续作，不重复合成已有文件。要开启独立池代偿只能调用实际验收通过的 Aura-2；考试模拟中不得静默显示原本隐藏的题文来伪装音频成功。可主动选择看题练习并记录条件。

另一个接口差异：专用 TTS 文档明确 `provider.order/only/ignore` 不用于 speech 请求。因此 Kokoro 最低价只是端点价格，不是本项目能够用普通 Chat 路由参数锁定的费用承诺；所有调用保存 generation ID 和实际账单，设置可停止的费用范围。
