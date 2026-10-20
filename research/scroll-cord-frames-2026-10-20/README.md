# 第五章丝质系绳逐帧样品

2026-10-20。独立分支 `codex/scroll-cord-frames-20261020`，基线 `93b79448813af3d76a671c054046e896b84d5568`。用户希望比较绑绳逐帧动画与现有皮扣。本样品只实现这项比较，不继续仇视之龙，不改正在进行的 v17 皮扣试验，也不接正式认证。

## 样品

入口 `/labs/chapter-scroll-cord/`，第五章《河谷里未说完的话》。保留 v14 纸张、文书、小画、字体、章印、样品时间与阅读操作。闭卷用暗绛色细编丝质系绳；开卷顺序为拉松、收回绳耳、打开束环、移走系绳、展开纸张。收起按相反进度复位。支持点击、途中反向、纵向拖动、重播、细看、只看藏卷和减少动态。

本轮采用细编丝绳而非起初尝试的粗三股麻绳。用户询问材质后已停止麻绳方向；麻绳素材仅存档，不进入页面。

## 历史依据的边界

[KU Leuven 的文书纺织附件修复](https://www.kuleuven.be/charters/exhibits/show/conservation-textile-cords/conservation-textile-cords)确有丝绳、丝带及麻绳的实例，但主要是悬印附件，不能据此声称本样品的束卷方式是中世纪通式。

[11—12世纪英格兰文书系条研究](https://www.cambridge.org/core/journals/early-medieval-england-and-its-n/article/production-of-forgery-at-westminster-abbey-1050c-1154/918030EA6A718EA4A523B91A57ADEA99)讨论从羊皮文书裁出条带，围住折叠文书和印章；不是当前独立丝绳卷轴。[Oxford Lincoln 修复报告](https://lincoln.ox.ac.uk/asset/lincoln-unlocked-fundraiser-report-22.pdf)的彩色丝带束卷属于19世纪，未把它冒称中世纪实物。

这里做的是有历史材料依据的中古风格纪念品设计。暗绛色、绳径和绳结编排是本次美术选择，没有宣布历史统一规范；不添加用户排除的火漆。

## 实现方法

- 内置 imagegen 生成同一份直线丝绳纤维素材。`generation.json` 保存提示词；底层模型、quality 和单次成本未由工具返回，未补造。素材 SHA256 为 `44a94b259be3786a6f08fd4221797164b34baae5c8912676f418dd832746e247`。
- `author-frames.js` 离线编排二维曲线姿态与中央穿绕遮挡，沿曲线方向绘制同一素材。它不是三维网格、绳索物理求解或 AI 逐帧重生成。成熟工具依据是 [Canvas drawImage](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)、[Krita 关键姿态及补帧流程](https://docs.krita.org/en/user_manual/animation.html)；[Animated Knots](https://www.animatedknots.com/shoelace-bow-knot)用于学习动作，不复制其帧图。
- `scripts/bake-scroll-cord.mjs` 通过项目已有 Chromium/Canvas 生成 64 张 384×384 透明帧，打包为四张 1536×1536 WebP 图集；另有背侧投影层。源图和实际资产均存 D，未安装新的动画框架。
- 图集四张合计 597214 字节，约0.57MiB；RGBA 基础纹理约36MiB，另加后层及渲染器开销。不把下载体积当作显存占用。
- `cord.js` 只按总进度切换图集帧，结合平面内移走轨迹；帧不透明淡出、不做画面溶解。背侧层位于纸后，前侧帧位于纸前；接触阴影绘入帧图。没有重新制作整个纸张动画。
- 绳离开前纸张保持卷起，门槛为总进度0.38。纸张之后继续使用既有连续卷展公式。首次播放前预热各图集，不在播放中临时下载下一帧。
- 复用原生 Three、现有字库、纸膜及许可链。雾染默认关闭，可手动开启；不借此修改或宣称解决并行任务已报告的雾染问题。

## 样品限制

这是固定正面视角的二维编排，背侧和阴影是投影近似，不支持围绕系绳任意转看或重新计算任意灯光。关闭是可逆界面动作，不冒称人手真实重新系结。

绳耳的收缩、中央结的读法、松绳节奏与纤维观感仍要以观看结果验收；没有把可运行和有64帧等同于艺术通过，也没有声称结法达到考古复原或完整三维拓扑证明。源姿态可编辑，用户选定方向后再按反馈精修。

## 实际检查

`inspect-scroll-cord.mjs` 在402×874、DPR3 Chromium检查闭卷、多个中间姿态和展开页，没有页面错误或失败资源；见 `inspection.json`、`closed-iphone.png`、`open-iphone.png` 和 `frame-review.png`。

`verify-scroll-cord.mjs` 实测首次展开、纸张等待系绳、途中反向、关闭复位、文书摘要不变、细看、WebGL上下文恢复、减少动态和无写请求。全部通过。首次动作未增加着色程序；本机准备约2.29秒，实际显示间隔中位16.7ms、P95约33.4ms。它们是本机 Chromium 的一次结果，不是 iPhone Safari 真实帧率承诺。

文书内容摘要仍为 `a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0`，只是保留原样品身份的证据，不宣称正式认证或完整动画资产摘要等同于文书摘要。测试视频保存在 D 盘 `.cache/scroll-cord/video/`，未把大视频提交仓库。

## 恢复与成本

源素材在 `source-art/`，姿态在 `author-frames.js`；运行 `node scripts/bake-scroll-cord.mjs` 重建图集，`node scripts/build-scroll-cord.mjs` 重建运行包。两者复用本机既有运行时与 Chromium；浏览器不调用生图或模型接口。

本轮使用内置生图两次，其中一次粗麻绳素材未采用。没有 Kaggle 作业、新订阅或外部付费模型调用；内置生图的额度/单次费用不由工具暴露，不据此宣称全部计算免费。正式自动制作与颁发服务仍未接入。

## 发布及收尾

源码提交 `f5956bd` 已推送独立分支。不可变预览为 <https://0fdfc982.the-second-language.pages.dev/labs/chapter-scroll-cord/>，独立别名为 <https://cord-frames.the-second-language.pages.dev/labs/chapter-scroll-cord/>。没有覆盖 `scroll-lab` 皮扣预览，没有部署生产 main 或 API Worker。

线上同一组完整交互检查已通过，见 `live-verification.json`；没有页面异常或写请求。该次本机浏览器的线上冷准备约3.49秒，不是用户网络或iPhone硬件保证。发布后的记录补充只影响研究文档与检查结果，不改变已发布样品文件。

第一次非交互发布没有读取到有效凭据而失败；核对现有 Wrangler OAuth 登录后，`whoami` 成功，再次正常发布完成。没有要求用户新增密钥或绕过平台权限。

按 BALANCES 执行了末尾查询；本独立 checkout 缺少应用发布凭据 `SECOND_LANGUAGE_PUBLISH_TOKEN`/受忽略凭据文件，余额和容量回写未完成。既有记录没有被置零，永久归档已排队，不能声称本地全部研究数据已归档。这个应用写入凭据与静态 Pages 发布的 OAuth 不是同一个授权。
