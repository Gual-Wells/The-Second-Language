# 第五章 · 雾染运动样品 v20

私人章节纪念手稿试样，尚未颁发。纸面、文书、机构、解扣及做旧材质均复用[v19](../chapter-scroll-v19/CREDITS.md)，本轮调整独立的雾染层。

- 继续运行本项目已保存的[Pavel Dobryakov WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) MIT求解器；未另造压力投影和平流核心。
- 噪声继续使用项目保存的Ashima/Gustavson MIT实现。
- [Bridson、Hourihan、Nordenstam，Curl-Noise for Procedural Fluid Flow](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf)：在取旋度之前调制流函数，组合局部流动与对象带动。应用于本样品的画面流场，不声称复刻论文的完整边界实现。
- [GPU Gems第38章](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu)与[GPU Gems 3第30章](https://developer.nvidia.com/gpugems/gpugems3/part-v-physics-simulation/chapter-30-real-time-simulation-and-rendering-3d-fluids)：核对平流、投影、涡量补偿及显示细节的职责。本轮没有加入三维体积求解或MacCormack平流。

新增场景适配代码：宽尺度漂移、狭长局部流动、各自变化的阵性速度、交错聚散、纸缘和皮扣的有限尾流。没有固定单向入口。仍是二维雾染近似，不是空气湿度/凝结或完整流固耦合仿真。

没有新订阅、收费模型、付费素材或Kaggle任务。研究、旧版回查和实际证据见仓库`research/scroll-mist-v20-2026-10-20/README.md`。
