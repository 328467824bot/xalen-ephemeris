# 构建指南

## 一、CI 自动构建（推荐）

最简单的方式 — push 到 `main` 分支或创建 `v*` tag，GitHub Actions 会自动：

1. 检出本仓库 + xalen-ephemeris 上游
2. 用 `wasm-pack` 编译 XALEN WASM
3. 复制 WASM 产物到 `web-app/pkg/`
4. 用 Gradle 构建 APK
5. 上传为 artifact（可在 Actions 页面下载）
6. 如果是 tag，还会创建 GitHub Release

下载 APK：[Actions 页面](https://github.com/328467824bot/kp-divination-android/actions) → 选择最新 run → 下拉到 Artifacts → 下载 `kp-divination-debug-apk`

---

## 二、本地构建 APK

### 前置依赖

| 工具 | 版本 | 安装方式 |
|---|---|---|
| JDK | 17+ | `sdk install java 17.0.10-tem` (SDKMAN) |
| Android SDK | API 34 + Build Tools 34.0.0 | Android Studio 或 `sdkmanager` |
| Rust | stable | `curl https://sh.rustup.rs -sSf \| sh` |
| wasm-pack | latest | `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf \| sh` |
| Gradle | 8.9（用 wrapper 自动下载） | 无需单独安装 |

### 步骤

#### 1. 编译 XALEN WASM

```bash
# Clone xalen-ephemeris（一次性）
git clone https://github.com/vedika-io/xalen-ephemeris.git /tmp/xalen-ephemeris

# 编译 xalen-wasm crate
cd /tmp/xalen-ephemeris/crates/xalen-wasm
wasm-pack build --target web --release

# 产物在 pkg/ 下：
# - xalen_wasm.js          (JS 胶水代码)
# - xalen_wasm_bg.wasm     (WASM 二进制)
# - xalen_wasm.d.ts        (TypeScript 类型)
# - package.json / README.md

# 复制到本项目
cp -v pkg/* /path/to/kp-divination-android/web-app/pkg/
```

#### 2. 配置 Android SDK 路径

```bash
cd /path/to/kp-divination-android/android-app
cp local.properties.example local.properties
# 编辑 local.properties，加入：
# sdk.dir=/path/to/Android/Sdk
# 或者设置环境变量 ANDROID_HOME
```

#### 3. 生成 Gradle Wrapper（首次）

由于本仓库不提交 `gradle-wrapper.jar`（二进制文件），首次需要用系统 Gradle 生成：

```bash
# 方法 A: 用系统 Gradle
gradle wrapper --gradle-version 8.9 --distribution-type bin

# 方法 B: 用 Android Studio
# 打开项目，Android Studio 会自动生成 wrapper
```

或者直接安装 Gradle 8.9 然后用 `gradle` 命令构建（跳过 wrapper）。

#### 4. 构建 APK

```bash
cd /path/to/kp-divination-android/android-app

# Debug APK
./gradlew assembleDebug
# 产物：app/build/outputs/apk/debug/app-debug.apk

# Release APK（需要签名配置，见下文）
./gradlew assembleRelease
# 产物：app/build/outputs/apk/release/app-release-unsigned.apk
```

#### 5. 安装到设备

```bash
# 通过 ADB 安装
adb install -r app/build/outputs/apk/debug/app-debug.apk

# 或推到设备后手动安装
adb push app/build/outputs/apk/debug/app-debug.apk /sdcard/
```

---

## 三、本地预览网页（无 Android）

### 仅看 UI 与计算逻辑

```bash
cd /path/to/kp-divination-android/web-app
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

此时使用的是 `xalen-stub.js`（纯 JS 简化实现），UI 上会显示 `XALEN JS Stub (降级)` 黄色标签。

### 加载真实 XALEN WASM 预览

```bash
# 1. 先按上面步骤编译 XALEN WASM 到 web-app/pkg/
# 2. 启动本地服务器
cd web-app
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
# 此时 xalen-bridge.js 会自动加载 ./pkg/xalen_wasm.js
# UI 显示 "XALEN WASM" 绿色标签
```

---

## 四、Release 签名配置

### 生成签名 keystore

```bash
keytool -genkey -v -keystore kp-divination.keystore \
  -alias kp-divination -keyalg RSA -keysize 2048 -validity 10000
```

### 配置 Gradle（不提交 keystore 进仓库）

在 `android-app/` 下创建 `keystore.properties`（已 gitignore）：

```properties
storeFile=/absolute/path/to/kp-divination.keystore
storePassword=your_store_password
keyAlias=kp-divination
keyPassword=your_key_password
```

修改 `app/build.gradle.kts` 添加签名配置：

```kotlin
android {
    val keystoreProps = java.util.Properties()
    val keystoreFile = rootProject.file("keystore.properties")
    if (keystoreFile.exists()) {
        keystoreProps.load(keystoreFile.inputStream())
    }

    signingConfigs {
        create("release") {
            storeFile = file(keystoreProps.getProperty("storeFile") ?: "")
            storePassword = keystoreProps.getProperty("storePassword") ?: ""
            keyAlias = keystoreProps.getProperty("keyAlias") ?: ""
            keyPassword = keystoreProps.getProperty("keyPassword") ?: ""
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // ...
        }
    }
}
```

---

## 五、调试

### WebView 远程调试（Chrome DevTools）

Debug 构建已启用 `WebView.setWebContentsDebuggingEnabled(true)`：

1. 设备开启 USB 调试，连接电脑
2. Chrome 浏览器打开 `chrome://inspect`
3. 在 "Remote target" 下找到 `KP 即时占卜`
4. 点击 "inspect" 打开 DevTools

### 查看 JS console 日志

```bash
adb logcat -s WebConsole:* KPDivination.MainActivity:V KPDivination.WebInterface:V
```

### 查看 Kotlin 日志

```bash
adb logcat -s KPDivination:* AndroidRuntime:E
```

---

## 六、常见问题

### Q1: `gradle-wrapper.jar` 缺失？

A: 本仓库不提交二进制 jar。首次构建运行 `gradle wrapper --gradle-version 8.9`，或用 Android Studio 打开项目自动生成。CI 中已通过 `gradle/actions/setup-gradle@v4` 自动处理。

### Q2: WASM 加载失败，UI 显示 "XALEN JS Stub"？

A: 检查 `web-app/pkg/` 下是否有 `xalen_wasm.js` 和 `xalen_wasm_bg.wasm`。如果没有，按"编译 XALEN WASM"步骤生成。

### Q3: APK 安装后白屏？

A: 检查 `assets/web/` 目录是否被 `syncWebApp` 任务填充。命令行运行：
```bash
ls android-app/app/src/main/assets/web/
# 应该看到 index.html, src/, pkg/ 等
```

如果为空，手动运行：
```bash
./gradlew syncWebApp
```

### Q4: 复制功能不工作？

A: 检查 `WebAppInterface` 是否被正确注入：
- Chrome DevTools 控制台输入 `window.AndroidBridge` 应该返回对象，不是 undefined
- 输入 `window.AndroidBridge.isNativeBridge()` 应该返回 true

### Q5: WASM 在某些老设备上不工作？

A: 项目 minSdk = 24 (Android 7.0)，但 WebView 80+ 才完整支持 WASM。Android System WebView 由 Google Play 自动更新，绝大多数设备满足。如确实遇到老设备，会自动降级到 `xalen-stub.js`。

---

## 七、构建产物体积分析

预期 APK 体积约 3MB：

| 组成 | 大小 |
|---|---|
| Kotlin 原生代码（dex） | ~200 KB |
| Android 资源（图标/主题/字符串） | ~50 KB |
| 网页 HTML/CSS/JS（含 stub） | ~50 KB |
| XALEN WASM 二进制 | ~2.5 MB |
| AndroidX 库 | ~200 KB |

对比 `kp-astro-android`（~32MB，因内置 DE440S.BSP），本方案体积小 10 倍。
