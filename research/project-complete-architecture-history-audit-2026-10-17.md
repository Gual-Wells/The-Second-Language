# The Second Language 全局架构与历史复核——单词音频独立研究前置报告

**日期**：2026-10-17。**权威只读基线**：主仓库 main 提交 85355e200705f9fc55ff92dab36f85e569884d96。**性质**：重新研究，不是生产协议，不修改任何运行配置、日课、词汇点读、历史收费资产或旧章。撤销旧报告的提交已独立完成（85355e200705）。对同日另行研究的单词语音，应继续看《word-audio-root-cause-source-and-integration-2026-10-17.md》。

## 1. 核查范围与证据边界

实际使用 GitHub connector 递归读取主仓库全部顶层目录树（均未截断），以及从 2026-09-29 初始项目到 2026-10-17 共 178 条主分支提交历史；读取所有与产品运行直接相关的权威章节生产、内容/音标/词源、语音、存储、余额、交互、考试、答疑/质检及旧章升级协议，并回读重点代码、音频试验记录、变更 PR #14/#16/#17/#18/#27/#34/#39/#40/#41。

这并不是声称逐行读完 360 MB 研究区中的每张 3D 建模图片、几何文件和二进制资产，也未取得只有用户私有 Microsoft OneDrive、Cloudflare D1 与 Windows 本机缓存才保存的完整录音。必须区分「仓库源码直接证据」「仓库里既有的生产回执」「本次未获得的私人生产原件」。研究项目架构和其所有主要业务依赖，而不把 GitHub 当前的有限快照等同于完整运行时事实。

递归文件树结果：
| 部分 | Git 文件数 | 汇总文件字节（约） | 角色 |
|---|---:|---:|---|
| research | 830 | 360.10 MB | 历史报告、语音实验、3D 样币与原始研究材料 |
| web | 104 | 57.69 MB | iPhone 原生 PWA、阅读/考试/画廊试验 |
| chapters | 17 | 0.715 MB | 五个日课文件夹，每个 MD/JSON/meta；另有演示 |
| scripts | 94 | 0.487 MB | 定时、音频、发布、归档、测试、外部服务 |
| worker | 63 | 0.373 MB | Worker/Cloudflare D1/OneDrive 服务与迁移 |
| protocol | 36 | 0.287 MB | 当前协议、过渡协议与校验 JS |
| trials | 35 | 0.139 MB | Kokoro voice lab、其他试听、题音 |
| outputs | 10 | 0.066 MB | 音频模型调查数据及历史账单测试 |
| work | 1 | 265 bytes | Git 中只保留说明；实际工作档在非 Git 目录 |
| 根目录 | 6 | — | AGENTS/README/OPERATIONS/LICENSE 等 |

主仓库约 1,196 个文件。关联的另一个仓库 IELTS-Vocabulary-Index-List 含 Collins COBUILD、Oxford English-Chinese、Chambers/Klein/Oxford 词源及 VIX 种子索引。词汇教学使用固定提交与教材 blob，不应将公网临时字典结果等同于项目源教材。

## 2. 所有主要业务系统怎样交互

**学习资料**：正式日课选 40 个 VIX 主词，保留来源/家族，Collins 与 Oxford 全部实际用法融合；第一部分 WORD/USE 二级标题附美式 IPA，独立细用法可处在列表；第二部分英文例句和中文译文，第三部分完整文章逐句译文及 USE 归属，第一部分新增一级词源区块。固定章节摘要是跨系统权威身份，不允许为了音频改写文本。

**内容生产**：本机 Codex 依 DAILY_RUN、QUALITY_WORKFLOW、CONTENT、ETYMOLOGY、ANNOTATIONS 和 USAGE_LABELS 读源/选词/逐词审阅/文章/发布。软件校验编码结构不等同于语言教学语义正确。历史的未完成运行可续作，VIX 标记不因声音暂缺回滚。

**阅读器**：iPhone PWA 采用既有视觉主题、书册/日历、阅读位置保存、章节切换、纯净模式、高光用法跳转、长按/双击答疑。设置包含声音预下载和下一章句音配置。点击区域和手势有既存职责，不可未经审视恢复「任意按词」的旧交互。

**章节质量/考试**：独立章节质检绑定原章 digest/教材/反证报告，不修改日课。章节答疑只读分析，用现有队列和标记回复。正式章测试 13 道文字、7 道音频口答，Bella 题音永久索引；48 小时临时测试原声/分数到期隔离，不删除曾付费的可复用题音。完整/微缩 IELTS 听读写说另有独立题源、草稿和答卷，原声分析走 Whisper、Gemini、Qwen、GPT Audio 四路而非单词 TTS；用户答卷原声不进入普通章节点读缓存。

**认证/纪念币实验**：真实 3D 样币、章节理解认证和声音作品存在独立试验线，未全面进入正式认证；币主题声音/物理碰撞声与英语词音无关，不能把其它实验的 14 个 MP3 当作词典资产。

**运行/永久保存**：iPhone Pages 同源 API 网关 → Cloudflare Worker + 多 D1 → Microsoft OneDrive Apps/The Second Language 内容摘要永久文件；KV 近期兼容、客户端 CacheStorage 只是可删副本。Windows 本机定时跑日课、答疑/质检、雅思练习及音频准备；音频工作进程不调用 Codex 语义推理。普通归档运行 migrate/packs/backup，失败要留下进度，原件暂不可取绝非“未生成”。用户电脑离线时已部署文字和声音仍可访问。

**权限/费用**：OpenRouter 只走 Cloudflare，不把服务密钥给浏览器；失败、HTTP 402、调用未知结果都留账本，不可自动重新付费、自动充值或跨日恢复。不同 KV/D1 namespace 不隔离 Cloudflare 账户共享免费操作额。

## 3. 真正的项目时间线与语音责任变迁

| 日期 | 仓库/PR 的实证 | 对单词音频的判断 |
|---|---|---|
| 10-01 | audio-delivery.md 和 tts-provider-study 早已对 IPA SSML、Azure/Google/Polly 与存储做过比选 | 简单再罗列这些供应商不构成新研究 |
| 10-04 | Kokoro 20 美式声试验：220 片段、60 次独立词音、40 句、120 对话；词形仅 analysis/schedule/record，用户 Bella 词音5/句音5 | 只有三词的主观满意度，不能推定完整词库绝无字音错误；也不支持“Bella 自始至终无法发单词” |
| 10-04 | 试听过程约 1138 次 KV 写入触发免费账户 1000次/日限制，后改受保护静态音频+D1 反馈 | 禁止新单词功能逐点击大量 KV 账本写入 |
| 10-09 PR14 | 使用 [word](/Misaki-phonemes/) 覆盖；同一显示词 record 两次覆盖成 hello/goodbye，Whisper 分别转写对应内容 | 证明“覆盖进入合成器”，没有证明真实教材音标映射普遍正确 |
| 10-09 PR16 | 实现第一部分 IPA 标题 + 第二、三部分整句的限定点读，并清洗历史包；不删已收费音频原件 | 旧方案曾经存在，用户后来明确撤销；复启须读取历史资产 |
| 10-09 PR17–18 | 三章计划 166/360/350，共 876 个合法单元；4 次 Worker exceededResources 及 OneDrive 归档故障，优化后完成摘要/包/状态核验 | 876 证明生成/储存与完整性，不是 876 个单词通过语音学测试；性能和资产要单独审计 |
| 10-10 PR27 | 用户取消所有词汇点读、预备及生成；保留收费原件，迁移将请求限制为 sentence-only | 当前恢复不是翻转一个布尔值；新功能须另获明确规则 |
| 10-12 PR34 | 默认每章仅第二部分例句、第三部分范文各完整句 Bella 预备，首次发布异步入队 | 单词层必须完全独立于现行句子满配和音频预计报价 |
| 10-16/17 PR39–41 | 新增词源、双教材融合、质检；线上七章旧章升级被纠正为仅第一部分、等待用户审批，不准生成新词音 | 新音源不能顺带启动旧章迁移 |

三章 876 单元的报告还记录过 paid job 的未知结果用户逐条再授权恢复、D1 旧 BLOB 类型兼容修复、最多四路只读包处理；都不能被“查个词典 API 即可”替代。

## 4. 为什么必须把网页内容、实际词形与 IPA 分开

源五章的第一部分含 667 个带 IPA 的二级标题，但共 697 个 USE；另 30 个 USE 是细用法或列表项，而非带 IPA 标题。早期三章共 349 个 H2 用「词 · 中文释义 /IPA/」，后两章共 318 个 H2 用「词 中文释义 /IPA/」。前端 render.js 现有分割中点的代码不是经过验证的 spokenForm 提取器。

从 2026-10-11 原文实际发现：
- flute 的「或 flutist」义项 IPA 对应 flutist，而标题首英文 token 却是 flute；「或 fluting」同理。只拿“标题第一个英词 + IPA”将**确定地产生错误目标配对**。
- concert 的名词与动词重音不同；viola 在乐器义与植物义的元音及重音不同；upstream/downstream 在句法角色下存在重音差异。

因此严格区分章节版本 digest、WORD、USE、显示标题、**实际朗读词形**、IPA/音源读音、音频资产 identity。词音候选不能只按拼写或页面全标题共享。

对五份 Git 章的第二、三部分英文粗 token 提取共 17,021 次出现、3,472 个不同拼写；这是五章的 Markdown 粗词法样本，不包含线上另外两章、也不是词典形态还原数。按每个词全量提前付费合成是不合适的；有用户动作时才触发普通单词音源更符合负载。

## 5. 生产禁止事项与不能声称的事实

现在的 web/audio-plan.js 只接受 EXAMPLE/SENTENCE，worker/src/pronunciation.js 收费前直接拒绝 kind=word 或 ipa，scripts/audio-worker.mjs 跳过 word；即使 web/reader-speech.js 还含 IPA/Misaki 与 old cache 接口，也只是为了历史兼容。worker/src/audio-config.js 仍支持保留旧的音素版本 descriptor，成功索引为 pronunciation_results，章关系在 chapter_audio_scopes/chapter_audio_clips；OneDrive 内容与完整生成记录为永久真相。旧内容不可读不能当作未成功从而反复付费。

LEGACY_CHAPTER_UPGRADE_TEMPORARY v1.1 的**当前状态为待批准**：七篇旧章、280 主词、1,411 USE、2,511 个章内去重的句音 descriptor、198,143 字符，后两章 10-13/14 只在生产源可见、没有 Git 现成 chapter.md。此次研究没有改任何版本，不批准自动升级、重写二/三部分、重新制作句音或新词音。

**未取得且不准伪造**：旧词汇付费声音实际 ready 条数/录音内容/所配 IPA/用户真实失败词表；历史 private OneDrive/Cloudflare 账户当前余额及在线响应；实际 iPhone 点击延时和完整声学故障率。需要有现成发布身份的生产 Codex **先只读检索已有音频 descriptor + blob 摘要+原声记录**，不付款、不重复生成，才能确认 Bella 错读发生在解析、音素转换、合成、路由、缓存键还是语音文件本身。

## 6. 全局审计对独立单词音频研究下达的约束

- 先复原历史原件和错误样本，不再用“另一个 API 可能念得好”代替因果分析。
- 先修正章内 USE→spokenForm→IPA 的对应逻辑，再谈 IPA 语音合成。自动字符检查通过不代表目标词正确。
- 分离第一部分带目标音标的确定用法读音与第二/三部分其它选中词，后者允许默认读音，不需要每次调用大模型判断。
- 保留 Bella 句子、章节测试题音、IELTS 和四路口语评价的独立身份与门禁；新词音不能绕开 sentence-only 老接口限制。
- 继续 OneDrive 永久原件+D1 紧凑索引+缓存和正确授权，控制单词数量、KV、Worker CPU、未知计费与版权。
- 新的实现报告必须把**已验证、待验证、不可从当前权限验证**列清楚，且当前只交付研究。

### 核查文件/变更定位

主仓库：AGENTS.md；README.md；OPERATIONS.md；protocol/DAILY_RUN.md、QUALITY_WORKFLOW.md、CONTENT.md、ETYMOLOGY.md、ANNOTATIONS.md、USAGE_LABELS.md、CHAPTER_QUALITY.md、CHAPTER_TESTS.md、CHAPTER_QUESTIONS.md、SPEAKING_ASSESSMENT.md、SPEAKING_RUNTIME.md、AUDIO_CONFIGURATION.md、VOICE_ROUTING.md、READER_INTERACTION.md、STORAGE.md、CLOUDFLARE_RESOURCES.md、BALANCES.md、LEGACY_CHAPTER_UPGRADE_TEMPORARY.md；web/app.js、render.js、reader-speech.js、native-speech.js、audio-plan.js、audio-library.js；worker/src/pronunciation.js、pronunciation-store.js、audio-config.js；scripts/audio-worker.mjs、retire-word-audio.mjs、clean-point-audio.mjs；trials/voice-lab/README.md、result.json；research/kokoro-words-sentences-feedback-2026-10-04.md、chapter-audio-configuration-2026-10-09.md、reader-point-audio-scope-2026-10-09.md、audio-bulk-resource-repair-2026-10-09.md、legacy-chapter-upgrade-compatibility-2026-10-17.json。关联 VIX textbook/ 文件目录经独立 GitHub 仓库确认。
