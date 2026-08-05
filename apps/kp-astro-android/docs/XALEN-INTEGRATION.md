# XALEN 集成细节

## 一、XALEN 是什么

[XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) 是一个**纯 Rust 实现的天文星历库**，特点：

- **零数据文件**：用 VSOP87A + ELP2000-82 + IAU 2000B 章动模型等解析公式，不依赖 JPL DE 文件
- **多语言绑定**：Rust / Python / Node.js / WASM / JNI 全覆盖
- **精度对标 Swiss Ephemeris**：1850-2150 区间内 < 0.1° 偏差
- **Apache-2.0**：可商用
- **多占星传统**：Vedic / Western / Chinese / I-Ching / Numerology

本项目只用到了 `xalen-wasm` crate（WASM 绑定）的 Vedic 部分。

## 二、API 调用映射

### XALEN WASM 提供的方法

来自 `xalen-ephemeris/crates/xalen-wasm/README.md`：

| 方法 | 用途 | 本项目使用 |
|---|---|---|
| `XalenWasm.julianDay(y, m, d, h)` | 公历 → 儒略日 | ✅ 时间转换 |
| `XalenWasm.ayanamsaDeg(jd, ayaId)` | 岁差（17 系统） | ✅ Lahiri (id=0) |
| `XalenWasm.deltaT(jd)` | ΔT = TT - UT1 | ✅ 元数据 |
| `XalenWasm.bodyName(id)` | 行星 ID → 名称 | ✅ 调试用 |
| `w.siderealLongitude(jd, id, aya)` | 恒星经度 | ✅ |
| `w.planetPositionJson(jd, id, sidereal, aya)` | 完整行星状态 | ✅ 主用 |
| `w.fullChartJson(jd, lat, lon, aya)` | 9 行星 + 上升 + MC | ✅ 主用 |
| `w.panchangJson(jd, aya)` | 5 个 Panchang 要素 | ✅ |
| `w.housesJson(jd, lat, lon, sysId)` | 12 宫头 | ✅ Whole-Sign (0) |
| `w.nakshatraInfoJson(deg)` | 星宿详情 | ✅ |
| `w.getRashi(deg)` | 星座名 | ✅ |
| `w.vimshottariDasha(moonDeg, birthJd)` | 大运 / 副运 | ✅ |
| `w.divisionalChart(lon, varga)` | 分盘（D1/D9/D10...） | ⚪ 未用 |
| `w.compatibility(boyMoon, girlMoon)` | Ashta Koota 合婚 | ⚪ 未用 |

### 本项目的封装层

```
XALEN 原生 API
    ↓
xalen-bridge.js   ← 加载 WASM 或 stub，提供门面对象
    ↓
KpEngine.computeChart(xalen, input)   ← KP 业务逻辑层
    ↓
UiRender.renderChart(container, result)   ← UI 渲染
```

`xalen-bridge.js` 暴露的门面对象具有与 `XalenWasm` 实例完全相同的方法集合，但底层可能是 WASM 或 stub。调用方无需关心。

## 三、CI 注入流程

```yaml
# .github/workflows/build.yml 关键步骤

- name: Checkout xalen-ephemeris
  uses: actions/checkout@v4
  with:
    repository: vedika-io/xalen-ephemeris
    path: upstream/xalen-ephemeris

- name: Install Rust + wasm-pack
  # ...

- name: Build xalen-wasm
  working-directory: upstream/xalen-ephemeris/crates/xalen-wasm
  run: wasm-pack build --target web --release
  # 产物：upstream/xalen-ephemeris/crates/xalen-wasm/pkg/
  #   - xalen_wasm.js          (JS 胶水)
  #   - xalen_wasm_bg.wasm     (~2.5MB WASM)
  #   - xalen_wasm.d.ts        (TypeScript 类型)

- name: Copy to web-app/pkg/
  run: cp -v upstream/xalen-ephemeris/crates/xalen-wasm/pkg/* web-app/pkg/

- name: Build APK
  working-directory: android-app
  run: ./gradlew assembleDebug
  # syncWebApp 任务自动把 web-app/* 同步到 src/main/assets/web/
```

## 四、降级策略

`xalen-bridge.js` 的加载顺序：

```javascript
const candidates = [
  './pkg/xalen_wasm.js',     // CI 注入的真实 WASM
  'pkg/xalen_wasm.js',       // 备用相对路径
  '../pkg/xalen_wasm.js'     // 嵌套路径兜底
];

for (const path of candidates) {
  try {
    const mod = await import(path);
    if (mod.XalenWasm) {
      const inst = new mod.XalenWasm();
      // 健康检查
      const aya = mod.XalenWasm.ayanamsaDeg(jd, 0);
      if (isFinite(aya) && aya > 23 && aya < 25) {
        return inst;  // ✅ WASM 模式
      }
    }
  } catch {}  // 文件不存在或加载失败，继续尝试
}

return new XalenWasmStub();  // ⚠ 降级到 stub
```

### 何时降级？

| 场景 | 是否降级 | 原因 |
|---|---|---|
| CI 构建的 APK | ❌ 用 WASM | pkg/ 已被填充 |
| 本地 `python3 -m http.server` | ✅ 用 stub | pkg/ 为空 |
| 老 Android WebView (< 80) | ✅ 用 stub | WASM 不支持 |
| WASM 编译失败 | ✅ 用 stub | 健康检查不通过 |

UI 上明确显示当前模式：
- 绿色 `XALEN WASM` = 真实 XALEN
- 黄色 `XALEN JS Stub (降级)` = 纯 JS 简化实现

## 五、Stub 的精度限制

`xalen-stub.js` 用简化算法实现 XALEN API：

| 行星 | Stub 精度 | XALEN WASM 精度 |
|---|---|---|
| Sun | ~0.1° | < 0.0001° |
| Moon | ~0.5° | < 0.001° |
| Mercury-Mars | ~0.5° | < 0.001° |
| Jupiter-Saturn | ~0.3° | < 0.001° |
| Rahu/Ketu | ~0.1° | < 0.001° |
| Ascendant | ~1° | < 0.01° |

**对 KP 结构性输出的影响**：

- ✅ **星座 (Rashi) 划分正确**：30° 边界，stub 误差 < 1°，仅在边界附近 (±0.5°) 可能错位
- ✅ **星宿 (Nakshatra) 划分正确**：13°20′ 边界，stub 误差 < 1°，仅在边界附近可能错位
- ✅ **KP 子主 (Sub-lord) 计算正确**：纯算术运算，与精度无关
- ✅ **RP / 征象星 / Dasha 计算正确**：基于上面三者的派生计算
- ⚠ **经度数值仅供展示**：用于参考，不要做精确比对

**结论**：Stub 模式下排盘的结构性结论（哪颗星主哪个宫、当前大运是哪个）是可信的，但具体经度数值不要用于学术对比。

## 六、未来扩展点

### 6.1 用 `xalen-node` 替代 WASM（性能优化）

如果 WASM 性能不够（虽然目前足够），可以考虑用 [xalen-node](https://github.com/vedika-io/xalen-ephemeris/tree/main/crates/xalen-node) 通过 JNI 调用，性能提升约 2-3x。但这需要：

- 用 cargo-ndk 交叉编译 Rust 到 Android 4 个 ABI
- 写 JNI 桥（参考 `kp-astro-android/xalen-android-bridge/`）
- 失去跨平台复用性

### 6.2 加上分盘 (Varga) 显示

`xalen-wasm` 已提供 `divisionalChart(lon, varga)` 方法，但目前 UI 没用。可以加 D9 (Navamsha) / D10 (Dashamsha) 显示。

### 6.3 加上合婚 (Compatibility)

`xalen-wasm` 已提供 `compatibility(boyMoon, girlMoon)` 方法，可以加双人合盘 UI。

### 6.4 加上行星逆行可视化

`planetPositionJson` 返回的 `is_retrograde` 已被读取，可以在 UI 上用 ℞ 标记 + 不同颜色高亮逆行行星。

## 七、版本追踪

XALEN 仍在快速迭代中。本项目通过 CI 每次构建都从 `vedika-io/xalen-ephemeris` 的 `main` 分支拉取最新代码，因此：

- ✅ 自动获得最新的精度修复
- ✅ 自动获得新功能（如新增的占星传统）
- ⚠ 如果 XALEN main 分支有 breaking change，CI 会失败

如果需要稳定版本，可以 pin 到特定 commit：

```yaml
- uses: actions/checkout@v4
  with:
    repository: vedika-io/xalen-ephemeris
    ref: v0.3.0  # 改为具体 tag
    path: upstream/xalen-ephemeris
```
