# 新正式日课：实事协同工程与部署

日期：2026-10-23（Asia/Shanghai）。用户从来源研究转为授权实际建设，随后明确：旧章内容封存、不纳正式项目、不做兼容迁移；新章从第1章重新编号。

## 实际工程

- 新章的现行链路：领取/休息→不可变VIX输入→按需发现及实际读取现实材料→Codex与VIX双向判断最终40词→原时点标注主词及实际纳入词族→双教材全义三部分→事实/语义审阅→独立来源包→永久封存→发布回读。
- 331源继续作为大范围选择池。首批六个官方feed经过真实GET和条件请求验证；默认Yle、NASA、Environment Agency及Statistics Canada四源。不是限定题材或只从这四源推荐，完整池仍可按需网页/PDF阅读；不全池每日爬取。
- RSS/Atom只提供标题、URL与原时标，不存feed正文或自动生成事实。原文GET复用成熟xml-js/lxml；live web/PDF实际读件可以明确方法/evidenceRef/readScope导入。所有研究原件在D盘忽略目录，自动元数据提取不能证明已理解正文。
- 更新日不冒充发表日；观察期、事件/执行时刻与读时分开。发现过EA的2020页面今日更新、CNRS页面日期与feed日期不同、UKRI GUID含非文章域名，工具保留这些边界。
- 标注采用prepare-vix-marking建立的独立工作副本，绑定selection摘要，mark/publish共用且续作不覆写；原输入保持只读，标注commit另记meta/回执。check-vix-marking真实执行fixture标注与构建，确认原输入字节不变、重跑保留未提交标注、不同选词拒绝复用。
- prepare-vix下载前固定完整输入清单；中断后只修复原commit/blob，完整缓存可离线核验，已有选词不刷新main。实际定时入口使用gpt-6.1-sol/xhigh及live search，保留领取休息先行。

## 内容与身份边界

全义、真实词族、原例句、词源、当章逐义真用、逐句连续译文均保留。多义量、跨主题、标注数大于40不构成缺陷或候选降权依据；没有新增固定新闻数、地区配比、体裁、篇幅或用法配额。sourcePolicy独立于contentPolicy，不绕过词源/融合教学检查。

pack-current-affairs将自写事实与边界绑定实际读件、原VIX输入、规范选词摘要及最终正文SHA；pack-chapter还比较正文40主词与冻结selection。正文SHA定义不变，来源另有SHA。包与回执存work/runs，复用现有工作归档；公开章节不包含新闻全文。

服务端使用现有permanentBucket先put/readback来源与正文，再写chapter_sources小引用。相同正文的来源绑定不可变，commit必须能核对来源原件。来源独立GET，不混入正文三部分。第三部分末尾“现实参考”沿原生蓝银sheet，真实点击才加载，外链安全文本，日期未知不补造。

旧章不回填、不改写、不撤VIX标记、不造新成绩。默认正式目录/章号只计新策略；publisher显式archive=1保留原件读取。旧章关联的未完答疑/质检/测试/雅思/音频/章卷队列不再新领取或新产结果，原行与已付费资产保留。雅思题型、计分与制作要求不改，新申请仅取新正式章；已授权物理归档与紧凑索引继续。项目特殊纪念卷轴保持，艺术设计、纸面、工艺、声音、原件SHA均不改。

静态部署清单只更新app.js/index.html/styles.css三个共享阅读器壳文件的字节数和摘要，其余86个已冻结显示文件逐一校验不变；没有重制卷轴资产。壳v45，章节缓存v2清除旧v1目录/正文缓存，避免断网继续展示旧正式目录。

## 验证证据

以下均实际执行；fixture不使用旧章改造成正式新章，不发真实付费模型/音频请求：

- check-current-affairs-reader：官方host/重定向、D盘目录边界、XML、UTF-8、条件304、断网、GET与外部读件、不可变修订/并发、新章续作及旧章拒绝。
- check-current-affairs-package：实际读件摘要/时刻、冻结VIX、选择/正文变化、正文40主词不一致、休息与封存守门、恢复副本。
- check-current-affairs-backend：真实内存SQLite迁移与Worker路由、隔离Graph存储回读，来源不可变绑定、新章从1编号、旧行保留、旧队列停产、练习来源所有权、新版固定来源续作及首次认证/章卷资格。
- check-daily-affairs：输入HEAD变化、下载中断/修复、离线续作、选词冻结、Windows PowerShell AST及真实启动提示词。
- check-chapter-sources-ui：自写40词fixture，402×874及缩短视口，21项通过，0 JS错误、0真实API/付费调用；已目视检查正文、来源窗口、登录、空目录、索引、章节册和设置。
- 331来源池校验、修改JS语法及git diff --check通过。

真实网络取材：六源最初共141条纯元数据，默认四源实跑111条；再次选Yle+NASA实跑两次GET取得30条候选。NASA实际HTML文章读取2176字符，核对为10/22发布的未来10/26–28活动邀请，不写成已举办事件。原件离线复用保持readAt/digest。另用真实NASA web工具原文短摘录验证external import，明确标为通路测试、非日课来源/非全文，不生成正式课程或VIX标注。

## 发布与实际任务

主库0018_current_affairs.sql与PRACTICE_DB的0009_current_affairs_scope.sql已实际远端应用成功，无旧行回填或删除。

发布前实际目录为12章；已留全部ID/摘要基线并抽查原文SHA。API Worker、v45 Pages及真实DailyCodex入口的发布/切换完成情况与线上回读见本文件末尾追加的最终记录。上线不等于生成了第1章：正式新章仍由完整日课流程制作，不能把测试fixture、取材记录或旧章冒充正式新章。

## 成本与恢复

没有新增订阅、付费模型API、新闻账户或常驻爬虫，复用现有Node/Python与永久存储。取材和较深入的Codex判断会消耗实际网络/模型用量，未实跑完整新章前不报单章价或学习效果保证。sourcePackage最多256KiB是轻量摘要包的传输保护，不是词义/文章长度限制；D1只保存小引用。

实际任务原来指向maintenance，单改当前仓库无效。activate-affairs-tasks只切Daily的未来Action，备份原XML并核对Triggers/Principal/Settings不变；不停止在跑的其他进程。永久归档任务已指向本工作区，归档读旧章显式archive=1，仍按正常存储协议执行。工作资料实际在D；旧原件不可用不视作未生成，未知计费保护保持。

HTML正文提取和外部evidenceRef都不是事实证明、阅读证明或加密签名；关键仍是Codex实际读取与逐项语义判断。首次真正新章须再验教学完整性及现实理解收益，不能用工程测试通过宣称其已完成。

官方CLI联网参数依据：[OpenAI Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)与本机codex --help；`--search`启用live search。取材时间与权利观察保存在feeds.json，各来源依具体条件处理，默认不公开复制新闻全文或图片。
