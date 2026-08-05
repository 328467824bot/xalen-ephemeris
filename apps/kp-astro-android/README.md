# KP Astrology Android App · XALEN 的 KP 占星原生 Android 壳

[![Build APK](https://github.com/328467824bot/xalen-ephemeris/actions/workflows/kp-astro-android.yml/badge.svg)](https://github.com/328467824bot/xalen-ephemeris/actions/workflows/kp-astro-android.yml)

`apps/kp-astro-android/` 是 [XALEN Ephemeris](../../) 的 **KP (Krishnamurti Paddhati) 占星 Android 应用**，原生 Android 壳 + WebView 嵌套 KP Web 应用，提供 DE440S 高精度星历下载与解析。

## 架构

```
┌──────────────────────────────────────────────────────┐
│  Android Native Shell (Kotlin)                       │
│  ├─ MainActivity.kt       — WebView 容器             │
│  ├─ De440Bridge.kt        — JS ↔ Native 桥接         │
│  ├─ De440Parser.kt        — JPL DE440S 二进制解析器  │
│  └─ AnalyticalEphemeris.kt — VSOP87 解析星历降级方案 │
└──────────────────────────────────────────────────────┘
                       ↓ @JavascriptInterface
┌──────────────────────────────────────────────────────┐
│  WebView → assets/web/                               │
│  ├─ index.html           — 主页面 + FAB 桥接面板     │
│  ├─ kp-astro.js          — Web 应用主脚本 (Kotlin/JS)│
│  ├─ kotlin-kotlin-stdlib.js                          │
│  └─ kotlinx-html.js                                 │
└──────────────────────────────────────────────────────┘
```

## 特性

### 来自原生壳
- ✅ **DE440S 高精度星历**：从 NASA JPL 下载 32MB 的 `de440s.bsp` 文件，Chebyshev 多项式插值，精度亚角秒级
- ✅ **优雅降级**：无 DE440S 文件时自动用 VSOP87 截断级数（精度 < 0.3°）
- ✅ **断点续传下载**：内存优先 + 原子写策略，支持暂停 / 继续 / 取消
- ✅ **自动加载**：DE440S 文件存到 `Android/data/com.xalen.kpastro/files/ephemeris/`，下次启动自动加载
- ✅ **Pinch-zoom**：双指缩放已开启
- ✅ **支持 Android 7.0+**（minSdk 24, targetSdk 34）

### 来自嵌套的 Web 应用（v2.0）
- ✅ **完整 KP 理论**：249 子区表、星主 / 子主 / 子子主、宫首子星分析
- ✅ **ABCDE 五级象征星**：驻守星之宿主 → 驻守星 → 宫主之宿主 → 宫主 → 相位星
- ✅ **执掌行星 RP**：日主 + 月亮宫主/宿主 + 上升宫主/宿主 + Rahu/Ketu 代理
- ✅ **Vimshottari Dasha**：大运 → 小运 → 过运 三层时间轴
- ✅ **KP Horary 问卜**：1-249 数字问卜
- ✅ **行星庙旺判定**：9 级 dignity
- ✅ **逆行判定**：中心差分计算瞬时角速度
- ✅ **5 种岁差**：KP / Lahiri / Raman / Fagan-Bradley / True Chitra，按 JD 动态计算
- ✅ **真 Placidus 宫位制**：迭代算法（含章动修正）
- ✅ **调试面板**：手动覆盖任意行星 / 宫首 / 上升点
- ✅ **JSON 导入导出**：保存 / 恢复任意星盘配置

## 构建

### 本地构建

需要：
- JDK 17+（CI 用 JDK 21）
- Android SDK 34（compileSdk）
- Gradle 8.10.2（项目自带 wrapper）

```bash
cd apps/kp-astro-android

# Debug APK
./gradlew assembleDebug
# 产物：app/build/outputs/apk/debug/app-debug.apk

# Release APK（用项目自带的 keystore 签名）
./gradlew assembleRelease
# 产物：app/build/outputs/apk/release/app-release.apk
```

### CI 构建

GitHub Actions workflow `.github/workflows/kp-astro-android.yml` 在每次推送或 PR 时自动编译 APK，并上传为 artifact。下载后可直接安装到 Android 设备。

## 安装到设备

```bash
# 下载 CI 构建的 APK artifact（zip 解压后得到 app-debug.apk 或 app-release.apk）
adb install -r app-debug.apk
```

或在 Android 设备上直接点击 APK 文件安装（需开启「未知来源应用」权限）。

## 与 XALEN Rust 库的关系

本应用是天文学算法的 **Kotlin/JS + Kotlin/Android** 双层实现：

| XALEN Rust | 本应用 Kotlin |
|---|---|
| `crates/xalen-vedic/src/kp.rs` | Web 端 `KpEngine.kt` |
| `crates/xalen-vedic/src/dasha.rs` | Web 端 `vimshottariDasha` |
| `crates/xalen-vedic/src/nakshatra.rs` | Web 端 `Nakshatra` enum |
| `crates/xalen-core/src/analytical/` | 共享 `AnalyticalEphemeris.kt` |
| `crates/xalen-jpl/de440.rs` | Android 端 `De440Parser.kt` |

**精度对比**：
- 内置 VSOP87 截断级数：太阳 < 0.01°，月亮 < 0.2°，火星 < 0.1°
- 加载 DE440S 文件后：所有行星达到亚角秒级（与 Swiss Ephemeris 同精度）

## 重新构建 Web 资源

如果修改了 Web 端 Kotlin 代码（在 `apps/kp-astro-web/`），需要重新编译并复制到 Android 的 `assets/web/`：

```bash
# 1. 构建 Web 资源
cd apps/kp-astro-web
./gradlew assembleDistrib

# 2. 复制到 Android 工程
cp build/distrib/* ../kp-astro-android/app/src/main/assets/web/

# 3. 重新编译 APK
cd ../kp-astro-android
./gradlew assembleDebug
```

## 许可证

Apache-2.0（与 XALEN 主仓库一致），见 [../../LICENSE](../../LICENSE)。

## 签名 keystore

项目自带一个调试用的 release keystore（`keystore/kp-astro-release.keystore`），密码 `kpastro123`。**仅用于开发/测试**，正式发布请替换为你自己的 keystore。

```bash
# 生成自己的 release keystore
keytool -genkeypair -v -keystore my-release.keystore -alias my-key -keyalg RSA -keysize 2048 -validity 10000

# 然后修改 keystore.properties 指向新文件
```
