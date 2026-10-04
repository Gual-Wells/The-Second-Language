# 完整原声、详细提示与结构化采集实测

本轮用已获授权的同一份 76.796 秒真实录音，在独立 Cloudflare Worker/KV 执行完整调用。首轮不提供用户确认稿、其他转写或参考答案；三路返回后才由 Codex 结合单独确认稿核对。原声与全部返回只在私有忽略目录，公开费用与结构摘要见 `outputs/speaking-prompt-schema-test-2026-10-03.json`。

## Prompt 是否实际可用

Gemini 与 Qwen 收到完整声音、详细文字提示和 strict JSON Schema，并要求 OpenRouter 只选择支持所需参数的端点。两路均 HTTP 200、finish_reason=stop，当前结构检查无错误，均返回九个片段和十二项维度。Whisper 提供完整原生对象与 ASR 时间；首轮不使用 initial_prompt，避免把预期答案灌入转写。

可请求完整原话、碎片与重复、声音维度、局部发现、原话引用、自身片段 ID、预期/听到的读音、解释、不确定性和回听建议。未能判断可为空。数据要求进入可执行 `protocol/speaking/contract.mjs`；这比只要求一份泛泛的评分报告更便于接管。Schema 只证明资料能解析，不证明真实声音判断可靠。

## 主三路结果与费用

| 通路 | 实际返回身份 | 本次耗时 | 实际/估计美元 | 人民币预算 |
|---|---|---:|---:|---:|
| Whisper large-v3-turbo | Workers AI 原生结果 | 5.096 秒 | 0.000656606，按音频分钟估计 | ¥0.00460 |
| Gemini 3.8 Flash | Google AI Studio | 11.680 秒 | 0.01122525，响应 usage.cost | ¥0.07858 |
| Qwen 3.8 Omni Flash | Alibaba | 153.239 秒 | 0.00563925，响应 usage.cost | ¥0.03947 |
| 合计 | 默认三路，不含专项/补调 | 并行约 153 秒 | 约 0.017521106 | **约 ¥0.12265** |

人民币仅按 **1 美元=7 元的预算假设**，不是实时汇率。Whisper 未返回本次美元账单，必须与 OpenRouter 实际费用区分。本表不含充值手续费、存储、Codex 套餐或额外代偿。每月三十份同等长度/规模作答约 ¥3.68；不是第四部分每日强制运行，也不是价格封顶。

Qwen completion_tokens=10980，其中 reasoning_tokens=7621；Gemini 为 2516、reasoning_tokens=0。Qwen 比以前泛化提示运行更久，不能按旧测试的短输出费用估算本协议。其音频 token 统计为零不证明没有声音输入，应结合真实请求及返回检查。

## Codex 接管实际发现

完整三路原始返回、解析资料及元数据已用 `scripts/speaking-handoff.mjs` 保真物化到私有工作目录，未用共识摘要替代返回。Codex 核对发现：

- Whisper 仍把两处本人确认的原话识别成其他说法；不能以错误转写批评本人表达。
- Gemini 保留了未完成词和重复候选；Qwen 返回较干净的全文。两者对重复/修正的描述不同，用户确认稿也不是逐音节听审核验，不能直接投票裁决。
- Gemini 本轮正确认可 not only … but also 的平行结构，没有沿用旧泛化采集中不成立的修改意见。
- Qwen 对 problem 的解释把 /l/ 称作词末音，但它实际位于词中。该解释不成立；具体本人是否误音仍不能仅凭拼写或模型自述确定。
- 普通停顿、平静语调与清晰分词不是自动扣分项。声音候选须结合可理解性与具体影响，不为凑问题数量而制造诊断。

因此，本轮证明的是详细要求可被执行、完整数据可交接和后续语义核对必要，不是音素测量、真实雅思评分或总体识别准确率通过。反馈只采用有根据的结论，未确认声音判断留待回听/专项。

## 备用模型验证

Gemini 2.5 Flash Lite 同样收到完整声音及 Schema，HTTP 200、结构无错误，费用 $0.002167（约 ¥0.01517）。它把多处实际内容改成其他句子，继而建议修正那些并未确认说过的表达。其时间自述也不能证实完整覆盖。**排除自动质量代偿**；便宜且结构成功不能补救实质质量不足。

Gemini 2.5 Flash 另部署了独立完整录音验证资源。等候约二十二分钟，定时触发仍没有可回收的启动记录或模型返回，已停止触发并收回资源；未取得结果，不能判断它的质量、费用或启用为备用。它与主 Gemini 同属 Google，且仍消耗同一个 OpenRouter 余额池，不能作为资金代偿，也不能当作第二个厂商的独立听审。

## 腾讯与容量代偿

此前真实腾讯句子模式的 7.9 秒片段已用新工具归一化复核：十三词、六十八音素全部保留，并将合法边界关联到原声起点。专项准备 dry-run 通过，本轮不为重复验证再次收费。音素准确率和默认 false 重音字段尚未听审验证，不能直接用于确定诊断；自由说复测未改善转写，继续排除默认全量调用。

运行按 **OpenRouter 整体余额 / Cloudflare Whisper / 腾讯** 三个独立额度池组织。余额不足停止池内替换；仍有材料就让 Codex 完成有依据的教学，必要时规划腾讯实际原话短句专项。未来独立渠道需真实账号、adapter 和核验后才启用。缺少全部声音能力时保留原件、待补状态和已完成的文字反馈，不报告完整口语 band；日课与阅读继续运行。

本轮没有写正式练习库、课程、临时页或 VIX。两组独立测试 Worker 和 KV 均已删除，删除 API 均返回 200；第二组在删除前停止定时触发也返回 200。云端测试 secret 随独立 Worker 收回，全部已取得返回保留在本机私有忽略目录。正式录音上传与在线领取仍按接入设计另行建设。

依据：[OpenRouter 音频请求](https://openrouter.ai/docs/guides/overview/multimodal/audio)、[结构化输出](https://openrouter.ai/docs/guides/features/structured-outputs)、[端点故障转移](https://openrouter.ai/docs/guides/routing/provider-selection)、[Whisper 参数与定价](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/)、[腾讯评测参数](https://cloud.tencent.com/document/product/1774/107387)。
