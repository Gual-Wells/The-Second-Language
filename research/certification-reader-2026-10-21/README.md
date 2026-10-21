# 设置内认证阅览

2026-10-21。用户否决藏馆，直接改为设置→认证阅览→仅章号→纯享卷轴；优化音乐配置。基线为最新`origin/main`：`a0723d6e91cd3b5d1b24d16aacb015a055e5a96e`。在D盘独立工作树`codex/certification-reader`施工，没有修改正在运行的维护／日课副本，也没有将旧实验分支的主壳覆盖回主线。

## 本轮实现

- 设置“阅读”组新增入口；列表仅第一章、第五章两个按钮，无标题、日期或额外说明。只是实际既有作品，不按正式章节总数伪造空作品。
- 独立占满视口的阅览层，暗色中性背景，原皮扣／纸面／雾染；无柜景、取放或归藏。返回、声音短暂显示后自隐，触碰／键盘恢复，隐藏后不可点击／聚焦。
- 首章真实v12纸面与第五章真实v14纸面分别恢复，共用v19机构、做旧和v20雾染。第一章摘要`590cc91ffca8634b7864f24825afbfc3f5fb286de5321087edd2c336f74732ea`，第五章`a2a75215f25dc0fc40f047fd6f6648a4625ae13be7b3fa2ffca5fe72e37f43a0`。
- 两份均保持未颁发、固定样品时间及原有文字；没有真实通过事件，没有虚构新认证、历史补领或新收费任务。
- 目录不载入三维、HDR、音频；选章后才动态加载运行器。切章释放旧器物资源、取消晚到结果，新画布避免旧context回调干扰。
- 单曲A New Town，音乐与拟音各有开关／独立音量，保存偏好。开合不重新播放；曲尾完整结束后1.8秒留白，不宣传无缝循环。离开停止，后台暂停，用户关闭不被系统恢复覆盖。当前仍需人工听审与真实iPhone核对。
- 声音运行资源14项约1.56MiB；下载派生皮扣2.33MiB，保留几何与UV，等最终v19材质和预热完成才开放操作。没有复制旧馆曲、柜景纹理或家具。

## 适配发现

旧v12章印用`im.src='../chapter-scroll-v10/…'`，此前只在实验子目录打开可用；主站根页面会请求错误根路径。本轮把拷入主线的来源模块改成`new URL(...,import.meta.url)`，不改印模、像素处理与原章摘要。模板字体、纸胚、法线、粗糙度、饰画均解析为绝对URL。`imported-craft.json`记录来自旧实验分支的源字节；viewer和URL适配文件是有意后的修改，不能把该表解释为全部最终文件未变。

主壳、模块URL、图标清单和Service Worker统一升v36。新增轻量宿主／声音模块进壳缓存；重型运行器和素材仍按章请求，没有把全套三维加入安装预缓存。普通正文纯净阅读几何及手势不变。

## 验证与恢复

`scripts/verify-certification-reader.mjs`在真实主壳上隔离模拟空demo登录，只读真实卷轴与录音；不向真实账户造数据。检查设置入口、纯编号、懒载、两章不同摘要、实际开合、音乐继续、独立音量、关闭后不复活、返回单模态、横竖屏、无旧馆资源及无认证写入。截图及`verification.json`在本目录。音频独立验证另保存`.cache/certification-reader-audio/verification.json`；技术可用不等于艺术听审或真机帧率通过。

```text
node scripts/build-certification-reader.mjs
node scripts/serve-scroll-lab.mjs
node scripts/verify-certification-reader.mjs http://127.0.0.1:8153
# 先暂存本任务资源，再按暂存区计算发布字节，避免Windows换行差异
node scripts/package-certification-reader.mjs
```

发布脚本从固定HEAD归档web和Pages网关，校验展示清单；不部署独立API Worker。正式通过→制作→审阅→私有封存→申领仍不由这个只读入口冒充实现。现行交互与后续作品规范见`protocol/CERTIFICATION_READER.md`。
