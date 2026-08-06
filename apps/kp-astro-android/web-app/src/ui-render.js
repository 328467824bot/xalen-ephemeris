/**
 * ui-render.js — KP 排盘结果 UI 渲染 v2
 *
 * 集成原版优点：
 *   - 行星颜色编码（badge 带专属颜色）
 *   - 金色 Sub-Lord 列高亮（KP 签名）
 *   - 折叠面板（∨ 展开/收起）
 *   - 当前 dasha 行高亮 + ● 标记
 *   - Quick Copy Tag 一行摘要
 *   - 玻璃质感卡片
 *   - Monospace 数字
 */

(function (global) {
  'use strict';

  const { PLANET_NAMES, PLANET_GLYPHS, PLANET_COLOR_CLASS, RASHIS } = global.KpEngine;
  // ── 双语映射 ──
  const PLANET_CN = { Sun:"太阳", Moon:"月亮", Mercury:"水星", Venus:"金星", Mars:"火星", Jupiter:"木星", Saturn:"土星", Rahu:"罗睺", Ketu:"计都", Ascendant:"上升" };
  const RASHI_CN = ["白羊","金牛","双子","巨蟹","狮子","处女","天秤","天蝎","射手","摩羯","水瓶","双鱼"];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function fmtDeg(d) {
    if (d == null || !isFinite(d)) return '—';
    const sign = d < 0 ? '-' : '';
    d = Math.abs(d);
    const deg = Math.floor(d);
    const minFloat = (d - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.floor((minFloat - min) * 60);
    return `${sign}${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`;
  }

  function fmtDegDec(d) {
    if (d == null || !isFinite(d)) return '—';
    return d.toFixed(4) + '°';
  }

  function planetBadge(name, opts = {}) {
    const { retro, isAsc, showGlyph = true } = opts;
    const cls = PLANET_COLOR_CLASS[name] || (isAsc ? 'ascendant' : '');
    const glyph = showGlyph && (PLANET_GLYPHS[name] || (isAsc ? 'ASC' : ''));
    const cn = PLANET_CN[name] || '';
    const label = cn ? `${cn}` : esc(name);  // 只显示中文，不显示英文（英文在 LLM 文本里有）
    return `<span class="planet-badge ${cls}${retro ? ' retro' : ''}">${glyph ? `<span class="glyph">${glyph}</span>` : ''}${label}</span>`;
  }

  // 双语星座名
  function rashiBi(deg) {
    const idx = Math.floor(((deg % 360 + 360) % 360) / 30);
    return `${RASHI_CN[idx]} ${RASHIS[idx]}`;
  }

  function jdToDate(jd) {
    // 简化：JD → Date (UTC)
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
  }

  function fmtDate(jd) {
    const d = jdToDate(jd);
    return d.toISOString().slice(0, 10);
  }

  // ───────────────────────── Sections ─────────────────────────

  function renderMeta(result) {
    const m = result.meta;
    const inp = result.input;
    const ayaName = m.ayanamsaId === 2 ? 'KP' : (m.ayanamsaId === 0 ? 'Lahiri' : `#${m.ayanamsaId}`);
    const houseName = m.houseSystem === 2 ? 'Placidus' : (m.houseSystem === 0 ? 'Whole-Sign' : `#${m.houseSystem}`);
    return `
      <section class="card">
        <div class="card-header"><h2>📊 排盘参数与天文元数据 / Meta Data</h2></div>
        <div class="kv-grid">
          <div><span class="k">占问时间</span><span class="v">${inp.year}-${pad(inp.month)}-${pad(inp.day)} ${pad(inp.hour)}:${pad(inp.minute)} UTC${inp.tzOffsetMin>=0?'+':''}${inp.tzOffsetMin/60}</span></div>
          <div><span class="k">地点</span><span class="v">${inp.lat.toFixed(4)}°N, ${inp.lon.toFixed(4)}°E</span></div>
          <div><span class="k">数字起卦</span><span class="v">${inp.number || '—'}</span></div>
          <div><span class="k">占问事项</span><span class="v">${esc(inp.topic || '—')}</span></div>
          <div><span class="k">Julian Day</span><span class="v mono">${m.jdUt1.toFixed(6)}</span></div>
          <div><span class="k">岁差</span><span class="v mono strong">${m.ayanamsa.toFixed(4)}° (${ayaName})</span></div>
          <div><span class="k">宫位制</span><span class="v">${houseName}</span></div>
          <div><span class="k">ΔT</span><span class="v mono">${m.deltaT.toFixed(2)} s</span></div>
          <div><span class="k">计算引擎</span><span class="v tag ${m.xalenMode === 'wasm' ? 'ok' : 'warn'}">XALEN ${m.xalenMode.toUpperCase()}</span></div>
        </div>
      </section>
    `;
  }

  function renderAscendant(asc) {
    return `
      <section class="card">
        <div class="card-header"><h2>🎯 上升点 / Ascendant</h2></div>
        <div class="kv-grid">
          <div><span class="k">经度</span><span class="v mono">${fmtDeg(asc.longitude)}</span></div>
          <div><span class="k">星座</span><span class="v">${esc(asc.rashiName)} <span class="muted">(主星 ${planetBadge(asc.rashiLord)})</span></span></div>
          <div><span class="k">星宿</span><span class="v">${esc(asc.nakshatraName)} Pada ${asc.pada} <span class="muted">(主 ${planetBadge(asc.nakshatraLord)})</span></span></div>
          <div><span class="k">KP 子主</span><span class="v strong">${planetBadge(asc.subLord)}</span></div>
          <div><span class="k">子之子主</span><span class="v">${planetBadge(asc.subSubLord)}</span></div>
        </div>
      </section>
    `;
  }

  function renderPlanets(planets) {
    const rows = PLANET_NAMES.map(name => {
      const p = planets[name];
      if (!p) return '';
      const retro = p.isRetrograde ? ' ℞' : '';
      return `
        <div class="data-row">
          <span class="dr-value">${planetBadge(name, { retro: p.isRetrograde })}${retro}</span>
          <span class="dr-label">经度</span><span class="dr-value mono">${fmtDeg(p.longitude)}</span>
          <span class="dr-label">星座</span><span class="dr-value">${esc(p.rashiName)}</span>
          <span class="dr-label">星宿</span><span class="dr-value">${esc(p.nakshatraName)} P${p.pada}</span>
          <span class="dr-label">星宿主</span><span class="dr-value">${planetBadge(p.nakshatraLord)}</span>
          <span class="dr-label">子主</span><span class="dr-value sub-lord">${planetBadge(p.subLord)}</span>
        </div>
      `;
    }).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🪐 行星位置 / Planet Positions</h2></div>
        <p class="hint">恒星制 / Sidereal · 关注子主 / Focus on Sub Lord</p>
        <div class="table-wrap">${rows}</div>
      </section>
    `;
  }

  function renderRulingPlanets(rps, rpMode) {
    const cards = rps.map(rp => `
      <div class="rp-card">
        <div class="rp-role">${esc(rp.roles.join(' + '))}</div>
        <div class="rp-planet">${planetBadge(rp.planet, { isShadow: rp.isShadow })}</div>
        <div class="rp-score">强度 ${rp.score}</div>
      </div>
    `).join('');
    const modeLabel = rpMode === 'extended7' ? '7 颗（扩展）' : '5 颗（经典）';
    return `
      <section class="card">
        <div class="card-header">
          <h2>⚖️ 统治星 / Ruling Planets</h2>
          <div class="rp-toggle">
            <button class="btn ${rpMode!=='extended7'?'primary':''}" data-rp-mode="ksk5" style="padding:3px 8px;font-size:11px">5 颗</button>
            <button class="btn ${rpMode==='extended7'?'primary':''}" data-rp-mode="extended7" style="padding:3px 8px;font-size:11px">7 颗</button>
          </div>
        </div>
        <p class="hint">当前：${modeLabel}。重复次数越多强度越高。用于时间过滤与事件验证。</p>
        <div class="rp-grid">${cards}</div>
      </section>
    `;
  }

  function renderHouses(houses) {
    const rows = houses.map(h => `
      <div class="data-row">
        <span class="dr-value" style="min-width:28px;font-weight:700">${h.number === 1 ? '1升' : h.number}</span>
        <span class="dr-label">经度</span><span class="dr-value mono">${fmtDeg(h.cuspDeg)}</span>
        <span class="dr-label">星座</span><span class="dr-value">${esc(h.signName)}</span>
        <span class="dr-label">主</span><span class="dr-value">${planetBadge(h.lord)}</span>
        <span class="dr-label">星宿</span><span class="dr-value">${esc(h.cuspNakshatra)}</span>
        <span class="dr-label">星宿主</span><span class="dr-value">${planetBadge(h.cuspNakshatraLord)}</span>
        <span class="dr-label">宫头子主</span><span class="dr-value sub-lord">${planetBadge(h.cuspSubLord)}</span>
      </div>
    `).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🏛️ 宫头位置 / Cuspal Positions</h2></div>
        <p class="hint">宫头子主 / CSL 是判断宫位事项是否成真的最终决定星</p>
        <div class="table-wrap">${rows}</div>
      </section>
    `;
  }

  function renderSignificators(sigs) {
    // sigs 是 XALEN 5 级结构: [{planet, signifiedHouses, strengthOrder}]
    const rows = sigs.map(s => {
      const strength = s.strengthOrder.map(([h, t]) => `${h}:${t}`).join(', ');
      return `
        <tr>
          <td>${planetBadge(s.planet)}</td>
          <td>${s.signifiedHouses.join(', ')}</td>
          <td class="mono" style="font-size:11px">${strength}</td>
        </tr>
      `;
    }).join('');
    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>🔍 征象星 / Significators (A/B/C/D/E)</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <p class="hint">强度顺序：A(StarLord) > B(Occupant) > C(StarLord of Owner) > D(Owner) > E(Aspecting)</p>
        <div class="table-wrap">
          <table class="kp-table">
            <thead><tr><th>行星</th><th>征象宫位</th><th>强度明细</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderDasha(d) {
    if (!d) return '';
    return `
      <section class="card">
        <div class="card-header"><h2>⏳ Vimshottari 推运 <span class="muted" style="font-weight:400;font-size:12px">(当前)</span></h2></div>
        <div class="kv-grid">
          <div><span class="k">大运 Mahadasha</span><span class="v strong">${planetBadge(d.mahadasha.lord)}</span></div>
          <div><span class="k">副运 Antardasha</span><span class="v strong">${planetBadge(d.antardasha.lord)}</span></div>
          ${d.pratyantardasha ? `<div><span class="k">小运 Pratyantardasha</span><span class="v strong">${planetBadge(d.pratyantardasha.lord)}</span></div>` : ''}
        </div>
      </section>
    `;
  }

  function renderDashaTimeline(result) {
    if (!result.fullDasha) return '';
    const jdNow = result.meta.jdUt1;
    const currentDasha = result.dasha;
    // 大运表格 — 只显示当前±2
    const mahaRows = result.fullDasha.map(m => {
      const active = currentDasha && m.lord === currentDasha.mahadasha.lord &&
                     jdNow >= m.startJd && jdNow < m.endJd;
      return `<tr class="${active ? 'active' : ''}">
        <td>${planetBadge(m.lord)}</td>
        <td class="mono">${fmtDate(m.startJd)}</td>
        <td class="mono">${fmtDate(m.endJd)}</td>
        <td class="center">${m.durationYears.toFixed(2)}年</td>
      </tr>`;
    }).join('');

    // 找当前大运的 antardashas
    let antarRows = '';
    let pratyantarRows = '';
    if (currentDasha) {
      const currentMaha = result.fullDasha.find(m => m.lord === currentDasha.mahadasha.lord);
      if (currentMaha) {
        antarRows = currentMaha.antardashas.map(a => {
          const active = currentDasha.antardasha && a.lord === currentDasha.antardasha.lord &&
                         jdNow >= a.startJd && jdNow < a.endJd;
          return `<tr class="${active ? 'active' : ''}">
            <td>${planetBadge(a.lord)}</td>
            <td class="mono">${fmtDate(a.startJd)}</td>
            <td class="mono">${fmtDate(a.endJd)}</td>
            <td class="center">${a.durationYears.toFixed(2)}年</td>
          </tr>`;
        }).join('');

        // 当前 antardasha 的 pratyantardashas
        if (currentDasha.antardasha) {
          const currentAntar = currentMaha.antardashas.find(a => a.lord === currentDasha.antardasha.lord);
          if (currentAntar && currentAntar.pratyantardashas) {
            pratyantarRows = currentAntar.pratyantardashas.map(p => {
              const active = currentDasha.pratyantardasha && p.lord === currentDasha.pratyantardasha.lord &&
                             jdNow >= p.startJd && jdNow < p.endJd;
              return `<tr class="${active ? 'active' : ''}">
                <td>${planetBadge(p.lord)}</td>
                <td class="mono">${fmtDate(p.startJd)}</td>
                <td class="mono">${fmtDate(p.endJd)}</td>
                <td class="center">${p.durationYears.toFixed(3)}年</td>
              </tr>`;
            }).join('');
          }
        }
      }
    }

    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>📅 Dasha 时间线</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <h3 style="font-size:12px;color:var(--text-muted);margin:8px 0 4px">大运 (Mahadasha) — 120 年周期</h3>
        <div class="table-wrap">
          <table class="kp-table">
            <thead><tr><th>主星</th><th>起始</th><th>结束</th><th>时长</th></tr></thead>
            <tbody>${mahaRows}</tbody>
          </table>
        </div>
        ${antarRows ? `
          <h3 style="font-size:12px;color:var(--text-muted);margin:14px 0 4px">小运 (Antardasha) — 当前 ${planetBadge(currentDasha.mahadasha.lord)} 大运下</h3>
          <div class="table-wrap">
            <table class="kp-table">
              <thead><tr><th>主星</th><th>起始</th><th>结束</th><th>时长</th></tr></thead>
              <tbody>${antarRows}</tbody>
            </table>
          </div>
        ` : ''}
        ${pratyantarRows ? `
          <h3 style="font-size:12px;color:var(--text-muted);margin:14px 0 4px">微运 (Pratyantardasha) — 当前 ${planetBadge(currentDasha.mahadasha.lord)}/${planetBadge(currentDasha.antardasha.lord)} 下</h3>
          <div class="table-wrap">
            <table class="kp-table">
              <thead><tr><th>主星</th><th>起始</th><th>结束</th><th>时长</th></tr></thead>
              <tbody>${pratyantarRows}</tbody>
            </table>
          </div>
        ` : ''}
      </section>
    `;
  }

  function renderNumberDivination(nd) {
    if (!nd) return '';
    return `
      <section class="card">
        <div class="card-header"><h2>🔢 数字起卦 / Horary Number <span class="muted" style="font-weight:400;font-size:12px">(KP ${nd.number}/249)</span></h2></div>
        <div class="kv-grid">
          <div><span class="k">映射经度</span><span class="v mono">${fmtDeg(nd.mappedDegree)}</span></div>
          <div><span class="k">星座</span><span class="v">${esc(nd.rashi)}</span></div>
          <div><span class="k">星宿</span><span class="v">${esc(nd.nakshatra)} Pada ${nd.pada}</span></div>
          <div><span class="k">星宿主</span><span class="v">${esc(nd.nakshatraLord)}</span></div>
          <div><span class="k">KP 子主</span><span class="v strong">${esc(nd.subLord)}</span></div>
          <div><span class="k">子之子主</span><span class="v">${esc(nd.subSubLord)}</span></div>
        </div>
      </section>
    `;
  }

  function renderPanchang(p) {
    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>🌗 五要素 / Panchang</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="kv-grid">
          <div><span class="k">Tithi</span><span class="v">${esc(p.tithi)}</span></div>
          <div><span class="k">Vara</span><span class="v">${esc(p.vara)}</span></div>
          <div><span class="k">Nakshatra</span><span class="v">${esc(p.nakshatra)}</span></div>
          <div><span class="k">Yoga</span><span class="v">${esc(p.yoga || '—')}</span></div>
          <div><span class="k">Karana</span><span class="v">${esc(p.karana || '—')}</span></div>
        </div>
      </section>
    `;
  }

  // ───────────────────────── CSL 分析 ─────────────────────────

  function renderCslAnalysis(csl) {
    if (!csl || !csl.length) return '';
    const rows = csl.map(c => {
      const pMark = c.promise === 'Positive' ? '✅' : c.promise === 'Negative' ? '❌' : '⚠️';
      const promiseCn = c.promise === 'Positive' ? '吉' : c.promise === 'Negative' ? '凶' : '混合';
      return `<div class="data-row">
        <span class="dr-value" style="min-width:28px;font-weight:700">${c.house}</span>
        <span class="dr-label">星座主</span><span class="dr-value">${planetBadge(c.signLord)}</span>
        <span class="dr-label">星宿主</span><span class="dr-value">${planetBadge(c.starLord)}</span>
        <span class="dr-label">子主</span><span class="dr-value sub-lord">${planetBadge(c.subLord)}</span>
        <span class="dr-label">许诺</span><span class="dr-value">${pMark} ${promiseCn}</span>
        <span class="dr-label">所在宫</span><span class="dr-value">${c.cslHouse || '—'}</span>
        <span class="dr-label">主宰宫</span><span class="dr-value">${c.cslRules}</span>
      </div>`;
    }).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🔍 CSL 宫头子主分析 / Cuspal Sub-Lord</h2></div>
        <p class="hint">✅吉 / ❌凶 / ⚠️混合</p>
        <div class="table-wrap">${rows}</div>
      </section>
    `;
  }

  function renderHousePromises(hp) {
    if (!hp || !hp.length) return '';
    const rows = hp.map(h => {
      const mark = h.promise === 'Positive' ? '✅' : h.promise === 'Negative' ? '❌' : '⚠️';
      const cn = h.promise === 'Positive' ? '吉' : h.promise === 'Negative' ? '凶' : '混合';
      return `<div class="data-row">
        <span class="dr-value" style="min-width:28px;font-weight:700">${h.house}</span>
        <span class="dr-label">CSL</span><span class="dr-value">${planetBadge(h.csl)}</span>
        <span class="dr-label">许诺</span><span class="dr-value">${mark} ${cn}</span>
        <span class="dr-label">吉${h.favCount}</span><span class="dr-label">凶${h.unfavCount}</span>
      </div>`;
    }).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🎯 宫位许诺 / House Promises</h2></div>
        <p class="hint">每宫 CSL 是否许诺该宫事项</p>
        <div class="table-wrap">${rows}</div>
      </section>
    `;
  }

  function renderEventPromises(ep) {
    if (!ep || !ep.length) return '';
    const eventCn = { Marriage:'婚姻', Job:'工作', Health:'健康', ChildBirth:'子女', Education:'教育', ForeignTravel:'出国', Wealth:'财运', Litigation:'官司' };
    const rows = ep.map(e => {
      const mark = e.promised ? '✅' : '❌';
      const cn = e.promised ? '是' : '否';
      return `<div class="data-row">
        <span class="dr-value" style="min-width:60px;font-weight:600">${esc(eventCn[e.event] || e.event)}</span>
        <span class="dr-label">主宫</span><span class="dr-value">${e.primaryHouse}</span>
        <span class="dr-label">CSL</span><span class="dr-value">${planetBadge(e.csl)}</span>
        <span class="dr-label">许诺</span><span class="dr-value">${mark} ${cn}</span>
      </div>`;
    }).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>💍 事件许诺 / Event Promises</h2></div>
        <p class="hint">8 类人生事件是否许诺</p>
        <div class="table-wrap">${rows}</div>
      </section>
    `;
  }

  // ───────────────────────── 罗睺计都代理 ─────────────────────────

  function renderRahuKetuProxy(proxy) {
    if (!proxy) return '';
    const renderNode = (node, name) => {
      if (!node) return '';
      const rows = node.levels.map(l => `<tr><td class="center">${l.level}</td><td>${esc(l.source)}</td><td>${planetBadge(l.significator)}</td></tr>`).join('');
      return `
        <div style="margin-bottom:12px">
          <h3 style="color:var(--accent-strong);font-size:13px;margin:8px 0 4px">${name}</h3>
          <p class="muted" style="font-size:11px;margin:0 0 6px">${esc(node.position)}</p>
          <table class="kp-table">
            <thead><tr><th>层级 / Level</th><th>来源 / Source</th><th>代理行星 / Agent</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    };
    return `
      <section class="card">
        <div class="card-header"><h2>🌑 罗睺计都代理分析 / Rahu Ketu Agents</h2></div>
        <p class="hint">经典四重代理：合相 > 相位 > 星主 > 星座主星</p>
        ${renderNode(proxy.rahu, '罗睺 / Rahu')}
        ${renderNode(proxy.ketu, '计都 / Ketu')}
      </section>
    `;
  }

  // ───────────────────────── 行星相位 ─────────────────────────

  function renderAspects(aspects) {
    if (!aspects) return '';
    const vedicRows = (aspects.vedic || []).map(a => `<tr><td>${planetBadge(a.from)}</td><td>${esc(a.fromSign)}</td><td>${esc(a.aspect)}</td><td>${planetBadge(a.to)}</td><td>${esc(a.toSign)}</td></tr>`).join('');
    const westernRows = (aspects.western || []).map(a => `<tr><td>${planetBadge(a.a)}</td><td>${planetBadge(a.b)}</td><td>${esc(a.aspect)}</td><td class="center">${esc(a.orb)}</td></tr>`).join('');
    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>👁️ 行星相位 / Planetary Aspects</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <h3 style="font-size:12px;color:var(--text-muted);margin:8px 0 4px">印度特殊相位 / Vedic Drishti</h3>
        <div class="table-wrap"><table class="kp-table">
          <thead><tr><th>从 / From</th><th>星座 / Sign</th><th>相位 / Aspect</th><th>到 / To</th><th>星座 / Sign</th></tr></thead>
          <tbody>${vedicRows}</tbody>
        </table></div>
        <h3 style="font-size:12px;color:var(--text-muted);margin:12px 0 4px">西方度数相位 / Western Aspects</h3>
        <div class="table-wrap"><table class="kp-table">
          <thead><tr><th>行星A</th><th>行星B</th><th>相位 / Aspect</th><th>容许度 / Orb</th></tr></thead>
          <tbody>${westernRows}</tbody>
        </table></div>
      </section>
    `;
  }

  // ───────────────────────── 行星状态 ─────────────────────────

  function renderPlanetStates(states) {
    if (!states || !states.length) return '';
    const rows = states.map(p => `<tr>
      <td>${planetBadge(p.name)}</td>
      <td>${esc(p.state)}</td>
      <td class="mono">${esc(p.speed)}</td>
      <td class="center">${p.isCombust ? '🔥 是' : '—'}</td>
      <td class="center">${p.name === 'Sun' ? '—' : esc(p.distToSun)}</td>
    </tr>`).join('');
    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>🔄 行星状态 / Planet States</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <p class="hint">KP 规则：逆行不决定成败，但决定延迟与反复。燃烧不否定结果（水星常燃烧但不受影响）。</p>
        <div class="table-wrap"><table class="kp-table">
          <thead><tr><th>行星 / Planet</th><th>状态 / State</th><th>速度 / Speed (°/day)</th><th>燃烧 / Combust</th><th>距日 / Dist to Sun</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </section>
    `;
  }

  // ───────────────────────── 行星尊贵 ─────────────────────────

  function renderPlanetDignity(dignity) {
    if (!dignity || !dignity.length) return '';
    const rows = dignity.map(p => `<tr>
      <td>${planetBadge(p.name)}</td>
      <td>${esc(p.sign)}</td>
      <td class="center">${p.absolute.mark} ${esc(p.absolute.text)}</td>
      <td class="center">${p.relative.mark} ${esc(p.relative.text)}</td>
    </tr>`).join('');
    return `
      <section class="card collapsible collapsed">
        <div class="card-header collapsible" onclick="this.parentElement.classList.toggle('collapsed')">
          <h2>👑 行星尊贵 / Planet Dignity</h2>
          <span class="collapse-icon">▼</span>
        </div>
        <p class="hint">KP 废弃打分系统，尊贵仅作背景参考。落陷行星只要 Sub Lord 指向吉宫，依然给结果。</p>
        <div class="table-wrap"><table class="kp-table">
          <thead><tr><th>行星 / Planet</th><th>星座 / Sign</th><th>绝对尊贵 / Absolute</th><th>相对尊贵 / Relative</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </section>
    `;
  }

  function renderQuickCopy(tag) {
    return `
      <section class="card">
        <div class="quick-copy">
          <span class="qct-text">${esc(tag)}</span>
          <button class="btn" id="btn-copy-quick">📋 复制</button>
        </div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn" id="btn-copy-md">📋 复制 LLM 文本</button>
          <button class="btn" id="btn-export-md">💾 导出 .md</button>
          <button class="btn" id="btn-share">↗ 分享</button>
        </div>
      </section>
    `;
  }

  // ───────────────────────── Top-level render ─────────────────────────

  function renderChart(container, result) {
    const parts = [
      renderQuickCopy(result.quickTag),
      renderMeta(result),
      renderAscendant(result.ascendant),
      renderPlanets(result.planets),
      renderRulingPlanets(result.rulingPlanets, result.input.rpMode),
      renderHouses(result.houses),
      renderCslAnalysis(result.cslAnalysis),
      renderHousePromises(result.housePromises),
      renderEventPromises(result.eventPromises),
      renderDasha(result.dasha),
      renderDashaTimeline(result),
      renderSignificators(result.significators),
      renderRahuKetuProxy(result.rahuKetuProxy),
      renderAspects(result.aspects),
      renderPlanetStates(result.planetStates),
      renderPlanetDignity(result.planetDignity),
    ];
    // 数字起卦卡片只在有数字时显示
    if (result.numberDivination && result.input.number) {
      parts.push(renderNumberDivination(result.numberDivination));
    }
    parts.push(renderPanchang(result.panchang));

    container.innerHTML = parts.join('\n');
    container.classList.add('rendered');
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  global.UiRender = { renderChart };
})(typeof window !== 'undefined' ? window : globalThis);
