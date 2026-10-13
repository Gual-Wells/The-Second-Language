# 样币本地工作室：环境与首轮工程探索

2026-10-13。任务依据：新提交《三维样币工具链重评估》、`COIN_CRAFT_TEMPORARY.md` v1.2、用户要求在旧作业副本上继续向已认可图稿修改。本文记录真实安装与实测，**不宣布新的模型成品通过**。

## 当前入口

- 工作室：`D:\CodexStorage\workspaces\hostile-dragon-coin\studio-20261013`
- 独立 Blender：`D:\CodexStorage\tools\blender-5.1.2-windows-x64\blender.exe`
- 准备母体：`outputs/studio-upper-grip-prepared.blend`
- 首轮体积试验：`outputs/studio-grip-trial-a.blend`
- 体积＋削面＋关节折痕试验：`outputs/studio-grip-trial-b.blend`
- 未改模型的真实正面：`outputs/studio-before-front.png`
- 最新真实视图：`outputs/grip-trial-b-front.png`、`outputs/grip-trial-b-quarter.png`
- 遮罩范围：`outputs/upper-grip-selection.png`。蓝色仅为诊断选择，不是上色方案。

**M authority 未晋升。** Trial A/B 是可回退工具与工程探索；全景检查显示上爪视觉提升有限，尚不能成为与认可图稿相当的产品。已经能够进行真实 Sculpt，不再只有 Lattice 搬动；仍需面向关节大形、握持轮廓与破缘接触的联合编辑。不能靠更深刻痕或随机鳞纹补足这些差异。

## 权威与保护

认可图：`D:\CodexStorage\workspaces\ai3d-design-research\design-engineering\concept-anchor-v1\assets\selected-anchor.png`。

原工程母版：`../kaggle-test/outputs/original-eye-v5/working-master.blend`。

| 原件 | SHA256（本次工作结束前再次实查） |
|---|---|
| 已认可整币稿图 | `6608204082a4036120e0c2b607fad6f27b2aa16fa3122afa37a43ac94d4f967d` |
| 旧模型母版 | `29d468975ebb83d3295f88318c3fcc505c6e73624566455c6aeded65f58b6303` |

`assets/` 内是读取副本。Trial 的主形仍来自旧整币；没有导入被否决的新版整币网格，没有重新生成整币，没有程序自由制作独立英雄爪。新爪尺度、遮挡与认可稿关系继续作为视觉目标；不能把旧爪或此次微小刷雕提升成最终审美约束。原眼、头角嘴、身体及另一只爪保护。币背本次未改，仍遵守平整背景而保留有效跨缘结构的规定。

## 实际工具能力

| 项目 | 状态与证据 |
|---|---|
| Blender 5.1.2 Windows portable | VERIFIED；官方 ZIP 与官方 SHA256 一致，独立于旧版安装 |
| 官方 Blender MCP 1.0.3 | VERIFIED；官方 addon、官方服务器、本机标准 MCP SDK 握手、26 个工具、读取真实工作室场景 |
| 直接在 ChatGPT 工具栏注册 Blender MCP | 未配置；本次使用本机 MCP SDK/官方连接客户端，不冒充原生已连接工具 |
| 后台 `--background` Sculpt | REJECTED 本机此路径；真实笔刷使进程访问冲突，不能凭外层 PowerShell exit 0 判成功 |
| 隐藏交互实例 Sculpt | VERIFIED；有真实 VIEW_3D 上下文，合成笔刷事件，不操作用户桌面鼠标键盘 |
| Draw、Scrape/Fill、Crease Polish | VERIFIED 执行与网格变化；实际艺术收益另行看全币渲染 |
| Clay Strips | 本轮首次调用返回 FINISHED 但未改变旧网格，未写为有效雕刻能力 |
| Trimesh＋SciPy 精确坐标诊断 | VERIFIED；原始分量与坐标等价后的连接结果分别保存 |
| manifold3d | 已安装；尚未实测本币 Boolean，不声称原网格能直接可靠布尔 |
| 自动语义分割、隐藏掌部、侧背推断 | 未验证；不能把前视深度选择当作完整解剖识别 |
| Kaggle/HF 新推理 | 本次未调用、未消费额度；已验证旧资产保留，云端不承担本轮交互雕刻 |

官方来源：[Blender 下载](https://download.blender.org/release/Blender5.1/)、[官方 Blender MCP](https://projects.blender.org/lab/blender_mcp)。安装记录 `environment-install.json`，标准 MCP 回执 `outputs/mcp-protocol-verification.json`，运行实际路径 `outputs/runtime-interactive.json`，依赖锁 `requirements-lock.txt`。

重建环境使用 `install-official-environment.py` 下载官方 Blender/addon/server，再用 `setup-analysis.ps1` 创建 D 盘分析 venv 并安装锁定依赖；不要在运行中的工作室上重复覆盖 addon。`sources/` 的发现材料属于实际调查回执，不是启动依赖。安装脚本不把第三方代码复制进项目公共源码。

## 新发现：导出接缝与真实破损须区分

旧 `geometry_0`：508,977 顶点，697,174 个诊断三角面。单纯按原顶点索引找连接，得到 14,878 个分量与 296,146 条开边，很容易误判成大量独立碎件。

在**不移动几何、不改变母版**的前提下，用完全相同坐标建立顶点等价：351,890 个唯一位置，157,087 个重复顶点；分量变为 396，最大主体有 684,502 个面。仍有 12,919 条开边和 1,873 条非流形边，因此既存在导出属性接缝，也存在真实需要局部处理的问题。

这为此前“分离旧碎块却留下表壳”提供了具体拓扑解释。坐标等价并非证明所有重叠处应该焊接：侧面接触、薄壳和真实重叠仍需辨认。**不得全局 merge/remesh/Boolean 修成一个完美实体再开始设计。** 本轮只对明确上爪选择区处理 1,199 个重合顶点，准备步骤检查其余受保护坐标精确保留。

诊断：`diagnose-old-mesh.py`、`diagnose-coincident-seams.py`；结果在 `outputs/mesh-diagnostics.json`、`outputs/coincident-seam-diagnostics.json`。

## 实际雕刻与失败教训

1. 中性球体上验证真实笔刷改变顶点、完整遮罩保护精确成立。这只是技术校准，不是新艺术对象。
2. 从原母体追加完整场景、原相机及光源；认可稿图作为隐藏、打包的整币参考。没有抽出单爪另造权威模型。
3. 全币内追踪两根可见上爪指节与爪面；保守深度遮罩将其与后方龙身区分。隐藏掌部还没有确定最终归属。
4. Trial A 实际 Draw 调整指节与指部体积；改变 1,964 顶点，最大位移约 0.01292（币宽约 1.0 的模型单位）。该数值不是质量评分。
5. Trial B 实际 Scrape/Fill 处理两个关节平面，Crease Polish 处理两个原有关节折痕。所有目标外保护坐标精确不变。
6. 初次渐变遮罩把少量保护区纳入了低权重过渡，保护断言失败；已回退，保护区改为完全遮罩，随后成功。不能用“位移很小”忽略非目标漂移。
7. 标准库中存在的 brush 数据块不一定是可激活资产；`Scrape` 资产激活失败，改用实查有效的 `Scrape/Fill`。
8. Blender 5.1 的场景尺寸属性为 `unprojected_size`（直径）；显式三维笔刷位置使用 `override_location=False`。真实 VIEW_3D 上下文及有意义的投影鼠标轨迹对某些笔刷重要。

本轮前/斜视已实际查看。指节平面与折痕是有限增量，整体仍接近旧作业；不把它包装为“强壮爪已经实现”，也不做上色/特效掩盖。

## 启动与恢复

```powershell
& 'D:\CodexStorage\workspaces\hostile-dragon-coin\studio-20261013\start-interactive-studio.ps1' -ResumeFile 'D:\CodexStorage\workspaces\hostile-dragon-coin\studio-20261013\outputs\studio-grip-trial-b.blend'
```

若同一工作室已运行，启动器只报告现有 PID，不另开窗口或覆盖场景。其他进程占用 9879 时拒绝替换。自有实例以 Hidden 启动且仅隐藏自己的窗口；无开机自启动。恢复指定的任务内 `.blend` 后再启 addon；保存状态不会因为控制桥初始化而被 factory scene 覆盖。

**恢复已实际验证：**关闭并重新启动自有实例，标准 MCP 重新读回 Trial B。507,778 个当前顶点与保存前坐标精确一致，其中 503,276 个保护顶点与准备母体精确一致；本机只隐藏自有窗口，检查可见窗口数为零。回执 `outputs/recovered-studio-verification.json`。

通过 `analysis-venv/Scripts/python.exe studio-mcp-client.py commands/<文件>.py` 使用标准 MCP；`studio-client.py` 是官方套接字客户端的精简入口。调用只接受本工作室 `commands/` 的文件路径；**这不是代码沙箱**，可信任务脚本仍拥有本机用户权限。服务只绑定 `127.0.0.1:9879`，不新增防火墙开放或外网服务。

`04-load-old-studio.py → 05-prepare-upper-grip.py → 06-native-grip-sculpt.py → 08-grip-plane-and-fold.py` 重现本轮探索。04/05 是从母体开始的步骤，不能对已经修改的场景盲目重复运行。每个工作文件保持独立，旧唯一母版不覆盖。

## 存储、成本、下一步

Blender、addon、MCP server、venv、下载解包、模型、缓存、临时文件、渲染和日志均在 D；已查看 Blender 实际临时与配置路径。Python 使用已有 `C:\Python314` 基础解释器，新依赖在 D 的 venv；没有全局修改 APPDATA/USERPROFILE，也没有接管系统应用。当前 C/D 剩余约 4.19/18.16 GiB（采样，后续下载仍需重查）。

**本次没有新增订阅、付费调用或云 GPU 任务。** 没有生产 PWA 或数据库更新。Blender 隐藏交互实例有本机内存与图形上下文开销；工具测试成功并不保证这台电脑适合高成本全局重拓扑。

当前 frontier：在完整旧币副本中确定上爪掌部—关节—破缘接触的编辑边界，依照认可稿做真正的大形转译，必要时局部补建拓扑；与整币 C/M 一起核对，不由前视深度自动推导背面、不强制保留旧顶点身份。然后处理另一爪与侧背连续性。此次 Trial 不强制作为后续艺术父本，可从准备母体重新开始，成功部分才合并。
