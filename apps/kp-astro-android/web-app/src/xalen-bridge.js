/**
 * xalen-bridge.js — XALEN WASM 加载器与统一 API 门面
 *
 * 优先级：
 *   1. 真实 XALEN WASM (../pkg/xalen_wasm.js + xalen_wasm_bg.wasm)  — 由 CI 注入
 *   2. XalenWasmStub (./xalen-stub.js)                                — 本地降级
 *
 * 暴露统一异步入口 `XalenBridge.init()` 返回一个对象，具有与 XalenWasm 相同
 * 的方法集合；调用方无需关心底层是 WASM 还是 stub。
 *
 * 兼容两种运行环境：
 *   - Android WebView: assets/web/pkg/xalen_wasm.js (CI 注入)
 *   - 本地浏览器/Node: 直接加载 ../pkg/xalen_wasm.js，找不到时回退 stub
 */

(function (global) {
  'use strict';

  const XalenBridge = {
    _impl: null,
    _mode: null,   // 'wasm' | 'stub'
    _ready: null,

    /** 异步初始化，返回与 XalenWasm 等价的门面对象 */
    init() {
      if (this._ready) return this._ready;
      this._ready = this._load();
      return this._ready;
    },

    async _load() {
      // 尝试加载真实 XALEN WASM
      // 在 Android WebView 中，路径是 'pkg/xalen_wasm.js'（相对于 index.html）
      // 在浏览器预览中，可以是 './pkg/xalen_wasm.js' 或 '../pkg/xalen_wasm.js'
      const candidates = [
        './pkg/xalen_wasm.js',
        'pkg/xalen_wasm.js',
        '../pkg/xalen_wasm.js'
      ];
      for (const path of candidates) {
        try {
          // 动态 import — 如果文件不存在会抛错
          const mod = await import(path);
          if (mod.init) await mod.init();
          if (mod.XalenWasm) {
            const inst = new mod.XalenWasm();
            // 健康检查
            const jd = mod.XalenWasm.julianDay(2000, 1, 1, 12.0);
            const aya = mod.XalenWasm.ayanamsaDeg(jd, 0);
            if (typeof aya !== 'number' || !isFinite(aya)) throw new Error('invalid ayanamsa');
            this._impl = inst;
            this._implStatic = mod.XalenWasm;
            this._mode = 'wasm';
            console.info('[XalenBridge] WASM 模式已就绪 (aya@J2000 =', aya.toFixed(4) + '°)');
            return this._facade();
          }
        } catch (e) {
          // 文件不存在或加载失败，继续尝试下一个路径
          console.debug('[XalenBridge] 跳过', path, '→', e.message);
        }
      }
      // 回退到 stub
      if (!global.XalenWasmStub) {
        // 同步加载 stub
        await import('./xalen-stub.js').catch(() => {});
      }
      if (global.XalenWasmStub) {
        this._impl = new global.XalenWasmStub();
        this._implStatic = global.XalenWasmStub;
        this._mode = 'stub';
        console.warn('[XalenBridge] ⚠ 使用纯 JS stub 模式（精度受限）。CI 编译真实 WASM 后自动切换。');
        return this._facade();
      }
      throw new Error('XalenBridge: 既无法加载 XALEN WASM 也找不到 stub 实现');
    },

    /** 暴露统一的门面对象 */
    _facade() {
      const impl = this._impl;
      const stat = this._implStatic;
      // 包装函数：如果返回值是字符串，尝试 JSON.parse（XALEN WASM 返回 JSON 字符串）
      const autoParse = (fn) => (...a) => {
        const ret = fn(...a);
        if (typeof ret === 'string') {
          try { return JSON.parse(ret); } catch { return ret; }
        }
        return ret;
      };
      return {
        mode: this._mode,
        // 实例方法直接转发（JSON API 自动 parse）
        tropicalLongitude: (...a) => impl.tropicalLongitude(...a),
        siderealLongitude: (...a) => impl.siderealLongitude(...a),
        planetPositionJson: autoParse(impl.planetPositionJson.bind(impl)),
        fullChartJson: autoParse(impl.fullChartJson.bind(impl)),
        panchangJson: autoParse(impl.panchangJson.bind(impl)),
        housesJson: autoParse(impl.housesJson.bind(impl)),
        getNakshatra: (...a) => impl.getNakshatra(...a),
        nakshatraInfoJson: autoParse(impl.nakshatraInfoJson.bind(impl)),
        getRashi: (...a) => impl.getRashi(...a),
        vimshottariDasha: autoParse(impl.vimshottariDasha.bind(impl)),
        divisionalChart: (...a) => impl.divisionalChart(...a),
        compatibility: autoParse(impl.compatibility.bind(impl)),
        // 静态方法
        julianDay: (...a) => stat.julianDay(...a),
        ayanamsaDeg: (...a) => stat.ayanamsaDeg(...a),
        deltaT: (...a) => stat.deltaT(...a),
        bodyName: (...a) => stat.bodyName(...a)
      };
    }
  };

  global.XalenBridge = XalenBridge;
})(typeof window !== 'undefined' ? window : globalThis);
