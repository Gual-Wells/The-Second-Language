# Kaggle 仇视之龙试验

目标：实测周期免费 GPU 是否能支撑可编辑、可导出的真实三维纪念币候选。当前账号接入、GPU与联网探测及结果下载均成功，512 可编辑模型已经取得；艺术质量仍未通过。不能将 Notebook COMPLETE 状态视为作品完成。

## 最新执行状态（2026-10-11 23:11 上海）

2026-10-12 00:19 更正（优先于旧结论）：用户指出原眼没有问题，v4 的金色眼球和竖瞳增补是基于局部特写的误诊，改坏了整体设计。已从副本中删除这两个独立对象，原有网格坐标散列一致；当前工作副本为 `outputs/original-eye-v5/working-master.blend` 与同目录 GLB，记录见 `review.json`。本地比较页默认使用保留原眼的试样并保留原始版本入口。**不得再按“空眼眶/缺少眼球”理由修改原眼。** 当前币背/包边结构仍未通过艺术验收。

官方 CuMesh/O-Voxel 网格修复已经实际成功并取回可编辑结果（`outputs/remote-mesh-repair-512`）；短基准 v2 也已成功（`outputs/remote-attention-benchmark/attention-benchmark.json`），隐藏回收状态里该基准的 ERROR 是先前 v1 启动失败记录。FP16 性能收益只经过合成张量基准，不代表全流程艺术质量已验证。高档采样最新实见纹理 6/12，当前仍未取得最终高档模型；不可重复整形状采样。

23:31 补充：高档细形状采样已实见 6/12，42:56，约 429 秒/步；官方网格重导仍 QUEUED。原生 FP16 SDPA / GEMM 短基准首次提交被两路会话上限明确拒绝（没有创建执行身份），收据标记 `rejected_capacity`。`collect-current-jobs.py` 是本任务隐藏结果回收进程，最多运行三小时，不重试生成，不购买，不自动认定艺术合格；已有会话结束后才对确定未执行的短基准重试。当前状态以 `outputs/current-jobs-collection.json` 为准。前述局部手工背面实验已淘汰；行业资源选择依据在 `sources/industry-workflows/ASSESSMENT.md`。

下列状态优先于后面的历史记录：

- 已取得真正可编辑的 TRELLIS.2 512 龙币：`outputs/remote-generation-recovery/dragon-generation/hostile-dragon-source.glb`，18,865,188 bytes，SHA256 `594c78b555d39980d6ff7015acb3358239b18c36c9a1f4f04b6acf200547bbfa`。完整原网格、PBR 体素、latents、纹理阶段 checkpoint 与日志已落 D；原始形状 checkpoint 被复用，没有重新采样几何。
- 首轮主生成因本地 lazy model 代理没有继承 `torch.nn.Module` 在纹理调用失败；修正后续跑完成。不能误报模型或地区权限失败。
- 恢复任务最初页面与 API 日志为空，之后确实执行并成功；空日志不能单独证明卡死。`generation.json` 记录恢复代码实际耗时381秒；总墙钟等待与 GPU 推理应分开。
- 完成原件正、双45度、侧、背的灰模/PBR十张渲染；editable master 在 `outputs/art-review-512/candidate-master.blend`。本机 CUDA 枚举成功但 kernel 实际加载失败，使用 CPU 完成。**艺术仍不合格**：镜像币背、圆鼓爪关节、裂隙和敌意不足。
- 完整授权私有权重 Dataset `gualwells/dragon-authorized-input-20261011` 已 ready，不再等待上传。高档 `gualwells/hostile-dragon-high-20261011` v1 已提交，使用这份私有输入；最近收到的结构化日志在高分辨率 shape cascade，状态 RUNNING，未宣称完整成功或固定达到1536。
- 对保存的512网格/材质体素，另提交一次微软官方 remesh/PBR重导：`gualwells/hostile-dragon-mesh-repair-20261011` v1，限1800秒，最近状态 QUEUED。不是重新生图或重新采样三维形状。
- `serve-viewer.py` 在 localhost8767 提供真实 GLB 的本地实物预览；`outputs/coin-viewer/browser-review.json` 实证加载成功、无 JS 异常、正背/灰模控件可用。普通Windows Python HTTP server 把 `.js` 作为 text/plain，已用专用预览显式修正 MIME。
- 用户新增约束：陌生高难度制作先查现成行业实现与资源。已核查并固定社区源实现、官方重导及雕刻工具；选型与未验证边界在 `sources/industry-workflows/ASSESSMENT.md`。Poly Haven棚拍 HDRI 已保存，原许可/出处/散列在 `inputs/studio/provenance.json`。程序化币背展平实验审美不合格，仅作反例保留。
- 22:26采样 Kaggle GPU 剩105134.6444秒，后续在运行任务的最终用量需结束后再查。没有新增订阅/付费。既有HF次日续作未中断。本机仍保持所有实际新增数据、浏览器测试profile/cache和临时文件在D。

续作：优先读取 high/mesh-repair 的提交回执与最新状态，终态下载后核验报告和散列；高档若失败，复用保存的 checkpoint，按具体失败选择已经核查的 tiled decoder / mesh repair 实现。不要盲目重提运行中任务。随后比较修复前后实际几何，研究真正多视图约束解决背面，再进入局部成熟雕刻/PBR/独立特效。512 技术成功不降低用户高标准。

## 历史执行状态（2026-10-11 20:17 上海）

下列状态优先于后面的历史记录：

- DINOv3 访问申请已通过；官方权重下载、散列校验完成，固定 revision `ea8dc2863c51be0a264bab82070e3e8836b02d51`。受限权重只传入账号私有 Dataset，原许可证随文件保存；HF/Kaggle 凭据不上传。
- CuMesh、nvdiffrast、O-Voxel 与 FlexGEMM wheel 均已取回。`outputs/remote-runtime-v4/dragon-runtime/runtime.json` 实证 `runtime_export_completed`：真实 GLB 带 PBR 导出成功（6692 bytes 技术立方体），不是龙币作品。
- runtime v1/v2 的失败是缺 Python 依赖；v3 的失败是测试四面体低于 BVH 所需面数。原报告保留，修正后 v4 成功；不能将这些误写为 T4 不兼容。
- FP32 memory-efficient attention 对 math 参考最大绝对误差约 `9.8e-6`。保留 BF16/FP16 模型权重，BF16 注意力在 T4 上以 FP32 核计算再转回；仍须完整模型验证。
- 原私有权重输入约1.22 GB，上传速度约0.3 MB/s，后台仍在传输，未知结果不重复上传。临时压缩和所有本机文件均存 D。
- 为缩短等待，另创建小型私有艺术/许可证/配置/官方散列输入集 `gualwells/dragon-art-input-20261011`。完整生成已实测服务器权重 `hark99/facebookdinov3-vitl16-pretrain-lvd1689m/transformers/default/1` 与授权下载的官方文件 SHA256 完全相同；坚持原 Meta 许可证，未采用上传者的其他许可宣称。核验在 `outputs/generation-live.json`；未匹配散列会停止生成。
- 512 完整生成私有 Notebook `gualwells/hostile-dragon-generation-20261011` v1 已运行，使用 `--cached-input`。分块 FP16/BF16 卷积对原矩阵表达式最大差均0；稀疏注意力通过，DINO图像特征提取成功，当前加载结构模型。完整生成/导出仍待结果，未判为艺术合格。
- 另一个短适配预检 `gualwells/hostile-dragon-preflight-20261011` v2 排队；v1 是初始化目录缺失导致的脚本错误，已修正，不是 GPU 失败。主生成内已执行相同实算检查。
- 19:40 采样周 GPU 剩106183.288秒（约29.5小时），没有新购买或付费。

执行入口：`run-geometry.py status/fetch --runtime`；`run-generation.py input-status/push/status/fetch`；小型输入使用 `--cached-input`，预检使用 `--preflight`；`watch-generation.py` 只读阶段日志。高档使用 `--high`，仅在512候选完整导出后放行。各阶段 latents/decoded geometry 与最终高模/PBR体素/GLB 分别保存，避免导出失败丢原件。`inspect-candidate.py` 使用现有 Blender 检视灰模和 PBR 多角度，并保留 editable master；本机 CUDA MX250 已枚举成功，艺术验收尚待真实龙币。提交意图、源码 pin、素材与权重散列、阶段日志及额度前后采样均保存在本目录。既有 HF 次日续作未中断。

## 当前记录（2026-10-11）

- Kaggle账号 `gualwells`，API认证成功。
- 实查周 GPU 额度108000秒（30小时），TPU72000秒（20小时），采样时使用均为0；接口返回刷新时间 `2026-10-17 00:00:00`，字符串未附时区，不能自行写成北京时间。
- 私有 Notebook：<https://www.kaggle.com/code/gualwells/hostile-dragon-hardware-probe-20261011>。
- v1在运行代码前失败：缺少kernelspec；已修复，日志原样保留。
- v2完成；实际环境 Python3.13.15、PyTorch2.11.0+cpu、无CUDA/无GPU、外部DNS不可用。未下载模型，无GPU用量。
- 再读取服务器metadata确认 GPU、Internet 均为true，machine_shape=NvidiaTeslaT4；保存配置不等于实际获得相应资源。手机验证、账号资格或运行平台问题仍待区分，已经请用户检查账号验证与页面开关。
- 用户完成验证后 v3 实测成功：两张 Tesla T4，每卡14.56GiB可用显存，sm75；PyTorch2.11.0+cu128、CUDA12.8、nvcc12.8；GitHub及HF均HTTP200。每卡FP16/BF16基础SDPA输出有限，但无原生BF16，且未验证大规模稀疏注意力、FlexGEMM、网格生成或GLB导出。实际报告在`outputs/remote-probe-v3/dragon-probe/hardware-probe.json`。
- v3后额度采样GPU使用24.418秒，剩余107975.582秒；该短探测耗时不能代表三维生成费用或吞吐。官方2026年P100退役公告确认普通免费GPU目前仅T4×2，L4只限部分比赛；不要继续把P100或L4作为本账号可选方案。
- 继续提交私有稀疏卷积依赖测试：`gualwells/hostile-dragon-t4-compatibility-20261011`，硬上限1000秒，编译步骤上限650秒；不下载模型权重、不调用付费API。结果在`outputs/remote-compat/`，提交回执`outputs/compat-submission.json`。测试的v1张量shape参数少了通道维；本机源文件已纠正，但不得据v1的这一错误认定T4不兼容，需复用成功编译的wheel验证修正后算子。
- 2026-10-11访问核查：现有HF凭据对官方DINOv3与RMBG-2.0的`config.json`均返回403。已请用户在DINOv3模型页申请/接受访问条件。只读Token有效不意味着自动持有受限模型许可；正式生成不能把无许可的镜像权重当作已解决权限。
- 用户截图确认DINOv3请求已提交、待作者审核，尚未取得下载许可；审核时长未知。
- 修正shape后，独立算子Notebook复用首轮wheel，实测FP16/BF16结果有限且与密集FP32参考最大绝对误差分别0.000973/0.007806。样本仅512个体素、16通道，不推断整模型显存和速度。结果`outputs/remote-operators/dragon-compat/compatibility.json`；此时周GPU使用296.104秒，仍剩约29小时55分钟。
- 网格阶段私有Notebook`gualwells/hostile-dragon-t4-geometry-20261011`分别构建CuMesh/nvdiffrast/O-Voxel，硬上限1600秒。各轮原始日志和wheel均保留；基础硬件、小算子、网格模块、完整生成及艺术质量依次判定。
- 网格v1在CuMesh编译500秒的本地步骤时限停止，未得到wheel，不等于硬件不兼容；报告在`outputs/remote-geometry/dragon-geometry/geometry.json`。仅针对确认的超时进行了v2复核：4个编译线程、CuMesh900秒、总1900秒；保留v1回执/日志，补充详细编译日志，并挂载已有FlexGEMM wheel供后续postprocess导入。不得自动重复这个超时复核。
- v3 GPU实际环境镜像为`gcr.io/kaggle-private-byod/python@sha256:2757e0c7d1e0a9cb43da657b97e223c321a98f5014bdf64f44f2f6b083ad2b2f`，服务器回读在`outputs/server-gpu-notebook/`。带`/3`版本的私有Notebook pull返回403，但最新版本pull成功；单一此类接口失败不应解读为账号封禁。wheel与Python3.13/Torch2.11/cu128环境关联，后续环境变动需要重新确认ABI。
- 本轮没有购买、订阅、付费生成，也没有改正式项目或中断既有 HF 续作。

## 目录

- `PRODUCTION_REFERENCE.md`：已核验制作经验、失败原因、艺术门槛和试样步骤。
- `probe.py`：短时设备/算子/网络探测，不下载模型。
- `notebooks/probe/dragon-probe.ipynb`：经nbformat验证的私有试验代码；不含密钥。
- `run-kaggle.py`：账号额度、受控提交、状态读取与下载。Kaggle源码快照见`sources/source-pins.json`；试验输出在`outputs/`。
- `private/`：本机凭据，git忽略且目录ACL限当前用户/系统/管理员。任何上传都不能包含此目录。
- `runtime/`、`cache/`、`tmp/`：本次依赖、缓存及临时空间均在D；不要改为C盘默认目录。

## 执行

本机解释器：`D:\CodexStorage\workspaces\hostile-dragon-coin\kaggle-test\runtime\venv\Scripts\python.exe`。

该解释器运行`run-kaggle.py check`查询实际额度；`status`查已提交同一Notebook，`fetch`下载输出和重新查询额度。初次`push`最多预留300秒执行，不自动跨日重试。`push --retry-failed`仅允许服务器确认ERROR的已知失败，不会自动重试已经完成但无GPU的任务。

下一步实测TRELLIS.2旧卡适配：先验证依赖与算子，再决定是否下载权重和生成。原版稀疏注意力不能直接用密集SDPA的环境开关解决；两张卡显存也不能直接相加放行。输出必须即时落D保存。完整源资产与新作品均在技术/艺术验证后再决定是否纳入正式项目。`push --after-verification`只允许对已保存CPU-only且服务器COMPLETE的前一版受控重探一次，未知或运行中状态不重提。

## 验收顺序

账号可用 → 实际GPU和所需算子可用 → 输入/生成/导出/下载完整成功 → Blender灰模多角度成立 → 材质/独立动效成立 → 用户艺术采用。低档技术测试不降低最终样币标准。
