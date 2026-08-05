# 架构详解

## 总体架构

```
┌────────────────────────────────────────────────────────────────┐
│                       Android APK                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MainActivity.kt  (Kotlin)                                │  │
│  │  ──────────────────────────────────                       │  │
│  │  • WebView 配置（JS / WASM / file:// 访问）              │  │
│  │  • 沉浸式状态栏                                           │  │
│  │  • SAF 文件保存回调                                       │  │
│  │  • Back 键 → WebView.goBack()                             │  │
│  └────────────┬─────────────────────────────────────────────┘  │
│               │ addJavascriptInterface(WebAppInterface,        │
│               │                       "AndroidBridge")         │
│  ┌────────────▼─────────────────────────────────────────────┐  │
│  │  WebAppInterface.kt  (@JavascriptInterface)              │  │
│  │  ──────────────────────────────────                       │  │
│  │  • copyToClipboard(text): Boolean   ← ClipboardManager   │  │
│  │  • shareText(text): Unit            ← Intent.ACTION_SEND │  │
│  │  • exportFile(name, content): Unit  ← SAF CreateDocument │  │
│  │  • showToast(msg): Unit             ← android.widget.Toast│ │
│  │  • hapticFeedback(): Unit           ← Vibrator            │  │
│  │  • getDeviceInfo(): String           ← Build.*            │  │
│  └────────────┬─────────────────────────────────────────────┘  │
│               │ JS 调用: window.AndroidBridge.xxx()             │
│  ┌────────────▼─────────────────────────────────────────────┐  │
│  │  WebView  (assets/web/index.html)                        │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  index.html                                       │    │  │
│  │  │  ──────────                                       │    │  │
│  │  │  • 排盘参数表单（日期/时区/经纬度/数字/事项）     │    │  │
│  │  │  • 排盘结果容器（#result）                        │    │  │
│  │  └──────────────────┬───────────────────────────────┘    │  │
│  │                     │ ES Module imports                   │  │
│  │  ┌──────────────────▼───────────────────────────────┐    │  │
│  │  │  app.js  ← 主入口                                  │    │  │
│  │  │  • 表单事件 → KpEngine.computeChart                │    │  │
│  │  │  • 按钮 → Native.copy/share/exportFile             │    │  │
│  │  │  • Native 桥自动降级到 navigator.clipboard          │    │  │
│  │  └──────────────────┬───────────────────────────────┘    │  │
│  │  ┌──────────────────▼───────────────────────────────┐    │  │
│  │  │  xalen-bridge.js  ← XALEN 加载器                   │    │  │
│  │  │  • 优先：./pkg/xalen_wasm.js (WASM)                │    │  │
│  │  │  • 降级：XalenWasmStub (纯 JS)                     │    │  │
│  │  └──────────────────┬───────────────────────────────┘    │  │
│  │  ┌──────────────────▼───────────────────────────────┐    │  │
│  │  │  pkg/xalen_wasm_bg.wasm  ← XALEN WASM 二进制       │    │  │
│  │  │  (由 CI 从 xalen-ephemeris 编译注入)              │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

## 数据流

### 排盘流程

```
用户填表 → 提交
   ↓
app.js  readForm()
   ↓
KpEngine.computeChart(xalen, input)
   ├─ xalen.julianDay(y,m,d,h - tz)        ← 时间转换
   ├─ xalen.planetPositionJson(jd, id, true, 0) × 9  ← 行星位置
   ├─ xalen.fullChartJson(jd, lat, lon, 0)            ← 上升点
   ├─ xalen.housesJson(jd, lat, lon, 0)               ← 12 宫
   ├─ xalen.vimshottariDasha(moonDeg, jd)             ← 推运
   ├─ xalen.panchangJson(jd, 0)                       ← Panchang
   ├─ computeRulingPlanets(asc, planets, jd, input)   ← 7 RP
   ├─ computeSignificators(planets, houses, asc)      ← 5 层征象星
   └─ computeNumberDivination(num, asc, planets)      ← 数字起卦
   ↓
UiRender.renderChart(container, result)  ← DOM 渲染
```

### 复制流程

```
用户点 [复制诊断数据] 按钮
   ↓
app.js  onResultClick()
   ↓
KpEngine.buildDiagnosticMarkdown(result)  ← 生成 Markdown
   ↓
Native.copy(md)
   ├─ if window.AndroidBridge:  AndroidBridge.copyToClipboard(md)
   │     ↓ (Kotlin)
   │     WebAppInterface.copyToClipboard()
   │     ↓
   │     ClipboardManager.setPrimaryClip(ClipData.newPlainText(...))
   │     ↓ return true
   │     Native.haptic()  ← Vibrator.vibrate(30ms)
   │     Native.toast('已复制到剪贴板')
   │
   └─ else (浏览器):
       navigator.clipboard.writeText(md)
       ↓ fallback
       textarea + document.execCommand('copy')
```

## 模块职责

### Web 层

| 文件 | 职责 | 行数 |
|---|---|---|
| `index.html` | HTML 骨架（表单 + 结果容器） | ~70 |
| `styles.css` | 深色主题样式 | ~280 |
| `app.js` | 主入口：表单事件 / 按钮事件 / Native 桥接 / 时间工具 | ~250 |
| `xalen-bridge.js` | XALEN WASM 加载器 + 门面（自动降级） | ~100 |
| `xalen-stub.js` | 纯 JS XALEN 实现（降级用） | ~350 |
| `kp-engine.js` | KP 计算引擎（征象星 / RP / 子主 / Markdown） | ~500 |
| `ui-render.js` | 排盘结果 DOM 渲染 | ~250 |

### Kotlin 层

| 文件 | 职责 | 行数 |
|---|---|---|
| `MainActivity.kt` | WebView 容器配置 + SAF 回调 | ~200 |
| `WebAppInterface.kt` | `@JavascriptInterface` 实现 | ~170 |
| `util/FileHelper.kt` | SAF 文件写入辅助 | ~40 |

## 关键设计决策

### 1. 为什么用 WebView 而不是纯原生 Compose？

- **跨平台复用**：网页层（HTML/JS/CSS）可以原封不动跑在 iOS / 桌面 Electron / Web
- **快速迭代**：改 HTML/CSS 无需重新编译 APK，开发周期短
- **LLM 友好输出**：网页内生成的 Markdown 文本便于复制粘贴到 AI 对话框
- **与原 HTML 应用对齐**：旧版就是 HTML，迁移成本低

### 2. 为什么计算用 WASM 而不是 JNI？

- **复用 XALEN 已有的 `xalen-wasm` crate**：无需新写 JNI 桥
- **WebView 80+ 已支持 WASM**：现代 Android 设备 100% 兼容
- **隔离性更好**：WASM 在沙盒内运行，崩溃不影响原生进程
- **性能足够**：单次排盘 < 100ms，WASM 启动 < 50ms

### 3. 为什么提供 `xalen-stub.js` 降级？

- **本地开发无需 Rust 工具链**：直接 `python3 -m http.server` 就能预览
- **CI WASM 编译失败时仍可降级发布**：用户至少能体验 UI
- **算法验证**：stub 用简化算法，与 WASM 结果对比可发现集成问题
- **明确告知用户**：UI 显示 `XALEN STUB` 黄色标签，避免误用

### 4. 为什么复制功能走原生接口？

- **WebView 的 `navigator.clipboard` 在 file:// 协议下不可用**（安全限制）
- **`document.execCommand('copy')` 在 Android WebView 上不稳定**（部分机型失效）
- **原生 `ClipboardManager` 100% 可靠**，且可触发系统级复制提示
- **附带收益**：原生接口还能做 Toast / 振动反馈，体验更"原生"

### 5. 为什么导出用 SAF 而不是直接写 Downloads/？

- **Android 11+ 沙盒限制**：应用无法直接写公共目录
- **SAF 是 Google 推荐方案**：用户选择保存位置，体验一致
- **支持云盘 / OTG / 任意位置**：用户可以把排盘直接存到 Google Drive

## 性能预算

| 操作 | 预期耗时 |
|---|---|
| 冷启动（WASM 加载 + 初始化） | < 100ms |
| 单次排盘计算（含 9 行星 + 12 宫 + RP + 征象星 + Dasha） | < 50ms |
| UI 渲染（DOM 构造） | < 30ms |
| 复制操作（ClipboardManager） | < 5ms |
| APK 体积 | ~3MB（无外行星历文件） |

## 安全模型

- **无 INTERNET 权限**：APK 完全离线，无任何网络请求
- **`cleartextTrafficPermitted="false"`**：禁止明文 HTTP（虽然不用网）
- **`allowUniversalAccessFromFileURLs=true`**：仅用于加载本地 WASM（必需）
- **`@JavascriptInterface` 限制**：只暴露 6 个明确的方法，无反射风险
- **SAF 用户授权**：导出文件由用户选择位置，应用无后台文件访问权
