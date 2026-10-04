# Qwen 原声数据接管与 Codex 教学分析

日期：2026-10-03。基于此前本人 76.796 秒录音的独立测试，不创建正式作答、不部署 PWA、不标 VIX。接管的是实际保存的 Qwen 返回、用户确认文本、Whisper 时间及本机声音能量测量，未再次向 Qwen 发送确认稿。

## 数据接管结果

| 信息 | 来源 | 本次使用方式 |
|---|---|---|
| 作答内容 | 用户确认稿；Qwen 独立转写 | 内容与语法反馈以确认的原话为准，保留未经修正的识别版本 |
| 重复与不完整片段 | Qwen 转写 diffi、stay、pract、solu | 形成回听核对点，不诊断口吃、不自动当作错词 |
| 词级位置 | Whisper segments[].words，共 147 项 | 提供近似回听窗口，未声称人工精确对齐 |
| 声音能量低于阈值的区间 | 本机 ffmpeg，-35dB，至少 0.3 秒 | 20 段，11.064 秒；剔除头尾后 18 段、约 8.340 秒，仅用于定位，不打流利度分数 |
| 平直语调等意见 | Qwen 模型观察 | 尚无独立音高测量或听审核实，作为可核对的建议线索 |

近似整段语速：按确认稿 149 个词与完整录音 76.796 秒计算，约 116 词/分钟；包含头尾静音与自然停顿。该统计不说明语速过慢，也不用于推算雅思 band。

## 对供应商意见的处置

1. 重复片段保留为候选事实，优先核对 difficult（约 14–18 秒）、stay calm（约 55–58 秒）、practical solution（约 66–71 秒）。窗口由 Whisper 时间而来，不是 Qwen 编造的时间。重复是否存在、停顿是否影响理解仍需回听核对。
2. 删除 developed 应有明显 d 词尾的批评；词典读音 /dɪˈveləpt/，词尾 /t/。[Oxford 词条](https://www.oxfordlearnersdictionaries.com/definition/english/developed)
3. 不采用“背稿、读稿、紧张、缺乏自动化”等心理或准备方式归因。原声意见的自报 High/Medium confidence 不当作已验证测量。
4. 不由 solving 的字母 g 推断必须有爆破 /ɡ/。是否混淆 /ŋ/ 与 /n/ 是另一个需听审的声音问题，本次不给出个人误音结论。
5. 不采用 MiMo 从错误转写产生的 not only / but also 语法批评；用户确认句式完整，Qwen 与 Whisper 支持相同连接结构。

## 接管后的学习反馈

你的回答已经有清楚的结构：说出技能 → 说明学习背景 → 描述方法变化 → 给出使用方式 → 解释对自己的意义。编程、任务拆解、保持冷静及未来职业之间的关系自然；结尾完成了题意。确认稿中的 not only / but also、when 从句及 identify/divide/finish 并列用法成立，没有必要为了提高目标分数把它们改得更复杂。

下一次优先练三件事：

- **把概括例子换成一个真实小事件。** 当前 difficult assignment 的例子较概括。可补两三句“遇到什么具体困难、先检查什么、做了哪一步、结果怎样”，让听者看到你如何解决问题。事件细节由你提供，不替你编造经历。
- **以意群练三个片段。** 用 a difficult problem、stay calm when facing problems、find a practical solution 分别做短句练习，再放回完整回答。目标是遇到一次卡顿后继续把意思讲完，不要求整段无停顿。是否需要专项练某个词，以回听核对为准。
- **把重点放在方法变化上。** 表达“过去一次解决全部、后来逐步拆解”时，可用 naturally emphasized at first / later / one by one 突出转折；这是表达练习建议，不是已经测得重音错误。

内容扩展可以保持你原来的语言水平和个人表达。例如在原有概括之后，用下列框架自行填写真实经历：

> One example was [a real project or assignment]. The main difficulty was [the specific problem]. I started by [the first step], and that helped me [the result].

本次不评完整雅思口语 band。词汇、语法和内容组织可提供反馈；细微发音、语调是否实际有问题仍需要声音证据核对。这个接管流程已经给出了可用的教学结果，不要求供应商自己充当最终批改者。

## 后续候选测试

用户本轮确认账户地址已更新、界面不再显示模型限制。将该信息记为用户报告；随后音频请求成功才把相应模型标记为该账户实测可用。本轮列全 OpenRouter 音频输入并输出文字的目录，再测试新候选，仍不修改正式产品数据。

后续已完成六个候选、七次请求。Gemini 两款与 GPT Audio 实际仍被 API 地区门禁拦截；Perceptron 转写偏差更多，Inkling Small 无内容，MiMo Flash 官方供应商返回音频不可访问。详见 [补测记录](openrouter-expanded-audio-test-2026-10-03.md)及 [44 项完整目录](openrouter-audio-models-2026-10-03.md)。
