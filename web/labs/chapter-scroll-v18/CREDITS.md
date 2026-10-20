# 第五章 · 做旧样品 v18

尚未颁发的私人章节纪念手稿。纸胚、正文、章记和本章艺术方案沿用[v14](../chapter-scroll-v14/CREDITS.md)；结构与真实解扣沿用[v17](../chapter-scroll-v17/CREDITS.md)。本轮重点是皮扣的材料老化，原样品保留以便比较。

## 材料与方法

- Poly Haven **Brown Leather**，Rob Tuytel，CC0：[原始资源](https://polyhaven.com/a/brown_leather)。使用GLB已有扫描基色、粗糙度和法线，不用重新生成的整物件贴图覆盖机构。
- cgbookcase **Bronze03**，CC0：[原始资源](https://www.cgbookcase.com/textures/bronze-03)。保留微坑与原生法线；加入局部稳定棕色包浆、接触凸部磨亮和粗糙度差异。
- Blender Cycles：在既有金属UV图集烘焙1024×1024接触遮蔽、曲率和表面朝向遮罩。遮蔽只控制历史接触处的着色权重，不将闭扣阴影烙成运动中不变的黑影。
- Ashima/Gustavson **webgl-noise**，MIT：复用v17既有二维simplex函数调节材料区域，不随时间变化；[许可](../chapter-scroll-v17/vendor/webgl-noise-LICENSE.txt)。Three.js、GLTFLoader与原流体组件许可同v17。

## 做旧含义

皮面保留天然粒纹；切边与孔壁使用独立的厚度方向取样，局部露出较浅纤维，反复穿孔和折返处有非均匀压磨。金属与皮革分开处理反射。没有新增霉变、虫蛀、粉状腐蚀或均匀烧焦边。这里是参考实物保护资料的艺术化材料设计，不声称复原某件特定年代的出土器物。

研究、取舍、烘焙恢复命令与验证见仓库`research/scroll-aging-2026-10-20/README.md`。静态播放不调用模型，无新付费素材、订阅或云GPU任务。
