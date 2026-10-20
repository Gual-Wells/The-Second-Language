# 卷藏馆：首轮完整取藏工程

2026-10-21。研究基线`5218a597729952b1960ef4e161a54cad2b5dab04`，开始前干净。用户授权研究、探索与工程并行；本轮实现藏馆、取藏、既有卷轴观赏器适配与声音。只陈列第五章实际制作样品，尚未颁发，未向真实考试/认证/付费生成服务写数据。

## 产品与美术

采用私人旧卷藏室：石拱、窗侧光、深色木作、分格横置卷轴、浅木托与同室观卷案。每柜六格是这份手机构图试样的选择，不是以后不可变的认证规范。章序固定藏位，空位是家具，不冒充已完成奖励。第一章通过目录链接到原艺术样品，没有用第五章伪装为第一章。

取藏次序为柜前 → 连托水平退出柜口 → 第一人称持托镜头移向案面 → 正面近景 → 解扣/开纸 → 收卷/复扣 → 沿原路归位。省略操作者双手是一种影视编排，不是宣称无支承自走或完整物理模拟。柜中代理与近景作品分级显示；纸卷半径来自相同Paperlab卷绕规格，不用一根任意粗圆筒接成另一件器物。

场景资源先查已有平台后选择：Poly Haven旧木/石材PBR与952三角面的木桌，11个源文件约5.33MiB；来源/许可/校验在`web/labs/scroll-museum-v1/assets/scene-sources.json`。木桌是可用扫描家具，经过等比尺寸和落地适配，不冒称中世纪家具考据复原。场馆几何为本项目的木作/建筑适配；不是原生无纹理方块，也不是一张AI房间背景。

静态构件按真实材质合并，绘制调用由初版436降至约43–46（姿态有关）。现阶段是PBR、静态几何合并和按动作更新的缓存阴影，**还不是完整离线光照烘焙**。真实iPhone17的持续负荷与艺术体验仍需验收。

## 模块与接线

| 模块 | 职责 |
| --- | --- |
| `web/labs/scroll-museum-v1/scene.js` | 固定章位、近邻柜段、浅托路径、有限镜头、投影交接与环境资源 |
| `scroll-viewer.js` | 嵌入原v20工艺，准备/暂停/恢复/销毁、原件/释读、指针与渲染中断 |
| `viewer-resources.js` / `viewer-atmosphere.js` | 异步原件归属与取消；原v20同参数/60步预热的可取消封装 |
| `sound.js` | 共用音乐、材质拟音、阶段触发、静音、后台暂停与释放 |
| `app.js` / `index.html` | 馆内→取卷→观赏→归藏状态、目录、细看/中文、声音开关及异常回退 |
| `web/styles.css` | 只加museum作用域，保留原蓝银主壳及其他样品样式 |

旧v20及旧纸膜/机构源文件没有重写。近景使用真实的v14纸面、v17材料路径解扣、v19分层做旧与v20流场。第一轮联调修过：雾画布overscan不匹配、代理alpha边、木托与桌面的间隙、交接尺度跳变、中断后归藏死锁及声音解锁时重复取卷。

交接实际读取`getTransferPose()`和`getClosedScreenPose()`，按中心与宽度等比匹配，再在启卷初段平缓归正；不单靠两层透明淡化掩盖尺寸差。馆内与近景各保留合适照明，原纸面NoToneMapping/保真处理保持。远景扣具仍是简化代理，与完整机构存在细节差，尚不是最终艺术验收。

音频不阻塞取卷；默认音乐/拟音关闭，点击各自启用并记住偏好。馆曲Sperry Lion《Ancient Mysteries》、阅卷曲The Cynic Project《A New Town》，拟音为Kenney官方RPG Audio素材；均有实际许可/原件记录。约3.98MiB运行音频，来源、作者、CC0及转换/摘要在`AUDIO_CREDITS.md`、`assets/audio-sources/manifest.json`和`assets/audio-sources/conversion.json`。使用真实素材，不用振荡器临时搓一套声音。技术解码/播放通过不等于人工听审，曲目仍可随视觉试听迭代；不能说已经用户认可。

## 不改几何的下载减重

`scripts/derive-museum-keeper.mjs`仅为本馆派生GLB：将必被v19覆盖的6个内嵌旧扫描替换为有效1px PNG，其余40个bufferView逐段字节一致；保留40个accessor、9个mesh、1个skin、88个node、形态键、UV、材质引用与变换。

- 原件16,144,276字节，SHA `a6084299daf55d9ead8e7905ab973fe6be9ec88a6a7f26914230c1f04e959668`。
- 派生2,437,944字节，SHA `118ad3e48f4a37034551aa7330b033a79a9b4e5711972eb92553774ffb37bffa`。
- 省13,706,332字节，约84.899%。这不是整个场馆压缩率。
- `build-scroll-museum.mjs`只对本馆bundle定点映射URL，并核派生与所需finishing摘要。其他样品继续使用原文件；第一次显示必须等最终材质和预热完成。

`display-manifest.json`保存本次成功取藏流程实际加载的公开展示闭包及字节摘要，约53项/30.6MiB（以实际清单为准），含共用依赖而非每卷都复制。它不是正式收藏数据库清单，也不代替Blend、原图和母带的永久原生归档。

## 验证与边界

`verify-scroll-museum.mjs`在402×874/DPR2 Chromium检查真实样品身份、不写认证、取放、先收卷后归藏、细看/英中、展开中反向、横竖屏、WebGL中断仍可细看/返回、恢复后闭合、派生文件实际加载、声音失败表/阅卷曲/动作事件和最终销毁。证据是同目录截图与`verification.json`；远端复核另存`live-verification.json`。这不是物理iPhone Safari的性能证明。

独立运行器对照还核原v20的纸面数据SHA、闭姿机构顶点SHA与八个阶段完全相同，摘要在`viewer-preservation.json`；模型加载中取消、隐藏预备及上下文恢复另有`.cache/museum-viewer-check`详细记录。销毁统一先释放材质/目标，再renderer，最终释放独占context；普通取藏切换只暂停复用。Three内部缓存计数不是显存实际测量。

真实首次通过、任务租约、制作/审阅工具桥、OneDrive原件封存和私有领取仍按CHARTER的后续接线目标，**本轮没有冒充已经完成这些服务**。没有恢复旧币展厅，没有历史成绩补领，没有新订阅、付费生成或Kaggle任务。当前仍需用户视听反馈；不因技术检查通过就把新场馆/音乐提升为已接受工艺。

## 恢复与发布

```text
node scripts/derive-museum-keeper.mjs --check
node scripts/build-scroll-museum.mjs
node scripts/serve-scroll-lab.mjs
node scripts/verify-scroll-museum.mjs http://127.0.0.1:8149
git add web scripts research/scroll-museum-2026-10-21
node scripts/package-scroll-museum.mjs --index
git add web/labs/scroll-museum-v1/display-manifest.json
```

本机Node与既有Wrangler/esbuild均复用现有安装，临时、视频、日志和发布包真实落D；不安装新依赖。提交前按Git暂存区计算清单，避免Windows换行转换使发布字节与本机不同；已有未归本任务的更改时须缩小上述暂存范围。`deploy-scroll-museum.mjs`从固定HEAD的git archive生成包，逐项核清单后发`scroll-lab`分支；预览沿用该HEAD的Pages网关，不部署独立后台Worker、不更新正式main，避免混入活动维护副本和私人原件。最终不可变URL、核查和额度收尾另记录于本目录。

### 已发布版本

- 展示源码：`8fad7c87f48c0c2a81adc4ca2d5e1aacc9c08be5`，分支`codex/medieval-scroll-lab-2026-10-16`。
- [固定预览](https://ba36f006.the-second-language.pages.dev/labs/scroll-museum-v1/)；`scroll-lab`别名会随下一轮预览变化。
- 发布包内53项展示资源逐项通过字节/SHA核验，共32,059,557字节；共享旧JSON的CRLF→LF差异已按Git发布字节计入。
- `live-verification.json`记录这份固定URL的真实在线完整交互复测：全部检查通过，无页面脚本错误、无请求失败、无认证写入。主站与独立API Worker未更新。
- 本轮没有新增订阅或收费生成调用；曲目和场景使用可复用CC0资产。
- 末尾已实际执行`check-balances.mjs`：本实验副本缺少发布凭据，余额/容量未更新并保留旧记录；永久归档脚本报告已排队，尚未核实完成。不要把该失败解释为余额为零，也不要把Git展示恢复能力当作原生母版已入OneDrive。

### 下一轮工程落点

先收集这份实物场景的用户视听体验，并在真实iPhone17核对首次进入、解扣、雾染和持续温升；技术通过不替代艺术验收。柜段已有可扩展接口，当前只放实际第五章样品，不用复制件填满架子。正式服务接线仍需在当时的维护主线实现首次通过事件→唯一制作任务→候选与独立审阅→原件封存→领取入藏，沿用既有租约/OneDrive，不能把本实验树的旧主壳整份覆盖到正式主站。资格与制作分离、未定计费结果保护及指定创作档位继续遵循CHARTER。
