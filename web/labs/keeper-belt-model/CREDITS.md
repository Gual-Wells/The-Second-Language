# 新皮扣资产试样

参考为本项目2026-10-19纠正穿带关系后的`closed-standard-belt-v1.png`。使用作者官方[TencentARC/Pixal3D演示](https://huggingface.co/spaces/TencentARC/Pixal3D)生成1024级联潜变量，种子42；固定Space版本`40a1519aadf70a82110a500997c19b626668a144`。演示的240秒GPU导出被免费接口拒绝，未购买额度。

已保存的潜变量由Kaggle免费T4及此前验证的[微软TRELLIS.2](https://github.com/microsoft/TRELLIS.2)上游解码器/CuMesh工具导出，未重新采样造型或材质。原始GLB约11.2MB。页面仅添加显示轴向根旋转，网格与材质二进制不变。模型不是实物扫描，也不是历史文物复原。

当前是单网格静态候选，不是已分件的机械模型；骨架准备独立保存在工程文件。针轴、固定折返的遮挡部分仍须完善，不能从当前静态外观推断可正确解扣。未接入正式卷轴或认证。

Three.js、GLTFLoader、OrbitControls及RoomEnvironment沿用项目Three.js r186/MIT，[许可](../certification/vendor/three-LICENSE.txt)。模型/算法依各自MIT及第三方模型许可，未重新分发其权重。详细来源、试验失败和交付记录见仓库`research/scroll-keeper-pixal-2026-10-19/`。
