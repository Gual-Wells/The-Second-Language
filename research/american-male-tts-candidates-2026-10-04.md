# 美式男声候选调研（2026-10-04）

## 试听页与现有证据

Kokoro 页面、脚本、授权清单、反馈与音频均现场检查成功；页面保留供比较。完整入口仍为既有带 access 的私人链接。本轮将反馈恢复接口从仅恢复 17 张截图改为按时间整合独立 D1 里的实际提交，排除 automation-* 的验证记录。新浏览器已验证恢复全部 40 项词汇、句子反馈，20 个音色可选，Bella 句子 5 分可见。未修改正式日课、休息开关、VIX 标记或生产音频配置。

用户重点偏好来自本人已提交反馈：清晰、正常语速、自然起伏、避免慢与越来越慢、过低沉、沙哑/卡痰/噪点感、鼻音与突然收尾。目标是合格后优先价格，不为微小音质提升追逐昂贵模型。女声已有 Bella、Aoede、Heart 等可用候选，本轮集中男声。

## 价格口径

沿用试听预算汇率 $1=¥7，作为预算折算而非即期汇率。每月 10 万新字符对应点读情景；60 万–120 万对应整章情景。这些是统一比较情景，不是已统计的正式每月消耗。缓存文件重复播放不再次合成。下表不计税费、充值手续费、流量或未确认的免费额度，也不将 OpenRouter 余额算成各模型独立额度。

| 模型/渠道 | 单价 | 10 万新字符/月 | 60 万–120 万/月 | 音色候选与可用性 |
|---|---|---:|---:|---|
| Kokoro / OpenRouter | $0.62–4 / 百万字符 | ¥0.43–2.80 | ¥2.60–33.60 | 原有美式男声已试听；保留 Fenrir、Michael、句子用 Liam 作参照 |
| Orpheus 3B / OpenRouter | DeepInfra $7、Together $15 / 百万字符 | ¥4.90–10.50 | ¥29.40–126 | leo、dan、zac 已在当前 supported_voices；先测 Leo、Dan，Zac 同批补充 |
| MAI-Voice-2.1-Flash / OpenRouter | $15 / 百万字符 | ¥10.50 | ¥63–126 | 官方与路由目录均确认 en-US-Ethan、Grant、Jasper、Sage 四种男声，均需完整 Flash 后缀 |
| MAI-Voice-2.1 / OpenRouter | $22 / 百万字符 | ¥15.40 | ¥92.40–184.80 | 同四种美式男声；若 Flash 听感不足，再比较标准版，不继承 Flash 验收 |
| Aura-2 / OpenRouter 或现有 Workers AI | $30 / 百万字符标价 | ¥21 | ¥126–252 | Arcas、Aries、Apollo 等正式标注 American 男声；CF 免费额度实际结算另看，未计入保证 |
| Gemini 3.8 Flash-Lite TTS / OpenRouter | 文本 $0.50/M tokens、音频 $6/M tokens | 约 ¥6.30 | 约 ¥38–76 | Puck、Iapetus、Achird 可作风格候选，须确认区域音色/美式口音；名字不能与 Kokoro 同名音色混同 |
| Gemini 3.8 Flash TTS / OpenRouter | 文本 $0.50/M tokens、音频 $9/M tokens | 约 ¥9.50 | 约 ¥57–114 | 同类声音可比较标准版本；未实测 |
| Grok Voice TTS 1.0 / OpenRouter | $15 / 百万字符 | ¥10.50 | ¥63–126 | Rex 为候选，Sal 为中性声音可用性观察；Leo 官方当前标 British，排除美式目标 |
| Sesame CSM 1B / OpenRouter | $7 / 百万字符 | ¥4.90 | ¥29.40–58.80 | conversational_a/b、read_speech_a/b/c/d、none；目录缺少明确的性别/口音标注，待识别 |
| Qwen Audio 3.0 TTS Flash / OpenRouter | $15 / 百万字符 | ¥10.50 | ¥63–126 | 当前目录仅列 loongjohn、longanhuan_v3.6；美式男声 ID 可用性尚未确认 |
| Qwen Audio 3.0 TTS Plus / OpenRouter | $20 / 百万字符 | ¥14 | ¥84–168 | 当前目录仅列 longanlingxin、longanlufeng；同上 |
| Fish S2.1 Pro Free / OpenRouter | 当前免费 | ¥0（配额可用时） | 无长期供给保证 | 缺少可直接确认的固定美式男声；需要筛选/指定参考声音，暂不作最快固定声音路线 |

Gemini 估算按 1000 英文字符/分钟、25 输出音频 tokens/秒、输入约 4 字符/token；只是情景换算，语速和停顿会改变费用。不能把音频 token 单价写成字符单价。官方当前优惠显示至 2026-12-31，2027 标准价格翻倍，后续需刷新预算；OpenRouter 不保证自动提供 Google 直连 Batch/Flex 的折扣。

如果男声只承担全部合成字符的 30%，上表整章费用对应乘 0.3。例如 MAI Flash 约 ¥18.90–37.80，DeepInfra Orpheus 约 ¥8.82–17.64。这是比例示例，未锁定分配比例。

## 官方与社区证据

### MAI：当前最有把握的第一组候选

微软官方明确四种 en-US 男声。Ethan 支持较多情绪样式，Grant/Sage 支持 agent、audiobook、educational、narrator 等，Jasper 提供 neutral。这说明可调用与风格支持，不证明声音明亮或不低沉。Flash 与标准版应分别验收。

社区已有 MAI-Voice-2 的使用者反馈清晰、情绪丰富、像真人，另一条讨论将微软 MAI 列为自然 TTS 的较好候选。但这些不是对刚发布的 2.1 Flash 四种男声逐个盲测。此前用户 Harry 试听好评属于英式男声，不充当美式音色合格证据。

- [微软官方 MAI 音色表](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/mai-voices)
- [OpenRouter Flash](https://openrouter.ai/microsoft/mai-voice-2.1-flash)
- [OpenRouter 标准版](https://openrouter.ai/microsoft/mai-voice-2.1)
- [MAI 社区使用反馈](https://www.reddit.com/r/TextToSpeech/comments/1um8t55/the_best_value_cloud_tts_has_dropped_guys_mai/)

### Orpheus：更便宜，但男声不能继承 Tara 的评价

OpenRouter 当前真实目录确认 leo/dan/zac。官方仓库将 Leo、Dan、Zac 排在其主观 conversational realism 列表的相应位置；这是作者判断，不是独立排名，也不是“这三种男声都清晰明亮”的认证。社区有人认可表现力，也有人在同一发布讨论指出女声比男声更少机械感。仓库 issue 307 报告本地 streaming 实现极短输出可能丢失尾缓冲而无音频，issue 299 报告起始噪点；不能推定托管 API 一定复现，但孤立词与收尾必须实际试听。

价格需路由到 DeepInfra 才是 $7，允许 Together 回退时可到 $15。若固定低价渠道，需要已有余额/未知结果恢复协议保障，不无条件重付。

- [官方仓库](https://github.com/canopyai/Orpheus-TTS)
- [当前 OpenRouter 服务与价格](https://openrouter.ai/canopylabs/orpheus-3b-0.1-ft)
- [社区对男女音色差异的反馈](https://www.reddit.com/r/LocalLLaMA/comments/1jf6igq/apache_tts_orpheus_3b_01_ft/)
- [极短音频 issue](https://github.com/canopyai/Orpheus-TTS/issues/307)
- [起始噪点 issue](https://github.com/canopyai/Orpheus-TTS/issues/299)

### Aura：明确的美式声音特征，成本较高

官方 Arcas 为 American、Natural/Smooth/Clear/Comfortable，Aries 为 American、Warm/Energetic/Caring，Apollo 为 American、Confident/Comfortable/Casual。按用户目标优先补 Arcas 和 Aries；Apollo 已被用户认可，是现有对照。社区既有“不过度表演、长对话稳定”的评价，也有声音不够自然/不够连贯的评价。部分反馈针对旧版或自部署，并非当前 Arcas 的直接评价。官方名词“Clear”不替代个人验收。

- [官方音色与口音表](https://developers.deepgram.com/docs/tts-models)
- [官方价格](https://deepgram.com/pricing)
- [社区长期使用讨论](https://www.reddit.com/r/VoiceAutomationAI/comments/1thmeb5/whats_the_most_humansounding_tts_voice_youve/)
- [社区连贯性讨论](https://www.reddit.com/r/TextToSpeech/comments/1qejp56/best_tts_with_native_streamings_support_quality/)

### Gemini：费用已更合理，风格与口音仍需现场确认

官方列 Puck 为 upbeat、Iapetus 为 clear、Achird 为 friendly，并提供区域/性别/音高等过滤的扩展音色库。明确 en-US、medium pitch 的区域声音更符合本轮任务；不能用普通 style 指令强改固定音色的永久口音。OpenRouter 当前公开目录列 30 种传统名字，产品页同时声称支持 voice_ 自定义 ID，但我们尚无扩展库的已确认美式男声 ID。社区曾认可 Puck/Charon，也反馈新版本过多气声、情绪夸张及声音更新变化；Live/App/NotebookLM 的声音投诉不能直接当作本 TTS API 的复现结果。

- [官方声音与区域筛选](https://ai.google.dev/gemini-api/docs/speech-generation)
- [官方价格及 25 tokens/秒换算](https://ai.google.dev/gemini-api/docs/pricing)
- [OpenRouter Flash-Lite](https://openrouter.ai/google/gemini-3.8-flash-lite-tts)
- [OpenRouter Flash](https://openrouter.ai/google/gemini-3.8-flash-tts)
- [社区声音听感描述，模型分析而非盲测](https://www.reddit.com/r/Bard/comments/1kv4yew/all_gemini_voices_described_properly_by_gemini/)
- [社区对情绪与气声的讨论](https://www.reddit.com/r/TextToSpeech/comments/1um8t55/the_best_value_cloud_tts_has_dropped_guys_mai/)

### 观察项：渠道/音色身份先确认

- **Grok**：Rex 官方描述 confident and clear，Sal smooth and balanced；当前 Leo 为 British。社区 App 用户有低沉、沙哑及声音变动投诉，证据版本/接口与 TTS 1.0 未必相同，因此不当作本 API 淘汰结论，但与本人反感点重叠，排在 MAI 后。
- **CSM**：便宜、面向对话，公开 Demo Miles 的真实感好评不能继承给 CSM-1B。官方模型卡明确 Demo 用微调变体，社区 issue 30 明确不附带 Miles/Maya 音色。本 API 声音性别与美式口音仍待辨别。
- **Qwen**：官方当前 Andy_v3.1、Brian_v3.1、David_v3.1 标 American male，但属于 **qwen-audio-3.1-tts-flash**，不能填进 **3.0** 的请求。官方还给 3.0 基础音色表下载路径，但需要继续核对实际路由支持。不能把 Qwen3-TTS 开源 Ryan/Aiden 与 Qwen-Audio-3.0 服务混为一个音色表。
- **Fish**：免费端点可试，稳定固定美式男声需要参考音色或真实 ID；默认音色的测试不能充当任意男声合格结论。

- [Grok 官方声音](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)
- [Grok 价格](https://openrouter.ai/x-ai/grok-voice-tts-1.0)
- [Grok 社区声音变化反馈，App 非本 API](https://www.reddit.com/r/grok/comments/1vpfmy6/grok_voice_mode/)
- [CSM 价格及当前声音数](https://openrouter.ai/sesame/csm-1b)
- [CSM 官方模型卡](https://huggingface.co/sesame/csm-1b)
- [Miles/Maya 社区讨论](https://github.com/SesameAILabs/csm/issues/30)
- [Qwen 官方音色列表及跨版本限制](https://help.aliyun.com/en/model-studio/qwen-audio-tts-voice-list)
- [OpenRouter 当前 TTS 模型与 supported_voices 目录](https://openrouter.ai/api/v1/models?output_modalities=speech)

## 现有渠道外的模型

Cartesia 和 Inworld 有社区自然度好评，但不在本轮当前 OpenRouter speech 目录。Inworld 当前个人按需 TTS-2 Flash 为 $15/M 字符、TTS-2 为 $25/M，不能沿用旧的 $5–10/M 企业或旧模型口径；整章预算分别 ¥63–126、¥105–210，尚未验证个人支付。Cartesia 当前 Pro $5/月、100K credits，Startup $49/月、1.25M credits；credits、字符与时长需按具体 Sonic 模型换算，不把 1.25M credits 当作 1.25M 字符，且支付未核实。ElevenLabs 仍可作质量参照，但现有路线已有足够更廉价候选，没有必要为下一轮试听先增加这些账号。

- [Inworld 当前价格](https://inworld.ai/pricing)
- [Cartesia 当前价格](https://www.cartesia.ai/pricing)
- [Cartesia 官方声音列表接口](https://docs.cartesia.ai/api-reference/voices/list)
- [社区托管声音对比](https://www.reddit.com/r/VoiceAutomationAI/comments/1thmeb5/whats_the_most_humansounding_tts_voice_youve/)

## 建议的下一步

这是试听优先级，不是已实测的新男声质量榜：

1. MAI Flash 四种 en-US 男声 + Orpheus Leo/Dan/Zac：优先解决个人声音喜好与低价两个方向。
2. Aura Arcas/Aries 加既有 Apollo 作为相对高价对照。
3. 如上述不满意，再选 Gemini Flash-Lite 的已确认美式地域男声；相同声音优先比较 Lite 是否足够，再决定是否增加标准版。
4. Rex、CSM、Qwen 与 Fish 为观察项，先确认声音身份与渠道映射，再决定是否试音。

采用现有三个词和两条短句即可；先不加双人对话。保留原 Kokoro 页面与反馈；新增声音独立记录，不覆盖旧分数。生成走 Cloudflare 服务端，过程文件留本机，音频作为受保护静态文件，反馈 D1，避免复发 KV 账户额度事故。本轮调研没有付费生成新音频。
