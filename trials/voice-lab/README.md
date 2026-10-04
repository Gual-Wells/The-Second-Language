# Kokoro 美式音色试验

按用户最新指令，只比较 Kokoro 的全部 **20 种美式英语音色**：11 女声、9 男声。此前列出的 Heart、Bella、Michael、Puck、Fable 是候选子集；Fable 属于英式，此轮不生成。保留上两次独立试验及其反馈。

## 试听内容

- 词汇：analysis、schedule、record，三个文件分别生成，不用句子包装掩盖短词能力。
- 句子：名词/动词 record 上下文，以及 Thursday、fifteen/fifty、否定关系。
- 三个场景：日常预约、学术讨论、雅思问答。每场四轮，女男交替。两名说话人均从各自完整性别音色列表中独立选择。

每个音色生成 3 个词、2 个句子、6 个适用角色的对话轮次，共 **220 个片段**。固定文本与原始默认语速。客户端 Web Audio 顺序衔接已有片段；99 种男女组合各可用于三场，不为切换组合重新调用模型。这里比较同材料的角色听感，不宣称 Kokoro 能接收任意表演提示或跨轮理解剧情。

## 声音处理

原始 MP3 留在本地私有缓存及独立试验 KV。播放版使用两遍响度归一，目标 -20 LUFS、-2 dBTP、LRA 11；未达到响度门限的极短片段保留语速与波形内容，退回峰值 -8 dBFS 的增益调整。处理只调整播放电平和编码，不改字音、节奏，不剪除内容。实际处理记录留在 `.cache/voice-lab/mastering.json`。

## 页面与反馈

三页签：词汇、句子、双人对话。词汇与句子的音色评分独立；对话以场景 ID、女声音色 ID、男声音色 ID 标识评分，切换组合不会覆盖前组。1–5 分、用途合格与备注保存在本机，统一提交至独立 D1；提交有幂等 ID，另有 JSON 导出备份。离开页面、切换音色或页签停止声音。

费用仍用之前的两种预算情景：10 万字符/月按需点读、60–120 万字符/月整章音频；$1=¥7 仅用于预算换算。Kokoro 每百万字符 $0.62–4，对应约 ¥0.43–2.8 与 ¥2.60–33.60/月；实际供应商路由和消耗决定账单。

## 独立设施

- Worker：`tsl-kokoro-voice-lab`
- Pages：`the-second-language-kokoro-lab`
- 全新 KV：只存合成试听材料与试听反馈。
- OpenRouter 推理全由 Cloudflare Worker 发出。浏览器仅读取已有授权音频。
- 管理访问和页面访问分离；页面使用短链接 fragment 换取 HttpOnly cookie，随后移除 fragment。播放器支持 Range。
- 有界生成清单与时间窗口；已启动但结果未知的调用不自动重试。准备完成后关闭生成、撤下 OpenRouter secret。

不改动正式课程、VIX 标记、雅思练习库或临时页。是否采用 Kokoro 作为正式全链路主力，等待本次用户听评后再落实。

### 2026-10-04 账户额度事故后的修正

此前独立 KV 未能隔离账户级每日额度；本次约 1,138 次准备写入超过免费每日 1,000 次，导致用户评分提交失败。Cloudflare 邮件确认账户 put 操作封锁至 2026-10-05 00:00 UTC（北京 08:00）。原音频已完整保存，没有重新调用模型。

当前播放版改为 Pages 的受访问控制静态文件，直接 `/prepared/` 地址不可访问，`/api/audio/` 验证身份后读取静态文件并处理 Range；manifest 从固定计划生成，不读写 KV。反馈迁到 `tsl-kokoro-lab-feedback` 独立 D1，不占 KV 写入额度。旧 namespace 仅留作已生成材料的历史记录，生成窗口继续关闭且模型 secret 已移除。页面地址、访问 cookie 与本机评分存储键保持原值，使手机刷新后可恢复原评分；新版本增加导出备份。不同 D1 同样不是账户配额隔离，但低频整份反馈写入无需原先逐片段 KV 写入。

后续测试通路遵循 `../../protocol/CLOUDFLARE_RESOURCES.md`。本次截图反馈保存在私有缓存，不作为自动检查的评分，不把缺失数值填成零分。

`manage.mjs` 从项目根目录运行，生成私有 `.cache/voice-lab/` 状态，读取已有 Wrangler OAuth 和 `.cache/openrouter-provider.json`；密钥不进入源文件。顺序为 prepare、部署 Worker / secret bulk、pages、部署 Pages、generate、download、master、upload，随后 disable、部署关闭后的 Worker、finalize。`feedback` 只读回本页反馈；`link` 显示私有试听链接。每次收费请求先存启动状态，结果不明确时需人工检查，不重试整批。片段已准备后不运行 prepare，以免重新打开生成窗口。

## 男声调音对照

新增 `/tuning`，原试听页继续保留并提供入口。Fenrir、Michael、Liam 各自比较原版、清晰、自然节奏、明亮、轻降噪五种版本，仍用三个独立词和两个短句。原评分随音色显示，新的词汇/句子/处理版本评分独立保存及提交 D1，旧页面不会混入调音评分。

`node trials/voice-lab/tune.mjs` 只读取原音频并运行本机 FFmpeg，不调用模型，不写 KV。参数和声音/反馈编号见 `tuning-plan.mjs`；处理、验证记录见 `../../research/kokoro-male-processing-2026-10-04.md`。用户随后判定全部调音处理不合格，不提取进一步反馈，不采用处理版本；按最新授权下调男声标准，正式选择见 `../../protocol/VOICE_ROUTING.md`。页面仍保留作历史对比。

## 核实来源

- [Kokoro 官方音色表](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)：音色性别与英美分类，以及极短输入、过长输入的局限。
- [OpenRouter 模型页](https://openrouter.ai/hexgrad/kokoro-82m)：模型音色与供应商价格；端点接受音色与公开音色目录逐项核对。
- [OpenRouter TTS 文档](https://openrouter.ai/docs/guides/overview/multimodal/tts)：统一 speech API。

交付检查记录见 `result.json`；软件可运行不等同于字音与自然度已获用户确认。
