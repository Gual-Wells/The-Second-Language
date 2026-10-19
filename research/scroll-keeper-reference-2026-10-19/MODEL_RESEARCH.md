# Kaggle皮扣建模候选复核 · 2026-10-19

## 当前结论

有值得实际试用的新路线。优先候选是**Pixal3D，尽量使用ComfyUI现有原生实现**，而不是重新手工移植一整套管线。它更强调图像与生成三维的投影对齐，切合这次希望减少“参考图到模型错译”的问题。**尚未在本账号Kaggle上实测Pixal3D；没有证据证明它必然做出正确的扣具或已超过现有结果。**

用户刚指出闭扣图的前后层序错误。修正输入机构优先于启动任何新模型：更高分辨率与图像遵循性也可能更忠实地放大错误。当前图片状态见`REVIEW.md`。

## 可执行候选与取舍

| 路线 | 已核对的能力/条件 | 本项目下一步用途与边界 |
|---|---|---|
| [Pixal3D](https://github.com/TencentARC/Pixal3D) | 图像特征向三维反投影；当前推理基于TRELLIS.2；官方已有low-VRAM，默认1024，标准1536；另有多视角权重 | 首选试验。不是机械CAD，不自动保证孔、针、分件或活动间隙。低显存能否完整跑在本次T4仍待验证 |
| [ComfyUI原生Pixal3D/TRELLIS.2节点](https://github.com/comfyanonymous/ComfyUI/blob/8f04fd6ecf4a548937971e840af2a985529fab76/comfy_extras/nodes_trellis2.py) | 实际源码含Pixal3DConditioning、Pixal3DMultiViewConditioning及形状/材质阶段；[Comfy-Org权重](https://huggingface.co/Comfy-Org/Pixal3D)含INT8与BF16版本 | 优先复用该实现和作者工作流。INT8不是已经验证“无损”；具体版本、算子和输出需一次实际比较。私有批处理不需要公共隧道 |
| [TRELLIS.2](https://github.com/microsoft/TRELLIS.2) 1024级联 | 现有512低显存管线已在本账号生成可编辑GLB | 作为熟悉的备选/比较基线。1024是同一家族更高规格，不冒称另一个新模型；本机T4的1024尚未实测 |
| [Hunyuan3D-Omni](https://github.com/Tencent-Hunyuan/Hunyuan3D-Omni) | 3.3B，官方写明生成10GB显存；支持点、体素、包围盒等条件 | 需要结构约束时研究，不是自动PBR/扣具装配工具；依专用许可使用 |
| [PartCrafter](https://github.com/wgsxm/PartCrafter) | 图像到分件生成；官方最低8GB；MIT | 针、框、皮带的可分离性值得探索。自动分件不等于正确接合、可运动或高精细美术 |
| [TripoSG](https://github.com/VAST-AI-Research/TripoSG) | 1.5B；官方最低8GB；MIT | 形状替代路线。不能把可运行当作比现有模型更好，也不直接获得完整PBR |
| [Hunyuan3D-2.1](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) | 官方形状10GB、材质21GB、合计29GB | 单张T4不能照搬全量管线。社区仅跑几何或分阶段offload，与完整形状加材质不同 |
| [Step1X-3D](https://github.com/stepfun-ai/Step1X-3D) | 形状与材质分别生成；完整流程官方需求约27–29GB | 当前不排在T4优先路线，不能只看几何阶段显存即承诺完整材质输出 |

没有仅按排行榜指定“最强模型”。这里选择的是符合现有硬件、输入纠错与可编辑资产目标的候选，最终依真实皮扣的形体和材料判断。

## Kaggle实际条件

- 已成功的皮扣实验是TRELLIS.2低显存512，并非Pixal3D。其真实运行、原始GLB与额度纠正见`../scroll-keeper-kaggle-v2/README.md`。
- 本账号原运行是T4×2，每张16GB等级，不能当作一张透明合并的32GB卡。框架不主动分片就不会自动借用另一张卡。
- [Kaggle官方公告](https://www.kaggle.com/product-announcements/735239)已宣布2026-09-15退役P100；部分旧文档仍写P100，不能继续把它作为当前可选硬件承诺。
- [NATTEN官方后端](https://natten.org/backends/)包含支持SM75/Turing的CUTLASS FNA，所以“T4完全不支持NATTEN”是不正确的。仍须核对安装版本、PyTorch/CUDA ABI和FP16路径。不要通过删除NAF特征或静默换模型来冒充完整Pixal3D实验。
- 权重下载在Kaggle工作空间或D盘；不落C盘。实际权重文件总量不是显存占用。候选INT8组合（包含比较用TRELLIS.2、MoGe及抠图）元数据合计约14.16GiB，当前**仅查询元数据，未下载**。不把权重当实验结果重复封装进每次输出。

## 实际查过的公开Kaggle笔记本

本轮通过Kaggle API搜索并获取了源码，未执行他人的脚本。搜索列表的GPU字段与详情存在差异，以实际详情/执行记录为准。

- [mohanbaghel32189/image-to-3d-model-ai](https://www.kaggle.com/code/mohanbaghel32189/image-to-3d-model-ai)：详情为T4，源码实际下载Comfy-Org的Pixal3D INT8、DINO/NAF、VAE及MoGe。这证明存在可借鉴的部署组合；笔记本主要启动UI和公共隧道，**不是已检验成品的证据**，不照搬隧道及进程管理部分。
- [yacine105/notebookca9c2cba82](https://www.kaggle.com/code/yacine105/notebookca9c2cba82)：虽被Pixal3D搜索找到，实际工作流是TRELLIS.2 512，不能计作Pixal3D已成功样例。
- [adeshparve/hunyuan-2-1-i-2-3d](https://www.kaggle.com/code/adeshparve/hunyuan-2-1-i-2-3d)：源码涉及CPU offload并明确舍弃PBR绘制以适应显存，不是全流程高质量材质已完成的证明。

## 图片到试模的实际流程

1. 先改正固定带/活动带前后层序，核对针、孔、铆接及连续皮带路径。生成图允许逐步修订，但不能把无法解释的接合留给三维模型自行发明。
2. 保留一个明确的静态状态作首轮输入。开扣图用于理解部件，闭扣图用于理解扣合；不能把二者同时标作一个静态物件的多视角。
3. Pixal3D多视角接口涉及相机信息。AI提示的“侧转25度”不是相机标定，不凭提示词虚构矩阵。第一轮先用单图完成实际导出，再决定是否有必要建设一致的多视角集。
4. 采用成熟节点，先跑一次能保存完整GLB的受限试验；保存权重/源码pin、真实配置、执行日志及原件。内存不够时明确记录，不把低配替代品包装成原模型结果。
5. 看真实正、侧、背及灰模/PBR，检查机构是否融合、皮革厚度与金属边界、材料区分。合格静物再谈分件动作；新模型名称或面数不代表美术合格。

不为此开通新订阅。免费Kaggle运行仍消耗账户周期GPU额度；本轮研究没有启动新运行。生图工具的实际计费配置未暴露，不能宣称生图零成本。

## 固定来源与恢复位置

- `model-source-pins.json`：直接GitHub API核对的仓库分支/commit与读取文件摘要。Pixal3D实际默认分支为`master`，不是索引页面中可能出现的`main`。
- `comfy-source-pin.json`：已读取的ComfyUI原生节点/模型实现pin。
- `comfy-weight-pins.json`：Hugging Face模型revision、LFS文件大小和摘要，属于待下载元数据，不是已取得权重的声明。
- 本地原始源码/工作流与Kaggle返回留在D盘`.cache/keeper-model-research/`，其中`pixal3d-official-workflow.json`为官方示例。缓存不是产品依赖；恢复可依上述固定公开来源获取。

MIT模型/实现仍需遵守NOTICE及第三方依赖、DINO等权重各自许可。Hunyuan路线依其专用许可，不统称MIT。生成的新图稿与失败证据均未替换正式卷轴、答卷或认证记录。
