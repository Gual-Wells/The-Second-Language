# 第二语言后台档位统一

用户2026-10-27要求全部后台自动化ultra、子代理可用max。本轮基准为`17214fa`；此前仅有未提交私有`work/research/`。本任务不触发日课、考试或卷轴制作，不创建新计划任务，也不改个人交互Codex设置。现行要求见[BACKGROUND_AUTOMATION](../protocol/BACKGROUND_AUTOMATION.md)。

## 实际盘点

六个Windows任务中，四类使用Codex：DailyCodex、PracticeCodex、ChapterQuestions（含测试/口答核对/质检）、ScrollProduction。AudioPreparation与PermanentArchive为纯Node，没有可调整的Codex档位。CODEX_HOME/automations未发现本项目的另一个桌面自动化定义，未用新桌面任务替代原Windows安排。

原实际Daily为6.1-sol/max，其余三个实际主模型为6.1-sol/xhigh；主仓Practice/Questions仍写6-sol/high，已对齐真实运行基线再升级档位，不能把整份旧仓脚本拷去回退模型。保持原6.1-sol、服务认证与提供商路线，新主ultra，子默认max并允许按需要降低。没有固定代理数或强制拆分，max默认不是不可覆盖的硬上限。

权威参数：`protocol/background-codex.mjs`供JS消费者使用；PS入口显式使用同样的ultra/agents.enabled/default_subagent_reasoning_effort和multi_agent开关。run-daily仍在本D工作区动态读取daily-prompt，50词、05:00与默认休息不变。日课当前协议、README/OPERATIONS和卷轴当前协议同步，旧研究/作品的真实模型记载不改。

## 权限、资产与恢复

质检只开放多代理推理，原执行工具/浏览器/应用/插件禁用与环境白名单保持。子代理继承主任务隔离，来源与章节仍是待审数据。卷轴普通创作/审阅可委派max子任务；一次image_gen提交单独关闭代理，仍主ultra、仅主执行提交一次，防止复制相同授权生成。

旧卷轴xhigh成品及成功模型尝试保真实证据复用，不能改写为ultra。新默认与原外部调用身份分离，stage/inputDigest/prompt/model均须匹配；已成功但检查点/回包缺失先取原账本结果，calling/outcome_unknown不借新模型摘要重发，旧重试授权不升级成新输入的重试权。创作与审阅可保各自真实xhigh/ultra，仍要求不同runId、原完整质量判断与恢复闭包。无D1迁移。

## 真实本机生效

Daily/Scroll就在当前D工作区。Questions实际在D盘second-language-maintenance，Practice实际仍在旧C盘活动项目，已核realpath并未冒称为D联接。只在原Questions/Practice互斥锁保护下窄改参数与必要shared模块，并在对应AGENTS加现行执行档位说明；保留两目录既有修改、模型、工作账本和凭据。所有恢复副本/回执/测试/新模块在D；旧C只原位替换仍被任务使用的脚本及说明，未热迁或复制整个项目。

同步第一次尝试因Windows File.Replace的跨卷恢复路径失败，已回退此前完成的目标；第二次使用先在D保存原字节、同目录原子覆盖的方式成功，逐文件回执保存before/after SHA和原件位置。没有强杀任务、重启收费调用或用旧备份覆盖后续工作。私有材料在`.cache/background-ultra-20261027/`。

计划任务Action/Trigger/Principal/IgnoreNew与执行时限保持，变更前XML已保存，发布后核对；新进程/新调用使用新配置，在途旧结果沿原身份恢复。

## 验证边界

`check-background-reasoning`7/7：捕获真实两个Questions/Quality调用参数，求值PowerShell实际命令AST，检查6.1-sol/ultra、默认子max、sandbox及windowsHide；执行/密钥隔离仍在。本机CLI 0.164.0-alpha.11.1在空D盘CODEX_HOME严格解析新配置通过，实际模型目录列出ultra与max支持。没有运行真实exec推理或获取业务队列。daily原输入/反馈/休息/冻结检查通过，质量/答疑/7口答专项继续通过。

卷轴`check-scroll-model-upgrade`16/16、`check-scroll-external-status`9/9通过，后者用22份真实迁移与SQLite路由验证publisher/claim/lease/阶段范围；证据兼容检查通过4种xhigh/ultra创作与审阅组合，拒绝high/max主创作及错误模型3种情况，旧证据原字节保留。完整认证生命周期检查通过；其历史夹具补齐真实formal作用域绑定及当前版本后再检查，未放松生产资格。

真实旧样品`.cache/scroll-lossless-candidate-2026-10-23`的24文件/2分卷通过成品包检查，原摘要不变。新background-codex模块进入每件作品的recoverable源码清单；D隔离真ZIP提取20文件后可导入独立contract/policy，复跑恢复不重写原ZIP/manifest。本机无推理features解析验证普通multi_agent=true、单次图像=false。没有重注册共享基座或重制已颁作品。

最终发布和线上控制回读在本轮完成后补记。配置解析不代表账号实际完成过一轮ultra推理，也不证明内容质量改善；没有为了验配置制造付费任务。

官方依据已实际查询并读取：[OpenAI配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[子代理默认及继承规则](https://learn.chatgpt.com/docs/agent-configuration/subagents)。新ultra与多代理可能增加Codex额度消耗和耗时，不增加订阅、不自动购买/充值，OpenRouter语音/TTS等原路线与计费保护保持。
