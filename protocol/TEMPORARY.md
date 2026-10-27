# 临时页运行协议

临时页与每日50主词课程是独立发布流。Codex 可在定时运行中响应阅读器的一次性需求，也可被单独唤醒，直接推送已有测试文档或制作复习页。**测试临时页不得修改生产数据：不占日历日期、不写正式章节或 `daily_runs`、不领取日课运行、不改变 VIX 辅助索引及 YY-MM-DD 真实日期标签、不重新查询教材或创作正式课程。** 只在临时页存储和临时通知队列内增删，并在发布前后回读核对正式章节数量与 VIX 仓库状态。每页从服务端发布时刻起存活 48 小时；过期即时拒绝读取，后台清理正文、索引与待发通知。阅读器不离线缓存临时正文。

## 领取需求

定时任务先按 `DAILY_RUN.md` 领取当天控制状态。若 `rest=true`，此次不执行任何推送，临时需求继续保留。否则读取 `temporaryRequest.id/text`，结合学习目标和已发布章节判断应走测试还是复习路径。把理解与选择写到 `work/runs/<date>/temporary/` 或独立的 `work/temporary/<id>/`；已有同 ID 产物则续作。发布时传原需求 `requestId`，后端仅在 ID 仍匹配时将需求开关与文本清空；若读者后来改写了需求，新需求不会被误清除。无需需求也可由 Codex 独立发布测试页。

## 路径 A：直接推送已有测试文档

确认要推送的文档确为现有完整正文，并符合其固定格式的ANNOTATIONS：新单正文使用完整语境及整块译文，旧三部分保留原例/原句及逐句译文。不能在一页混装或伪造配对数据。用 `node scripts/publish-temporary.mjs --file=<已有文档.md> --kind=test --id=<唯一编号> --title=<标题>` 发布；如响应阅读器需求，再加 `--request-id=<领取时的ID>`。已有测试文档的词量可沿用原文件，且只进入临时页；新正式日课始终恰有50主词。

## 路径 B：从已发布章节制作复习页

根据需求和学习反馈选择 **1–40 个**要复习的词，按词汇顺序排列。来源只取已发布正式作用域的固定版本。新单正文完整复制所选词条的释义、语境、完整英文和整块译文，不拆去无USE的必要承接句；自然共享语境只定义一次并就地引用。只移除未选词的内部映射，不改来源文义。不同章节以digest隔离后重分配WORD/USE/CONTEXT/SENTENCE，保持配对。旧三部分页继续原样提取该词第一、二部分及直接对应的第三部分原句与原译，不改写、不补造；新旧格式不能混为一页。

在 `work/temporary/<id>/plan.json` 写下 `id`、`title`、`subtitle`、可选 `requestId`、`entries`。每个entry写word、chapterId；旧格式还须从原件复制thirdSentences数组。`node scripts/build-review.mjs work/temporary/<id>/plan.json` 从线上读取固定原件，按实际格式确定性抽取与重映射，生成page.md/page.json。新格式使用scripts/lib/context-review.mjs，不要求或伪造thirdSentences。Codex复核所选词条完整、语境未截断且译文对应后，运行 `node scripts/publish-temporary.mjs --page=work/temporary/<id>/page.json`。

## 路径 C：验证章节理解生题质量

需要评判真实出题协议时，使用正式 `CHAPTER_TESTS.md`、`chapter-test-contract.mjs` 与 `chapter-test-prompt.mjs` 的同一出题、音频核验及内容判分链路：二十个不同主词，十三道文字、七道零题文听说。不要以演示题库、人工简化样题或三部分讲义代替。本次材料仅取指定已发布章节的固定版本；不重新选日课词、不修改教材或 VIX。

`node scripts/publish-temporary-test.mjs --chapter=YYYY-MM-DD --id=<UUID> --title=<标题>` 创建一次申请。保存输出的编号和到期时间；同编号重发幂等。现有后台队列领取，`node scripts/question-worker.mjs --tests-only` 可用于运维单独处理。就绪后回读题数、七条题音、后台结构与章节逐字依据，再提供 `https://the-second-language.pages.dev/?temporary=<UUID>`；入口位于原临时页书架，使用原测试窗口。回答与提交同样可用，但成绩不进入正式章节测试目录，不授予认证。此路径不消费设置中的临时讲义需求，也不自动发额外通知。

独立 `temporary_chapter_tests`、`temporary_chapter_test_recordings`、`temporary_chapter_test_reviews`、`temporary_test_pages` 表保存紧凑状态；试卷、答卷、原声和取证写入 `temporary/test/<UUID>/` KV，统一在发布后 48 小时到期。所有读取、上传、处理回调在到期后立即拒绝；清理只删除该临时作用域，不修改正式试卷或章节。手机草稿携带同一到期时间，打开或页面恢复时清除已过期草稿；本机工作文件在 `work/temporary/<UUID>`，不进入永久工作归档。

收费 Bella 题音继续使用全局永久内容索引，与临时数据生命周期区分：能复用就复用，成功原件不删除或重复合成，未知计费不自动重试。48 小时页到期不删除已付费声音。旧缓存客户端不列出新型测试；新客户端声明 `x-temporary-test-policy`，防止把测试元数据当三部分正文渲染。

## 发布确认

用发布命令输出的临时页ID在PWA临时页书架回读实际格式的完整内容，确认文字、译文显隐、排列、48小时到期时间与通知入口。临时页发布同样等待正文KV传播后再发系统通知。复习原章可继续正常按日期阅读；临时页到期后只能重新从正式章节提取并另发新页。
替换测试稿时，先用 `node scripts/delete-temporary.mjs <旧ID>` 删除旧页，再发布新页；核对旧页不可读、新页可读，且正式章节与 VIX 标注保持原状。

## 任务末尾额度更新

执行本协议所涉及的日课、推送、练习建设、批改、声音分析或测试工作时，最后按 `BALANCES.md` 查询各方额度，携带核对时间、核实/估算状态与用户完整学习流程的用量范围，发布更新到余额页；各方仅在不足三次最大消耗任务的预留时提醒。页面显示上一次任务的记录，浏览时不实时查询。不自动付款，不安排余额不足后的跨日轮询/重试；已有材料与未知计费保护继续有效。
