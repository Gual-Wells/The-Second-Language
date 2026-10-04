# OpenRouter 原声输入完整模型目录

日期：2026-10-03，实际获取时间 2026-10-03T08:26:44.669Z。范围为当前 /models 目录中 input_modalities 包含 audio、output_modalities 包含 text 的全部记录，共 44 条，含 11 个 batch 变体、3 个免费端点、2 个动态别名、3 个自动路由。TTS-only 与仅文字批改模型不属于本表。

用户已报告账户界面的地区限制解除；这是用户账户状态信息，不将全部目录项目同时标记为调用成功。实际可用、供应商声音质量和目录模态分别判断。

预算汇率为 7 元/美元，非即时外汇报价。文字输入/输出均为每百万 tokens 的人民币价格；audio 字段按实际模型单位解释，Voxtral 为每秒计费并换算成每分钟，其余目录单列 audio 按音频 tokens。未单列不表示声音免费。输出价格包含按输出口径收费的推理，实际账单以 usage 为准；缓存、超过上下文阈值的阶梯费、工具、输出音频、充值手续费不在此基础表中。Google 的当前优惠价可变化，动态别名的指向也可变化。

批处理变体价格不能当作同步请求的现成优惠。自动路由不是另一个独立模型；免费端点保留在全目录中，但 NVIDIA / Thinking Machines 明确要求不上传个人声音，本人录音不采用。gpt-audio-mini 目录的音频字段需特别实扣复核，不拿普通文字价承诺音频成本。

数据源：[OpenRouter 模型 API](https://openrouter.ai/api/v1/models)。GPT Audio 能力另参见 [OpenAI 官方文档](https://developers.openai.com/api/docs/models/gpt-audio)；本项目调用入口及账单仍为 OpenRouter。

| 模型 ID | 文字输入 ¥/百万 | 文字输出 ¥/百万 | 目录音频计费 | 实测状态 |
|---|---:|---:|---|---|
| `~google/gemini-flash-latest` | 5.25 | 26.25 | ¥5.25/百万音频tokens | 可变别名，未测试 |
| `~google/gemini-pro-latest` | 14 | 84 | ¥14/百万音频tokens | 可变别名，未测试 |
| `google/gemini-2.5-flash` | 2.1 | 17.5 | ¥7/百万音频tokens | Cloudflare返回；质量未通过自动代偿门槛 |
| `google/gemini-2.5-flash-lite` | 0.7 | 2.8 | ¥2.1/百万音频tokens | API 实测地区门禁 403 |
| `google/gemini-2.5-flash-lite:batch` | 0.35 | 1.4 | ¥1.05/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-2.5-flash:batch` | 1.05 | 8.75 | ¥3.5/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-2.5-pro` | 8.75 | 70 | ¥8.75/百万音频tokens | Cloudflare返回；改词和错误纠错，未加入 |
| `google/gemini-2.5-pro-preview` | 8.75 | 70 | ¥8.75/百万音频tokens | 未测试 |
| `google/gemini-2.5-pro:batch` | 4.375 | 35 | ¥4.375/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3-flash-preview` | 3.5 | 21 | ¥7/百万音频tokens | 未测试 |
| `google/gemini-3-flash-preview:batch` | 1.75 | 10.5 | ¥3.5/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.1-flash-lite` | 1.75 | 10.5 | ¥3.5/百万音频tokens | 未测试 |
| `google/gemini-3.1-flash-lite-preview` | 1.75 | 10.5 | ¥3.5/百万音频tokens | 未测试 |
| `google/gemini-3.1-flash-lite:batch` | 0.875 | 5.25 | ¥1.75/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.1-pro-preview` | 14 | 84 | ¥14/百万音频tokens | Cloudflare低/高推理均返回；错误纠错/时间越界，未批准固定增加 |
| `google/gemini-3.1-pro-preview-customtools` | 14 | 84 | ¥14/百万音频tokens | 未测试 |
| `google/gemini-3.1-pro-preview:batch` | 7 | 42 | ¥7/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.5-flash` | 10.5 | 63 | ¥21/百万音频tokens | 未测试 |
| `google/gemini-3.5-flash-lite` | 2.1 | 17.5 | ¥2.1/百万音频tokens | Cloudflare返回；错误前提/改词，未加入 |
| `google/gemini-3.5-flash-lite:batch` | 1.05 | 8.75 | ¥1.05/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.5-flash:batch` | 5.25 | 31.5 | ¥10.5/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.6-flash` | 5.25 | 26.25 | ¥5.25/百万音频tokens | 未测试 |
| `google/gemini-3.6-flash:batch` | 2.625 | 13.125 | ¥2.625/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.7-flash` | 5.25 | 26.25 | ¥5.25/百万音频tokens | 未测试 |
| `google/gemini-3.7-flash:batch` | 2.625 | 13.125 | ¥2.625/百万音频tokens | 批处理变体，未测试 |
| `google/gemini-3.8-flash` | 5.25 | 26.25 | ¥5.25/百万音频tokens | Cloudflare完整音频/Schema成功；保留固定主路，观察须核查 |
| `google/gemini-3.8-flash:batch` | 2.625 | 13.125 | ¥2.625/百万音频tokens | 批处理变体，未测试 |
| `mistralai/voxtral-small-24b-2507` | 0.7 | 2.1 | ¥0.042/分钟 | 本轮及此前上游限流；质量未验证 |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 0 | 0 | 目录未单列；实际usage核对 | 本人声音不采用此免费端点 |
| `openai/gpt-audio` | 17.5 | 70 | ¥224/百万音频tokens | Cloudflare最终JSON正式格式成功；加入固定第四路，非原生Schema |
| `openai/gpt-audio-mini` | 4.2 | 16.8 | ¥4.2/百万音频tokens | Cloudflare返回；便宜但未证实新声音价值 |
| `openrouter/auto` | 随路由 | 随路由 | 目录未单列；实际usage核对 | 自动路由，未测试 |
| `openrouter/auto-beta` | 随路由 | 随路由 | 目录未单列；实际usage核对 | 自动路由，未测试 |
| `perceptron/perceptron-mk1.5` | 1.05 | 10.5 | 目录未单列；实际usage核对 | Cloudflare返回；明显误词，无新价值 |
| `qwen/qwen3.8-omni-flash` | 1.05 | 3.29 | 目录未单列；实际usage核对 | Cloudflare全量与专项成功；固定主路/重复补听，保留分歧 |
| `thinkingmachines/inkling` | 6.65 | 28.35 | 目录未单列；实际usage核对 | 两次空响应，原因未明 |
| `thinkingmachines/inkling-small` | 3.15 | 8.4 | 目录未单列；实际usage核对 | 实测空响应，无声音结果 |
| `thinkingmachines/inkling-small:free` | 0 | 0 | 目录未单列；实际usage核对 | 本人声音不采用此免费端点 |
| `thinkingmachines/inkling:free` | 0 | 0 | 目录未单列；实际usage核对 | 本人声音不采用此免费端点 |
| `typesafe/jev-router` | 随路由 | 随路由 | 目录未单列；实际usage核对 | 自动路由，未测试 |
| `xiaomi/mimo-v2.5` | 0.98 | 1.96 | 目录未单列；实际usage核对 | Cloudflare全量截断/片段自述仅文字；未建立声音价值 |
| `xiaomi/mimo-v2.6-flash` | 0.98 | 1.96 | 目录未单列；实际usage核对 | Cloudflare返回，自述只分析文字；不作声音来源 |
| `xiaomi/mimo-v2.6-pro` | 3.045 | 6.09 | 目录未单列；实际usage核对 | Cloudflare第三方及Xiaomi唯一端点实测；原厂声明不能访问音频 |
| `xiaomi/mimo-v2.6-pro-ultraspeed` | 30.45 | 60.9 | 目录未单列；实际usage核对 | 未测试 |

实测状态更新至北京时间 2026-10-04；目录及基础价格保留上述获取时间。新增模型、原声观察、实际费用及取舍见 [本轮报告](openrouter-speech-evidence-2026-10-04.md)。本轮 OpenRouter 推理全部在 Cloudflare 执行，历史地区失败不代表当前后端失败。
