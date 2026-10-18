# 第五章材料探索与被否决的程序皮扣

2026-10-19。起点`6f170a4`，分支`codex/medieval-scroll-lab-2026-10-16`。

**状态：本轮程序皮扣被用户明确否决，不作为新作品交付或正式资产。**失败试验已从`web/labs/chapter-scroll-v15/`移到本目录`rejected-browser-prototype/`，避免被后续网站构建意外发布；不替换v12/v13/v14。其几何复杂度、骨节数量、PBR通道和运行通过均不能推翻艺术判定。

## 实际做过什么

查阅York Archaeology的《Craft, Industry and Everyday Life: Medieval Finds from York》，特别是纸本2892–2897页的扣框/针/固定片图；PDF只保存在D盘缓存，没有把整份第三方书刊上传仓库。另读该馆14世纪末皮护臂的折返缝合固定说明。根据这些资料，把v14细椭圆框换成宽扁框，固定端改为回折缝合，尝试用匹配的色泽、粗糙度、金属/氧化层遮罩区分铜和皮革。但实际造型与工艺感仍然不合格，不能继续以本路线加参数作为高质量交付。

用户强调：旧皮扣只是外观比较，不能把旧图所有孔洞、结构都当成正确；第一章纸面可学习材料层次和长期调整经验，不机械复制或镜像。本轮新作`parchment-source.png`在已认可材质方向上重新安排轮廓、折痕和旧水痕；正文、小画与排印继续用v13，未篡改章节事实。新纸面也仍待用户审阅。

材料图使用内置imagegen，两次调用：一张独立纸胚、一张皮革/古铜材料图集。图像型号、质量参数和单次费用未由工具暴露。所有PBR派生通道是艺术近似，不是物理扫描或反演结果。原图、制作脚本与实际GPU画面均留存。

## 本轮另一个失败

提高旧染料流场速度会形成油纹；用静态噪声分割又出现云斑背景感。因此不再把调节流体参数视为雾效完成。新的资源实测在`resource-trials/`，接续决策见`../scroll-keeper-resource-upgrade-2026-10-19.md`。

用户随后明确Kaggle用于皮扣建模。新工作复用之前已成功的真实三维生成/导出环境，以旧皮扣的艺术参考进入私有GPU资产试制，不把同一批被否决的网页几何搬到GPU上冒充升级。未经实际网格/材质检查不接回卷轴。

## 恢复入口

- `scripts/build-scroll-v15-assets.py`、`scripts/build-scroll-v15.mjs`和检视程序保留为历史恢复工具；只在明确恢复该失败试验到原web位置后运行。不要作为新采用版本发布。作品身份/时间只属本失败试样，不是认证。
- `scripts/keeper-kaggle.py`：新私有资产试制的准备、上传、构建、提交、状态与下载。凭据只由既有D盘私有配置读取，不进入Dataset或Notebook。
- `.cache/scroll-keeper-kaggle/`：真实提交回执、原始输出与额度；该目录不入Git。发生未知提交结果先查询，禁止盲目重复生成。
- 三维候选已取得，`web/labs/keeper-asset-study/`提供真实GLB及GLTFLoader/OrbitControls灰模/材质视图；实际评估见`../scroll-keeper-kaggle-v2/README.md`。失败v15原型的可再生bundle只留缓存；原始源码和构建入口保留于仓库。
- `scripts/prepare-ambient-smoke.py`及`web/labs/scroll-atmosphere-study/`：原作验证后的独立粒子雾研究，不宣称已获艺术通过。

未新购订阅、未调用外部付费三维API，未写生产认证、教材或学习记录。Cloudflare尚未发布本轮内容。

## 当前实际前沿

`kaggle-candidate-state.json`保留早期RUNNING的历史观察。之后v2成功，已按版本下载至`output-v2/`并核对GLB SHA，完成真实PBR/灰模各五视角检视及浏览器402×874验证，无脚本或请求失败。模型有结构和表面缺陷，未通过艺术验收；下一步先明确定义固定端、扣针与穿带路径，再做资产修订，不把候选直接塞回第五章。生成/实际额度与长等待说明见`../scroll-keeper-kaggle-v2/`。

`check-balances.mjs`再次执行仍因缺少项目发布凭据失败：余额/容量页保留上次记录，永久归档排队。这与Kaggle授权和Cloudflare预览OAuth是不同凭据，不能声称已经同步。
