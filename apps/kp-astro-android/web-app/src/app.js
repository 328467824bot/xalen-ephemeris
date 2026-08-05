/**
 * app.js — 主入口 v2
 *
 * 集成原版优点：
 *   - 顶部 pills 切换岁差/宫位制
 *   - 底部固定操作栏
 *   - Quick Copy Tag 一行复制
 *   - 折叠面板
 */

(function (global) {
  'use strict';

  const Native = {
    available: () => !!(global.AndroidBridge && typeof global.AndroidBridge.copyToClipboard === 'function'),

    async copy(text) {
      if (this.available()) {
        const ok = global.AndroidBridge.copyToClipboard(text);
        if (ok) this.haptic();
        return ok;
      }
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      }
    },

    async share(text) {
      if (this.available() && global.AndroidBridge.shareText) {
        global.AndroidBridge.shareText(text);
        this.haptic();
        return true;
      }
      if (navigator.share) {
        try { await navigator.share({ text }); return true; } catch { return false; }
      }
      return this.copy(text);
    },

    async exportFile(filename, content) {
      if (this.available() && global.AndroidBridge.exportFile) {
        global.AndroidBridge.exportFile(filename, content);
        this.haptic();
        return true;
      }
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    },

    toast(msg) {
      if (this.available() && global.AndroidBridge.showToast) {
        global.AndroidBridge.showToast(msg);
      } else {
        const el = document.getElementById('toast');
        if (el) {
          el.textContent = msg;
          el.classList.add('show');
          setTimeout(() => el.classList.remove('show'), 1800);
        } else {
          console.log('[toast]', msg);
        }
      }
    },

    haptic() {
      if (this.available() && global.AndroidBridge.hapticFeedback) {
        try { global.AndroidBridge.hapticFeedback(); } catch {}
      }
    }
  };

  // ───────────────────────── App state ─────────────────────────

  let xalen = null;
  let lastResult = null;

  // 系统切换状态
  const settings = {
    ayanamsaId: 2,    // 0=Lahiri, 2=KP (默认)
    houseSystem: 2    // 0=Whole-Sign, 2=Placidus (默认)
  };

  // ───────────────────────── Init ─────────────────────────

  async function init() {
    updateEngineStatus('loading');
    bindEvents();
    try {
      xalen = await global.XalenBridge.init();
      updateEngineStatus(xalen.mode);
      Native.toast('XALEN ' + (xalen.mode === 'wasm' ? 'WASM' : 'JS Stub') + ' 已就绪');
    } catch (e) {
      updateEngineStatus('error');
      showError('XALEN 初始化失败：' + e.message);
    }
  }

  function updateEngineStatus(mode) {
    const el = document.getElementById('engine-status');
    if (!el) return;
    el.classList.remove('loading', 'wasm', 'stub', 'error');
    if (mode === 'loading') {
      el.textContent = '正在加载 XALEN…';
      el.classList.add('loading');
    } else if (mode === 'wasm') {
      el.textContent = 'XALEN WASM';
      el.classList.add('wasm');
    } else if (mode === 'stub') {
      el.textContent = 'XALEN JS Stub (降级)';
      el.classList.add('stub');
    } else {
      el.textContent = 'XALEN 加载失败';
      el.classList.add('error');
    }
  }

  function showError(msg) {
    const err = document.getElementById('error-banner');
    if (err) { err.textContent = msg; err.style.display = 'block'; }
    console.error(msg);
  }

  function clearError() {
    const err = document.getElementById('error-banner');
    if (err) err.style.display = 'none';
  }

  // ───────────────────────── Events ─────────────────────────

  function bindEvents() {
    document.getElementById('btn-gps')?.addEventListener('click', fillGps);
    document.getElementById('btn-now')?.addEventListener('click', fillNow);
    document.getElementById('form-cast')?.addEventListener('submit', onCast);

    // Pills 切换
    document.querySelectorAll('.pill[data-group]').forEach(pill => {
      pill.addEventListener('click', () => {
        const group = pill.dataset.group;
        const value = parseInt(pill.dataset.value, 10);
        document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (group === 'aya') settings.ayanamsaId = value;
        if (group === 'house') settings.houseSystem = value;
        // 如果已经排过盘，自动重排
        if (lastResult) {
          Native.toast('已切换系统，重新排盘…');
          onCast(new Event('submit')).catch(console.error);
        }
      });
    });

    // 结果区按钮（事件委托）
    document.getElementById('result')?.addEventListener('click', onResultClick);

    // 底部固定栏按钮
    document.getElementById('btn-bar-recast')?.addEventListener('click', () => {
      document.getElementById('btn-cast').click();
    });
    document.getElementById('btn-bar-copy-llm')?.addEventListener('click', async () => {
      if (!lastResult) { Native.toast('请先排盘'); return; }
      const md = global.KpEngine.buildDiagnosticMarkdown(lastResult);
      const ok = await Native.copy(md);
      status(ok ? '已复制到剪贴板' : '复制失败');
      Native.toast(ok ? '已复制到剪贴板' : '复制失败');
    });
  }

  async function fillGps() {
    if (!navigator.geolocation) {
      Native.toast('当前环境不支持 GPS');
      return;
    }
    Native.toast('正在获取 GPS 位置…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        document.getElementById('lat').value = pos.coords.latitude.toFixed(4);
        document.getElementById('lon').value = pos.coords.longitude.toFixed(4);
        Native.toast('GPS 已填充');
      },
      err => Native.toast('GPS 失败: ' + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function fillNow() {
    const now = new Date();
    document.getElementById('year').value = now.getFullYear();
    document.getElementById('month').value = now.getMonth() + 1;
    document.getElementById('day').value = now.getDate();
    document.getElementById('hour').value = now.getHours();
    document.getElementById('minute').value = now.getMinutes();
    document.getElementById('tz').value = -now.getTimezoneOffset();
    Native.toast('已填入当前时间');
  }

  async function onCast(e) {
    if (e && e.preventDefault) e.preventDefault();
    clearError();
    if (!xalen) { showError('XALEN 尚未就绪'); return; }

    const input = readForm();
    if (!input) return;

    const btn = document.getElementById('btn-cast');
    btn.disabled = true;
    btn.textContent = '正在计算行星位置…';

    try {
      lastResult = await global.KpEngine.computeChart(xalen, input);
      global.UiRender.renderChart(document.getElementById('result'), lastResult);
      Native.toast('排盘成功');
      Native.haptic();
      // 滚动到结果
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      showError('排盘失败: ' + err.message);
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = '立即排盘';
    }
  }

  function readForm() {
    const year = parseInt(document.getElementById('year').value, 10);
    const month = parseInt(document.getElementById('month').value, 10);
    const day = parseInt(document.getElementById('day').value, 10);
    const hour = parseInt(document.getElementById('hour').value, 10);
    const minute = parseInt(document.getElementById('minute').value, 10);
    const tz = parseInt(document.getElementById('tz').value, 10);
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    const number = parseInt(document.getElementById('number').value, 10) || 0;
    const topic = document.getElementById('topic').value.trim();
    const gender = document.getElementById('gender').value;

    if (!year || !month || !day || isNaN(lat) || isNaN(lon)) {
      showError('请填写完整的日期与经纬度');
      return null;
    }
    if (lat < -90 || lat > 90) { showError('纬度范围 -90 ~ 90'); return null; }
    if (lon < -180 || lon > 180) { showError('经度范围 -180 ~ 180'); return null; }
    return {
      year, month, day, hour, minute,
      tzOffsetMin: tz, lat, lon, number, topic, gender,
      ayanamsaId: settings.ayanamsaId,
      houseSystem: settings.houseSystem
    };
  }

  async function onResultClick(e) {
    const btn = e.target.closest('button');
    if (!btn || !lastResult) return;

    if (btn.id === 'btn-copy-md') {
      const md = global.KpEngine.buildDiagnosticMarkdown(lastResult);
      const ok = await Native.copy(md);
      status(ok ? '已复制到剪贴板' : '复制失败');
      Native.toast(ok ? '已复制到剪贴板' : '复制失败');
    } else if (btn.id === 'btn-copy-quick') {
      const ok = await Native.copy(lastResult.quickTag);
      status(ok ? '已复制 Quick Tag' : '复制失败');
      Native.toast(ok ? '已复制 Quick Tag' : '复制失败');
    } else if (btn.id === 'btn-copy-text') {
      const txt = buildPlainTextSummary(lastResult);
      const ok = await Native.copy(txt);
      status(ok ? '已复制到剪贴板' : '复制失败');
      Native.toast(ok ? '已复制到剪贴板' : '复制失败');
    } else if (btn.id === 'btn-export-md') {
      const md = global.KpEngine.buildDiagnosticMarkdown(lastResult);
      const fname = makeFilename(lastResult);
      const ok = await Native.exportFile(fname, md);
      status(ok ? '已导出排盘文件: ' + fname : '导出失败');
      Native.toast(ok ? '已导出排盘文件' : '导出失败');
    } else if (btn.id === 'btn-share') {
      const txt = buildPlainTextSummary(lastResult);
      await Native.share(txt);
      status('已调起系统分享');
    }
  }

  function status(msg) {
    const el = document.getElementById('action-status');
    if (el) {
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(status._t);
      status._t = setTimeout(() => { el.classList.remove('show'); }, 2400);
    }
  }

  function buildPlainTextSummary(r) {
    const inp = r.input;
    const lines = [
      '=== KP 排盘结果 ===',
      `时间: ${inp.year}-${pad(inp.month)}-${pad(inp.day)} ${pad(inp.hour)}:${pad(inp.minute)} UTC${inp.tzOffsetMin>=0?'+':''}${inp.tzOffsetMin/60}`,
      `地点: ${inp.lat}°N, ${inp.lon}°E`,
      `数字起卦: ${inp.number || '—'}`,
      `占问: ${inp.topic || '—'}`,
      `引擎: XALEN ${r.meta.xalenMode.toUpperCase()}`,
      `岁差: ${r.meta.ayanamsa.toFixed(4)}° (${r.meta.ayanamsaId === 2 ? 'KP' : 'Lahiri'})`,
      `宫位制: ${r.meta.houseSystem === 2 ? 'Placidus' : 'Whole-Sign'}`,
      '',
      `上升: ${r.ascendant.rashiName} / ${r.ascendant.nakshatraName} Pada ${r.ascendant.pada}`,
      `上升星座主: ${r.ascendant.rashiLord} | 上升星宿主: ${r.ascendant.nakshatraLord} | 子主: ${r.ascendant.subLord}`,
      '',
      '行星位置:',
      ...global.KpEngine.PLANET_NAMES.map(n => {
        const p = r.planets[n];
        if (!p) return '';
        return `  ${n}${p.isRetrograde ? ' ℞' : ''}: ${p.longitude.toFixed(2)}° ${p.rashiName} ${p.nakshatraName} P${p.pada} | sub: ${p.subLord}`;
      }).filter(Boolean),
      '',
      '7 大统治星 (RP):',
      ...r.rulingPlanets.map((rp, i) => `  ${i+1}. ${rp.planet} — ${rp.roles.join(' + ')} (强度 ${rp.score})`),
      '',
      `大运: ${r.dasha ? r.dasha.mahadasha.lord : '—'} / 副运: ${r.dasha ? r.dasha.antardasha.lord : '—'} / 小运: ${r.dasha && r.dasha.pratyantardasha ? r.dasha.pratyantardasha.lord : '—'}`,
      '',
      `Quick Tag: ${r.quickTag}`,
      '',
      `生成: ${r.timestamp}`
    ];
    return lines.join('\n');
  }

  function makeFilename(r) {
    const inp = r.input;
    const d = `${inp.year}${pad(inp.month)}${pad(inp.day)}_${pad(inp.hour)}${pad(inp.minute)}`;
    const num = inp.number ? `n${inp.number}` : 'nox';
    return `KP排盘_${d}_${num}.md`;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  // ───────────────────────── Bootstrap ─────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.KpApp = { Native, get lastResult() { return lastResult; }, get settings() { return settings; } };
})(typeof window !== 'undefined' ? window : globalThis);
