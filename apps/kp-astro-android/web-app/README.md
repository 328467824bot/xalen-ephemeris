# Web App 源码

## 文件结构

```
web-app/
├── index.html              # HTML 入口（表单 + 结果容器）
├── src/
│   ├── app.js              # 主入口：表单事件 + Native 桥接 + 时间工具
│   ├── xalen-bridge.js     # XALEN WASM 加载器 + 统一门面（自动降级到 stub）
│   ├── xalen-stub.js       # 纯 JS XALEN 实现（本地预览降级用）
│   ├── kp-engine.js        # KP 计算引擎：征象星 / RP / 子主 / Markdown 生成
│   ├── ui-render.js        # 排盘结果 DOM 渲染
│   └── styles.css          # 深色主题样式
└── pkg/                    # CI 注入的 XALEN WASM 产物（gitignored）
    └── .gitkeep
```

## 本地预览

```bash
cd web-app
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

默认使用 `xalen-stub.js`（纯 JS 简化实现）。要使用真实 XALEN WASM，按 `docs/BUILD.md` 步骤编译并复制到 `pkg/`。

## Native 桥接协议

运行在 Android WebView 中时，`window.AndroidBridge` 由 `WebAppInterface.kt` 注入：

| 方法 | 签名 | 用途 |
|---|---|---|
| `copyToClipboard(text)` | `String → Boolean` | 复制到剪贴板 |
| `shareText(text)` | `String → void` | 调起系统分享 |
| `exportFile(filename, content)` | `(String, String) → void` | SAF 导出文件 |
| `showToast(message)` | `String → void` | 短 Toast |
| `showToastLong(message)` | `String → void` | 长 Toast |
| `hapticFeedback()` | `() → void` | 30ms 振动 |
| `getDeviceInfo()` | `() → String` | 设备信息 JSON |
| `isNativeBridge()` | `() → Boolean` | 探针（始终返回 true） |

在浏览器中（无 AndroidBridge）会自动降级：

- `copyToClipboard` → `navigator.clipboard.writeText` → `document.execCommand('copy')`
- `shareText` → `navigator.share` → 退化为复制
- `exportFile` → `Blob` + `<a download>` 触发浏览器下载

## 测试

```bash
# JS 语法检查
for f in src/*.js; do node --check "$f" && echo "OK: $f"; done

# 功能测试（stub + KP 引擎）
node /path/to/test-stub.js
```

预期输出：

```
=== Compute OK ===
JD: 2460893.7708
Ayanamsa: 23.8536°
Ascendant: Virgo / Uttara Phalguni Pada 3
...
=== Test passed ===
```

## 自定义主题

修改 `src/styles.css` 顶部的 CSS 变量：

```css
:root {
  --bg: #1a1626;            /* 主背景 */
  --bg-card: #251f3a;       /* 卡片背景 */
  --accent: #a78bfa;        /* 强调色（按钮/链接） */
  --accent-strong: #c4b5fd; /* 强调色（标题） */
  /* ... */
}
```

Android 端 `res/values/colors.xml` 中的颜色应与 CSS 变量保持一致，避免状态栏/导航栏颜色跳变。
