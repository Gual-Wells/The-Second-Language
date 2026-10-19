# 皮扣：从闭死环纠正为连续皮带装配

2026-10-19。分支`codex/medieval-scroll-lab-2026-10-16`，开始时HEAD为`ac4be31`；用户指出前版俯视只有一个封死的环加前扣装饰。这一判断成立，前版撤出可采用候选，原件和原始记录保留。

## 实际完成与边界

新独立页`/labs/keeper-physical-assembly/`展示真实GLB的闭扣、俯视、内侧、同一坯料展平和隐藏皮革后的扣具。它是**机构修正版，尚未通过艺术验收，也没有完成解扣动画**；不是第五章皮扣的正式替换。

- 皮料是一个连续、有两个端部的带坯，弯成固定短端→绕左框杆折返→主带→从右框杆后方穿入→向左前伸出的自由带尾。各接触层没有焊成一体。
- 固定折返有真实的扣针让位槽，折返与主带各有两枚铆钉对应的贯穿孔。两枚铆钉的针杆、两侧帽独立成件。
- 扣框独立；扣针包含完整轴眼及被活动带遮住的针身，右端经选定孔伸出搭框。轴眼绕左框杆，扣针挂在真实枢轴下，金属不参加皮革蒙皮。
- 实际皮带网格绑定76根变形骨骼及一个不变形根骨骼。权重按皮料长度分配，避免空间相近的前后皮层串权重。
- 同一个网格的展平形态仅供检查坯料与孔位；闭扣与展平的直接插值**不是**真实解扣过程，网页不播放这种伪动作。

工作尺寸为中线半径45mm、带宽18mm、厚2.5mm；来自当前样品试装，并非考古规格或用户确定的产品标准。最终长度见`assembly.json`。皮带本身有厚度，所以实体网格没有开放边；“有两端”指带坯没有闭合焊接，不是漏面的开放网格。

## 工具和资源实际怎么用

整体AI重建补出了机构上错误的闭死环。这次用Blender成熟的Solidify、Exact Boolean、Bevel、Armature、形态键和刚性父子枢轴，重建可解释的结构，未再次要求整图重建自行猜出隐藏连接。

表面使用已下载、核对摘要的CC0扫描资源：

- [Poly Haven brown_leather](https://polyhaven.com/a/brown_leather)，Rob Tuytel；2K颜色、OpenGL法线与粗糙度。
- [cgbookcase Bronze03](https://www.cgbookcase.com/textures/bronze-03)，1K颜色、金属、粗糙度及高度，后者由Blender烘焙为标准切线法线。作者2K打包链接实际返回403，采用的是作者公开1K地图，未绕过付费/配额。
- 文件原始URL、许可及SHA256见`material-sources.json`。资源存D盘`.cache/keeper-physical/`；不把品牌实物照片当开放纹理发布。

机构查验延续`../scroll-keeper-reference-2026-10-19/BELT_CORRECTION.md`记录的厂家照片与制作说明。本轮重读[Weaver固定端说明](https://www.weaverleathersupply.com/pages/how-to-attach-a-belt-buckle-to-a-leather-belt)、[Klum House装扣](https://www.klumhouse.com/blogs/blog/how-to-install-buckles-on-leather-straps-with-rivets)；后者是center-bar，项目是heel-bar，不照搬其多一侧框。Blender[骨架父子与权重说明](https://docs.blender.org/manual/en/latest/animation/armatures/skinning/parenting.html)也实际取得；web工具402是工具抓取失败，直接HTTP取得200，不能误报软件需付费。

## 这次实际解决的构建故障

初次构建的源坐标已弯曲，Blender实时依赖图却仍在渲染展平缓存；同时布尔过程留下空材质槽，皮革错误地分配到未使用槽。早期的“零穿插”结果因此无效，已经作废，不能作为证据。

已清理空槽、明确UV、更新数据，并在装配阶段保存/重开真实工程，之后才做检视与导出；增加求值尺寸断言，防止再把350mm直条当成约100mm闭扣。扣针父级变换也先更新再保留世界位置，避免轴眼被重复平移。

随后按真实闭扣姿态修正右框后入带曲线、活动带在针轴前方的间隙、固定端让位槽及穿孔。最终求值尺寸与接触检查保存在`assembly.json`，不是沿用错误缓存的旧数值。

## 具体检验

1. Blender实际求值网格：皮带一个连通实体，31,510顶点；零边界边和非流形边。当前闭扣姿态，BVH三角表面检查中扣框/皮带与扣针/皮带均无交叉。此项不证明力学、制造公差、所有自接触或完整动作都通过。
2. `scripts/verify-keeper-physical.py`实际转动`STRAP_72`：1,766个尾部顶点运动，最大2.244mm，尾部以外没有被误带动；框与针位移均为零。全体权重和约为1。这是实际绑定检查，不是只数骨头。
3. `scripts/inspect-keeper-physical.mjs`在402×874 Chromium与1100×900截图，检查五种检视切换、灰模和回到闭扣，无页面错误及失败资源。见`browser/`。它不是iPhone Safari真机或完整解扣性能验收。
4. 人工查看Cycles的正/俯/内侧与展平、网页各状态。纹理、边缘、金属形体和整体年代感还需继续做艺术调整，不能以结构检查通过替代。

## 可恢复原件

- 网页GLB：`web/labs/keeper-physical-assembly/assets/keeper-physical.glb`；16,838,068字节，SHA256 `d99a603f3f818ba507d922be940efa9143ba76ccfc91ee169bc210dfd14dbdf1`。
- 原生Blender工程：D盘`.cache/keeper-physical/keeper-physical.blend`；打包纹理，13,457,681字节，SHA256 `df126963d22f90eb15e8686608665729d3de7ce5646d5a7e2877c531a77eeaae`。当前仅本机保存，不声称已上传这份原生工程。
- 参数与制作源：`scripts/keeper-physical-build.py`，Blender5.1.2。先按资源清单将7份贴图取到`.cache/keeper-physical/`并核对摘要，再以Blender后台运行。法线烘焙、模型及材质均可从此流程重建，不需再次AI采样。`-- --structure-only`只建设并检查，不输出网页成品。
- 最终视觉渲染允许重新拍摄相机；不会改变已记录模型字节。保存动作测试不会覆盖原生工程，确保静态基线不被试动作污染。

## 下一步

先让用户检视隐藏机构和层序，再在正确结构上提升外观。真实动作仍按`RIG_AND_MOTION.md`的松载→出针→退带→松环→轴向取下，以孔针接触和纸卷间隙为约束；不能用带坯展平形变或整体淡出冒充解扣。目前没有改纸张、雾染、认证/测试数据，没有新增订阅或付费GPU任务。

## 发布与末尾核对

模型/源码提交`c6e2a9a`已经推送同名GitHub分支。不可变预览：[结构检视](https://e2493e30.the-second-language.pages.dev/labs/keeper-physical-assembly/)，别名为`scroll-lab.the-second-language.pages.dev`。仅发布实验预览，没有部署生产main或后台API Worker。

发布后已通过代理实际完成线上同一组浏览器检视，无页面错误/失败资源；`browser/inspection.json`记录不可变预览URL。初次无显式代理的线上检查超时，未当作通过；补充代理后再检查成功。页面与预览别名HTTP返回200。

末尾实际执行余额/容量查询，因本工作区缺`SECOND_LANGUAGE_PUBLISH_TOKEN`或忽略凭据文件失败，旧记录保留；既有归档队列已排入，不声称大型原生工程已归档完成。全部新增资源、构建和工程存D，末尾采样C余约2.98GB、D余约22.68GB；此可用空间不撤销C盘长期空间约束。
