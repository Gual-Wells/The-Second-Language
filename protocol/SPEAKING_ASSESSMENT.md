# 原声口语评价：历史试验记录

**当前执行协议为 `SPEAKING_PIPELINE.md`：默认 Whisper、Gemini、Qwen 三路完整采集，Codex 全量接管，支持能力代偿与按需腾讯句子专项。** 以下保留此前按时间推进的试验资料，其中“下一优先”“国内先使用”等属于当时状态，不作为当前路由指令。正式声音入口仍须按 `research/speaking-facilities-engineering.md` 接通后上线。

## 当前运行

复制 `research/speaking-provider.example.json` 到本机 `.cache/speaking-provider.json`，填 AppID、SecretId、SecretKey。原声与结果保存在本机忽略目录，不传公开 Git。WAV 输入要求 16kHz、16bit、单声道 PCM；其他格式用本机 ffmpeg 转换，保存原件。`--dry-run` 只检查准备，不调用服务、不证明质量。

第一次用现有真实作答进行声音评价；先保留该题目、原声摘要、原始转写与用户确认文本。自由说不输入范文或用户润色稿，不要求符合任何参考答案。录音超过 60 秒仍使用流式传输已完成文件，按真实时长发送；不错误采用新版仅支持 60 秒、一次发送的录音模式。收到上传后的完整终态再接收结果；中断不当成成功。

推荐成人 `scoreCoeff=4.0`，记录实际参数；反馈保持不苛责、围绕最有价值的改进。参数与供应商的分数量纲不能直接映射雅思 band，也不依靠降低苛刻度制造进步。

## Codex 如何使用

读取保存的结构化结果、原始返回和当前作答资料。第一版只将单词准确度与流利度作为声音证据。音素、重音、语调、逐词时间和完整口语 band 均不声明已经可用；负数、缺失值是不可用，不能当成零分。服务端没有公开模型版本时记未知，不能编造版本号。

腾讯文字与 Cloudflare 原始转写、用户校对版本分开。冲突优先核对原声，不因为两家模型一致就把文本认定为正确。服务完成但没有可用声学数值时，反馈继续限定文本层，明确缺少声音判断。只指出少量真正有依据的问题，再给重答建议；不把 ASR 改词当成已经证实的发音错误。

`acousticEvidence` 只表示提供商返回了声音数值，不代表数值已验证。新结果默认 `transcriptReviewed=false`、`teachingReady=false`；Codex 必须结合实际内容核对识别可靠性后才决定使用范围。2026-10-03 的腾讯结果因大面积误识别不进入声音教学反馈。词级编辑距离只辅助定位问题，不作为自动评分或机械淘汰阈值。

腾讯和 Qwen 本次返回不包含词级时间。2026-10-03 回读既有 Cloudflare Whisper 结果发现 `segments[].words[]` 已含 147 个词的起止时间，数值在录音范围内，尚未由人逐词核验。可作为近似回听位置，误识别词和边界需核对；PWA 尚未接入该定位数据，当前仍提供完整回听。不能用文章句序、模型凭空报时或估计时间伪造对齐位置。

## 提供商切换与正式闭环

统一结果保留 `schemaVersion`、provider、engine、原声/评测音频摘要、参数、能力、转写、词级证据、质量状态和原始返回定位。Azure 或其他服务应建立各自适配器；不能把腾讯参数发给另一接口。未来切换只影响新作答，既有结果保持原服务和参数，新评测创建新版本。

正式通路继续复用独立 `PRACTICE_DB`、私有原声对象和批改队列：attempt 关联题目版本和原声；声音结果与转写各自存索引，Codex 批改读取后回写教学反馈。密钥只在服务端或本机；出题、写作批改、日课和原生朗读无须调用该评测工具。测试不写正式 attempt、不标 VIX、不发布日课。

国际服务支付观察：明确支持大陆银联储蓄卡的可用原声评价接口尚未确认。OpenRouter 用户银联绑卡失败，但单次购买页实际显示微信、支付宝，同日已确认 $5 credits 到账；未确认最终采用哪一种付款方式。key 上的 $100 是支出限制，不是赠送余额。首次零余额免费音频请求被 HTTP 402 拦截；充值后采用 `qwen/qwen3.8-omni-flash` 完成真实录音与非语言声音对照，两次 HTTP 200，实际合计 $0.00084635。用户随后报告已更新账单地址、界面限制消失；本机以同一 key 实测 Gemini 2.5 Flash Lite、Gemini 3.8 Flash、GPT Audio 均返回 HTTP 403，错误为 `This model is not available in your region.`，路由失败阶段为 `Gate Endpoints with Geo Restrictions`。界面状态与 API 返回分别记录；具体地区判定依据尚未确定，不把目录列出或界面无警告当作请求已成功。

当前 Qwen 转写与用户确认稿比较有 4 次词级编辑，均为额外重复或不完整片段；非语言声音数量也正确识别，原声通路具有具体证据。供应商原始声音意见仍不可直接用于教学：developed 词尾的 /d/ 判断错误，读稿/背稿归因没有充分证据。Codex 区分转写、待核对声音观察和有效教学建议；不给出未验证的音素、韵律评分或完整雅思 band。详见 `research/openrouter-real-audio-test-2026-10-03.md`。

进一步比较中，MiMo 完成但转写改动更多，部分语法批评由误转写引入；付费 Inkling 返回空白、Voxtral 上游限流，均未得到质量结论。原声工具可以提供数据再由 Codex 批改，但数据须区分 ASR 时间、可复算的声音测量、模型观察和模型诊断。当前已有 Whisper 词级时间及本机静音测量；其边界精度与教学意义分开核对。供应商未返回可靠音素/重音数据时，Codex 不凭转写补造声音事实，也不将多个模型一致视为独立听审通过。

Qwen 数据接管已实际完成：忽略目录中的 handoff 保存用户确认稿、盲转写、Whisper 147 个词的近似时间、本机静音测量和逐条采纳/剔除/待核对状态；公开教学反馈见 `research/qwen-speaking-takeover-2026-10-03.md`。用户确认稿用于内容和语法分析，Qwen 的重复片段用于提出回听候选，词级时间仅用于定位，不将确认稿与原声的差异自动算作发音错误。当前结果能支持内容组织、有效句式及重答练习，不能据此声称音素评价或完整雅思评分已验证。

新增比较见 `research/openrouter-expanded-audio-test-2026-10-03.md`。Perceptron 返回原声转写但与确认稿有 21 次词级编辑；Inkling Small 返回空白；MiMo Flash 首次上游 522，切换至 Xiaomi 后 HTTP 200 却声明 `audio_accessible=false`，不采纳其文字建议。模型收到请求、HTTP 成功、实际取得音频、返回忠实转写、教学建议可靠是不同状态。当前同一录音下 Qwen 最适合继续接管；正式原声批改仍未启用。完整目录及价格见 `research/openrouter-audio-models-2026-10-03.md`，不自动切换模型，也不以目录标价替代实际账单。

本人声音不上传明确要求禁止个人声音的免费端点。2026-10-03 新核查的 NVIDIA 与 Inkling 免费入口均有此要求，因此之前“先试免费音频”的路线更正为选择适用的具体服务，再核对费用和质量。PWA 正式批改尚未接入 Qwen，本次成功不等于已部署。

2026-10-03 后续 Cloudflare 独立云端测试更新了地区结论：同一 OpenRouter key，经默认 Cron 调度的测试 Worker，请求在 OpenRouter 被识别为 US/EWR，Gemini 3.8 Flash 与 GPT Audio 均通过地区路由。Gemini 返回原声转写与候选声音意见；GPT Audio 首次结构化分析回答无法访问音频，简化为仅转写提示并降低输出预算后成功识别原声。模型自述的音频不可访问不自动等同于传输缺失；实际转写、音频 usage、内容核对和非语言对照分别保留证据。用户确认稿未发送给两款模型。Gemini 从 study 的误识别产生 start plan 语法建议，剔除；GPT 成功转写把 complicated 换成 complex，且没有保留重复片段。两者尚未成为已验证的音素评价工具。

本次为 Cloudflare Cron 云端通路，未验证来自 iPhone 的生产 HTTP 调用始终使用同一出口，也不保证后续所有模型或供应商可用。测试 Worker、独立 KV 和云端录音副本已删除，正式服务、课程、答题库和 VIX 均未修改。详见 `research/cloudflare-openrouter-region-test-2026-10-03.md`；模型可用状态须记录执行环境，不将本机 403 扩大成账户永久封禁。

OpenRouter 试验记录与人民币预算见 `research/openrouter-account-and-audio-trial-2026-10-03.md`。未来适配器区分账户余额、key 支出限制和模型费用；先选明确支持音频的具体模型，不把兼容 API 格式视为支持原声。保存实际 usage、声音证据与质量判断，余额不足不自动改调付费模型或反复重试。本次试验没有写入任何正式产品数据。

学生通道与支付复核见 `research/speaking-student-routes-2026-10-03.md`。Azure for Students 无需信用卡，可先验证开通和 Speech 资源；OpenRouter 的支付支持不消除具体模型的地区条件。双学籍只用于证明同一人的真实在读状态，不当作重复领同一优惠的资格。

依据：[腾讯新版接口](https://cloud.tencent.com/document/product/1774/107497)、[自由说](https://cloud.tencent.com/document/product/1774/107389)、[计费](https://cloud.tencent.com/document/product/1774/107342)、[OpenRouter 支付](https://openrouter.ai/docs/faq)、[音频输入](https://openrouter.ai/docs/guides/overview/multimodal/audio)。
