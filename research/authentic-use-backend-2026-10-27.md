# 单正文真实语境：后端实施与隔离验证

2026-10-27，实际工作区 `D:\CodexStorage\workspaces\second-language-certification-reader`。

本记录只描述后端及相关工具的实际改动和验证。工程测试不是680 USE内容重制、语义认证、正式章发布或用户学习效果验收。未操作真实VIX、休息安排、已停止音频、收费原件或历史成绩。

## 格式与版本边界

新正文以 `FORMAT:usage-context-v1` 起始，匹配 `authoringPolicy:authentic-context-v1`，无空PART或虚假ARTICLE。stage按共享parser验证50主词、完整USE和真实语境索引；来源包须与具体context身份、类型和实际采用URL一致，沿同一章级不可变来源表及OneDrive封存，不新增逐USE数据库。

**旧冻结运行仍可沿其原合同合法完成或修订。** 不以部署时刻封死所有旧格式的新digest；这是保护已冻结输入，不代表旧三部分仍是新日课默认。尚未冻结的新流程由selection的显式制作策略、作者合同、pack同稿核对和实际日课提示词固定新默认。FORMAT与authoringPolicy交叉不一致会拒绝。旧正式正文及来源原件不迁移、不回写。

stage和commit均保留运行/休息/撤回/来源绑定/永久原件门槛；commit增加正文摘要回核。章节读取和问答领取也核对实际正文与固定digest，损坏缓存不作为另一版本交付。

## 已实施的业务适配

- `/api/session` 对已认证读者返回稳定opaque `readerUserId`。当前项目是单用户安装，以固定WebAuthn user handle和APP_ORIGIN派生，独立于会话、登录时间和可替换通行凭据；未认证或安装身份缺失不返回可持久身份。这不是多用户账户实现。
- 音频下一章选配只接受 `[]` 或 `['contexts']`，默认空选配保持。读取旧存选配时明确报告unsupportedSelection，不将two/three转成新授权。已有章节报价按固定正文格式给availableParts并拒绝越界选择。首次发布仍在原事务内一次性消费，只有范围确实适配才入队；重发不消费未来配置。
- 点读、计划、去重和下载清单继续共用同一完整英文句子白名单及声音身份。标题、说明、译文不因嵌入第一部分而获准发音；共享语境不复制收费单位。既有成功声音和未知计费保护未改。
- 答疑继续固定digest整章及完整会话，不新增上下文数据库。新版快捷定位由前端使用WORD/USE/context/sentence身份形成问题；后端不虚构部分名称。
- 理解测试保持20个不同主词、13文字题与7听说题及原认证门槛。`sourceWords`支持单正文；共享语境位于另一主词时，交付真实关联语境而不引入另一主词的释义。出题提示明确整块译文、真实来源/语域及共享边界。
- 质检策略版本为 `chapter-quality-v2-contexts`，同时读旧三部分与新版。新版必检目标包括USE讲解、每条实际context-use绑定、每份整块译文、来源保真、完整语境和全局正文。报告位置含contextId/sentenceId且均指向单正文；旧报告原件不改写。
- 质检领取时固定来源包；本机runner按原run的source-notes及原readRecord恢复实际原文，核对固定readDigest，不联网重造历史原件。原文缺失保留缺证；服务端finalize同样检查实际来源证据存在，不允许模型一律supported把缺原文变成passed。模型仍须实际审语义、裁剪、genre、事实限定及译文，结构验证不代替此判断。
- 复习抽取支持整份context、整块译文和自然共享。WORD/USE/context/sentence重新命名且闭合；只选共享词时可展开词条外的原语境，不导入未选义项。旧、新格式混合计划显式要求分开，避免制造空三部分或丢失语境。

## 实际验证

新增 `scripts/check-usage-context-backend.mjs`：真实隔离SQLite完整迁移，使用模拟Graph传输执行原永久文件代码；50主词、49份语境和一份跨词共享对象。实跑通过：

- stage/commit、来源精确绑定及永久原件回读；格式/制作策略交叉错误和缺context来源拒绝。
- 默认不生成、contexts显式选配、首发事务/重试保护、旧two/three不重新解释为新授权。
- 英文点读白名单在调用供应商之前拒绝说明文本；题目/问答拿到固定版本全文。
- 20主词/7口答抽样；共享context取证且不导入相邻词定义。
- context-use及整块译文质检目标；实际runner在故意缺原文的隔离条件下返回needs_evidence，未用机械全通过认证语义。
- 新版复习的本地展开、共享去重、身份重映射；跨会话稳定读者身份及安装隔离。

另已实跑通过：`check-current-affairs-backend.mjs`、`check-default-controls.mjs`、`check-audio-config.mjs`、`check-chapter-quality.mjs`、`check-chapter-tests.mjs`、`check-chapter-test-oral.mjs`、`check-chapter-questions.mjs`、`check-point-audio-validation.mjs`（2742项）。其中已过时的最小答疑/试卷/声音fixture补齐真实迁移与正式来源资格，未为让测试通过放宽生产资格。

上述测试均为隔离数据、无真实付费调用；15个相关实现/合同文件通过Node语法检查。无新增迁移、订阅或服务。正常Codex工程会话本身的模型用量不在此声称为零。

## 发布与保留范围

本子任务未独立部署或发布内容；由主任务统一集成前后端、协议及作者工具后部署。正式 `chapters/2026-10-24/chapter.md` SHA256仍为 `4cc6a2f9edee37555418c365c1da29033b43c1f6854a3ac2dddf2aa9e03f7a78`；章节及数据库迁移目录无本次内容改写。

隔离fixture只验证工程链路。真实新章仍需实际完整双教材阅读、全义与原例去向、候选取优、逐份来源/语篇/译文审阅，不能据这些测试称新章质量已验收。
