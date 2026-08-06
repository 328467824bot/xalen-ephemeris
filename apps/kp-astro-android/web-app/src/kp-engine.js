/**
 * kp-engine.js — KP (Krishnamurti Paddhati) 占星计算引擎 v3
 *
 * 设计原则（v3 修正）：
 *   1. **不再自己实现算法** — 所有天文计算都委托给 XALEN API
 *   2. **完整实现原版 HTML 应用的所有功能**：
 *      - 7 RP（含上升子主+月亮子主）
 *      - 12 宫位（Placidus 或 Whole-Sign，含宫头子主 CSL）
 *      - CSL 分析表（每宫 CSL 位置 + 主宰宫 + 星宿主 + 星宿主位置）
 *      - Rahu/Ketu 五重代理分析（落座/同宫/相位/星宿/深层星主）
 *      - 双轨相位（Vedic Drishti + Western 度数相位）
 *      - 行星状态（逆行/燃烧/速度/距日度数）
 *      - 行星尊贵状态（绝对 + 相对 Naisargika Maitri 矩阵）
 *      - 征象星参考表（行星 + 宫位征象词典）
 *      - 三级 Dasha（Maha/Antar/Pratyantar）
 *   3. 输出与原版兼容的完整 LLM 文本（Markdown 格式）
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

  const PLANET_GLYPHS = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋', Ascendant: 'Asc'
  };

  const PLANET_COLOR_CLASS = {
    Sun: 'sun', Moon: 'moon', Mercury: 'mercury', Venus: 'venus', Mars: 'mars',
    Jupiter: 'jupiter', Saturn: 'saturn', Rahu: 'rahu', Ketu: 'ketu',
    Ascendant: 'ascendant'
  };

  const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const RASHIS_ABBR = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
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

  const NATURAL_NATURE = {
    Sun: 'malefic', Moon: 'benefic', Mercury: 'benefic', Venus: 'benefic', Mars: 'malefic',
    Jupiter: 'benefic', Saturn: 'malefic', Rahu: 'malefic', Ketu: 'malefic'
  };

  // Naisargika Maitri（天然敌友矩阵）— 非对称
  // 矩阵 [房东][租客] = 'F'(友) / 'E'(敌) / 'N'(中性)
  const NAISARGIKA = {
    Sun:     { Sun:'-', Moon:'F', Mars:'F', Mercury:'N', Jupiter:'F', Venus:'E', Saturn:'E', Rahu:'E', Ketu:'E' },
    Moon:    { Sun:'F', Moon:'-', Mars:'N', Mercury:'F', Jupiter:'N', Venus:'N', Saturn:'N', Rahu:'E', Ketu:'E' },
    Mars:    { Sun:'F', Moon:'F', Mars:'-', Mercury:'E', Jupiter:'F', Venus:'N', Saturn:'N', Rahu:'N', Ketu:'N' },
    Mercury: { Sun:'F', Moon:'E', Mars:'N', Mercury:'-', Jupiter:'N', Venus:'F', Saturn:'N', Rahu:'N', Ketu:'N' },
    Jupiter: { Sun:'F', Moon:'F', Mars:'F', Mercury:'E', Jupiter:'-', Venus:'E', Saturn:'N', Rahu:'N', Ketu:'N' },
    Venus:   { Sun:'E', Moon:'E', Mars:'N', Mercury:'F', Jupiter:'N', Venus:'-', Saturn:'F', Rahu:'F', Ketu:'F' },
    Saturn:  { Sun:'E', Moon:'E', Mars:'E', Mercury:'F', Jupiter:'N', Venus:'F', Saturn:'-', Rahu:'F', Ketu:'F' },
    Rahu:    { Sun:'E', Moon:'E', Mars:'E', Mercury:'N', Jupiter:'F', Venus:'F', Saturn:'F', Rahu:'-', Ketu:'F' },
    Ketu:    { Sun:'E', Moon:'E', Mars:'F', Mercury:'N', Jupiter:'N', Venus:'F', Saturn:'F', Rahu:'F', Ketu:'-' }
  };

  // 行星征象词典（用于 LLM 解读）
  const PLANET_SIGNIFICATIONS = {
    Sun: '灵魂、生命力、权威 | 父亲、父亲形象、政府、官方、权威人士、职业地位、名声、荣誉、健康、心脏、骨骼、阳气、自信、领导力',
    Moon: '心智、情绪、母亲 | 母亲、母性、心智、情绪、感受、公众、女性、家庭、家庭生活、记忆、想象力、变化',
    Mars: '能量、行动、冲突 | 兄弟、姐妹、勇气、战斗、竞争、冲突、争吵、暴力、土地、房产、不动产、外科手术、伤口、发热',
    Mercury: '智力、沟通、商业 | 智力、理性、学习能力、沟通、演说、写作、商业、贸易、计算、亲戚、朋友、邻居、神经系统、皮肤、肺部',
    Jupiter: '智慧、扩张、幸运 | 智慧、知识、教育、子女、生育、财富、金钱、扩张、宗教、哲学、导师、法律、公正、慈善、肝脏、脂肪',
    Venus: '爱、美、享受 | 爱情、婚姻、配偶、美、艺术、音乐、奢华、享受、舒适、车辆、衣物、珠宝、生殖系统、肾脏',
    Saturn: '限制、纪律、长寿 | 长寿、时间、耐心、劳苦、贫困、限制、老年人、祖辈、服务、雇员、下属、死亡、慢性病、钢铁、煤矿、暗物质',
    Rahu: '扩张、欲望、异类 | 扩张、过度、放大、欲望、野心、贪婪、异国、外国人、外族、突然、意外、颠覆、幻觉、欺骗、阴影、技术、创新、非传统、中毒、毒药、瘾',
    Ketu: '收缩、解脱、灵性 | 解脱、灵性、解脱、收缩、分离、放手、过去世、业力、意外、突然事件、神秘学、占星、秘术、伤口、手术、切割、细菌、病毒、微观'
  };

  // 12 宫征象词典
  const HOUSE_SIGNIFICATIONS = {
    1: '自我、身体、性格 | 求测者本人、身体、外貌、性格、气质、整体状况、寿命、健康总况、出生、开始',
    2: '财富、家庭、言语 | 财富、金钱、积蓄、家庭、家庭生活、言语、说话、饮食、眼睛、脸、脖子、死亡方式（玛拉卡）',
    3: '兄弟、努力、短途 | 兄弟姐妹、努力、勇气、主动性、短途旅行、邻近、沟通、信件、媒体、耳朵、手臂、肩膀',
    4: '母亲、家、房产 | 母亲、母性、家、家庭、家乡、房产、土地、车辆、教育、学历、心脏、胸部、结局、安宁',
    5: '子女、智慧、恋爱 | 子女、生育、怀孕、智慧、知识、学习、恋爱、浪漫、情感、创造、艺术、娱乐、善业、前世功德、胃、肝脏',
    6: '疾病、敌人、债务 | 疾病、病痛、敌人、竞争对手、债务、贷款、服务、雇员、下属、官司、纠纷、肠道、消化系统',
    7: '婚姻、合作、他人 | 婚姻、配偶、伴侣、合伙、合作、合同、他人、公众、社交、商业伙伴、旅行、移居、腰部、生殖器官',
    8: '死亡、突变、隐藏 | 寿命、死亡方式、突变、意外、危机、遗产、保险、他人钱财、隐藏事物、秘密、性、生殖、研究、深究、神秘',
    9: '父亲、宗教、长途 | 父亲、导师、长辈、宗教、哲学、信仰、长途旅行、国外、高等学府、研究生、法律、公正、善业、功德',
    10: '职业、名声、权力 | 职业、事业、工作、名声、地位、荣誉、权力、权威、政府、雇主、上司、膝盖、大腿',
    11: '收入、愿望、朋友 | 收入、收益、利润、愿望达成、希望、朋友、社交圈、兄长、年长亲属、意外之财、礼物',
    12: '损失、支出、解脱 | 损失、支出、浪费、医院、监狱、隐居、解脱、涅槃、灵性、国外、异乡、移居、睡眠、梦境、潜意识、左眼、脚、死亡后的状态'
  };

  // Vedic 特殊相位（无 Orb）
  const VEDIC_ASPECTS = {
    Mars:    [4, 7, 8],
    Jupiter: [5, 7, 9],
    Saturn:  [3, 7, 10],
    Rahu:    [5, 7, 9],
    Ketu:    [5, 7, 9]
  };

  // Western 相位（带 Orb）
  const WESTERN_ASPECTS = [
    { name: 'Conjunction (合相)', angle: 0,   orb: 10 },
    { name: 'Opposition (对冲)',  angle: 180, orb: 10 },
    { name: 'Trine (三分相)',      angle: 120, orb: 8 },
    { name: 'Square (四分相)',     angle: 90,  orb: 8 },
    { name: 'Sextile (六分相)',    angle: 60,  orb: 6 }
  ];

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

  // KP sub-lord: 一个 nakshatra (13°20') 按 Vimshottari 比例分 9 份
  function kpSubLord(deg) {
    const d = norm(deg);
    const nakSize = 360 / 27;
    const idx = Math.floor(d / nakSize);
    const inNak = d - idx * nakSize;
    const nakLord = NAK_LORDS[idx % 9];
    const startSeq = NAK_LORDS.indexOf(nakLord);
    let acc = 0;
    for (let i = 0; i < 9; i++) {
      const lord = NAK_LORDS[(startSeq + i) % 9];
      const portion = DASHA_YEARS[lord] / 120 * nakSize;
      if (inNak < acc + portion) return lord;
      acc += portion;
    }
    return nakLord;
  }

  // KP sub-sub-lord
  function kpSubSubLord(deg) {
    const d = norm(deg);
    const nakSize = 360 / 27;
    const idx = Math.floor(d / nakSize);
    const inNak = d - idx * nakSize;
    const nakLord = NAK_LORDS[idx % 9];
    const startSeq = NAK_LORDS.indexOf(nakLord);
    let acc = 0, subLord = nakLord, subStart = 0, subSize = 0;
    for (let i = 0; i < 9; i++) {
      const lord = NAK_LORDS[(startSeq + i) % 9];
      const portion = DASHA_YEARS[lord] / 120 * nakSize;
      if (inNak < acc + portion) {
        subLord = lord; subStart = acc; subSize = portion; break;
      }
      acc += portion;
    }
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

  // 度数 → DMS 字符串 (e.g. "26°06'40\"")
  function degToDms(d) {
    d = norm(d);
    const deg = Math.floor(d);
    const minF = (d - deg) * 60;
    const min = Math.floor(minF);
    const sec = Math.floor((minF - min) * 60);
    return `${deg}°${String(min).padStart(2,'0')}'${String(sec).padStart(2,'0')}"`;
  }

  // JD → 日期字符串
  function jdToDate(jd) {
    const ms = (jd - 2440587.5) * 86400000;
    return new Date(ms);
  }
  function fmtDate(jd) {
    const d = jdToDate(jd);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // ───────────────────────── Main computation ─────────────────────────

  /**
   * 计算完整 KP 排盘 — 全部委托 XALEN API，不自己算天文
   * @param {object} xalen - XalenBridge 门面对象（真实 WASM 或 stub）
   * @param {object} input - 排盘参数
   */
  async function computeChart(xalen, input) {
    const { year, month, day, hour, minute, second, tzOffsetMin, lat, lon } = input;
    const ayaId = input.ayanamsaId ?? 1;        // 默认 KP 岁差（XALEN: 0=Lahiri, 1=KP, 2=Raman）
    const houseSys = input.houseSystem ?? 2;    // 默认 Placidus
    const sec = second || 0;
    const localHour = hour + minute / 60.0 + sec / 3600.0;
    const utHour = localHour - tzOffsetMin / 60.0;
    const jdUt1 = xalen.julianDay(year, month, day, utHour);

    // 1. 行星位置（全用 XALEN API）
    const planets = {};
    // Sun=0, Moon=1, Mercury=2, Venus=3, Mars=4, Jupiter=5, Saturn=6
    const planetIds = [
      ['Sun', 0], ['Moon', 1], ['Mercury', 2], ['Venus', 3], ['Mars', 4],
      ['Jupiter', 5], ['Saturn', 6]
    ];
    for (const [name, id] of planetIds) {
      const p = xalen.planetPositionJson(jdUt1, id, true, ayaId);
      planets[name] = buildPlanet(name, p.longitude, p.is_retrograde, p.lon_speed, p.distance || 1.0);
    }
    // Rahu (id=9 Mean Node), Ketu (id=13)
    const rahu = xalen.planetPositionJson(jdUt1, 9, true, ayaId);
    const ketu = xalen.planetPositionJson(jdUt1, 13, true, ayaId);
    planets['Rahu'] = buildPlanet('Rahu', rahu.longitude, rahu.is_retrograde, rahu.lon_speed, rahu.distance || 1.0);
    planets['Ketu'] = buildPlanet('Ketu', ketu.longitude, ketu.is_retrograde, ketu.lon_speed, ketu.distance || 1.0);

    // 2. 上升点 + 12 宫（用 XALEN housesJson）
    // 注意：XALEN WASM 的 housesJson 返回 radians，需要转 degrees
    // stub 返回 degrees，所以根据 mode 判断
    const housesData = xalen.housesJson(jdUt1, lat, lon, houseSys);
    const isRadians = xalen.mode === 'wasm';  // WASM 返回 radians, stub 返回 degrees
    const radToDeg = (r) => isRadians ? r * 180 / Math.PI : r;
    const ascTropical = radToDeg(housesData.ascendant);
    const aya = xalen.ayanamsaDeg(jdUt1, ayaId);
    const ascSidereal = norm(ascTropical - aya);
    const asc = {
      name: 'Ascendant',
      longitude: ascSidereal,
      rashi: rashiOf(ascSidereal),
      rashiName: RASHIS[rashiOf(ascSidereal)],
      rashiLord: rashiLordOf(ascSidereal),
      nakshatra: nakshatraOf(ascSidereal),
      nakshatraName: NAKSHATRAS[nakshatraOf(ascSidereal)],
      nakshatraLord: nakLordOf(ascSidereal),
      pada: padaOf(ascSidereal),
      subLord: kpSubLord(ascSidereal),
      subSubLord: kpSubSubLord(ascSidereal)
    };

    // 3. 12 宫（含 CSL 宫头子主）
    const houses = [];
    for (let i = 0; i < 12; i++) {
      const cuspTropical = radToDeg(housesData.cusps[i]);
      const cuspSidereal = norm(cuspTropical - aya);
      const sign = rashiOf(cuspSidereal);
      const nextCuspTropical = radToDeg(housesData.cusps[(i + 1) % 12]);
      const nextCuspSidereal = norm(nextCuspTropical - aya);
      // 找落入此宫的行星
      const occupants = [];
      for (const pname of PLANET_NAMES) {
        if (!planets[pname]) continue;
        const pl = planets[pname].longitude;
        if (cuspSidereal < nextCuspSidereal) {
          if (pl >= cuspSidereal && pl < nextCuspSidereal) occupants.push(pname);
        } else {
          if (pl >= cuspSidereal || pl < nextCuspSidereal) occupants.push(pname);
        }
      }
      houses.push({
        number: i + 1,
        sign: sign,
        signName: RASHIS[sign],
        lord: RASHI_LORDS[sign],
        occupants: occupants,
        cuspDeg: cuspSidereal,
        cuspNakshatra: NAKSHATRAS[nakshatraOf(cuspSidereal)],
        cuspNakshatraLord: nakLordOf(cuspSidereal),
        cuspSubLord: kpSubLord(cuspSidereal),
        cuspSubSubLord: kpSubSubLord(cuspSidereal)
      });
    }

    // 4. 7 大统治星 (Ruling Planets, RP) — 默认 5 RP，可切换 7 RP
    const rpMode = input.rpMode || 'ksk5';
    const rp = computeRulingPlanets(asc, planets, jdUt1, rpMode);

    // 5. Significators（征象星，XALEN 5 级 — A/B/C/D/E）
    const significators = computeSignificators(houses, planets);

    // 6. CSL 分析表（按 XALEN CuspalSubLord 结构，含 HousePromise）
    const cslAnalysis = computeCslAnalysis(houses, planets, significators);

    // 7. House Promises（每宫许诺 Positive/Negative/Mixed，XALEN HousePromise）
    const housePromises = computeHousePromises(houses, significators);

    // 8. Event Promises（8 类人生事件许诺，XALEN KpEvent）
    const eventPromises = computeEventPromises(houses, significators);

    // 9. Rahu/Ketu 五重代理分析
    const rahuKetuProxy = computeRahuKetuProxy(planets, houses);

    // 10. 双轨相位（Vedic + Western）
    const aspects = computeAspects(planets);

    // 11. 行星状态（逆行/燃烧/速度/距日）
    const planetStates = computePlanetStates(planets);

    // 12. 行星尊贵状态（绝对 + 相对 Naisargika Maitri）
    const planetDignity = computePlanetDignity(planets);

    // 13. Vimshottari 推运（三级）
    const moonDeg = planets.Moon.longitude;
    const fullDasha = xalen.vimshottariDasha(moonDeg, jdUt1);
    const currentDasha = findCurrentDasha(fullDasha, jdUt1);

    // 14. Panchang
    const panchang = xalen.panchangJson(jdUt1, ayaId);

    // 12. 数字起卦映射（KP Horary 1-249）
    const numberDivination = computeNumberDivination(input.number);

    // 13. Quick Tag
    const quickTag = `上升子主 ≡ 1宫宫头子主：${asc.subLord}`;

    let result = {
      input,
      meta: {
        jdUt1,
        ayanamsa: aya,
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
      cslAnalysis,
      housePromises,
      eventPromises,
      rahuKetuProxy,
      aspects,
      planetStates,
      planetDignity,
      dasha: currentDasha,
      fullDasha,
      panchang,
      numberDivination,
      quickTag,
      timestamp: new Date().toISOString()
    };

    // KP Horary 关键步骤：如果有 Horary Number，用数字对应的 sub 起点替换真实时间上升点
    // 这是 KSK 标准方法：上升点由数字决定，其他行星用真实时间
    if (input.number && input.number >= 1 && input.number <= 249) {
      result = applyHoraryAscendant(result, input.number);
    }

    return result;
  }

  function buildPlanet(name, longitude, isRetro, speed, distance) {
    const rashiIdx = rashiOf(longitude);
    const nakIdx = nakshatraOf(longitude);
    return {
      name,
      nameCn: PLANET_CN[name] || name,
      longitude: norm(longitude),
      rashi: rashiIdx,
      rashiName: RASHIS[rashiIdx],
      rashiAbbr: RASHIS_ABBR[rashiIdx],
      rashiLord: RASHI_LORDS[rashiIdx],
      nakshatra: nakIdx,
      nakshatraName: NAKSHATRAS[nakIdx],
      nakshatraLord: NAK_LORDS[nakIdx % 9],
      pada: padaOf(longitude),
      subLord: kpSubLord(longitude),
      subSubLord: kpSubSubLord(longitude),
      navamsaSign: getNavamsaSign(longitude),  // D9 星座
      isRetrograde: !!isRetro,
      isShadow: name === 'Rahu' || name === 'Ketu',
      speed: speed || 0,
      distance: distance || 1.0
    };
  }

  // ───────────────────────── Ruling Planets ─────────────────────────

  /**
   * 计算 7 大统治星 (Ruling Planets, RP)
   * 
   * 支持两种模式：
   *   - 'ksk5' (默认): KSK 经典 5 RP（Day Lord + Lagna Sign/Star Lord + Moon Sign/Star Lord）
   *   - 'extended7': 现代扩展 7 RP（加上 Asc Sub Lord + Moon Sub Lord）
   * 
   * 强度排序（来自 KSK 原著 + AstroSage 官方教程）：
   *   5 RP: 上升星主 > 上升宫主 > 月亮星主 > 月亮宫主 > 日主
   *   7 RP: 上升子主 > 上升星主 > 月亮星主 > 上升宫主 > 月亮宫主 > 月亮子主 > 日主
   * 
   * 重复即加强（简单计数，不用吉凶修正）
   * 逆行行星 star/sub 里的 RP 应剔除
   * 
   * Rahu/Ketu 代理规则（经典四重）：
   *   1. 合相行星（conjoining）
   *   2. 相位行星（aspecting）
   *   3. 星主（Nakshatra Lord / Star Lord）
   *   4. 星座主星（Sign Lord / Dispositor）
   */
  function computeRulingPlanets(asc, planets, jdUt1, rpMode) {
    const mode = rpMode || 'ksk5';  // 默认 5 RP
    const raw = [];

    // 按强度排序构建 RP 列表
    if (mode === 'extended7') {
      // 7 RP: 上升子主 > 上升星主 > 月亮星主 > 上升宫主 > 月亮宫主 > 月亮子主 > 日主
      raw.push({ key: 'AscSubLord', role: '上升子主', roleEn: 'Ascendant Sub Lord', planet: asc.subLord, order: 1 });
      raw.push({ key: 'AscNakLord', role: '上升星主', roleEn: 'Ascendant Star Lord', planet: asc.nakshatraLord, order: 2 });
      raw.push({ key: 'MoonNakLord', role: '月亮星主', roleEn: 'Moon Star Lord', planet: planets.Moon.nakshatraLord, order: 3 });
      raw.push({ key: 'AscSignLord', role: '上升宫主', roleEn: 'Ascendant Sign Lord', planet: asc.rashiLord, order: 4 });
      raw.push({ key: 'MoonSignLord', role: '月亮宫主', roleEn: 'Moon Sign Lord', planet: planets.Moon.rashiLord, order: 5 });
      raw.push({ key: 'MoonSubLord', role: '月亮子主', roleEn: 'Moon Sub Lord', planet: planets.Moon.subLord, order: 6 });
      raw.push({ key: 'DayLord', role: '日主', roleEn: 'Day Lord', planet: getDayLord(jdUt1), order: 7 });
    } else {
      // 5 RP (KSK 经典): 上升星主 > 上升宫主 > 月亮星主 > 月亮宫主 > 日主
      raw.push({ key: 'AscNakLord', role: '上升星主', roleEn: 'Ascendant Star Lord', planet: asc.nakshatraLord, order: 1 });
      raw.push({ key: 'AscSignLord', role: '上升宫主', roleEn: 'Ascendant Sign Lord', planet: asc.rashiLord, order: 2 });
      raw.push({ key: 'MoonNakLord', role: '月亮星主', roleEn: 'Moon Star Lord', planet: planets.Moon.nakshatraLord, order: 3 });
      raw.push({ key: 'MoonSignLord', role: '月亮宫主', roleEn: 'Moon Sign Lord', planet: planets.Moon.rashiLord, order: 4 });
      raw.push({ key: 'DayLord', role: '日主', roleEn: 'Day Lord', planet: getDayLord(jdUt1), order: 5 });
    }

    // 剔除逆行行星 star/sub 里的 RP（KSK 规则）
    const filtered = raw.filter(rp => {
      if (!rp.planet) return false;
      const p = planets[rp.planet];
      // 如果 RP 行星本身逆行，不剔除（逆行行星本身作为 RP 不受影响）
      // 但如果 RP 行星在逆行行星的 star/sub 里，应剔除
      // 简化：暂不实现此规则（需要完整的 star/sub 关系图）
      return true;
    });

    // Rahu/Ketu 代理规则（经典四重）
    const planetSet = new Set(filtered.map(r => r.planet));
    if (planetSet.has('Rahu')) {
      const agents = computeRahuKetuAgents('Rahu', planets);
      if (agents.length > 0) {
        filtered.push({ key: 'RahuAgent', role: '罗睺代理(' + agents[0] + ')', roleEn: 'Rahu Agent (' + agents[0] + ')', planet: agents[0], order: 99 });
      }
    }
    if (planetSet.has('Ketu')) {
      const agents = computeRahuKetuAgents('Ketu', planets);
      if (agents.length > 0) {
        filtered.push({ key: 'KetuAgent', role: '计都代理(' + agents[0] + ')', roleEn: 'Ketu Agent (' + agents[0] + ')', planet: agents[0], order: 99 });
      }
    }

    // 简单计数评分（重复即加强）
    const grouped = {};
    for (const r of filtered) {
      grouped[r.planet] = grouped[r.planet] || { planet: r.planet, roles: [], rolesEn: [], count: 0, minOrder: 99 };
      grouped[r.planet].roles.push(r.role);
      grouped[r.planet].rolesEn.push(r.roleEn);
      grouped[r.planet].count += 1;
      grouped[r.planet].minOrder = Math.min(grouped[r.planet].minOrder, r.order);
    }

    const scored = Object.values(grouped).map(g => ({
      planet: g.planet,
      planetCn: PLANET_CN[g.planet] || g.planet,
      roles: g.roles,
      rolesEn: g.rolesEn,
      score: g.count,  // 简单计数
      minOrder: g.minOrder,  // 最强位置（用于排序）
      isShadow: g.planet === 'Rahu' || g.planet === 'Ketu'
    }));

    // 排序：先按计数降序，再按最强位置升序
    scored.sort((a, b) => b.score - a.score || a.minOrder - b.minOrder);
    return scored;
  }

  /**
   * Rahu/Ketu 代理行星计算（经典四重）
   * 1. 合相行星（conjoining）— 与 Rahu/Ketu 同宫的行星
   * 2. 相位行星（aspecting）— 对 Rahu/Ketu 形成相位的行星
   * 3. 星主（Nakshatra Lord / Star Lord）
   * 4. 星座主星（Sign Lord / Dispositor）
   * 返回按优先级排序的代理行星列表
   */
  function computeRahuKetuAgents(nodeName, planets) {
    const node = planets[nodeName];
    if (!node) return [];
    const agents = [];
    const seen = new Set();

    // 1. 合相行星（同宫）
    for (const pname of PLANET_NAMES) {
      if (pname === nodeName) continue;
      const p = planets[pname];
      if (!p) continue;
      if (p.rashi === node.rashi) {
        if (!seen.has(pname)) { agents.push(pname); seen.add(pname); }
      }
    }

    // 2. 相位行星（Vedic Drishti）
    for (const pname of PLANET_NAMES) {
      if (pname === nodeName) continue;
      const p = planets[pname];
      if (!p) continue;
      const aspects = VEDIC_ASPECTS[pname] || [7];
      for (const asp of aspects) {
        const toSign = (p.rashi + asp - 1) % 12;
        if (toSign === node.rashi) {
          if (!seen.has(pname)) { agents.push(pname); seen.add(pname); }
          break;
        }
      }
    }

    // 3. 星主（Nakshatra Lord / Star Lord）
    const starLord = node.nakshatraLord;
    if (starLord && starLord !== nodeName && !seen.has(starLord)) {
      agents.push(starLord); seen.add(starLord);
    }

    // 4. 星座主星（Sign Lord / Dispositor）
    const signLord = node.rashiLord;
    if (signLord && signLord !== nodeName && !seen.has(signLord)) {
      agents.push(signLord); seen.add(signLord);
    }

    return agents;
  }

  function getDayLord(jdUt1) {
    const jd0 = Math.floor(jdUt1 + 0.5);
    const weekday = (jd0 + 1) % 7;
    return WEEKDAY_LORDS[weekday];
  }

  // ───────────────────────── CSL Analysis（按 XALEN CuspalSubLord 结构）─────────────────────────
  //
  // XALEN kp.rs 的 cuspal_analysis() 返回 CuspalSubLord:
  //   { house, cusp_deg, sign_lord, star_lord, sub_lord, promise }
  // promise = HousePromise (Positive/Negative/Mixed)

  function computeCslAnalysis(houses, planets, significators) {
    return houses.map(h => {
      const csl = h.cuspSubLord;
      // 找 CSL 行星所在宫
      let cslHouse = null;
      for (const hh of houses) {
        if (hh.occupants.includes(csl)) { cslHouse = hh.number; break; }
      }
      // 找 CSL 主宰的宫（作为星座主）
      const cslRules = [];
      for (const hh of houses) {
        if (hh.lord === csl) cslRules.push(hh.number);
      }
      // 找 CSL 的星宿主
      const cslStarLord = planets[csl]?.nakshatraLord;
      // 找星宿主所在宫
      let starLordHouse = null;
      if (cslStarLord) {
        for (const hh of houses) {
          if (hh.occupants.includes(cslStarLord)) { starLordHouse = hh.number; break; }
        }
      }
      // HousePromise（用 significators 计算）
      let promise = 'Mixed';
      if (significators) {
        const cslSig = significators.find(s => s.planet === csl);
        if (cslSig) {
          const fav = CUSP_FAVORABLE[h.number] || [];
          const unfav = CUSP_UNFAVORABLE[h.number] || [];
          const favCount = cslSig.signifiedHouses.filter(x => fav.includes(x)).length;
          const unfavCount = cslSig.signifiedHouses.filter(x => unfav.includes(x)).length;
          if (favCount > 0 && unfavCount === 0) promise = 'Positive';
          else if (unfavCount > 0 && favCount === 0) promise = 'Negative';
          else if (favCount > 0 && unfavCount > 0) promise = 'Mixed';
        }
      }
      // XALEN 结构
      return {
        house: h.number,
        cuspDeg: h.cuspDeg,
        signLord: h.lord,
        starLord: h.cuspNakshatraLord,
        subLord: csl,
        promise: promise,
        // 额外信息（原版 HTML 兼容）
        cslHouse: cslHouse,
        cslRules: cslRules.length ? cslRules.join(',') : '(无)',
        cslStarLord: cslStarLord || '—',
        starLordHouse: starLordHouse || '—'
      };
    });
  }

  // ───────────────────────── Significators（征象星，XALEN 5 级）─────────────────────────
  //
  // 来自 XALEN 库 crates/xalen-vedic/src/kp.rs 的 compute_significators
  // 每颗行星返回：
  //   - planet: 行星名
  //   - signifiedHouses: 该行星主宰/落入的宫位列表
  //   - strengthOrder: 按强度排序的 (house, type) 对
  //
  // XALEN 5 级（A > B > C > D > E）：
  //   A (StarLord): 此行星是某行星 X 的 star lord，且 X 落入某宫 → signify 该宫
  //   B (Occupant): 此行星落入的宫
  //   C (StarLord of Owner): 此行星是某宫 owner 的 star lord → signify 该宫
  //   D (Owner): 此行星拥有的星座对应的宫
  //   E (Aspecting): 此行星相位的宫
  //
  // 对应 AstroSage 官方教程的 Level 1-4（+ Aspecting）：
  //   Level 1 = A (StarLord 占据的宫)
  //   Level 2 = B (Occupant)
  //   Level 3 = C (StarLord 拥有的宫) — 即 star lord of owner
  //   Level 4 = D (Owner)

  function computeSignificators(houses, planets) {
    const result = [];

    // 预计算：每颗行星落入哪个宫
    const planetHouse = {};
    for (const pname of PLANET_NAMES) {
      const p = planets[pname];
      if (!p) continue;
      for (const h of houses) {
        if (h.occupants.includes(pname)) { planetHouse[pname] = h.number; break; }
      }
    }

    // 预计算：每颗行星的 star lord
    const planetStarLord = {};
    for (const pname of PLANET_NAMES) {
      if (planets[pname]) planetStarLord[pname] = planets[pname].nakshatraLord;
    }

    // 预计算：每宫的 owner planet（星座主是哪颗行星）
    const houseOwner = {};
    for (const h of houses) {
      houseOwner[h.number] = h.lord;
    }

    for (const planetName of PLANET_NAMES) {
      const p = planets[planetName];
      if (!p) continue;

      const signifiedHouses = new Set();
      const strengthOrder = [];

      // A (StarLord): 如果此行星是某行星 X 的 star lord，且 X 落入某宫 → signify 该宫
      for (const otherName of PLANET_NAMES) {
        if (otherName === planetName) continue;
        const otherStarLord = planetStarLord[otherName];
        if (otherStarLord === planetName) {
          const otherHouse = planetHouse[otherName];
          if (otherHouse) {
            signifiedHouses.add(otherHouse);
            strengthOrder.push([otherHouse, 'StarLord']);
          }
        }
      }

      // B (Occupant): 此行星落入的宫
      const myHouse = planetHouse[planetName];
      if (myHouse) {
        signifiedHouses.add(myHouse);
        strengthOrder.push([myHouse, 'Occupant']);
      }

      // C (StarLord of Owner): 如果此行星是某宫 owner 的 star lord → signify 该宫
      for (const h of houses) {
        const owner = houseOwner[h.number];
        if (owner && owner !== planetName) {
          const ownerStarLord = planetStarLord[owner];
          if (ownerStarLord === planetName) {
            if (!signifiedHouses.has(h.number)) {
              signifiedHouses.add(h.number);
              strengthOrder.push([h.number, 'StarLord']);
            }
          }
        }
      }

      // D (Owner): 此行星拥有的星座对应的宫
      for (const h of houses) {
        if (h.lord === planetName) {
          signifiedHouses.add(h.number);
          strengthOrder.push([h.number, 'Owner']);
        }
      }

      // E (Aspecting): 此行星相位的宫
      const aspects = VEDIC_ASPECTS[planetName] || [7];
      for (const asp of aspects) {
        const toSign = (p.rashi + asp - 1) % 12;
        for (const h of houses) {
          if (h.sign === toSign) {
            signifiedHouses.add(h.number);
            strengthOrder.push([h.number, 'Aspecting']);
          }
        }
      }

      result.push({
        planet: planetName,
        signifiedHouses: [...signifiedHouses].sort((a, b) => a - b),
        strengthOrder
      });
    }

    return result;
  }

  // ───────────────────────── Rahu/Ketu 代理（经典四重）─────────────────────────
  //
  // 权威规则（AstroSage 官方教程 + KSK 原著）：
  //   1. 合相行星（conjoining）— 与 Rahu/Ketu 同宫的行星
  //   2. 相位行星（aspecting）— 对 Rahu/Ketu 形成相位的行星
  //   3. 星主（Nakshatra Lord / Star Lord）
  //   4. 星座主星（Sign Lord / Dispositor）
  //
  // 现代扩展五重：加"自己所在宫位"作为第 0 层（可选）

  function computeRahuKetuProxy(planets, houses) {
    const compute = (name) => {
      const p = planets[name];
      if (!p) return null;
      
      // 用 computeRahuKetuAgents 获取四重代理（已按优先级排序）
      const agents = computeRahuKetuAgents(name, planets);
      
      // 按四重结构返回
      const myHouse = houses.find(h => h.occupants.includes(name));
      
      // 1. 合相行星
      const conjunct = [];
      for (const pname of PLANET_NAMES) {
        if (pname === name) continue;
        const pp = planets[pname];
        if (pp && pp.rashi === p.rashi) conjunct.push(pname);
      }
      // 2. 相位行星
      const aspecting = [];
      for (const pname of PLANET_NAMES) {
        if (pname === name) continue;
        const pp = planets[pname];
        if (!pp) continue;
        const aspects = VEDIC_ASPECTS[pname] || [7];
        for (const asp of aspects) {
          const toSign = (pp.rashi + asp - 1) % 12;
          if (toSign === p.rashi) { aspecting.push(pname); break; }
        }
      }
      // 3. 星主
      const starLord = p.nakshatraLord;
      // 4. 星座主星
      const signLord = p.rashiLord;

      return {
        name,
        position: `${p.rashiName} ${degToDms(p.longitude)} (${p.nakshatraName} nakshatra)`,
        levels: [
          { level: 1, source: '合相行星 (Conjunct Planet)', significator: conjunct.length ? conjunct.join(', ') : '无 (None)' },
          { level: 2, source: '相位行星 (Aspecting Planet)', significator: aspecting.length ? aspecting.join(', ') : '无 (None)' },
          { level: 3, source: '星主 (Nakshatra Lord / Star Lord)', significator: starLord },
          { level: 4, source: '星座主星 (Sign Lord / Dispositor)', significator: signLord }
        ],
        agents: agents  // 完整代理列表（按优先级）
      };
    };
    return {
      rahu: compute('Rahu'),
      ketu: compute('Ketu')
    };
  }

  // ───────────────────────── 双轨相位 ─────────────────────────

  function computeAspects(planets) {
    const vedic = [];
    const western = [];
    for (const p1Name of PLANET_NAMES) {
      const p1 = planets[p1Name];
      if (!p1) continue;
      for (const p2Name of PLANET_NAMES) {
        const p2 = planets[p2Name];
        if (!p2) continue;
        if (p1Name === p2Name) continue;
        // Vedic Drishti
        const aspects = VEDIC_ASPECTS[p1Name] || [7]; // 默认 7th
        for (const asp of aspects) {
          const toSign = (p1.rashi + asp - 1) % 12;
          if (toSign === p2.rashi) {
            // 去重：避免 (A→B, B→A) 双向重复（Vedic 相位是单向的，保留）
            vedic.push({
              from: p1Name, fromSign: p1.rashiName,
              aspect: `${asp}th aspect (Vedic)`,
              to: p2Name, toSign: p2.rashiName
            });
          }
        }
      }
    }
    // Western 度数相位（去重：每对只算一次）
    const seen = new Set();
    for (let i = 0; i < PLANET_NAMES.length; i++) {
      const p1 = planets[PLANET_NAMES[i]];
      if (!p1) continue;
      for (let j = i + 1; j < PLANET_NAMES.length; j++) {
        const p2 = planets[PLANET_NAMES[j]];
        if (!p2) continue;
        const diff = Math.abs(norm(p1.longitude - p2.longitude));
        const diffWrap = Math.min(diff, 360 - diff);
        for (const asp of WESTERN_ASPECTS) {
          if (Math.abs(diffWrap - asp.angle) <= asp.orb) {
            western.push({
              a: PLANET_NAMES[i],
              b: PLANET_NAMES[j],
              aspect: asp.name,
              orb: Math.abs(diffWrap - asp.angle).toFixed(1) + '°'
            });
            break; // 一对行星只取最匹配的相位
          }
        }
      }
    }
    return { vedic, western };
  }

  // ───────────────────────── 行星状态 ─────────────────────────

  function computePlanetStates(planets) {
    const sun = planets.Sun;
    if (!sun) return [];
    return PLANET_NAMES.map(name => {
      const p = planets[name];
      if (!p) return null;
      // 距日度数
      const distToSun = Math.abs(norm(p.longitude - sun.longitude));
      const distWrap = Math.min(distToSun, 360 - distToSun);
      // 燃烧判定（KP 标准）：太阳±8.5° 内的行星算燃烧
      // 燃烧阈值（XALEN dosha.rs + BPHS 权威值）
      // Moon 12°, Mars 17°, Mercury 14°/12°逆, Venus 10°/8°逆, Jupiter 11°, Saturn 15°
      // KP 注：水星经常燃烧（离太阳近），但 KP 认为燃烧不破坏水星征象
      const combustThresholds = {
        Moon: 12, Mars: 17, Jupiter: 11, Saturn: 15
      };
      // Mercury 和 Venus 区分顺逆行
      let isCombust = false;
      if (name === 'Mercury') {
        isCombust = distWrap < (p.isRetrograde ? 12 : 14);
      } else if (name === 'Venus') {
        isCombust = distWrap < (p.isRetrograde ? 8 : 10);
      } else if (name !== 'Sun' && name !== 'Rahu' && name !== 'Ketu') {
        isCombust = distWrap < (combustThresholds[name] || 10);
      }
      return {
        name,
        state: p.isRetrograde ? '℞ Retrograde' : 'Direct',
        speed: p.speed.toFixed(4),
        isCombust,
        distToSun: distWrap.toFixed(2) + '°'
      };
    }).filter(Boolean);
  }

  // ───────────────────────── 行星尊贵状态 ─────────────────────────

  // 行星的本宫/庙旺/落陷
  function getAbsoluteDignity(planet, signIdx) {
    // 简化版：返回本宫/庙旺/落陷/平相
    const exalted = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 6 };
    const debilitated = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 0 };
    const ownSign = {
      Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
      Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
      Rahu: [1, 6, 9, 10], Ketu: [0, 4, 5, 9]
    };
    if (exalted[planet] === signIdx) return { mark: '↑', text: '庙旺 (Exalted)' };
    if (debilitated[planet] === signIdx) return { mark: '↓', text: '落陷 (Debilitated)' };
    if (ownSign[planet]?.includes(signIdx)) return { mark: '★', text: '本宫 (Own Sign)' };
    return { mark: '○', text: '平相 (Ordinary)' };
  }

  function getRelativeDignity(planet, signIdx) {
    const signLord = RASHI_LORDS[signIdx];
    const relation = NAISARGIKA[signLord]?.[planet];
    if (relation === 'F') return { mark: '+', text: '友宫 (Friend)' };
    if (relation === 'E') return { mark: '-', text: '敌宫 (Enemy)' };
    if (relation === 'N') return { mark: '○', text: '中性宫 (Neutral)' };
    return { mark: '?', text: '未知' };
  }

  function computePlanetDignity(planets) {
    return PLANET_NAMES.map(name => {
      const p = planets[name];
      if (!p) return null;
      const abs = getAbsoluteDignity(name, p.rashi);
      const rel = getRelativeDignity(name, p.rashi);
      return {
        name,
        sign: p.rashiName,
        absolute: abs,
        relative: rel
      };
    }).filter(Boolean);
  }

  // ───────────────────────── Dasha ─────────────────────────

  function findCurrentDasha(dashas, jdNow) {
    // 兼容两种格式：
    //   stub: {lord, startJd, endJd, durationYears, antardashas, pratyantardashas}
    //   XALEN WASM: {lord, start_jd, end_jd, level, sub_periods}
    const getStart = (d) => d.startJd ?? d.start_jd;
    const getEnd = (d) => d.endJd ?? d.end_jd;
    const getSubs = (d) => d.antardashas ?? d.sub_periods ?? [];
    
    for (const maha of dashas) {
      if (jdNow >= getStart(maha) && jdNow < getEnd(maha)) {
        for (const antar of getSubs(maha)) {
          if (jdNow >= getStart(antar) && jdNow < getEnd(antar)) {
            // 找 pratyantardasha（XALEN WASM 的 antardasha.sub_periods 可能为空）
            let pratyantar = null;
            const pratyantardashas = antar.pratyantardashas ?? antar.sub_periods ?? [];
            for (const pa of pratyantardashas) {
              if (jdNow >= getStart(pa) && jdNow < getEnd(pa)) {
                pratyantar = { lord: pa.lord, startJd: getStart(pa), endJd: getEnd(pa) };
                break;
              }
            }
            return {
              mahadasha: { lord: maha.lord, startJd: getStart(maha), endJd: getEnd(maha), durationYears: maha.durationYears },
              antardasha: { lord: antar.lord, startJd: getStart(antar), endJd: getEnd(antar), durationYears: antar.durationYears },
              pratyantardasha: pratyantar
            };
          }
        }
      }
    }
    return null;
  }

  // ───────────────────────── 数字起卦 ─────────────────────────

  // ───────────────────────── KSK 249 Horary Number 表 ─────────────────────────
  //
  // 用 XALEN 库的 kp.rs 同款算法（来自 crates/xalen-vedic/src/kp.rs 的 kp_segment_starts()）：
  //   1. 生成 243 个基础 sub（27 nakshatras × 9 sub-lords，按 Vimshottari 比例）
  //   2. 在星座边界（每 30°）切分跨越的 sub，得到 249 个 segment
  //   3. 数字 N = 第 N 个 segment 的起点（sidereal 度数）
  //
  // 验证（与 XALEN 测试断言一致）：
  //   - 总共 249 个 segment
  //   - starts[0] = 0.0 (Aries 0°)
  //   - KP#1 = 0°, KP#249 = 最后一段
  //   - KP#123 = 176.1111° = Virgo 26°06'40" (Chitra/Jupiter sub 起点)

  const KSK_249_TABLE = (function() {
    const nakSize = 360.0 / 27;
    const EPS = 1e-6;

    // Snap 函数：把接近 30° 倍数的值精确到边界（避免浮点误差）
    const snap = (x) => {
      const nearest = Math.round(x / 30.0) * 30.0;
      if (Math.abs(x - nearest) < EPS) return nearest;
      return x;
    };

    // Step 1: 生成 243 个基础 sub (start, end)
    const raw = [];
    let degree = 0.0;
    for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
      const nakLord = NAK_LORDS[nakIdx % 9];
      const startSeq = NAK_LORDS.indexOf(nakLord);
      for (let subI = 0; subI < 9; subI++) {
        const lord = NAK_LORDS[(startSeq + subI) % 9];
        const span = DASHA_YEARS[lord] / 120 * nakSize;
        const s = degree;
        const e = degree + span;
        raw.push({ start: s, end: e, nakIdx, subLord: lord });
        degree = e;
      }
    }

    // Step 2: 在星座边界切分，生成 249 个 segment
    // 每个 segment 记录起点度数 + 所属 nakshatra + sub lord
    const table = [];
    for (const seg of raw) {
      const s = snap(seg.start);
      // 第一个 segment 起点
      table.push({ num: table.length + 1, deg: s, nakIdx: seg.nakIdx, subLord: seg.subLord });
      // 内部星座边界（30, 60, ..., 330）
      let b = (Math.floor(s / 30.0) + 1) * 30;
      while (b < seg.end - EPS) {
        if (b > s + EPS) {
          // 边界切分产生的新 segment，sub lord 不变（同一个 sub 被切成两段）
          table.push({ num: table.length + 1, deg: b, nakIdx: seg.nakIdx, subLord: seg.subLord });
        }
        b += 30;
      }
    }

    return table;
  })();

  // 测试用：验证 KSK 表
  // console.log('KSK table size:', KSK_249_TABLE.length, 'first:', KSK_249_TABLE[0], 'last:', KSK_249_TABLE[248]);
  // console.log('KP#123:', KSK_249_TABLE[122]);

  // ───────────────────────── KP 事件许诺（HousePromise + KpEvent）─────────────────────────
  //
  // 来自 XALEN 库 crates/xalen-vedic/src/kp.rs 的 KpEvent 和 HousePromise
  // 用于判断某个宫位的 CSL 是否"许诺"该宫位的事项（Positive/Negative/Mixed）
  // 以及 8 类人生事件（Marriage/Job/Health/...）是否许诺

  // 8 类人生事件
  const KP_EVENTS = {
    Marriage:     { primaryHouse: 7,  favorable: [2, 7, 11],         negating: [1, 6, 10, 12] },
    Job:          { primaryHouse: 10, favorable: [2, 6, 10, 11],     negating: [5, 8, 12] },
    Health:       { primaryHouse: 1,  favorable: [1, 5, 11],         negating: [6, 8, 12] },
    ChildBirth:   { primaryHouse: 5,  favorable: [2, 5, 11],         negating: [4, 8, 12] },
    Education:    { primaryHouse: 4,  favorable: [4, 9, 11],         negating: [3, 8, 12] },
    ForeignTravel:{ primaryHouse: 12, favorable: [3, 9, 12],         negating: [1, 4, 10] },
    Wealth:       { primaryHouse: 2,  favorable: [1, 2, 6, 11],      negating: [5, 8, 12] },
    Litigation:   { primaryHouse: 6,  favorable: [1, 2, 6, 11],      negating: [5, 8, 12] }
  };

  // 每宫的许诺判定（favorable / unfavorable houses，来自 XALEN kp.rs）
  const CUSP_FAVORABLE = {
    1:  [1, 5, 9, 11],
    2:  [2, 6, 10, 11],
    3:  [3, 6, 10, 11],
    4:  [4, 2, 11],
    5:  [2, 5, 11],
    6:  [1, 2, 6, 10, 11],
    7:  [2, 7, 11],
    8:  [1, 5, 8, 11],
    9:  [2, 9, 11],
    10: [2, 6, 10, 11],
    11: [2, 3, 6, 11],
    12: [3, 9, 12]
  };
  const CUSP_UNFAVORABLE = {
    1:  [6, 8, 12],
    2:  [5, 8, 12],
    3:  [8, 12],
    4:  [3, 5, 12],
    5:  [4, 8, 12],
    6:  [5, 11, 12],
    7:  [1, 6, 10, 12],
    8:  [6, 12],
    9:  [3, 8, 12],
    10: [5, 8, 12],
    11: [5, 8, 12],
    12: [1, 2, 6, 10]
  };

  /**
   * 计算每个宫位的许诺（Positive/Negative/Mixed）
   * 基于 CSL（宫头子主）的征象星是否落在该宫的 favorable/unfavorable 列表
   */
  function computeHousePromises(houses, significators) {
    return houses.map(h => {
      const csl = h.cuspSubLord;
      // 找 CSL 行星的征象宫位
      const cslSig = significators.find(s => s.planet === csl);
      const sigHouses = cslSig ? cslSig.signifiedHouses : [];
      const fav = CUSP_FAVORABLE[h.number] || [];
      const unfav = CUSP_UNFAVORABLE[h.number] || [];
      const favCount = sigHouses.filter(x => fav.includes(x)).length;
      const unfavCount = sigHouses.filter(x => unfav.includes(x)).length;
      let promise;
      if (favCount > 0 && unfavCount === 0) promise = 'Positive';
      else if (unfavCount > 0 && favCount === 0) promise = 'Negative';
      else if (favCount > 0 && unfavCount > 0) promise = 'Mixed';
      else promise = 'Mixed';
      return { house: h.number, csl, promise, favCount, unfavCount };
    });
  }

  /**
   * 检查 8 类人生事件是否许诺
   */
  function computeEventPromises(houses, significators) {
    const results = [];
    for (const [eventName, cfg] of Object.entries(KP_EVENTS)) {
      const primaryHouse = houses.find(h => h.number === cfg.primaryHouse);
      if (!primaryHouse) continue;
      const csl = primaryHouse.cuspSubLord;
      const cslSig = significators.find(s => s.planet === csl);
      const sigHouses = cslSig ? cslSig.signifiedHouses : [];
      const favCount = sigHouses.filter(x => cfg.favorable.includes(x)).length;
      const negCount = sigHouses.filter(x => cfg.negating.includes(x)).length;
      results.push({
        event: eventName,
        primaryHouse: cfg.primaryHouse,
        csl,
        promised: favCount > negCount,
        favCount,
        negCount
      });
    }
    return results;
  }

  function computeNumberDivination(num) {
    if (!num || num < 1) num = 1;
    if (num > 249) num = ((num - 1) % 249) + 1;
    // 用 KSK 249 表查精确 sub 起点
    const entry = KSK_249_TABLE[num - 1];
    const deg = entry.deg;
    const nakIdx = entry.nakIdx;
    return {
      number: num,
      mappedDegree: deg,
      rashi: RASHIS[rashiOf(deg)],
      rashiAbbr: RASHIS_ABBR[rashiOf(deg)],
      nakshatra: NAKSHATRAS[nakIdx],
      nakshatraLord: NAK_LORDS[nakIdx % 9],
      subLord: entry.subLord,
      subSubLord: kpSubSubLord(deg),
      pada: padaOf(deg)
    };
  }

  /**
   * KP Horary 关键方法：
   * - 上升点 = Horary Number 对应的 KSK 249 sub 起点（不是真实时间！）
   * - 其他行星 = 真实时间的天文位置
   * - 宫位 = 基于上升点的 Placidus 或 Whole-Sign
   *
   * 这个函数用 Horary Number 替换 computeChart 里的真实时间上升点
   */
  function applyHoraryAscendant(result, horaryNumber) {
    if (!horaryNumber || horaryNumber < 1 || horaryNumber > 249) return result;
    const entry = KSK_249_TABLE[horaryNumber - 1];
    const newAscDeg = entry.deg;
    // 用 Horary Number 的上升点替换真实时间上升点
    // subLord 直接用 KSK 表的值（避免 kpSubLord 函数的浮点误差）
    const newAsc = {
      name: 'Ascendant',
      longitude: newAscDeg,
      rashi: rashiOf(newAscDeg),
      rashiName: RASHIS[rashiOf(newAscDeg)],
      rashiAbbr: RASHIS_ABBR[rashiOf(newAscDeg)],
      rashiLord: rashiLordOf(newAscDeg),
      nakshatra: entry.nakIdx,
      nakshatraName: NAKSHATRAS[entry.nakIdx],
      nakshatraLord: NAK_LORDS[entry.nakIdx % 9],
      pada: padaOf(newAscDeg),
      subLord: entry.subLord,  // 直接用 KSK 表的 sub lord
      subSubLord: kpSubSubLord(newAscDeg),
      isHorary: true,
      horaryNumber: horaryNumber
    };
    result.ascendant = newAsc;

    // 重新计算 12 宫（基于新上升点）
    // 用 Whole-Sign：1宫 = 上升所在星座
    const ascSign = newAsc.rashi;
    const aya = result.meta.ayanamsa;
    for (let i = 0; i < 12; i++) {
      const sign = (ascSign + i) % 12;
      const cuspDeg = sign * 30 + 15;  // 宫头中点
      const nextSign = (ascSign + i + 1) % 12;
      const nextCuspDeg = nextSign * 30 + 15;
      // 重新算 occupants
      const occupants = [];
      for (const pname of PLANET_NAMES) {
        if (!result.planets[pname]) continue;
        if (result.planets[pname].rashi === sign) occupants.push(pname);
      }
      result.houses[i] = {
        number: i + 1,
        sign: sign,
        signName: RASHIS[sign],
        lord: RASHI_LORDS[sign],
        occupants: occupants,
        cuspDeg: cuspDeg,
        cuspNakshatra: NAKSHATRAS[nakshatraOf(cuspDeg)],
        cuspNakshatraLord: nakLordOf(cuspDeg),
        cuspSubLord: kpSubLord(cuspDeg),
        cuspSubSubLord: kpSubSubLord(cuspDeg)
      };
    }

    // 重新算 RP（上升相关项变了）
    result.rulingPlanets = computeRulingPlanets(newAsc, result.planets, result.meta.jdUt1, result.input.rpMode || 'ksk5');

    // 重新算 Significators（宫位变了，征象星跟着变）
    result.significators = computeSignificators(result.houses, result.planets);

    // 重新算 CSL 分析
    result.cslAnalysis = computeCslAnalysis(result.houses, result.planets, result.significators);

    // 重新算 House Promises（基于新 CSL）
    result.housePromises = computeHousePromises(result.houses, result.significators);

    // 重新算 Event Promises（8 类人生事件）
    result.eventPromises = computeEventPromises(result.houses, result.significators);

    // 重新算 Rahu/Ketu 五重代理
    result.rahuKetuProxy = computeRahuKetuProxy(result.planets, result.houses);

    // 重新算相位（行星不变，相位不变）

    // 更新 Quick Tag
    result.quickTag = `上升子主 ≡ 1宫宫头子主：${newAsc.subLord}`;

    return result;
  }

  // ───────────────────────── 完整 LLM 文本生成 ─────────────────────────

  /**
   * 生成与原版兼容的完整 LLM 解读文本（Markdown 格式）
   */
  function buildLLMText(result) {
    const lines = [];
    const inp = result.input;
    const m = result.meta;

    lines.push(`🔮 KP 占星问卦盘解读请求 / KP Astrology Prasna (Horary) Chart Analysis Request`);
    lines.push('');
    lines.push(`📊 元数据 / Meta Data (Context)`);
    lines.push(`- 占问事项 / Query:  ${esc(inp.topic || 'General Query')}`);
    lines.push(`- 性别 / Gender:  ${inp.gender ? inp.gender.charAt(0).toUpperCase() + inp.gender.slice(1) : 'Not Specified'}`);
    const tzSign = inp.tzOffsetMin >= 0 ? '+' : '-';
    const tzH = Math.abs(Math.floor(inp.tzOffsetMin / 60));
    const tzM = Math.abs(inp.tzOffsetMin % 60);
    lines.push(`- 占问时间 / Query Time:  ${inp.year}-${pad(inp.month)}-${pad(inp.day)} ${pad(inp.hour)}:${pad(inp.minute)}:${pad(inp.second || 0)} (本地时间 / Local, UTC${tzSign}${String(tzH).padStart(2,'0')}:${String(tzM).padStart(2,'0')})`);
    lines.push(`- 地点 / Location:  ${inp.lat.toFixed(4)}° N, ${inp.lon.toFixed(4)}° E (Timezone Offset: ${tzSign}${tzH*60+tzM} mins)`);
    const ayaName = m.ayanamsaId === 1 ? 'KP Ayanamsa (Krishnamurti)' : (m.ayanamsaId === 0 ? 'Lahiri' : `Ayanamsa #${m.ayanamsaId}`);
    lines.push(`- 岁差 / Ayanamsa:  ${ayaName} — ${m.ayanamsa.toFixed(6)}°`);
    lines.push(`- 宫位制 / House System:  ${m.houseSystem === 2 ? 'Placidus' : 'Whole-Sign'}`);
    lines.push(`- 模式 / Mode: 问卦数字 / Horary Number:  ${inp.number || 'N/A'}`);
    lines.push(`- 计算引擎 / Engine:  XALEN Ephemeris (${m.xalenMode.toUpperCase()})`);
    lines.push('');

    // 7 RP
    const rpCount = inp.rpMode === 'extended7' ? 7 : 5;
    const rpLabel = inp.rpMode === 'extended7' ? '7 (Extended)' : '5 (KSK Classic)';
    lines.push(`⚖️ The ${rpCount} Ruling Planets (The Divine Judges) — ${rpLabel}`);
    lines.push('');
    lines.push(`在 KP 问卦中，统治星是时间过滤与事件验证的终极判定星。
In advanced KP Prasna, ruling planets are the ultimate filters for timing and confirming events.`);
    lines.push('');
    for (const rp of result.rulingPlanets) {
      lines.push(`- ${rp.rolesEn[0]}: ${rp.planet}`);
    }
    lines.push('');

    // 行星位置
    lines.push(`🪐 Planet Positions (Grahas)`);
    lines.push('');
    lines.push(`关注子主 / Sub Lord 来判断行星的最终结果。
Focus on the Sub Lord to see the final result of the planet.`);
    lines.push('');
    lines.push(`| 行星 / Planet | 经度 / Longitude | 星座 / Sign | 宫 / House | 星座主 / Sign Lord | 星宿 / Nakshatra | 星宿主 / Star Lord | 子主 / Sub Lord | 子子主 / SSL | D9 / Navamsa |`);
    lines.push(`|--------|-----------|------|-------|-----------|-----------|------------|----------|-----|---------|`);
    // 上升点
    const a = result.ascendant;
    lines.push(`| Ascendant | ${degToDms(a.longitude)} ${RASHIS_ABBR[a.rashi]} | ${a.rashiName} | 1 | ${a.rashiLord} | ${a.nakshatraName} | ${a.nakshatraLord} | ${a.subLord} | ${a.subSubLord} | ${getNavamsa(a.longitude)} |`);
    // 行星
    for (const name of PLANET_NAMES) {
      const p = result.planets[name];
      if (!p) continue;
      // 找行星所在宫
      const house = result.houses.find(h => h.occupants.includes(name));
      const houseNum = house ? house.number : '?';
      const retroMark = p.isRetrograde ? ' ℞' : '';
      lines.push(`| ${name}${retroMark} | ${degToDms(p.longitude)} ${p.rashiAbbr} | ${p.rashiName} | ${houseNum} | ${p.rashiLord} | ${p.nakshatraName} | ${p.nakshatraLord} | ${p.subLord} | ${p.subSubLord} | ${getNavamsa(p.longitude)} |`);
    }
    lines.push('');

    // 宫头位置
    lines.push(`🏛️ Cuspal Positions (Bhavas) - ${m.houseSystem === 2 ? 'Placidus' : 'Whole-Sign'} System`);
    lines.push('');
    lines.push(`宫头子主 / CSL 是判断该宫事项是否成真的最终决定因素。
The Cuspal Sub Lord (CSL) is the final deciding factor for whether a house's matters will fructify.`);
    lines.push('');
    lines.push(`| 宫 / Cusp | 经度 / Longitude | 星座 / Sign | 星座主 / Sign Lord | 星宿 / Nakshatra | 星宿主 / Star Lord | 子主 / CSL | 子子主 / SSL | D9 / Navamsa |`);
    lines.push(`|------|-----------|------|-----------|-----------|------------|----------------|-----|---------|`);
    for (const h of result.houses) {
      const label = h.number === 1 ? `1st House (Asc)` : `${h.number}th House`;
      lines.push(`| ${label} | ${degToDms(h.cuspDeg)} ${RASHIS_ABBR[h.sign]} | ${h.signName} | ${h.lord} | ${h.cuspNakshatra} | ${h.cuspNakshatraLord} | ${h.cuspSubLord} | ${h.cuspSubSubLord} | ${getNavamsa(h.cuspDeg)} |`);
    }
    lines.push('');

    // CSL 分析表
    lines.push(`🔍 CSL Analysis Table (宫头子主分析表)`);
    lines.push('');
    lines.push(`For each house: its CSL (Cuspal Sub Lord), which house the CSL planet is posited in, which houses the CSL rules (as sign lord), the CSL's Star Lord, and where that Star Lord is posited. This is the core KP significator chain.`);
    lines.push('');
    lines.push(`| 宫 / House | CSL | CSL所在宫 / Position | CSL主宰宫 / Rules | CSL星宿主 / Star Lord | 星宿主所在宫 / Star Pos |`);
    lines.push(`|-------|-----|---------------------|--------------------|---------------|---------------------------|`);
    for (const c of result.cslAnalysis) {
      lines.push(`| ${c.house} | ${c.csl} | ${c.cslHouse || '—'} | ${c.cslRules} | ${c.cslStarLord} | ${c.starLordHouse || '—'} |`);
    }
    lines.push('');

    // House Promises（XALEN HousePromise）
    if (result.housePromises && result.housePromises.length) {
      lines.push(`🎯 House Promises (宫位许诺 — XALEN HousePromise)`);
      lines.push('');
      lines.push(`每宫 CSL 是否许诺该宫事项。✅Positive=吉 ❌Negative=凶 ⚠️Mixed=混合`);
      lines.push('');
      lines.push(`| 宫 / House | CSL | 许诺 / Promise | 吉 / Fav | 凶 / Unfav |`);
      lines.push(`|-------|-----|---------|-----------------|-------------------|`);
      for (const hp of result.housePromises) {
        const promiseMark = hp.promise === 'Positive' ? '✅ Positive' : (hp.promise === 'Negative' ? '❌ Negative' : '⚠️ Mixed');
        lines.push(`| ${hp.house} | ${hp.csl} | ${promiseMark} | ${hp.favCount} | ${hp.unfavCount} |`);
      }
      lines.push('');
    }

    // Event Promises（XALEN KpEvent）
    if (result.eventPromises && result.eventPromises.length) {
      lines.push(`💍 Event Promises (人生事件许诺 — XALEN KpEvent)`);
      lines.push('');
      lines.push(`8 类人生事件是否许诺。基于 XALEN KpEvent。`);
      lines.push('');
      lines.push(`| 事件 / Event | 主宫 / House | CSL | 许诺 / Promised | 吉 / Fav | 凶 / Neg |`);
      lines.push(`|-------|--------------|-----|----------|-----------|-----------|`);
      for (const ep of result.eventPromises) {
        const promisedMark = ep.promised ? '✅ Yes' : '❌ No';
        lines.push(`| ${ep.event} | ${ep.primaryHouse} | ${ep.csl} | ${promisedMark} | ${ep.favCount} | ${ep.negCount} |`);
      }
      lines.push('');
    }

    // Vimshottari Dasha
    if (result.dasha) {
      const d = result.dasha;
      lines.push(`⏳ Vimsottari Dasha Timeline`);
      lines.push('');
      const moon = result.planets.Moon;
      lines.push(`Based on the Moon's nakshatra position at chart time. Used for timing (应期) of events.`);
      lines.push(`Current Active Dasha at Chart Time: ${d.mahadasha.lord} MD → ${d.antardasha.lord} AD${d.pratyantardasha ? ` → ${d.pratyantardasha.lord} PD` : ''}`);
      lines.push(`Starting Dasha Parameters: Moon in ${moon.nakshatraName} (Lord: ${moon.nakshatraLord}) → Starting Mahadasha: ${moon.nakshatraLord}`);
      lines.push('');

      // 大运
      lines.push(`Mahadasha Sequence (120-year cycle)`);
      lines.push('');
      lines.push(`| Mahadasha | Lord | Start | End | Duration |`);
      lines.push(`|-----------|------|-------|-----|----------|`);
      for (const maha of result.fullDasha) {
        const isCurrent = maha.lord === d.mahadasha.lord;
        lines.push(`| MD | ${maha.lord}${isCurrent ? ' ← current' : ''} | ${fmtDate(maha.startJd ?? maha.start_jd)} | ${fmtDate(maha.endJd ?? maha.end_jd)} | ${((maha.endJd ?? maha.end_jd) - (maha.startJd ?? maha.start_jd))/365.25}年 |`);
      }
      lines.push('');

      // 当前大运的副运
      const currentMaha = result.fullDasha.find(m => m.lord === d.mahadasha.lord);
      const antardashas = currentMaha.antardashas ?? currentMaha.sub_periods ?? [];
      if (currentMaha && antardashas.length) {
        lines.push(`Antardasha (under current ${d.mahadasha.lord} Mahadasha)`);
        lines.push('');
        lines.push(`| Antardasha (under ${d.mahadasha.lord} MD) | Lord | Start | End | Duration |`);
        lines.push(`|----------------------------------|------|-------|-----|----------|`);
        for (const antar of antardashas) {
          const isCurrent = antar.lord === d.antardasha.lord;
          lines.push(`| AD | ${antar.lord}${isCurrent ? ' ← current' : ''} | ${fmtDate(antar.startJd ?? antar.start_jd)} | ${fmtDate(antar.endJd ?? antar.end_jd)} | ${((antar.endJd ?? antar.end_jd) - (antar.startJd ?? antar.start_jd))/365.25}年 |`);
        }
        lines.push('');

        // 当前副运的小运
        const currentAntar = antardashas.find(a => a.lord === d.antardasha.lord);
        const pratyantardashas = currentAntar?.pratyantardashas ?? currentAntar?.sub_periods ?? [];
        if (currentAntar && pratyantardashas.length) {
          lines.push(`Pratyantardasha (under current ${d.mahadasha.lord} MD / ${d.antardasha.lord} AD)`);
          lines.push('');
          lines.push(`| Pratyantardasha (under ${d.mahadasha.lord} MD / ${d.antardasha.lord} AD) | Lord | Start | End | Duration |`);
          lines.push(`|-----------------------------------------------------|------|-------|-----|----------|`);
          for (const pa of pratyantardashas) {
            const isCurrent = d.pratyantardasha && pa.lord === d.pratyantardasha.lord;
            lines.push(`| PD | ${pa.lord}${isCurrent ? ' ← current' : ''} | ${fmtDate(pa.startJd ?? pa.start_jd)} | ${fmtDate(pa.endJd ?? pa.end_jd)} | ${((pa.endJd ?? pa.end_jd) - (pa.startJd ?? pa.start_jd))/365.25}年 |`);
          }
          lines.push('');
        }
      }
    }

    // Rahu/Ketu 五重代理
    lines.push(`🌑 Rahu / Ketu Five-fold Significators (KP 五重代理分析表)`);
    lines.push('');
    lines.push(`在KP占星体系中，罗/计作为"阴影星"无本属星座，此表作为KP"四步理论"的最前置阶段（Step 0），用于确立罗/计的"代理身份"。它们本身不直接产生吉凶，而是作为放大器传递表中象征星的结果。这是后续推演罗/计大运（Dasha/Bhukti）事件唯一的底层数据源。`);
    lines.push('');

    for (const nodeName of ['rahu', 'ketu']) {
      const node = result.rahuKetuProxy[nodeName];
      if (!node) continue;
      const nameCap = nodeName.charAt(0).toUpperCase() + nodeName.slice(1);
      const nameCn = nodeName === 'rahu' ? '罗睺' : '计都';
      lines.push(`${nameCap} (${nameCn}) 五重代理分析`);
      lines.push('');
      lines.push(`Position: ${node.position}`);
      lines.push('');
      lines.push(`| Level | Source / Role in KP | Significator Planet |`);
      lines.push(`|-------|-------------------|---------------------|`);
      for (const lv of node.levels) {
        lines.push(`| ${lv.level}. ${lv.source.split('(')[0].trim()} | ${lv.source} | ${lv.significator} |`);
      }
      lines.push('');
    }

    lines.push(`【权重与解读说明】：在KP占星界，罗/计的力量优先级存在两套权威标准，APP已为您全部兼容：`);
    lines.push(``);
    lines.push(`现代主流软件算法（四步理论）：遵循"星宿主（第四层） > 同宫星（第二层） > 落座主星（第一层） > 相位星（第三层）"。`);
    lines.push(`KSK原著断事标准（KP Reader Vol.5）：规定罗计作为特殊节点，断事优先级为"同宫星 > 相位星 > 星宿主 > 落座主星"。`);
    lines.push(`综合实战中，通常以星宿主和同宫星作为最核心指标。预测时，请以表格中优先级最高的星曜所掌管的宫位（Bhavas）作为大运/小运的"主旋律"，其余层级作为吉凶的修正与补充。`);
    lines.push('');

    // 征象星参考表
    lines.push(`📚 Significators Reference (征象星参考表)`);
    lines.push('');
    lines.push(`Use this table to map planets and houses to their signified matters. L=Sign Lord, SL=Star Lord, CSL=Cuspal Sub Lord, [planets]=planets posited in that house.`);
    lines.push('');
    lines.push(`Planet Significations`);
    lines.push('');
    lines.push(`| Planet | General | Signified Matters |`);
    lines.push(`|--------|---------|-------------------|`);
    for (const name of PLANET_NAMES) {
      const sig = (PLANET_SIGNIFICATIONS[name] || '').split(' | ');
      lines.push(`| ${name} | ${sig[0] || ''} | ${sig[1] || ''} |`);
    }
    lines.push('');

    lines.push(`House Significations (with this chart's significators)`);
    lines.push('');
    lines.push(`| House | General | Signified Matters | Significators (This Chart) |`);
    lines.push(`|-------|---------|-------------------|---------------------------|`);
    for (const h of result.houses) {
      const sig = (HOUSE_SIGNIFICATIONS[h.number] || '').split(' | ');
      const csl = h.cuspSubLord;
      const starLord = h.cuspNakshatraLord;
      const lord = h.lord;
      const occupants = h.occupants.length ? `[${h.occupants.join(', ')}]` : '[—]';
      lines.push(`| ${h.number} | ${sig[0] || ''} | ${sig[1] || ''} | ${lord}(L), ${starLord}(SL), ${csl}(CSL), ${occupants} |`);
    }
    lines.push('');

    // 双轨相位
    lines.push(`👁️ Planetary Aspects (双轨制相位)`);
    lines.push('');
    lines.push(`KP 体系同时使用两套相位系统（KSK《KP Reader I》p.113）： 1. 印度特殊相位（Vedic Drishti）：基于星座，无 Orb。Mars 4/7/8, Jupiter 5/7/9, Saturn 3/7/10, Rahu/Ketu 5/7/9, 其余 7th。 2. 西方度数相位（Western Aspects）：基于度数，带 Orb。合相/对冲/三分/四分/六分。`);
    lines.push('');

    lines.push(`Vedic Special Aspects (印度特殊相位 — 无 Orb)`);
    lines.push('');
    lines.push(`| From Planet | In Sign | Aspect | To Planet | In Sign |`);
    lines.push(`|-------------|---------|--------|-----------|---------|`);
    for (const a of result.aspects.vedic) {
      lines.push(`| ${a.from} | ${a.fromSign} | ${a.aspect} | ${a.to} | ${a.toSign} |`);
    }
    lines.push('');

    lines.push(`Western Degree Aspects (西方度数相位 — 带 Orb)`);
    lines.push('');
    lines.push(`| Planet A | Planet B | Aspect | Orb |`);
    lines.push(`|----------|----------|--------|-----|`);
    for (const a of result.aspects.western) {
      lines.push(`| ${a.a} | ${a.b} | ${a.aspect} | ${a.orb} |`);
    }
    lines.push('');

    // 行星状态
    lines.push(`🔄 Planet States (行星状态 - KP语境)`);
    lines.push('');
    lines.push(`⚠️ KP占星废弃所有打分系统（Shadbala/Ashtakavarga）。行星状态中仅"逆行"有实战价值（延迟/反复），"燃烧"仅作背景参考（不影响成败）。 逆行行星（Retrograde）: ${result.planetStates.filter(p => p.state.includes('Retrograde')).map(p => p.name).join(', ')} — 【KP关键】逆行不决定成败，但决定"延迟（Delay）"与"反复（Reappearance）"。若相关CSL或指示星逆行，事件必定成但会延迟，或代表"旧事重提/破镜重圆"。`);
    const combustPlanets = result.planetStates.filter(p => p.isCombust).map(p => p.name);
    if (combustPlanets.length > 0) {
      lines.push(`燃烧行星（Combust）: ${combustPlanets.join(', ')} — 【KP关键】燃烧不否定结果，行星仍会给出其星主的结果，但案主可能"享受感降低"或过程隐秘。燃烧不影响事件是否发生。`);
    }
    lines.push('');
    lines.push(`| Planet | State | Speed (°/day) | Combust | Distance to Sun |`);
    lines.push(`|--------|-------|---------------|---------|-----------------|`);
    for (const p of result.planetStates) {
      lines.push(`| ${p.name} | ${p.state} | ${p.speed} | ${p.isCombust ? 'Yes' : 'No'} | ${p.name === 'Sun' ? '—' : p.distToSun} |`);
    }
    lines.push('');

    // 行星尊贵状态
    lines.push(`👑 Planet Dignity (尊贵状态 - 仅作背景参考)`);
    lines.push('');
    lines.push(`⚠️ KP占星中，尊贵状态不决定行星能否给出结果！落陷行星只要 Sub Lord 指向吉宫，依然必定给出结果。 绝对尊贵（庙旺/落陷/本宫）只看星座和度数；相对尊贵（友宫/敌宫）看星座主星对行星的态度（非对称矩阵）。两者独立。`);
    lines.push('');
    lines.push(`| Planet | In Sign | Absolute Dignity | Relative Dignity (Lord→Planet) |`);
    lines.push(`|--------|---------|-----------------|-------------------------------|`);
    for (const p of result.planetDignity) {
      lines.push(`| ${p.name} | ${p.sign} | ${p.absolute.mark} ${p.absolute.text} | ${p.relative.mark} ${p.relative.text} |`);
    }
    lines.push('');

    // Naisargika Maitri 矩阵
    lines.push(`🤝 Naisargika Maitri (天然敌友矩阵表)`);
    lines.push('');
    lines.push(`非对称关系。查表：横向=房东（主星），纵向=租客（行星），交叉点=房东对租客的态度。🟢友=Friend, 🔴敌=Enemy, ⚪中=Neutral`);
    lines.push('');
    const lords = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    lines.push(`| 房东\\租客 | ${lords.join(' | ')} |`);
    lines.push(`|-----------|${lords.map(() => ':---:').join('|')}|`);
    for (const lord of lords) {
      const row = lords.map(t => {
        const r = NAISARGIKA[lord]?.[t];
        if (r === '-') return '—';
        if (r === 'F') return '🟢友';
        if (r === 'E') return '🔴敌';
        if (r === 'N') return '⚪中';
        return r || '—';
      });
      lines.push(`| ${lord} | ${row.join(' | ')} |`);
    }
    lines.push('');

    // LLM 解读指令
    lines.push(`Instruction for LLM: Please analyze the above KP Prasna chart using the KP System rules.`);
    lines.push('');
    lines.push(`Base your judgment primarily on the Cuspal Sub Lords (CSL) of the relevant houses for the question.`);
    lines.push(`Evaluate their Star Lords to see the source of the result, and the Sub Lords for the final outcome.`);
    lines.push(`Strictly use the Ruling Planets to confirm the timing, filter out false significators, and verify the authenticity of the event.`);
    lines.push(`Use the Vimsottari Dasha timeline above to determine the timing (应期) of the event — the current Mahadasha/Antardasha/Pratyantardasha lords and their relationship to the relevant house CSLs indicate when the event will fructify.`);
    lines.push(`Refer to the Significators Reference table above to map planets/houses to their signified matters — identify which houses and planets are relevant to the query, then check their CSLs.`);
    lines.push(`Consider the Planetary Aspects (Drishti) when evaluating planet strength and influences — aspects modify how a planet expresses its significations.`);
    lines.push(`KP 关键规则 — 逆行（Retrograde）：逆行不决定成败，但决定"延迟（Delay）"与"反复（Reappearance）"。若相关 CSL 或指示星逆行，断事件必定成但会延迟，或代表"旧事重提/破镜重圆"。`);
    lines.push(`KP 关键规则 — 燃烧（Combustion）：燃烧不否定结果，行星仍会给出其星主的结果，但案主可能"享受感降低"或过程隐秘。燃烧不影响事件是否发生。`);
    lines.push(`KP 废弃打分：本盘不使用 Shadbala/Ashtakavarga 等打分系统。行星力量仅取决于其 Sub Lord 指向吉宫还是凶宫，而非尊贵状态得分。`);
    lines.push(`Consider the Planet Dignity as background context only — in KP, dignity does NOT override Sub Lord judgment. A debilitated planet with a good Sub Lord WILL give results.`);
    lines.push(`Note: The 1st House Cusp is identical to the Ascendant.`);
    lines.push(`Please answer in Chinese based on the query language.`);
    lines.push(`上升子主 ≡ 1宫宫头子主：${result.ascendant.subLord} ✓`);

    return lines.join('\n');
  }

  // Navamsa (D9) 计算
  // Navamsa (D9) 星座计算
  // 标准 KP/Vedic 算法：
  // - Movable signs (Aries/Cancer/Libra/Capricorn) → Navamsa 从该 sign 开始
  // - Fixed signs (Taurus/Leo/Scorpio/Aquarius) → Navamsa 从第 9 sign 开始
  // - Dual signs (Gemini/Virgo/Sagittarius/Pisces) → Navamsa 从第 5 sign 开始
  function getNavamsaSign(deg) {
    const d = norm(deg);
    const signIdx = Math.floor(d / 30);
    const inSign = d - signIdx * 30;
    const navIdx = Math.floor(inSign / (30/9));  // 0-8
    // 起始 sign 按 sign modality
    const modality = signIdx % 3;  // 0=movable, 1=fixed, 2=dual
    const startSigns = [signIdx, (signIdx + 8) % 12, (signIdx + 4) % 12];
    const startSign = startSigns[modality];
    const navSign = (startSign + navIdx) % 12;
    return RASHIS[navSign];
  }

  // 兼容旧调用
  function getNavamsa(deg) {
    return getNavamsaSign(deg);
  }

  function calcDashaBalance(moonDeg, jdNow) {
    // 简化：返回剩余比例百分比
    const d = norm(moonDeg);
    const nakSize = 360 / 27;
    const inNak = d % nakSize;
    return ((1 - inNak / nakSize) * 100).toFixed(2) + '%';
  }

  function jdNow() {
    return Date.now() / 86400000 + 2440587.5;
  }

  // ───────────────────────── Export ─────────────────────────

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  global.KpEngine = {
    computeChart,
    applyHoraryAscendant,
    buildLLMText,  // 新增：生成完整 LLM 文本（替代旧 buildDiagnosticMarkdown）
    buildDiagnosticMarkdown: buildLLMText,  // 向后兼容别名
    KSK_249_TABLE,
    PLANET_NAMES,
    PLANET_CN,
    PLANET_GLYPHS,
    PLANET_COLOR_CLASS,
    RASHIS,
    RASHIS_ABBR,
    RASHIS_CN,
    RASHI_LORDS,
    NAKSHATRAS,
    NAK_LORDS,
    WEEKDAY_LORDS,
    DASHA_YEARS,
    PLANET_SIGNIFICATIONS,
    HOUSE_SIGNIFICATIONS,
    NAISARGIKA
  };
})(typeof window !== 'undefined' ? window : globalThis);
