# PWA 原声作答运行通路

与 SPEAKING_PIPELINE.md 的保真采集、原生分析和故障代偿协议共同使用。本轮正式接入口语录音与已有音频提交；原文件保存在私有存储，不写公开仓库、正式日课或临时页。文字补充仍仅评价文字维度。

## 闭环

1. PWA 显示考官声音、可见 Part 2 卡片和计时；本人主动录制或选择已有文件。录音结束后本机 IndexedDB 保存草稿，可以回听，主动提交才上传。来电/页面隐藏停止录制并保留已录部分；不得把中断前的残段自动当完整回答提交。
2. 同域登录身份 PUT 原音频，固定 attempt、question snapshot、原音摘要、参考答案与提问是否先看过。最大单份十分钟/20 MiB；后端不会凭客户端提供的时长当作音频事实。回听和查看状态都走授权接口。
3. 独立 Windows Codex 任务读 next，preparing 用 node scripts/speaking-practice.mjs prepare ID。脚本回收原始字节到忽略缓存，ffmpeg 仅转为 16 kHz 单声道 PCM16 WAV，不裁剪、除噪、补词、变速或修复。实际 WAV 时长由服务器解析样本数据；原文件继续保留。无法解码时保留原件及错误并通知本人，不伪造格式或时长。
4. Cloudflare 分钟任务领取一份准备完成的 job，复用既有 collector 执行 Whisper、Gemini、Qwen、GPT Audio 固定主链，保留固定 contract、每次 request/raw/metadata/parsed、原声与 derivative 的摘要关系。所有模型请求来自后端；成功结果复用，未知计费结果不自动重付。OpenRouter 钱包不足停止新增收费调用，不自动跨日重试，其他任务继续。
   模型将一份完整报告额外包成单元素数组时，只有其中对象独立通过原 schema 才无损解包，并在 metadata 记录解析方式，原始 raw 保持不变；空数组、多份报告或不合规对象仍需核对，不因 HTTP 200 或已有扣款称为成功。费用按 usage.cost 含思考记录，不把 max_tokens 当预计实际输出或全部计费 token 的保证上限。
5. ready 用 node scripts/speaking-practice.mjs claim。完整回收所有采集任务与返回、manifest、题目快照和原声；Codex 深入检查声音证据、模型矛盾、转写不确定、真实错误与正常口音/弱读。Whisper 时间是识别结果，不替代声学认证。需要时用 details _ plan.json 调用额外 Qwen/GPT 补听；同模型重复不是新的独立共识。腾讯按既有本人原话本机 adapter 补充，不能把未确认文本当发音参考。
6. 按官方四维朝 7.5 提供教学引导，单个回答不是完整三 Part 的正式 band。feedback.json 包含 summary、strengths、priorities、nextStep、qualityScope，可含 analysisText 与 findings；保留依据、有效表达和可操作建议，不苛责普通非母语口音。complete ID feedback.json 持久保存并在 PWA 显示。

## 状态与续作

preparing、collecting、waiting_credit、ready、reviewing、reviewed、needs_attention 对应准备、采集、充值等待、待分析、分析中、已反馈、需核对。needs_attention 用 inspect ID 回收 manifest 和任务；针对已知失败处理原因，不通过反复重建任务消耗余额。缺钱不把中间文字建议冒充声音最终完成。原声不能支撑某维度时明确未评估，不补造音素分、校准 confidence 或 IELTS 分数。

当前私有资产按 STORAGE.md 使用 OneDrive 永久基座，speaking 前缀与试题音频分开身份，单份上传仍限制 20 MiB；PRACTICE_MEDIA KV 是写入故障的兼容副本，并保留待归档标记。原声、所有 request/raw/metadata/parsed 及反馈永久保存。启用永久存储时分钟采集器每轮只增加一个模型调用，再重新入队；最终整合复用全部结果，避免超出免费 Worker 单轮外部请求上限。正文阅读缓存不存私人录音。申请、题目、答卷、采集任务与反馈均通过独立 PRACTICE_DB 关联。

## 任务末尾额度更新

执行本协议所涉及的日课、推送、练习建设、批改、声音分析或测试工作时，最后按 `BALANCES.md` 查询各方额度，携带核对时间、核实/估算状态与用户完整学习流程的用量范围，发布更新到余额页；各方仅在不足三次最大消耗任务的预留时提醒。页面显示上一次任务的记录，浏览时不实时查询。不自动付款，不安排余额不足后的跨日轮询/重试；已有材料与未知计费保护继续有效。
