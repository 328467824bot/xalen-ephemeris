# KP Astrology Web App · 基于 XALEN 的 KP 占星 Web 实现

[![Build](https://github.com/328467824bot/xalen-ephemeris/actions/workflows/kp-astro-web.yml/badge.svg)](https://github.com/328467824bot/xalen-ephemeris/actions/workflows/kp-astro-web.yml)

`apps/kp-astro-web/` 是 [XALEN Ephemeris](../../) 的 **KP (Krishnamurti Paddhati) 占星 Web 应用**，将 XALEN Rust 库的 KP 算法移植到 Kotlin/JS，提供纯前端、零依赖的占星排盘工具。

## 特性

- ✅ **真星历**：VSOP87 截断级数 + Meeus 太阳/月亮公式，精度 < 0.1°-0.3°（vs JPL DE440）
- ✅ **完整 KP 理论**：249 子区表、星主 / 子主 / 子子主、宫首子星分析
- ✅ **ABCDE 五级象征星**：驻守星之宿主 → 驻守星 → 宫主之宿主 → 宫主 → 相位星
- ✅ **执掌行星 RP**：日主 + 月亮宫主/宿主 + 上升宫主/宿主 + Rahu/Ketu 代理
- ✅ **Vimshottari Dasha**：大运 → 小运 → 过运 三层时间轴
- ✅ **KP Horary 问卜**：1-249 数字问卜，虚拟月亮 + 真实行星
- ✅ **行星庙旺判定**：9 级 dignity（Exalted/Moolatrikona/OwnSign/.../Debilitated）
- ✅ **逆行判定**：中心差分计算瞬时角速度
- ✅ **5 种岁差**：KP / Lahiri / Raman / Fagan-Bradley / True Chitra，按 JD 动态计算
- ✅ **真 Placidus 宫位制**：迭代算法（含章动修正）
- ✅ **调试面板**：手动覆盖任意行星 / 宫首 / 上升点
- ✅ **JSON 导入导出**：保存 / 恢复任意星盘配置

## 快速开始

### 本地构建

```bash
cd apps/kp-astro-web
./gradlew assembleDistrib    # 编译并打包到 build/distrib/
./gradlew nodeTest           # 跑 49 个不变式测试
```

构建产物在 `build/distrib/`，包含：

| 文件 | 说明 |
|---|---|
| `index.html` | 主页面 |
| `kp-astro.js` | 应用主脚本（Kotlin/JS 编译产物） |
| `kotlin-kotlin-stdlib.js` | Kotlin 标准库 |
| `kotlinx-html.js` | kotlinx-html DOM 构建库 |

### 本地预览

```bash
cd apps/kp-astro-web/build/distrib
python3 -m http.server 8888
# 浏览器打开 http://localhost:8888/
```

## 使用指南

应用分四个 Tab：

### 1. 星盘 Tab
输入出生时刻 / 经纬度 / 岁差 / 宫位制，点击「排 KP 星盘」即可看到：
- 9 颗 Vedic 行星的完整 KP 位置（黄经、星座、星宿、Pada、宫主、宿主、子主、子子主、KP 号、神祇、Gana、逆行状态、庙旺）
- 12 宫宫首子星分析（吉/凶/混合判定）
- 9 颗行星的象征星表（按 ABCDE 强弱排序）
- 执掌行星 RP（含 Rahu/Ketu 代理）
- 8 类人生事项承诺判定（婚姻/工作/健康/生育/学业/出国/财富/诉讼）

### 2. Dasha Tab
显示从月亮位置起算的 Vimshottari Dasha 完整时间轴：
- 大运（Mahadasha）—— 9 段，覆盖 120 年
- 小运（Antardasha）—— 每大运 9 段
- 过运（Pratyantardasha）—— 每小运 9 段
- 当前 Dasha 高亮显示

### 3. Horary Tab
KP 经典数字问卜：
- 心里默想一个问题
- 输入 1-249 之间的数字
- 该数字对应固定的恒星黄经，作为「虚拟月亮」
- 配合当前实际行星位置生成问卜盘
- 显示事项判定 / RP / 宫首子星 / 行星位置

### 4. 调试 Tab
- 手动覆盖任意行星位置（恒星黄经）
- 手动覆盖 12 个宫首度数
- 手动覆盖上升点
- 排盘后显示中间计算值：JD / LST / RAMC / 章动 / 黄赤交角 / 行星瞬时角速度

## 与 XALEN Rust 库的关系

本应用的 KP 算法 1:1 移植自 XALEN 的 Rust 实现：

| XALEN Rust | 本应用 Kotlin |
|---|---|
| `crates/xalen-vedic/src/kp.rs` | `KpEngine.kt` |
| `crates/xalen-vedic/src/dasha.rs` | `KpEngine.kt`（`vimshottariDasha` 函数） |
| `crates/xalen-vedic/src/nakshatra.rs` | `KpEngine.kt`（`Nakshatra` enum + 扩展函数） |
| `crates/xalen-core/src/analytical/` | `AnalyticalEphemeris.kt` |

**差异**：
- XALEN Rust 版使用 JPL DE440 二进制星历文件（亚角秒精度）
- 本应用使用 VSOP87 截断级数（< 0.3° 精度）—— **无需任何外部数据文件**
- XALEN 的 WASM 绑定（`crates/xalen-wasm/`）可替换本应用的解析星历，达到瑞士星历级精度

## 测试

49 个单元测试覆盖了 Rust 版的所有不变式（移植自 Rust 的 29 个测试 + 新增 20 个）：

- 249 子区表完整性（全黄道 0.01° 扫描，每个 KP 号 1-249 都必须被命中）
- 5 级象征星计算
- Vimshottari Dasha 周期长度（120 年）和序列
- Nakshatra 边界、Pada、神祇
- 行星庙旺
- Horary KP 编号边界
- 岁差动态计算
- 真星历精度（J2000 太阳 ~280°、月亮 ~218°、Ketu = Rahu + 180°）

```bash
./gradlew nodeTest          # Node.js 运行时
./gradlew browserTest       # 浏览器运行时（需 Chrome/Firefox）
```

## 技术栈

- **Kotlin 2.0.21** (JS IR backend)
- **kotlinx-html-js 0.11.0** — DOM 构建
- **Gradle 8.10.2** — 构建工具
- **无任何运行时依赖** — 纯静态 JS 文件，可直接部署到 GitHub Pages / 任何 HTTP 服务器

## 路线图

- [ ] 替换为 `xalen-wasm` 绑定，达到瑞士星历级精度
- [ ] 加入 Divisional Charts（D9 / D10 / D12 等）
- [ ] 加入 Transits（过运推运）
- [ ] 加入 Ashtakavarga（八面点）
- [ ] 加入 Tajaka（年运盘）
- [ ] 部署到 GitHub Pages

## 许可证

Apache-2.0（与 XALEN 主仓库一致），见 [../../LICENSE](../../LICENSE)。
