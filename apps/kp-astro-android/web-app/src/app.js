/**
 * app.js v4 — 多页面架构 + 全部功能
 * 页面：home（主页）→ cast（排盘）→ history（历史）
 */
(function (global) {
  'use strict';

  const Log = {
    _logs: [],
    debug(m,d){ this._add('D',m,d); console.log('[D]',m,d||''); },
    info(m,d){ this._add('I',m,d); console.log('[I]',m,d||''); },
    warn(m,d){ this._add('W',m,d); console.warn('[W]',m,d||''); },
    error(m,d){ this._add('E',m,d); console.error('[E]',m,d||''); },
    _add(l,m,d){ this._logs.push({t:new Date().toISOString(),l,m,d:d?String(d).substring(0,500):''}); if(this._logs.length>200) this._logs.shift(); },
    getAll(){ return this._logs; }
  };

  const Native = {
    available: () => !!(global.AndroidBridge && typeof global.AndroidBridge.copyToClipboard === 'function'),
    async copy(text) {
      Log.info('复制', text.length+'字符');
      if (this.available()) { const ok = global.AndroidBridge.copyToClipboard(text); if(ok) this.haptic(); return ok; }
      try { await navigator.clipboard.writeText(text); return true; } catch {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText='position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
      }
    },
    async share(text) {
      if (this.available() && global.AndroidBridge.shareText) { global.AndroidBridge.shareText(text); this.haptic(); return true; }
      if (navigator.share) { try { await navigator.share({text}); return true; } catch { return false; } }
      return this.copy(text);
    },
    async exportFile(fn, c) {
      if (this.available() && global.AndroidBridge.exportFile) { global.AndroidBridge.exportFile(fn,c); this.haptic(); return true; }
      const b = new Blob([c],{type:'text/markdown;charset=utf-8'}); const u = URL.createObjectURL(b);
      const a = document.createElement('a'); a.href=u; a.download=fn; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(u),1000); return true;
    },
    toast(m) {
      if (this.available() && global.AndroidBridge.showToast) { global.AndroidBridge.showToast(m); return; }
      const el = document.getElementById('toast'); if(el){ el.textContent=m; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1800); }
    },
    haptic() { if (this.available() && global.AndroidBridge.hapticFeedback) { try{global.AndroidBridge.hapticFeedback();}catch{} } }
  };

  let xalen = null, lastResult = null, firstOpen = true;
  const settings = { ayanamsaId: 1, houseSystem: 2, rpMode: 'ksk5' };

  // ── 页面导航 ──
  function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const page = document.getElementById('page-' + name);
    if (page) page.style.display = 'block';
    document.getElementById('bottom-bar').style.display = (name === 'cast' && lastResult) ? 'flex' : 'none';
    window.scrollTo(0, 0);
    Log.info('页面切换', name);
  }

  // ── 初始化 ──
  async function init() {
    Log.info('应用启动');
    bindEvents();
    loadHistory();

    // 更新主页引擎状态
    const statusEl = document.getElementById('home-engine-status');
    try {
      xalen = await global.XalenBridge.init();
      if (statusEl) {
        statusEl.textContent = '✅ XALEN ' + (xalen.mode === 'wasm' ? 'WASM' : 'JS Stub') + ' 已就绪';
        statusEl.style.color = xalen.mode === 'wasm' ? 'var(--success)' : 'var(--warning)';
      }
      Log.info('XALEN就绪', xalen.mode);
    } catch(e) {
      if (statusEl) { statusEl.textContent = '❌ XALEN 加载失败'; statusEl.style.color = 'var(--danger)'; }
      Log.error('XALEN失败', e.message);
    }
  }

  function showError(msg) { const e = document.getElementById('error-banner'); if(e){e.textContent=msg;e.style.display='block';} }
  function clearError() { const e = document.getElementById('error-banner'); if(e) e.style.display='none'; }

  // ── 事件绑定 ──
  function bindEvents() {
    // 主页按钮
    document.getElementById('btn-go-cast')?.addEventListener('click', () => {
      showPage('cast');
      if (firstOpen) { firstOpen = false; autoSync(); }
    });
    document.getElementById('btn-go-history')?.addEventListener('click', () => { showPage('history'); loadHistory(); });

    // 返回按钮
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => showPage(btn.dataset.back));
    });

    // 表单提交
    document.getElementById('form-cast')?.addEventListener('submit', onCast);
    document.getElementById('btn-now')?.addEventListener('click', () => fillNow(false));
    document.getElementById('btn-gps')?.addEventListener('click', () => fillGps(false));

    // 数字起卦实时映射
    document.getElementById('number')?.addEventListener('input', updateNumberMapping);

    // Pills（岁差/宫位）
    document.querySelectorAll('.pill[data-group]').forEach(pill => {
      pill.addEventListener('click', () => {
        const g = pill.dataset.group, v = g === 'rp' ? pill.dataset.value : parseInt(pill.dataset.value,10);
        document.querySelectorAll(`.pill[data-group="${g}"]`).forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (g === 'aya') settings.ayanamsaId = v;
        else if (g === 'house') settings.houseSystem = v;
        else if (g === 'rp') settings.rpMode = v;
        if (lastResult) { Native.toast('重新排盘…'); onCast(new Event('submit')); }
      });
    });

    // 结果区按钮
    document.getElementById('result')?.addEventListener('click', onResultClick);

    // 底部栏
    document.getElementById('btn-bar-recast')?.addEventListener('click', () => document.getElementById('btn-cast').click());
    document.getElementById('btn-bar-copy-llm')?.addEventListener('click', async () => {
      if (!lastResult) { Native.toast('请先排盘'); return; }
      const ok = await Native.copy(global.KpEngine.buildLLMText(lastResult));
      Native.toast(ok ? '已复制 LLM 文本' : '复制失败');
    });

    // LLM 展开/收起
    document.getElementById('btn-toggle-llm')?.addEventListener('click', () => {
      const c = document.getElementById('llm-content');
      if (c) c.style.display = c.style.display === 'none' ? 'block' : 'none';
    });

    // 清空历史
    document.getElementById('btn-clear-history')?.addEventListener('click', () => {
      if (confirm('确定清空所有历史记录？')) { localStorage.removeItem('kp_history'); loadHistory(); Native.toast('已清空'); }
    });
  }

  // ── 数字起卦实时映射 ──
  function updateNumberMapping() {
    const raw = parseInt(document.getElementById('number').value, 10);
    const el = document.getElementById('number-mapping');
    if (!el) return;
    if (!raw || raw < 1) { el.textContent = ''; return; }
    const mapped = ((raw - 1) % 249) + 1;
    if (raw === mapped) {
      el.textContent = '';
    } else {
      el.textContent = `→ 取模后映射为 ${mapped}（${raw} mod 249）`;
      el.style.color = 'var(--accent)';
    }
  }

  // ── 首次自动同步 ──
  function autoSync() {
    fillNow(true);
    if (navigator.geolocation) {
      Log.info('自动GPS');
      navigator.geolocation.getCurrentPosition(
        pos => {
          document.getElementById('lat').value = pos.coords.latitude.toFixed(4);
          document.getElementById('lon').value = pos.coords.longitude.toFixed(4);
          document.getElementById('tz').value = Math.round(pos.coords.longitude / 15 * 60);
          Log.info('GPS成功', pos.coords.latitude+','+pos.coords.longitude);
          Native.toast('已自动定位并同步时间');
        },
        err => { Log.warn('GPS失败', err.message); },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }
  }

  // ── GPS ──
  async function fillGps(silent) {
    if (!navigator.geolocation) { if(!silent) Native.toast('不支持GPS'); return; }
    if(!silent) Native.toast('正在定位…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        document.getElementById('lat').value = pos.coords.latitude.toFixed(4);
        document.getElementById('lon').value = pos.coords.longitude.toFixed(4);
        document.getElementById('tz').value = Math.round(pos.coords.longitude / 15 * 60);
        Native.toast('定位成功');
        Log.info('GPS成功', pos.coords.latitude+','+pos.coords.longitude);
      },
      err => {
        Log.error('GPS失败', err.message+' code='+err.code);
        let msg = 'GPS失败: '+err.message;
        if (err.code===1) msg = 'GPS权限被拒绝，请手动填写经纬度';
        else if (err.code===2) msg = 'GPS位置不可用，请手动填写';
        else if (err.code===3) msg = 'GPS超时，请重试';
        Native.toast(msg); if(!silent) showError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  function fillNow(silent) {
    const n = new Date();
    document.getElementById('year').value = n.getFullYear();
    document.getElementById('month').value = n.getMonth()+1;
    document.getElementById('day').value = n.getDate();
    document.getElementById('hour').value = n.getHours();
    document.getElementById('minute').value = n.getMinutes();
    document.getElementById('second').value = n.getSeconds();
    document.getElementById('tz').value = -n.getTimezoneOffset();
    if(!silent) Native.toast('已填入当前时间');
  }

  // ── 排盘 ──
  async function onCast(e) {
    if (e?.preventDefault) e.preventDefault();
    clearError();
    if (!xalen) { showError('XALEN 尚未就绪'); return; }
    const input = readForm();
    if (!input) return;

    Log.info('排盘', JSON.stringify(input));
    const btn = document.getElementById('btn-cast');
    btn.disabled = true; btn.textContent = '计算中…';

    try {
      lastResult = await global.KpEngine.computeChart(xalen, input);
      global.UiRender.renderChart(document.getElementById('result'), lastResult);
      showLLMText(lastResult);
      saveHistory(input);
      document.getElementById('bottom-bar').style.display = 'flex';
      Native.toast('排盘成功'); Native.haptic();
      document.getElementById('result')?.scrollIntoView({behavior:'smooth',block:'start'});
      Log.info('排盘成功');
    } catch(err) {
      showError('排盘失败: '+err.message);
      Log.error('排盘失败', err.message+'|'+err.stack);
    } finally {
      btn.disabled = false; btn.textContent = '立即排盘';
    }
  }

  function readForm() {
    const year = parseInt(document.getElementById('year').value,10);
    const month = parseInt(document.getElementById('month').value,10);
    const day = parseInt(document.getElementById('day').value,10);
    const hour = parseInt(document.getElementById('hour').value,10);
    const minute = parseInt(document.getElementById('minute').value,10);
    const second = parseInt(document.getElementById('second').value,10)||0;
    const tz = parseInt(document.getElementById('tz').value,10);
    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    let number = parseInt(document.getElementById('number').value,10)||0;
    const topic = document.getElementById('topic').value.trim();
    const gender = document.getElementById('gender').value;

    if (!year||!month||!day||isNaN(lat)||isNaN(lon)) { showError('请填写完整日期与经纬度'); return null; }
    if (number > 0) number = ((number-1)%249)+1;

    return { year,month,day,hour,minute,second,tzOffsetMin:tz,lat,lon,number,topic,gender,
      ayanamsaId:settings.ayanamsaId, houseSystem:settings.houseSystem, rpMode:settings.rpMode };
  }

  // ── LLM 文本 ──
  function showLLMText(r) {
    const sec = document.getElementById('llm-section');
    const con = document.getElementById('llm-content');
    if (!sec||!con) return;
    con.innerHTML = renderMarkdown(global.KpEngine.buildLLMText(r));
    sec.style.display = 'block';
    con.style.display = 'block';
  }

  function renderMarkdown(md) {
    let h = esc(md);
    h = h.replace(/^\|(.+)\|\s*$/gm, m => '<tr>'+m.split('|').slice(1,-1).map(c=>'<td>'+c.trim()+'</td>').join('')+'</tr>');
    h = h.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="kp-table md-table">$1</table>');
    h = h.replace(/^### (.+)$/gm,'<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm,'<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm,'<h1>$1</h1>');
    h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/^- (.+)$/gm,'<li>$1</li>');
    h = h.replace(/(<li>[\s\S]*?<\/li>)/g,'<ul>$1</ul>');
    h = h.split(/\n\n+/).map(p => p.match(/^<(h\d|ul|table)/) ? p : '<p>'+p.replace(/\n/g,'<br>')+'</p>').join('\n');
    return '<div class="md-body">'+h+'</div>';
  }
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  // ── 结果区按钮 ──
  async function onResultClick(e) {
    const btn = e.target.closest('button');
    if (!btn||!lastResult) return;
    if (btn.id === 'btn-copy-md' || btn.id === 'btn-copy-quick') {
      const text = btn.id==='btn-copy-quick' ? lastResult.quickTag : global.KpEngine.buildLLMText(lastResult);
      const ok = await Native.copy(text);
      Native.toast(ok?'已复制':'复制失败');
    } else if (btn.id === 'btn-export-md') {
      const ok = await Native.exportFile(makeFilename(lastResult), global.KpEngine.buildLLMText(lastResult));
      Native.toast(ok?'已导出':'导出失败');
    } else if (btn.id === 'btn-share') {
      await Native.share(global.KpEngine.buildLLMText(lastResult));
    } else if (btn.dataset.rpMode) {
      // RP 切换按钮（在统治星卡片里）
      settings.rpMode = btn.dataset.rpMode;
      Native.toast('切换为 '+btn.dataset.rpMode+'，重新排盘…');
      onCast(new Event('submit'));
    }
  }
  function makeFilename(r) {
    const i=r.input, d=`${i.year}${pad(i.month)}${pad(i.day)}_${pad(i.hour)}${pad(i.minute)}`;
    return `KP排盘_${d}_${i.number?'n'+i.number:'nox'}.md`;
  }
  function pad(n){return String(n).padStart(2,'0');}

  // ── 历史记录 ──
  function saveHistory(input) {
    try {
      const records = JSON.parse(localStorage.getItem('kp_history')||'[]');
      records.unshift({
        id: Date.now(),
        title: input.topic || '未命名',
        time: `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(input.minute)}`,
        input: { ...input }
      });
      if (records.length > 50) records.pop();
      localStorage.setItem('kp_history', JSON.stringify(records));
      Log.info('历史已保存', input.topic||'未命名');
    } catch(e) { Log.error('保存历史失败', e.message); }
  }

  function loadHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    try {
      const records = JSON.parse(localStorage.getItem('kp_history')||'[]');
      if (records.length === 0) { list.innerHTML = '<p class="muted" style="text-align:center;padding:40px">暂无历史记录</p>'; return; }
      list.innerHTML = records.map(r => {
        const num = r.input.number ? ' #'+r.input.number : '';
        return `<div class="history-card" data-id="${r.id}">
          <div class="history-card-title">${esc(r.title)}${num}</div>
          <div class="history-card-time">${esc(r.time)}</div>
          <button class="btn history-del" data-id="${r.id}">✕</button>
        </div>`;
      }).join('');
      list.querySelectorAll('.history-card').forEach(item => {
        item.addEventListener('click', e => {
          if (e.target.classList.contains('history-del')) return;
          restoreHistory(parseInt(item.dataset.id,10));
        });
      });
      list.querySelectorAll('.history-del').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); deleteHistory(parseInt(btn.dataset.id,10)); });
      });
    } catch(e) { Log.error('加载历史失败', e.message); }
  }

  function restoreHistory(id) {
    try {
      const records = JSON.parse(localStorage.getItem('kp_history')||'[]');
      const r = records.find(x=>x.id===id); if(!r) return;
      const i = r.input;
      document.getElementById('year').value = i.year;
      document.getElementById('month').value = i.month;
      document.getElementById('day').value = i.day;
      document.getElementById('hour').value = i.hour;
      document.getElementById('minute').value = i.minute;
      document.getElementById('second').value = i.second||0;
      document.getElementById('tz').value = i.tzOffsetMin;
      document.getElementById('lat').value = i.lat;
      document.getElementById('lon').value = i.lon;
      document.getElementById('number').value = i.number||'';
      document.getElementById('topic').value = i.topic||'';
      document.getElementById('gender').value = i.gender||'male';
      if (i.ayanamsaId) { settings.ayanamsaId=i.ayanamsaId; updatePills('aya',i.ayanamsaId); }
      if (i.houseSystem) { settings.houseSystem=i.houseSystem; updatePills('house',i.houseSystem); }
      if (i.rpMode) { settings.rpMode=i.rpMode; }
      updateNumberMapping();
      showPage('cast');
      Native.toast('已恢复: '+r.title);
    } catch(e) { Log.error('恢复历史失败', e.message); }
  }

  function deleteHistory(id) {
    let records = JSON.parse(localStorage.getItem('kp_history')||'[]');
    records = records.filter(r=>r.id!==id);
    localStorage.setItem('kp_history', JSON.stringify(records));
    loadHistory(); Native.toast('已删除');
  }

  function updatePills(group, value) {
    document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => {
      const v = group==='rp' ? p.dataset.value : parseInt(p.dataset.value,10);
      p.classList.toggle('active', v == value);
    });
  }

  // ── 启动 ──
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.KpApp = { Native, Log, get lastResult(){return lastResult;}, get settings(){return settings;} };
})(typeof window !== 'undefined' ? window : globalThis);
