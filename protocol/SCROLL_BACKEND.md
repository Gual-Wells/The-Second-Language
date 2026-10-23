# 正式章节认证与卷轴服务契约

2026-10-23。本文描述 `worker/src/chapter-certifications.js`、`scrolls.js` 的实际接口；创作审美及制材以 CHARTER、SCROLL_CRAFT 为准。主库迁移为 `worker/migrations/0017_chapter_certifications.sql`，不是练习库迁移。

## 认证权威与生命周期

只有迁移后由已登录本人新申请的正式章节测试可认证。旧答卷不补认证；发布者验证测试、临时页及旧策略均不能认证。最终完整20题、7道口答均明确、全部正确后，将最终成绩写入和首次通过事件放在同一 D1 事务。事件唯一键是稳定主体与章节身份，章节修订和无限重测不产生第二份认证。通过事件不可更新或删除；绑定当次章节版本、试卷、成绩摘要、答卷身份、协议、姓名快照及服务器最终核定的毫秒时间。

测试原有不可改写成绩内容保持原字节；认证作为独立顶层对象返回，不重写已有 `result.certification:null` 原件。`GET /api/chapter-tests/capabilities` 的 `certification:true` 表示支持该服务，不表示任一答卷已经通过；`coin:false` 保持。

通过不自动发起持续收费制作。本人显式申请后同一认证只产生一份任务；任意申请UUID重试或不同UUID并发都复用它。制作失败不撤销认证。完整封存并通过独立审阅后才 `ready`；领取后才进入收藏列表，并在阅览副本显示 `issued`。首过、制作、就绪发布、领取是四个不同时间，不改冻结纸面或内容身份。

## 本人接口

所有接口须已登录；写入须同源。身份来自现有单用户 Passkey 会话，不能从请求正文选择任意收件人。

| 接口 | 请求 / 返回 |
| --- | --- |
| GET `/api/certifications?chapter=ID` | `{certification,scroll}`，无事件为null。认证含 `id,recipientId,recipientName,chapterId,chapterDigest,chapterNumber,chapterTitle,attemptId,assessmentVersion,paperDigest,resultDigest,passedAt`；日期RFC3339 UTC毫秒。 |
| POST `/api/scrolls/request` | `{id:UUID,certificationId:UUID}`；返回 `{ok,reused,scroll}`。本人显式制作申请，不消费其他章节资格。 |
| GET `/api/scrolls` | `{items}`，仅完整且已领取的章节作品；项目特别纪念仍由独立固定入口承载，不伪造测试事件。 |
| GET `/api/scrolls/JOB` | 任务状态、固定认证及完成后的 `manifest`；未完成的manifest为null。 |
| POST `/api/scrolls/JOB/claim` | 空对象；完整原件才能领取，多次领取幂等。 |
| GET/HEAD `/api/scrolls/JOB/assets/SHA256` | 只有已领取作品或发布者可读；必须属于该件清单。OneDrive凭据/签名地址不外泄。 |

任务视图包含 `id,certificationId,status,stage,createdAt,updatedAt,readyAt,claimedAt,contentSHA,error`。状态是 `pending/running/attention/failed/ready`。目录只显示章号的产品要求由前端实现，接口仍保留阅览所需身份。

## 发布者任务接口

独立 `/api/scrolls/jobs` 通路，不混进旧答疑模型。`claim` 是调用者随机64hex令牌，服务器只保存其SHA256。租约5分钟；执行器定时heartbeat。每次状态写入重新比较租约，过期执行器不能覆盖新结果。

| POST 路径 | 正文与行为 |
| --- | --- |
| `/api/scrolls/jobs/claim` | `{claim}`；最早pending原子领取。返回完整固定章节、认证、当前阶段、最近有效检查点及 `gpt-6.1-sol/xhigh` 专用要求。 |
| `/api/scrolls/jobs/JOB/heartbeat` | `{claim}`；有效租约续5分钟。 |
| `/api/scrolls/jobs/JOB/checkpoint` | `{claim,stage,digest}`；digest指永久JSON `{jobId,certificationId,stage,...}`；只可留本阶段或前进一阶段。 |
| `/api/scrolls/jobs/JOB/revise` | `{claim,stage,digest}`；review/archive可有依据地回art/materials/layout。检查点须 `reason,failedReviewDigest`，真实退稿原件须 `approved:false`。 |
| `/api/scrolls/jobs/JOB/external` | `{claim,stage,inputDigest,action:'begin'|'resolve'|'unknown',outputDigest?,providerId?}`；调用前存calling，同阶段最多一个未明确调用；已有成功结果直接复用。 |
| `/api/scrolls/jobs/JOB/fail` | `{claim,error,attention?}`；保留阶段和检查点；存在calling会转unknown/attention。 |
| `/api/scrolls/jobs/JOB/recover` | attention中的 `{stage,inputDigest,action:'found',outputDigest,providerId?}` 找回原件；或 `action:'authorize-retry'/'failed',evidenceDigest`。依据JSON绑定job/stage/input，类型为`explicit-user-retry`或`definitive-provider-failure`并有reason。这是人工授权/服务端证据入口，不能自动编造用户同意。 |
| `/api/scrolls/jobs/JOB/resume` | 空对象；只恢复failed/attention且没有calling/unknown的任务，不新建任务或付费重发。 |
| `/api/scrolls/jobs/JOB/verify` | `{claim,manifestDigest,offset,limit:1或2}`；archive期间分批回读永久文件，核SHA/长度/PNG尺寸，记录绑定此清单的紧凑核验结果。 |
| `/api/scrolls/jobs/JOB/complete` | `{claim,manifestDigest}`；所有包件核验、真实身份、内容摘要、创作/独立审阅绑定及恢复闭包均通过后原子ready。相同完成请求幂等，异内容拒绝覆盖。 |

阶段：`source → art → materials → layout → review → archive → complete`。租约过期无外部调用时回pending，从检查点续作；有calling时先转unknown/attention。不能换请求ID、提示词或阶段绕过未知计费保护。

## 封存包与恢复基座

封装为 `second-language.scroll-package.v1`：认证/章节/收件人/通过时间、`contentSHA,candidateDigest,reviewDigest,files,recovery,viewer`。文件是 `{path,digest,mime,bytes,role}`，内容寻址，每对象≤24MiB。展示数据不得包含脚本或远程执行地址。六张PNG图层为 `front/back/ink/relief/sealInk/sealMask`，运行器按固定 `scroll-v42` profile 加载；图层字节、尺寸与清单一致。原生工程脚本保留在恢复归档，不能作为可执行作品数据加载。

内容摘要算法是 `protocol/scroll-production-contract.mjs` 的版本化递归排序JSON，不称通用JCS。内容身份文件role=`content-identity`必须与真实record重算一致；艺术方案copy和实际阅览copy一致。候选schema=`second-language.scroll-candidate.v1`绑定同一contentSHA、认证和完整files；review不加入候选files以免自引用。

review schema=`second-language.scroll-review.v1`，绑定精确candidateDigest和contentSHA；独立creator/reviewer runId不同，均记录规定模型档位、七项艺术/工程判断、实际成品证据及结论。模型metadata是执行记录声明，不是模型真实性的密码学证明；结构测试也不冒充审美通过。

`recovery:{baseManifestDigest,workArchiveDigest}`：共享base只存一次；新作品采用普通、可独立解压的ZIP分卷，每卷≤20MiB（生产者按18MiB原件量预分组）；各卷均在files中且role=`archive`。`workArchiveDigest`指向role=`work-recovery`的JSON索引，schema=`second-language.scroll-work-recovery.v1`，其中`volumes:[{path,digest,bytes,entries:[{path,digest,bytes}]}]`记录各卷和原件。服务逐卷校验真实ZIP目录、安全路径与成员长度，完整成员并集必须覆盖候选原件及恢复文档/制作源码，不删原件或重新生成以骗小；单个原件大于当前安全卷限时保留并进入attention。已存在的≤24MiB单ZIP包仍按原契约兼容，不重写已冻结作品。base schema=`second-language.scroll-base-recovery.v1`，files逐对象记path/digest/bytes；原生大文件按既有恢复格式分块。发布者调用 `/api/scrolls/bases/verify {manifestDigest,offset,limit:1..4}` 逐批真实回读，再 `/api/scrolls/bases/register {manifestDigest}`。未全部核验不能注册；作品ready必须引用已注册基座，并再次取回其清单。分批避免把大包核验堆在单次Worker免费子请求上限内。

复用 `permanentBucket` 的OneDrive校验上传和私有读取，不将大图、源工程或完整清单塞D1/KV。D1只存认证、状态、指针和少量核验索引。内容寻址和回读可检错，OneDrive不是不可删除WORM；外部删除仍会明确报原件故障，不能据此重新收费生成。

## 直接核对

`node scripts/check-certification-lifecycle.mjs` 使用独立真实SQLite，验证最终评分事务回滚、并发首次通过、旧结果/临时/验证隔离、无限重测/修订唯一、申请/领取幂等、租约/阶段续作、未知计费与单次授权、基座/包件回读及私有文件权限。它不会生成真实通过记录、联网调用模型或代替iPhone与艺术验收。

`node scripts/check-certification-produced-package.mjs <真实制作目录>`只读核验实际producer输出字节、PNG、内容身份、候选/审阅及恢复闭包。未颁发样品仅在该Node校验器中显式采用specimen作用域；HTTP路由没有此开关，不因此创建通过事件、领取或正式目录。
