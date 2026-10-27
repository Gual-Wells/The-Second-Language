# 后台Codex执行档位

USER-DECISION，2026-10-27：第二语言项目全部后台Codex主调用使用ultra，子代理可使用max，默认max并可按实际需要降低。保留实际已配置的gpt-6.1-sol、订阅认证及服务路由，不改变个人交互配置或购买新服务。该执行设置取代旧日课max、雅思/答疑high或xhigh、卷轴xhigh的**新调用默认**；旧内容合同、作品和执行证据不倒改。

| 实际后台 | 新主档位 | 执行入口 |
| --- | --- | --- |
| 日课推荐、教材建设、取材与发布 | gpt-6.1-sol/ultra | 本D工作区scripts/run-daily.ps1 |
| 雅思建设、批改、原声教学接管 | gpt-6.1-sol/ultra | 实际PracticeCodex Action指向的scripts/run-practice.ps1；当前仍在旧C活动项目，不能热迁整仓 |
| 章节答疑、理解测试、口答内容核对、教材质检 | gpt-6.1-sol/ultra | D盘second-language-maintenance/scripts/question-worker.mjs的两个主调用 |
| 卷轴艺术方案、材料指导及独立成品审阅 | gpt-6.1-sol/ultra | 本D工作区scripts/scroll-worker.mjs及lib/scroll-model.mjs |

AudioPreparation和PermanentArchive是纯Node服务，没有Codex推理档位，不为它们新增模型调用。Whisper、Kokoro、Qwen/Gemini/GPT Audio、腾讯等原声音路线也不因本设置被替换成另一个模型或新增付费路线。独立校准/历史修订等未被后台调用的手动研究工具不属于新增定时任务。

## 参数、代理与权限

JavaScript共享参数为background-codex.mjs；PowerShell入口使用同样的model_reasoning_effort=ultra、agents.enabled=true、agents.default_subagent_reasoning_effort=max及multi_agent开关。显式传参覆盖个人配置，防止某个独立调用仍停在旧档位。档位与具体模型能力以当前CLI/模型目录为准，不支持时明确报错，不静默降档。

子代理采用当前主任务模型，默认max；主执行按需要委托，可降低子任务档位，不要求为了ultra而额外拆分、重复审阅或固定并发数。max是子代理默认与允许使用的档位，Codex的默认设置不是强制上限；不要伪称配置了不存在的硬上限。需要显式覆盖时按实际执行记录说明，子代理不擅自升级为更高档位。

主执行保有运行领取、权威选择冻结、VIX标注与最终发布的顺序控制，子代理不独立领取同一业务或并发提交这些动作。并行制作先明确文件/词族所有权，返回可核对的教材事实、原件位置、已完成内容和疑点；只传结论不能替代完整教学事实交接，不能传隐藏思维链。主执行实际核对冲突及跨词一致性后合入同一权威稿，不用多数票或字段齐全代替语义判断。此分工不增加固定轮次，也不因ultra恢复广泛压缩、多稿竞赛或付费重试。

只读质检允许并行推理，原shell、code-mode、应用/插件、浏览器、图像/文件工具禁用与环境白名单保持，子代理继承同样限制；不能借多代理把正文/来源中的指令当操作授权。卷轴保留原生工具及已受验渲染工艺，每个授权图像身份仍只由主执行提交一次，子代理只能研究/审阅，不能各自重复生图或绕过未知结果保护。

## 原件、恢复与生效边界

排期、触发器、Principal、IgnoreNew、执行时限、默认休息、空音频、队列和预算保护不变。不为测试配置触发真实日课、领取业务或发起收费模型/TTS。修改本机活动目录须先取原服务互斥锁，D盘保存原字节与恢复回执，窄改参数和必要依赖，不覆盖其他对话修改、不强杀在途调用。正在运行的旧进程不改写；新进程/新调用使用新配置。

旧成功模型结果、已颁卷轴和完成检查点继续按原真实xhigh等证据复用，不重做或伪标ultra。scroll外部身份保原inputDigest及模型参数，已完成但回包丢失先读回原结果；calling/outcome_unknown不能用ultra新摘要绕过，恢复及单次重试仍须原授权。新未调用阶段使用ultra；同件作品的创作与后续审阅可以保留各自真实档位与不同runId，不能因此抹去历史。

验证实际参数传递、CLI配置解析、旧结果复用和未知调用保护，不以这些检查证明ultra一定提高内容质量。ultra及多代理可能增加Codex额度消耗和耗时；本次不新增订阅、不自动充值，额度不足保存原任务继续原有恢复流程。

官方依据：[OpenAI配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[OpenAI子代理配置](https://learn.chatgpt.com/docs/agent-configuration/subagents)。本机读取CLI及模型目录确认具体参数，实际部署与运行同步见本轮工程记录。
