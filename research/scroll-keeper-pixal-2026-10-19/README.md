# 纠正针扣关系后的建模与骨架准备

2026-10-19。基线`6e75f5c`，分支`codex/medieval-scroll-lab-2026-10-16`。用户要求“进行骨架、逻辑、运动准备并进行建模”。此阶段完成新的可编辑静态资产及骨架/动作准备，不把其标为艺术通过或完整动画绑定。

## 当前交付

- 独立页面`/labs/keeper-belt-model/`：真实GLB，拖动/缩放、正斜侧背、灰模、参考对照。旧页面与第一/第五章原件保留。
- 本地工程`.cache/keeper-engineering/keeper-model-and-rig.blend`：静态表面及52骨骼的准备结构，金属控制锁定缩放；五阶段参数轨及时间标记。**没有绑定活动网格，不是已经做好的解扣动画。**
- 机构分件、运动及验收依据见`../scroll-keeper-reference-2026-10-19/RIG_AND_MOTION.md`。逻辑是松载→出针→退带→松环→轴向取下，不能让金属变形或活动带消失。

正面可见的活动尾向左覆盖固定折返，右框位于入带前方，针端经孔露出搭框。整环空心、厚度及自由尾可见。**隐藏完整针轴/折返、接触间隙与语义分件仍未完成；静态单网格不宜直接全自动蒙皮。** 皮革和铜扣有区分，但细节和材料保真仍不及参考图，不能把新模型名称、面数或干净灰模当作审美通过。

## 实际可恢复来源

1. 输入`closed-standard-belt-v1.png`：SHA256 `63343355742f1e7c112547cef9fc329e30a0921a4494dc08c8183450a569ba37`。
2. 作者官方Space版本`40a1519aadf70a82110a500997c19b626668a144`，实际加载`TencentARC/Pixal3D-T`；种子42、1024级联、默认12步、MoGe估计FoV。此处估计FoV不是人为编造的相机标定。第一次生成已完成但Gradio客户端自动取图403导致返回丢失；第二次明确关闭自动下载，完整保存返回、各视图与潜变量，不是未知计费重试。
3. 返回潜变量`state_1792393369211_9157.npz`：SHA256 `48bdc5eda1367b54117fc99ff71ea762be1c3c7c9f41f3c4bb7d6289af5a974e`，6,596个32通道形状/材质稀疏点。保存于D盘`.cache/keeper-pixal-hf/`。源Space提供`/tmp`静态取回路径，未绕过导出配额或购买订阅。
4. 私有Kaggle`gualwells/scroll-keeper-author-export-20261019/1`只解码该检查点，不重新生成形状/材质；实际报告`editable_candidate_saved`，执行183.48秒；形状解码22.68秒、材质解码13.92秒。源码`microsoft/TRELLIS.2@75fbf0183001ed9876c8dbb35de6b68552ee08bd`，模型revision及已验证T4适配沿用`keeper-author-export-kaggle.py`的固定来源。原始网格1,804,305顶点/3,623,736面；上游重整与导出后GLB为294,500三角面。
5. 原始GLB：11,221,720字节，SHA256 `cbec7ed68bf399274798a02d608fc0cb90da00d1877245e6fe2233238a9884c3`。实际网格/体素材质/检查点及运行日志保存D盘`.cache/keeper-author-export/output/keeper-author-export/`；不重复上传大型模型权重。
6. 展示文件`web/labs/keeper-belt-model/assets/keeper-model.glb`：仅增加+90°X轴根旋转，二进制网格与纹理未改；SHA256 `afe3493f90215616ebbb27e84ab5c6db6e63ebaea4596d006cf33466c0f9e0bb`。WebGL检视结果见`browser/inspection.json`。桌面Chromium的402×874视口不冒充实机iPhone/Safari帧率。

原始导出报告继承旧脚本的`seed:38017`字段，该字段在本次纯解码中没有被使用；实际造型/纹理生成种子是HF返回对应请求中的42。原报告原样保留；控制器已修正未来构建的描述，不能把旧字段当作本次采样事实。

## 尝试与未采用分支

### 原生ComfyUI Pixal3D

固定ComfyUI源码`8f04fd6ecf4a548937971e840af2a985529fab76`及模型文件摘要见前一目录pin文件。私有Kaggle`gualwells/scroll-keeper-pixal-rig-20261019/3`实际完成1024级联、原始形状及PBR导出，执行563.04秒，Comfy提示执行411.42秒。第1版在源码归档目录名定位失败，第2版在UI样例与当前节点schema转换处失败；两次均在模型推理前停止。第3版节点连接/类型核对后完成。

原始形状GLB 70,202,656字节，PBR GLB 24,286,452字节。此分支真实Cycles灰模有密集黑斑，原始平面着色较少、减面与平滑后显著；重算法线、Blender重新减面和OpenVDB尝试均未形成可采用结果。**仅凭这些对照不能把原因唯一归结到量化、VAE实现或某一减面算法。** 不继续在这份失败表面上补丁式修造型，不用它替换新交付。根目录六张原生分支视图是失败诊断证据，不是成品展示；`author/`才是当前上游导出检视。

### 作者免费Space

正常生成和多角度渲染成功；`extract_glb_api`声明240秒GPU，实际请求返回`The requested GPU duration (240s) is larger than the maximum allowed`。未订阅PRO、未尝试规避平台上限。保存潜变量后在用户授权的Kaggle资源进行正常解码导出，避免再次生成。

## 成本与下一步

没有新增付费接口或持续订阅。最终Kaggle额度API已核实总用量1,602.572秒，余106,397.428秒（约29小时33分17秒），刷新字段`2026-10-24 00:00:00`未声明时区。运行中暂记值曾高于结算值，因此不用面板等待时长当GPU结算。HF本次实际使用免费ZeroGPU，未取得可验证的剩余秒数，不猜测余额。

下一步是围绕已核定的针扣机构做明确分件：保留合适静态表面，补齐被遮挡的针/固定端，分离贴近皮层、设置实际枢轴与蒙皮，再逐接触事件验证动作。当前名义骨链需要对分件后的实际皮带中面拟合；不能宣称52根骨头本身已完成解扣。暂不替换第五章皮扣，也不改纸张、雾染和正式认证数据。

## 发布及末尾核对

独立不可变预览：<https://e6cd3a23.the-second-language.pages.dev/labs/keeper-belt-model/>；预览别名<https://scroll-lab.the-second-language.pages.dev/labs/keeper-belt-model/>。只更新`scroll-lab`，没有发布到生产`main`或部署后台API Worker。浏览器检视无页面异常或失败资源；检查包含正斜侧背、灰模及参考切换，未做真实解扣或iPhone性能通过声明。

末尾实际执行`check-balances.mjs`，因缺`SECOND_LANGUAGE_PUBLISH_TOKEN`/忽略凭据文件失败；旧余额/容量未覆盖，永久归档排入既有队列，不能宣称整份大型实验数据已上云归档。D盘保存实际新增模型、缓存及独立构建；末尾C余约2.20GB、D余约20.92GB。
