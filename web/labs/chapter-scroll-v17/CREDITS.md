# 第五章 · 解扣样品

独立v17样品，尚未颁发，不产生认证或学习记录。纸面、英文文书、字体与章节艺术方案沿用[第五章v14](../chapter-scroll-v14/CREDITS.md)。第一章和v16原页保留。

## 模型与动作

以[已认可的实体皮扣](../keeper-physical-assembly/)为基础，复用同一建模流水线，生成30mm环半径的尺寸适配副本：皮带仍为18mm宽、2.5mm厚，扣框、扣针和铆接件的原工作尺寸保持。场景只用统一等比缩放，取消过渡试验中错误的1.8倍单轴拉伸。

原连续带坯、固定折返、带孔、完整扣针与独立扣框保留；材料长度路径依次完成松孔、孔洞越过针尖、退带、扣针归置、移离和开纸。金属保持刚性；皮革保持截面，沿曲线弯曲。收起沿同一连续动作返回，支持中途反向。这里是编排的机构动画，不是实时皮革力学仿真。

材料坐标变形参考[Three.js CurveModifier](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/modifiers/CurveModifier.js)的曲线位置/局部坐标系方法；原切边、孔洞、倒角与UV通过现有原生工程恢复。每个原生倒角的微小残差随材料坐标系保留。原76骨骼仍在GLB中留作原件信息，本页皮革播放使用曲线数据纹理。

## 材质与雾染

- [Poly Haven brown_leather](https://polyhaven.com/a/brown_leather)，Rob Tuytel，CC0。复用颜色、粗糙度和OpenGL法线；重新调整纹理尺度，补充局部孔缘压痕和边缘磨耗。
- [cgbookcase Bronze03](https://www.cgbookcase.com/textures/bronze-03)，CC0。真实金属通道和烘焙法线，独立于皮革处理反射。
- Three.js及GLTFLoader，MIT；既有Paperlab卷展、Pavel Dobryakov Fluid（MIT）、Ashima/Gustavson webgl-noise（MIT）沿用原许可。雾染复用现有流体求解器，场景耦合适配另行修正。

v16的皮扣投影读取了不存在的`ScrollObject.radius`，造成无效坐标进入雾场。本页使用实际皮扣半径，并在送入雾场前验证坐标与速度；闭卷不再作为两条展开纸边注入运动。没有移除雾染或把它限制为展开状态。

所有播放资源为静态文件，浏览器不调用AI或付费接口。本轮没有新订阅、云GPU任务或付费素材。实际视觉与触感仍需用户检视；桌面Chromium的iPhone尺寸检查不等于真机Safari验收。
