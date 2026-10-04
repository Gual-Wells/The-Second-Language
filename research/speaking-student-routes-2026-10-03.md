# 原声实测与学生国际通道补充

日期：2026-10-03。学生背景由读者提供：东北大学软件工程中美专硕、University of Texas at Arlington 计算机科学硕士在读。没有访问私人学校账户，也没有代办身份验证。所有候选保持当前实际居住地区，不由美国学籍推断美国居住。

## 腾讯真实测试结论

使用既有 76.796 秒 iPhone M4A，转换为官方指定的 16kHz、16bit、单声道 PCM，以 40ms/1280 字节按真实时长上传，完整收到终态。官方 CAM GetUserAppId 已读回正确 AppID，和用户纠正的值一致。密钥只存本机忽略目录，没有提交仓库。

返回准确度 45.4673、流利度 0.929062；两者是不同的供应商量纲，不换算雅思 band。转写与用户确认文本有大面积语义偏差，因此这次分数不用于判定学习者发音错误。统一小写、去标点、将连字符拆词后，参考为 149 词，腾讯词级编辑 74 次（49.7%），先前 Whisper 5 次（3.4%）。这是识别编辑率，不是发音错误率；用户确认稿也不能代替原声听审。

增加一份原先已使用的 whisper.cpp JFK 已知人声样本作对照：同一适配器与 PCM 传输，11 秒、22 词，腾讯编辑 1 次（4.5%），准确度 72.2019、流利度 0.951979。对照能降低严重音频格式错误的可能性，不能证明真实作答错误原因，更不能校准分数。真实作答只有一份，本次判断限于当前服务模式与样本，不外推腾讯所有模型。

结论：技术接入成立；腾讯直接自由说目前不满足本项目真实作答的可靠反馈需求，不进入正式批改。返回声学数值与准许用于教学分别标记。暂保留现有较可靠的 Whisper 转写及文本反馈，继续比较更适配的声音评价服务。未改 VIX、日课、正式作答库或 PWA。

另查到腾讯段落模式 eval_mode=2 必须提供实际文本，且最多 120 词；本录音超过上限。它可能作为“可信逐字转写 + 对齐切段 + 原声评价”的后续试验，但不能直接塞入全文、拿润色稿当原话或整段音频配部分文本。此方向尚未实现或验证。[段落模式官方说明](https://cloud.tencent.com.cn/document/product/1774/107388)

本机摘要：`outputs/tencent-speaking-real-test-2026-10-03.json`。全部原始返回与录音仍在本机忽略目录。

## 优先级与学生通道

| 顺序 | 通道 | 可用资格与付款 | 与项目的关系 | 待验证 |
|---|---|---|---|---|
| 1 | Azure for Students → Azure Speech | 官方无需信用卡；100 美元额度、12 个月有效；在读期间可按年续验；18 岁以上全日制、认可的授予学位机构、学校邮箱验证 | 专用非朗读式发音评价最贴近需要；可返回准确度、流利度，en-US 韵律；需实测 | 学籍验证、当前订阅可建 Speech 资源、实际地区、本人录音效果 |
| 2 | OpenRouter → 兼容音频输入模型 | 官方接受支付宝；未确认微信或银联储蓄卡直付；最低充值 5 美元，手续费以付款页为准；未发现有保障的统一学生优惠 | 可补充原声理解和教学分析；不能仅据音频输入就认定发音诊断合格 | 对应模型的地区许可、实际付款与效果 |
| 3 | ElevenLabs for Students | 官方新计划含 Creator 三个月及 ElevenAPI；18 岁以上，公布地区为美国、加拿大、EU27、澳大利亚、英国。美国学校学籍不能独自证明所在地区符合；免费领取是否需要付款工具尚未确认 | 适合生成声音或转写试验，没有确认专用雅思发音评价能力 | 实际地区资格、验证、API 内容和付款条件；不是当前声学评测替代 |
| 4 | GitHub Student Developer Pack | 13 岁以上、学位/文凭课程，可用校邮及在读材料申请；全球学生可申请。Azure 的 offer 是同一权益入口，不是再赠一份额度 | 为工程工具与 Azure 学生验证提供另一入口 | GitHub 审核；没有从当前目录发现可直接替代原声诊断的专用口语 API 优惠 |
| 5 | Google Cloud 教学额度 | 教师先申请，再按课程向学生分发券；可无信用卡兑教学券，但研究券与普通试用是不同路径 | 如课程实际含云计算开发可询问教师；不能因学籍就宣称自动领云额度 | 有效课程、教师发券与允许用途。教学额度禁止个人或商业使用，不把私人雅思 PWA 自动视作合规教学课程用途 |
| 6 | Deepgram 开发者试用 | 官方 200 美元新账户试用、不需信用卡；不是学生专属；免费额度一年到期，付费方式另查 | 主要转写与语音应用；现有 Whisper 已足够，本轮没有必要再开一个转写账号 | 专用评价能力未确认、长期国内付款未确认 |

AWS Educate 的无需信用卡入口当前主要是学习与实验室；没有证据表明能当作长期私人 PWA 的常驻音频后端。不将旧版学生 Starter 宣传当作现行资源承诺。[AWS 官方入口](https://aws.amazon.com/education/awseducate/)

## UTA / 东北大学怎么使用

UTA [OIT 官方页面](https://oit.uta.edu/services/azure-for-students/)明确向学生提供 Azure for Students，并给出免费开户和 [MyApps](https://myapps.uta.edu/) 入口。优先由此开始，使用真实可收信的 UTA 学校邮箱完成学籍验证；没有校邮时先恢复学校账户，不填写虚构身份或居住地址。项目属于个人学习与非商业开发，方向符合 Azure 公布的教育/开发用途，最终以账户与服务的资格审核为准。

选 **Azure for Students**，不选之前要求 Visa/Mastercard 的普通 Free Account，也不混淆功能不同的 Students Starter。开通后在门户创建 Speech 资源，确认关联学生订阅、可用地区与 F0/S0 层；学生页的“50 万 neural characters”是 TTS 字符额度，不是发音评价免费额度。声学评价额度/费用按具体 Speech 功能与资源计费，不承诺整套功能无限免费。

若 UTA 身份验证遇到问题，另一条真实 NEU 学籍可作为验证材料或尝试相应学校邮箱；本轮只确认 [东北大学正版软件平台](https://software.neu.edu.cn/)上的软件资源，没有找到 NEU 专属 Azure Speech 权益。也不能从微软 Office 授权推断云 API 权限。Azure 每人只能有一份学生优惠，双学籍不叠加。

Azure 无参考文本评价支持 en-US 韵律；超过 30 秒使用 continuous mode。它也不是官方雅思考官，供应商分数不能直接变成完整 band。参见[发音评价文档](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment)及[计费页](https://azure.microsoft.com/en-us/pricing/details/speech/)。100 美元额度作预算折算时可按 7 元/美元估为约 700 元；这是规划汇率，不是实时外汇报价或现金补贴。

## 继续查到的微信、支付宝渠道

OpenRouter 的支付宝声明与音频输入文档均来自其官方站，证据最完整。但[现行条款](https://openrouter.ai/terms)要求遵守模型自身的地区条件；可充值不代表每个模型对当前地区开放。学生身份不取消此限制，须按具体模型/服务提供商核实。最低 5 美元约为 35 元规划预算，另加付款页费用。

AIPower 的[自身文档](https://www.aipower.me/docs)明确声称可信用卡、微信、支付宝充值；Code2AI [自身付款政策](https://www.code2ai.codes/billing/)列微信与支付宝 where available。它们属于聚合/转售接口线索。本轮没有从各自文档确认可靠原声输入及专用评价，运营和模型可用性也未实测，因此仅保留观望，不建议为口语功能充值。商户使用 Stripe/Paddle 不代表其开启了所有付款方式；“OpenAI-compatible”也不保证接受音频。

Together 官方[付款方式](https://support.together.ai/articles/7048797576-what-payment-methods-are-accepted)只列主要卡网络与美国 ACH，且要求始终保存有效卡；没有把支付宝、微信、银联储蓄卡列为可用。Fireworks、Hume 未取得当前付款方式与本项目所需能力的完整证据，继续观望；Hume 情绪分类或真人声音评审不是已确认的英语发音诊断。没有找到新的、可确认直接银联储蓄卡支付且能力合格的国际评测接口。

## 官方依据

- [微软学生计划](https://azure.microsoft.com/en-us/free/students/)、[资格和续期](https://learn.microsoft.com/en-us/azure/education-hub/find-ids)、[完整权益条款](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0170p/)
- [GitHub 学生申请](https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student)、[当前权益目录](https://education.github.com/pack)
- [OpenRouter 支付](https://openrouter.ai/docs/faq)、[音频输入](https://openrouter.ai/docs/guides/overview/multimodal/audio)
- [ElevenLabs 学生入口](https://elevenlabs.io/students)、[2026-09-25 公告与地区](https://elevenlabs.io/blog/introducing-elevenlabs-for-students)
- [Google Cloud 教学券](https://docs.cloud.google.com/billing/docs/how-to/edu-grants)、[用途条件](https://support.google.com/google-cloud-higher-ed/answer/10324788)、[不需信用卡的教学券说明](https://services.google.com/fh/files/helpcenter/cloud_edu_free_trial_warning.pdf)
- [Deepgram 试用](https://deepgram.com/pricing)、[额度有效期](https://developers.deepgram.com/guides/deep-dives/managing-projects)
