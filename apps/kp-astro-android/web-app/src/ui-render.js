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
    return `<span class="planet-badge ${cls}${retro ? ' retro' : ''}">${glyph ? `<span class="glyph">${glyph}</span>` : ''}${esc(name)}</span>`;
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
        <div class="card-header"><h2>📊 排盘参数与天文元数据</h2></div>
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
        <div class="card-header"><h2>🎯 上升点 (Ascendant)</h2></div>
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
      return `
        <tr>
          <td>${planetBadge(name, { retro: p.isRetrograde })}</td>
          <td class="mono">${fmtDeg(p.longitude)}</td>
          <td>${esc(p.rashiName)} <span class="muted">(${esc(p.rashiLord)})</span></td>
          <td>${esc(p.nakshatraName)} <span class="muted">P${p.pada}</span></td>
          <td>${esc(p.nakshatraLord)}</td>
          <td class="sub-lord">${esc(p.subLord)}</td>
        </tr>
      `;
    }).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🪐 行星位置 <span class="muted" style="font-weight:400;font-size:12px">(Sidereal)</span></h2></div>
        <div class="table-wrap">
          <table class="kp-table">
            <thead>
              <tr><th>行星</th><th>经度</th><th>星座 (主)</th><th>星宿 (Pada)</th><th>星宿主</th><th class="sub-lord">子主</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderRulingPlanets(rps) {
    const cards = rps.map(rp => `
      <div class="rp-card">
        <div class="rp-role">${esc(rp.roles.join(' + '))}</div>
        <div class="rp-planet">${planetBadge(rp.planet, { isShadow: rp.isShadow })}</div>
        <div class="rp-score">强度 ${rp.score}</div>
      </div>
    `).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>⚖️ 7 大统治星 (Ruling Planets)</h2></div>
        <p class="hint">时间过滤与事件真实性验证的终极判定星。强度 ≥ 5 视为强势 RP。</p>
        <div class="rp-grid">${cards}</div>
      </section>
    `;
  }

  function renderHouses(houses) {
    const rows = houses.map(h => `
      <tr>
        <td class="center">${h.number === 1 ? `${h.number} (升)` : h.number}</td>
        <td class="mono">${fmtDeg(h.cuspDeg)}</td>
        <td>${esc(h.signName)} <span class="muted">(${esc(h.lord)})</span></td>
        <td>${esc(h.cuspNakshatra)}</td>
        <td>${esc(h.cuspNakshatraLord)}</td>
        <td class="sub-lord">${esc(h.cuspSubLord)}</td>
      </tr>
    `).join('');
    return `
      <section class="card">
        <div class="card-header"><h2>🏛️ 宫头位置 <span class="muted" style="font-weight:400;font-size:12px">(Cuspal)</span></h2></div>
        <p class="hint">宫头子主 (CSL) 是判断宫位事项是否成真的最终决定星。</p>
        <div class="table-wrap">
          <table class="kp-table">
            <thead><tr><th>宫</th><th>经度</th><th>星座 (主)</th><th>星宿</th><th>星宿主</th><th class="sub-lord">宫头子主</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
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
          <h2>🔍 Significators (征象星 — XALEN 5 级 A/B/C/D/E)</h2>
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
        <div class="card-header"><h2>🔢 数字起卦映射 <span class="muted" style="font-weight:400;font-size:12px">(KP ${nd.number}/249)</span></h2></div>
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
          <h2>🌗 Panchang</h2>
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

  function renderQuickCopy(tag) {
    return `
      <section class="card">
        <div class="quick-copy">
          <span class="qct-text">${esc(tag)}</span>
          <button class="btn" onclick="document.getElementById('btn-copy-quick').click()">📋 复制</button>
        </div>
      </section>
    `;
  }

  // ───────────────────────── Top-level render ─────────────────────────

  function renderChart(container, result) {
    container.innerHTML = [
      renderQuickCopy(result.quickTag),
      renderMeta(result),
      renderAscendant(result.ascendant),
      renderPlanets(result.planets),
      renderRulingPlanets(result.rulingPlanets),
      renderHouses(result.houses),
      renderDasha(result.dasha),
      renderDashaTimeline(result),
      renderSignificators(result.significators),
      renderNumberDivination(result.numberDivination),
      renderPanchang(result.panchang)
    ].join('\n');
    container.classList.add('rendered');
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  global.UiRender = { renderChart };
})(typeof window !== 'undefined' ? window : globalThis);
