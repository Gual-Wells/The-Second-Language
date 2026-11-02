# 第二语言的 DIGR 原生对接

本层服务于项目的研究与正式出版：在可承受用量下提高全义教学、双教材融合、真实语境、整块译文和阅读成品质量。原生模型继续决定取材、写法、验证、分解和返工；80%真实语境是研究目标，结构通过、来源数量和DIGR完成均不自动证明语义正确或学习效果。

## 权威边界

- DIGR 执行语义仅来自本轮实时取得的 `Gual-Wells/Deep-Iteration-GPT-Runtime:stable` 所固定的 SHA。项目不复制其参数补全、时钟、N/S/R/D/L、状态机、停止或 proof 规则，不设本地固定轮数／时长表。
- `scripts/lib/digr-transport.mjs` 只负责真实 GitHub API 获取、ref/branch 一致性、同 SHA 传输及 Git 字节校验。现有运行不会因 stable 或项目协议后来改变而换权威。
- `scripts/digr-native-session.py` 导入同 SHA 的原生 `LiveDIGRRun`、原生仓库传输器及原生工作区。原生运行对象 `run` 直接交给模型使用；项目 helper 只绑定领域原件与现有发布预检。
- 项目内容合同另行保留：固定 selection、VIX 输入／回执、原 protocolCommit 及显式 authoringRevision 不随 DIGR 版本转换。快照是可追索输入，不能冒充本轮新审阅或授权。

## 使用入口

日课启动器先正常领取control，rest=true在模型和DIGR运行前返回。新制作按FIVE_TASK_PIPELINE生成规划、五组制作和总装各自的项目任务packet，再调用同一个prepareDigrProject；plan及完整交接可作为额外不可变领域输入。每个以精确 `DIGR：` 开头的独立任务仍须取得自己的真实pin/原生运行，不合并多个时钟或证明。旧已写稿、旧合同及临时需求仍通过 `node scripts/digr-project.mjs daily DATE` 生成原生产任务；不放行休息、不消费声音选配、不改变high默认。

主动研究或修订，将用户实际任务保存为UTF-8文件，然后：

```sh
node scripts/digr-project.mjs prepare --kind research --date 2026-10-24 --task-file TASK.txt
node scripts/digr-project.mjs inspect PACKET.json
node scripts/digr-project.mjs acquire PACKET.json
python -X utf8 -u -i scripts/digr-native-session.py --packet PACKET.json --acquisition ACQUISITION.json
```

`revision`也可作为kind，用来定位已有章的固定合同；kind本身不产生重编／重选／发布授权。工具不调用模型、VIX写入、云端claim、stage、commit或TTS。

准备材料默认位于本项目 `work/digr/<id>/`，实存D盘并被Git忽略。acquire必须在每次新DIGR调用中真实执行；旧缓存只可承载同SHA字节，不可充当stable当前HEAD。宿主返回的acquisition绑定任务消息和packet摘要。

保持同一个 `python -i` 工具会话。宿主先由固定仓库解释调用表面、创建原生Run Genesis，再用原生 `load_execution_protocol_for_run` 加载同SHA执行协议；失败由原生运行记录为ABORTED。它返回 `protocol_text_path`，模型必须完整读取，然后依原协议完成参数/U0/合同与后续工作。宿主不会代填参数或生成“已完成”事件。

## 项目对象如何接入

| 项目原件或判断 | 对接职责 |
| --- | --- |
| 用户任务、日期、当前章、被冻结的selection与VIX、明确修订基线 | packet提供身份与实际定位；`project.verify_inputs()`拒绝固定输入漂移。候选、策略和待解决问题可以演进。 |
| 双教材、派生条目、源段、原HTML／readRecord、候选取舍 | 原件沿既有材料与证据库；由模型选择实际研究方向，再使用DIGR原生SourceWorkspace和source receipts。S不是URL数、词数或教材条目数。 |
| 融合解释、快释、真实场景、整块译文、研究对照、协议／代码候选 | `project.capture_candidate(run, summary, paths, evidence_refs=...)`保存真实文件的不可变快照，并交原生CandidateStore；不只保留一个会被后续覆盖的路径。 |
| 实际查验依据 | `project.capture_evidence(run, id, relative_path, summary, source_scope)`封存明确的项目原件并加入原生EvidenceIndex；保存字节不代表模型已经读懂或采用条件满足。 |
| 词义、语法条件、真实用途、改编保真、译文对应、全章阅读体验 | 由模型按CONTENT／QUALITY_WORKFLOW实际审阅。需要重新研究时可修改策略和候选；项目helper不判语义、不自动增加N/R/S次数。 |
| 出版前完整证据与本版审阅 | `project.publication_preflight()`调用现有完整验证器，返回明确的local scope；不是线上发布回执。 |
| VIX／正式发布／声音等有副作用操作 | 模型依据真实用户授权沿已有脚本执行。DIGR完成不能替代PUBLICATION_REVIEW、独立验证器签名、兼容阅读器、永久GET/SHA回读或当前版本检查。 |

有内容候选后，原生R应实际挑战选材、融合、事实条件、译文或生产方法；不能仅通读报告。发现不足时返工相应原件，更新候选与影响范围，保留前版。真实语境须同时报告独立context及USE覆盖，保留教材例句回退的具体原因，不能改kind、删难义、拉长文本或增添冗余附例冲比例。

新日课启动时尚未出现的VIX／selection／标注回执，在依原协议实际形成后调用`project.seal_inputs(run)`追加身份绑定；候选快照也会执行该完整性检查。后续绑定只能增加已形成的原件，不能替换旧摘要；每份输入seal另存不可变快照。新输入的形成不自动产生DIGR进化／审阅计数，项目恢复仍以原件与原流程为准。

## 恢复与成本

项目材料恢复与DIGR运行恢复是两个身份：前者继续固定教材、selection、审阅、成功资产与unknown记录；后者必须由原生 `LiveDIGRRun.resume` 验工作区和时钟连续性。`--resume WORKSPACE`必须使用原packet、原acquisition及原SHA，先核项目绑定再交原生恢复。

原生5.0当前clock_probe在Windows没有boot_id；同一持久Python进程可核时，跨进程resume将诚实拒绝。不要伪造boot_id、复制session_id、把停机时间算成工作或把新运行接成原证明。若进程丢失，保存原运行证据，在新的有效DIGR调用下恢复项目成果；旧运行不冒称完整完成。这一宿主限制不影响项目已有内容／收费恢复。

默认high、现有免费／付费路由及unknown保护保持；需要提档或额外大规模调用时依据用户范围、证据和成本判断。没有固定“再审几轮”或自动模型竞赛。源读取失败与模型语义缺陷分别记录。日课休息、空音频、未授权旧章和独立答疑／雅思／认证生命周期保持。

## 验证与交付

固定身份、路径隔离、rest早退、GitHub pin、原生加载顺序、候选快照、原生重入／恢复失败和现有出版预检分别验证。夹具运行不冒充真实课程生产，适配测试通过也不代表已提高80%覆盖或证明high质量。

给用户展示实际内容变化、判断依据、未决问题、真实用量和发布状态；DIGR proof只由原生运行渲染。开发日志与框架schema留在后台，不进入学习正文。
