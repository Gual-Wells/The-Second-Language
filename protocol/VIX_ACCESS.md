# VIX 的允许范围

2026-11-03 用户明确限定：VIX 是弃置项目，仅复用通用英语词辅助索引。第二语言的择词、学习关系、教材研究和发布流程属于本项目，不调用 VIX 的其他产品能力。

唯一可读取的 VIX 内容为 `data/seed-access/` 的 manifest、structure、records、mark-hash、真实日期文件和该索引说明。只用未标注的 General-English word 身份；不读取 Seed 原件、多表成员关系、关系数据、其他领域、短语/搭配区、应用或旧生成器。manifest 内的来源路径仅保留为不可变来源标识，不跟随读取。owner 只是唯一导航归属，原多表成员关系在本范围不可得，不能用 owner 冒充完整成员关系或推断个人难度。

`prepare-vix` 新输入固定 `vixAccessPolicy:auxiliary-index-only-v1`，只获取该子树；旧锁保留原字节和原清单，但范围外项目不读取、不下载。`vix-candidates` 仅从索引内导航和记录输出全部未标注候选，不按等级过滤、不重建关系图。

原时点的学习日期标注授权不变：先 prepare-vix-marking 建立独立副本，再 mark-vix、publish-vix。本项目的 marks-only 客户端只更新日期及其派生标注；词身份、顺序、导航、scope 和来源绑定不可变。原输入不能写入，旧日期不能删除或重置，不执行 VIX 的 tools/build-seed-access。日期写入后中断可从同一日期原件恢复派生标注；正式提交前完整核对索引内部摘要与一致性，继续使用原提交/回执保护。

本限制不授权改动旧输入锁、历史稿或发布回执。独立教材资料的来源授权、封存与摘要沿本项目教材协议执行，不把词库索引当教材。
