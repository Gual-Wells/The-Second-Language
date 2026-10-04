本文件保留预建设设计记录。2026-10-04 已接通正式 PWA 原声录制、上传、私有 KV、转换、固定采集和 Codex 反馈；当前运行与上线范围以 protocol/SPEAKING_RUNTIME.md 为准。

# 第二语言原声设施的工程接入设计

本设计落实当前四路全量采集、Codex 教学接管、Qwen 多次补听、腾讯专项补充和充值后续作。四路为 Whisper、Gemini Flash、Qwen、GPT Audio；新增模型依据增量价值加入固定主链。采集核心、固定要求、私有文件组织及独立 Worker 已有代码；以下 PWA 上传/后端领取接口是具体待接入设计，不能把它们当作已经在线。实测依据见 [2026-10-04 报告](openrouter-speech-evidence-2026-10-04.md)。

## 现有系统如何扩展

继续使用同域 Pages 网关、通行密钥登录和独立 PRACTICE_DB。既有 written / speech-transcript 答卷不改写成有原声的答卷。新增 speaking_attempts 与旧 practice_attempts 并列，练习书架和题目下的尝试历史通过后端统一视图读取；真实录音在接口层标为 speech-audio。

`worker/speaking/schema.sql` 是准备好的独立扩展，不放进现有自动迁移目录，避免在私有存储和录音入口尚未可用时形成半上线状态。新表关联既有 question ID，题目/参考/来源的当时版本另存不可变快照。模型请求和补充评测分属 job/call；后续补全创建新 job，反馈形成新版本，原答卷与旧反馈不被覆盖。

大文件放私有 SPEAKING_ASSETS 桶：原件、完整转换件、题目快照、固定 contract、请求描述、全部原始返回、解析资料和反馈。D1 存关系、对象定位、状态及费用。正式配置目前没有该桶绑定，需要先配置；R2 不开启公共访问。不能以公开 Git 或 D1 BLOB 代替私有录音存储。

## 上传与原声准备

PWA 在真实口语题下提供录制/导入、回听、重录和提交。开始录制先停止原生朗读，结束后保留本地预览；上传成功后才显示已提交。保留旧有文字练习入口，但不把它呈现为原声评测。

iPhone 媒体格式不能只凭扩展名猜测。原件完整上传，另外准备 WAV；可以由网页实际支持的解码能力制作副本，或由 Codex 本地 ffmpeg 准备。记录全过程时长/采样率/摘要，不裁停顿、不改速。无法解码时停在 preparing，保留原件并转为待准备任务，不把缺少转换能力解释为没有声音。

准备完成后，四路使用同一完整 WAV。后台验证文件存在、摘要和格式；创建 job 时存 `JSON.stringify(contractSnapshot())` 的固定字节及 SHA-256，不能对旧作答自动应用后来变动的 prompt/模型要求。GPT Audio 不支持原生 Structured Outputs，采用明确的最终 JSON prompt 与本地结构校验；其他音频观察主路使用 Schema。语言学前提、声音判断及时间正确性另由 Codex 核查。

## 后端接口设计

| 接口 | 工作 |
|---|---|
| POST /api/practice/questions/:id/speaking/uploads | 登录用户建立独立上传与 attempt，绑定题目快照，取得仅用于该上传的受控通路 |
| PUT /api/practice/speaking/uploads/:id/:asset | 接收 original 或 converted 文件；验证会话/上传身份、大小和真实格式，不接受任意对象 key |
| POST /api/practice/speaking/uploads/:id/complete | 校验完整原件与副本，记录参考答案是否在提交前揭示，排队已准备 job |
| GET /api/practice/speaking/attempts/:id | 查看本人状态、原声回听与反馈，不发送隐藏参考答案或供应商密钥 |
| GET /api/practice/publisher/speaking/next | Codex 轻量读取准备/批改待办；空队列不启动大模型 |
| POST /api/practice/publisher/speaking/claim | 分别原子领取准备或分析任务，取得题目快照、来源、历史反馈与完整材料清单 |
| GET /api/practice/publisher/speaking/:id/assets/:assetId | 发布身份读取列入清单的私有原件或返回，不允许任意桶路径 |
| POST /api/practice/publisher/speaking/:id/complete | 按领取身份回写反馈版本和索引，重复提交同一版本不重复创建 |
| POST /api/practice/publisher/speaking/:id/supplement | 固定原声/旧结果，追加指定代偿或腾讯专项 job，保留已完成调用 |

浏览器写操作沿用 session + 同源检查，Codex 使用服务端发布身份；未来 Chat/MCP 有独立只读/按作用域权限。私有回听通过受控接口或短期受限 URL，不能把发布 token 放到播放地址。所有资料必须属于同一授权作答。

## 后台和 Codex

`worker/speaking/collector.mjs` 独立于日课/临时页/推送 Cron，示例配置每三分钟读待处理口语任务。D1 原子领取与二十分钟租约避免重叠，每次专项前续租；四路首轮并行，追加目标逐项执行。Qwen 本轮实测约 119–276 秒，请求等待上限放宽至五分钟；成功记录优先恢复，不为等待时间增加调用。接口 request descriptor 不复制大段 base64，保存同一对象 key 与 digest，使原请求可重建。补充 job 校验父任务的答卷与原声一致，复用已完成调用的原始对象和旧要求来源，复用记录不再次计费。

所有 OpenRouter 推理和余额核对在 Cloudflare 后端。私有 POST `/speaking/details` 接口已实现专项入队，需正式网关/服务绑定后才在线可用。本机 `scripts/speaking-detail.mjs` 只发控制请求；`.cache/speaking-backend.json` 保存后端地址和控制身份，不提供本机推理回退。专项计划固定为内容摘要对象，route_id 与 task_id 分开，以便同模型不同目标追加调用；相同计划重复提交复用原任务。

采集原始返回先写文件，随后登记完成状态；故障恢复查找已落盘资料。无法确认是否已收费/完成的调用保留 outcome_unknown，不自动重新收费。单个服务缺密钥、余额或额度不阻塞其他已配置服务。

Codex 监测仍使用 gpt-6-sol high，并给足读取与分析预算。扩展已有 run-practice.ps1 的轻量待办检查，以新 speaking 队列为输入；领取后物化到 `work/expression/reviews/<attempt>/speaking/<job>/`。`scripts/speaking-handoff.mjs` 已可从私有本地清单生成完整接管目录；在线下载与新领取接口接通后复用它。固定题目及参考答案只在 Codex 接管时加入，不污染四路首轮转写。

Codex 自由写转写核对、资料出处、语义判断、回听候选、全面分析、反馈与 resume.md。前端简洁反馈可沿用 summary/strengths/priorities/nextStep，另带四项能力覆盖、详细反馈定位、证据和回听关联。没有充分声音依据时先完成能成立的表达反馈，不能因音素服务异常把写作或日课暂停。

## 代偿和独立服务冗余

路由配置在 `protocol/speaking/routes.mjs`。按能力填补缺失，而非固定某个厂商；请求前核对音频/数据格式、账号、可用地区、隐私条件、价格和实际质量，不把目录声明当作通过。

| 失效 | 代偿 |
|---|---|
| Whisper 不可用 | 保留 Gemini/Qwen 完整转写和声音观察，Codex 核对底稿；时间位置不足单独标记，不生成假时间 |
| Gemini、Qwen 或 GPT Audio 单路暂时失败 | 已成功的完整返回复用；保留具体异常，只有通过真实声音质量验证的备用通路才可自动补调 |
| OpenRouter 钱包/该 key 整体余额不足 | 保存资料，将本声音任务挂起到北京次日；后端核对实际充值和 key 可用后只补缺失调用，其他项目任务继续 |
| 腾讯余额不足、OpenRouter 可用 | 可用 Qwen 多次定性补听；不虚构腾讯音素分值或精确重音测量 |
| 仅剩一个声音模型 | 完成有依据的分析，明确单路观察及未解决分歧；优先代偿另一声音模型或腾讯争议片段 |
| 只有可信转写 | Codex 完成内容、词汇、语法和文本组织反馈，按需追加声音专项；未能确认的声音结论留待补全 |
| 所有声音服务暂不可用 | 原件与任务继续保存，PWA/日课/写作继续正常；可以另交文字练习，原声任务待服务恢复，不宣称声音批改完成 |

独立额度池明确为 OpenRouter 整体余额、Cloudflare Workers AI（Whisper）和腾讯 SOE。OpenRouter 内换模型是模型能力/可用性代偿，不是余额代偿；同模型可先通过支持实际请求参数的其他端点恢复。本轮 Gemini 2.5 Flash 已取得完整返回，但存在改词/虚假纠错，仍不开启自动代偿；3.5 Flash Lite、Pro 等也未证实值得加入固定主链。GPT Audio 已通过最终产物格式测试，加入固定第四路，仍须审阅其错误。GPT Audio 与 Whisper 同属 OpenAI；同一 Qwen 多次调用也不增加独立来源计数。未来渠道保留接口，无实际 adapter/凭据时不得称为已经接入。OpenRouter 余额不足不能以更换同钱包模型解除，也不因已有少量材料而把声音任务标为最终完成。

退化资料仍可以进入 Codex，manifest 标出实际来源、覆盖范围、缺失项与后续补充计划。代偿完成追加反馈版本，读者可以回看旧版本。质量保障是维持有证据的完整教学工作与可补全的声音判断，不能靠把未知写成确定来维持表面完整。

## 腾讯专项

现有独立腾讯账号可在本机执行 `scripts/speaking-assess-sentence.mjs`。Codex 从具体争议选择短句，核对实际原话，裁出不截断词的 WAV，记录原声摘要和起点。计划 JSON 含 audioPath、referencePath、originalDigest、clipStartSeconds、referenceSource（learner-confirmed-utterance 或 codex-checked-utterance）。用 --dry-run 检查准备；实际调用保存每个中间包及终态，再把完整结果加入同一接管目录。

接口不接受普通分析 prompt，以评测模式、实际原话和参数控制。返回音素、边界和评分但不把它们直接映射雅思；需要回听确认具体音素误读。默认 false 的重音字段不表示已验证无重音。每次专项均有独立来源和结果；需要云端化时建立腾讯 WebSocket adapter，而不是把签名密钥交给 PWA。

## 上线与验证范围

新增单词模式 0/纠错模式 4、F_P2L 字母映射和 F_IPA 输出已经真实调用。纠错模式返回参考/检测音素和非默认重音；连续语音裁词仍会受相邻词与切点影响，边界越界时不产生回听定位，各模式分值不混算。`scripts/speaking-assess-word.mjs` 保存全部包；字母映射和 IPA 目前分别请求，组合指令未验证。rec_mode=1 已修正为只发一个二进制包。

已有：四路采集代码、真实 detailed-prompt/Schema/最终 JSON 云端试验、腾讯句子及单词模式/工具、等待充值状态与后端资金核对、幂等专项队列、数据库扩展定义、后台 Worker 和配置、私有本地接管工具与运行协议。等待充值、恢复复用和未知收费状态经过真实 SQLite 的隔离验证。

正式上线仍需：私有桶与 D1 扩展、上传/准备/授权下载/领取/反馈接口、真实 iPhone 录制链路、书架的音频尝试视图，以及上述接口接入既有 Codex 监测。部署应先完成后端和一次完整私有作答，再显示读者入口，不使用伪录音按钮。测试资源不绑定正式库，不写 VIX，全部返回保存在私有忽略目录；本轮未部署正式声音设施。

官方参考：[音频与文字联合请求](https://openrouter.ai/docs/guides/overview/multimodal/audio)、[端点结构化输出](https://openrouter.ai/docs/guides/features/structured-outputs)、[Whisper 参数](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/)、[腾讯句子评测](https://cloud.tencent.com/document/product/1774/107387)、[IELTS 四项口语标准](https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf)。
