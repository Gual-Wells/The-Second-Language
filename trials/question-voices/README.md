# 口语题目声音试听

独立试听页，沿用第二语言的 2008 视觉语义及 iPhone 锁定缩放设计。它不修改正式章节、练习数据库或 VIX 标记。

## 本轮内容

三段原创题目片段分别覆盖 Part 1 日常提问、Part 2 考官引导及 Part 3 讨论追问。每段由三个声音朗读，共九个 MP3。Part 2 保留可见的任务卡，朗读原文默认折叠。声音先以 A / B / C 展示，可主动查看模型。

- A：Microsoft MAI-Voice-2.1，Harry，英国英语。
- B：Kokoro 82M，George，英国英语。
- C：Cloudflare Workers AI Deepgram Aura-2，Apollo。

Google TTS 原始请求及用户明确要求的再次尝试均从 Cloudflare 发出，返回地区 403：`Gate Endpoints with Geo Restrictions`。本轮没有可试听的 Google 音频。

## 评分与回收

每个声音可分别给自然度、清晰度、考官语气和题文忠实度打 1–5 分，选择能否用于正式练习，填写备注，最后选择偏好的声音。允许部分评分。点击“保存评分”后才向独立 KV 写入；成功显示回执。重复发送同一提交编号复用回执，修改评分后产生新提交，保留反馈历史。

浏览器本地保存草稿及试听记录；云端保留已提交反馈。私人链接中的访问令牌在首次使用后转为 HttpOnly cookie，并从地址栏移除。音频支持 Range 请求；同时只播放一段，切换题目或离开页面时停止播放。

Codex 在本机使用 `.cache/manage-question-voices.mjs feedback` 回收反馈。令牌、账号凭证、完整原始响应及原声音频只放在忽略的 `.cache/question-voices/`；不得提交到仓库或放进前端包。

## Cloudflare 通路

`Pages 静态页面 → Pages service binding TRIAL_API → 独立 Worker → 独立 KV`

所有模型生成及 Whisper 文字复核都在 Cloudflare 后端执行。本机只管理部署和回收产物。没有浏览器直接调用 OpenRouter，也没有本机直接调用模型。

Worker 绑定：`TRIAL_DATA`。生成期另有 `AI`、`OPENROUTER_API_KEY`；访问使用 `VIEW_TOKEN`、`ADMIN_TOKEN` 和 `APP_ORIGIN`。生成必须显式设置 `GENERATION_ENABLED=true`，并提供有限的 `GENERATION_DEADLINE`。本轮完成后关闭生成开关、停止定时触发并删除部署中的 OpenRouter 密钥。访问与评分继续可用。

付费请求前记录启动标记，防止重跑重复收费。保存请求、完整失败响应、音频与返回元数据。生成记录不会被试听反馈覆盖；余额不足停止后续调用。本试验的音频量很小，暂存独立 KV，不代表正式项目的大规模音频存储方案。

## 已完成的验证

393 × 852 手机视口无横向溢出；播放入口、题目切换、十二项评分、合格选择、偏好选择、查看模型及云端保存经过浏览器检查。自动产生的反馈在交付前删除。

九段音频使用无题文提示的 Whisper 进行文字复核，忽略大小写与标点后均与题文一致，且全部 MP3 可完整解码。这仅检验转写与题文的一致性，不代表自然度、人声质量或真实 iPhone Safari 已经由人工验收。自然度和练习适用性由试听反馈判断。

页面、反馈存储和音频保留用于本次试听；之后清理时应先回收真实反馈，再删除这组独立资源。
