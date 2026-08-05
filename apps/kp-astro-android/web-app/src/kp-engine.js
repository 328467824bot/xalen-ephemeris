/**
 * kp-engine.js — KP (Krishnamurti Paddhati) 占星计算引擎
 *
 * 基于 XALEN 提供的行星 / 上升点数据，计算：
 *   1. 9 行星 + Rahu/Ketu 的 KP 位置分解 (星座主 / 星宿主 / 子主 / 子之子主)
 *   2. 7 大统治星 (Ruling Planets, RP) — 含 Rahu/Ketu 代理规则与强度评分
 *   3. 五层征象星 (Significators) — 同宫星 / 相位星 / 星宿主 / 落座主星 / 深层星主
 *   4. 12 宫头分析 — 含 Promise (Positive / Negative / Mixed)
 *   5. Vimshottari 推运 — 当前大运 / 副运 / 小运
 *   6. 排盘诊断数据 — 用于复制粘贴到 ChatGPT/Claude 做解读
 *
 * 参考：旧版 HTML 应用《KP 即时占卜排盘 · LLM 辅助工具》
 */

(function (global) {
  'use strict';

  // ───────────────────────── Constants ─────────────────────────

  const PLANET_NAMES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
                        'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
  const PLANET_CN = {
    Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
    Jupiter: '木星', Saturn: '土星', Rahu: '罗睺', Ketu: '计都'
  };

  // 行星 Unicode 符号
  const PLANET_GLYPHS = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋', Ascendant: 'ASC'
  };

  // 行星颜色 class（用于 badge 着色）
  const PLANET_COLOR_CLASS = {
    Sun: 'sun', Moon: 'moon', Mercury: 'mercury', Venus: 'venus', Mars: 'mars',
    Jupiter: 'jupiter', Saturn: 'saturn', Rahu: 'rahu', Ketu: 'ketu',
    Ascendant: 'ascendant'
  };

  const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const RASHIS_CN = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女',
                     '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'];
  const RASHI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
                       'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

  const NAK_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
                     'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

  const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  const WEEKDAY_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  const DASHA_YEARS = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
    Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };

  // 行星自然吉凶（用于 RP 评分）
  const NATURAL_NATURE = {
    Sun: 'malefic', Moon: 'benefic', Mercury: 'benefic', Venus: 'benefic', Mars: 'malefic',
    Jupiter: 'benefic', Saturn: 'malefic', Rahu: 'malefic', Ketu: 'malefic'
  };

  // ───────────────────────── Helpers ─────────────────────────

  const norm = (x) => ((x % 360) + 360) % 360;

  function rashiOf(deg) { return Math.floor(norm(deg) / 30); }
  function nakshatraOf(deg) { return Math.floor(norm(deg) / (360 / 27)); }
  function padaOf(deg) {
    const d = norm(deg);
    const idx = Math.floor(d / (360 / 27));
    const inNak = d - idx * (360 / 27);
    return Math.floor(inNak / (360 / 108)) + 1;
  }
  function nakLordOf(deg) { return NAK_LORDS[nakshatraOf(deg) % 9]; }
  function rashiLordOf(deg) { return RASHI_LORDS[rashiOf(deg)]; }

  // KP sub-lord: 一个 nakshatra (13°20') 按 Vimshottari 比例分 9 份，每份是一个 sub
  function kpSubLord(deg) {
    const d = norm(deg);
    const nakSize = 360 / 27;
    const padaSize = nakSize / 4;
    const idx = Math.floor(d / nakSize);
    const inNak = d - idx * nakSize;
    const nakLord = NAK_LORDS[idx % 9];
    const startSeq = NAK_LORDS.indexOf(nakLord);
    const seq = NAK_LORDS; // [Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury]
    let acc = 0;
    for (let i = 0; i < 9; i++) {
      const lord = seq[(startSeq + i) % 9];
      const portion = DASHA_YEARS[lord] / 120 * nakSize;
      if (inNak < acc + portion) return lord;
      acc += portion;
    }
    return nakLord;
  }

  // KP sub-sub-lord: 在 sub 内再按 Vimshottari 比例分 9 份
  function kpSubSubLord(deg) {
    const d = norm(deg);
    const nakSize = 360 / 27;
    const idx = Math.floor(d / nakSize);
    const inNak = d - idx * nakSize;
    const nakLord = NAK_LORDS[idx % 9];
    const startSeq = NAK_LORDS.indexOf(nakLord);
    const seq = NAK_LORDS;
    // 先定位到 sub
    let acc = 0, subLord = nakLord, subStart = 0, subSize = 0;
    for (let i = 0; i < 9; i++) {
      const lord = seq[(startSeq + i) % 9];
      const portion = DASHA_YEARS[lord] / 120 * nakSize;
      if (inNak < acc + portion) {
        subLord = lord;
        subStart = acc;
        subSize = portion;
        break;
      }
      acc += portion;
    }
    // 在 sub 内再分 9 份
    const inSub = inNak - subStart;
    const subStartSeq = NAK_LORDS.indexOf(subLord);
    let acc2 = 0;
    for (let i = 0; i < 9; i++) {
      const lord = NAK_LORDS[(subStartSeq + i) % 9];
      const portion = DASHA_YEARS[lord] / 120 * subSize;
      if (inSub < acc2 + portion) return lord;
      acc2 += portion;
    }
    return subLord;
  }

  // ───────────────────────── Main computation ─────────────────────────

  /**
   * 计算完整 KP 排盘
   * @param {object} xalen - XalenBridge 门面对象
   * @param {object} input - { year, month, day, hour, minute, tzOffsetMin, lat, lon, number, topic, gender, ayanamsaId, houseSystem }
   *   ayanamsaId: 0=Lahiri (默认), 2=KP
   *   houseSystem: 0=Whole-Sign (默认), 2=Placidus
   * @returns {object} 排盘结果
   */
  async function computeChart(xalen, input) {
    // 1. 时间 → JD (UT1)
    const { year, month, day, hour, minute, tzOffsetMin, lat, lon } = input;
    const ayaId = input.ayanamsaId ?? 2;        // 默认 KP 岁差（对齐原版）
    const houseSys = input.houseSystem ?? 2;    // 默认 Placidus（对齐原版）
    const localHour = hour + minute / 60.0;
    const utHour = localHour - tzOffsetMin / 60.0;
    const jdUt1 = xalen.julianDay(year, month, day, utHour);

    // 2. 行星位置 (sidereal)
    const planets = {};
    for (let id = 0; id <= 8; id++) {
      const p = xalen.planetPositionJson(jdUt1, id, true, ayaId);
      const name = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'][id];
      if (id >= 7 && id <= 8) continue;
      planets[name] = buildPlanet(name, p.longitude, p.is_retrograde);
    }
    // Rahu (id=9), Ketu (id=13)
    const rahu = xalen.planetPositionJson(jdUt1, 9, true, ayaId);
    const ketu = xalen.planetPositionJson(jdUt1, 13, true, ayaId);
    planets['Rahu'] = buildPlanet('Rahu', rahu.longitude, rahu.is_retrograde);
    planets['Ketu'] = buildPlanet('Ketu', ketu.longitude, ketu.is_retrograde);

    // 3. 上升点
    const chart = xalen.fullChartJson(jdUt1, lat, lon, ayaId);
    const ascDeg = chart.ascendant_deg;
    const asc = {
      name: 'Ascendant',
      longitude: ascDeg,
      rashi: rashiOf(ascDeg),
      rashiName: RASHIS[rashiOf(ascDeg)],
      rashiLord: rashiLordOf(ascDeg),
      nakshatra: nakshatraOf(ascDeg),
      nakshatraName: NAKSHATRAS[nakshatraOf(ascDeg)],
      nakshatraLord: nakLordOf(ascDeg),
      pada: padaOf(ascDeg),
      subLord: kpSubLord(ascDeg),
      subSubLord: kpSubSubLord(ascDeg)
    };

    // 4. 12 宫 (Whole-Sign 或 Placidus)
    const housesData = xalen.housesJson(jdUt1, lat, lon, houseSys);
    const ascSign = asc.rashi;
    const houses = [];
    for (let i = 0; i < 12; i++) {
      const cuspDeg = housesData.cusps[i];
      const sign = rashiOf(cuspDeg);
      const houseNum = i + 1;
      // 找落入此宫的行星
      // Whole-Sign: 行星所在星座 == 宫位星座
      // Placidus: 行星经度在 [cusp_i, cusp_{i+1}) 区间内
      const occupants = [];
      const nextCusp = housesData.cusps[(i + 1) % 12];
      for (const pname of PLANET_NAMES) {
        if (!planets[pname]) continue;
        if (houseSys === 0) {
          if (planets[pname].rashi === sign) occupants.push(pname);
        } else {
          // Placidus: 区间判定（处理跨越 0°）
          const pl = planets[pname].longitude;
          if (cuspDeg < nextCusp) {
            if (pl >= cuspDeg && pl < nextCusp) occupants.push(pname);
          } else {
            if (pl >= cuspDeg || pl < nextCusp) occupants.push(pname);
          }
        }
      }
      houses.push({
        number: houseNum,
        sign: sign,
        signName: RASHIS[sign],
        lord: RASHI_LORDS[sign],
        occupants: occupants,
        cuspDeg: cuspDeg,
        cuspNakshatra: NAKSHATRAS[nakshatraOf(cuspDeg)],
        cuspNakshatraLord: nakLordOf(cuspDeg),
        cuspSubLord: kpSubLord(cuspDeg)
      });
    }

    // 5. 7 大统治星 (Ruling Planets, RP)
    const rp = computeRulingPlanets(asc, planets, jdUt1, input, ayaId);

    // 6. 五层征象星 (Significators)
    const significators = computeSignificators(planets, houses, asc);

    // 7. Vimshottari 推运 (基于月亮星宿) — 含 Pratyantardasha 三级
    const moonDeg = planets.Moon.longitude;
    const dasha = xalen.vimshottariDasha(moonDeg, jdUt1);
    const currentDasha = findCurrentDasha(dasha, jdUt1);

    // 8. Panchang
    const panchang = xalen.panchangJson(jdUt1, ayaId);

    // 9. 数字起卦 (KP number-based divination)
    const numberDiv = computeNumberDivination(input.number, asc, planets);

    // 10. Quick Copy Tag（一行摘要，用于快速粘贴到 LLM）
    const quickTag = `上升子主 = 1宫头子主 : ${asc.subLord}`;

    return {
      input,
      meta: {
        jdUt1,
        ayanamsa: xalen.ayanamsaDeg(jdUt1, ayaId),
        ayanamsaId: ayaId,
        houseSystem: houseSys,
        deltaT: xalen.deltaT(jdUt1),
        xalenMode: xalen.mode
      },
      ascendant: asc,
      planets,
      houses,
      rulingPlanets: rp,
      significators,
      dasha: currentDasha,
      fullDasha: dasha,
      panchang,
      numberDivination: numberDiv,
      quickTag,
      timestamp: new Date().toISOString()
    };
  }

  function buildPlanet(name, longitude, isRetro) {
    const rashiIdx = rashiOf(longitude);
    return {
      name,
      nameCn: PLANET_CN[name] || name,
      longitude,
      rashi: rashiIdx,
      rashiName: RASHIS[rashiIdx],
      rashiLord: rashiLordOf(longitude),
      nakshatra: nakshatraOf(longitude),
      nakshatraName: NAKSHATRAS[nakshatraOf(longitude)],
      nakshatraLord: nakLordOf(longitude),
      pada: padaOf(longitude),
      subLord: kpSubLord(longitude),
      subSubLord: kpSubSubLord(longitude),
      isRetrograde: !!isRetro,
      isShadow: name === 'Rahu' || name === 'Ketu'
    };
  }

  // ───────────────────────── Ruling Planets (7 RP) ─────────────────────────

  function computeRulingPlanets(asc, planets, jdUt1, input, ayaId) {
    // 7 颗基础 RP（含上升子主 + 月亮子主，对齐原版 KP Prasna 完整 RP）
    const raw = [];
    raw.push({ key: 'DayLord', role: '星期主星', planet: getDayLord(jdUt1), weight: 5, roleEn: 'Day Lord' });
    raw.push({ key: 'AscSignLord', role: '上升星座主', planet: asc.rashiLord, weight: 5, roleEn: 'Ascendant Sign Lord' });
    raw.push({ key: 'AscNakLord', role: '上升星宿主', planet: asc.nakshatraLord, weight: 5, roleEn: 'Ascendant Star Lord' });
    raw.push({ key: 'AscSubLord', role: '上升子主', planet: asc.subLord, weight: 5, roleEn: 'Ascendant Sub Lord' });
    raw.push({ key: 'MoonSignLord', role: '月亮星座主', planet: planets.Moon.rashiLord, weight: 5, roleEn: 'Moon Sign Lord' });
    raw.push({ key: 'MoonNakLord', role: '月亮星宿主', planet: planets.Moon.nakshatraLord, weight: 5, roleEn: 'Moon Star Lord' });
    raw.push({ key: 'MoonSubLord', role: '月亮子主', planet: planets.Moon.subLord, weight: 5, roleEn: 'Moon Sub Lord' });

    // Rahu/Ketu 代理规则：
    //   - 如果 7 颗基础 RP 中有 Rahu 或 Ketu，则把对应的代理星也加入
    //   - Rahu 代理 = Mercury（Dual lordship）
    //   - Ketu 代理 = Mars
    const planetSet = new Set(raw.map(r => r.planet));
    if (planetSet.has('Rahu')) {
      raw.push({ key: 'RahuProxy', role: '罗睺代理(Mercury)', planet: 'Mercury', weight: 3, roleEn: 'Rahu Proxy (Mercury)' });
    }
    if (planetSet.has('Ketu')) {
      raw.push({ key: 'KetuProxy', role: '计都代理(Mars)', planet: 'Mars', weight: 3, roleEn: 'Ketu Proxy (Mars)' });
    }

    // RP 强度评分
    const scored = [];
    const grouped = {};
    for (const r of raw) {
      grouped[r.planet] = grouped[r.planet] || { planet: r.planet, roles: [], rolesEn: [], weight: 0 };
      grouped[r.planet].roles.push(r.role);
      grouped[r.planet].rolesEn.push(r.roleEn);
      grouped[r.planet].weight += r.weight;
    }
    for (const p of Object.keys(grouped)) {
      const g = grouped[p];
      let score = g.weight;
      // 多角色加成
      if (g.roles.length > 1) score += 2;
      // 吉凶
      if (NATURAL_NATURE[p] === 'benefic') score += 1;
      else if (NATURAL_NATURE[p] === 'malefic') score -= 1;
      // 是否在自己星座
      const pl = planets[p];
      if (pl && pl.rashiLord === p) score += 2;
      // 是否在自己星宿
      if (pl && pl.nakshatraLord === p) score += 2;
      // 逆行
      if (pl && pl.isRetrograde) score -= 1;

      scored.push({
        planet: p,
        planetCn: PLANET_CN[p] || p,
        roles: g.roles,
        rolesEn: g.rolesEn,
        score,
        isShadow: p === 'Rahu' || p === 'Ketu'
      });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }

  // 计算星期主星（基于 JD，避免时区问题）
  function getDayLord(jdUt1) {
    const jd0 = Math.floor(jdUt1 + 0.5);
    const weekdayFromJd = (jd0 + 1) % 7;  // 0=Sunday
    return WEEKDAY_LORDS[weekdayFromJd];
  }

  // ───────────────────────── Significators (5 层征象星) ─────────────────────────

  function computeSignificators(planets, houses, asc) {
    // 对每个宫位计算征象星：
    //   Layer 1 (落座主星): 宫内行星的星宿主 (occupants' star lords)
    //   Layer 2 (同宫星):   宫内行星本身 (occupants)
    //   Layer 3 (相位星):   对该宫形成主要相位的行星 (aspects)
    //   Layer 4 (星宿主):   宫主星所在的星宿主 (lord's star lord)
    //   Layer 5 (深层星主): 宫主星的星宿主的星宿主 (deep star lord)
    const results = houses.map(h => {
      const occupants = h.occupants;
      // occupants' star lords
      const layer1 = occupants.map(p => planets[p].nakshatraLord);
      // occupants themselves
      const layer2 = occupants.slice();
      // aspects — 简化：所有行星中，与宫头形成 0/90/180/120/60° 相位的
      const aspectors = [];
      for (const pname of PLANET_NAMES) {
        if (!planets[pname]) continue;
        if (occupants.includes(pname)) continue;
        const diff = Math.abs(norm(planets[pname].longitude - h.cuspDeg));
        for (const asp of [0, 60, 90, 120, 180]) {
          if (Math.abs(diff - asp) < 5) {
            aspectors.push(pname);
            break;
          }
        }
      }
      // lord's star lord
      const lord = h.lord;
      const lordPlanet = planets[lord];
      const layer4 = lordPlanet ? [lordPlanet.nakshatraLord] : [];
      // deep star lord
      const deepLordName = layer4[0];
      const deepPlanet = planets[deepLordName];
      const layer5 = deepPlanet ? [deepPlanet.nakshatraLord] : [];

      return {
        house: h.number,
        sign: h.signName,
        lord: h.lord,
        occupants: layer2,
        occupantStarLords: layer1,
        aspectors,
        lordStarLord: layer4[0] || null,
        deepStarLord: layer5[0] || null,
        // 综合：按优先级合并去重
        // 优先级：星宿主 > 同宫星 > 落座主星 > 相位星
        primary: unique([...layer4, ...layer2, ...layer1, ...aspectors])
      };
    });
    return results;
  }

  function unique(arr) {
    return [...new Set(arr.filter(Boolean))];
  }

  // ───────────────────────── Vimshottari current dasha ─────────────────────────

  function findCurrentDasha(dashas, jdNow) {
    for (const maha of dashas) {
      if (jdNow >= maha.startJd && jdNow < maha.endJd) {
        for (const antar of maha.antardashas) {
          if (jdNow >= antar.startJd && jdNow < antar.endJd) {
            // 三级 pratyantardasha
            let pratyantar = null;
            if (antar.pratyantardashas) {
              for (const pa of antar.pratyantardashas) {
                if (jdNow >= pa.startJd && jdNow < pa.endJd) {
                  pratyantar = { lord: pa.lord, startJd: pa.startJd, endJd: pa.endJd };
                  break;
                }
              }
            }
            return {
              mahadasha: { lord: maha.lord, startJd: maha.startJd, endJd: maha.endJd, durationYears: maha.durationYears },
              antardasha: { lord: antar.lord, startJd: antar.startJd, endJd: antar.endJd, durationYears: antar.durationYears },
              pratyantardasha: pratyantar
            };
          }
        }
      }
    }
    return null;
  }

  // ───────────────────────── Number-based divination (KP 数字起卦) ─────────────────────────

  function computeNumberDivination(num, asc, planets) {
    // KP 数字起卦：把 1-249 之间的数字映射到 KP 子主表
    // 1 宫 = 1 to 249 按比例分配，每个 sub 对应一个编号
    // 简化：直接用 num mod 249 + 1，然后用 num/249 * 360° 当作"占问度数"
    if (!num || num < 1) num = 1;
    if (num > 249) num = ((num - 1) % 249) + 1;
    const deg = (num - 1) / 249 * 360;
    return {
      number: num,
      mappedDegree: deg,
      rashi: RASHIS[rashiOf(deg)],
      nakshatra: NAKSHATRAS[nakshatraOf(deg)],
      nakshatraLord: nakLordOf(deg),
      subLord: kpSubLord(deg),
      subSubLord: kpSubSubLord(deg),
      pada: padaOf(deg)
    };
  }

  // ───────────────────────── Diagnostic text (for LLM) ─────────────────────────

  /**
   * 生成结构化 Markdown 文本，便于粘贴到 ChatGPT/Claude 做 KP 解读
   */
  function buildDiagnosticMarkdown(result) {
    const lines = [];
    const inp = result.input;
    lines.push(`# KP 排盘精度诊断数据`);
    lines.push('');
    lines.push(`> 由 XALEN ephemeris (${result.meta.xalenMode}) 生成 — 可粘贴到 ChatGPT / Claude 进行 KP 解读。`);
    lines.push('');
    lines.push(`## 排盘参数`);
    lines.push(`- **占问时间**: ${inp.year}-${pad(inp.month)}-${pad(inp.day)} ${pad(inp.hour)}:${pad(inp.minute)} (UTC${inp.tzOffsetMin >= 0 ? '+' : ''}${inp.tzOffsetMin / 60})`);
    lines.push(`- **地点**: ${inp.lat.toFixed(4)}°N, ${inp.lon.toFixed(4)}°E`);
    lines.push(`- **数字起卦**: ${inp.number || '未指定'}`);
    lines.push(`- **占问事项**: ${inp.topic || '未指定'}`);
    lines.push(`- **性别**: ${inp.gender || '未指定'}`);
    lines.push('');
    lines.push(`## 天文元数据`);
    lines.push(`- **Julian Day (UT1)**: ${result.meta.jdUt1.toFixed(6)}`);
    lines.push(`- **Lahiri Ayanamsa**: ${result.meta.ayanamsa.toFixed(4)}°`);
    lines.push(`- **ΔT**: ${result.meta.deltaT.toFixed(2)}s`);
    lines.push(`- **计算引擎**: XALEN ${result.meta.xalenMode.toUpperCase()}`);
    lines.push('');
    lines.push(`## 上升点 (Ascendant)`);
    const a = result.ascendant;
    lines.push(`- **经度**: ${a.longitude.toFixed(4)}°`);
    lines.push(`- **星座**: ${a.rashiName} (主星: ${a.rashiLord})`);
    lines.push(`- **星宿**: ${a.nakshatraName} Pada ${a.pada} (主星: ${a.nakshatraLord})`);
    lines.push(`- **KP 子主**: ${a.subLord}`);
    lines.push(`- **KP 子之子主**: ${a.subSubLord}`);
    lines.push('');
    lines.push(`## 行星位置 (Sidereal, Lahiri)`);
    lines.push('');
    lines.push('| 行星 | 经度 | 星座 | 星宿 | Pada | 星座主 | 星宿主 | 子主 | 子之子主 | 逆行 |');
    lines.push('|---|---:|---|---|---:|---|---|---|---|---|');
    for (const name of PLANET_NAMES) {
      const p = result.planets[name];
      if (!p) continue;
      lines.push(`| ${name}${p.isShadow ? ' (阴影)' : ''} | ${p.longitude.toFixed(4)}° | ${p.rashiName} | ${p.nakshatraName} | ${p.pada} | ${p.rashiLord} | ${p.nakshatraLord} | ${p.subLord} | ${p.subSubLord} | ${p.isRetrograde ? 'R' : ''} |`);
    }
    lines.push('');
    lines.push(`## 7 大统治星 (Ruling Planets)`);
    lines.push('');
    lines.push('| # | 行星 | 角色 | 强度 |');
    lines.push('|---:|---|---|---:|');
    result.rulingPlanets.forEach((rp, i) => {
      lines.push(`| ${i+1} | ${rp.planet}${rp.isShadow ? ' (阴影)' : ''} | ${rp.roles.join(' + ')} | ${rp.score} |`);
    });
    lines.push('');
    lines.push(`## 五层征象星 (Significators)`);
    lines.push('');
    lines.push(`> 优先级：星宿主（第四层） > 同宫星（第二层） > 落座主星（第一层） > 相位星（第三层）`);
    lines.push('');
    lines.push('| 宫 | 星座 | 宫主 | 同宫星 | 星宿主(主) | 相位星 | 深层星主 |');
    lines.push('|---:|---|---|---|---|---|---|');
    for (const s of result.significators) {
      lines.push(`| ${s.house} | ${s.sign} | ${s.lord} | ${s.occupants.join(', ') || '—'} | ${s.lordStarLord || '—'} | ${s.aspectors.join(', ') || '—'} | ${s.deepStarLord || '—'} |`);
    }
    lines.push('');
    if (result.dasha) {
      const d = result.dasha;
      lines.push(`## Vimshottari 推运`);
      lines.push(`- **大运 (Mahadasha)**: ${d.mahadasha.lord}`);
      lines.push(`- **副运 (Antardasha)**: ${d.antardasha.lord}`);
      lines.push('');
    }
    if (result.numberDivination) {
      const nd = result.numberDivination;
      lines.push(`## 数字起卦映射 (KP ${nd.number}/249)`);
      lines.push(`- **映射经度**: ${nd.mappedDegree.toFixed(4)}°`);
      lines.push(`- **星座**: ${nd.rashi}`);
      lines.push(`- **星宿**: ${nd.nakshatra} (主: ${nd.nakshatraLord})`);
      lines.push(`- **Pada**: ${nd.pada}`);
      lines.push(`- **KP 子主**: ${nd.subLord}`);
      lines.push(`- **KP 子之子主**: ${nd.subSubLord}`);
      lines.push('');
    }
    lines.push(`## Panchang`);
    const p = result.panchang;
    lines.push(`- **Tithi**: ${p.tithi}`);
    lines.push(`- **Vara**: ${p.vara}`);
    lines.push(`- **Nakshatra**: ${p.nakshatra}`);
    lines.push('');
    lines.push(`---`);
    lines.push(`_生成时间: ${result.timestamp} | 引擎: XALEN ${result.meta.xalenMode}_`);
    return lines.join('\n');
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  // ───────────────────────── Export ─────────────────────────

  global.KpEngine = {
    computeChart,
    buildDiagnosticMarkdown,
    PLANET_NAMES,
    PLANET_CN,
    PLANET_GLYPHS,
    PLANET_COLOR_CLASS,
    RASHIS,
    RASHIS_CN,
    RASHI_LORDS,
    NAKSHATRAS,
    NAK_LORDS,
    WEEKDAY_LORDS,
    DASHA_YEARS
  };
})(typeof window !== 'undefined' ? window : globalThis);
