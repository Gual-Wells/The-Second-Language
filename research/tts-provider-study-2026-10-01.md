# 第二语言 TTS 工具独立调研

状态：2026-10-01 依据供应商现行公开文档完成桌面调研。未开通新账户、未调用付费接口、未生成或发布语音；这不是课程运行协议。

## 项目判断

第二语言需要三种音频：第一部分的词、派生词和短语，第二部分的完整例句，第三部分的连续文章。第一部分最需要指定美式读音；第三部分最需要自然语流、逐句定位和跨段稳定。现行正文已经有 `USE` 和 `SENTENCE` 编码，但 `EXAMPLE:U001` 可重复，接音频前须为每条例句建立独立的 `E` 编码。正文与音频应以章节摘要绑定，音频放不可变对象资源，正文修订后使旧音频清单失效。详见 [audio-delivery.md](audio-delivery.md)。

本项目的首轮候选应为 **Google Cloud Neural2、Amazon Polly Neural、Azure Speech 标准神经语音**。三者官方都提供 IPA 控制和可供句子定位的标记机制；具体声音是否准确、自然，仍需同一份材料盲听。若只选一个先做技术样机，优先 **Google Neural2**：其 IPA 和 `<mark>` 时间点可在同一合成 API 中使用，且每月有 100 万计费字符的免费额度；若 Google 账户或支付不可用，优先 **Polly Neural**。Azure 是同级备选，尤其适合其账户已可用的情况。此顺序是接口与成本上的研究判断，不是已完成的声音质量结论。

| 工具 | 经官方资料确认的能力 | 成本与边界 | 本项目位置 |
| --- | --- | --- | --- |
| [Google Cloud Neural2](https://docs.cloud.google.com/text-to-speech/docs/ssml) | SSML IPA `<phoneme>`、`<mark>` 时间点；单次普通合成 5000 字节，文章需分段。 | [价目](https://cloud.google.com/text-to-speech/pricing)：每月前 100 万计费字符免费，之后 16 美元/百万；除 `<mark>` 外 SSML 标签也计费，必须启用 Billing。 | 首轮完整链路候选。|
| [Amazon Polly Neural](https://docs.aws.amazon.com/polly/latest/dg/phoneme-tag.html) | IPA `<phoneme>`、[speech marks](https://docs.aws.amazon.com/polly/latest/dg/speechmarks.html)，亦支持 SSML `<mark>`；普通请求最多 3000 个计费字符。 | [价目](https://aws.amazon.com/polly/pricing/)：16 美元/百万字符；符合条件的新账户前 12 个月每月 100 万免费；音频与时间标记是两次分别计费的请求。 | 完整链路候选，支付路径对中国账户较清楚。|
| [Azure Speech 标准神经语音](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation) | IPA `<phoneme>` 与 [bookmark](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-structure) 事件；须核对具体 en-US 声音是否支持所用标签。 | [F0 每月 50 万字符](https://azure.microsoft.com/en-us/pricing/details/speech/)；这是独立免费层，不能径直从 S0 月账单扣除。S0 单价随地区/币种显示，本轮未取得可核实报价。 | 完整链路候选。|
| [ElevenLabs v4 / v3 / Flash v2](https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries) | 指定模型可用 IPA 发音词典；可另做强制对齐；其他模型可能忽略词典音素。 | [API 价目](https://elevenlabs.io/pricing/api) 现列 v3 0.08 美元/千字符、v3 Conversational 0.04；v4 当前限时优惠不可作为长期预算。 | 声音质量标杆或文章升级候选，成本与对齐另计。|
| [Gemini 3.8 Flash TTS](https://ai.google.dev/gemini-api/docs/speech-generation) | 官方强调表现力和长文稳定性；本轮未见 IPA 指定或句子时间标记接口。 | [Gemini Developer API](https://ai.google.dev/gemini-api/docs/pricing) 列有免费层；付费标准层截至 2026-12-31 为输入 0.50 美元/百万文本 token、输出 9 美元/百万音频 token。Cloud TTS 计费入口不列免费层，二者不可混算。 | 第三部分自然朗读候选，需另对齐。|
| [Qwen-Audio-3.0-TTS-Plus](https://help.aliyun.com/zh/model-studio/qwen-audio-3-0-tts-plus) | 支持英语与风格控制；本轮未在该模型接口确认 IPA 或句子书签。阿里云其他语音产品有 SSML/时间戳，不应转嫁为此模型的能力。 | 北京区 1.4 元/万字符；60–120 万字符约 84–168 元，不含重复合成。 | 国内支付方便的长文候选。|
| [Fish S2.1 Pro Free](https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits) | 适合试听自然度；未找到等价 IPA/书签控制。 | 当前标价免费；[官方说明](https://fish.audio/blog/s2-1-pro-free-api/)免费窗口至 2026-11-30、无 SLA、可能保留请求以改进模型。付费 Pro 为 15 美元/百万 UTF-8 字节。 | 免费参考，不作为每日 03:00 定时任务的唯一音源。|
| [腾讯云 TTS](https://cloud.tencent.com/document/product/1073/49575) | 英语可以使用 SSML，但官方 `<phoneme>` 只给 `alphabet="py"` 拼音，没有证据支持英语 IPA；长文本接口可生成字幕。 | [800 万免费字符](https://cloud.tencent.com/document/product/1073/34112)为一次性、三个月有效，适用范围不含长文本；通用精品音色与长文本服务不能混用单价。 | 低成本例句/文章备选，不宜承担词典读音主源。|
| [Cloudflare Aura-2 / MeloTTS](https://developers.cloudflare.com/workers-ai/platform/pricing/) | 可复用现有 Cloudflare 账户；现查接口无可证明的 IPA 和句子标记能力。 | Aura-2 每千字符 0.03 美元；MeloTTS 按音频分钟计费。 | 工程便捷，教学准确性需样本证明。|
| [Groq Orpheus](https://console.groq.com/docs/text-to-speech/orpheus) | 官方单请求仅 200 字符，缺少 IPA/句子标记。 | 22 美元/百万字符。 | 不适合整章文章。|

## 对前驱报告的修正

1. Azure F0 是独立用量层，不能把 50 万字符从付费 S0 直接相减后得出月费；本轮官方网页也未提供可核实的 S0 地区单价。
2. 腾讯云通用精品音色低价和一次性免费包不能直接套到长文本；其音素标签为中文拼音，不是英语 IPA。
3. Gemini 3.8 的 **Developer API** 标出免费层，而 Google **Cloud TTS** 同型号价格页未列免费额度；必须按具体入口核算。
4. ElevenLabs 当前公开价目为 v3 0.08 美元/千字符、v3 Conversational 0.04，前驱报告中的 0.05–0.10 范围及 Apple Gift Card 支付推断都不能直接用于自动 API 预算。
5. Fish 免费服务存在明确期限与无 SLA 条件；榜单中的音色偏好不能证明教材发音准确率或文本忠实度。

## 账户、成本、运行边界

以每月 **60–120 万原始英文字符**为演示量，Google Neural2 理论上约 0–3.2 美元/月，但实际 SSML 标签会抬高计费字符；Polly Neural 在免费资格之外约 9.6–19.2 美元/月，文章时间标记的第二次请求及重试还会增加用量。二者均不含对象存储、流量、税、汇率和额外服务。这个演示量尚未从 40 词真实章节精算，应先量取一份正文中的词、例句和文章英文字符，不把中文译文、编码或 Markdown 喂给 TTS。

若以中国大陆个人账户付款，[AWS 文档](https://docs.aws.amazon.com/zh_cn/awsaccountbilling/latest/aboutv2/manage-payment-cny.html)说明符合条件的 AWS Inc. 账户可用人民币网银或银联信用卡，需身份验证；[Azure 文档](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/supported-payment-methods)在中国栏列银联与支付宝扫码；[Google Cloud](https://docs.cloud.google.com/billing/docs/how-to/payment-methods)方式取决于账户国家和币种，且不接受预付卡。上述均只是官方可用方式，不证明本用户的账户能开通、能支付，也不证明 Apple Gift Card 能支付 API 账单。

运行时应由 Codex 先完成正文及音标审核，再把结构化朗读任务交给 TTS 适配器；产物写入 `chapter.audio.json` 和不可变音频对象，由 PWA 根据 `USE`、独立 `E`、`SENTENCE` 定位。发音覆盖必须逐词、逐语境指定；同形异音词不能按拼写全局替换。文章按自然段合成并保留逐句时间偏移，失败可重试单段；语音失败不阻断文字课程发布。听审仍必须检查音标对应词、例句、长文漏增词、跨段音色和 iPhone 播放定位，IPA 标签不是音频质量保证。

语音合成本身消耗供应商算力和计费额度，不要求 Codex 逐字“念出”音频，也不需要把音频字节放进模型上下文。首次接入要建设适配器、R2 交付、播放与校验，工程工作量明显；日常可把抽取、分段、请求、重试、清单和上传交给脚本。Codex 的新增注意力主要落在选择语境读音及判断难词是否需要听审，若对所有音频再用模型听审或转写，才会显著增加模型额度与外部费用。因此先只对多音词、生僻派生词、数字缩写和可疑长文片段做重点核查。

## 社区反馈与证据界限

在 [ElevenLabs 长文用户讨论](https://www.reddit.com/r/ElevenLabs/comments/1ucf0a4/how_do_you_improve_voice_consistency/)中，有人报告切段后同一音色变化，供应商人员建议长文使用更稳定的 v2 或其有声书工具；另一位[长期用户](https://www.reddit.com/r/ElevenLabs/comments/1tw0lkw/how_do_you_catch_the_last_5_of_errors_in_long_tts/)报告人名误读、短促瑕疵和语调问题。它们是自报案例，不是可推及所有声音或服务的故障率。没有找到能同时测本项目 IPA 异读词、英文文本忠实度、长文连贯性和 `SENTENCE` 时间点的独立对照评测，因此不能用自然度榜单替代本项目盲听。

这轮只完成官方资料、少量社区一手反馈与现有仓库接口核查。供应商开通、实际支付及实际听感还没有通过本项目素材验证；正式课程测试维持暂停。

