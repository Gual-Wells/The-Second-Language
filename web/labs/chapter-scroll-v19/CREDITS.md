# 第五章 · 古旧皮扣材料样品 v19

私人章节纪念手稿试样，尚未颁发。文书与羊皮纸沿用[v14](../chapter-scroll-v14/CREDITS.md)，机构与解扣沿用[v17](../chapter-scroll-v17/CREDITS.md)。此版回应v18做旧层次不足的反馈。

## 原件与材质

- [Poly Haven Brown Leather](https://polyhaven.com/a/brown_leather)，Rob Tuytel，CC0；[cgbookcase Bronze03](https://www.cgbookcase.com/textures/bronze-03)，CC0。扫描提供原始颜色、微粒法线与粗糙度。
- 本项目v14独立创作的老化皮革、古铜基色原件，制作记录在仓库`research/scroll-lab-v14/PROMPTS.md`。本轮复用已有原件，没有新增生图调用；它们是艺术化材质，不能冒充历史实物扫描。
- Blender Cycles原生多层材质工程：皮料色差、手持压磨、粒面磨穿、屈折细裂、手工双刻带与末端菱形压纹；铜件修锉、浅压平痕、细坑、成对刻槽、棕色氧化层、暗处少量铜绿和凸部磨亮。颜色、法线、粗糙度与金属通道联合烘焙。
- 输出以4096×512皮革展开图、2048×2048铜件UV图集保存，再用Blender无损WebP打包；实际逐像素核对与PNG母版的误差为0。

## 风格资料

[British Museum十五世纪皮革刻带实例](https://www.britishmuseum.org/collection/object/H_1855-0804-77)与[CBA中世纪发掘报告的刻线、冲点扣具](https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-281-1/dissemination/pdf/cba_rr_080.pdf)供工艺语汇参考。网页不使用馆藏照片作贴图。当前是匹配藏卷的艺术化配件，没有把既有机构改成某件出土扣具的考古复刻。

Three.js、GLTFLoader及既有纸膜/雾染许可同v17。没有新订阅、付费素材、Kaggle任务或收费模型调用。研究与恢复见仓库`research/scroll-aging-v19-2026-10-20/README.md`。原生工程中可编辑各工艺阶段；网页运行只读取已烘焙纹理。
