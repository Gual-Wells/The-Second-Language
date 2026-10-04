# 原声口语评价：国内接入与国际支付复核

核查日期：2026-10-03。当前可用支付方式为微信、支付宝、苹果礼品卡、银联储蓄卡；万事达仍待办理。此处研究原声评价，设备原生朗读继续独立运行。

后续更新：本报告记录首次接入准备时的状态；同日已完成腾讯真实录音试验，技术调用通过但本人自由说转写未达到教学可用标准。当前质量结论与新增 Azure 学生通道以 `speaking-student-routes-2026-10-03.md` 和 `protocol/SPEAKING_ASSESSMENT.md` 为准，不能继续将下文“缺少密钥”视为现状。

## 当前选择与开户

国内先接腾讯智聆 SOE-N 新版英文自由说，真实评价质量仍须用已经录制的 76.796 秒作答验证。官方能力是单词精准度、流利度，最长 300 秒，可不提供参考文本。它不提供本项目可依赖的完整韵律、音素诊断或词级回听定位，不能给出完整雅思口语 band。

读者从 [腾讯云控制台](https://console.cloud.tencent.com/) 注册并完成实名认证，再按[新版快速入门](https://cloud.tencent.com/document/product/1774/107347)链接开通服务。首次先购买 9.9 元调试套餐，不购买额外并发包；官方预付费额度含 50 个免费并发，个人串行调用足够。通过文档链接进入 API 密钥管理，获取 SecretId、SecretKey，并在账户信息取得 AppID。

AppID、SecretId、SecretKey 只填本机 `.cache/speaking-provider.json`，不发聊天、不提交 Git。正式服务将使用服务端受限权限凭证，不将这些密钥送入 PWA。用户负责实际开户和支付；代码准备完成不等于已经开通。

## 预算

[官方计费](https://cloud.tencent.com/document/product/1774/107342)：首次 9.9 元包为一万计量次，一年有效，仅可购一个。每 20 个词计一次、不足向上取整；这不是一万份完整口语答案。后付费 0.005 元/计量次。文档按上传文本解释自由说计量，但无参考文本模式的实际账单口径仍应在第一次调用后核对。

按识别词数近似估算，之前 147 词作答约 8 计量次，即首次包内折算约 0.00792 元，后付费约 0.04 元。假设每月 30 份、每份 150–300 词，则约 240–450 计量次，后付费约 1.20–2.25 元/月；十次重答量约 12–22.50 元/月。不是每日强制任务，实际数量随申请与重答变化。上述只算口语评价，不算现有托管或 Codex 订阅。套餐过期/用完可能转后付费，应关注控制台实际用量。

## 国际候选支付判定

没有在本轮研究的候选中确认“大陆银联储蓄卡开户支付 + 合格原声评价”的完整直接通路；这不代表全世界不存在。

| 候选 | 支付确认程度 | 项目能力 | 当前处理 |
|---|---|---|---|
| OpenRouter | 官方明确接受支付宝；未确认直接接受银联储蓄卡，也未验证用户支付宝具体资金来源能否完成充值 | 提供音频输入模型，可做原声理解与教学反馈；不能仅据此认定发音诊断合格 | 最值得追加的小额国际试验入口，尚未实测 |
| Azure Speech | 总体支付表含中国银联；用户当前免费注册页只列 Visa/Mastercard，未确认纯银联储蓄卡另一注册路径 | 有专用自由表达发音评价，能力适合后续比较 | 支付观望，保留适配位置 |
| AWS 国际区 | 官方明确中国人民币借记卡不支持；银联信用卡开户与已开户的银行跳转付账不能替代储蓄卡开户 | 转写、音频理解仍需另行验证专门发音证据 | 当前支付条件淘汰 |
| Google Cloud / 直接 Gemini | 未查到可确认的纯银联储蓄卡开户证据；其他 Google 产品的付款方式不能外推 Cloud | 音频理解与转写不能自动视作专用发音诊断；直接 API 地区条件需单独核查 | 观望；不作为现阶段账户选择 |
| SpeechSuper / Speechace | 未找到官方明确支持银联储蓄卡的说明；不把信息缺失说成明确拒绝 | 专用口语评价有价值 | 支付观望，未实测 |
| Speechmatics 等 ASR | 未确认银联储蓄卡付款；试用额度不证明长期付费成立 | 主要是转写，现有 Cloudflare 识别已经满足这一层 | 本轮不新增转写账户 |

[OpenRouter 支付 FAQ](https://openrouter.ai/docs/faq)明确接受 AliPay，[音频输入文档](https://openrouter.ai/docs/guides/overview/multimodal/audio)允许向兼容模型发送音频。可以不必等万事达再尝试国际模型，但实际付款、地区与音频评价效果仍是待验证项；不能称为已确认的银联直付渠道。

[AWS 人民币支付说明](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-payment-cny.html)明确 Chinese yuan debit cards 不支持。[Azure 支付表](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/supported-payment-methods)、[Google Cloud 支付方式](https://docs.cloud.google.com/billing/docs/how-to/payment-methods)、[SpeechSuper 定价](https://speechsuper.com/pricing.html)、[Speechace 套餐](https://www.speechace.com/api-plans/)、[Speechmatics 定价](https://www.speechmatics.com/pricing)只用于各自产品，不能跨服务推断支付支持。

## 已准备与尚未完成

已准备本机签名、PCM 转换、按时长上传、终态确认、结果保存与能力标识。合同检查验证了传输中断、提前终态和缺失分数处理；假传输测试不代表真实模型评价合格。

已将现有 iPhone M4A 在本机转为 16kHz / 16bit / 单声道 PCM，时长 76.796 秒；原声 SHA-256 保持不变。便携 ffmpeg 放在忽略目录，下载归档与解压后二进制均按 GitHub 发布摘要校验，无系统安装。dry-run 未上传音频、未调用收费服务、未写正式数据。

尚未取得腾讯密钥，因此没有真实声学结果。正式 PWA 原声存储、作答索引关联和评价结果展示仍待真实服务试验后接入。供应商替换采用独立适配器；保留既有原声与结果，不跨量纲覆盖分数。朗读试用页的手机发布仍待 Cloudflare 所需部署权限续期，桌面通过的原生朗读检查不能替代 iPhone 实测。

执行与证据边界见 `protocol/SPEAKING_ASSESSMENT.md`。
