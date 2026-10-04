# OpenRouter 原声补测与 Qwen 接管结果

日期：2026-10-03。按用户要求，先完成 Qwen 数据接管，再获取全部原声输入模型目录，然后以同一段 76.796 秒本人录音补测其他模型。测试在本机忽略目录运行，不创建正式 attempt，不改 VIX、不发布章节、不更新 PWA。原声、完整转写、授权 key 和原始响应只留本机；公开摘要见 `outputs/openrouter-expanded-audio-test-2026-10-03.json`。

## Qwen 接管已经完成

接管结果见 [学习反馈](qwen-speaking-takeover-2026-10-03.md)。联合使用用户确认文本、Qwen 盲转写、Cloudflare Whisper 的 147 个词级时间及 ffmpeg 静音测量；每种来源保留来源与能力边界。拒绝错误的 developed 词尾意见，拒绝无证据的背稿归因，不把模型语音意见直接转成雅思评分。

有效反馈是：回答结构清楚、not only / but also 等句式成立；下一次补一个真实的小事件，并按意群练 a difficult problem、stay calm when facing problems、find a practical solution。约 14–18、55–58、66–71 秒是待回听窗口，不是已经确认的错误。实际 handoff JSON 留在 `.cache/speaking/qwen-data-handoff-2026-10-03.json`。

## 补测方式

六个候选共七次请求。使用与前次 Qwen/MiMo Pro 相同的原声与盲分析提示，不提供确认稿，不提示录音内容；限制输出 4096 tokens，temperature=0，禁用供应商自动回退。GPT Audio 明确指定文字输出；Gemini 3.8 Flash 与 Inkling Small 使用 low reasoning。MiMo Flash 522 后仅做一次明确变更供应商的重试。录音测试授权沿用当前用户请求，没有调用额外账户。

## 实际结果

| 模型 | 返回 | 结果 | 新增人民币费用 |
|---|---|---|---:|
| Gemini 2.5 Flash Lite | HTTP 403 | 地区门禁，未产生原声分析 | 未返回 usage |
| Gemini 3.8 Flash | HTTP 403 | 地区门禁，未产生原声分析 | 未返回 usage |
| GPT Audio | HTTP 403 | 地区门禁，未产生原声分析 | 未返回 usage |
| Inkling Small（付费） | HTTP 200 | 44 字节空白；非 JSON、无正文/usage | 未返回 usage |
| MiMo 2.6 Flash / Darkbloom | HTTP 522 | 上游返回错误 | 未返回 usage |
| MiMo 2.6 Flash / Xiaomi | HTTP 200，49.598 秒 | 声明 `audio_accessible=false`；空转写，无可用声音观察 | ¥0.003880 |
| Perceptron MK1.5 | HTTP 200，12.178 秒 | 返回转写，21 次词级编辑，部分建议受误转写影响 | ¥0.006033 |

按预算汇率 7 元/美元换算，非即时外汇报价。成功请求 usage 合计 $0.00141616，约 ¥0.009913。账户累计 usage $0.00438333，与本轮加前轮成功请求费用一致；$5 总充值余额尚余约 $4.995617。充值手续费不计入模型费用。

### 界面状态与 API 门禁

用户报告已修改账单地址、界面不再显示限制。三项实际请求仍返回 `This model is not available in your region.`，metadata 中失败阶段为 `Gate Endpoints with Geo Restrictions`。这是当前 key、本机调用的真实 API 结果；尚未确认具体判断来自哪项账户或位置条件，不推断用户修改无效，也不将其当成模型质量问题。

### Perceptron

收到 1396 输入 tokens（其中 960 audio tokens）、435 输出 tokens，无 reasoning tokens，费用 $0.00086190。确认稿规范化后 149 词，模型转写 156 词，词级编辑 21 次，比例约 14.1%；该比例用于比较文本忠实度，不是学习者发音错误率。它的 95%/98% 自报值不是经过验证的置信度；不采纳由转写替换推导的个人发音诊断。

### MiMo Flash

切到 Xiaomi 后传输成功，输入 657 tokens、输出 1651 tokens（含 1503 reasoning tokens），费用 $0.00055426。但它明确无法访问音频，返回空转写；其 `text_only_advice` 还评论未显式提供的答题内容，不能用于教学。此结果只能判定当前请求通路未完成原声处理，不能由此宣布整个模型的语音质量不合格。保留第一次 Darkbloom 522 与第二次 Xiaomi 200 的独立记录。

### Inkling Small

与前次 Inkling 类似，HTTP 200 仍无可解析内容。Small 且 low reasoning 没有解决问题；没有得到声音质量结论。保留原始空白响应，不把它归因于录音错误或额度不足。

## 当前选择

同一段录音的可比较结果：Qwen 与确认稿有 4 次词级编辑、MiMo Pro 9 次、Perceptron 21 次。Qwen 的四次都是额外重复或不完整片段，可能保留了确认稿省略的实际卡顿，不能简单算为识别错词。比较只覆盖这一位学习者的一次作答。

目前继续采用 **Qwen 提供盲转写和待核对声音观察，Codex 接管教学反馈，Whisper 提供近似回听定位**，已有实际接管反馈。细微发音与完整雅思分数仍未验证。其他候选没有因为价格而放弃：本轮能返回内容的两项合计约一分钱；主要阻碍是地区门禁、空响应、音频不可访问或转写忠实度。

## 全部模型和价格

目录已获取当前 [OpenRouter models API](https://openrouter.ai/api/v1/models)，筛选音频输入、文字输出，共 44 条：25 个常规付费模型、11 个 batch 变体、3 个免费端点、2 个动态别名和 3 个自动路由。全部 ID、人民币输入/输出/音频价格及测试状态见 [完整目录](openrouter-audio-models-2026-10-03.md)和 `outputs/openrouter-audio-models-2026-10-03.csv`。纯 TTS、纯文字模型不在此次原声候选范围。

GPT Audio 的原声输入和文字输出能力见 [OpenAI 官方模型文档](https://developers.openai.com/api/docs/models/gpt-audio)及 [音频 Chat Completions 指南](https://developers.openai.com/api/docs/guides/audio-chat-completions)；本轮入口仍为 OpenRouter，未创建或使用直接 OpenAI API 账户。
