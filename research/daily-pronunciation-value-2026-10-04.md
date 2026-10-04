# 日课朗读：现有资源与性价比

研究日期：2026-10-04。目标是自然、清楚、忠实且价格合理的日课点词、例句、文章朗读，允许已有高容错定位，不追求最高表达力。这是研究建议，没有改动正式朗读、定时任务或数据库，也没有进行新的收费合成。

## 当前确实能复用什么

正式 PWA 已有设备 Web Speech 点词/点句；本人真机反馈可用但声音机械。第四部分已接通 Cloudflare 后端、OpenRouter 钱包和专用 TTS、私有 MP3 与 Range 播放、片段复用及额度恢复。日课可以复用供应商适配和播放存储能力，但目前的媒体授权关联 practice_sets，不能把日课伪造为雅思练习册来借用该数据库。

回读既有私有试听反馈：微软 MAI-Voice-2.1 / Harry 与 Aura-2 / Apollo 均被本人判为合格，四项均为 5；Kokoro / George 被判不合格，原因是音色低沉。短题音频已生成、解码并经 Whisper 转写核对；这些证据不能直接证明日课单词、异读词和数分钟文章都合格。未试听其他 Kokoro 音色，不能淘汰整个模型。

本轮重新实际获取 OpenRouter speech 目录和相关 endpoints API：23 个模型，Kokoro 两个端点、微软 Flash 和 Fish Free 都有当前端点。目录证据只能说明可发现、标价与音色，不证明个人账号调用成功或听审合格。Whisper 是转写资源，既有 Qwen Omni/Gemini 原声分析不是同名 TTS 的验收依据。

## 价格及优先级

预算换算为 1 USD = 7 CNY，不是实时银行汇率。以下费用仅合成费，按每月 **10 万新合成英文字符**举例；重听命中同一文件不再付合成费。充值手续费、请求、存储、复核、失败或修订另计。Fish 按 UTF-8 字节，普通 ASCII 英文与字符数近似相同。

| 资源 | 目录/端点价格 | 示例费用 | 项目证据与定位 |
|---|---|---:|---|
| Kokoro 82M | $0.62–4 / 百万字符 | ¥0.43–2.80 | 美式 af_heart、af_bella 最值得先试；George 的失败不代表这两个失败。持续低价候选 |
| Fish S2.1 Pro Free | 当前为 0 | ¥0 | 免费候选，无 SLA；个人实际调用、音色稳定和限流尚未测。不能依赖永久免费 |
| Orpheus 3B | $7–15 / 百万字符 | ¥4.90–10.50 | 中价候选，未在本项目试听；Tara/Leah 可试，但先排在 Kokoro/Fish 之后 |
| CSM 1B | $7 / 百万字符 | ¥4.90 | 未测，read_speech 音色可探索；没有既有合格证据，当前非首选 |
| MAI-Voice-2.1-Flash | $15 / 百万字符 | ¥10.50 | 比已合格的 2.1 标准版便宜约 32%；美式 Harper/Grant 可测，Flash 不能沿用标准版验收 |
| Fish S2.1 Pro 付费 | $15 / 百万 UTF-8 字节 | 约 ¥10.50 | 免费版体验合格后保留连续服务选项，未测 |
| Qwen TTS Flash | $15 / 百万字符 | ¥10.50 | 与廉价原声分析不是同一计费；目前未测，价格不比微软 Flash 更低 |
| MAI-Voice-2.1 | $22 / 百万字符 | ¥15.40 | 已验证 Harry 短题；美式音色仍需试听。可用质量参照及付费备用 |
| Cloudflare Aura-2 | $30 / 百万字符，扣除剩余每日免费配额 | ¥0–21 的计价参考 | Apollo 短题已合格、现有后台可调用；少量分散点读可能免费，大规模全量合成不占价格优势 |

Kokoro 和 Orpheus 的价格区间来自当前不同端点；OpenRouter speech 接口不应用 provider.order/only/ignore，因此不能保证最低价端点。应记录实际 generation、价格与已完成资产，按较高已知端点预留预算。

Cloudflare 每日共享 10,000 Neurons，Aura-2 2727.27 Neurons / 千字符；若全部配额用于 Aura，约可合成 3667 字符/日。Whisper 和其他 AI 会占用同池，不结转，不能把它算成可任意一天支用的月免费额度。超限在 Free 计划会失败，Paid 计划才可支付超额；本轮没有变更计划。大量整章配音按未扣免费费率比较即可，不因免费日配额把 Aura 称为无限免费。

Fish 官方目前公布自有免费 API 窗口到 2026-11-30，OpenRouter Free 当前仍有零价端点但 expiration_date=null；这不证明转售通路承诺同一期限或永久可用。其速率政策应以端点返回及本人的 key 信息核对，不把 Fish 直连 Fair Use 套到 OpenRouter 请求。

如果假设每月 60 万至 120 万字符都合成一次，Kokoro 按现有端点约 ¥2.60–33.60，微软 Flash 约 ¥63–126，微软标准版约 ¥92.40–184.80，Aura 未扣每日免费约 ¥126–252。该字符区间仅作容量情景，没有实际 40 词日课英语总长度证明，不能报告为真实月账单。

## 技术适配与质量底线

首选考察明确美式声音，与第一部分美式音标协调。专用 OpenRouter TTS 的标准输入是要朗读的英文；不要把中文说明、Markdown、译文、编码或通用 LLM 指令混入。接口不能从 Azure 内部使用 SSML 推导出用户能传任意 phoneme；当前公开统一参数没有承诺通用 IPA 强制能力。音色自然与特定异读正确是两件事。

Kokoro 官方音色材料提示很短、很长输入都可能较弱。单词、短语、同形异音词须独立试听；例句以完整句为单位，文章按自然段提供上下文，避免每句碎片合成后硬拼成机械文章。af_heart/af_bella 的作者标级用于筛选候选，不作项目教学质量认证。

需要核对 record/present/object 的词性重音、lead/read/wind 的上下文读法、派生词、短语、数字和长从句。同拼写但用法不同的音频不直接合并。只有能听清且忠实、没有明显错读或漏增词才接受；不要求高情绪或昂贵声学细节。长文和孤立单词可使用不同已合格资源，不必强行一个模型覆盖所有情况。

## 推荐接入方式

先按需点读和持久复用，不把每日文字课改成必须整章配音：

1. PWA 点词/点句 → 同域授权接口定位当前章节/临时页的有效内容。
2. 后端核对真正英文文本与用法上下文，构造文本、发音上下文、模型、音色、语速的摘要身份；命中资产直接播放。
3. 首次请求在 Cloudflare 合成并保存 MP3，合并重复并发请求，成功资产不可变；失败/未知计费不盲目重付。
4. 首次显示正在准备，保存后让本人点播放以适配 iPhone 手势要求；后台完成后自动发声是否可行需真机验证。
5. 第三部分继续可选点词/点句，将来全文朗读再按段准备资产与句子定位。已有第三部分 SENTENCE 可复用；长期逐条例句清单仍协调 AUDIO_EXTENSION 中的 E 编码升级。
6. 日课语音资产另有正文摘要关联，不混用 practice_sets；临时页独有资产遵循 48 小时规则，复习同内容可复用有效正式资产。当前媒体 KV 和 Range 播放可复用适配，不需要重新开户。

资源优先顺序不是简单付费价排序：低量点读先考察已合格的 Aura 剩余免费配额；持续大用量优先验收 Kokoro 美式；Fish Free 作为零价候选与机会通路；微软 Flash 为合格后可控的付费备用。默认日课不用多模型重复合成或原声分析的四路全量诊断套餐。已有好声音应当只合成一次，模型额度主要用于教材和内容。

## 精简的下一轮试听

共同材料三类：孤立词/短语与异读对照句、真实日课例句、数分钟连续文章。候选 af_heart、af_bella、MAI Flash 美式、Fish Free；保留已合格微软标准/Apollo 作参照。第一次听审优先问“清楚、忠实、自然是否足够”，合格者按实际单价、延迟和稳定性选。若 Kokoro 已合格，不继续为小音质提升扩展昂贵候选；若短词不合格而文章合格，可以分工。

## 官方依据

- OpenRouter 当前目录：https://openrouter.ai/api/v1/models?output_modalities=speech
- TTS 参数及路由：https://openrouter.ai/docs/guides/overview/multimodal/tts
- Kokoro 价格：https://openrouter.ai/hexgrad/kokoro-82m
- Kokoro 音色及短长输入提示：https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- Fish 免费端点：https://openrouter.ai/fish-audio/s2.1-pro-free:free
- Fish 官方免费窗口：https://fish.audio/blog/s2-1-pro-free-api/
- 微软 Flash：https://openrouter.ai/microsoft/mai-voice-2.1-flash
- Orpheus：https://openrouter.ai/canopylabs/orpheus-3b-0.1-ft
- Cloudflare Aura：https://developers.cloudflare.com/workers-ai/models/aura-2-en/
- Cloudflare 计费：https://developers.cloudflare.com/workers-ai/platform/pricing/
