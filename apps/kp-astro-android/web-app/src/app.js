/**
 * app.js — 主入口 v3
 *
 * 功能：
 *   - 首次打开自动同步 GPS + 当前时间（仅一次）
 *   - 历史记录（localStorage，以占问事项为标题）
 *   - 数字起卦任意正整数取模（250→1, 251→2）
 *   - 5/7 RP 切换
 *   - LLM 文本在底部渲染显示
 *   - 日志功能
 *   - 全中文界面
 */

(function (global) {
  'use strict';

  // ───────────────────────── 日志 ─────────────────────────

  const Log = {
    _logs: [],
    _maxLogs: 200,
    debug(msg, data) { this._add('DEBUG', msg, data); console.log('[DEBUG]', msg, data || ''); },
    info(msg, data) { this._add('INFO', msg, data); console.log('[INFO]', msg, data || ''); },
    warn(msg, data) { this._add('WARN', msg, data); console.warn('[WARN]', msg, data || ''); },
    error(msg, data) { this._add('ERROR', msg, data); console.error('[ERROR]', msg, data || ''); },
    _add(level, msg, data) {
      const entry = { t: new Date().toISOString(), level, msg, data: data ? String(data).substring(0, 500) : '' };
      this._logs.push(entry);
      if (this._logs.length > this._maxLogs) this._logs.shift();
    },
    getAll() { return this._logs; },
    exportText() {
      return this._logs.map(l => `[${l.t}] ${l.level}: ${l.msg} ${l.data}`).join('\n');
    }
  };

  // ───────────────────────── Native bridge ─────────────────────────

  const Native = {
    available: () => !!(global.AndroidBridge && typeof global.AndroidBridge.copyToClipboard === 'function'),

    async copy(text) {
      Log.info('复制文本', text.length + ' 字符');
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
  let firstOpen = true;

  const settings = {
    ayanamsaId: 1,       // 0=Lahiri, 1=KP
    houseSystem: 2,      // 0=Whole-Sign, 2=Placidus
    rpMode: 'ksk5'       // 'ksk5' (5 RP) 或 'extended7' (7 RP)
  };

  // ───────────────────────── Init ─────────────────────────

  async function init() {
    Log.info('应用启动');
    updateEngineStatus('loading');
    bindEvents();
    loadHistory();

    try {
      xalen = await global.XalenBridge.init();
      updateEngineStatus(xalen.mode);
      Log.info('XALEN 就绪', xalen.mode);
      Native.toast('XALEN ' + (xalen.mode === 'wasm' ? 'WASM' : 'JS Stub') + ' 已就绪');
    } catch (e) {
      updateEngineStatus('error');
      showError('XALEN 初始化失败：' + e.message);
      Log.error('XALEN 初始化失败', e.message);
    }

    // 首次打开自动同步 GPS + 当前时间（仅一次）
    if (firstOpen) {
      firstOpen = false;
      Log.info('首次打开，自动同步');
      autoSyncFirstOpen();
    }
  }

  function updateEngineStatus(mode) {
    const el = document.getElementById('engine-status');
    if (!el) return;
    el.classList.remove('loading', 'wasm', 'stub', 'error');
    if (mode === 'loading') { el.textContent = '正在加载 XALEN…'; el.classList.add('loading'); }
    else if (mode === 'wasm') { el.textContent = '✅ XALEN WASM'; el.classList.add('wasm'); }
    else if (mode === 'stub') { el.textContent = '⚠ XALEN JS Stub (降级)'; el.classList.add('stub'); }
    else { el.textContent = '❌ XALEN 加载失败'; el.classList.add('error'); }
  }

  function showError(msg) {
    const err = document.getElementById('error-banner');
    if (err) { err.textContent = msg; err.style.display = 'block'; }
  }

  function clearError() {
    const err = document.getElementById('error-banner');
    if (err) err.style.display = 'none';
  }

  // ───────────────────────── 首次打开自动同步 ─────────────────────────

  function autoSyncFirstOpen() {
    // 填当前时间
    fillNow(true);

    // 尝试 GPS
    if (navigator.geolocation) {
      Log.info('尝试自动 GPS 定位');
      navigator.geolocation.getCurrentPosition(
        pos => {
          document.getElementById('lat').value = pos.coords.latitude.toFixed(4);
          document.getElementById('lon').value = pos.coords.longitude.toFixed(4);
          // 自动设置时区（基于经度估算）
          const estimatedTz = Math.round(pos.coords.longitude / 15 * 60);
          document.getElementById('tz').value = estimatedTz;
          Log.info('GPS 自动定位成功', pos.coords.latitude + ',' + pos.coords.longitude);
          Native.toast('已自动定位并同步时间');
        },
        err => {
          Log.warn('GPS 自动定位失败', err.message);
          // 不报错，用户可手动填
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      Log.warn('不支持 GPS');
    }
  }

  // ───────────────────────── Events ─────────────────────────

  function bindEvents() {
    document.getElementById('btn-gps')?.addEventListener('click', () => fillGps(false));
    document.getElementById('btn-now')?.addEventListener('click', () => fillNow(false));
    document.getElementById('form-cast')?.addEventListener('submit', onCast);

    // Pills 切换（岁差/宫位/RP）
    document.querySelectorAll('.pill[data-group]').forEach(pill => {
      pill.addEventListener('click', () => {
        const group = pill.dataset.group;
        const value = group === 'rp' ? pill.dataset.value : parseInt(pill.dataset.value, 10);
        document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (group === 'aya') settings.ayanamsaId = value;
        else if (group === 'house') settings.houseSystem = value;
        else if (group === 'rp') settings.rpMode = value;
        Log.info('切换设置', group + '=' + value);
        if (lastResult) {
          Native.toast('已切换，重新排盘…');
          onCast(new Event('submit')).catch(console.error);
        }
      });
    });

    document.getElementById('result')?.addEventListener('click', onResultClick);

    document.getElementById('btn-bar-recast')?.addEventListener('click', () => {
      document.getElementById('btn-cast').click();
    });

    document.getElementById('btn-bar-copy-llm')?.addEventListener('click', async () => {
      if (!lastResult) { Native.toast('请先排盘'); return; }
      const md = global.KpEngine.buildLLMText(lastResult);
      const ok = await Native.copy(md);
      Native.toast(ok ? '已复制 LLM 文本' : '复制失败');
    });

    // LLM 文本展开/收起
    document.getElementById('btn-toggle-llm')?.addEventListener('click', () => {
      const c = document.getElementById('llm-content');
      if (c) c.style.display = c.style.display === 'none' ? 'block' : 'none';
    });

    // 清空历史
    document.getElementById('btn-clear-history')?.addEventListener('click', () => {
      if (confirm('确定清空所有历史记录？')) {
        localStorage.removeItem('kp_history');
        loadHistory();
        Native.toast('已清空历史记录');
      }
    });
  }

  // ───────────────────────── GPS ─────────────────────────

  async function fillGps(silent) {
    if (!navigator.geolocation) {
      if (!silent) Native.toast('当前环境不支持 GPS');
      return;
    }
    if (!silent) Native.toast('正在获取 GPS 位置…');
    Log.info('手动 GPS 定位');
    navigator.geolocation.getCurrentPosition(
      pos => {
        document.getElementById('lat').value = pos.coords.latitude.toFixed(4);
        document.getElementById('lon').value = pos.coords.longitude.toFixed(4);
        const estimatedTz = Math.round(pos.coords.longitude / 15 * 60);
        document.getElementById('tz').value = estimatedTz;
        Log.info('GPS 成功', pos.coords.latitude + ',' + pos.coords.longitude);
        Native.toast('GPS 定位成功');
      },
      err => {
        Log.error('GPS 失败', err.message + ' (code=' + err.code + ')');
        let msg = 'GPS 失败: ' + err.message;
        if (err.code === 1) msg = 'GPS 权限被拒绝，请手动填写经纬度';
        else if (err.code === 2) msg = 'GPS 位置不可用，请手动填写';
        else if (err.code === 3) msg = 'GPS 超时，请重试或手动填写';
        Native.toast(msg);
        if (!silent) showError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  // ───────────────────────── 当前时间 ─────────────────────────

  function fillNow(silent) {
    const now = new Date();
    document.getElementById('year').value = now.getFullYear();
    document.getElementById('month').value = now.getMonth() + 1;
    document.getElementById('day').value = now.getDate();
    document.getElementById('hour').value = now.getHours();
    document.getElementById('minute').value = now.getMinutes();
    document.getElementById('second').value = now.getSeconds();
    document.getElementById('tz').value = -now.getTimezoneOffset();
    if (!silent) Native.toast('已填入当前时间');
    Log.info('填入当前时间', now.toISOString());
  }

  // ───────────────────────── 排盘 ─────────────────────────

  async function onCast(e) {
    if (e && e.preventDefault) e.preventDefault();
    clearError();
    if (!xalen) { showError('XALEN 尚未就绪'); return; }

    const input = readForm();
    if (!input) return;

    Log.info('开始排盘', JSON.stringify(input));
    const btn = document.getElementById('btn-cast');
    btn.disabled = true;
    btn.textContent = '正在计算…';

    try {
      lastResult = await global.KpEngine.computeChart(xalen, input);
      global.UiRender.renderChart(document.getElementById('result'), lastResult);
      Native.toast('排盘成功');
      Native.haptic();

      // 显示 LLM 文本
      showLLMText(lastResult);

      // 保存历史记录
      saveHistory(input);

      // 滚动到结果
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      Log.info('排盘成功');
    } catch (err) {
      showError('排盘失败: ' + err.message);
      Log.error('排盘失败', err.message + ' | ' + err.stack);
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
    const second = parseInt(document.getElementById('second').value, 10) || 0;
    const tz = parseInt(document.getElementById('tz').value, 10);
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    let number = parseInt(document.getElementById('number').value, 10) || 0;
    const topic = document.getElementById('topic').value.trim();
    const gender = document.getElementById('gender').value;

    if (!year || !month || !day || isNaN(lat) || isNaN(lon)) {
      showError('请填写完整的日期与经纬度');
      return null;
    }
    if (lat < -90 || lat > 90) { showError('纬度范围 -90 ~ 90'); return null; }
    if (lon < -180 || lon > 180) { showError('经度范围 -180 ~ 180'); return null; }

    // 数字起卦取模：任意正整数 → 1-249
    if (number > 0) {
      number = ((number - 1) % 249) + 1;
      Log.info('数字起卦取模', document.getElementById('number').value + ' → ' + number);
    }

    return {
      year, month, day, hour, minute, second,
      tzOffsetMin: tz, lat, lon, number, topic, gender,
      ayanamsaId: settings.ayanamsaId,
      houseSystem: settings.houseSystem,
      rpMode: settings.rpMode
    };
  }

  // ───────────────────────── LLM 文本显示 ─────────────────────────

  function showLLMText(result) {
    const section = document.getElementById('llm-section');
    const content = document.getElementById('llm-content');
    if (!section || !content) return;
    const md = global.KpEngine.buildLLMText(result);
    // 简单 Markdown → HTML 渲染
    content.innerHTML = renderMarkdown(md);
    section.style.display = 'block';
    content.style.display = 'block';  // 默认展开
    Log.info('LLM 文本已显示', md.length + ' 字符');
  }

  // 极简 Markdown 渲染（不依赖外部库）
  function renderMarkdown(md) {
    let html = esc(md);
    // 表格
    html = html.replace(/^\|(.+)\|\s*$/gm, (m) => {
      return '<tr>' + m.split('|').slice(1, -1).map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>';
    });
    html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="kp-table md-table">$1</table>');
    // 标题
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // 粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 列表
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    // 段落（连续空行分段）
    html = html.split(/\n\n+/).map(p => {
      if (p.match(/^<(h\d|ul|table|tr)/)) return p;
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    return '<div class="md-body">' + html + '</div>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ───────────────────────── 历史记录 ─────────────────────────

  function saveHistory(input) {
    try {
      const records = JSON.parse(localStorage.getItem('kp_history') || '[]');
      const title = input.topic || '未命名';
      const record = {
        id: Date.now(),
        title: title,
        time: `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(input.minute)}`,
        input: {
          year: input.year, month: input.month, day: input.day,
          hour: input.hour, minute: input.minute, second: input.second || 0,
          tzOffsetMin: input.tzOffsetMin, lat: input.lat, lon: input.lon,
          number: input.number, topic: input.topic, gender: input.gender,
          ayanamsaId: input.ayanamsaId, houseSystem: input.houseSystem,
          rpMode: input.rpMode
        }
      };
      records.unshift(record);
      if (records.length > 50) records.pop();
      localStorage.setItem('kp_history', JSON.stringify(records));
      loadHistory();
      Log.info('历史记录已保存', title);
    } catch (e) {
      Log.error('保存历史记录失败', e.message);
    }
  }

  function loadHistory() {
    const bar = document.getElementById('history-bar');
    const list = document.getElementById('history-list');
    if (!bar || !list) return;
    try {
      const records = JSON.parse(localStorage.getItem('kp_history') || '[]');
      if (records.length === 0) { bar.style.display = 'none'; return; }
      bar.style.display = 'block';
      list.innerHTML = records.map(r => {
        const num = r.input.number ? ' #' + r.input.number : '';
        return `<div class="history-item" data-id="${r.id}">
          <span class="history-title">${esc(r.title)}${num}</span>
          <span class="history-time">${esc(r.time)}</span>
          <button class="btn history-del" data-id="${r.id}" style="padding:1px 6px;font-size:10px">✕</button>
        </div>`;
      }).join('');

      // 点击恢复
      list.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('history-del')) return;
          const id = parseInt(item.dataset.id, 10);
          restoreHistory(id);
        });
      });
      // 删除
      list.querySelectorAll('.history-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = parseInt(btn.dataset.id, 10);
          deleteHistory(id);
        });
      });
    } catch (e) {
      Log.error('加载历史记录失败', e.message);
    }
  }

  function restoreHistory(id) {
    try {
      const records = JSON.parse(localStorage.getItem('kp_history') || '[]');
      const r = records.find(x => x.id === id);
      if (!r) return;
      const inp = r.input;
      document.getElementById('year').value = inp.year;
      document.getElementById('month').value = inp.month;
      document.getElementById('day').value = inp.day;
      document.getElementById('hour').value = inp.hour;
      document.getElementById('minute').value = inp.minute;
      document.getElementById('second').value = inp.second || 0;
      document.getElementById('tz').value = inp.tzOffsetMin;
      document.getElementById('lat').value = inp.lat;
      document.getElementById('lon').value = inp.lon;
      document.getElementById('number').value = inp.number || '';
      document.getElementById('topic').value = inp.topic || '';
      document.getElementById('gender').value = inp.gender || 'male';
      // 恢复设置
      if (inp.ayanamsaId) {
        settings.ayanamsaId = inp.ayanamsaId;
        updatePills('aya', inp.ayanamsaId);
      }
      if (inp.houseSystem) {
        settings.houseSystem = inp.houseSystem;
        updatePills('house', inp.houseSystem);
      }
      if (inp.rpMode) {
        settings.rpMode = inp.rpMode;
        updatePills('rp', inp.rpMode);
      }
      Native.toast('已恢复历史记录: ' + r.title);
      Log.info('恢复历史记录', r.title);
    } catch (e) {
      Log.error('恢复历史记录失败', e.message);
    }
  }

  function deleteHistory(id) {
    try {
      let records = JSON.parse(localStorage.getItem('kp_history') || '[]');
      records = records.filter(r => r.id !== id);
      localStorage.setItem('kp_history', JSON.stringify(records));
      loadHistory();
      Native.toast('已删除');
    } catch (e) {
      Log.error('删除历史记录失败', e.message);
    }
  }

  function updatePills(group, value) {
    document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => {
      const v = group === 'rp' ? p.dataset.value : parseInt(p.dataset.value, 10);
      p.classList.toggle('active', v == value);
    });
  }

  // ───────────────────────── 按钮事件 ─────────────────────────

  async function onResultClick(e) {
    const btn = e.target.closest('button');
    if (!btn || !lastResult) return;

    if (btn.id === 'btn-copy-md' || btn.id === 'btn-copy-quick') {
      const text = btn.id === 'btn-copy-quick' ? lastResult.quickTag : global.KpEngine.buildLLMText(lastResult);
      const ok = await Native.copy(text);
      Native.toast(ok ? '已复制到剪贴板' : '复制失败');
    } else if (btn.id === 'btn-export-md') {
      const md = global.KpEngine.buildLLMText(lastResult);
      const fname = makeFilename(lastResult);
      const ok = await Native.exportFile(fname, md);
      Native.toast(ok ? '已导出: ' + fname : '导出失败');
    } else if (btn.id === 'btn-share') {
      await Native.share(global.KpEngine.buildLLMText(lastResult));
    }
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

  global.KpApp = {
    Native, Log,
    get lastResult() { return lastResult; },
    get settings() { return settings; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
