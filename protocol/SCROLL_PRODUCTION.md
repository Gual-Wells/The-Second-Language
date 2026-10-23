# 章节卷轴生产与恢复

本文件接线 [CHARTER](CHARTER.md) 的创作职责与 [SCROLL_CRAFT](SCROLL_CRAFT.md) 的实际工艺；不替代其艺术判断。入口 `scripts/scroll-worker.mjs`，数据约束在 `scroll-production-contract.mjs`，创作/独立审阅提示在 `scroll-production-prompt.mjs`。

## 身份及操作边界

真实用户首次满分事件来自服务端 `chapter_certifications`。制作只能领取用户明确申请的同一认证工单；受誉者固定主体 `second-language-owner`、显示快照 Gual Wells。通过时间 `passedAt`、制作时间 `madeAt`、实际发布时间分开。未颁发样品的 `certificationId/passedAt` 为 null、类别为 `chapter-specimen`，不插入正式成绩或目录；旧第一/第五章实验不补颁发。

内容摘要为 `scrollContentSHA(record)`：递归排序键的 canonical JSON，只包含 `second-language.scroll-content.v1` 身份、来源、事件时间和完整英中 copy。纸面、方案和归档另算字节摘要，不把印上摘要的 PNG 纳入自身内容摘要。重开不改日期、文字或作品身份。

## 可执行生产链

1. `/api/scrolls/jobs/claim` 原子领取，保存固定完整三部分与真实认证。租约每分钟心跳；无工单立即退出，不请求模型。
2. `source → art`：实际 Codex CLI `gpt-6.1-sol` / `xhigh`，使用现有订阅认证；不是仅在 JSON 宣称模型。返回 data-only 艺术方案；按章共同创作文书与构图、全部英中、章内真实短引文及材料使用依据。段数、诗行和位置可变，不限定第一/第五章套版。字句按固定章节核对，正文不复述教学故事或堆目标词。
3. `materials`：优先复用有来源的无字母材、扫描微通道、印模及已验器物。允许与新章构图共同成立的母材派生；不镜像成品换字。当前稳定绘制 profile 允许无字纸膜生成；独立插画 placement 尚未加入本 profile，因此创作不能要求未实现的图层。需要新纸时通过 **Codex CLI 的内置 image generation** 实际提交/取回，保存 PNG 原件、提示与观察到的元数据；这与付费 Image API fallback 是不同路线，不读取 API key 静默购买。工具不暴露模型/质量时记为未暴露。
4. `layout`：浏览器 Canvas2D 真实加载 Aboensis，按实际字形量测排印；不回退系统字、不不断缩小凑格。保留旧墨光学密度、小长方印模/吃墨/肩墨/印压，冻结 front/back/ink/relief/sealInk/sealMask 六张 PNG。新制材优先独立 `first-v6-lossless`，直接复用SHA `cf442d74...` 的第一章原PNG，原图RGB/alpha不重画；每件另存 `source-paper.png` 和复用来源进入恢复卷/CAS，不依赖新增共享基座。旧 `first-v6` 仍指旧WebP，不修改已有冻结作品。透明RGB不能直接当可见彩边：以真实深/浅背景alpha合成与GPU显示判断，材料年龄保留在基色。normal/roughness 复用共享扫描；不把污斑当高度。
5. 真实 Chromium WebGL 将新纸装入已验 v42 器物，检查闭合、松扣、纸卷运动、中间态、展开及反向；保存实际 GPU 展开/中间态。它是自动化浏览器证据，不冒称实体 iPhone Safari 或用户审美认可。
6. `review`：以另一轮新上下文实际运行 `gpt-6.1-sol/xhigh`，输入固定来源、完整方案/英中、真实 record、原件/背面/GPU图和检查。审阅绑定精确 candidateDigest/contentSHA，creator/reviewer runId 必须不同。主题、译文、材料、排版、动态及工程分别判断，不以无溢出替艺术合格。
7. 针对已知排印/艺术缺陷保存原候选，自动最多两轮定向返修，通过 `/revise` 回到艺术阶段并形成新 revision 目录。超限进入 attention，保留具体问题。工具结果未知不走这条返修：保持 `outcome_unknown`，先找回原件或取得相应一次重试授权，不自动重发。
8. `archive`：六图、完整来源、原稿/方案、内容身份、原生制作源、原始生成图（若用）、制作与实际检查资料进入每件普通独立 ZIP 卷与 `work-recovery.json`。Python zipfile 以≤18MiB原始载荷组卷、每卷实际≤20MiB，任一文件上传前核≤24MiB；不是截断原始二进制的自定义分片。每卷附全部成员路径/字节/摘要，恢复时用标准ZIP工具解压全部卷到同一目录并核摘要。共享字体、无字母版、扣具 Blend/烘焙、卷膜/雾/声音及许可由永久 `baseManifestDigest` 闭包引用，不每章重新上传。独立审阅在候选之外另存 CAS，避免“候选包内含绑定该候选的审阅”形成摘要自引用。它仍是最终包的必需恢复记录。
9. 逐对象上传内容寻址存储，先上传完整package manifest，再把不可变 `manifestDigest` 写入archive检查点；服务端按两文件一批回读验证以适配 Workers 免费子请求上限。全部资产、恢复包、内容身份、独立审阅通过后才 `/complete` 原子标记ready。archive重启直接按该远端manifest接续verify/complete，即使本机目录不可用也不请求模型。review后上传中断则先核本机候选、独立审阅、包及全部文件的精确SHA，复用相同字节，不重渲染、重拼审阅或重发模型；缺完整可恢复包时进attention保留成功external记录。用户领取后正式目录才出现该章。

## 运行与恢复

生产一次调用：`node scripts/scroll-worker.mjs`。由现有隐藏本机服务按队列执行，系统任务使用 Hidden 窗口及互斥，不能频繁弹出 PowerShell。实际文件在 D 盘 `work/scroll/<job-id>/`；运行需 `SECOND_LANGUAGE_CODEX_EXECUTABLE`、现有 publisher 凭据、已回读注册的 `SECOND_LANGUAGE_SCROLL_BASE_DIGEST`。字体、Chrome、Playwright、Python 均复用现有运行时；不得把依赖/临时数据退回 C。

本地未颁发工艺样品：`node scripts/scroll-worker.mjs --specimen YYYY-MM-DD [--directory D:/...]`。`--art-file` 只接受同目录实际 Codex 执行证据齐全的已有方案，不将人工 JSON 冒称模型完成。样品不请求生产 API、不创建通过记录、不进入正式目录。

检查点持有已成功模型输出/图像 CAS 引用及固定record。重启复用这些原件；已完成模型步骤不重发，已经冻结的候选图/原生包校验后复用。创作/审阅提示只含稳定章节来源、真实通过事件及固定制作证据，不含status/stage/checkpoint/租约等易变控制状态。review不通过时通过publisher的 `/revise` 定向返修，已知结果的运行故障可用本机 `node scripts/scroll-worker.mjs --resume <job-id>` 重新排队，随后正常worker接续。当前用户页面只显示需处理状态及刷新，不虚构页面内“继续制作”按钮。两轮艺术返修仍失败时保留具体缺陷交人工工作室处理，不擅自无限加轮数。未知结果须使用publisher专用 `/recover` 通路找回outputDigest，或提供真实用户单次重试授权的依据；普通resume不能抹掉保护状态。

本地 CLI 的 shell/apps/浏览器/插件关闭，保留内置 code host、看图及所需图像工具；子进程仅传认证所需最小环境，不传发布 token 等业务秘密。不更改用户全局 Codex 配置。模型只提交严格结构数据，不能把 JS、shader、shell、远程 URL 作为艺术方案加载。

每次模型调用保存 requested 配置、真实进程结果、独立 runId、输入/输出摘要及可观察会话信息；实际后端未回显 model 时如实记未暴露。原始会话日志仅留本机排障，不连同凭据/大段工具上下文归档公开。

## 已知边界

两项独立：工程可以保证已成功字节复用、身份/时间不变和服务完整性；艺术审阅仍可能发现需返修的真实问题。有限模型/内置图像服务有账号用量约束，不承诺永远免费或每张必然一次成功。本轮不新购订阅、不恢复纪念币/藏馆、不把技术样品当真实颁发。实体 iPhone 首次解锁、性能和听感仍需真实设备验收记录。
