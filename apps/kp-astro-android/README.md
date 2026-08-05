# KP 即时占卜 Android · XALEN Powered

> 旧版《KP 即时占卜排盘 · LLM 辅助工具》HTML 应用的 **XALEN 重构版**，封装为 **Kotlin 原生 Android APK**。
> 网页做 UI 与计算（XALEN WASM），原生层只做 JavaScript 做不好的事（剪贴板 / 文件导出 / 分享 / Toast / 振动）。

[![Build APK](https://github.com/328467824bot/kp-divination-android/actions/workflows/build.yml/badge.svg)](.github/workflows/build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

## 这是什么

一个**纯离线**的 KP (Krishnamurti Paddhati) 占星即时排盘工具，特点：

- **计算引擎**：[XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) — 纯 Rust 天文库，编译为 WebAssembly 在 WebView 内运行
- **UI**：深色主题网页（HTML + 原生 JS），打包在 APK 的 `assets/web/` 中
- **复制 / 导出 / 分享**：通过 `@JavascriptInterface` 走 Android 原生接口（`ClipboardManager` / `Intent.ACTION_SEND` / `Storage Access Framework`）
- **完全离线**：无任何网络请求，无 INTERNET 权限，所有资源（HTML/JS/CSS/WASM）内置

### 与现有 `kp-astro-android` 的区别

| 维度 | kp-astro-android（已有） | kp-divination-android（本项目） |
|---|---|---|
| 架构 | 纯原生 Compose UI + JNI 桥 | **WebView 混合**（网页 + 原生壳） |
| 计算调用 | Rust → JNI → Kotlin 直接调用 | Rust → WASM → JS（在 WebView 内） |
| UI 实现 | Jetpack Compose + Material 3 | HTML + CSS + Vanilla JS |
| 复制功能 | Kotlin ClipboardManager | JS → `@JavascriptInterface` → Kotlin |
| 星历文件 | DE440S.BSP（32MB JPL 内置） | 无（XALEN 是解析公式，无数据文件） |
| 适用场景 | 高性能 / 原生体验 | 跨平台 UI 复用 / 快速迭代 / LLM 友好文本输出 |

## 功能

### KP 占星核心

- **9 行星位置**（Sun/Moon/Mercury/Venus/Mars/Jupiter/Saturn/Rahu/Ketu）
  - Sidereal 经度（Lahiri ayanamsa）
  - 星座 (Rashi) + 星座主
  - 星宿 (Nakshatra) + Pada + 星宿主
  - KP 子主 (Sub-lord) + 子之子主 (Sub-sub-lord)
  - 逆行标记

- **7 大统治星 (Ruling Planets, RP)**
  - 上升星座主 / 上升星宿主
  - 月亮星座主 / 月亮星宿主
  - 星期主星
  - Rahu/Ketu 代理规则
  - 强度评分（吉凶 + 自我主宰 + 逆行）

- **五层征象星 (Significators)** — 12 宫逐一分析
  - 落座主星 / 同宫星 / 相位星 / 星宿主 / 深层星主

- **数字起卦 (1-249)** — KP 编号到星宿映射

- **Vimshottari 推运** — 当前大运 (Mahadasha) / 副运 (Antardasha)

- **Panchang** — Tithi / Vara / Nakshatra / Yoga / Karana

### 应用层

- **输入参数**：日期时间 + 时区 + 经纬度（GPS 自动填充）+ 数字 + 占问事项 + 性别
- **复制诊断数据**：一键复制 Markdown 格式 → 粘贴到 ChatGPT / Claude 进行 KP 解读
- **导出排盘文件**：通过 SAF（系统文件选择器）保存为 `.md` 文件
- **分享**：通过 `Intent.ACTION_SEND` 调起系统分享面板
- **振动反馈**：成功操作触发短振动

## 技术栈

| 层 | 技术 |
|---|---|
| 原生 UI 壳 | Kotlin + Android WebView（无 Compose） |
| 原生接口 | `@JavascriptInterface` 注入 `window.AndroidBridge` |
| 网页 UI | HTML5 + CSS3 + Vanilla JS (ES Modules) |
| 计算 | XALEN WASM（`xalen-wasm` crate 编译产物） |
| 降级实现 | `xalen-stub.js`（纯 JS 简化版，便于本地预览） |
| 构建 | Gradle 8.9 + AGP 8.7.2 + Kotlin 2.0.21 |
| CI | GitHub Actions：`wasm-pack` + `gradle assembleDebug` |
| minSdk | 24（Android 7.0，WebView 80+ 支持 WASM） |

## 目录结构

```
kp-divination-android/
├── web-app/                              # 网页源码（计算与 UI）
│   ├── index.html                        # 入口
│   ├── src/
│   │   ├── app.js                        # 主入口：表单事件 + Native 桥接
│   │   ├── xalen-bridge.js               # XALEN WASM 加载器 + 门面
│   │   ├── xalen-stub.js                 # 纯 JS 降级实现（本地预览用）
│   │   ├── kp-engine.js                  # KP 计算引擎（征象星/RP/dasha）
│   │   ├── ui-render.js                  # 排盘结果 UI 渲染
│   │   └── styles.css                    # 深色主题
│   └── pkg/                              # CI 注入的 XALEN WASM 产物
│       └── .gitkeep
│
├── android-app/                          # Kotlin Android WebView 壳
│   ├── settings.gradle.kts
│   ├── build.gradle.kts
│   ├── gradle.properties
│   ├── gradle/
│   │   ├── libs.versions.toml
│   │   └── wrapper/gradle-wrapper.properties
│   ├── gradlew / gradlew.bat
│   └── app/
│       ├── build.gradle.kts              # 含 syncWebApp 任务（web-app → assets/web）
│       ├── proguard-rules.pro
│       └── src/main/
│           ├── AndroidManifest.xml
│           ├── assets/web/.gitkeep       # 由 syncWebApp 自动填充
│           ├── res/                      # 图标 / 主题 / 颜色 / 字符串
│           └── java/io/zhipu/kpdivination/
│               ├── MainActivity.kt       # WebView 容器
│               ├── WebAppInterface.kt    # @JavascriptInterface：复制/分享/导出/Toast/振动
│               └── util/FileHelper.kt    # SAF 文件写入
│
├── .github/workflows/build.yml           # CI：编译 XALEN WASM + 构建 APK
└── docs/
    ├── ARCHITECTURE.md                   # 架构详解
    ├── BUILD.md                          # 本地 / CI 构建指南
    └── XALEN-INTEGRATION.md              # XALEN 集成细节
```

## 快速开始

### 用户：直接装 APK

从 [Actions 页面](https://github.com/328467824bot/kp-divination-android/actions) 下载最新构建的 `kp-divination-debug-apk` artifact，安装到 Android 7.0+ 设备即可。

### 开发者：本地运行网页预览

无需 Android Studio，直接用浏览器看 UI 与计算逻辑：

```bash
cd web-app
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

此时使用的是 `xalen-stub.js`（纯 JS 简化实现），精度不如真实 XALEN，但 KP 结构性输出（征象星 / RP / 子主）正确。

### 开发者：本地构建 APK

详见 [docs/BUILD.md](docs/BUILD.md)。简述：

```bash
# 1. 编译 XALEN WASM（需要 Rust + wasm-pack）
git clone https://github.com/vedika-io/xalen-ephemeris.git /tmp/xalen
cd /tmp/xalen/crates/xalen-wasm
wasm-pack build --target web --release
cp -v pkg/* /path/to/kp-divination-android/web-app/pkg/

# 2. 构建 APK（需要 JDK 17 + Android SDK）
cd /path/to/kp-divination-android/android-app
./gradlew assembleDebug
# 产物：app/build/outputs/apk/debug/app-debug.apk
```

## 架构亮点

### 1. JS ↔ Kotlin 桥接（复制功能原生实现）

```kotlin
// WebAppInterface.kt
@JavascriptInterface
fun copyToClipboard(text: String?): Boolean {
    val clip = ClipData.newPlainText("KP Divination", text)
    clipboardManager.setPrimaryClip(clip)
    return true
}
```

```javascript
// web-app/src/app.js
const Native = {
  async copy(text) {
    if (window.AndroidBridge?.copyToClipboard) {
      return window.AndroidBridge.copyToClipboard(text);  // 走原生
    }
    await navigator.clipboard.writeText(text);  // 浏览器降级
  }
};
```

### 2. XALEN WASM 桥接（带降级）

```javascript
// xalen-bridge.js — 自动选择 WASM 或 stub
const candidates = ['./pkg/xalen_wasm.js', 'pkg/xalen_wasm.js'];
for (const path of candidates) {
  try {
    const mod = await import(path);
    if (mod.XalenWasm) return new mod.XalenWasm();  // 真实 WASM
  } catch {}
}
return new XalenWasmStub();  // 降级到纯 JS
```

### 3. CI 一键构建

```yaml
# .github/workflows/build.yml
- uses: actions/checkout@v4
  with:
    repository: vedika-io/xalen-ephemeris
    path: upstream/xalen-ephemeris
- run: wasm-pack build --target web --release
  working-directory: upstream/xalen-ephemeris/crates/xalen-wasm
- run: cp -v pkg/* web-app/pkg/
- run: ./gradlew assembleDebug
  working-directory: android-app
```

## 许可

Apache-2.0（与 XALEN 主库一致）

## 致谢

- [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) — Pure-Rust 天文星历库
- [wasm-pack](https://rustwasm.github.io/wasm-pack/) — Rust → WASM 工具链
- 原 HTML 应用作者 — KP 占星逻辑参考
