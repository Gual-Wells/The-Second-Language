# OpenRouter 账户、原声入口与预算实测

日期：2026-10-03。用户已注册，添加付款卡时实际收到银联卡类型不受支持的提示。本轮获准使用其 API key 与既有录音试验；未充值、未调用付费模型、未写正式作答库、VIX、日课或 PWA。密钥与完整返回只保存在本机忽略目录。

同日后续：$5 credits 已到账，Qwen 真实原声与声音对照请求成功。当前实测状态见 `openrouter-real-audio-test-2026-10-03.md`，下文仍保留首次零余额记录。用户截图明确三家模型地区限制；Gemini 预算只作价格参考。免费 NVIDIA 与 Inkling 端点的个人声音限制也在后续记录中更正，不继续将免费入口作为本人录音候选。

## 账户里的 100 美元是什么

通过认证接口读取当前 key 与账户 credits，两者均 HTTP 200：

| 字段 | 实际值 | 含义 |
|---|---:|---|
| key.limit | $100 | 这把 key 的支出限制 |
| key.limit_remaining | $100 | 此限制下尚可支出的金额，不代表账户余额 |
| key.usage | $0 | 此 key 已记录的费用 |
| credits.total_credits | $0 | 账户 credits 总额 |
| credits.total_usage | $0 | 账户已用 credits |
| free_model_daily_requests.limit | 50 | 当前免费模型每日请求限额 |

因此当前账户没有 100 美元赠送余额。不能拿 key 的 limit_remaining 作为可支付音频请求的资金。正式适配器以后同时读 key 限制与账户余额，分别展示；不能在充值失败时自动改调付费模型。

[Key 接口](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key)、[Credits 接口](https://openrouter.ai/docs/api/api-reference/credits/get-remaining-credits)。

## 两次生成试验

选择目录明确具有音频输入的 `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`，没有发送用户示例中的付费 `openai/gpt-4o`。

1. 免费文本：要求仅回答 OK，HTTP 200，得到 OK；23 输入 tokens、3 输出 tokens，接口记录 cost=0。
2. 免费音频：使用此前 76.796 秒真实作答的 16kHz 单声道 WAV，未附用户确认稿，要求忠实转写并区分声音观察与文本建议。HTTP 402，网关提示 `This request requires at least $0.50 in balance for audio`。没有收到转写或声音反馈；没有开始有效的模型质量比较。

“目录里免费”与“零余额可请求音频”不是同一条件。$0.50 是这次请求返回的账户余额门槛，不是单次音频费用，也不是网站最低充值额。复查账户费用仍为 $0。测试摘要见 `outputs/openrouter-account-test-2026-10-03.json`；原声与完整响应不进入公开仓库。

当前目录的 `openai/gpt-4o` 输入模态为 text/image/file，并非本次所需的原声音频入口。OpenAI 兼容接口只表示请求格式兼容，不意味着每个模型 ID 都能接收音频。[音频输入说明](https://openrouter.ai/docs/guides/overview/multimodal/audio)。

## 可用付款入口

银联绑卡：该用户本次实测不支持。此结论限定当前绑卡入口，不扩大成所有地区、所有双标卡均不支持。

官方 FAQ 列有支付宝。下一步进入 [Credits](https://openrouter.ai/settings/credits)，尝试单次购买 credits 的支付宝结账，而非继续添加银联卡。没有访问其私人结账页，是否显示支付宝、能否用其资金渠道完成付款仍需实际确认；不承诺微信或银联储蓄卡直付。

[条款](https://openrouter.ai/terms)当前列最低购买 $5 credits。按预算汇率 7 元/美元约为 ¥35，另加结账手续费。官方[支出说明](https://openrouter.ai/blog/insights/governing-team-ai-spend/)给出卡充值手续费 5.5%、最低 $0.80；未确认支付宝沿用相同费用，因此支付宝总付款额以其结账页为准。[支付 FAQ](https://openrouter.ai/docs/faq)。

账户可付款仍不等于每个模型在当前地区均可使用；遵守具体提供商的地区条件，学生身份不代替实际居住信息。

## 按本项目原声分析估算费用

本项目朗读用 iPhone 原生能力，本表不含 TTS。第四部分按申请出题、提交后才调用声音工具，没有强制每日调用。

为方便预算，假设每次 2 分钟录音、800 个文字输入 tokens、2,000 个文字输出 tokens；按 Gemini 官方 32 个音频 tokens/秒计算，共 3,840 个音频输入 tokens。不含额外推理、搜索、重试或输出音频。采用规划汇率 7 元/美元，不是实时汇率报价或本次实扣费用。

| 候选 | 每百万文字输入 / 音频输入 / 文字输出 tokens（美元） | 每次约人民币 | 每月 30 次约人民币 | 每月 300 次约人民币 | 状态 |
|---|---|---:|---:|---:|---|
| NVIDIA Nemotron Omni :free | 0 / 免费目录项 / 0 | 目录标价 0；本次音频因余额被拦截 | 尚未验证 | 尚未验证 | 文字成功，声音未返回 |
| Gemini 2.5 Flash Lite | 0.10 / 0.30 / 0.40 | ¥0.014 | ¥0.43 | ¥4.27 | 低价付费试验候选，未验证本人录音质量 |
| Gemini 3.8 Flash | 0.75 / 0.75 / 3.75 | ¥0.077 | ¥2.31 | ¥23.06 | 当前促销价格；未验证本人录音质量 |

价格依据：[Flash Lite](https://openrouter.ai/google/gemini-2.5-flash-lite)、[3.8 Flash](https://openrouter.ai/google/gemini-3.8-flash)、[音频 token 计算](https://ai.google.dev/gemini-api/docs/audio)。3.8 Flash 页面当前显示 50% 促销，不把此价固定为长期合同价。真实请求应保存 usage 和费用，音频计费不能用普通文本输入价格代替。

这是单纯接口推理预算；充值手续费、汇兑费用、已有 Cloudflare 与 Codex 消耗另计。$5 最低充值是预付资金，不是每月订阅或每月必须消费。

## 在闭环中的位置

OpenRouter 暂作为原声理解试验入口，不能仅据“接收音频”宣布音素、重音或雅思发音判断合格。充值成功后先复用同一录音做一次受控试验，比较转写、是否确实利用声音、建议依据与不确定性；不让参考答案诱导识别。免费模型先试，再按实测需要比较低价付费模型。失败不自动花钱重试，不把推测的时间点当作回听定位。

Azure 学生通道仍可用于专用发音评价。OpenRouter 如果能提供足够可信的整体声音建议，可简化口语闭环；专用声音指标尚未验证。出题、写作与文本层批改继续由已有 Codex 承担，避免为已满足的部分增加供应商调用。
