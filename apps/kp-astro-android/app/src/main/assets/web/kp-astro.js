(function (factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib.js', './kotlinx-html.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib.js'), require('./kotlinx-html.js'));
  else {
    if (typeof globalThis['kotlin-kotlin-stdlib'] === 'undefined') {
      throw new Error("Error loading module 'kp-astro'. Its dependency 'kotlin-kotlin-stdlib' was not found. Please, check whether 'kotlin-kotlin-stdlib' is loaded prior to 'kp-astro'.");
    }
    if (typeof globalThis['kotlinx-html'] === 'undefined') {
      throw new Error("Error loading module 'kp-astro'. Its dependency 'kotlinx-html' was not found. Please, check whether 'kotlinx-html' is loaded prior to 'kp-astro'.");
    }
    globalThis['kp-astro'] = factory(typeof globalThis['kp-astro'] === 'undefined' ? {} : globalThis['kp-astro'], globalThis['kotlin-kotlin-stdlib'], globalThis['kotlinx-html']);
  }
}(function (_, kotlin_kotlin, kotlin_org_jetbrains_kotlinx_kotlinx_html) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var VOID = kotlin_kotlin.$_$.a;
  var numberToInt = kotlin_kotlin.$_$.p2;
  var Pair = kotlin_kotlin.$_$.k3;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.q3;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.d;
  var listOf = kotlin_kotlin.$_$.k1;
  var protoOf = kotlin_kotlin.$_$.r2;
  var initMetadataForCompanion = kotlin_kotlin.$_$.g2;
  var THROW_IAE = kotlin_kotlin.$_$.m3;
  var enumEntries = kotlin_kotlin.$_$.t1;
  var Unit_getInstance = kotlin_kotlin.$_$.r;
  var Enum = kotlin_kotlin.$_$.i3;
  var initMetadataForClass = kotlin_kotlin.$_$.f2;
  var toList = kotlin_kotlin.$_$.p1;
  var listOf_0 = kotlin_kotlin.$_$.j1;
  var emptyList = kotlin_kotlin.$_$.c1;
  var getStringHashCode = kotlin_kotlin.$_$.d2;
  var getNumberHashCode = kotlin_kotlin.$_$.b2;
  var THROW_CCE = kotlin_kotlin.$_$.l3;
  var equals = kotlin_kotlin.$_$.z1;
  var Triple = kotlin_kotlin.$_$.n3;
  var coerceIn = kotlin_kotlin.$_$.w2;
  var toString = kotlin_kotlin.$_$.t2;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.j;
  var hashCode = kotlin_kotlin.$_$.e2;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.b1;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.b;
  var to = kotlin_kotlin.$_$.s3;
  var until = kotlin_kotlin.$_$.x2;
  var Collection = kotlin_kotlin.$_$.s;
  var isInterface = kotlin_kotlin.$_$.k2;
  var checkCountOverflow = kotlin_kotlin.$_$.z;
  var sortedWith = kotlin_kotlin.$_$.o1;
  var toMutableList = kotlin_kotlin.$_$.q1;
  var numberToLong = kotlin_kotlin.$_$.q2;
  var toLong = kotlin_kotlin.$_$.s2;
  var Long = kotlin_kotlin.$_$.j3;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.n;
  var padStart = kotlin_kotlin.$_$.a3;
  var FunctionAdapter = kotlin_kotlin.$_$.w1;
  var Comparator = kotlin_kotlin.$_$.h3;
  var round = kotlin_kotlin.$_$.u2;
  var compareValues = kotlin_kotlin.$_$.s1;
  var KProperty0 = kotlin_kotlin.$_$.y2;
  var getPropertyCallableRef = kotlin_kotlin.$_$.c2;
  var lazy = kotlin_kotlin.$_$.p3;
  var toString_0 = kotlin_kotlin.$_$.r3;
  var println = kotlin_kotlin.$_$.v1;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.k;
  var append = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.d;
  var attributesMapOf = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.y;
  var DIV = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.h;
  var H2 = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.j;
  var LABEL = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.n;
  var InputType_number_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.b;
  var enumEncode = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.c;
  var attributesMapOf_0 = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.x;
  var INPUT = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.m;
  var set_id = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.z;
  var SMALL = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.t;
  var HR = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.l;
  var SELECT = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.s;
  var OPTION = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.p;
  var ButtonType_button_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.a;
  var BUTTON = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.g;
  var set_onClickFunction = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.e;
  var P = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.r;
  var mapOf = kotlin_kotlin.$_$.m1;
  var H3 = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.k;
  var numberRangeToNumber = kotlin_kotlin.$_$.m2;
  var toInt = kotlin_kotlin.$_$.e3;
  var toDouble = kotlin_kotlin.$_$.d3;
  var toDoubleOrNull = kotlin_kotlin.$_$.c3;
  var ensureNotNull = kotlin_kotlin.$_$.o3;
  var mapCapacity = kotlin_kotlin.$_$.l1;
  var coerceAtLeast = kotlin_kotlin.$_$.v2;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.e;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.l;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.i;
  var checkIndexOverflow = kotlin_kotlin.$_$.a1;
  var joinToString = kotlin_kotlin.$_$.g1;
  var isNumber = kotlin_kotlin.$_$.l2;
  var numberToDouble = kotlin_kotlin.$_$.o2;
  var isArray = kotlin_kotlin.$_$.j2;
  var H1 = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.i;
  var A = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.f;
  var PRE = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.q;
  var STRONG = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.v;
  var SPAN = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.u;
  var take = kotlin_kotlin.$_$.b3;
  var first = kotlin_kotlin.$_$.z2;
  var toString_1 = kotlin_kotlin.$_$.q;
  var UL = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.w;
  var LI = kotlin_org_jetbrains_kotlinx_kotlinx_html.$_$.o;
  var charSequenceLength = kotlin_kotlin.$_$.x1;
  //endregion
  //region block: pre-declaration
  initMetadataForCompanion(Companion);
  initMetadataForClass(DashaLord, 'DashaLord', VOID, Enum);
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(Planet, 'Planet', VOID, Enum);
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(Nakshatra, 'Nakshatra', VOID, Enum);
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(ZodiacSign, 'ZodiacSign', VOID, Enum);
  initMetadataForClass(KpPosition, 'KpPosition');
  initMetadataForClass(KpChart, 'KpChart');
  initMetadataForClass(SignificatorType, 'SignificatorType', VOID, Enum);
  initMetadataForClass(KpSignificator, 'KpSignificator');
  initMetadataForClass(HousePromise, 'HousePromise', VOID, Enum);
  initMetadataForClass(CuspalSubLord, 'CuspalSubLord');
  initMetadataForClass(KpEvent, 'KpEvent', VOID, Enum);
  initMetadataForClass(Gana, 'Gana', VOID, Enum);
  initMetadataForClass(Dignity, 'Dignity', VOID, Enum);
  initMetadataForClass(DashaLevel, 'DashaLevel', VOID, Enum);
  initMetadataForClass(DashaPeriod, 'DashaPeriod');
  initMetadataForClass(AyanamsaType, 'AyanamsaType', VOID, Enum);
  initMetadataForClass(sam$kotlin_Comparator$0, 'sam$kotlin_Comparator$0', VOID, VOID, [Comparator, FunctionAdapter]);
  initMetadataForClass(sam$kotlin_Comparator$0_0, 'sam$kotlin_Comparator$0', VOID, VOID, [Comparator, FunctionAdapter]);
  initMetadataForClass(HouseSystem, 'HouseSystem', VOID, Enum);
  initMetadataForClass(ChartInput, 'ChartInput');
  initMetadataForClass(ComputedChart, 'ComputedChart');
  //endregion
  function get_NUTATION_TERMS() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return NUTATION_TERMS;
  }
  var NUTATION_TERMS;
  function get_MERCURY_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MERCURY_L0;
  }
  var MERCURY_L0;
  function get_MERCURY_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MERCURY_L1;
  }
  var MERCURY_L1;
  function get_MERCURY_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MERCURY_L2;
  }
  var MERCURY_L2;
  function get_VENUS_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return VENUS_L0;
  }
  var VENUS_L0;
  function get_VENUS_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return VENUS_L1;
  }
  var VENUS_L1;
  function get_VENUS_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return VENUS_L2;
  }
  var VENUS_L2;
  function get_MARS_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MARS_L0;
  }
  var MARS_L0;
  function get_MARS_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MARS_L1;
  }
  var MARS_L1;
  function get_MARS_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return MARS_L2;
  }
  var MARS_L2;
  function get_JUPITER_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return JUPITER_L0;
  }
  var JUPITER_L0;
  function get_JUPITER_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return JUPITER_L1;
  }
  var JUPITER_L1;
  function get_JUPITER_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return JUPITER_L2;
  }
  var JUPITER_L2;
  function get_SATURN_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return SATURN_L0;
  }
  var SATURN_L0;
  function get_SATURN_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return SATURN_L1;
  }
  var SATURN_L1;
  function get_SATURN_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return SATURN_L2;
  }
  var SATURN_L2;
  function get_URANUS_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return URANUS_L0;
  }
  var URANUS_L0;
  function get_URANUS_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return URANUS_L1;
  }
  var URANUS_L1;
  function get_URANUS_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return URANUS_L2;
  }
  var URANUS_L2;
  function get_NEPTUNE_L0() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return NEPTUNE_L0;
  }
  var NEPTUNE_L0;
  function get_NEPTUNE_L1() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return NEPTUNE_L1;
  }
  var NEPTUNE_L1;
  function get_NEPTUNE_L2() {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return NEPTUNE_L2;
  }
  var NEPTUNE_L2;
  function julianDay(year, month, day, hour) {
    hour = hour === VOID ? 12.0 : hour;
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var y = year;
    var m = month;
    if (m <= 2) {
      y = y - 1 | 0;
      m = m + 12 | 0;
    }
    // Inline function 'kotlin.math.floor' call
    var x = y / 100.0;
    var tmp$ret$0 = Math.floor(x);
    var a = numberToInt(tmp$ret$0);
    var tmp = 2 - a | 0;
    // Inline function 'kotlin.math.floor' call
    var x_0 = a / 4.0;
    var tmp$ret$1 = Math.floor(x_0);
    var b = tmp + numberToInt(tmp$ret$1) | 0;
    var dayFrac = day + hour / 24.0;
    // Inline function 'kotlin.math.floor' call
    var x_1 = 365.25 * (y + 4716 | 0);
    var tmp$ret$2 = Math.floor(x_1);
    var tmp_0 = numberToInt(tmp$ret$2);
    // Inline function 'kotlin.math.floor' call
    var x_2 = 30.6001 * (m + 1 | 0);
    var tmp$ret$3 = Math.floor(x_2);
    return (tmp_0 + numberToInt(tmp$ret$3) | 0) + dayFrac + b - 1524.5;
  }
  function t(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return (jd - 2451545.0) / 36525.0;
  }
  function norm360(deg) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return (deg % 360.0 + 360.0) % 360.0;
  }
  function toRad(_this__u8e3s4) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return _this__u8e3s4 * 3.141592653589793 / 180.0;
  }
  function toDeg(_this__u8e3s4) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return _this__u8e3s4 * 180.0 / 3.141592653589793;
  }
  function nr(deg) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return toRad(norm360(deg));
  }
  function trueObliquity(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var meanEps = 23.43929111 - 0.013004167 * tt - 1.64E-7 * tt * tt + 5.04E-7 * tt * tt * tt;
    var deltaEps = nutationObliquity(jd);
    return meanEps + deltaEps;
  }
  function meanObliquity(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    return 23.43929111 - 0.013004167 * tt - 1.64E-7 * tt * tt + 5.04E-7 * tt * tt * tt;
  }
  function fundamentalArguments(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var l = norm360(218.3165 + 481267.8813 * tt);
    var lp = norm360(280.4665 + 36000.7698 * tt);
    var f = norm360(1.6279 + 483202.0175 * tt - 0.0033 * tt * tt);
    var d = norm360(297.8502 + 445267.1115 * tt);
    var omega = norm360(125.0445 - 1934.1363 * tt);
    // Inline function 'kotlin.doubleArrayOf' call
    return new Float64Array([l, lp, f, d, omega]);
  }
  function nutation(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var args = fundamentalArguments(jd);
    var dPsi = 0.0;
    var dEps = 0.0;
    var indexedObject = get_NUTATION_TERMS();
    var inductionVariable = 0;
    var last = indexedObject.length;
    while (inductionVariable < last) {
      var term = indexedObject[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var arg = term[0] * args[0] + term[1] * args[1] + term[2] * args[2] + term[3] * args[3] + term[4] * args[4];
      var tmp = dPsi;
      var tmp_0 = term[5] * 1.0E-6;
      // Inline function 'kotlin.math.sin' call
      var x = nr(arg);
      dPsi = tmp + tmp_0 * Math.sin(x);
      var tmp_1 = dEps;
      var tmp_2 = term[6] * 1.0E-6;
      // Inline function 'kotlin.math.cos' call
      var x_0 = nr(arg);
      dEps = tmp_1 + tmp_2 * Math.cos(x_0);
    }
    return new Pair(dPsi, dEps);
  }
  function nutationLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return nutation(jd).get_first_irdx8n_k$();
  }
  function nutationObliquity(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return nutation(jd).get_second_jf7fjx_k$();
  }
  function sunLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var l0 = 280.46646 + 36000.76983 * tt + 3.032E-4 * tt * tt;
    var m = 357.52911 + 35999.05029 * tt - 1.537E-4 * tt * tt;
    var tmp = 1.914602 - 0.004817 * tt - 1.4E-5 * tt * tt;
    // Inline function 'kotlin.math.sin' call
    var x = nr(m);
    var tmp_0 = tmp * Math.sin(x);
    var tmp_1 = 0.019993 - 1.01E-4 * tt;
    // Inline function 'kotlin.math.sin' call
    var x_0 = nr(2 * m);
    var tmp_2 = tmp_0 + tmp_1 * Math.sin(x_0);
    // Inline function 'kotlin.math.sin' call
    var x_1 = nr(3 * m);
    var c = tmp_2 + 2.89E-4 * Math.sin(x_1);
    var trueLong = l0 + c;
    var omega = 125.04 - 1934.136 * tt;
    var tmp_3 = trueLong - 0.00569;
    // Inline function 'kotlin.math.sin' call
    var x_2 = nr(omega);
    var apparent = tmp_3 - 0.00478 * Math.sin(x_2);
    return norm360(apparent);
  }
  function sunDistanceAU(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var m = 357.52911 + 35999.05029 * tt - 1.537E-4 * tt * tt;
    var e = 0.016708634 - 4.2037E-5 * tt - 1.267E-7 * tt * tt;
    var tmp = 1.914602 - 0.004817 * tt;
    // Inline function 'kotlin.math.sin' call
    var x = nr(m);
    var tmp_0 = tmp * Math.sin(x);
    var tmp_1 = 0.019993 - 1.01E-4 * tt;
    // Inline function 'kotlin.math.sin' call
    var x_0 = nr(2 * m);
    var tmp_2 = tmp_0 + tmp_1 * Math.sin(x_0);
    // Inline function 'kotlin.math.sin' call
    var x_1 = nr(3 * m);
    var c = tmp_2 + 2.89E-4 * Math.sin(x_1);
    var trueAnom = m + c;
    var tmp_3 = 1.000001018 * (1.0 - e * e);
    // Inline function 'kotlin.math.cos' call
    var x_2 = nr(trueAnom);
    return tmp_3 / (1.0 + e * Math.cos(x_2));
  }
  function moonLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var lp = 218.3164477 + 481267.88123421 * tt - 0.0015786 * tt * tt + tt * tt * tt / 538841.0 - tt * tt * tt * tt / 6.5194E7;
    var d = 297.8501921 + 445267.1114034 * tt - 0.0018819 * tt * tt + tt * tt * tt / 545868.0 - tt * tt * tt * tt / 1.13065E8;
    var m = 357.5291092 + 35999.0502909 * tt - 1.536E-4 * tt * tt + tt * tt * tt / 2.449E7;
    var mp = 134.9633964 + 477198.8675055 * tt + 0.0087414 * tt * tt + tt * tt * tt / 69699.0 - tt * tt * tt * tt / 1.4712E7;
    var f = 93.272095 + 483202.0175233 * tt - 0.0036539 * tt * tt - tt * tt * tt / 3526000.0 + tt * tt * tt * tt / 8.6331E8;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp = new Float64Array([0.0, 0.0, 1.0, 0.0, 6288774.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_0 = new Float64Array([2.0, 0.0, -1.0, 0.0, 1274027.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_1 = new Float64Array([2.0, 0.0, 0.0, 0.0, 658314.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_2 = new Float64Array([0.0, 0.0, 2.0, 0.0, 213618.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_3 = new Float64Array([0.0, 1.0, 0.0, 0.0, -185116.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_4 = new Float64Array([0.0, 0.0, 0.0, 2.0, -114332.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_5 = new Float64Array([4.0, 0.0, -1.0, 0.0, 58793.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_6 = new Float64Array([0.0, 0.0, 1.0, -2.0, 57066.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_7 = new Float64Array([4.0, 0.0, -2.0, 0.0, 53322.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_8 = new Float64Array([2.0, 0.0, -2.0, 0.0, 45758.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_9 = new Float64Array([2.0, -1.0, -1.0, 0.0, -40923.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_10 = new Float64Array([2.0, 0.0, 0.0, -2.0, -34720.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_11 = new Float64Array([0.0, 1.0, -1.0, 0.0, -30383.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_12 = new Float64Array([0.0, 1.0, 1.0, 0.0, 15327.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_13 = new Float64Array([2.0, 0.0, 0.0, 2.0, -12528.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_14 = new Float64Array([0.0, 0.0, 2.0, -2.0, 10980.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_15 = new Float64Array([0.0, -1.0, 1.0, 0.0, 10675.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_16 = new Float64Array([2.0, 0.0, -1.0, -2.0, 10034.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_17 = new Float64Array([2.0, -1.0, 0.0, 0.0, 8548.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_18 = new Float64Array([2.0, 0.0, 1.0, 0.0, -7888.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_19 = new Float64Array([2.0, -1.0, -1.0, 0.0, -6766.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_20 = new Float64Array([2.0, -2.0, 0.0, 0.0, 5163.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_21 = new Float64Array([0.0, 1.0, -1.0, -2.0, 4987.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_22 = new Float64Array([2.0, -2.0, -1.0, 0.0, 4036.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_23 = new Float64Array([4.0, 0.0, -2.0, -2.0, 3994.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_24 = new Float64Array([0.0, 0.0, 2.0, 2.0, 3861.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var sigma = [tmp, tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, tmp_11, tmp_12, tmp_13, tmp_14, tmp_15, tmp_16, tmp_17, tmp_18, tmp_19, tmp_20, tmp_21, tmp_22, tmp_23, tmp_24, new Float64Array([0.0, 2.0, -1.0, 0.0, 3665.0, 0.0])];
    var sum = 0.0;
    var inductionVariable = 0;
    var last = sigma.length;
    while (inductionVariable < last) {
      var term = sigma[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var arg = term[0] * d + term[1] * m + term[2] * mp + term[3] * f + term[5];
      var tmp_25 = sum;
      var tmp_26 = term[4];
      // Inline function 'kotlin.math.sin' call
      var x = nr(arg);
      sum = tmp_25 + tmp_26 * Math.sin(x);
    }
    return norm360(lp + sum / 1000000.0);
  }
  function vsopSum(table, t) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var s = 0.0;
    var inductionVariable = 0;
    var last = table.length;
    while (inductionVariable < last) {
      var row = table[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var tmp = s;
      var tmp_0 = row[0];
      // Inline function 'kotlin.math.cos' call
      var x = nr(row[1] + row[2] * t);
      s = tmp + tmp_0 * Math.cos(x);
    }
    return s;
  }
  function vsopLongitude(tt, l0, l1, l2) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var s = vsopSum(l0, tt) + tt * vsopSum(l1, tt) + tt * tt * vsopSum(l2, tt);
    return norm360(toDeg(s));
  }
  function plutoLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var j = 34.35 + 3034.9057 * tt;
    var s = 50.08 + 1222.1138 * tt;
    var p = 238.96 + 144.96 * tt;
    var tmp = 238.958116 + 144.96 * tt;
    // Inline function 'kotlin.math.sin' call
    var x = nr(p);
    var tmp_0 = 19.799 * Math.sin(x);
    // Inline function 'kotlin.math.sin' call
    var x_0 = nr(j);
    var tmp_1 = tmp_0 + 19.401 * Math.sin(x_0);
    // Inline function 'kotlin.math.sin' call
    var x_1 = nr(2 * p);
    var tmp_2 = tmp_1 + 3.322 * Math.sin(x_1);
    // Inline function 'kotlin.math.sin' call
    var x_2 = nr(j - p);
    var tmp_3 = tmp_2 + 2.718 * Math.sin(x_2);
    // Inline function 'kotlin.math.sin' call
    var x_3 = nr(s - p);
    var tmp_4 = tmp_3 + 1.995 * Math.sin(x_3);
    // Inline function 'kotlin.math.sin' call
    var x_4 = nr(2 * j - p);
    var tmp_5 = tmp_4 + 1.849 * Math.sin(x_4);
    // Inline function 'kotlin.math.sin' call
    var x_5 = nr(p + j - s);
    var tmp_6 = tmp_5 + 1.522 * Math.sin(x_5);
    // Inline function 'kotlin.math.sin' call
    var x_6 = nr(p + j);
    var tmp_7 = tmp_6 + 1.422 * Math.sin(x_6);
    // Inline function 'kotlin.math.sin' call
    var x_7 = nr(2 * p - j);
    var l = tmp - (tmp_7 + 1.169 * Math.sin(x_7));
    return norm360(l);
  }
  function rahuLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var omega = 125.0445479 - 1934.1362891 * tt + 0.0020754 * tt * tt + tt * tt * tt / 467441.0 - tt * tt * tt * tt / 6.0616E7;
    return norm360(360.0 - omega);
  }
  function ketuLongitude(jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    return norm360(rahuLongitude(jd) + 180.0);
  }
  function planetAngularSpeed(planet, jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var h = 0.5;
    var lon1 = analyticalPlanetLongitude(planet, jd - h);
    var lon2 = analyticalPlanetLongitude(planet, jd + h);
    var diff = lon2 - lon1;
    if (diff > 180.0)
      diff = diff - 360.0;
    if (diff < -180.0)
      diff = diff + 360.0;
    return diff / (2.0 * h);
  }
  function isRetrograde(planet, jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    if (planet.equals(Planet_Rahu_getInstance()) || planet.equals(Planet_Ketu_getInstance()))
      return true;
    return planetAngularSpeed(planet, jd) < 0.0;
  }
  function analyticalPlanetLongitude(planet, jd) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var tmp;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        tmp = sunLongitude(jd);
        break;
      case 1:
        tmp = moonLongitude(jd);
        break;
      case 3:
        tmp = vsopLongitude(tt, get_MERCURY_L0(), get_MERCURY_L1(), get_MERCURY_L2());
        break;
      case 5:
        tmp = vsopLongitude(tt, get_VENUS_L0(), get_VENUS_L1(), get_VENUS_L2());
        break;
      case 2:
        tmp = vsopLongitude(tt, get_MARS_L0(), get_MARS_L1(), get_MARS_L2());
        break;
      case 4:
        tmp = vsopLongitude(tt, get_JUPITER_L0(), get_JUPITER_L1(), get_JUPITER_L2());
        break;
      case 6:
        tmp = vsopLongitude(tt, get_SATURN_L0(), get_SATURN_L1(), get_SATURN_L2());
        break;
      case 9:
        tmp = vsopLongitude(tt, get_URANUS_L0(), get_URANUS_L1(), get_URANUS_L2());
        break;
      case 10:
        tmp = vsopLongitude(tt, get_NEPTUNE_L0(), get_NEPTUNE_L1(), get_NEPTUNE_L2());
        break;
      case 11:
        tmp = plutoLongitude(jd);
        break;
      case 7:
        tmp = rahuLongitude(jd);
        break;
      case 8:
        tmp = ketuLongitude(jd);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function computeAllSidereal(jd, ayanamsaDeg) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var result = HashMap_init_$Create$();
    var _iterator__ex2g4s = get_entries_0().iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var p = _iterator__ex2g4s.next_20eer_k$();
      if (p.equals(Planet_Ketu_getInstance())) {
        var rahu = analyticalPlanetLongitude(Planet_Rahu_getInstance(), jd);
        var rahuSid = ((rahu - ayanamsaDeg) % 360.0 + 360.0) % 360.0;
        // Inline function 'kotlin.collections.set' call
        var value = (rahuSid + 180.0) % 360.0;
        result.put_4fpzoq_k$(p, value);
      } else {
        var tropical = analyticalPlanetLongitude(p, jd);
        // Inline function 'kotlin.collections.set' call
        var value_0 = ((tropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0;
        result.put_4fpzoq_k$(p, value_0);
      }
    }
    return result;
  }
  function localSiderealTime(jd, lonDeg) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var tt = t(jd);
    var theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 3.87933E-4 * tt * tt - tt * tt * tt / 3.871E7;
    return norm360(theta0 + lonDeg);
  }
  function computeAscendant(jd, latDeg, lstDegrees) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var obliquity = trueObliquity(jd);
    var ramc = toRad(lstDegrees);
    var lat = toRad(latDeg);
    var eps = toRad(obliquity);
    // Inline function 'kotlin.math.atan2' call
    // Inline function 'kotlin.math.cos' call
    var y = Math.cos(ramc);
    // Inline function 'kotlin.math.sin' call
    var tmp = Math.sin(ramc);
    // Inline function 'kotlin.math.cos' call
    var tmp_0 = tmp * Math.cos(eps);
    // Inline function 'kotlin.math.tan' call
    var tmp_1 = Math.tan(lat);
    // Inline function 'kotlin.math.sin' call
    var x = -(tmp_0 + tmp_1 * Math.sin(eps));
    var asc = Math.atan2(y, x);
    return norm360(toDeg(asc));
  }
  function computeMC(jd, lstDegrees) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var eps = toRad(trueObliquity(jd));
    var ramc = toRad(lstDegrees);
    // Inline function 'kotlin.math.atan2' call
    // Inline function 'kotlin.math.sin' call
    var y = Math.sin(ramc);
    // Inline function 'kotlin.math.cos' call
    var tmp = Math.cos(ramc);
    // Inline function 'kotlin.math.cos' call
    var x = tmp * Math.cos(eps);
    var mc = Math.atan2(y, x);
    return norm360(toDeg(mc));
  }
  function placidusCusps(jd, latDeg, ascDeg, mcDeg) {
    _init_properties_AnalyticalEphemeris_kt__9i076a();
    var eps = trueObliquity(jd);
    var epsR = toRad(eps);
    var latR = toRad(latDeg);
    var ramc = placidusCusps$eclToRa(epsR, mcDeg);
    var raAsc = placidusCusps$eclToRa(epsR, ascDeg);
    var c1 = ascDeg;
    var c4 = norm360(mcDeg + 180.0);
    var c7 = norm360(ascDeg + 180.0);
    var c10 = mcDeg;
    var c11 = placidusCusps$placidusCuspStable(epsR, raAsc, 30.0);
    var c12 = placidusCusps$placidusCuspStable(epsR, raAsc, 60.0);
    var raIC = norm360(ramc + 180.0);
    var c2 = placidusCusps$placidusCuspStable(epsR, raIC, 30.0);
    var c3 = placidusCusps$placidusCuspStable(epsR, raIC, 60.0);
    var raDesc = norm360(raAsc + 180.0);
    var c5 = placidusCusps$placidusCuspStable(epsR, raDesc, 30.0);
    var c6 = placidusCusps$placidusCuspStable(epsR, raDesc, 60.0);
    var c8 = placidusCusps$placidusCuspStable(epsR, ramc, 30.0);
    var c9 = placidusCusps$placidusCuspStable(epsR, ramc, 60.0);
    return listOf([c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12]);
  }
  function placidusCusps$eclToRa(epsR, lonDeg) {
    var l = toRad(lonDeg);
    // Inline function 'kotlin.math.atan2' call
    // Inline function 'kotlin.math.sin' call
    var tmp = Math.sin(l);
    // Inline function 'kotlin.math.cos' call
    var y = tmp * Math.cos(epsR);
    // Inline function 'kotlin.math.cos' call
    var x = Math.cos(l);
    var ra = Math.atan2(y, x);
    return norm360(toDeg(ra));
  }
  function placidusCusps$raToEcl(epsR, raDeg) {
    var r = toRad(raDeg);
    // Inline function 'kotlin.math.atan2' call
    // Inline function 'kotlin.math.sin' call
    var tmp = Math.sin(r);
    // Inline function 'kotlin.math.cos' call
    var y = tmp / Math.cos(epsR);
    // Inline function 'kotlin.math.cos' call
    var x = Math.cos(r);
    var ecl = Math.atan2(y, x);
    return norm360(toDeg(ecl));
  }
  function placidusCusps$placidusCuspStable(epsR, ramcBase, offsetDeg) {
    var raCusp = norm360(ramcBase + offsetDeg);
    return placidusCusps$raToEcl(epsR, raCusp);
  }
  var properties_initialized_AnalyticalEphemeris_kt_mwq1l8;
  function _init_properties_AnalyticalEphemeris_kt__9i076a() {
    if (!properties_initialized_AnalyticalEphemeris_kt_mwq1l8) {
      properties_initialized_AnalyticalEphemeris_kt_mwq1l8 = true;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp = new Float64Array([0.0, 0.0, 0.0, 0.0, 1.0, -17.2, 9.2]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_0 = new Float64Array([0.0, 0.0, 0.0, 0.0, -1.0, -1.32, 0.57]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_1 = new Float64Array([-2.0, 0.0, 0.0, 0.0, 1.0, -0.23, -0.1]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_2 = new Float64Array([2.0, 0.0, 0.0, 0.0, 1.0, 0.21, -0.09]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_3 = new Float64Array([-2.0, 0.0, -2.0, 2.0, -1.0, -0.15, 0.06]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_4 = new Float64Array([2.0, 0.0, 2.0, -2.0, 1.0, -0.13, 0.07]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_5 = new Float64Array([2.0, 0.0, 0.0, 0.0, -1.0, -0.11, -0.05]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      NUTATION_TERMS = [tmp, tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, new Float64Array([0.0, 0.0, 2.0, -2.0, 1.0, 0.1, -0.05])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_6 = new Float64Array([4.40250710144, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_7 = new Float64Array([0.40989414977, 1.48302034195, 26087.9031415742]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_8 = new Float64Array([0.050462942, 4.47785489551, 52175.8062831484]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_9 = new Float64Array([0.00855346844, 1.16520337555, 78263.70942472259]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_10 = new Float64Array([0.00165590362, 4.11969163181, 104351.61256629678]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MERCURY_L0 = [tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, new Float64Array([3.4561897E-4, 0.77930965923, 130439.5152379103])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_11 = new Float64Array([26087.9031415742, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_12 = new Float64Array([0.01131199811, 6.21810389463, 26087.9031415742]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MERCURY_L1 = [tmp_11, tmp_12, new Float64Array([3.0754232E-4, 4.59108936325, 78263.70942472259])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MERCURY_L2 = [new Float64Array([1.6323802E-4, 4.69053128488, 26087.9031415742])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_13 = new Float64Array([3.17614666774, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_14 = new Float64Array([0.01353968419, 5.59313319619, 10213.285546211]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_15 = new Float64Array([8.9891635E-4, 5.05047646355, 20426.571092422]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_16 = new Float64Array([5.47719E-5, 4.41630652531, 7860.4193924392]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      VENUS_L0 = [tmp_13, tmp_14, tmp_15, tmp_16, new Float64Array([3.455781E-5, 2.69963845901, 11769.8536931664])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_17 = new Float64Array([10213.28554621638, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_18 = new Float64Array([9.5617813E-4, 2.4640651111, 10213.285546211]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      VENUS_L1 = [tmp_17, tmp_18, new Float64Array([7.787201E-5, 0.62478482205, 20426.571092422])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      VENUS_L2 = [new Float64Array([3.895804E-5, 0.34874, 20426.571092422])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_19 = new Float64Array([6.20347631684, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_20 = new Float64Array([0.18656368137, 5.05037100385, 3340.6124266998]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_21 = new Float64Array([0.01108216816, 5.40099836958, 6681.2248533996]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_22 = new Float64Array([9.1798406E-4, 5.75478744667, 10021.8372800994]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_23 = new Float64Array([2.7744987E-4, 5.97049512942, 3128.3887650958]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MARS_L0 = [tmp_19, tmp_20, tmp_21, tmp_22, tmp_23, new Float64Array([1.0610235E-4, 2.93958524973, 2281.2304965106])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_24 = new Float64Array([3340.61242700512, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_25 = new Float64Array([0.01458327011, 3.60426053609, 3340.6124266998]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_26 = new Float64Array([0.00164901343, 3.92631250962, 6681.2248533996]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MARS_L1 = [tmp_24, tmp_25, tmp_26, new Float64Array([1.9963304E-4, 4.26594061031, 10021.8372800994])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_27 = new Float64Array([5.8152277E-4, 2.0496171243, 3340.6124266998]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      MARS_L2 = [tmp_27, new Float64Array([1.3459579E-4, 2.45738706163, 6681.2248533996])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_28 = new Float64Array([0.59954691495, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_29 = new Float64Array([0.09695898711, 5.06191793105, 529.6909650946]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_30 = new Float64Array([0.00573610145, 1.44406205976, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_31 = new Float64Array([0.00306389105, 5.41734729976, 1059.3819301892]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_32 = new Float64Array([9.7178282E-4, 4.14264708819, 632.7837393132]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_33 = new Float64Array([7.2903096E-4, 3.64042909256, 522.5774180938]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_34 = new Float64Array([6.4263986E-4, 3.41145185203, 103.0927742186]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_35 = new Float64Array([3.9806064E-4, 2.29376744855, 419.4846438752]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_36 = new Float64Array([3.8857767E-4, 1.2723172486, 316.3918696566]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_37 = new Float64Array([2.7964622E-4, 1.78454591802, 536.8045120954]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      JUPITER_L0 = [tmp_28, tmp_29, tmp_30, tmp_31, tmp_32, tmp_33, tmp_34, tmp_35, tmp_36, tmp_37, new Float64Array([1.3589765E-4, 5.7748103159, 1589.0728952838])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_38 = new Float64Array([529.6909650946, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_39 = new Float64Array([0.00489541518, 4.2208293947, 529.6909650946]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_40 = new Float64Array([0.00228918538, 6.02646855648, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_41 = new Float64Array([3.0099479E-4, 4.54540782858, 1059.3819301892]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_42 = new Float64Array([2.072092E-4, 5.45938936295, 632.7837393132]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      JUPITER_L1 = [tmp_38, tmp_39, tmp_40, tmp_41, tmp_42, new Float64Array([1.2103653E-4, 0.16994816058, 536.8045120954])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_43 = new Float64Array([4.7233601E-4, 4.3214822345, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_44 = new Float64Array([3.0649436E-4, 2.929777887, 529.6909650946]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      JUPITER_L2 = [tmp_43, tmp_44, new Float64Array([1.4854805E-4, 3.10351539022, 1059.3819301892])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_45 = new Float64Array([0.87401354029, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_46 = new Float64Array([0.11107659782, 3.96205090159, 213.299095438]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_47 = new Float64Array([0.01414150957, 4.58581515874, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_48 = new Float64Array([0.00398379386, 0.52112025964, 206.1855484372]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_49 = new Float64Array([0.00350769223, 3.30329907896, 426.598190876]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_50 = new Float64Array([0.00206816305, 0.24658372002, 103.0927742186]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_51 = new Float64Array([7.9271289E-4, 3.84007056878, 220.4126424388]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_52 = new Float64Array([2.3990338E-4, 4.66976924553, 110.2063212194]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_53 = new Float64Array([1.6573583E-4, 0.43719228296, 419.4846438752]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      SATURN_L0 = [tmp_45, tmp_46, tmp_47, tmp_48, tmp_49, tmp_50, tmp_51, tmp_52, tmp_53, new Float64Array([1.4906995E-4, 5.76903183869, 316.3918696566])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_54 = new Float64Array([213.299095438, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_55 = new Float64Array([0.01297370862, 1.82834923978, 213.299095438]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_56 = new Float64Array([0.00564345293, 2.88499717272, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_57 = new Float64Array([9.3734369E-4, 1.06356092411, 426.598190876]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_58 = new Float64Array([0.00107674962, 2.27769183918, 206.1855484372]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_59 = new Float64Array([4.0244479E-4, 2.04108124671, 220.4126424388]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      SATURN_L1 = [tmp_54, tmp_55, tmp_56, tmp_57, tmp_58, tmp_59, new Float64Array([3.7420306E-4, 2.26537325007, 316.3918696566])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_60 = new Float64Array([0.00116235667, 1.17971682906, 7.1135470008]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_61 = new Float64Array([9.1920844E-4, 0.07425261094, 213.299095438]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      SATURN_L2 = [tmp_60, tmp_61, new Float64Array([2.6428789E-4, 0.85772881922, 426.598190876])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_62 = new Float64Array([5.48129294297, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_63 = new Float64Array([0.09260408252, 0.8910642153, 74.7815985673]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_64 = new Float64Array([0.01504247826, 3.62719272103, 1.4844727083]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_65 = new Float64Array([0.00365981718, 1.89962189068, 73.297125859]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_66 = new Float64Array([0.00272328132, 3.35823710524, 148.0787244263]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_67 = new Float64Array([7.0328499E-4, 5.39254431947, 63.7358983034]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_68 = new Float64Array([6.8892609E-4, 4.01777180552, 76.2660712756]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_69 = new Float64Array([5.993325E-4, 5.30012286735, 3.9321532631]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      URANUS_L0 = [tmp_62, tmp_63, tmp_64, tmp_65, tmp_66, tmp_67, tmp_68, tmp_69, new Float64Array([4.4565453E-4, 4.92819652917, 224.3447957064])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_70 = new Float64Array([74.7815985673, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_71 = new Float64Array([0.00154332863, 5.24158770553, 74.7815985673]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_72 = new Float64Array([2.4456413E-4, 1.71255905209, 1.4844727083]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      URANUS_L1 = [tmp_70, tmp_71, tmp_72, new Float64Array([9.250485E-5, 0.4282973235, 11.0457002639])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      URANUS_L2 = [new Float64Array([1.2364786E-4, 5.85713505825, 74.7815985673])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_73 = new Float64Array([5.31188328471, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_74 = new Float64Array([0.01798475509, 2.9010127305, 38.1330356378]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_75 = new Float64Array([0.01019727652, 0.4858092366, 1.4844727083]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_76 = new Float64Array([0.00124531847, 4.83008090682, 36.6485629295]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_77 = new Float64Array([4.206445E-4, 5.41054991607, 2.9689454166]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_78 = new Float64Array([3.7714589E-4, 6.09221834946, 35.1640902212]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_79 = new Float64Array([3.376475E-4, 1.24488874087, 76.2660712756]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      NEPTUNE_L0 = [tmp_73, tmp_74, tmp_75, tmp_76, tmp_77, tmp_78, tmp_79, new Float64Array([1.6482741E-4, 7.729261E-5, 491.5579294568])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_80 = new Float64Array([38.1330356378, 0.0, 0.0]);
      // Inline function 'kotlin.doubleArrayOf' call
      var tmp_81 = new Float64Array([1.6604187E-4, 4.86319129565, 1.4844727083]);
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      NEPTUNE_L1 = [tmp_80, tmp_81, new Float64Array([1.5744045E-4, 2.27887627987, 38.1330356378])];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.doubleArrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      NEPTUNE_L2 = [new Float64Array([5.409292E-5, 0.33064553531, 38.1330356378])];
    }
  }
  function get_NAKSHATRA_SPAN() {
    _init_properties_KpEngine_kt__5b306f();
    return NAKSHATRA_SPAN;
  }
  var NAKSHATRA_SPAN;
  function get_SUB_SPANS() {
    _init_properties_KpEngine_kt__5b306f();
    return SUB_SPANS;
  }
  var SUB_SPANS;
  function get_kpSegmentStarts() {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.getValue' call
    var this_0 = kpSegmentStarts$delegate;
    kpSegmentStarts$factory();
    return this_0.get_value_j01efc_k$();
  }
  var kpSegmentStarts$delegate;
  var DashaLord_Ketu_instance;
  var DashaLord_Venus_instance;
  var DashaLord_Sun_instance;
  var DashaLord_Moon_instance;
  var DashaLord_Mars_instance;
  var DashaLord_Rahu_instance;
  var DashaLord_Jupiter_instance;
  var DashaLord_Saturn_instance;
  var DashaLord_Mercury_instance;
  function Companion() {
    Companion_instance = this;
    this.SEQUENCE_1 = listOf([DashaLord_Ketu_getInstance(), DashaLord_Venus_getInstance(), DashaLord_Sun_getInstance(), DashaLord_Moon_getInstance(), DashaLord_Mars_getInstance(), DashaLord_Rahu_getInstance(), DashaLord_Jupiter_getInstance(), DashaLord_Saturn_getInstance(), DashaLord_Mercury_getInstance()]);
  }
  protoOf(Companion).get_SEQUENCE_3gi5xm_k$ = function () {
    return this.SEQUENCE_1;
  };
  var Companion_instance;
  function Companion_getInstance() {
    DashaLord_initEntries();
    if (Companion_instance == null)
      new Companion();
    return Companion_instance;
  }
  function values() {
    return [DashaLord_Ketu_getInstance(), DashaLord_Venus_getInstance(), DashaLord_Sun_getInstance(), DashaLord_Moon_getInstance(), DashaLord_Mars_getInstance(), DashaLord_Rahu_getInstance(), DashaLord_Jupiter_getInstance(), DashaLord_Saturn_getInstance(), DashaLord_Mercury_getInstance()];
  }
  function valueOf(value) {
    switch (value) {
      case 'Ketu':
        return DashaLord_Ketu_getInstance();
      case 'Venus':
        return DashaLord_Venus_getInstance();
      case 'Sun':
        return DashaLord_Sun_getInstance();
      case 'Moon':
        return DashaLord_Moon_getInstance();
      case 'Mars':
        return DashaLord_Mars_getInstance();
      case 'Rahu':
        return DashaLord_Rahu_getInstance();
      case 'Jupiter':
        return DashaLord_Jupiter_getInstance();
      case 'Saturn':
        return DashaLord_Saturn_getInstance();
      case 'Mercury':
        return DashaLord_Mercury_getInstance();
      default:
        DashaLord_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries() {
    if ($ENTRIES == null)
      $ENTRIES = enumEntries(values());
    return $ENTRIES;
  }
  var DashaLord_entriesInitialized;
  function DashaLord_initEntries() {
    if (DashaLord_entriesInitialized)
      return Unit_getInstance();
    DashaLord_entriesInitialized = true;
    DashaLord_Ketu_instance = new DashaLord('Ketu', 0, '\u8BA1\u90FD', 7.0);
    DashaLord_Venus_instance = new DashaLord('Venus', 1, '\u91D1\u661F', 20.0);
    DashaLord_Sun_instance = new DashaLord('Sun', 2, '\u592A\u9633', 6.0);
    DashaLord_Moon_instance = new DashaLord('Moon', 3, '\u6708\u4EAE', 10.0);
    DashaLord_Mars_instance = new DashaLord('Mars', 4, '\u706B\u661F', 7.0);
    DashaLord_Rahu_instance = new DashaLord('Rahu', 5, '\u7F57\u777A', 18.0);
    DashaLord_Jupiter_instance = new DashaLord('Jupiter', 6, '\u6728\u661F', 16.0);
    DashaLord_Saturn_instance = new DashaLord('Saturn', 7, '\u571F\u661F', 19.0);
    DashaLord_Mercury_instance = new DashaLord('Mercury', 8, '\u6C34\u661F', 17.0);
    Companion_getInstance();
  }
  var $ENTRIES;
  function DashaLord(name, ordinal, displayName, vimshottariYears) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.vimshottariYears_1 = vimshottariYears;
  }
  protoOf(DashaLord).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(DashaLord).get_vimshottariYears_mjvshl_k$ = function () {
    return this.vimshottariYears_1;
  };
  var Planet_Sun_instance;
  var Planet_Moon_instance;
  var Planet_Mars_instance;
  var Planet_Mercury_instance;
  var Planet_Jupiter_instance;
  var Planet_Venus_instance;
  var Planet_Saturn_instance;
  var Planet_Rahu_instance;
  var Planet_Ketu_instance;
  var Planet_Uranus_instance;
  var Planet_Neptune_instance;
  var Planet_Pluto_instance;
  function Companion_0() {
    Companion_instance_0 = this;
    this.VEDIC_NINE_1 = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance(), Planet_Mercury_getInstance(), Planet_Jupiter_getInstance(), Planet_Venus_getInstance(), Planet_Saturn_getInstance(), Planet_Rahu_getInstance(), Planet_Ketu_getInstance()]);
    this.SEVEN_VISIBLE_1 = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance(), Planet_Mercury_getInstance(), Planet_Jupiter_getInstance(), Planet_Venus_getInstance(), Planet_Saturn_getInstance()]);
  }
  protoOf(Companion_0).get_VEDIC_NINE_7vwslx_k$ = function () {
    return this.VEDIC_NINE_1;
  };
  protoOf(Companion_0).get_SEVEN_VISIBLE_hnlz9z_k$ = function () {
    return this.SEVEN_VISIBLE_1;
  };
  var Companion_instance_0;
  function Companion_getInstance_0() {
    Planet_initEntries();
    if (Companion_instance_0 == null)
      new Companion_0();
    return Companion_instance_0;
  }
  function values_0() {
    return [Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance(), Planet_Mercury_getInstance(), Planet_Jupiter_getInstance(), Planet_Venus_getInstance(), Planet_Saturn_getInstance(), Planet_Rahu_getInstance(), Planet_Ketu_getInstance(), Planet_Uranus_getInstance(), Planet_Neptune_getInstance(), Planet_Pluto_getInstance()];
  }
  function valueOf_0(value) {
    switch (value) {
      case 'Sun':
        return Planet_Sun_getInstance();
      case 'Moon':
        return Planet_Moon_getInstance();
      case 'Mars':
        return Planet_Mars_getInstance();
      case 'Mercury':
        return Planet_Mercury_getInstance();
      case 'Jupiter':
        return Planet_Jupiter_getInstance();
      case 'Venus':
        return Planet_Venus_getInstance();
      case 'Saturn':
        return Planet_Saturn_getInstance();
      case 'Rahu':
        return Planet_Rahu_getInstance();
      case 'Ketu':
        return Planet_Ketu_getInstance();
      case 'Uranus':
        return Planet_Uranus_getInstance();
      case 'Neptune':
        return Planet_Neptune_getInstance();
      case 'Pluto':
        return Planet_Pluto_getInstance();
      default:
        Planet_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_0() {
    if ($ENTRIES_0 == null)
      $ENTRIES_0 = enumEntries(values_0());
    return $ENTRIES_0;
  }
  var Planet_entriesInitialized;
  function Planet_initEntries() {
    if (Planet_entriesInitialized)
      return Unit_getInstance();
    Planet_entriesInitialized = true;
    Planet_Sun_instance = new Planet('Sun', 0, '\u592A\u9633', '\u65E5');
    Planet_Moon_instance = new Planet('Moon', 1, '\u6708\u4EAE', '\u6708');
    Planet_Mars_instance = new Planet('Mars', 2, '\u706B\u661F', '\u706B');
    Planet_Mercury_instance = new Planet('Mercury', 3, '\u6C34\u661F', '\u6C34');
    Planet_Jupiter_instance = new Planet('Jupiter', 4, '\u6728\u661F', '\u6728');
    Planet_Venus_instance = new Planet('Venus', 5, '\u91D1\u661F', '\u91D1');
    Planet_Saturn_instance = new Planet('Saturn', 6, '\u571F\u661F', '\u571F');
    Planet_Rahu_instance = new Planet('Rahu', 7, '\u7F57\u777A', '\u7F57');
    Planet_Ketu_instance = new Planet('Ketu', 8, '\u8BA1\u90FD', '\u8BA1');
    Planet_Uranus_instance = new Planet('Uranus', 9, '\u5929\u738B\u661F', '\u5929');
    Planet_Neptune_instance = new Planet('Neptune', 10, '\u6D77\u738B\u661F', '\u6D77');
    Planet_Pluto_instance = new Planet('Pluto', 11, '\u51A5\u738B\u661F', '\u51A5');
    Companion_getInstance_0();
  }
  var $ENTRIES_0;
  function Planet(name, ordinal, displayName, symbol) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.symbol_1 = symbol;
  }
  protoOf(Planet).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(Planet).get_symbol_jqdfoh_k$ = function () {
    return this.symbol_1;
  };
  function planetToDashaLord(p) {
    _init_properties_KpEngine_kt__5b306f();
    var tmp;
    switch (p.get_ordinal_ip24qg_k$()) {
      case 0:
        tmp = DashaLord_Sun_getInstance();
        break;
      case 1:
        tmp = DashaLord_Moon_getInstance();
        break;
      case 2:
        tmp = DashaLord_Mars_getInstance();
        break;
      case 3:
        tmp = DashaLord_Mercury_getInstance();
        break;
      case 4:
        tmp = DashaLord_Jupiter_getInstance();
        break;
      case 5:
        tmp = DashaLord_Venus_getInstance();
        break;
      case 6:
        tmp = DashaLord_Saturn_getInstance();
        break;
      case 7:
        tmp = DashaLord_Rahu_getInstance();
        break;
      case 8:
        tmp = DashaLord_Ketu_getInstance();
        break;
      case 9:
      case 10:
      case 11:
        tmp = null;
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function planetFromDashaLord(dl) {
    _init_properties_KpEngine_kt__5b306f();
    var tmp;
    switch (dl.get_ordinal_ip24qg_k$()) {
      case 2:
        tmp = Planet_Sun_getInstance();
        break;
      case 3:
        tmp = Planet_Moon_getInstance();
        break;
      case 4:
        tmp = Planet_Mars_getInstance();
        break;
      case 8:
        tmp = Planet_Mercury_getInstance();
        break;
      case 6:
        tmp = Planet_Jupiter_getInstance();
        break;
      case 1:
        tmp = Planet_Venus_getInstance();
        break;
      case 7:
        tmp = Planet_Saturn_getInstance();
        break;
      case 5:
        tmp = Planet_Rahu_getInstance();
        break;
      case 0:
        tmp = Planet_Ketu_getInstance();
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  var Nakshatra_Ashwini_instance;
  var Nakshatra_Bharani_instance;
  var Nakshatra_Krittika_instance;
  var Nakshatra_Rohini_instance;
  var Nakshatra_Mrigashira_instance;
  var Nakshatra_Ardra_instance;
  var Nakshatra_Punarvasu_instance;
  var Nakshatra_Pushya_instance;
  var Nakshatra_Ashlesha_instance;
  var Nakshatra_Magha_instance;
  var Nakshatra_PurvaPhalguni_instance;
  var Nakshatra_UttaraPhalguni_instance;
  var Nakshatra_Hasta_instance;
  var Nakshatra_Chitra_instance;
  var Nakshatra_Swati_instance;
  var Nakshatra_Vishakha_instance;
  var Nakshatra_Anuradha_instance;
  var Nakshatra_Jyeshtha_instance;
  var Nakshatra_Mula_instance;
  var Nakshatra_PurvaAshadha_instance;
  var Nakshatra_UttaraAshadha_instance;
  var Nakshatra_Shravana_instance;
  var Nakshatra_Dhanishta_instance;
  var Nakshatra_Shatabhisha_instance;
  var Nakshatra_PurvaBhadrapada_instance;
  var Nakshatra_UttaraBhadrapada_instance;
  var Nakshatra_Revati_instance;
  function Companion_1() {
    Companion_instance_1 = this;
    this.ALL_1 = toList(get_entries_1());
    this.SPAN_1 = 360.0 / 27.0;
  }
  protoOf(Companion_1).get_ALL_18jy08_k$ = function () {
    return this.ALL_1;
  };
  protoOf(Companion_1).get_SPAN_wo9cb7_k$ = function () {
    return this.SPAN_1;
  };
  protoOf(Companion_1).fromLongitudeDeg_qpnd6t_k$ = function (deg) {
    var lon = (deg % 360.0 + 360.0) % 360.0;
    // Inline function 'kotlin.math.floor' call
    var x = lon / this.SPAN_1;
    var tmp$ret$0 = Math.floor(x);
    var idx = numberToInt(tmp$ret$0) % 27 | 0;
    return this.ALL_1.get_c1px32_k$(idx);
  };
  var Companion_instance_1;
  function Companion_getInstance_1() {
    Nakshatra_initEntries();
    if (Companion_instance_1 == null)
      new Companion_1();
    return Companion_instance_1;
  }
  function values_1() {
    return [Nakshatra_Ashwini_getInstance(), Nakshatra_Bharani_getInstance(), Nakshatra_Krittika_getInstance(), Nakshatra_Rohini_getInstance(), Nakshatra_Mrigashira_getInstance(), Nakshatra_Ardra_getInstance(), Nakshatra_Punarvasu_getInstance(), Nakshatra_Pushya_getInstance(), Nakshatra_Ashlesha_getInstance(), Nakshatra_Magha_getInstance(), Nakshatra_PurvaPhalguni_getInstance(), Nakshatra_UttaraPhalguni_getInstance(), Nakshatra_Hasta_getInstance(), Nakshatra_Chitra_getInstance(), Nakshatra_Swati_getInstance(), Nakshatra_Vishakha_getInstance(), Nakshatra_Anuradha_getInstance(), Nakshatra_Jyeshtha_getInstance(), Nakshatra_Mula_getInstance(), Nakshatra_PurvaAshadha_getInstance(), Nakshatra_UttaraAshadha_getInstance(), Nakshatra_Shravana_getInstance(), Nakshatra_Dhanishta_getInstance(), Nakshatra_Shatabhisha_getInstance(), Nakshatra_PurvaBhadrapada_getInstance(), Nakshatra_UttaraBhadrapada_getInstance(), Nakshatra_Revati_getInstance()];
  }
  function valueOf_1(value) {
    switch (value) {
      case 'Ashwini':
        return Nakshatra_Ashwini_getInstance();
      case 'Bharani':
        return Nakshatra_Bharani_getInstance();
      case 'Krittika':
        return Nakshatra_Krittika_getInstance();
      case 'Rohini':
        return Nakshatra_Rohini_getInstance();
      case 'Mrigashira':
        return Nakshatra_Mrigashira_getInstance();
      case 'Ardra':
        return Nakshatra_Ardra_getInstance();
      case 'Punarvasu':
        return Nakshatra_Punarvasu_getInstance();
      case 'Pushya':
        return Nakshatra_Pushya_getInstance();
      case 'Ashlesha':
        return Nakshatra_Ashlesha_getInstance();
      case 'Magha':
        return Nakshatra_Magha_getInstance();
      case 'PurvaPhalguni':
        return Nakshatra_PurvaPhalguni_getInstance();
      case 'UttaraPhalguni':
        return Nakshatra_UttaraPhalguni_getInstance();
      case 'Hasta':
        return Nakshatra_Hasta_getInstance();
      case 'Chitra':
        return Nakshatra_Chitra_getInstance();
      case 'Swati':
        return Nakshatra_Swati_getInstance();
      case 'Vishakha':
        return Nakshatra_Vishakha_getInstance();
      case 'Anuradha':
        return Nakshatra_Anuradha_getInstance();
      case 'Jyeshtha':
        return Nakshatra_Jyeshtha_getInstance();
      case 'Mula':
        return Nakshatra_Mula_getInstance();
      case 'PurvaAshadha':
        return Nakshatra_PurvaAshadha_getInstance();
      case 'UttaraAshadha':
        return Nakshatra_UttaraAshadha_getInstance();
      case 'Shravana':
        return Nakshatra_Shravana_getInstance();
      case 'Dhanishta':
        return Nakshatra_Dhanishta_getInstance();
      case 'Shatabhisha':
        return Nakshatra_Shatabhisha_getInstance();
      case 'PurvaBhadrapada':
        return Nakshatra_PurvaBhadrapada_getInstance();
      case 'UttaraBhadrapada':
        return Nakshatra_UttaraBhadrapada_getInstance();
      case 'Revati':
        return Nakshatra_Revati_getInstance();
      default:
        Nakshatra_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_1() {
    if ($ENTRIES_1 == null)
      $ENTRIES_1 = enumEntries(values_1());
    return $ENTRIES_1;
  }
  var Nakshatra_entriesInitialized;
  function Nakshatra_initEntries() {
    if (Nakshatra_entriesInitialized)
      return Unit_getInstance();
    Nakshatra_entriesInitialized = true;
    Nakshatra_Ashwini_instance = new Nakshatra('Ashwini', 0, '\u5A04\u5BBF\uFF08Ashwini\uFF09', DashaLord_Ketu_getInstance());
    Nakshatra_Bharani_instance = new Nakshatra('Bharani', 1, '\u80C3\u5BBF\uFF08Bharani\uFF09', DashaLord_Venus_getInstance());
    Nakshatra_Krittika_instance = new Nakshatra('Krittika', 2, '\u6634\u5BBF\uFF08Krittika\uFF09', DashaLord_Sun_getInstance());
    Nakshatra_Rohini_instance = new Nakshatra('Rohini', 3, '\u6BD5\u5BBF\uFF08Rohini\uFF09', DashaLord_Moon_getInstance());
    Nakshatra_Mrigashira_instance = new Nakshatra('Mrigashira', 4, '\u89DC\u5BBF\uFF08Mrigashira\uFF09', DashaLord_Mars_getInstance());
    Nakshatra_Ardra_instance = new Nakshatra('Ardra', 5, '\u53C2\u5BBF\uFF08Ardra\uFF09', DashaLord_Rahu_getInstance());
    Nakshatra_Punarvasu_instance = new Nakshatra('Punarvasu', 6, '\u4E95\u5BBF\uFF08Punarvasu\uFF09', DashaLord_Jupiter_getInstance());
    Nakshatra_Pushya_instance = new Nakshatra('Pushya', 7, '\u9B3C\u5BBF\uFF08Pushya\uFF09', DashaLord_Saturn_getInstance());
    Nakshatra_Ashlesha_instance = new Nakshatra('Ashlesha', 8, '\u67F3\u5BBF\uFF08Ashlesha\uFF09', DashaLord_Mercury_getInstance());
    Nakshatra_Magha_instance = new Nakshatra('Magha', 9, '\u661F\u5BBF\uFF08Magha\uFF09', DashaLord_Ketu_getInstance());
    Nakshatra_PurvaPhalguni_instance = new Nakshatra('PurvaPhalguni', 10, '\u5F20\u5BBF\uFF08Purva Phalguni\uFF09', DashaLord_Venus_getInstance());
    Nakshatra_UttaraPhalguni_instance = new Nakshatra('UttaraPhalguni', 11, '\u7FFC\u5BBF\uFF08Uttara Phalguni\uFF09', DashaLord_Sun_getInstance());
    Nakshatra_Hasta_instance = new Nakshatra('Hasta', 12, '\u8F78\u5BBF\uFF08Hasta\uFF09', DashaLord_Moon_getInstance());
    Nakshatra_Chitra_instance = new Nakshatra('Chitra', 13, '\u89D2\u5BBF\uFF08Chitra\uFF09', DashaLord_Mars_getInstance());
    Nakshatra_Swati_instance = new Nakshatra('Swati', 14, '\u4EA2\u5BBF\uFF08Swati\uFF09', DashaLord_Rahu_getInstance());
    Nakshatra_Vishakha_instance = new Nakshatra('Vishakha', 15, '\u6C10\u5BBF\uFF08Vishakha\uFF09', DashaLord_Jupiter_getInstance());
    Nakshatra_Anuradha_instance = new Nakshatra('Anuradha', 16, '\u623F\u5BBF\uFF08Anuradha\uFF09', DashaLord_Saturn_getInstance());
    Nakshatra_Jyeshtha_instance = new Nakshatra('Jyeshtha', 17, '\u5FC3\u5BBF\uFF08Jyeshtha\uFF09', DashaLord_Mercury_getInstance());
    Nakshatra_Mula_instance = new Nakshatra('Mula', 18, '\u5C3E\u5BBF\uFF08Mula\uFF09', DashaLord_Ketu_getInstance());
    Nakshatra_PurvaAshadha_instance = new Nakshatra('PurvaAshadha', 19, '\u7B95\u5BBF\uFF08Purva Ashadha\uFF09', DashaLord_Venus_getInstance());
    Nakshatra_UttaraAshadha_instance = new Nakshatra('UttaraAshadha', 20, '\u6597\u5BBF\uFF08Uttara Ashadha\uFF09', DashaLord_Sun_getInstance());
    Nakshatra_Shravana_instance = new Nakshatra('Shravana', 21, '\u725B\u5BBF\uFF08Shravana\uFF09', DashaLord_Moon_getInstance());
    Nakshatra_Dhanishta_instance = new Nakshatra('Dhanishta', 22, '\u5973\u5BBF\uFF08Dhanishta\uFF09', DashaLord_Mars_getInstance());
    Nakshatra_Shatabhisha_instance = new Nakshatra('Shatabhisha', 23, '\u865A\u5BBF\uFF08Shatabhisha\uFF09', DashaLord_Rahu_getInstance());
    Nakshatra_PurvaBhadrapada_instance = new Nakshatra('PurvaBhadrapada', 24, '\u5371\u5BBF\uFF08Purva Bhadrapada\uFF09', DashaLord_Jupiter_getInstance());
    Nakshatra_UttaraBhadrapada_instance = new Nakshatra('UttaraBhadrapada', 25, '\u5BA4\u5BBF\uFF08Uttara Bhadrapada\uFF09', DashaLord_Saturn_getInstance());
    Nakshatra_Revati_instance = new Nakshatra('Revati', 26, '\u58C1\u5BBF\uFF08Revati\uFF09', DashaLord_Mercury_getInstance());
    Companion_getInstance_1();
  }
  var $ENTRIES_1;
  function Nakshatra(name, ordinal, displayName, lord) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.lord_1 = lord;
  }
  protoOf(Nakshatra).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(Nakshatra).get_lord_wopz5q_k$ = function () {
    return this.lord_1;
  };
  var ZodiacSign_Aries_instance;
  var ZodiacSign_Taurus_instance;
  var ZodiacSign_Gemini_instance;
  var ZodiacSign_Cancer_instance;
  var ZodiacSign_Leo_instance;
  var ZodiacSign_Virgo_instance;
  var ZodiacSign_Libra_instance;
  var ZodiacSign_Scorpio_instance;
  var ZodiacSign_Sagittarius_instance;
  var ZodiacSign_Capricorn_instance;
  var ZodiacSign_Aquarius_instance;
  var ZodiacSign_Pisces_instance;
  function Companion_2() {
    Companion_instance_2 = this;
    this.ALL_1 = toList(get_entries_2());
  }
  protoOf(Companion_2).get_ALL_18jy08_k$ = function () {
    return this.ALL_1;
  };
  protoOf(Companion_2).fromLongitudeDeg_qpnd6t_k$ = function (deg) {
    var lon = (deg % 360.0 + 360.0) % 360.0;
    // Inline function 'kotlin.math.floor' call
    var x = lon / 30.0;
    var tmp$ret$0 = Math.floor(x);
    return this.ALL_1.get_c1px32_k$(numberToInt(tmp$ret$0) % 12 | 0);
  };
  protoOf(Companion_2).fromIndex_u33i0g_k$ = function (idx) {
    return this.ALL_1.get_c1px32_k$(((idx % 12 | 0) + 12 | 0) % 12 | 0);
  };
  var Companion_instance_2;
  function Companion_getInstance_2() {
    ZodiacSign_initEntries();
    if (Companion_instance_2 == null)
      new Companion_2();
    return Companion_instance_2;
  }
  function values_2() {
    return [ZodiacSign_Aries_getInstance(), ZodiacSign_Taurus_getInstance(), ZodiacSign_Gemini_getInstance(), ZodiacSign_Cancer_getInstance(), ZodiacSign_Leo_getInstance(), ZodiacSign_Virgo_getInstance(), ZodiacSign_Libra_getInstance(), ZodiacSign_Scorpio_getInstance(), ZodiacSign_Sagittarius_getInstance(), ZodiacSign_Capricorn_getInstance(), ZodiacSign_Aquarius_getInstance(), ZodiacSign_Pisces_getInstance()];
  }
  function valueOf_2(value) {
    switch (value) {
      case 'Aries':
        return ZodiacSign_Aries_getInstance();
      case 'Taurus':
        return ZodiacSign_Taurus_getInstance();
      case 'Gemini':
        return ZodiacSign_Gemini_getInstance();
      case 'Cancer':
        return ZodiacSign_Cancer_getInstance();
      case 'Leo':
        return ZodiacSign_Leo_getInstance();
      case 'Virgo':
        return ZodiacSign_Virgo_getInstance();
      case 'Libra':
        return ZodiacSign_Libra_getInstance();
      case 'Scorpio':
        return ZodiacSign_Scorpio_getInstance();
      case 'Sagittarius':
        return ZodiacSign_Sagittarius_getInstance();
      case 'Capricorn':
        return ZodiacSign_Capricorn_getInstance();
      case 'Aquarius':
        return ZodiacSign_Aquarius_getInstance();
      case 'Pisces':
        return ZodiacSign_Pisces_getInstance();
      default:
        ZodiacSign_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_2() {
    if ($ENTRIES_2 == null)
      $ENTRIES_2 = enumEntries(values_2());
    return $ENTRIES_2;
  }
  var ZodiacSign_entriesInitialized;
  function ZodiacSign_initEntries() {
    if (ZodiacSign_entriesInitialized)
      return Unit_getInstance();
    ZodiacSign_entriesInitialized = true;
    ZodiacSign_Aries_instance = new ZodiacSign('Aries', 0, '\u767D\u7F8A\u5EA7', '\u7F8A', Planet_Mars_getInstance());
    ZodiacSign_Taurus_instance = new ZodiacSign('Taurus', 1, '\u91D1\u725B\u5EA7', '\u725B', Planet_Venus_getInstance());
    ZodiacSign_Gemini_instance = new ZodiacSign('Gemini', 2, '\u53CC\u5B50\u5EA7', '\u5B50', Planet_Mercury_getInstance());
    ZodiacSign_Cancer_instance = new ZodiacSign('Cancer', 3, '\u5DE8\u87F9\u5EA7', '\u87F9', Planet_Moon_getInstance());
    ZodiacSign_Leo_instance = new ZodiacSign('Leo', 4, '\u72EE\u5B50\u5EA7', '\u72EE', Planet_Sun_getInstance());
    ZodiacSign_Virgo_instance = new ZodiacSign('Virgo', 5, '\u5904\u5973\u5EA7', '\u5973', Planet_Mercury_getInstance());
    ZodiacSign_Libra_instance = new ZodiacSign('Libra', 6, '\u5929\u79E4\u5EA7', '\u79E4', Planet_Venus_getInstance());
    ZodiacSign_Scorpio_instance = new ZodiacSign('Scorpio', 7, '\u5929\u874E\u5EA7', '\u874E', Planet_Mars_getInstance());
    ZodiacSign_Sagittarius_instance = new ZodiacSign('Sagittarius', 8, '\u5C04\u624B\u5EA7', '\u5C04', Planet_Jupiter_getInstance());
    ZodiacSign_Capricorn_instance = new ZodiacSign('Capricorn', 9, '\u6469\u7FAF\u5EA7', '\u7FAF', Planet_Saturn_getInstance());
    ZodiacSign_Aquarius_instance = new ZodiacSign('Aquarius', 10, '\u6C34\u74F6\u5EA7', '\u74F6', Planet_Saturn_getInstance());
    ZodiacSign_Pisces_instance = new ZodiacSign('Pisces', 11, '\u53CC\u9C7C\u5EA7', '\u9C7C', Planet_Jupiter_getInstance());
    Companion_getInstance_2();
  }
  var $ENTRIES_2;
  function ZodiacSign(name, ordinal, displayName, symbol, owner) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.symbol_1 = symbol;
    this.owner_1 = owner;
  }
  protoOf(ZodiacSign).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(ZodiacSign).get_symbol_jqdfoh_k$ = function () {
    return this.symbol_1;
  };
  protoOf(ZodiacSign).get_owner_iwkx3e_k$ = function () {
    return this.owner_1;
  };
  function kpOwnedSigns(p) {
    _init_properties_KpEngine_kt__5b306f();
    switch (p.get_ordinal_ip24qg_k$()) {
      case 0:
        return listOf_0(4);
      case 1:
        return listOf_0(3);
      case 2:
        return listOf([0, 7]);
      case 3:
        return listOf([2, 5]);
      case 4:
        return listOf([8, 11]);
      case 5:
        return listOf([1, 6]);
      case 6:
        return listOf([9, 10]);
      case 7:
        return listOf_0(10);
      case 8:
        return listOf_0(7);
      default:
        return emptyList();
    }
  }
  function kpAspectOffsets(p) {
    _init_properties_KpEngine_kt__5b306f();
    switch (p.get_ordinal_ip24qg_k$()) {
      case 2:
        return listOf([3, 6, 7]);
      case 4:
        return listOf([4, 6, 8]);
      case 6:
        return listOf([2, 6, 9]);
      case 7:
      case 8:
        return listOf([4, 6, 8]);
      default:
        return listOf_0(6);
    }
  }
  function KpPosition(signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg) {
    this.signLord_1 = signLord;
    this.starLord_1 = starLord;
    this.subLord_1 = subLord;
    this.subSubLord_1 = subSubLord;
    this.kpNumber_1 = kpNumber;
    this.sign_1 = sign;
    this.nakshatra_1 = nakshatra;
    this.signDeg_1 = signDeg;
    this.nakshatraDeg_1 = nakshatraDeg;
    this.subDeg_1 = subDeg;
  }
  protoOf(KpPosition).get_signLord_qnpvj9_k$ = function () {
    return this.signLord_1;
  };
  protoOf(KpPosition).get_starLord_a1nf0w_k$ = function () {
    return this.starLord_1;
  };
  protoOf(KpPosition).get_subLord_tn29as_k$ = function () {
    return this.subLord_1;
  };
  protoOf(KpPosition).get_subSubLord_4jveyq_k$ = function () {
    return this.subSubLord_1;
  };
  protoOf(KpPosition).get_kpNumber_o5erl5_k$ = function () {
    return this.kpNumber_1;
  };
  protoOf(KpPosition).get_sign_woubd2_k$ = function () {
    return this.sign_1;
  };
  protoOf(KpPosition).get_nakshatra_6blf52_k$ = function () {
    return this.nakshatra_1;
  };
  protoOf(KpPosition).get_signDeg_z89xpc_k$ = function () {
    return this.signDeg_1;
  };
  protoOf(KpPosition).get_nakshatraDeg_wrjwzk_k$ = function () {
    return this.nakshatraDeg_1;
  };
  protoOf(KpPosition).get_subDeg_jnylyn_k$ = function () {
    return this.subDeg_1;
  };
  protoOf(KpPosition).component1_7eebsc_k$ = function () {
    return this.signLord_1;
  };
  protoOf(KpPosition).component2_7eebsb_k$ = function () {
    return this.starLord_1;
  };
  protoOf(KpPosition).component3_7eebsa_k$ = function () {
    return this.subLord_1;
  };
  protoOf(KpPosition).component4_7eebs9_k$ = function () {
    return this.subSubLord_1;
  };
  protoOf(KpPosition).component5_7eebs8_k$ = function () {
    return this.kpNumber_1;
  };
  protoOf(KpPosition).component6_7eebs7_k$ = function () {
    return this.sign_1;
  };
  protoOf(KpPosition).component7_7eebs6_k$ = function () {
    return this.nakshatra_1;
  };
  protoOf(KpPosition).component8_7eebs5_k$ = function () {
    return this.signDeg_1;
  };
  protoOf(KpPosition).component9_7eebs4_k$ = function () {
    return this.nakshatraDeg_1;
  };
  protoOf(KpPosition).component10_gazzfo_k$ = function () {
    return this.subDeg_1;
  };
  protoOf(KpPosition).copy_phr9xt_k$ = function (signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg) {
    return new KpPosition(signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg);
  };
  protoOf(KpPosition).copy$default_g292br_k$ = function (signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg, $super) {
    signLord = signLord === VOID ? this.signLord_1 : signLord;
    starLord = starLord === VOID ? this.starLord_1 : starLord;
    subLord = subLord === VOID ? this.subLord_1 : subLord;
    subSubLord = subSubLord === VOID ? this.subSubLord_1 : subSubLord;
    kpNumber = kpNumber === VOID ? this.kpNumber_1 : kpNumber;
    sign = sign === VOID ? this.sign_1 : sign;
    nakshatra = nakshatra === VOID ? this.nakshatra_1 : nakshatra;
    signDeg = signDeg === VOID ? this.signDeg_1 : signDeg;
    nakshatraDeg = nakshatraDeg === VOID ? this.nakshatraDeg_1 : nakshatraDeg;
    subDeg = subDeg === VOID ? this.subDeg_1 : subDeg;
    return $super === VOID ? this.copy_phr9xt_k$(signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg) : $super.copy_phr9xt_k$.call(this, signLord, starLord, subLord, subSubLord, kpNumber, sign, nakshatra, signDeg, nakshatraDeg, subDeg);
  };
  protoOf(KpPosition).toString = function () {
    return 'KpPosition(signLord=' + this.signLord_1 + ', starLord=' + this.starLord_1.toString() + ', subLord=' + this.subLord_1.toString() + ', subSubLord=' + this.subSubLord_1.toString() + ', kpNumber=' + this.kpNumber_1 + ', sign=' + this.sign_1.toString() + ', nakshatra=' + this.nakshatra_1.toString() + ', signDeg=' + this.signDeg_1 + ', nakshatraDeg=' + this.nakshatraDeg_1 + ', subDeg=' + this.subDeg_1 + ')';
  };
  protoOf(KpPosition).hashCode = function () {
    var result = getStringHashCode(this.signLord_1);
    result = imul(result, 31) + this.starLord_1.hashCode() | 0;
    result = imul(result, 31) + this.subLord_1.hashCode() | 0;
    result = imul(result, 31) + this.subSubLord_1.hashCode() | 0;
    result = imul(result, 31) + this.kpNumber_1 | 0;
    result = imul(result, 31) + this.sign_1.hashCode() | 0;
    result = imul(result, 31) + this.nakshatra_1.hashCode() | 0;
    result = imul(result, 31) + getNumberHashCode(this.signDeg_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.nakshatraDeg_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.subDeg_1) | 0;
    return result;
  };
  protoOf(KpPosition).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KpPosition))
      return false;
    var tmp0_other_with_cast = other instanceof KpPosition ? other : THROW_CCE();
    if (!(this.signLord_1 === tmp0_other_with_cast.signLord_1))
      return false;
    if (!this.starLord_1.equals(tmp0_other_with_cast.starLord_1))
      return false;
    if (!this.subLord_1.equals(tmp0_other_with_cast.subLord_1))
      return false;
    if (!this.subSubLord_1.equals(tmp0_other_with_cast.subSubLord_1))
      return false;
    if (!(this.kpNumber_1 === tmp0_other_with_cast.kpNumber_1))
      return false;
    if (!this.sign_1.equals(tmp0_other_with_cast.sign_1))
      return false;
    if (!this.nakshatra_1.equals(tmp0_other_with_cast.nakshatra_1))
      return false;
    if (!equals(this.signDeg_1, tmp0_other_with_cast.signDeg_1))
      return false;
    if (!equals(this.nakshatraDeg_1, tmp0_other_with_cast.nakshatraDeg_1))
      return false;
    if (!equals(this.subDeg_1, tmp0_other_with_cast.subDeg_1))
      return false;
    return true;
  };
  function findSub(posInParent, startingLord, parentSpan) {
    _init_properties_KpEngine_kt__5b306f();
    var startIdx = Companion_getInstance().SEQUENCE_1.indexOf_si1fv9_k$(startingLord);
    var normalized = (posInParent % parentSpan + parentSpan) % parentSpan;
    var accumulated = 0.0;
    var inductionVariable = 0;
    if (inductionVariable < 9)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var idx = (startIdx + i | 0) % 9 | 0;
        var lord = Companion_getInstance().SEQUENCE_1.get_c1px32_k$(idx);
        var span = lord.vimshottariYears_1 / 120.0 * parentSpan;
        if (accumulated + span > normalized) {
          return new Triple(lord, normalized - accumulated, span);
        }
        accumulated = accumulated + span;
      }
       while (inductionVariable < 9);
    var lord_0 = Companion_getInstance().SEQUENCE_1.get_c1px32_k$(startIdx);
    var span_0 = lord_0.vimshottariYears_1 / 120.0 * parentSpan;
    return new Triple(lord_0, 0.0, span_0);
  }
  function computeKpNumber(lon) {
    _init_properties_KpEngine_kt__5b306f();
    var l = (lon % 360.0 + 360.0) % 360.0;
    var starts = get_kpSegmentStarts();
    var n = 0;
    var _iterator__ex2g4s = starts.iterator_jk1svi_k$();
    $l$loop: while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var s = _iterator__ex2g4s.next_20eer_k$();
      if (s <= l) {
        n = n + 1 | 0;
      } else
        break $l$loop;
    }
    return coerceIn(n, 1, 249);
  }
  function kpPosition(siderealDeg) {
    _init_properties_KpEngine_kt__5b306f();
    var lon = (siderealDeg % 360.0 + 360.0) % 360.0;
    var sign = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(lon);
    var nak = Companion_getInstance_1().fromLongitudeDeg_qpnd6t_k$(lon);
    var starLord = nak.lord_1;
    var posInNak = lon % get_NAKSHATRA_SPAN();
    var _destruct__k2r9zo = findSub(posInNak, starLord, get_NAKSHATRA_SPAN());
    var subLord = _destruct__k2r9zo.component1_7eebsc_k$();
    var posInSub = _destruct__k2r9zo.component2_7eebsb_k$();
    var subSpan = _destruct__k2r9zo.component3_7eebsa_k$();
    var subSubLord = findSub(posInSub, subLord, subSpan).component1_7eebsc_k$();
    var kpNumber = computeKpNumber(lon);
    return new KpPosition(sign.owner_1.displayName_1, starLord, subLord, subSubLord, kpNumber, sign, nak, lon % 30.0, posInNak, posInSub);
  }
  function kpNumberToSign(kpNum) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(1 <= kpNum ? kpNum <= 249 : false)) {
      // Inline function 'kp.astro.kpNumberToSign.<anonymous>' call
      var message = 'KP number must be 1..249, got ' + kpNum;
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var starts = get_kpSegmentStarts();
    // Inline function 'kotlin.math.floor' call
    var x = starts.get_c1px32_k$(kpNum - 1 | 0) / 30.0;
    var tmp$ret$1 = Math.floor(x);
    return numberToInt(tmp$ret$1) + 1 | 0;
  }
  function kpNumberToStartDegree(kpNum) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(1 <= kpNum ? kpNum <= 249 : false)) {
      // Inline function 'kp.astro.kpNumberToStartDegree.<anonymous>' call
      var message = 'KP number must be 1..249, got ' + kpNum;
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return get_kpSegmentStarts().get_c1px32_k$(kpNum - 1 | 0);
  }
  function kpNumberToEndDegree(kpNum) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(1 <= kpNum ? kpNum <= 249 : false)) {
      // Inline function 'kp.astro.kpNumberToEndDegree.<anonymous>' call
      var message = 'KP number must be 1..249, got ' + kpNum;
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return kpNum === 249 ? 360.0 : get_kpSegmentStarts().get_c1px32_k$(kpNum);
  }
  function kpNumberToMidDegree(kpNum) {
    _init_properties_KpEngine_kt__5b306f();
    var s = kpNumberToStartDegree(kpNum);
    var e = kpNumberToEndDegree(kpNum);
    return (s + e) / 2.0 % 360.0;
  }
  function KpChart(cusps, planets) {
    this.cusps_1 = cusps;
    this.planets_1 = planets;
  }
  protoOf(KpChart).get_cusps_ipy7yz_k$ = function () {
    return this.cusps_1;
  };
  protoOf(KpChart).get_planets_6whxxq_k$ = function () {
    return this.planets_1;
  };
  protoOf(KpChart).houseOfDegree_ss35wj_k$ = function (deg) {
    var d = (deg % 360.0 + 360.0) % 360.0;
    var inductionVariable = 0;
    if (inductionVariable < 12)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var start = (this.cusps_1.get_c1px32_k$(i) % 360.0 + 360.0) % 360.0;
        var end = (this.cusps_1.get_c1px32_k$((i + 1 | 0) % 12 | 0) % 360.0 + 360.0) % 360.0;
        if (start < end) {
          if (d >= start && d < end)
            return i + 1 | 0;
        } else {
          if (d >= start || d < end)
            return i + 1 | 0;
        }
      }
       while (inductionVariable < 12);
    return 1;
  };
  protoOf(KpChart).planetHouse_ta75sy_k$ = function (planet) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = this.planets_1.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.KpChart.planetHouse.<anonymous>' call
        if (element.get_first_irdx8n_k$().equals(planet)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_safe_receiver = tmp$ret$1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kp.astro.KpChart.planetHouse.<anonymous>' call
      var deg = tmp0_safe_receiver.component2_7eebsb_k$();
      tmp = this.houseOfDegree_ss35wj_k$(deg);
    }
    return tmp;
  };
  protoOf(KpChart).component1_7eebsc_k$ = function () {
    return this.cusps_1;
  };
  protoOf(KpChart).component2_7eebsb_k$ = function () {
    return this.planets_1;
  };
  protoOf(KpChart).copy_kuzkpx_k$ = function (cusps, planets) {
    return new KpChart(cusps, planets);
  };
  protoOf(KpChart).copy$default_i15ixg_k$ = function (cusps, planets, $super) {
    cusps = cusps === VOID ? this.cusps_1 : cusps;
    planets = planets === VOID ? this.planets_1 : planets;
    return $super === VOID ? this.copy_kuzkpx_k$(cusps, planets) : $super.copy_kuzkpx_k$.call(this, cusps, planets);
  };
  protoOf(KpChart).toString = function () {
    return 'KpChart(cusps=' + toString(this.cusps_1) + ', planets=' + toString(this.planets_1) + ')';
  };
  protoOf(KpChart).hashCode = function () {
    var result = hashCode(this.cusps_1);
    result = imul(result, 31) + hashCode(this.planets_1) | 0;
    return result;
  };
  protoOf(KpChart).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KpChart))
      return false;
    var tmp0_other_with_cast = other instanceof KpChart ? other : THROW_CCE();
    if (!equals(this.cusps_1, tmp0_other_with_cast.cusps_1))
      return false;
    if (!equals(this.planets_1, tmp0_other_with_cast.planets_1))
      return false;
    return true;
  };
  var SignificatorType_StarLord_instance;
  var SignificatorType_Occupant_instance;
  var SignificatorType_Owner_instance;
  var SignificatorType_Aspecting_instance;
  function values_3() {
    return [SignificatorType_StarLord_getInstance(), SignificatorType_Occupant_getInstance(), SignificatorType_Owner_getInstance(), SignificatorType_Aspecting_getInstance()];
  }
  function valueOf_3(value) {
    switch (value) {
      case 'StarLord':
        return SignificatorType_StarLord_getInstance();
      case 'Occupant':
        return SignificatorType_Occupant_getInstance();
      case 'Owner':
        return SignificatorType_Owner_getInstance();
      case 'Aspecting':
        return SignificatorType_Aspecting_getInstance();
      default:
        SignificatorType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_3() {
    if ($ENTRIES_3 == null)
      $ENTRIES_3 = enumEntries(values_3());
    return $ENTRIES_3;
  }
  var SignificatorType_entriesInitialized;
  function SignificatorType_initEntries() {
    if (SignificatorType_entriesInitialized)
      return Unit_getInstance();
    SignificatorType_entriesInitialized = true;
    SignificatorType_StarLord_instance = new SignificatorType('StarLord', 0, 1, 'A \xB7 \u9A7B\u5B88\u661F\u4E4B\u5BBF\u4E3B');
    SignificatorType_Occupant_instance = new SignificatorType('Occupant', 1, 2, 'B \xB7 \u9A7B\u5B88\u661F');
    SignificatorType_Owner_instance = new SignificatorType('Owner', 2, 3, 'D \xB7 \u5BAB\u4E3B');
    SignificatorType_Aspecting_instance = new SignificatorType('Aspecting', 3, 4, 'E \xB7 \u76F8\u4F4D\u661F');
  }
  var $ENTRIES_3;
  function SignificatorType(name, ordinal, rank, label) {
    Enum.call(this, name, ordinal);
    this.rank_1 = rank;
    this.label_1 = label;
  }
  protoOf(SignificatorType).get_rank_wotilx_k$ = function () {
    return this.rank_1;
  };
  protoOf(SignificatorType).get_label_iuj8p7_k$ = function () {
    return this.label_1;
  };
  function KpSignificator(planet, signifiedHouses, strengthOrder) {
    this.planet_1 = planet;
    this.signifiedHouses_1 = signifiedHouses;
    this.strengthOrder_1 = strengthOrder;
  }
  protoOf(KpSignificator).get_planet_i3vtlt_k$ = function () {
    return this.planet_1;
  };
  protoOf(KpSignificator).get_signifiedHouses_ee9a0o_k$ = function () {
    return this.signifiedHouses_1;
  };
  protoOf(KpSignificator).get_strengthOrder_y626as_k$ = function () {
    return this.strengthOrder_1;
  };
  protoOf(KpSignificator).component1_7eebsc_k$ = function () {
    return this.planet_1;
  };
  protoOf(KpSignificator).component2_7eebsb_k$ = function () {
    return this.signifiedHouses_1;
  };
  protoOf(KpSignificator).component3_7eebsa_k$ = function () {
    return this.strengthOrder_1;
  };
  protoOf(KpSignificator).copy_e4hvu5_k$ = function (planet, signifiedHouses, strengthOrder) {
    return new KpSignificator(planet, signifiedHouses, strengthOrder);
  };
  protoOf(KpSignificator).copy$default_hljml9_k$ = function (planet, signifiedHouses, strengthOrder, $super) {
    planet = planet === VOID ? this.planet_1 : planet;
    signifiedHouses = signifiedHouses === VOID ? this.signifiedHouses_1 : signifiedHouses;
    strengthOrder = strengthOrder === VOID ? this.strengthOrder_1 : strengthOrder;
    return $super === VOID ? this.copy_e4hvu5_k$(planet, signifiedHouses, strengthOrder) : $super.copy_e4hvu5_k$.call(this, planet, signifiedHouses, strengthOrder);
  };
  protoOf(KpSignificator).toString = function () {
    return 'KpSignificator(planet=' + this.planet_1.toString() + ', signifiedHouses=' + toString(this.signifiedHouses_1) + ', strengthOrder=' + toString(this.strengthOrder_1) + ')';
  };
  protoOf(KpSignificator).hashCode = function () {
    var result = this.planet_1.hashCode();
    result = imul(result, 31) + hashCode(this.signifiedHouses_1) | 0;
    result = imul(result, 31) + hashCode(this.strengthOrder_1) | 0;
    return result;
  };
  protoOf(KpSignificator).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof KpSignificator))
      return false;
    var tmp0_other_with_cast = other instanceof KpSignificator ? other : THROW_CCE();
    if (!this.planet_1.equals(tmp0_other_with_cast.planet_1))
      return false;
    if (!equals(this.signifiedHouses_1, tmp0_other_with_cast.signifiedHouses_1))
      return false;
    if (!equals(this.strengthOrder_1, tmp0_other_with_cast.strengthOrder_1))
      return false;
    return true;
  };
  function computeSignificators(chart) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.collections.mutableListOf' call
    var result = ArrayList_init_$Create$();
    // Inline function 'kotlin.collections.map' call
    var this_0 = chart.planets_1;
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var tmp0_iterator = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'kp.astro.computeSignificators.<anonymous>' call
      var p = item.component1_7eebsc_k$();
      var deg = item.component2_7eebsb_k$();
      var tmp$ret$1 = to(p, chart.houseOfDegree_ss35wj_k$(deg));
      destination.add_utx5q5_k$(tmp$ret$1);
    }
    var planetHouses = destination;
    // Inline function 'kotlin.collections.map' call
    var this_1 = chart.planets_1;
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_1, 10));
    var tmp0_iterator_0 = this_1.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var item_0 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'kp.astro.computeSignificators.<anonymous>' call
      var p_0 = item_0.component1_7eebsc_k$();
      var deg_0 = item_0.component2_7eebsb_k$();
      var tmp$ret$4 = to(p_0, Companion_getInstance_1().fromLongitudeDeg_qpnd6t_k$(deg_0).lord_1);
      destination_0.add_utx5q5_k$(tmp$ret$4);
    }
    var planetStarLords = destination_0;
    // Inline function 'kotlin.collections.map' call
    var this_2 = until(0, 12);
    // Inline function 'kotlin.collections.mapTo' call
    var destination_1 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_2, 10));
    var inductionVariable = this_2.get_first_irdx8n_k$();
    var last = this_2.get_last_wopotb_k$();
    if (inductionVariable <= last)
      do {
        var item_1 = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kp.astro.computeSignificators.<anonymous>' call
        var i = item_1;
        // Inline function 'kotlin.math.floor' call
        var x = (chart.cusps_1.get_c1px32_k$(i) % 360.0 + 360.0) % 360.0 / 30.0;
        var tmp$ret$7 = Math.floor(x);
        var tmp$ret$8 = numberToInt(tmp$ret$7);
        destination_1.add_utx5q5_k$(tmp$ret$8);
      }
       while (!(item_1 === last));
    var cuspOwners = destination_1;
    // Inline function 'kotlin.collections.map' call
    var this_3 = until(0, 12);
    // Inline function 'kotlin.collections.mapTo' call
    var destination_2 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_3, 10));
    var inductionVariable_0 = this_3.get_first_irdx8n_k$();
    var last_0 = this_3.get_last_wopotb_k$();
    if (inductionVariable_0 <= last_0)
      do {
        var item_2 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        // Inline function 'kp.astro.computeSignificators.<anonymous>' call
        var i_0 = item_2;
        var signIdx = cuspOwners.get_c1px32_k$(i_0);
        var tmp$ret$12;
        $l$block: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var tmp0_iterator_1 = Companion_getInstance_0().VEDIC_NINE_1.iterator_jk1svi_k$();
          while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
            var element = tmp0_iterator_1.next_20eer_k$();
            // Inline function 'kp.astro.computeSignificators.<anonymous>.<anonymous>' call
            if (kpOwnedSigns(element).contains_aljjnj_k$(signIdx)) {
              tmp$ret$12 = element;
              break $l$block;
            }
          }
          tmp$ret$12 = null;
        }
        var tmp$ret$13 = tmp$ret$12;
        destination_2.add_utx5q5_k$(tmp$ret$13);
      }
       while (!(item_2 === last_0));
    var houseOwnerPlanets = destination_2;
    var _iterator__ex2g4s = Companion_getInstance_0().VEDIC_NINE_1.iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var planet = _iterator__ex2g4s.next_20eer_k$();
      // Inline function 'kotlin.collections.mutableListOf' call
      var strengthOrder = ArrayList_init_$Create$();
      var _iterator__ex2g4s_0 = planetStarLords.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_0.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo = _iterator__ex2g4s_0.next_20eer_k$();
        var otherPlanet = _destruct__k2r9zo.component1_7eebsc_k$();
        var starLord = _destruct__k2r9zo.component2_7eebsb_k$();
        if (equals(planetToDashaLord(planet), starLord)) {
          var tmp$ret$18;
          $l$block_0: {
            // Inline function 'kotlin.collections.firstOrNull' call
            var tmp0_iterator_2 = planetHouses.iterator_jk1svi_k$();
            while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
              var element_0 = tmp0_iterator_2.next_20eer_k$();
              // Inline function 'kp.astro.computeSignificators.<anonymous>' call
              if (element_0.get_first_irdx8n_k$().equals(otherPlanet)) {
                tmp$ret$18 = element_0;
                break $l$block_0;
              }
            }
            tmp$ret$18 = null;
          }
          var tmp0_safe_receiver = tmp$ret$18;
          var house = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.get_second_jf7fjx_k$();
          if (!(house == null)) {
            strengthOrder.add_utx5q5_k$(to(house, SignificatorType_StarLord_getInstance()));
          }
        }
      }
      var tmp$ret$20;
      $l$block_1: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var tmp0_iterator_3 = planetHouses.iterator_jk1svi_k$();
        while (tmp0_iterator_3.hasNext_bitz1p_k$()) {
          var element_1 = tmp0_iterator_3.next_20eer_k$();
          // Inline function 'kp.astro.computeSignificators.<anonymous>' call
          if (element_1.get_first_irdx8n_k$().equals(planet)) {
            tmp$ret$20 = element_1;
            break $l$block_1;
          }
        }
        tmp$ret$20 = null;
      }
      var tmp1_safe_receiver = tmp$ret$20;
      var occHouse = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.get_second_jf7fjx_k$();
      if (!(occHouse == null)) {
        strengthOrder.add_utx5q5_k$(to(occHouse, SignificatorType_Occupant_getInstance()));
      }
      var iterator = houseOwnerPlanets.iterator_jk1svi_k$();
      var index = 0;
      $l$loop_0: while (iterator.hasNext_bitz1p_k$()) {
        var houseIdx = index;
        index = index + 1 | 0;
        var ownerOpt = iterator.next_20eer_k$();
        var tmp;
        if (ownerOpt == null) {
          continue $l$loop_0;
        } else {
          tmp = ownerOpt;
        }
        var ownerPlanet = tmp;
        var tmp$ret$22;
        $l$block_2: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var tmp0_iterator_4 = planetStarLords.iterator_jk1svi_k$();
          while (tmp0_iterator_4.hasNext_bitz1p_k$()) {
            var element_2 = tmp0_iterator_4.next_20eer_k$();
            // Inline function 'kp.astro.computeSignificators.<anonymous>' call
            if (element_2.get_first_irdx8n_k$().equals(ownerPlanet)) {
              tmp$ret$22 = element_2;
              break $l$block_2;
            }
          }
          tmp$ret$22 = null;
        }
        var tmp3_safe_receiver = tmp$ret$22;
        var tmp4_elvis_lhs = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.get_second_jf7fjx_k$();
        var tmp_0;
        if (tmp4_elvis_lhs == null) {
          continue $l$loop_0;
        } else {
          tmp_0 = tmp4_elvis_lhs;
        }
        var ownerStar = tmp_0;
        if (equals(planetToDashaLord(planet), ownerStar)) {
          var h = houseIdx + 1 | 0;
          var tmp$ret$23;
          $l$block_4: {
            // Inline function 'kotlin.collections.none' call
            var tmp_1;
            if (isInterface(strengthOrder, Collection)) {
              tmp_1 = strengthOrder.isEmpty_y1axqb_k$();
            } else {
              tmp_1 = false;
            }
            if (tmp_1) {
              tmp$ret$23 = true;
              break $l$block_4;
            }
            var tmp0_iterator_5 = strengthOrder.iterator_jk1svi_k$();
            while (tmp0_iterator_5.hasNext_bitz1p_k$()) {
              var element_3 = tmp0_iterator_5.next_20eer_k$();
              // Inline function 'kp.astro.computeSignificators.<anonymous>' call
              if (element_3.get_first_irdx8n_k$() === h) {
                tmp$ret$23 = false;
                break $l$block_4;
              }
            }
            tmp$ret$23 = true;
          }
          if (tmp$ret$23) {
            strengthOrder.add_utx5q5_k$(to(h, SignificatorType_StarLord_getInstance()));
          }
        }
      }
      var owned = kpOwnedSigns(planet);
      var iterator_0 = cuspOwners.iterator_jk1svi_k$();
      var index_0 = 0;
      while (iterator_0.hasNext_bitz1p_k$()) {
        var houseIdx_0 = index_0;
        index_0 = index_0 + 1 | 0;
        var signIdx_0 = iterator_0.next_20eer_k$();
        if (owned.contains_aljjnj_k$(signIdx_0)) {
          strengthOrder.add_utx5q5_k$(to(houseIdx_0 + 1 | 0, SignificatorType_Owner_getInstance()));
        }
      }
      if (!(occHouse == null)) {
        var _iterator__ex2g4s_1 = kpAspectOffsets(planet).iterator_jk1svi_k$();
        while (_iterator__ex2g4s_1.hasNext_bitz1p_k$()) {
          var offset = _iterator__ex2g4s_1.next_20eer_k$();
          var aspected = (((occHouse - 1 | 0) + offset | 0) % 12 | 0) + 1 | 0;
          strengthOrder.add_utx5q5_k$(to(aspected, SignificatorType_Aspecting_getInstance()));
        }
      }
      // Inline function 'kotlin.collections.mutableListOf' call
      var signifiedHouses = ArrayList_init_$Create$();
      var _iterator__ex2g4s_2 = strengthOrder.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_2.hasNext_bitz1p_k$()) {
        var h_0 = _iterator__ex2g4s_2.next_20eer_k$().component1_7eebsc_k$();
        if (!signifiedHouses.contains_aljjnj_k$(h_0)) {
          signifiedHouses.add_utx5q5_k$(h_0);
        }
      }
      result.add_utx5q5_k$(new KpSignificator(planet, signifiedHouses, strengthOrder));
    }
    return result;
  }
  var HousePromise_Positive_instance;
  var HousePromise_Negative_instance;
  var HousePromise_Mixed_instance;
  function values_4() {
    return [HousePromise_Positive_getInstance(), HousePromise_Negative_getInstance(), HousePromise_Mixed_getInstance()];
  }
  function valueOf_4(value) {
    switch (value) {
      case 'Positive':
        return HousePromise_Positive_getInstance();
      case 'Negative':
        return HousePromise_Negative_getInstance();
      case 'Mixed':
        return HousePromise_Mixed_getInstance();
      default:
        HousePromise_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_4() {
    if ($ENTRIES_4 == null)
      $ENTRIES_4 = enumEntries(values_4());
    return $ENTRIES_4;
  }
  var HousePromise_entriesInitialized;
  function HousePromise_initEntries() {
    if (HousePromise_entriesInitialized)
      return Unit_getInstance();
    HousePromise_entriesInitialized = true;
    HousePromise_Positive_instance = new HousePromise('Positive', 0, '\u5409', 'promise-positive');
    HousePromise_Negative_instance = new HousePromise('Negative', 1, '\u51F6', 'promise-negative');
    HousePromise_Mixed_instance = new HousePromise('Mixed', 2, '\u6DF7\u5408', 'promise-mixed');
  }
  var $ENTRIES_4;
  function HousePromise(name, ordinal, label, cssClass) {
    Enum.call(this, name, ordinal);
    this.label_1 = label;
    this.cssClass_1 = cssClass;
  }
  protoOf(HousePromise).get_label_iuj8p7_k$ = function () {
    return this.label_1;
  };
  protoOf(HousePromise).get_cssClass_j5a41q_k$ = function () {
    return this.cssClass_1;
  };
  function CuspalSubLord(house, cuspDeg, signLord, starLord, subLord, promise, sign) {
    this.house_1 = house;
    this.cuspDeg_1 = cuspDeg;
    this.signLord_1 = signLord;
    this.starLord_1 = starLord;
    this.subLord_1 = subLord;
    this.promise_1 = promise;
    this.sign_1 = sign;
  }
  protoOf(CuspalSubLord).get_house_islek7_k$ = function () {
    return this.house_1;
  };
  protoOf(CuspalSubLord).get_cuspDeg_jx00ge_k$ = function () {
    return this.cuspDeg_1;
  };
  protoOf(CuspalSubLord).get_signLord_qnpvj9_k$ = function () {
    return this.signLord_1;
  };
  protoOf(CuspalSubLord).get_starLord_a1nf0w_k$ = function () {
    return this.starLord_1;
  };
  protoOf(CuspalSubLord).get_subLord_tn29as_k$ = function () {
    return this.subLord_1;
  };
  protoOf(CuspalSubLord).get_promise_3ujnbi_k$ = function () {
    return this.promise_1;
  };
  protoOf(CuspalSubLord).get_sign_woubd2_k$ = function () {
    return this.sign_1;
  };
  protoOf(CuspalSubLord).component1_7eebsc_k$ = function () {
    return this.house_1;
  };
  protoOf(CuspalSubLord).component2_7eebsb_k$ = function () {
    return this.cuspDeg_1;
  };
  protoOf(CuspalSubLord).component3_7eebsa_k$ = function () {
    return this.signLord_1;
  };
  protoOf(CuspalSubLord).component4_7eebs9_k$ = function () {
    return this.starLord_1;
  };
  protoOf(CuspalSubLord).component5_7eebs8_k$ = function () {
    return this.subLord_1;
  };
  protoOf(CuspalSubLord).component6_7eebs7_k$ = function () {
    return this.promise_1;
  };
  protoOf(CuspalSubLord).component7_7eebs6_k$ = function () {
    return this.sign_1;
  };
  protoOf(CuspalSubLord).copy_rl9s1x_k$ = function (house, cuspDeg, signLord, starLord, subLord, promise, sign) {
    return new CuspalSubLord(house, cuspDeg, signLord, starLord, subLord, promise, sign);
  };
  protoOf(CuspalSubLord).copy$default_vk47ez_k$ = function (house, cuspDeg, signLord, starLord, subLord, promise, sign, $super) {
    house = house === VOID ? this.house_1 : house;
    cuspDeg = cuspDeg === VOID ? this.cuspDeg_1 : cuspDeg;
    signLord = signLord === VOID ? this.signLord_1 : signLord;
    starLord = starLord === VOID ? this.starLord_1 : starLord;
    subLord = subLord === VOID ? this.subLord_1 : subLord;
    promise = promise === VOID ? this.promise_1 : promise;
    sign = sign === VOID ? this.sign_1 : sign;
    return $super === VOID ? this.copy_rl9s1x_k$(house, cuspDeg, signLord, starLord, subLord, promise, sign) : $super.copy_rl9s1x_k$.call(this, house, cuspDeg, signLord, starLord, subLord, promise, sign);
  };
  protoOf(CuspalSubLord).toString = function () {
    return 'CuspalSubLord(house=' + this.house_1 + ', cuspDeg=' + this.cuspDeg_1 + ', signLord=' + this.signLord_1 + ', starLord=' + this.starLord_1.toString() + ', subLord=' + this.subLord_1.toString() + ', promise=' + this.promise_1.toString() + ', sign=' + this.sign_1.toString() + ')';
  };
  protoOf(CuspalSubLord).hashCode = function () {
    var result = this.house_1;
    result = imul(result, 31) + getNumberHashCode(this.cuspDeg_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.signLord_1) | 0;
    result = imul(result, 31) + this.starLord_1.hashCode() | 0;
    result = imul(result, 31) + this.subLord_1.hashCode() | 0;
    result = imul(result, 31) + this.promise_1.hashCode() | 0;
    result = imul(result, 31) + this.sign_1.hashCode() | 0;
    return result;
  };
  protoOf(CuspalSubLord).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof CuspalSubLord))
      return false;
    var tmp0_other_with_cast = other instanceof CuspalSubLord ? other : THROW_CCE();
    if (!(this.house_1 === tmp0_other_with_cast.house_1))
      return false;
    if (!equals(this.cuspDeg_1, tmp0_other_with_cast.cuspDeg_1))
      return false;
    if (!(this.signLord_1 === tmp0_other_with_cast.signLord_1))
      return false;
    if (!this.starLord_1.equals(tmp0_other_with_cast.starLord_1))
      return false;
    if (!this.subLord_1.equals(tmp0_other_with_cast.subLord_1))
      return false;
    if (!this.promise_1.equals(tmp0_other_with_cast.promise_1))
      return false;
    if (!this.sign_1.equals(tmp0_other_with_cast.sign_1))
      return false;
    return true;
  };
  function favorableHousesForCusp(house) {
    _init_properties_KpEngine_kt__5b306f();
    switch (house) {
      case 1:
        return listOf([1, 5, 9, 11]);
      case 2:
        return listOf([2, 6, 10, 11]);
      case 3:
        return listOf([3, 6, 10, 11]);
      case 4:
        return listOf([4, 2, 11]);
      case 5:
        return listOf([2, 5, 11]);
      case 6:
        return listOf([1, 2, 6, 10, 11]);
      case 7:
        return listOf([2, 7, 11]);
      case 8:
        return listOf([1, 5, 8, 11]);
      case 9:
        return listOf([2, 9, 11]);
      case 10:
        return listOf([2, 6, 10, 11]);
      case 11:
        return listOf([2, 3, 6, 11]);
      case 12:
        return listOf([3, 9, 12]);
      default:
        return emptyList();
    }
  }
  function unfavorableHousesForCusp(house) {
    _init_properties_KpEngine_kt__5b306f();
    switch (house) {
      case 1:
        return listOf([6, 8, 12]);
      case 2:
        return listOf([5, 8, 12]);
      case 3:
        return listOf([8, 12]);
      case 4:
        return listOf([3, 5, 12]);
      case 5:
        return listOf([4, 8, 12]);
      case 6:
        return listOf([5, 11, 12]);
      case 7:
        return listOf([1, 6, 10, 12]);
      case 8:
        return listOf([6, 12]);
      case 9:
        return listOf([3, 8, 12]);
      case 10:
        return listOf([5, 8, 12]);
      case 11:
        return listOf([5, 8, 12]);
      case 12:
        return listOf([1, 2, 6, 10]);
      default:
        return emptyList();
    }
  }
  function cuspalAnalysis(cuspDegrees, planetPositions) {
    _init_properties_KpEngine_kt__5b306f();
    var chart = new KpChart(cuspDegrees, planetPositions);
    var significators = computeSignificators(chart);
    // Inline function 'kotlin.collections.mutableListOf' call
    var results = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = cuspDegrees.get_size_woubt6_k$() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var house = i + 1 | 0;
        var cuspDeg = cuspDegrees.get_c1px32_k$(i);
        var kp = kpPosition(cuspDeg);
        var subLordPlanet = planetFromDashaLord(kp.subLord_1);
        var tmp$ret$2;
        $l$block: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var tmp0_iterator = significators.iterator_jk1svi_k$();
          while (tmp0_iterator.hasNext_bitz1p_k$()) {
            var element = tmp0_iterator.next_20eer_k$();
            // Inline function 'kp.astro.cuspalAnalysis.<anonymous>' call
            if (element.planet_1.equals(subLordPlanet)) {
              tmp$ret$2 = element;
              break $l$block;
            }
          }
          tmp$ret$2 = null;
        }
        var subLordSigs = tmp$ret$2;
        var tmp;
        if (!(subLordSigs == null)) {
          var favorable = favorableHousesForCusp(house);
          var unfavorable = unfavorableHousesForCusp(house);
          var tmp$ret$3;
          $l$block_0: {
            // Inline function 'kotlin.collections.count' call
            var this_0 = subLordSigs.signifiedHouses_1;
            var tmp_0;
            if (isInterface(this_0, Collection)) {
              tmp_0 = this_0.isEmpty_y1axqb_k$();
            } else {
              tmp_0 = false;
            }
            if (tmp_0) {
              tmp$ret$3 = 0;
              break $l$block_0;
            }
            var count = 0;
            var tmp0_iterator_0 = this_0.iterator_jk1svi_k$();
            while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
              var element_0 = tmp0_iterator_0.next_20eer_k$();
              // Inline function 'kp.astro.cuspalAnalysis.<anonymous>' call
              if (favorable.contains_aljjnj_k$(element_0)) {
                count = count + 1 | 0;
                checkCountOverflow(count);
              }
            }
            tmp$ret$3 = count;
          }
          var favCount = tmp$ret$3;
          var tmp$ret$5;
          $l$block_1: {
            // Inline function 'kotlin.collections.count' call
            var this_1 = subLordSigs.signifiedHouses_1;
            var tmp_1;
            if (isInterface(this_1, Collection)) {
              tmp_1 = this_1.isEmpty_y1axqb_k$();
            } else {
              tmp_1 = false;
            }
            if (tmp_1) {
              tmp$ret$5 = 0;
              break $l$block_1;
            }
            var count_0 = 0;
            var tmp0_iterator_1 = this_1.iterator_jk1svi_k$();
            while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
              var element_1 = tmp0_iterator_1.next_20eer_k$();
              // Inline function 'kp.astro.cuspalAnalysis.<anonymous>' call
              if (unfavorable.contains_aljjnj_k$(element_1)) {
                count_0 = count_0 + 1 | 0;
                checkCountOverflow(count_0);
              }
            }
            tmp$ret$5 = count_0;
          }
          var unfavCount = tmp$ret$5;
          tmp = favCount > 0 && unfavCount === 0 ? HousePromise_Positive_getInstance() : unfavCount > 0 && favCount === 0 ? HousePromise_Negative_getInstance() : HousePromise_Mixed_getInstance();
        } else {
          tmp = HousePromise_Mixed_getInstance();
        }
        var promise = tmp;
        results.add_utx5q5_k$(new CuspalSubLord(house, cuspDeg, kp.signLord_1, kp.starLord_1, kp.subLord_1, promise, kp.sign_1));
      }
       while (inductionVariable <= last);
    return results;
  }
  function rulingPlanets(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord) {
    _init_properties_KpEngine_kt__5b306f();
    var all = listOf([dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord]);
    // Inline function 'kotlin.collections.mutableListOf' call
    var unique = ArrayList_init_$Create$();
    var _iterator__ex2g4s = all.iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var lord = _iterator__ex2g4s.next_20eer_k$();
      if (!unique.contains_aljjnj_k$(lord)) {
        unique.add_utx5q5_k$(lord);
      }
    }
    return unique;
  }
  function rulingPlanetsWithStrength(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord) {
    _init_properties_KpEngine_kt__5b306f();
    var all = listOf([dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord]);
    // Inline function 'kotlin.collections.mutableListOf' call
    var counts = ArrayList_init_$Create$();
    var _iterator__ex2g4s = all.iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var lord = _iterator__ex2g4s.next_20eer_k$();
      var tmp$ret$2;
      $l$block: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var tmp0_iterator = counts.iterator_jk1svi_k$();
        while (tmp0_iterator.hasNext_bitz1p_k$()) {
          var element = tmp0_iterator.next_20eer_k$();
          // Inline function 'kp.astro.rulingPlanetsWithStrength.<anonymous>' call
          if (element.get_first_irdx8n_k$().equals(lord)) {
            tmp$ret$2 = element;
            break $l$block;
          }
        }
        tmp$ret$2 = null;
      }
      var existing = tmp$ret$2;
      if (!(existing == null)) {
        counts.set_82063s_k$(counts.indexOf_si1fv9_k$(existing), to(existing.get_first_irdx8n_k$(), existing.get_second_jf7fjx_k$() + 1 | 0));
      } else {
        counts.add_utx5q5_k$(to(lord, 1));
      }
    }
    // Inline function 'kotlin.collections.sortedByDescending' call
    // Inline function 'kotlin.comparisons.compareByDescending' call
    var tmp = rulingPlanetsWithStrength$lambda;
    var tmp$ret$3 = new sam$kotlin_Comparator$0(tmp);
    return sortedWith(counts, tmp$ret$3);
  }
  function rulingPlanetsWithAgents(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord, rahuSignLord, ketuSignLord) {
    rahuSignLord = rahuSignLord === VOID ? null : rahuSignLord;
    ketuSignLord = ketuSignLord === VOID ? null : ketuSignLord;
    _init_properties_KpEngine_kt__5b306f();
    var result = toMutableList(rulingPlanetsWithStrength(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord));
    var tmp;
    if (!(rahuSignLord == null)) {
      var tmp$ret$0;
      $l$block_0: {
        // Inline function 'kotlin.collections.any' call
        var tmp_0;
        if (isInterface(result, Collection)) {
          tmp_0 = result.isEmpty_y1axqb_k$();
        } else {
          tmp_0 = false;
        }
        if (tmp_0) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
        var tmp0_iterator = result.iterator_jk1svi_k$();
        while (tmp0_iterator.hasNext_bitz1p_k$()) {
          var element = tmp0_iterator.next_20eer_k$();
          // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
          if (element.get_first_irdx8n_k$().equals(DashaLord_Rahu_getInstance())) {
            tmp$ret$0 = true;
            break $l$block_0;
          }
        }
        tmp$ret$0 = false;
      }
      tmp = tmp$ret$0;
    } else {
      tmp = false;
    }
    if (tmp) {
      var tmp$ret$3;
      $l$block_1: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var tmp0_iterator_0 = result.iterator_jk1svi_k$();
        while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
          var element_0 = tmp0_iterator_0.next_20eer_k$();
          // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
          if (element_0.get_first_irdx8n_k$().equals(rahuSignLord)) {
            tmp$ret$3 = element_0;
            break $l$block_1;
          }
        }
        tmp$ret$3 = null;
      }
      var existing = tmp$ret$3;
      if (!(existing == null)) {
        result.set_82063s_k$(result.indexOf_si1fv9_k$(existing), to(rahuSignLord, existing.get_second_jf7fjx_k$() + 1 | 0));
      } else {
        result.add_utx5q5_k$(to(rahuSignLord, 1));
      }
    }
    var tmp_1;
    if (!(ketuSignLord == null)) {
      var tmp$ret$4;
      $l$block_3: {
        // Inline function 'kotlin.collections.any' call
        var tmp_2;
        if (isInterface(result, Collection)) {
          tmp_2 = result.isEmpty_y1axqb_k$();
        } else {
          tmp_2 = false;
        }
        if (tmp_2) {
          tmp$ret$4 = false;
          break $l$block_3;
        }
        var tmp0_iterator_1 = result.iterator_jk1svi_k$();
        while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
          var element_1 = tmp0_iterator_1.next_20eer_k$();
          // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
          if (element_1.get_first_irdx8n_k$().equals(DashaLord_Ketu_getInstance())) {
            tmp$ret$4 = true;
            break $l$block_3;
          }
        }
        tmp$ret$4 = false;
      }
      tmp_1 = tmp$ret$4;
    } else {
      tmp_1 = false;
    }
    if (tmp_1) {
      var tmp$ret$7;
      $l$block_4: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var tmp0_iterator_2 = result.iterator_jk1svi_k$();
        while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
          var element_2 = tmp0_iterator_2.next_20eer_k$();
          // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
          if (element_2.get_first_irdx8n_k$().equals(ketuSignLord)) {
            tmp$ret$7 = element_2;
            break $l$block_4;
          }
        }
        tmp$ret$7 = null;
      }
      var existing_0 = tmp$ret$7;
      if (!(existing_0 == null)) {
        result.set_82063s_k$(result.indexOf_si1fv9_k$(existing_0), to(ketuSignLord, existing_0.get_second_jf7fjx_k$() + 1 | 0));
      } else {
        result.add_utx5q5_k$(to(ketuSignLord, 1));
      }
    }
    // Inline function 'kotlin.collections.sortedByDescending' call
    // Inline function 'kotlin.comparisons.compareByDescending' call
    var tmp_3 = rulingPlanetsWithAgents$lambda;
    var tmp$ret$8 = new sam$kotlin_Comparator$0_0(tmp_3);
    return sortedWith(result, tmp$ret$8);
  }
  var KpEvent_Marriage_instance;
  var KpEvent_Job_instance;
  var KpEvent_Health_instance;
  var KpEvent_ChildBirth_instance;
  var KpEvent_Education_instance;
  var KpEvent_ForeignTravel_instance;
  var KpEvent_Wealth_instance;
  var KpEvent_Litigation_instance;
  function values_5() {
    return [KpEvent_Marriage_getInstance(), KpEvent_Job_getInstance(), KpEvent_Health_getInstance(), KpEvent_ChildBirth_getInstance(), KpEvent_Education_getInstance(), KpEvent_ForeignTravel_getInstance(), KpEvent_Wealth_getInstance(), KpEvent_Litigation_getInstance()];
  }
  function valueOf_5(value) {
    switch (value) {
      case 'Marriage':
        return KpEvent_Marriage_getInstance();
      case 'Job':
        return KpEvent_Job_getInstance();
      case 'Health':
        return KpEvent_Health_getInstance();
      case 'ChildBirth':
        return KpEvent_ChildBirth_getInstance();
      case 'Education':
        return KpEvent_Education_getInstance();
      case 'ForeignTravel':
        return KpEvent_ForeignTravel_getInstance();
      case 'Wealth':
        return KpEvent_Wealth_getInstance();
      case 'Litigation':
        return KpEvent_Litigation_getInstance();
      default:
        KpEvent_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_5() {
    if ($ENTRIES_5 == null)
      $ENTRIES_5 = enumEntries(values_5());
    return $ENTRIES_5;
  }
  var KpEvent_entriesInitialized;
  function KpEvent_initEntries() {
    if (KpEvent_entriesInitialized)
      return Unit_getInstance();
    KpEvent_entriesInitialized = true;
    KpEvent_Marriage_instance = new KpEvent('Marriage', 0, '\u5A5A\u59FB / \u4F34\u4FA3', 7, listOf([2, 7, 11]), listOf([1, 6, 10, 12]));
    KpEvent_Job_instance = new KpEvent('Job', 1, '\u5DE5\u4F5C / \u4E8B\u4E1A', 10, listOf([2, 6, 10, 11]), listOf([5, 8, 12]));
    KpEvent_Health_instance = new KpEvent('Health', 2, '\u5065\u5EB7 / \u5EB7\u590D', 1, listOf([1, 5, 11]), listOf([6, 8, 12]));
    KpEvent_ChildBirth_instance = new KpEvent('ChildBirth', 3, '\u751F\u80B2\u5B50\u5973', 5, listOf([2, 5, 11]), listOf([4, 8, 12]));
    KpEvent_Education_instance = new KpEvent('Education', 4, '\u5B66\u4E1A', 4, listOf([4, 9, 11]), listOf([3, 8, 12]));
    KpEvent_ForeignTravel_instance = new KpEvent('ForeignTravel', 5, '\u51FA\u56FD / \u8FDC\u884C', 12, listOf([3, 9, 12]), listOf([1, 4, 10]));
    KpEvent_Wealth_instance = new KpEvent('Wealth', 6, '\u8D22\u5BCC / \u6536\u76CA', 2, listOf([1, 2, 6, 11]), listOf([5, 8, 12]));
    KpEvent_Litigation_instance = new KpEvent('Litigation', 7, '\u8BC9\u8BBC / \u7EA0\u7EB7', 6, listOf([1, 2, 6, 11]), listOf([5, 8, 12]));
  }
  var $ENTRIES_5;
  function KpEvent(name, ordinal, displayName, primaryHouse, favorable, negating) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.primaryHouse_1 = primaryHouse;
    this.favorable_1 = favorable;
    this.negating_1 = negating;
  }
  protoOf(KpEvent).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(KpEvent).get_primaryHouse_e8jed5_k$ = function () {
    return this.primaryHouse_1;
  };
  protoOf(KpEvent).get_favorable_l0ij2p_k$ = function () {
    return this.favorable_1;
  };
  protoOf(KpEvent).get_negating_gkj4l4_k$ = function () {
    return this.negating_1;
  };
  function isEventPromised(event, cuspalSubLord, significators) {
    _init_properties_KpEngine_kt__5b306f();
    var subPlanet = planetFromDashaLord(cuspalSubLord);
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = significators.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.isEventPromised.<anonymous>' call
        if (element.planet_1.equals(subPlanet)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_elvis_lhs = tmp$ret$1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var sigs = tmp;
    var tmp$ret$2;
    $l$block_0: {
      // Inline function 'kotlin.collections.count' call
      var this_0 = sigs.signifiedHouses_1;
      var tmp_0;
      if (isInterface(this_0, Collection)) {
        tmp_0 = this_0.isEmpty_y1axqb_k$();
      } else {
        tmp_0 = false;
      }
      if (tmp_0) {
        tmp$ret$2 = 0;
        break $l$block_0;
      }
      var count = 0;
      var tmp0_iterator_0 = this_0.iterator_jk1svi_k$();
      while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
        var element_0 = tmp0_iterator_0.next_20eer_k$();
        // Inline function 'kp.astro.isEventPromised.<anonymous>' call
        if (event.favorable_1.contains_aljjnj_k$(element_0)) {
          count = count + 1 | 0;
          checkCountOverflow(count);
        }
      }
      tmp$ret$2 = count;
    }
    var favCount = tmp$ret$2;
    var tmp$ret$4;
    $l$block_1: {
      // Inline function 'kotlin.collections.count' call
      var this_1 = sigs.signifiedHouses_1;
      var tmp_1;
      if (isInterface(this_1, Collection)) {
        tmp_1 = this_1.isEmpty_y1axqb_k$();
      } else {
        tmp_1 = false;
      }
      if (tmp_1) {
        tmp$ret$4 = 0;
        break $l$block_1;
      }
      var count_0 = 0;
      var tmp0_iterator_1 = this_1.iterator_jk1svi_k$();
      while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
        var element_1 = tmp0_iterator_1.next_20eer_k$();
        // Inline function 'kp.astro.isEventPromised.<anonymous>' call
        if (event.negating_1.contains_aljjnj_k$(element_1)) {
          count_0 = count_0 + 1 | 0;
          checkCountOverflow(count_0);
        }
      }
      tmp$ret$4 = count_0;
    }
    var negCount = tmp$ret$4;
    return favCount > negCount;
  }
  function checkEventInChart(event, chart) {
    _init_properties_KpEngine_kt__5b306f();
    var sigs = computeSignificators(chart);
    var primary = event.primaryHouse_1;
    var cuspKp = kpPosition(chart.cusps_1.get_c1px32_k$(primary - 1 | 0));
    return isEventPromised(event, cuspKp.subLord_1, sigs);
  }
  function significatorsOfHouse(house, allSignificators) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.collections.mutableListOf' call
    var result = ArrayList_init_$Create$();
    var _iterator__ex2g4s = listOf([SignificatorType_StarLord_getInstance(), SignificatorType_Occupant_getInstance(), SignificatorType_Owner_getInstance(), SignificatorType_Aspecting_getInstance()]).iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var sigType = _iterator__ex2g4s.next_20eer_k$();
      var _iterator__ex2g4s_0 = allSignificators.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_0.hasNext_bitz1p_k$()) {
        var sig = _iterator__ex2g4s_0.next_20eer_k$();
        var _iterator__ex2g4s_1 = sig.strengthOrder_1.iterator_jk1svi_k$();
        while (_iterator__ex2g4s_1.hasNext_bitz1p_k$()) {
          var _destruct__k2r9zo = _iterator__ex2g4s_1.next_20eer_k$();
          var h = _destruct__k2r9zo.component1_7eebsc_k$();
          var st = _destruct__k2r9zo.component2_7eebsb_k$();
          var tmp;
          if (h === house && st.equals(sigType)) {
            var tmp$ret$1;
            $l$block_0: {
              // Inline function 'kotlin.collections.none' call
              var tmp_0;
              if (isInterface(result, Collection)) {
                tmp_0 = result.isEmpty_y1axqb_k$();
              } else {
                tmp_0 = false;
              }
              if (tmp_0) {
                tmp$ret$1 = true;
                break $l$block_0;
              }
              var tmp0_iterator = result.iterator_jk1svi_k$();
              while (tmp0_iterator.hasNext_bitz1p_k$()) {
                var element = tmp0_iterator.next_20eer_k$();
                // Inline function 'kp.astro.significatorsOfHouse.<anonymous>' call
                if (element.get_first_irdx8n_k$().equals(sig.planet_1)) {
                  tmp$ret$1 = false;
                  break $l$block_0;
                }
              }
              tmp$ret$1 = true;
            }
            tmp = tmp$ret$1;
          } else {
            tmp = false;
          }
          if (tmp) {
            result.add_utx5q5_k$(to(sig.planet_1, sigType));
          }
        }
      }
    }
    return result;
  }
  function nakshatraPada(siderealDeg) {
    _init_properties_KpEngine_kt__5b306f();
    var posInNak = (siderealDeg % 360.0 + 360.0) % 360.0 % get_NAKSHATRA_SPAN();
    // Inline function 'kotlin.math.floor' call
    var x = posInNak / (get_NAKSHATRA_SPAN() / 4.0);
    var tmp$ret$0 = Math.floor(x);
    return numberToInt(tmp$ret$0) + 1 | 0;
  }
  function deity(_this__u8e3s4) {
    _init_properties_KpEngine_kt__5b306f();
    var tmp;
    switch (_this__u8e3s4.get_ordinal_ip24qg_k$()) {
      case 0:
        tmp = 'Ashwini Kumaras\uFF08\u53CC\u9A6C\u7AE5\uFF09';
        break;
      case 1:
        tmp = 'Yama\uFF08\u960E\u6469\uFF09';
        break;
      case 2:
        tmp = 'Agni\uFF08\u706B\u795E\uFF09';
        break;
      case 3:
        tmp = 'Brahma\uFF08\u68B5\u5929\uFF09';
        break;
      case 4:
        tmp = 'Soma\uFF08\u6708\u795E\uFF09';
        break;
      case 5:
        tmp = 'Rudra\uFF08\u66B4\u98CE\u795E\uFF09';
        break;
      case 6:
        tmp = 'Aditi\uFF08\u65E0\u9650\u4E4B\u6BCD\uFF09';
        break;
      case 7:
        tmp = 'Brihaspati\uFF08\u796D\u4E3B\uFF09';
        break;
      case 8:
        tmp = 'Sarpa\uFF08\u86C7\u795E\uFF09';
        break;
      case 9:
        tmp = 'Pitris\uFF08\u7956\u7075\uFF09';
        break;
      case 10:
        tmp = 'Bhaga\uFF08\u8D22\u5BCC\u795E\uFF09';
        break;
      case 11:
        tmp = 'Aryaman\uFF08\u9996\u9886\u795E\uFF09';
        break;
      case 12:
        tmp = 'Savitar\uFF08\u65E5\u795E\uFF09';
        break;
      case 13:
        tmp = 'Tvashtar\uFF08\u5DE5\u5320\u795E\uFF09';
        break;
      case 14:
        tmp = 'Vayu\uFF08\u98CE\u795E\uFF09';
        break;
      case 15:
        tmp = 'Indra-Agni\uFF08\u96F7\u7535\u4E0E\u706B\uFF09';
        break;
      case 16:
        tmp = 'Mitra\uFF08\u53CB\u7231\u795E\uFF09';
        break;
      case 17:
        tmp = 'Indra\uFF08\u96F7\u5E1D\uFF09';
        break;
      case 18:
        tmp = 'Nirriti\uFF08\u6BC1\u706D\u5973\u795E\uFF09';
        break;
      case 19:
        tmp = 'Apas\uFF08\u6C34\u795E\uFF09';
        break;
      case 20:
        tmp = 'Vishvadevas\uFF08\u4F17\u795E\uFF09';
        break;
      case 21:
        tmp = 'Vishnu\uFF08\u6BD7\u6E7F\u5974\uFF09';
        break;
      case 22:
        tmp = 'Vasu\uFF08\u516B\u5149\u795E\uFF09';
        break;
      case 23:
        tmp = 'Varuna\uFF08\u6C34\u5929\uFF09';
        break;
      case 24:
        tmp = 'Aja Ekapada\uFF08\u4E00\u8DB3\u5C71\u7F8A\u795E\uFF09';
        break;
      case 25:
        tmp = 'Ahir Budhnya\uFF08\u86C7\u9F99\u795E\uFF09';
        break;
      case 26:
        tmp = 'Pushan\uFF08\u7267\u517B\u795E\uFF09';
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  var Gana_Deva_instance;
  var Gana_Manushya_instance;
  var Gana_Rakshasa_instance;
  function values_6() {
    return [Gana_Deva_getInstance(), Gana_Manushya_getInstance(), Gana_Rakshasa_getInstance()];
  }
  function valueOf_6(value) {
    switch (value) {
      case 'Deva':
        return Gana_Deva_getInstance();
      case 'Manushya':
        return Gana_Manushya_getInstance();
      case 'Rakshasa':
        return Gana_Rakshasa_getInstance();
      default:
        Gana_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_6() {
    if ($ENTRIES_6 == null)
      $ENTRIES_6 = enumEntries(values_6());
    return $ENTRIES_6;
  }
  var Gana_entriesInitialized;
  function Gana_initEntries() {
    if (Gana_entriesInitialized)
      return Unit_getInstance();
    Gana_entriesInitialized = true;
    Gana_Deva_instance = new Gana('Deva', 0, '\u5929\u795E');
    Gana_Manushya_instance = new Gana('Manushya', 1, '\u4EBA\u7C7B');
    Gana_Rakshasa_instance = new Gana('Rakshasa', 2, '\u7F57\u5239');
  }
  var $ENTRIES_6;
  function Gana(name, ordinal, displayName) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
  }
  protoOf(Gana).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  function gana(_this__u8e3s4) {
    _init_properties_KpEngine_kt__5b306f();
    switch (_this__u8e3s4.get_ordinal_ip24qg_k$()) {
      case 0:
      case 4:
      case 6:
      case 7:
      case 12:
      case 14:
      case 16:
      case 21:
      case 26:
        return Gana_Deva_getInstance();
      case 1:
      case 3:
      case 5:
      case 10:
      case 11:
      case 19:
      case 20:
      case 24:
      case 25:
        return Gana_Manushya_getInstance();
      default:
        return Gana_Rakshasa_getInstance();
    }
  }
  var Dignity_Exalted_instance;
  var Dignity_Moolatrikona_instance;
  var Dignity_OwnSign_instance;
  var Dignity_GreatFriend_instance;
  var Dignity_Friend_instance;
  var Dignity_Neutral_instance;
  var Dignity_Enemy_instance;
  var Dignity_GreatEnemy_instance;
  var Dignity_Debilitated_instance;
  function values_7() {
    return [Dignity_Exalted_getInstance(), Dignity_Moolatrikona_getInstance(), Dignity_OwnSign_getInstance(), Dignity_GreatFriend_getInstance(), Dignity_Friend_getInstance(), Dignity_Neutral_getInstance(), Dignity_Enemy_getInstance(), Dignity_GreatEnemy_getInstance(), Dignity_Debilitated_getInstance()];
  }
  function valueOf_7(value) {
    switch (value) {
      case 'Exalted':
        return Dignity_Exalted_getInstance();
      case 'Moolatrikona':
        return Dignity_Moolatrikona_getInstance();
      case 'OwnSign':
        return Dignity_OwnSign_getInstance();
      case 'GreatFriend':
        return Dignity_GreatFriend_getInstance();
      case 'Friend':
        return Dignity_Friend_getInstance();
      case 'Neutral':
        return Dignity_Neutral_getInstance();
      case 'Enemy':
        return Dignity_Enemy_getInstance();
      case 'GreatEnemy':
        return Dignity_GreatEnemy_getInstance();
      case 'Debilitated':
        return Dignity_Debilitated_getInstance();
      default:
        Dignity_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_7() {
    if ($ENTRIES_7 == null)
      $ENTRIES_7 = enumEntries(values_7());
    return $ENTRIES_7;
  }
  var Dignity_entriesInitialized;
  function Dignity_initEntries() {
    if (Dignity_entriesInitialized)
      return Unit_getInstance();
    Dignity_entriesInitialized = true;
    Dignity_Exalted_instance = new Dignity('Exalted', 0, '\u5E99\u65FA', 5);
    Dignity_Moolatrikona_instance = new Dignity('Moolatrikona', 1, '\u672C\u6E90', 4);
    Dignity_OwnSign_instance = new Dignity('OwnSign', 2, '\u5165\u5E99', 3);
    Dignity_GreatFriend_instance = new Dignity('GreatFriend', 3, '\u631A\u53CB\u5BAB', 2);
    Dignity_Friend_instance = new Dignity('Friend', 4, '\u53CB\u5BAB', 1);
    Dignity_Neutral_instance = new Dignity('Neutral', 5, '\u4E2D\u6027', 0);
    Dignity_Enemy_instance = new Dignity('Enemy', 6, '\u654C\u5BAB', -1);
    Dignity_GreatEnemy_instance = new Dignity('GreatEnemy', 7, '\u5927\u654C\u5BAB', -2);
    Dignity_Debilitated_instance = new Dignity('Debilitated', 8, '\u843D\u9677', -3);
  }
  var $ENTRIES_7;
  function Dignity(name, ordinal, displayName, strength) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.strength_1 = strength;
  }
  protoOf(Dignity).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(Dignity).get_strength_26fmd2_k$ = function () {
    return this.strength_1;
  };
  function planetDignity(planet, signIdx) {
    _init_properties_KpEngine_kt__5b306f();
    var exaltedSign;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        exaltedSign = 0;
        break;
      case 1:
        exaltedSign = 1;
        break;
      case 2:
        exaltedSign = 9;
        break;
      case 3:
        exaltedSign = 5;
        break;
      case 4:
        exaltedSign = 3;
        break;
      case 5:
        exaltedSign = 11;
        break;
      case 6:
        exaltedSign = 6;
        break;
      case 7:
        exaltedSign = 1;
        break;
      case 8:
        exaltedSign = 6;
        break;
      default:
        exaltedSign = -1;
        break;
    }
    var debilitatedSign;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        debilitatedSign = 6;
        break;
      case 1:
        debilitatedSign = 7;
        break;
      case 2:
        debilitatedSign = 2;
        break;
      case 3:
        debilitatedSign = 11;
        break;
      case 4:
        debilitatedSign = 9;
        break;
      case 5:
        debilitatedSign = 5;
        break;
      case 6:
        debilitatedSign = 0;
        break;
      case 7:
        debilitatedSign = 6;
        break;
      case 8:
        debilitatedSign = 0;
        break;
      default:
        debilitatedSign = -1;
        break;
    }
    var ownSigns_0;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        ownSigns_0 = listOf_0(4);
        break;
      case 1:
        ownSigns_0 = listOf_0(3);
        break;
      case 2:
        ownSigns_0 = listOf([0, 7]);
        break;
      case 3:
        ownSigns_0 = listOf([2, 5]);
        break;
      case 4:
        ownSigns_0 = listOf([8, 11]);
        break;
      case 5:
        ownSigns_0 = listOf([1, 6]);
        break;
      case 6:
        ownSigns_0 = listOf([9, 10]);
        break;
      default:
        ownSigns_0 = emptyList();
        break;
    }
    var moolatrikonaSigns;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        moolatrikonaSigns = listOf_0(0);
        break;
      case 1:
        moolatrikonaSigns = listOf_0(2);
        break;
      case 2:
        moolatrikonaSigns = listOf_0(0);
        break;
      case 3:
        moolatrikonaSigns = listOf_0(5);
        break;
      case 4:
        moolatrikonaSigns = listOf_0(8);
        break;
      case 5:
        moolatrikonaSigns = listOf_0(5);
        break;
      case 6:
        moolatrikonaSigns = listOf_0(10);
        break;
      default:
        moolatrikonaSigns = emptyList();
        break;
    }
    var friends;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        friends = listOf([Planet_Moon_getInstance(), Planet_Mars_getInstance(), Planet_Jupiter_getInstance()]);
        break;
      case 1:
        friends = listOf([Planet_Sun_getInstance(), Planet_Mercury_getInstance()]);
        break;
      case 2:
        friends = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Jupiter_getInstance()]);
        break;
      case 3:
        friends = listOf([Planet_Sun_getInstance(), Planet_Venus_getInstance()]);
        break;
      case 4:
        friends = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance()]);
        break;
      case 5:
        friends = listOf([Planet_Mercury_getInstance(), Planet_Saturn_getInstance()]);
        break;
      case 6:
        friends = listOf([Planet_Mercury_getInstance(), Planet_Venus_getInstance()]);
        break;
      case 7:
        friends = listOf([Planet_Mercury_getInstance(), Planet_Venus_getInstance(), Planet_Saturn_getInstance()]);
        break;
      case 8:
        friends = listOf([Planet_Mars_getInstance(), Planet_Sun_getInstance(), Planet_Jupiter_getInstance()]);
        break;
      default:
        friends = emptyList();
        break;
    }
    var enemies;
    switch (planet.get_ordinal_ip24qg_k$()) {
      case 0:
        enemies = listOf([Planet_Venus_getInstance(), Planet_Saturn_getInstance()]);
        break;
      case 1:
        enemies = emptyList();
        break;
      case 2:
        enemies = listOf([Planet_Mercury_getInstance(), Planet_Venus_getInstance()]);
        break;
      case 3:
        enemies = listOf_0(Planet_Moon_getInstance());
        break;
      case 4:
        enemies = listOf([Planet_Mercury_getInstance(), Planet_Venus_getInstance()]);
        break;
      case 5:
        enemies = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance()]);
        break;
      case 6:
        enemies = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance()]);
        break;
      case 7:
        enemies = listOf([Planet_Sun_getInstance(), Planet_Moon_getInstance(), Planet_Mars_getInstance(), Planet_Jupiter_getInstance()]);
        break;
      case 8:
        enemies = listOf([Planet_Venus_getInstance(), Planet_Saturn_getInstance(), Planet_Mercury_getInstance()]);
        break;
      default:
        enemies = emptyList();
        break;
    }
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = get_entries_0().iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.planetDignity.<anonymous>' call
        if (!element.equals(planet) && ownSigns(element).contains_aljjnj_k$(signIdx)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var signPlanet = tmp$ret$1;
    return exaltedSign === signIdx ? Dignity_Exalted_getInstance() : moolatrikonaSigns.contains_aljjnj_k$(signIdx) ? Dignity_Moolatrikona_getInstance() : ownSigns_0.contains_aljjnj_k$(signIdx) ? Dignity_OwnSign_getInstance() : debilitatedSign === signIdx ? Dignity_Debilitated_getInstance() : !(signPlanet == null) && friends.contains_aljjnj_k$(signPlanet) ? Dignity_GreatFriend_getInstance() : !(signPlanet == null) && enemies.contains_aljjnj_k$(signPlanet) ? Dignity_GreatEnemy_getInstance() : !(signPlanet == null) ? Dignity_Neutral_getInstance() : Dignity_Neutral_getInstance();
  }
  function ownSigns(p) {
    _init_properties_KpEngine_kt__5b306f();
    switch (p.get_ordinal_ip24qg_k$()) {
      case 0:
        return listOf_0(4);
      case 1:
        return listOf_0(3);
      case 2:
        return listOf([0, 7]);
      case 3:
        return listOf([2, 5]);
      case 4:
        return listOf([8, 11]);
      case 5:
        return listOf([1, 6]);
      case 6:
        return listOf([9, 10]);
      default:
        return emptyList();
    }
  }
  var DashaLevel_Mahadasha_instance;
  var DashaLevel_Antardasha_instance;
  var DashaLevel_Pratyantardasha_instance;
  var DashaLevel_Sookshmadasha_instance;
  var DashaLevel_Pranadasha_instance;
  function values_8() {
    return [DashaLevel_Mahadasha_getInstance(), DashaLevel_Antardasha_getInstance(), DashaLevel_Pratyantardasha_getInstance(), DashaLevel_Sookshmadasha_getInstance(), DashaLevel_Pranadasha_getInstance()];
  }
  function valueOf_8(value) {
    switch (value) {
      case 'Mahadasha':
        return DashaLevel_Mahadasha_getInstance();
      case 'Antardasha':
        return DashaLevel_Antardasha_getInstance();
      case 'Pratyantardasha':
        return DashaLevel_Pratyantardasha_getInstance();
      case 'Sookshmadasha':
        return DashaLevel_Sookshmadasha_getInstance();
      case 'Pranadasha':
        return DashaLevel_Pranadasha_getInstance();
      default:
        DashaLevel_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_8() {
    if ($ENTRIES_8 == null)
      $ENTRIES_8 = enumEntries(values_8());
    return $ENTRIES_8;
  }
  var DashaLevel_entriesInitialized;
  function DashaLevel_initEntries() {
    if (DashaLevel_entriesInitialized)
      return Unit_getInstance();
    DashaLevel_entriesInitialized = true;
    DashaLevel_Mahadasha_instance = new DashaLevel('Mahadasha', 0, '\u5927\u8FD0');
    DashaLevel_Antardasha_instance = new DashaLevel('Antardasha', 1, '\u5C0F\u8FD0');
    DashaLevel_Pratyantardasha_instance = new DashaLevel('Pratyantardasha', 2, '\u8FC7\u8FD0');
    DashaLevel_Sookshmadasha_instance = new DashaLevel('Sookshmadasha', 3, '\u5FAE\u8FD0');
    DashaLevel_Pranadasha_instance = new DashaLevel('Pranadasha', 4, '\u6C14\u8FD0');
  }
  var $ENTRIES_8;
  function DashaLevel(name, ordinal, displayName) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
  }
  protoOf(DashaLevel).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  function get_YEAR_IN_DAYS() {
    return YEAR_IN_DAYS;
  }
  var YEAR_IN_DAYS;
  function DashaPeriod(lord, startJd, endJd, level, subPeriods) {
    this.lord_1 = lord;
    this.startJd_1 = startJd;
    this.endJd_1 = endJd;
    this.level_1 = level;
    this.subPeriods_1 = subPeriods;
  }
  protoOf(DashaPeriod).get_lord_wopz5q_k$ = function () {
    return this.lord_1;
  };
  protoOf(DashaPeriod).get_startJd_u3zc19_k$ = function () {
    return this.startJd_1;
  };
  protoOf(DashaPeriod).get_endJd_iqx07g_k$ = function () {
    return this.endJd_1;
  };
  protoOf(DashaPeriod).get_level_ium7h7_k$ = function () {
    return this.level_1;
  };
  protoOf(DashaPeriod).get_subPeriods_f4n1tn_k$ = function () {
    return this.subPeriods_1;
  };
  protoOf(DashaPeriod).component1_7eebsc_k$ = function () {
    return this.lord_1;
  };
  protoOf(DashaPeriod).component2_7eebsb_k$ = function () {
    return this.startJd_1;
  };
  protoOf(DashaPeriod).component3_7eebsa_k$ = function () {
    return this.endJd_1;
  };
  protoOf(DashaPeriod).component4_7eebs9_k$ = function () {
    return this.level_1;
  };
  protoOf(DashaPeriod).component5_7eebs8_k$ = function () {
    return this.subPeriods_1;
  };
  protoOf(DashaPeriod).copy_rkqhd3_k$ = function (lord, startJd, endJd, level, subPeriods) {
    return new DashaPeriod(lord, startJd, endJd, level, subPeriods);
  };
  protoOf(DashaPeriod).copy$default_twfm1g_k$ = function (lord, startJd, endJd, level, subPeriods, $super) {
    lord = lord === VOID ? this.lord_1 : lord;
    startJd = startJd === VOID ? this.startJd_1 : startJd;
    endJd = endJd === VOID ? this.endJd_1 : endJd;
    level = level === VOID ? this.level_1 : level;
    subPeriods = subPeriods === VOID ? this.subPeriods_1 : subPeriods;
    return $super === VOID ? this.copy_rkqhd3_k$(lord, startJd, endJd, level, subPeriods) : $super.copy_rkqhd3_k$.call(this, lord, startJd, endJd, level, subPeriods);
  };
  protoOf(DashaPeriod).toString = function () {
    return 'DashaPeriod(lord=' + this.lord_1.toString() + ', startJd=' + this.startJd_1 + ', endJd=' + this.endJd_1 + ', level=' + this.level_1.toString() + ', subPeriods=' + toString(this.subPeriods_1) + ')';
  };
  protoOf(DashaPeriod).hashCode = function () {
    var result = this.lord_1.hashCode();
    result = imul(result, 31) + getNumberHashCode(this.startJd_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.endJd_1) | 0;
    result = imul(result, 31) + this.level_1.hashCode() | 0;
    result = imul(result, 31) + hashCode(this.subPeriods_1) | 0;
    return result;
  };
  protoOf(DashaPeriod).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof DashaPeriod))
      return false;
    var tmp0_other_with_cast = other instanceof DashaPeriod ? other : THROW_CCE();
    if (!this.lord_1.equals(tmp0_other_with_cast.lord_1))
      return false;
    if (!equals(this.startJd_1, tmp0_other_with_cast.startJd_1))
      return false;
    if (!equals(this.endJd_1, tmp0_other_with_cast.endJd_1))
      return false;
    if (!this.level_1.equals(tmp0_other_with_cast.level_1))
      return false;
    if (!equals(this.subPeriods_1, tmp0_other_with_cast.subPeriods_1))
      return false;
    return true;
  };
  function vimshottariDasha(moonSiderealDeg, birthJd, depth) {
    depth = depth === VOID ? DashaLevel_Pratyantardasha_getInstance() : depth;
    _init_properties_KpEngine_kt__5b306f();
    var nak = Companion_getInstance_1().fromLongitudeDeg_qpnd6t_k$(moonSiderealDeg);
    var startingLord = nak.lord_1;
    var posInNak = (moonSiderealDeg % 360.0 + 360.0) % 360.0 % get_NAKSHATRA_SPAN();
    var elapsedFraction = posInNak / get_NAKSHATRA_SPAN();
    var remainingFraction = 1.0 - elapsedFraction;
    var startIdx = Companion_getInstance().SEQUENCE_1.indexOf_si1fv9_k$(startingLord);
    // Inline function 'kotlin.collections.mutableListOf' call
    var periods = ArrayList_init_$Create$();
    var currentJd = birthJd;
    var inductionVariable = 0;
    if (inductionVariable < 9)
      do {
        var cycle = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var lordIdx = (startIdx + cycle | 0) % 9 | 0;
        var lord = Companion_getInstance().SEQUENCE_1.get_c1px32_k$(lordIdx);
        var fullYears = lord.vimshottariYears_1;
        var years = cycle === 0 ? fullYears * remainingFraction : fullYears;
        var endJd = currentJd + years * 365.25;
        var tmp;
        if (depth.get_ordinal_ip24qg_k$() > DashaLevel_Mahadasha_getInstance().get_ordinal_ip24qg_k$()) {
          tmp = computeSubPeriods(lord, currentJd, endJd, DashaLevel_Antardasha_getInstance(), depth);
        } else {
          tmp = emptyList();
        }
        var subPeriods = tmp;
        periods.add_utx5q5_k$(new DashaPeriod(lord, currentJd, endJd, DashaLevel_Mahadasha_getInstance(), subPeriods));
        currentJd = endJd;
      }
       while (inductionVariable < 9);
    return periods;
  }
  function computeSubPeriods(parentLord, startJd, endJd, currentLevel, targetDepth) {
    _init_properties_KpEngine_kt__5b306f();
    var totalDuration = endJd - startJd;
    var startIdx = Companion_getInstance().SEQUENCE_1.indexOf_si1fv9_k$(parentLord);
    // Inline function 'kotlin.collections.mutableListOf' call
    var subPeriods = ArrayList_init_$Create$();
    var currentJd = startJd;
    var inductionVariable = 0;
    if (inductionVariable < 9)
      do {
        var cycle = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var lordIdx = (startIdx + cycle | 0) % 9 | 0;
        var lord = Companion_getInstance().SEQUENCE_1.get_c1px32_k$(lordIdx);
        var fraction = lord.vimshottariYears_1 / 120.0;
        var duration = totalDuration * fraction;
        var end = currentJd + duration;
        var tmp;
        if (targetDepth.get_ordinal_ip24qg_k$() > currentLevel.get_ordinal_ip24qg_k$()) {
          tmp = computeSubPeriods(lord, currentJd, end, nextLevel(currentLevel), targetDepth);
        } else {
          tmp = emptyList();
        }
        var children = tmp;
        subPeriods.add_utx5q5_k$(new DashaPeriod(lord, currentJd, end, currentLevel, children));
        currentJd = end;
      }
       while (inductionVariable < 9);
    return subPeriods;
  }
  function nextLevel(current) {
    _init_properties_KpEngine_kt__5b306f();
    var tmp;
    switch (current.get_ordinal_ip24qg_k$()) {
      case 0:
        tmp = DashaLevel_Antardasha_getInstance();
        break;
      case 1:
        tmp = DashaLevel_Pratyantardasha_getInstance();
        break;
      case 2:
        tmp = DashaLevel_Sookshmadasha_getInstance();
        break;
      case 3:
        tmp = DashaLevel_Pranadasha_getInstance();
        break;
      case 4:
        tmp = DashaLevel_Pranadasha_getInstance();
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function findCurrentDasha(periods, jd) {
    _init_properties_KpEngine_kt__5b306f();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = periods.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.findCurrentDasha.<anonymous>' call
        if (jd >= element.startJd_1 && jd < element.endJd_1) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    return tmp$ret$1;
  }
  function jdToDate(jd) {
    _init_properties_KpEngine_kt__5b306f();
    var jd0 = jd + 0.5;
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$0 = Math.floor(jd0);
    var z = numberToLong(tmp$ret$0);
    var f = jd0 - z.toDouble_ygsx0s_k$();
    var tmp;
    if (z.compareTo_9jj042_k$(new Long(2299161, 0)) < 0) {
      tmp = z;
    } else {
      // Inline function 'kotlin.math.floor' call
      // Inline function 'kotlin.Long.minus' call
      var other = 1867216.25;
      var x = (z.toDouble_ygsx0s_k$() - other) / 36524.25;
      var tmp$ret$2 = Math.floor(x);
      var alpha = numberToLong(tmp$ret$2);
      // Inline function 'kotlin.Long.plus' call
      var tmp_0 = z.plus_r93sks_k$(toLong(1)).plus_r93sks_k$(alpha);
      // Inline function 'kotlin.Long.div' call
      var tmp$ret$4 = alpha.div_jun7gj_k$(toLong(4));
      tmp = tmp_0.minus_mfbszm_k$(tmp$ret$4);
    }
    var a = tmp;
    // Inline function 'kotlin.Long.plus' call
    var b = a.plus_r93sks_k$(toLong(1524));
    // Inline function 'kotlin.math.floor' call
    // Inline function 'kotlin.Long.minus' call
    var x_0 = (b.toDouble_ygsx0s_k$() - 122.1) / 365.25;
    var tmp$ret$7 = Math.floor(x_0);
    var c = numberToLong(tmp$ret$7);
    // Inline function 'kotlin.math.floor' call
    var x_1 = 365.25 * c.toDouble_ygsx0s_k$();
    var tmp$ret$8 = Math.floor(x_1);
    var d = numberToLong(tmp$ret$8);
    // Inline function 'kotlin.math.floor' call
    // Inline function 'kotlin.Long.div' call
    var x_2 = b.minus_mfbszm_k$(d).toDouble_ygsx0s_k$() / 30.6001;
    var tmp$ret$10 = Math.floor(x_2);
    var e = numberToLong(tmp$ret$10);
    var tmp_1 = b.minus_mfbszm_k$(d);
    // Inline function 'kotlin.math.floor' call
    var x_3 = 30.6001 * e.toDouble_ygsx0s_k$();
    var tmp$ret$11 = Math.floor(x_3);
    var day = tmp_1.minus_mfbszm_k$(numberToLong(tmp$ret$11));
    var tmp_2;
    if (e.compareTo_9jj042_k$(new Long(14, 0)) < 0) {
      // Inline function 'kotlin.Long.minus' call
      tmp_2 = e.minus_mfbszm_k$(toLong(1));
    } else {
      // Inline function 'kotlin.Long.minus' call
      tmp_2 = e.minus_mfbszm_k$(toLong(13));
    }
    var month = tmp_2;
    var tmp_3;
    if (month.compareTo_9jj042_k$(new Long(2, 0)) > 0) {
      // Inline function 'kotlin.Long.minus' call
      tmp_3 = c.minus_mfbszm_k$(toLong(4716));
    } else {
      // Inline function 'kotlin.Long.minus' call
      tmp_3 = c.minus_mfbszm_k$(toLong(4715));
    }
    var year = tmp_3;
    var dayInt = day.toInt_1tsl84_k$() + (f * 24.0 >= 12.0 ? 0 : 0) | 0;
    return new Triple(year.toInt_1tsl84_k$(), month.toInt_1tsl84_k$(), day.toInt_1tsl84_k$());
  }
  function jdToDateStr(jd) {
    _init_properties_KpEngine_kt__5b306f();
    var _destruct__k2r9zo = jdToDate(jd);
    var y = _destruct__k2r9zo.component1_7eebsc_k$();
    var m = _destruct__k2r9zo.component2_7eebsb_k$();
    var d = _destruct__k2r9zo.component3_7eebsa_k$();
    return '' + y + '-' + padStart(m.toString(), 2, _Char___init__impl__6a9atx(48)) + '-' + padStart(d.toString(), 2, _Char___init__impl__6a9atx(48));
  }
  function kpHoraryChart(kpNum, jd, latDeg, lonDeg, ayanamsaDeg, houseSystem) {
    houseSystem = houseSystem === VOID ? HouseSystem_Placidus_getInstance() : houseSystem;
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(1 <= kpNum ? kpNum <= 249 : false)) {
      // Inline function 'kp.astro.kpHoraryChart.<anonymous>' call
      var message = 'KP Horary number must be 1..249';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var moonDeg = kpNumberToMidDegree(kpNum);
    var lst = localSiderealTime(jd, lonDeg);
    var ascTropical = computeAscendant(jd, latDeg, lst);
    var ascSidereal = ((ascTropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0;
    var mcTropical = computeMC(jd, lst);
    var mcSidereal = ((mcTropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0;
    var cusps = computeCusps(ascSidereal, mcSidereal, houseSystem);
    // Inline function 'kotlin.collections.map' call
    var this_0 = Companion_getInstance_0().VEDIC_NINE_1;
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var tmp0_iterator = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'kp.astro.kpHoraryChart.<anonymous>' call
      var tmp;
      if (item.equals(Planet_Moon_getInstance())) {
        tmp = moonDeg;
      } else {
        var tropical = analyticalPlanetLongitude(item, jd);
        tmp = ((tropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0;
      }
      var sidereal = tmp;
      var tmp$ret$1 = to(item, sidereal);
      destination.add_utx5q5_k$(tmp$ret$1);
    }
    var planets = destination;
    return new Pair(cusps, planets);
  }
  var AyanamsaType_KP_instance;
  var AyanamsaType_Lahiri_instance;
  var AyanamsaType_Raman_instance;
  var AyanamsaType_FaganBradley_instance;
  var AyanamsaType_TrueChitra_instance;
  var AyanamsaType_Custom_instance;
  function values_9() {
    return [AyanamsaType_KP_getInstance(), AyanamsaType_Lahiri_getInstance(), AyanamsaType_Raman_getInstance(), AyanamsaType_FaganBradley_getInstance(), AyanamsaType_TrueChitra_getInstance(), AyanamsaType_Custom_getInstance()];
  }
  function valueOf_9(value) {
    switch (value) {
      case 'KP':
        return AyanamsaType_KP_getInstance();
      case 'Lahiri':
        return AyanamsaType_Lahiri_getInstance();
      case 'Raman':
        return AyanamsaType_Raman_getInstance();
      case 'FaganBradley':
        return AyanamsaType_FaganBradley_getInstance();
      case 'TrueChitra':
        return AyanamsaType_TrueChitra_getInstance();
      case 'Custom':
        return AyanamsaType_Custom_getInstance();
      default:
        AyanamsaType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_9() {
    if ($ENTRIES_9 == null)
      $ENTRIES_9 = enumEntries(values_9());
    return $ENTRIES_9;
  }
  var AyanamsaType_entriesInitialized;
  function AyanamsaType_initEntries() {
    if (AyanamsaType_entriesInitialized)
      return Unit_getInstance();
    AyanamsaType_entriesInitialized = true;
    AyanamsaType_KP_instance = new AyanamsaType('KP', 0, 'KP\uFF08Krishnamurti \u514B\u91CC\u5E0C\u90A3\u7A46\u63D0\uFF09');
    AyanamsaType_Lahiri_instance = new AyanamsaType('Lahiri', 1, 'Lahiri / Chitrapaksha\uFF08\u62C9\u5E0C\u91CC \u6052\u661F\u9EC4\u9053\uFF09');
    AyanamsaType_Raman_instance = new AyanamsaType('Raman', 2, 'Raman\uFF08\u62C9\u66FC\uFF09');
    AyanamsaType_FaganBradley_instance = new AyanamsaType('FaganBradley', 3, 'Fagan-Bradley\uFF08\u8D39\u6839-\u5E03\u62C9\u5FB7\u5229\uFF09');
    AyanamsaType_TrueChitra_instance = new AyanamsaType('TrueChitra', 4, 'True Chitra\uFF08\u771F\u5B9E\u6444\u63D0\uFF09');
    AyanamsaType_Custom_instance = new AyanamsaType('Custom', 5, '\u81EA\u5B9A\u4E49');
  }
  var $ENTRIES_9;
  function AyanamsaType(name, ordinal, displayName) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
  }
  protoOf(AyanamsaType).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  function computeAyanamsa(type, jd, customValue) {
    customValue = customValue === VOID ? 0.0 : customValue;
    _init_properties_KpEngine_kt__5b306f();
    if (type.equals(AyanamsaType_Custom_getInstance()))
      return customValue;
    var tt = (jd - 2451545.0) / 36525.0;
    var precessionRate = 50.2875 / 3600.0;
    var yearsSince2000 = tt * 100.0;
    var tmp;
    switch (type.get_ordinal_ip24qg_k$()) {
      case 1:
        tmp = 23.85 + precessionRate * yearsSince2000;
        break;
      case 0:
        tmp = 23.84 + precessionRate * yearsSince2000;
        break;
      case 2:
        var yearsSince1900 = (jd - 2415020.5) / 365.25;
        tmp = 21.9 + precessionRate * yearsSince1900;
        break;
      case 3:
        var yearsSince1900_0 = (jd - 2415020.5) / 365.25;
        tmp = 24.5 + precessionRate * yearsSince1900_0;
        break;
      case 4:
        tmp = 23.85 + precessionRate * yearsSince2000;
        break;
      case 5:
        tmp = customValue;
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function sam$kotlin_Comparator$0(function_0) {
    this.function_1 = function_0;
  }
  protoOf(sam$kotlin_Comparator$0).compare_bczr_k$ = function (a, b) {
    return this.function_1(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).compare = function (a, b) {
    return this.compare_bczr_k$(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).getFunctionDelegate_jtodtf_k$ = function () {
    return this.function_1;
  };
  protoOf(sam$kotlin_Comparator$0).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, Comparator) : false) {
      var tmp_0;
      if (!(other == null) ? isInterface(other, FunctionAdapter) : false) {
        tmp_0 = equals(this.getFunctionDelegate_jtodtf_k$(), other.getFunctionDelegate_jtodtf_k$());
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(sam$kotlin_Comparator$0).hashCode = function () {
    return hashCode(this.getFunctionDelegate_jtodtf_k$());
  };
  function sam$kotlin_Comparator$0_0(function_0) {
    this.function_1 = function_0;
  }
  protoOf(sam$kotlin_Comparator$0_0).compare_bczr_k$ = function (a, b) {
    return this.function_1(a, b);
  };
  protoOf(sam$kotlin_Comparator$0_0).compare = function (a, b) {
    return this.compare_bczr_k$(a, b);
  };
  protoOf(sam$kotlin_Comparator$0_0).getFunctionDelegate_jtodtf_k$ = function () {
    return this.function_1;
  };
  protoOf(sam$kotlin_Comparator$0_0).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, Comparator) : false) {
      var tmp_0;
      if (!(other == null) ? isInterface(other, FunctionAdapter) : false) {
        tmp_0 = equals(this.getFunctionDelegate_jtodtf_k$(), other.getFunctionDelegate_jtodtf_k$());
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(sam$kotlin_Comparator$0_0).hashCode = function () {
    return hashCode(this.getFunctionDelegate_jtodtf_k$());
  };
  function kpSegmentStarts$delegate$lambda() {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.collections.mutableListOf' call
    var raw = ArrayList_init_$Create$();
    var degree = 0.0;
    var inductionVariable = 0;
    if (inductionVariable < 27)
      do {
        var nakIdx = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var starLord = Companion_getInstance_1().ALL_1.get_c1px32_k$(nakIdx).lord_1;
        var startIdx = Companion_getInstance().SEQUENCE_1.indexOf_si1fv9_k$(starLord);
        var inductionVariable_0 = 0;
        if (inductionVariable_0 < 9)
          do {
            var subI = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var dlIdx = (startIdx + subI | 0) % 9 | 0;
            var span = get_SUB_SPANS().get_c1px32_k$(dlIdx).get_second_jf7fjx_k$();
            var start = degree;
            var end = degree + span;
            raw.add_utx5q5_k$(to(start, end));
            degree = end;
          }
           while (inductionVariable_0 < 9);
      }
       while (inductionVariable < 27);
    var eps = 1.0E-6;
    var snap = kpSegmentStarts$delegate$lambda$lambda(eps);
    // Inline function 'kotlin.collections.mutableListOf' call
    var starts = ArrayList_init_$Create$();
    var _iterator__ex2g4s = raw.iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var _destruct__k2r9zo = _iterator__ex2g4s.next_20eer_k$();
      var s = _destruct__k2r9zo.component1_7eebsc_k$();
      var e = _destruct__k2r9zo.component2_7eebsb_k$();
      var ss = snap(s);
      starts.add_utx5q5_k$(ss);
      // Inline function 'kotlin.Long.times' call
      // Inline function 'kotlin.Long.plus' call
      // Inline function 'kotlin.math.floor' call
      var x = ss / 30.0;
      var tmp$ret$2 = Math.floor(x);
      var b = numberToLong(tmp$ret$2).plus_r93sks_k$(toLong(1)).times_nfzjiw_k$(toLong(30));
      while (b.toDouble_ygsx0s_k$() < e - eps) {
        if (b.toDouble_ygsx0s_k$() > s + eps) {
          starts.add_utx5q5_k$(b.toDouble_ygsx0s_k$());
        }
        // Inline function 'kotlin.Long.plus' call
        b = b.plus_r93sks_k$(toLong(30));
      }
    }
    return starts;
  }
  function kpSegmentStarts$delegate$lambda$lambda($eps) {
    return function (x) {
      var nearestBoundary = round(x / 30.0) * 30.0;
      var tmp;
      // Inline function 'kotlin.math.abs' call
      var x_0 = x - nearestBoundary;
      if (Math.abs(x_0) < $eps) {
        tmp = nearestBoundary;
      } else {
        tmp = x;
      }
      return tmp;
    };
  }
  function rulingPlanetsWithStrength$lambda(a, b) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.comparisons.compareValuesBy' call
    // Inline function 'kp.astro.rulingPlanetsWithStrength.<anonymous>' call
    var tmp = b.get_second_jf7fjx_k$();
    // Inline function 'kp.astro.rulingPlanetsWithStrength.<anonymous>' call
    var tmp$ret$1 = a.get_second_jf7fjx_k$();
    return compareValues(tmp, tmp$ret$1);
  }
  function rulingPlanetsWithAgents$lambda(a, b) {
    _init_properties_KpEngine_kt__5b306f();
    // Inline function 'kotlin.comparisons.compareValuesBy' call
    // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
    var tmp = b.get_second_jf7fjx_k$();
    // Inline function 'kp.astro.rulingPlanetsWithAgents.<anonymous>' call
    var tmp$ret$1 = a.get_second_jf7fjx_k$();
    return compareValues(tmp, tmp$ret$1);
  }
  function DashaLord_Ketu_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Ketu_instance;
  }
  function DashaLord_Venus_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Venus_instance;
  }
  function DashaLord_Sun_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Sun_instance;
  }
  function DashaLord_Moon_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Moon_instance;
  }
  function DashaLord_Mars_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Mars_instance;
  }
  function DashaLord_Rahu_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Rahu_instance;
  }
  function DashaLord_Jupiter_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Jupiter_instance;
  }
  function DashaLord_Saturn_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Saturn_instance;
  }
  function DashaLord_Mercury_getInstance() {
    DashaLord_initEntries();
    return DashaLord_Mercury_instance;
  }
  function Planet_Sun_getInstance() {
    Planet_initEntries();
    return Planet_Sun_instance;
  }
  function Planet_Moon_getInstance() {
    Planet_initEntries();
    return Planet_Moon_instance;
  }
  function Planet_Mars_getInstance() {
    Planet_initEntries();
    return Planet_Mars_instance;
  }
  function Planet_Mercury_getInstance() {
    Planet_initEntries();
    return Planet_Mercury_instance;
  }
  function Planet_Jupiter_getInstance() {
    Planet_initEntries();
    return Planet_Jupiter_instance;
  }
  function Planet_Venus_getInstance() {
    Planet_initEntries();
    return Planet_Venus_instance;
  }
  function Planet_Saturn_getInstance() {
    Planet_initEntries();
    return Planet_Saturn_instance;
  }
  function Planet_Rahu_getInstance() {
    Planet_initEntries();
    return Planet_Rahu_instance;
  }
  function Planet_Ketu_getInstance() {
    Planet_initEntries();
    return Planet_Ketu_instance;
  }
  function Planet_Uranus_getInstance() {
    Planet_initEntries();
    return Planet_Uranus_instance;
  }
  function Planet_Neptune_getInstance() {
    Planet_initEntries();
    return Planet_Neptune_instance;
  }
  function Planet_Pluto_getInstance() {
    Planet_initEntries();
    return Planet_Pluto_instance;
  }
  function Nakshatra_Ashwini_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Ashwini_instance;
  }
  function Nakshatra_Bharani_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Bharani_instance;
  }
  function Nakshatra_Krittika_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Krittika_instance;
  }
  function Nakshatra_Rohini_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Rohini_instance;
  }
  function Nakshatra_Mrigashira_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Mrigashira_instance;
  }
  function Nakshatra_Ardra_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Ardra_instance;
  }
  function Nakshatra_Punarvasu_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Punarvasu_instance;
  }
  function Nakshatra_Pushya_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Pushya_instance;
  }
  function Nakshatra_Ashlesha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Ashlesha_instance;
  }
  function Nakshatra_Magha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Magha_instance;
  }
  function Nakshatra_PurvaPhalguni_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_PurvaPhalguni_instance;
  }
  function Nakshatra_UttaraPhalguni_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_UttaraPhalguni_instance;
  }
  function Nakshatra_Hasta_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Hasta_instance;
  }
  function Nakshatra_Chitra_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Chitra_instance;
  }
  function Nakshatra_Swati_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Swati_instance;
  }
  function Nakshatra_Vishakha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Vishakha_instance;
  }
  function Nakshatra_Anuradha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Anuradha_instance;
  }
  function Nakshatra_Jyeshtha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Jyeshtha_instance;
  }
  function Nakshatra_Mula_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Mula_instance;
  }
  function Nakshatra_PurvaAshadha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_PurvaAshadha_instance;
  }
  function Nakshatra_UttaraAshadha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_UttaraAshadha_instance;
  }
  function Nakshatra_Shravana_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Shravana_instance;
  }
  function Nakshatra_Dhanishta_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Dhanishta_instance;
  }
  function Nakshatra_Shatabhisha_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Shatabhisha_instance;
  }
  function Nakshatra_PurvaBhadrapada_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_PurvaBhadrapada_instance;
  }
  function Nakshatra_UttaraBhadrapada_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_UttaraBhadrapada_instance;
  }
  function Nakshatra_Revati_getInstance() {
    Nakshatra_initEntries();
    return Nakshatra_Revati_instance;
  }
  function ZodiacSign_Aries_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Aries_instance;
  }
  function ZodiacSign_Taurus_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Taurus_instance;
  }
  function ZodiacSign_Gemini_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Gemini_instance;
  }
  function ZodiacSign_Cancer_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Cancer_instance;
  }
  function ZodiacSign_Leo_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Leo_instance;
  }
  function ZodiacSign_Virgo_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Virgo_instance;
  }
  function ZodiacSign_Libra_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Libra_instance;
  }
  function ZodiacSign_Scorpio_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Scorpio_instance;
  }
  function ZodiacSign_Sagittarius_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Sagittarius_instance;
  }
  function ZodiacSign_Capricorn_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Capricorn_instance;
  }
  function ZodiacSign_Aquarius_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Aquarius_instance;
  }
  function ZodiacSign_Pisces_getInstance() {
    ZodiacSign_initEntries();
    return ZodiacSign_Pisces_instance;
  }
  function SignificatorType_StarLord_getInstance() {
    SignificatorType_initEntries();
    return SignificatorType_StarLord_instance;
  }
  function SignificatorType_Occupant_getInstance() {
    SignificatorType_initEntries();
    return SignificatorType_Occupant_instance;
  }
  function SignificatorType_Owner_getInstance() {
    SignificatorType_initEntries();
    return SignificatorType_Owner_instance;
  }
  function SignificatorType_Aspecting_getInstance() {
    SignificatorType_initEntries();
    return SignificatorType_Aspecting_instance;
  }
  function HousePromise_Positive_getInstance() {
    HousePromise_initEntries();
    return HousePromise_Positive_instance;
  }
  function HousePromise_Negative_getInstance() {
    HousePromise_initEntries();
    return HousePromise_Negative_instance;
  }
  function HousePromise_Mixed_getInstance() {
    HousePromise_initEntries();
    return HousePromise_Mixed_instance;
  }
  function KpEvent_Marriage_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Marriage_instance;
  }
  function KpEvent_Job_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Job_instance;
  }
  function KpEvent_Health_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Health_instance;
  }
  function KpEvent_ChildBirth_getInstance() {
    KpEvent_initEntries();
    return KpEvent_ChildBirth_instance;
  }
  function KpEvent_Education_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Education_instance;
  }
  function KpEvent_ForeignTravel_getInstance() {
    KpEvent_initEntries();
    return KpEvent_ForeignTravel_instance;
  }
  function KpEvent_Wealth_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Wealth_instance;
  }
  function KpEvent_Litigation_getInstance() {
    KpEvent_initEntries();
    return KpEvent_Litigation_instance;
  }
  function Gana_Deva_getInstance() {
    Gana_initEntries();
    return Gana_Deva_instance;
  }
  function Gana_Manushya_getInstance() {
    Gana_initEntries();
    return Gana_Manushya_instance;
  }
  function Gana_Rakshasa_getInstance() {
    Gana_initEntries();
    return Gana_Rakshasa_instance;
  }
  function Dignity_Exalted_getInstance() {
    Dignity_initEntries();
    return Dignity_Exalted_instance;
  }
  function Dignity_Moolatrikona_getInstance() {
    Dignity_initEntries();
    return Dignity_Moolatrikona_instance;
  }
  function Dignity_OwnSign_getInstance() {
    Dignity_initEntries();
    return Dignity_OwnSign_instance;
  }
  function Dignity_GreatFriend_getInstance() {
    Dignity_initEntries();
    return Dignity_GreatFriend_instance;
  }
  function Dignity_Friend_getInstance() {
    Dignity_initEntries();
    return Dignity_Friend_instance;
  }
  function Dignity_Neutral_getInstance() {
    Dignity_initEntries();
    return Dignity_Neutral_instance;
  }
  function Dignity_Enemy_getInstance() {
    Dignity_initEntries();
    return Dignity_Enemy_instance;
  }
  function Dignity_GreatEnemy_getInstance() {
    Dignity_initEntries();
    return Dignity_GreatEnemy_instance;
  }
  function Dignity_Debilitated_getInstance() {
    Dignity_initEntries();
    return Dignity_Debilitated_instance;
  }
  function DashaLevel_Mahadasha_getInstance() {
    DashaLevel_initEntries();
    return DashaLevel_Mahadasha_instance;
  }
  function DashaLevel_Antardasha_getInstance() {
    DashaLevel_initEntries();
    return DashaLevel_Antardasha_instance;
  }
  function DashaLevel_Pratyantardasha_getInstance() {
    DashaLevel_initEntries();
    return DashaLevel_Pratyantardasha_instance;
  }
  function DashaLevel_Sookshmadasha_getInstance() {
    DashaLevel_initEntries();
    return DashaLevel_Sookshmadasha_instance;
  }
  function DashaLevel_Pranadasha_getInstance() {
    DashaLevel_initEntries();
    return DashaLevel_Pranadasha_instance;
  }
  function AyanamsaType_KP_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_KP_instance;
  }
  function AyanamsaType_Lahiri_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_Lahiri_instance;
  }
  function AyanamsaType_Raman_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_Raman_instance;
  }
  function AyanamsaType_FaganBradley_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_FaganBradley_instance;
  }
  function AyanamsaType_TrueChitra_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_TrueChitra_instance;
  }
  function AyanamsaType_Custom_getInstance() {
    AyanamsaType_initEntries();
    return AyanamsaType_Custom_instance;
  }
  function kpSegmentStarts$factory() {
    return getPropertyCallableRef('kpSegmentStarts', 0, KProperty0, function () {
      return get_kpSegmentStarts();
    }, null);
  }
  var properties_initialized_KpEngine_kt_eljhyh;
  function _init_properties_KpEngine_kt__5b306f() {
    if (!properties_initialized_KpEngine_kt_eljhyh) {
      properties_initialized_KpEngine_kt_eljhyh = true;
      NAKSHATRA_SPAN = 360.0 / 27.0;
      // Inline function 'kotlin.collections.map' call
      var this_0 = Companion_getInstance().SEQUENCE_1;
      // Inline function 'kotlin.collections.mapTo' call
      var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
      var tmp0_iterator = this_0.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var item = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.SUB_SPANS.<anonymous>' call
        var tmp$ret$0 = to(item, item.vimshottariYears_1 / 120.0 * get_NAKSHATRA_SPAN());
        destination.add_utx5q5_k$(tmp$ret$0);
      }
      SUB_SPANS = destination;
      kpSegmentStarts$delegate = lazy(kpSegmentStarts$delegate$lambda);
    }
  }
  function setupAyanamsaToggle() {
    var tmp = document.getElementById('ayanamsa-type');
    var tmp0_elvis_lhs = tmp instanceof HTMLSelectElement ? tmp : null;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var sel = tmp_0;
    var tmp_1 = document.getElementById('custom-ayanamsa');
    var tmp1_elvis_lhs = tmp_1 instanceof HTMLInputElement ? tmp_1 : null;
    var tmp_2;
    if (tmp1_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp_2 = tmp1_elvis_lhs;
    }
    var custom = tmp_2;
    sel.addEventListener('change', setupAyanamsaToggle$lambda(custom, sel));
  }
  function initApp() {
    main();
    setupAyanamsaToggle();
  }
  function dayLordOfWeek(year, month, day) {
    var m = month < 3 ? month + 12 | 0 : month;
    var y = month < 3 ? year - 1 | 0 : year;
    var h = (((((day + (imul(13, m + 1 | 0) / 5 | 0) | 0) + y | 0) + (y / 4 | 0) | 0) - (y / 100 | 0) | 0) + (y / 400 | 0) | 0) % 7 | 0;
    switch (h) {
      case 0:
        return DashaLord_Saturn_getInstance();
      case 1:
        return DashaLord_Sun_getInstance();
      case 2:
        return DashaLord_Moon_getInstance();
      case 3:
        return DashaLord_Mars_getInstance();
      case 4:
        return DashaLord_Mercury_getInstance();
      case 5:
        return DashaLord_Jupiter_getInstance();
      case 6:
        return DashaLord_Venus_getInstance();
      default:
        return DashaLord_Sun_getInstance();
    }
  }
  function formatDegree(deg) {
    var d = (deg % 360.0 + 360.0) % 360.0;
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$0 = Math.floor(d);
    var wholeDeg = numberToInt(tmp$ret$0);
    var minFrac = (d - wholeDeg) * 60.0;
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$1 = Math.floor(minFrac);
    var min = numberToInt(tmp$ret$1);
    var sec = numberToInt(round((minFrac - min) * 60.0));
    return '' + wholeDeg + '\xB0' + padStart(min.toString(), 2, _Char___init__impl__6a9atx(48)) + "'" + padStart(sec.toString(), 2, _Char___init__impl__6a9atx(48)) + '"';
  }
  function formatSignDeg(deg) {
    var sign = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(deg);
    var inSign = (deg % 360.0 + 360.0) % 360.0 % 30.0;
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$0 = Math.floor(inSign);
    var wholeDeg = numberToInt(tmp$ret$0);
    var minFrac = (inSign - wholeDeg) * 60.0;
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$1 = Math.floor(minFrac);
    var min = numberToInt(tmp$ret$1);
    var sec = numberToInt(round((minFrac - min) * 60.0));
    return sign.get_symbol_jqdfoh_k$() + ' ' + wholeDeg + '\xB0' + padStart(min.toString(), 2, _Char___init__impl__6a9atx(48)) + "'" + padStart(sec.toString(), 2, _Char___init__impl__6a9atx(48)) + '"';
  }
  function formatHour(h) {
    // Inline function 'kotlin.math.floor' call
    var tmp$ret$0 = Math.floor(h);
    var hh = numberToInt(tmp$ret$0);
    // Inline function 'kotlin.math.floor' call
    var x = (h - hh) * 60.0;
    var tmp$ret$1 = Math.floor(x);
    var mm = numberToInt(tmp$ret$1);
    return padStart(hh.toString(), 2, _Char___init__impl__6a9atx(48)) + ':' + padStart(mm.toString(), 2, _Char___init__impl__6a9atx(48));
  }
  function formatDouble(value, decimals) {
    var isNegative = value < 0;
    var absValue = isNegative ? -value : value;
    // Inline function 'kotlin.run' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kp.astro.formatDouble.<anonymous>' call
    var f = 1;
    // Inline function 'kotlin.repeat' call
    // Inline function 'kotlin.contracts.contract' call
    var inductionVariable = 0;
    if (inductionVariable < decimals)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kp.astro.formatDouble.<anonymous>.<anonymous>' call
        f = imul(f, 10);
      }
       while (inductionVariable < decimals);
    var factor = f;
    var scaled = numberToLong(absValue * factor + 0.5);
    // Inline function 'kotlin.Long.div' call
    var intPart = scaled.div_jun7gj_k$(toLong(factor)).toString();
    // Inline function 'kotlin.Long.rem' call
    var tmp$ret$3 = scaled.rem_bsnl9o_k$(toLong(factor));
    var fracPart = padStart(tmp$ret$3.toString(), decimals, _Char___init__impl__6a9atx(48));
    return (isNegative && !scaled.equals(new Long(0, 0)) ? '-' : '') + intPart + '.' + fracPart;
  }
  var HouseSystem_Placidus_instance;
  var HouseSystem_Equal_instance;
  var HouseSystem_WholeSign_instance;
  function values_10() {
    return [HouseSystem_Placidus_getInstance(), HouseSystem_Equal_getInstance(), HouseSystem_WholeSign_getInstance()];
  }
  function valueOf_10(value) {
    switch (value) {
      case 'Placidus':
        return HouseSystem_Placidus_getInstance();
      case 'Equal':
        return HouseSystem_Equal_getInstance();
      case 'WholeSign':
        return HouseSystem_WholeSign_getInstance();
      default:
        HouseSystem_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_10() {
    if ($ENTRIES_10 == null)
      $ENTRIES_10 = enumEntries(values_10());
    return $ENTRIES_10;
  }
  var HouseSystem_entriesInitialized;
  function HouseSystem_initEntries() {
    if (HouseSystem_entriesInitialized)
      return Unit_getInstance();
    HouseSystem_entriesInitialized = true;
    HouseSystem_Placidus_instance = new HouseSystem('Placidus', 0, '\u666E\u62C9\u897F\u5FB7\u5236\uFF08Placidus\uFF09', 'KP \u6807\u51C6\uFF0C\u4E0D\u7B49\u5BAB\u56DB\u5206\u6CD5\uFF0C\u8FED\u4EE3\u6C42\u89E3\u3002');
    HouseSystem_Equal_instance = new HouseSystem('Equal', 1, '\u7B49\u5BAB\u5236\uFF08Equal House\uFF09', '\u6BCF\u5BAB\u4ECE\u4E0A\u5347\u70B9\u8D77\u7B97 30 \u5EA6\u3002');
    HouseSystem_WholeSign_instance = new HouseSystem('WholeSign', 2, '\u6574\u5BAB\u5236\uFF08Whole Sign\uFF09', '\u7B2C\u4E00\u5BAB\u5BAB\u9996 = \u4E0A\u5347\u70B9\u6240\u5728\u661F\u5EA7 0 \u5EA6\u3002');
  }
  var $ENTRIES_10;
  function HouseSystem(name, ordinal, displayName, description) {
    Enum.call(this, name, ordinal);
    this.displayName_1 = displayName;
    this.description_1 = description;
  }
  protoOf(HouseSystem).get_displayName_sscnb0_k$ = function () {
    return this.displayName_1;
  };
  protoOf(HouseSystem).get_description_emjre5_k$ = function () {
    return this.description_1;
  };
  function computeCusps(ascendant, mc, system) {
    var tmp;
    switch (system.get_ordinal_ip24qg_k$()) {
      case 1:
        // Inline function 'kotlin.collections.map' call

        var this_0 = until(0, 12);
        // Inline function 'kotlin.collections.mapTo' call

        var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
        var inductionVariable = this_0.get_first_irdx8n_k$();
        var last = this_0.get_last_wopotb_k$();
        if (inductionVariable <= last)
          do {
            var item = inductionVariable;
            inductionVariable = inductionVariable + 1 | 0;
            // Inline function 'kp.astro.computeCusps.<anonymous>' call
            var tmp$ret$0 = (ascendant + item * 30.0) % 360.0;
            destination.add_utx5q5_k$(tmp$ret$0);
          }
           while (!(item === last));
        tmp = destination;
        break;
      case 2:
        // Inline function 'kotlin.math.floor' call

        var x = ascendant / 30.0;
        var signStart = Math.floor(x) * 30.0;
        // Inline function 'kotlin.collections.map' call

        var this_1 = until(0, 12);
        // Inline function 'kotlin.collections.mapTo' call

        var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_1, 10));
        var inductionVariable_0 = this_1.get_first_irdx8n_k$();
        var last_0 = this_1.get_last_wopotb_k$();
        if (inductionVariable_0 <= last_0)
          do {
            var item_0 = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            // Inline function 'kp.astro.computeCusps.<anonymous>' call
            var tmp$ret$4 = (signStart + item_0 * 30.0) % 360.0;
            destination_0.add_utx5q5_k$(tmp$ret$4);
          }
           while (!(item_0 === last_0));
        tmp = destination_0;
        break;
      case 0:
        var mcDeg = mc == null ? (ascendant + 270.0) % 360.0 : mc;
        var desc = (ascendant + 180.0) % 360.0;
        var ic = (mcDeg + 180.0) % 360.0;
        var c1 = ascendant;
        var c4 = ic;
        var c7 = desc;
        var c10 = mcDeg;
        var c2c3 = computeCusps$arc(c1, c4, 3);
        var c5c6 = computeCusps$arc(c4, c7, 3);
        var c8c9 = computeCusps$arc(c7, c10, 3);
        var c11c12 = computeCusps$arc(c10, c1, 3);
        tmp = listOf([c1, c2c3.get_c1px32_k$(0), c2c3.get_c1px32_k$(1), c4, c5c6.get_c1px32_k$(0), c5c6.get_c1px32_k$(1), c7, c8c9.get_c1px32_k$(0), c8c9.get_c1px32_k$(1), c10, c11c12.get_c1px32_k$(0), c11c12.get_c1px32_k$(1)]);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function computeCuspsFromJd(jd, latDeg, ascSidereal, mcSidereal, system) {
    var tmp;
    if (system.equals(HouseSystem_Placidus_getInstance())) {
      tmp = placidusCusps(jd, latDeg, ascSidereal, mcSidereal);
    } else {
      tmp = computeCusps(ascSidereal, mcSidereal, system);
    }
    return tmp;
  }
  function ChartInput(year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides) {
    this.year_1 = year;
    this.month_1 = month;
    this.day_1 = day;
    this.hour_1 = hour;
    this.lat_1 = lat;
    this.lon_1 = lon;
    this.ayanamsaType_1 = ayanamsaType;
    this.customAyanamsa_1 = customAyanamsa;
    this.houseSystem_1 = houseSystem;
    this.ascendantOverride_1 = ascendantOverride;
    this.planetOverrides_1 = planetOverrides;
    this.cuspOverrides_1 = cuspOverrides;
  }
  protoOf(ChartInput).get_year_woy26e_k$ = function () {
    return this.year_1;
  };
  protoOf(ChartInput).get_month_ivc8d3_k$ = function () {
    return this.month_1;
  };
  protoOf(ChartInput).get_day_18j7il_k$ = function () {
    return this.day_1;
  };
  protoOf(ChartInput).get_hour_wonfal_k$ = function () {
    return this.hour_1;
  };
  protoOf(ChartInput).get_lat_18j1l6_k$ = function () {
    return this.lat_1;
  };
  protoOf(ChartInput).get_lon_18j19a_k$ = function () {
    return this.lon_1;
  };
  protoOf(ChartInput).get_ayanamsaType_l44fwi_k$ = function () {
    return this.ayanamsaType_1;
  };
  protoOf(ChartInput).get_customAyanamsa_at2qyv_k$ = function () {
    return this.customAyanamsa_1;
  };
  protoOf(ChartInput).get_houseSystem_yakume_k$ = function () {
    return this.houseSystem_1;
  };
  protoOf(ChartInput).get_ascendantOverride_wdcdls_k$ = function () {
    return this.ascendantOverride_1;
  };
  protoOf(ChartInput).get_planetOverrides_usr6uy_k$ = function () {
    return this.planetOverrides_1;
  };
  protoOf(ChartInput).get_cuspOverrides_eyhhg1_k$ = function () {
    return this.cuspOverrides_1;
  };
  protoOf(ChartInput).ayanamsa_h0sqkn_k$ = function (jd) {
    return computeAyanamsa(this.ayanamsaType_1, jd, this.customAyanamsa_1);
  };
  protoOf(ChartInput).component1_7eebsc_k$ = function () {
    return this.year_1;
  };
  protoOf(ChartInput).component2_7eebsb_k$ = function () {
    return this.month_1;
  };
  protoOf(ChartInput).component3_7eebsa_k$ = function () {
    return this.day_1;
  };
  protoOf(ChartInput).component4_7eebs9_k$ = function () {
    return this.hour_1;
  };
  protoOf(ChartInput).component5_7eebs8_k$ = function () {
    return this.lat_1;
  };
  protoOf(ChartInput).component6_7eebs7_k$ = function () {
    return this.lon_1;
  };
  protoOf(ChartInput).component7_7eebs6_k$ = function () {
    return this.ayanamsaType_1;
  };
  protoOf(ChartInput).component8_7eebs5_k$ = function () {
    return this.customAyanamsa_1;
  };
  protoOf(ChartInput).component9_7eebs4_k$ = function () {
    return this.houseSystem_1;
  };
  protoOf(ChartInput).component10_gazzfo_k$ = function () {
    return this.ascendantOverride_1;
  };
  protoOf(ChartInput).component11_gazzfn_k$ = function () {
    return this.planetOverrides_1;
  };
  protoOf(ChartInput).component12_gazzfm_k$ = function () {
    return this.cuspOverrides_1;
  };
  protoOf(ChartInput).copy_bbcz27_k$ = function (year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides) {
    return new ChartInput(year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides);
  };
  protoOf(ChartInput).copy$default_3puj35_k$ = function (year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides, $super) {
    year = year === VOID ? this.year_1 : year;
    month = month === VOID ? this.month_1 : month;
    day = day === VOID ? this.day_1 : day;
    hour = hour === VOID ? this.hour_1 : hour;
    lat = lat === VOID ? this.lat_1 : lat;
    lon = lon === VOID ? this.lon_1 : lon;
    ayanamsaType = ayanamsaType === VOID ? this.ayanamsaType_1 : ayanamsaType;
    customAyanamsa = customAyanamsa === VOID ? this.customAyanamsa_1 : customAyanamsa;
    houseSystem = houseSystem === VOID ? this.houseSystem_1 : houseSystem;
    ascendantOverride = ascendantOverride === VOID ? this.ascendantOverride_1 : ascendantOverride;
    planetOverrides = planetOverrides === VOID ? this.planetOverrides_1 : planetOverrides;
    cuspOverrides = cuspOverrides === VOID ? this.cuspOverrides_1 : cuspOverrides;
    return $super === VOID ? this.copy_bbcz27_k$(year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides) : $super.copy_bbcz27_k$.call(this, year, month, day, hour, lat, lon, ayanamsaType, customAyanamsa, houseSystem, ascendantOverride, planetOverrides, cuspOverrides);
  };
  protoOf(ChartInput).toString = function () {
    return 'ChartInput(year=' + this.year_1 + ', month=' + this.month_1 + ', day=' + this.day_1 + ', hour=' + this.hour_1 + ', lat=' + this.lat_1 + ', lon=' + this.lon_1 + ', ayanamsaType=' + this.ayanamsaType_1.toString() + ', customAyanamsa=' + this.customAyanamsa_1 + ', houseSystem=' + this.houseSystem_1.toString() + ', ascendantOverride=' + this.ascendantOverride_1 + ', planetOverrides=' + toString(this.planetOverrides_1) + ', cuspOverrides=' + toString_0(this.cuspOverrides_1) + ')';
  };
  protoOf(ChartInput).hashCode = function () {
    var result = this.year_1;
    result = imul(result, 31) + this.month_1 | 0;
    result = imul(result, 31) + this.day_1 | 0;
    result = imul(result, 31) + getNumberHashCode(this.hour_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.lat_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.lon_1) | 0;
    result = imul(result, 31) + this.ayanamsaType_1.hashCode() | 0;
    result = imul(result, 31) + getNumberHashCode(this.customAyanamsa_1) | 0;
    result = imul(result, 31) + this.houseSystem_1.hashCode() | 0;
    result = imul(result, 31) + (this.ascendantOverride_1 == null ? 0 : getNumberHashCode(this.ascendantOverride_1)) | 0;
    result = imul(result, 31) + hashCode(this.planetOverrides_1) | 0;
    result = imul(result, 31) + (this.cuspOverrides_1 == null ? 0 : hashCode(this.cuspOverrides_1)) | 0;
    return result;
  };
  protoOf(ChartInput).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof ChartInput))
      return false;
    var tmp0_other_with_cast = other instanceof ChartInput ? other : THROW_CCE();
    if (!(this.year_1 === tmp0_other_with_cast.year_1))
      return false;
    if (!(this.month_1 === tmp0_other_with_cast.month_1))
      return false;
    if (!(this.day_1 === tmp0_other_with_cast.day_1))
      return false;
    if (!equals(this.hour_1, tmp0_other_with_cast.hour_1))
      return false;
    if (!equals(this.lat_1, tmp0_other_with_cast.lat_1))
      return false;
    if (!equals(this.lon_1, tmp0_other_with_cast.lon_1))
      return false;
    if (!this.ayanamsaType_1.equals(tmp0_other_with_cast.ayanamsaType_1))
      return false;
    if (!equals(this.customAyanamsa_1, tmp0_other_with_cast.customAyanamsa_1))
      return false;
    if (!this.houseSystem_1.equals(tmp0_other_with_cast.houseSystem_1))
      return false;
    if (!equals(this.ascendantOverride_1, tmp0_other_with_cast.ascendantOverride_1))
      return false;
    if (!equals(this.planetOverrides_1, tmp0_other_with_cast.planetOverrides_1))
      return false;
    if (!equals(this.cuspOverrides_1, tmp0_other_with_cast.cuspOverrides_1))
      return false;
    return true;
  };
  function ComputedChart(input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades) {
    this.input_1 = input;
    this.jd_1 = jd;
    this.ayanamsa_1 = ayanamsa;
    this.ascSidereal_1 = ascSidereal;
    this.mcSidereal_1 = mcSidereal;
    this.cusps_1 = cusps;
    this.planets_1 = planets;
    this.retrogrades_1 = retrogrades;
  }
  protoOf(ComputedChart).get_input_it4gip_k$ = function () {
    return this.input_1;
  };
  protoOf(ComputedChart).get_jd_kntnwd_k$ = function () {
    return this.jd_1;
  };
  protoOf(ComputedChart).get_ayanamsa_tc209k_k$ = function () {
    return this.ayanamsa_1;
  };
  protoOf(ComputedChart).get_ascSidereal_hgxizn_k$ = function () {
    return this.ascSidereal_1;
  };
  protoOf(ComputedChart).get_mcSidereal_9edfw4_k$ = function () {
    return this.mcSidereal_1;
  };
  protoOf(ComputedChart).get_cusps_ipy7yz_k$ = function () {
    return this.cusps_1;
  };
  protoOf(ComputedChart).get_planets_6whxxq_k$ = function () {
    return this.planets_1;
  };
  protoOf(ComputedChart).get_retrogrades_25q0un_k$ = function () {
    return this.retrogrades_1;
  };
  protoOf(ComputedChart).component1_7eebsc_k$ = function () {
    return this.input_1;
  };
  protoOf(ComputedChart).component2_7eebsb_k$ = function () {
    return this.jd_1;
  };
  protoOf(ComputedChart).component3_7eebsa_k$ = function () {
    return this.ayanamsa_1;
  };
  protoOf(ComputedChart).component4_7eebs9_k$ = function () {
    return this.ascSidereal_1;
  };
  protoOf(ComputedChart).component5_7eebs8_k$ = function () {
    return this.mcSidereal_1;
  };
  protoOf(ComputedChart).component6_7eebs7_k$ = function () {
    return this.cusps_1;
  };
  protoOf(ComputedChart).component7_7eebs6_k$ = function () {
    return this.planets_1;
  };
  protoOf(ComputedChart).component8_7eebs5_k$ = function () {
    return this.retrogrades_1;
  };
  protoOf(ComputedChart).copy_mrdvfa_k$ = function (input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades) {
    return new ComputedChart(input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades);
  };
  protoOf(ComputedChart).copy$default_91eqs3_k$ = function (input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades, $super) {
    input = input === VOID ? this.input_1 : input;
    jd = jd === VOID ? this.jd_1 : jd;
    ayanamsa = ayanamsa === VOID ? this.ayanamsa_1 : ayanamsa;
    ascSidereal = ascSidereal === VOID ? this.ascSidereal_1 : ascSidereal;
    mcSidereal = mcSidereal === VOID ? this.mcSidereal_1 : mcSidereal;
    cusps = cusps === VOID ? this.cusps_1 : cusps;
    planets = planets === VOID ? this.planets_1 : planets;
    retrogrades = retrogrades === VOID ? this.retrogrades_1 : retrogrades;
    return $super === VOID ? this.copy_mrdvfa_k$(input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades) : $super.copy_mrdvfa_k$.call(this, input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades);
  };
  protoOf(ComputedChart).toString = function () {
    return 'ComputedChart(input=' + this.input_1.toString() + ', jd=' + this.jd_1 + ', ayanamsa=' + this.ayanamsa_1 + ', ascSidereal=' + this.ascSidereal_1 + ', mcSidereal=' + this.mcSidereal_1 + ', cusps=' + toString(this.cusps_1) + ', planets=' + toString(this.planets_1) + ', retrogrades=' + toString(this.retrogrades_1) + ')';
  };
  protoOf(ComputedChart).hashCode = function () {
    var result = this.input_1.hashCode();
    result = imul(result, 31) + getNumberHashCode(this.jd_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.ayanamsa_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.ascSidereal_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.mcSidereal_1) | 0;
    result = imul(result, 31) + hashCode(this.cusps_1) | 0;
    result = imul(result, 31) + hashCode(this.planets_1) | 0;
    result = imul(result, 31) + hashCode(this.retrogrades_1) | 0;
    return result;
  };
  protoOf(ComputedChart).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof ComputedChart))
      return false;
    var tmp0_other_with_cast = other instanceof ComputedChart ? other : THROW_CCE();
    if (!this.input_1.equals(tmp0_other_with_cast.input_1))
      return false;
    if (!equals(this.jd_1, tmp0_other_with_cast.jd_1))
      return false;
    if (!equals(this.ayanamsa_1, tmp0_other_with_cast.ayanamsa_1))
      return false;
    if (!equals(this.ascSidereal_1, tmp0_other_with_cast.ascSidereal_1))
      return false;
    if (!equals(this.mcSidereal_1, tmp0_other_with_cast.mcSidereal_1))
      return false;
    if (!equals(this.cusps_1, tmp0_other_with_cast.cusps_1))
      return false;
    if (!equals(this.planets_1, tmp0_other_with_cast.planets_1))
      return false;
    if (!equals(this.retrogrades_1, tmp0_other_with_cast.retrogrades_1))
      return false;
    return true;
  };
  function main() {
    println('KP Astrology v2.0 starting...');
    var tmp0_elvis_lhs = document.getElementById('app');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      var message = 'No #app element';
      throw IllegalStateException_init_$Create$(toString(message));
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var root = tmp;
    root.innerHTML = '';
    renderApp(root);
  }
  function renderApp(root) {
    append(root, renderApp$lambda);
  }
  function switchTab(tabId) {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var inductionVariable = 0;
    var last = tabBtns.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = tabBtns.item(i);
        var tmp0_safe_receiver = tmp instanceof Element ? tmp : null;
        var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.classList;
        if (tmp1_safe_receiver == null)
          null;
        else {
          tmp1_safe_receiver.remove('active');
        }
      }
       while (inductionVariable < last);
    var tmp2_safe_receiver = document.getElementById('tab-' + tabId);
    var tmp3_safe_receiver = tmp2_safe_receiver == null ? null : tmp2_safe_receiver.classList;
    if (tmp3_safe_receiver == null)
      null;
    else {
      tmp3_safe_receiver.add('active');
    }
    var tabContents = document.querySelectorAll('.tab-content');
    var inductionVariable_0 = 0;
    var last_0 = tabContents.length;
    if (inductionVariable_0 < last_0)
      do {
        var i_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        var tmp_0 = tabContents.item(i_0);
        var tmp4_safe_receiver = tmp_0 instanceof Element ? tmp_0 : null;
        var tmp5_safe_receiver = tmp4_safe_receiver == null ? null : tmp4_safe_receiver.classList;
        if (tmp5_safe_receiver == null)
          null;
        else {
          tmp5_safe_receiver.remove('active');
        }
      }
       while (inductionVariable_0 < last_0);
    var tmp6_safe_receiver = document.getElementById('content-' + tabId);
    var tmp7_safe_receiver = tmp6_safe_receiver == null ? null : tmp6_safe_receiver.classList;
    if (tmp7_safe_receiver == null)
      null;
    else {
      tmp7_safe_receiver.add('active');
    }
  }
  function renderInputPanel(_this__u8e3s4) {
    // Inline function 'kotlinx.html.div' call
    var classes = 'input-card';
    // Inline function 'kotlinx.html.visit' call
    var this_0 = new DIV(attributesMapOf('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
    this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>' call
    // Inline function 'kotlinx.html.h2' call
    // Inline function 'kotlinx.html.visit' call
    var this_1 = new H2(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    this_1.unaryPlus_76unot_k$('\u51FA\u751F\u8D44\u6599');
    this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
    // Inline function 'kotlinx.html.div' call
    var classes_0 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_2 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
    this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_3 = new LABEL(attributesMapOf('class', null), this_2.get_consumer_tu5133_k$());
    this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_3.unaryPlus_76unot_k$('\u5E74');
    this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver = InputType_number_getInstance();
    var tmp = tmp0_safe_receiver == null ? null : enumEncode(tmp0_safe_receiver);
    var tmp_0 = null == null ? null : enumEncode(null);
    var this_4 = new INPUT(attributesMapOf_0(['type', tmp, 'formenctype', tmp_0, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_2.get_consumer_tu5133_k$());
    this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_4, 'year');
    this_4.set_value_hd9162_k$('1990');
    this_4.set_min_hy9e97_k$('1800');
    this_4.set_max_dcktkt_k$('2400');
    this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
    this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
    // Inline function 'kotlinx.html.div' call
    var classes_1 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_5 = new DIV(attributesMapOf('class', classes_1), this_0.get_consumer_tu5133_k$());
    this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_6 = new LABEL(attributesMapOf('class', null), this_5.get_consumer_tu5133_k$());
    this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_6.unaryPlus_76unot_k$('\u6708');
    this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_0 = InputType_number_getInstance();
    var tmp_1 = tmp0_safe_receiver_0 == null ? null : enumEncode(tmp0_safe_receiver_0);
    var tmp_2 = null == null ? null : enumEncode(null);
    var this_7 = new INPUT(attributesMapOf_0(['type', tmp_1, 'formenctype', tmp_2, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_5.get_consumer_tu5133_k$());
    this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_7, 'month');
    this_7.set_value_hd9162_k$('3');
    this_7.set_min_hy9e97_k$('1');
    this_7.set_max_dcktkt_k$('12');
    this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
    this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
    // Inline function 'kotlinx.html.div' call
    var classes_2 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_8 = new DIV(attributesMapOf('class', classes_2), this_0.get_consumer_tu5133_k$());
    this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_9 = new LABEL(attributesMapOf('class', null), this_8.get_consumer_tu5133_k$());
    this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_9.unaryPlus_76unot_k$('\u65E5');
    this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_1 = InputType_number_getInstance();
    var tmp_3 = tmp0_safe_receiver_1 == null ? null : enumEncode(tmp0_safe_receiver_1);
    var tmp_4 = null == null ? null : enumEncode(null);
    var this_10 = new INPUT(attributesMapOf_0(['type', tmp_3, 'formenctype', tmp_4, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_8.get_consumer_tu5133_k$());
    this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_10, 'day');
    this_10.set_value_hd9162_k$('15');
    this_10.set_min_hy9e97_k$('1');
    this_10.set_max_dcktkt_k$('31');
    this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
    this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
    // Inline function 'kotlinx.html.div' call
    var classes_3 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_11 = new DIV(attributesMapOf('class', classes_3), this_0.get_consumer_tu5133_k$());
    this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_12 = new LABEL(attributesMapOf('class', null), this_11.get_consumer_tu5133_k$());
    this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_12.unaryPlus_76unot_k$('\u65F6\uFF08\u5C0F\u6570\u5236\uFF0C24h\uFF09');
    this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_2 = InputType_number_getInstance();
    var tmp_5 = tmp0_safe_receiver_2 == null ? null : enumEncode(tmp0_safe_receiver_2);
    var tmp_6 = null == null ? null : enumEncode(null);
    var this_13 = new INPUT(attributesMapOf_0(['type', tmp_5, 'formenctype', tmp_6, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_11.get_consumer_tu5133_k$());
    this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_13, 'hour');
    this_13.set_value_hd9162_k$('10.5');
    this_13.set_step_xzssjj_k$('0.01');
    this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_14 = new SMALL(attributesMapOf('class', null), this_11.get_consumer_tu5133_k$());
    this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_14.unaryPlus_76unot_k$('\u4F8B\u5982 10.5 = \u4E0A\u5348 10:30\uFF0C22.25 = \u4E0B\u5348 10:15\uFF08UT \u65F6\u95F4\uFF09');
    this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
    this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_15 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
    // Inline function 'kotlinx.html.div' call
    var classes_4 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_16 = new DIV(attributesMapOf('class', classes_4), this_0.get_consumer_tu5133_k$());
    this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_17 = new LABEL(attributesMapOf('class', null), this_16.get_consumer_tu5133_k$());
    this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_17.unaryPlus_76unot_k$('\u7EAC\u5EA6\uFF08\u5EA6\uFF09');
    this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_3 = InputType_number_getInstance();
    var tmp_7 = tmp0_safe_receiver_3 == null ? null : enumEncode(tmp0_safe_receiver_3);
    var tmp_8 = null == null ? null : enumEncode(null);
    var this_18 = new INPUT(attributesMapOf_0(['type', tmp_7, 'formenctype', tmp_8, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_16.get_consumer_tu5133_k$());
    this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_18, 'lat');
    this_18.set_value_hd9162_k$('28.6139');
    this_18.set_step_xzssjj_k$('0.0001');
    this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_19 = new SMALL(attributesMapOf('class', null), this_16.get_consumer_tu5133_k$());
    this_19.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_19);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_19.unaryPlus_76unot_k$('\u9ED8\u8BA4\uFF1A\u65B0\u5FB7\u91CC');
    this_19.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_19);
    this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
    // Inline function 'kotlinx.html.div' call
    var classes_5 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_20 = new DIV(attributesMapOf('class', classes_5), this_0.get_consumer_tu5133_k$());
    this_20.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_20);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_21 = new LABEL(attributesMapOf('class', null), this_20.get_consumer_tu5133_k$());
    this_21.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_21);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_21.unaryPlus_76unot_k$('\u7ECF\u5EA6\uFF08\u5EA6\uFF09');
    this_21.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_21);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_4 = InputType_number_getInstance();
    var tmp_9 = tmp0_safe_receiver_4 == null ? null : enumEncode(tmp0_safe_receiver_4);
    var tmp_10 = null == null ? null : enumEncode(null);
    var this_22 = new INPUT(attributesMapOf_0(['type', tmp_9, 'formenctype', tmp_10, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_20.get_consumer_tu5133_k$());
    this_22.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_22);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_22, 'lon');
    this_22.set_value_hd9162_k$('77.2090');
    this_22.set_step_xzssjj_k$('0.0001');
    this_22.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_22);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_23 = new SMALL(attributesMapOf('class', null), this_20.get_consumer_tu5133_k$());
    this_23.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_23);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_23.unaryPlus_76unot_k$('+ \u4E1C\u7ECF\uFF0C\u2212 \u897F\u7ECF');
    this_23.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_23);
    this_20.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_20);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_24 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_24.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_24);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    this_24.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_24);
    // Inline function 'kotlinx.html.div' call
    var classes_6 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_25 = new DIV(attributesMapOf('class', classes_6), this_0.get_consumer_tu5133_k$());
    this_25.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_25);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_26 = new LABEL(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
    this_26.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_26);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_26.unaryPlus_76unot_k$('\u5C81\u5DEE\uFF08Ayanamsa\uFF09');
    this_26.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_26);
    // Inline function 'kotlinx.html.select' call
    // Inline function 'kotlinx.html.visit' call
    var this_27 = new SELECT(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
    this_27.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_27);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_27, 'ayanamsa-type');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = get_entries_9().iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.option' call
      // Inline function 'kotlinx.html.visit' call
      var this_28 = new OPTION(attributesMapOf('class', null), this_27.get_consumer_tu5133_k$());
      this_28.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_28);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_28.set_value_hd9162_k$(element.get_name_woqyms_k$());
      this_28.unaryPlus_76unot_k$(element.get_displayName_sscnb0_k$());
      this_28.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_28);
    }
    this_27.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_27);
    this_25.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_25);
    // Inline function 'kotlinx.html.div' call
    var classes_7 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_29 = new DIV(attributesMapOf('class', classes_7), this_0.get_consumer_tu5133_k$());
    this_29.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_29);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_30 = new LABEL(attributesMapOf('class', null), this_29.get_consumer_tu5133_k$());
    this_30.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_30);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_30.unaryPlus_76unot_k$('\u81EA\u5B9A\u4E49\u5C81\u5DEE\uFF08\u5EA6\uFF09');
    this_30.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_30);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_5 = InputType_number_getInstance();
    var tmp_11 = tmp0_safe_receiver_5 == null ? null : enumEncode(tmp0_safe_receiver_5);
    var tmp_12 = null == null ? null : enumEncode(null);
    var this_31 = new INPUT(attributesMapOf_0(['type', tmp_11, 'formenctype', tmp_12, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_29.get_consumer_tu5133_k$());
    this_31.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_31);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_31, 'custom-ayanamsa');
    this_31.set_value_hd9162_k$('0.0');
    this_31.set_step_xzssjj_k$('0.0001');
    this_31.set_disabled_rhu918_k$(true);
    this_31.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_31);
    this_29.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_29);
    // Inline function 'kotlinx.html.div' call
    var classes_8 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_32 = new DIV(attributesMapOf('class', classes_8), this_0.get_consumer_tu5133_k$());
    this_32.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_32);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_33 = new LABEL(attributesMapOf('class', null), this_32.get_consumer_tu5133_k$());
    this_33.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_33);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_33.unaryPlus_76unot_k$('\u5BAB\u4F4D\u5236');
    this_33.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_33);
    // Inline function 'kotlinx.html.select' call
    // Inline function 'kotlinx.html.visit' call
    var this_34 = new SELECT(attributesMapOf('class', null), this_32.get_consumer_tu5133_k$());
    this_34.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_34);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_34, 'house-system');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator_0 = get_entries_10().iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var element_0 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.option' call
      // Inline function 'kotlinx.html.visit' call
      var this_35 = new OPTION(attributesMapOf('class', null), this_34.get_consumer_tu5133_k$());
      this_35.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_35);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_35.set_value_hd9162_k$(element_0.get_name_woqyms_k$());
      this_35.unaryPlus_76unot_k$(element_0.displayName_1);
      this_35.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_35);
    }
    this_34.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_34);
    this_32.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_32);
    // Inline function 'kotlinx.html.div' call
    var classes_9 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_36 = new DIV(attributesMapOf('class', classes_9), this_0.get_consumer_tu5133_k$());
    this_36.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_36);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_37 = new LABEL(attributesMapOf('class', null), this_36.get_consumer_tu5133_k$());
    this_37.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_37);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_37.unaryPlus_76unot_k$('\u4E0A\u5347\u70B9\u8986\u76D6\uFF08\u5EA6\uFF0C\u53EF\u9009\uFF09');
    this_37.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_37);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_6 = InputType_number_getInstance();
    var tmp_13 = tmp0_safe_receiver_6 == null ? null : enumEncode(tmp0_safe_receiver_6);
    var tmp_14 = null == null ? null : enumEncode(null);
    var this_38 = new INPUT(attributesMapOf_0(['type', tmp_13, 'formenctype', tmp_14, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_36.get_consumer_tu5133_k$());
    this_38.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_38);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_38, 'asc-override');
    this_38.set_value_hd9162_k$('');
    this_38.set_step_xzssjj_k$('0.0001');
    this_38.set_placeholder_w9fsc_k$('auto');
    this_38.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_38);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_39 = new SMALL(attributesMapOf('class', null), this_36.get_consumer_tu5133_k$());
    this_39.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_39);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_39.unaryPlus_76unot_k$('\u7559\u7A7A\u5219\u81EA\u52A8\u8BA1\u7B97\uFF08\u63A8\u8350\uFF09\u3002\u8986\u76D6\u65F6\u6240\u6709\u5BAB\u9996\u4F1A\u57FA\u4E8E\u6B64\u91CD\u7B97\u3002');
    this_39.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_39);
    this_36.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_36);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_40 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_40.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_40);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    this_40.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_40);
    // Inline function 'kotlinx.html.div' call
    var classes_10 = 'button-row';
    // Inline function 'kotlinx.html.visit' call
    var this_41 = new DIV(attributesMapOf('class', classes_10), this_0.get_consumer_tu5133_k$());
    this_41.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_41);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.button' call
    var type = ButtonType_button_getInstance();
    var classes_11 = 'primary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_15 = null == null ? null : enumEncode(null);
    var tmp_16 = null == null ? null : enumEncode(null);
    var this_42 = new BUTTON(attributesMapOf_0(['formenctype', tmp_15, 'formmethod', tmp_16, 'name', null, 'type', type == null ? null : enumEncode(type), 'class', classes_11]), this_41.get_consumer_tu5133_k$());
    this_42.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_42);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_42.unaryPlus_76unot_k$('\u6392 KP \u661F\u76D8');
    set_onClickFunction(this_42, renderInputPanel$lambda);
    this_42.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_42);
    // Inline function 'kotlinx.html.button' call
    var type_0 = ButtonType_button_getInstance();
    var classes_12 = 'secondary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_17 = null == null ? null : enumEncode(null);
    var tmp_18 = null == null ? null : enumEncode(null);
    var this_43 = new BUTTON(attributesMapOf_0(['formenctype', tmp_17, 'formmethod', tmp_18, 'name', null, 'type', type_0 == null ? null : enumEncode(type_0), 'class', classes_12]), this_41.get_consumer_tu5133_k$());
    this_43.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_43);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_43.unaryPlus_76unot_k$('\u5BFC\u51FA JSON');
    set_onClickFunction(this_43, renderInputPanel$lambda_0);
    this_43.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_43);
    // Inline function 'kotlinx.html.button' call
    var type_1 = ButtonType_button_getInstance();
    var classes_13 = 'secondary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_19 = null == null ? null : enumEncode(null);
    var tmp_20 = null == null ? null : enumEncode(null);
    var this_44 = new BUTTON(attributesMapOf_0(['formenctype', tmp_19, 'formmethod', tmp_20, 'name', null, 'type', type_1 == null ? null : enumEncode(type_1), 'class', classes_13]), this_41.get_consumer_tu5133_k$());
    this_44.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_44);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_44.unaryPlus_76unot_k$('\u5BFC\u5165 JSON');
    set_onClickFunction(this_44, renderInputPanel$lambda_1);
    this_44.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_44);
    this_41.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_41);
    // Inline function 'kotlinx.html.div' call
    var classes_14 = 'city-presets';
    // Inline function 'kotlinx.html.visit' call
    var this_45 = new DIV(attributesMapOf('class', classes_14), this_0.get_consumer_tu5133_k$());
    this_45.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_45);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.p' call
    var classes_15 = 'preset-label';
    // Inline function 'kotlinx.html.visit' call
    var this_46 = new P(attributesMapOf('class', classes_15), this_45.get_consumer_tu5133_k$());
    this_46.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_46);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_46.unaryPlus_76unot_k$('\u57CE\u5E02\u9884\u8BBE\uFF1A');
    this_46.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_46);
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var tmp0_iterator_1 = mapOf([to('\u65B0\u5FB7\u91CC', new Pair(28.6139, 77.209)), to('\u5B5F\u4E70', new Pair(19.076, 72.8777)), to('\u91D1\u5948', new Pair(13.0827, 80.2707)), to('\u52A0\u5C14\u5404\u7B54', new Pair(22.5726, 88.3639)), to('\u7EBD\u7EA6', new Pair(40.7128, -74.006)), to('\u4F26\u6566', new Pair(51.5074, -0.1278)), to('\u6089\u5C3C', new Pair(-33.8688, 151.2093)), to('\u4E1C\u4EAC', new Pair(35.6762, 139.6503)), to('\u5317\u4EAC', new Pair(39.9042, 116.4074)), to('\u4E0A\u6D77', new Pair(31.2304, 121.4737)), to('\u53F0\u5317', new Pair(25.033, 121.5654)), to('\u9999\u6E2F', new Pair(22.3193, 114.1694)), to('\u65B0\u52A0\u5761', new Pair(1.3521, 103.8198))]).get_entries_p20ztl_k$().iterator_jk1svi_k$();
    while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
      var element_1 = tmp0_iterator_1.next_20eer_k$();
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlin.collections.component1' call
      var name = element_1.get_key_18j28a_k$();
      // Inline function 'kotlin.collections.component2' call
      var coords = element_1.get_value_j01efc_k$();
      // Inline function 'kotlinx.html.button' call
      var type_2 = ButtonType_button_getInstance();
      var classes_16 = 'preset-btn';
      // Inline function 'kotlinx.html.visit' call
      var tmp_21 = null == null ? null : enumEncode(null);
      var tmp_22 = null == null ? null : enumEncode(null);
      var this_47 = new BUTTON(attributesMapOf_0(['formenctype', tmp_21, 'formmethod', tmp_22, 'name', null, 'type', type_2 == null ? null : enumEncode(type_2), 'class', classes_16]), this_45.get_consumer_tu5133_k$());
      this_47.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_47);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderInputPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_47.unaryPlus_76unot_k$(name);
      set_onClickFunction(this_47, renderInputPanel$lambda_2(coords));
      this_47.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_47);
    }
    this_45.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_45);
    this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
  }
  function renderHoraryPanel(_this__u8e3s4) {
    // Inline function 'kotlinx.html.div' call
    var classes = 'input-card';
    // Inline function 'kotlinx.html.visit' call
    var this_0 = new DIV(attributesMapOf('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
    this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>' call
    // Inline function 'kotlinx.html.h2' call
    // Inline function 'kotlinx.html.visit' call
    var this_1 = new H2(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    this_1.unaryPlus_76unot_k$('KP Horary \u6570\u5B57\u95EE\u535C');
    this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
    // Inline function 'kotlinx.html.p' call
    var classes_0 = 'card-hint';
    // Inline function 'kotlinx.html.visit' call
    var this_2 = new P(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
    this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    this_2.unaryPlus_76unot_k$('\u5FC3\u91CC\u9ED8\u60F3\u4E00\u4E2A\u95EE\u9898\uFF0C\u7136\u540E\u8F93\u5165 1-249 \u4E4B\u95F4\u7684\u6570\u5B57\u3002\u8BE5\u6570\u5B57\u5BF9\u5E94\u4E00\u4E2A\u56FA\u5B9A\u7684\u6052\u661F\u9EC4\u7ECF\uFF0C');
    this_2.unaryPlus_76unot_k$('\u5C06\u4F5C\u4E3A\u300C\u865A\u62DF\u6708\u4EAE\u300D\u914D\u5408\u5F53\u524D\u5B9E\u9645\u884C\u661F\u4F4D\u7F6E\u751F\u6210\u95EE\u535C\u76D8\u3002');
    this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
    // Inline function 'kotlinx.html.div' call
    var classes_1 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_3 = new DIV(attributesMapOf('class', classes_1), this_0.get_consumer_tu5133_k$());
    this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_4 = new LABEL(attributesMapOf('class', null), this_3.get_consumer_tu5133_k$());
    this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_4.unaryPlus_76unot_k$('KP \u7F16\u53F7\uFF081-249\uFF09');
    this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver = InputType_number_getInstance();
    var tmp = tmp0_safe_receiver == null ? null : enumEncode(tmp0_safe_receiver);
    var tmp_0 = null == null ? null : enumEncode(null);
    var this_5 = new INPUT(attributesMapOf_0(['type', tmp, 'formenctype', tmp_0, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_3.get_consumer_tu5133_k$());
    this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_5, 'horary-num');
    this_5.set_value_hd9162_k$('1');
    this_5.set_min_hy9e97_k$('1');
    this_5.set_max_dcktkt_k$('249');
    this_5.set_step_xzssjj_k$('1');
    this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
    this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
    // Inline function 'kotlinx.html.div' call
    var classes_2 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_6 = new DIV(attributesMapOf('class', classes_2), this_0.get_consumer_tu5133_k$());
    this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_7 = new LABEL(attributesMapOf('class', null), this_6.get_consumer_tu5133_k$());
    this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_7.unaryPlus_76unot_k$('\u95EE\u535C\u65F6\u523B\uFF08\u5C0F\u6570\u5C0F\u65F6\uFF0CUT\uFF09');
    this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
    // Inline function 'kotlinx.html.input' call
    // Inline function 'kotlinx.html.visit' call
    var tmp0_safe_receiver_0 = InputType_number_getInstance();
    var tmp_1 = tmp0_safe_receiver_0 == null ? null : enumEncode(tmp0_safe_receiver_0);
    var tmp_2 = null == null ? null : enumEncode(null);
    var this_8 = new INPUT(attributesMapOf_0(['type', tmp_1, 'formenctype', tmp_2, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_6.get_consumer_tu5133_k$());
    this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_8, 'horary-hour');
    this_8.set_value_hd9162_k$('12.0');
    this_8.set_step_xzssjj_k$('0.01');
    this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_9 = new SMALL(attributesMapOf('class', null), this_6.get_consumer_tu5133_k$());
    this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_9.unaryPlus_76unot_k$('\u4F7F\u7528\u5DE6\u4FA7\u7684\u65E5\u671F + \u6B64\u65F6\u523B\u4F5C\u4E3A\u5360\u535C\u65F6\u95F4');
    this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
    this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
    // Inline function 'kotlinx.html.div' call
    var classes_3 = 'field-row';
    // Inline function 'kotlinx.html.visit' call
    var this_10 = new DIV(attributesMapOf('class', classes_3), this_0.get_consumer_tu5133_k$());
    this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.label' call
    // Inline function 'kotlinx.html.visit' call
    var this_11 = new LABEL(attributesMapOf('class', null), this_10.get_consumer_tu5133_k$());
    this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_11.unaryPlus_76unot_k$('\u95EE\u535C\u5730\u7ECF\u7EAC\u5EA6');
    this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
    // Inline function 'kotlinx.html.small' call
    // Inline function 'kotlinx.html.visit' call
    var this_12 = new SMALL(attributesMapOf('class', null), this_10.get_consumer_tu5133_k$());
    this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_12.unaryPlus_76unot_k$('\u4F7F\u7528\u5DE6\u4FA7\u586B\u5199\u7684\u7EAC\u5EA6/\u7ECF\u5EA6');
    this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
    this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_13 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
    // Inline function 'kotlinx.html.button' call
    var type = ButtonType_button_getInstance();
    var classes_4 = 'primary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_3 = null == null ? null : enumEncode(null);
    var tmp_4 = null == null ? null : enumEncode(null);
    var this_14 = new BUTTON(attributesMapOf_0(['formenctype', tmp_3, 'formmethod', tmp_4, 'name', null, 'type', type == null ? null : enumEncode(type), 'class', classes_4]), this_0.get_consumer_tu5133_k$());
    this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    this_14.unaryPlus_76unot_k$('\u6392\u51FA\u95EE\u535C\u76D8');
    set_onClickFunction(this_14, renderHoraryPanel$lambda);
    this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
    // Inline function 'kotlinx.html.div' call
    var classes_5 = 'horary-result';
    // Inline function 'kotlinx.html.visit' call
    var this_15 = new DIV(attributesMapOf('class', classes_5), this_0.get_consumer_tu5133_k$());
    this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderHoraryPanel.<anonymous>.<anonymous>' call
    set_id(this_15, 'horary-result');
    this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
    this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
  }
  function renderDebugPanel(_this__u8e3s4) {
    // Inline function 'kotlinx.html.div' call
    var classes = 'input-card';
    // Inline function 'kotlinx.html.visit' call
    var this_0 = new DIV(attributesMapOf('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
    this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>' call
    // Inline function 'kotlinx.html.h2' call
    // Inline function 'kotlinx.html.visit' call
    var this_1 = new H2(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    this_1.unaryPlus_76unot_k$('\u8C03\u8BD5\u9762\u677F \xB7 \u624B\u52A8\u8986\u76D6');
    this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
    // Inline function 'kotlinx.html.p' call
    var classes_0 = 'card-hint';
    // Inline function 'kotlinx.html.visit' call
    var this_2 = new P(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
    this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    this_2.unaryPlus_76unot_k$('\u53EF\u624B\u52A8\u8986\u76D6\u4EFB\u610F\u884C\u661F\u4F4D\u7F6E\u6216\u5BAB\u9996\u5EA6\u6570\u3002\u8986\u76D6\u540E\u6392\u76D8\u3001Dasha\u3001Horary \u5168\u90E8\u4F7F\u7528\u65B0\u503C\u3002');
    this_2.unaryPlus_76unot_k$('\u7559\u7A7A\u5219\u4F7F\u7528\u771F\u661F\u5386\u8BA1\u7B97\u7ED3\u679C\u3002');
    this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
    // Inline function 'kotlinx.html.div' call
    var classes_1 = 'debug-section';
    // Inline function 'kotlinx.html.visit' call
    var this_3 = new DIV(attributesMapOf('class', classes_1), this_0.get_consumer_tu5133_k$());
    this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.h3' call
    // Inline function 'kotlinx.html.visit' call
    var this_4 = new H3(attributesMapOf('class', null), this_3.get_consumer_tu5133_k$());
    this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_4.unaryPlus_76unot_k$('\u884C\u661F\u4F4D\u7F6E\u8986\u76D6\uFF08\u6052\u661F\u9EC4\u7ECF\u5EA6\uFF09');
    this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = get_entries_0().iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.div' call
      var classes_2 = 'field-row compact';
      // Inline function 'kotlinx.html.visit' call
      var this_5 = new DIV(attributesMapOf('class', classes_2), this_3.get_consumer_tu5133_k$());
      this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.label' call
      // Inline function 'kotlinx.html.visit' call
      var this_6 = new LABEL(attributesMapOf('class', null), this_5.get_consumer_tu5133_k$());
      this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_6.unaryPlus_76unot_k$(element.get_displayName_sscnb0_k$());
      this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
      // Inline function 'kotlinx.html.input' call
      // Inline function 'kotlinx.html.visit' call
      var tmp0_safe_receiver = InputType_number_getInstance();
      var tmp = tmp0_safe_receiver == null ? null : enumEncode(tmp0_safe_receiver);
      var tmp_0 = null == null ? null : enumEncode(null);
      var this_7 = new INPUT(attributesMapOf_0(['type', tmp, 'formenctype', tmp_0, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_5.get_consumer_tu5133_k$());
      this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      set_id(this_7, 'override-planet-' + element.get_name_woqyms_k$());
      this_7.set_step_xzssjj_k$('0.0001');
      this_7.set_placeholder_w9fsc_k$('auto');
      this_7.set_value_hd9162_k$('');
      this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
      // Inline function 'kotlinx.html.small' call
      // Inline function 'kotlinx.html.visit' call
      var this_8 = new SMALL(attributesMapOf('class', null), this_5.get_consumer_tu5133_k$());
      this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_8.unaryPlus_76unot_k$('(' + element.get_symbol_jqdfoh_k$() + ')');
      this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
      this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
    }
    this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_9 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
    // Inline function 'kotlinx.html.div' call
    var classes_3 = 'debug-section';
    // Inline function 'kotlinx.html.visit' call
    var this_10 = new DIV(attributesMapOf('class', classes_3), this_0.get_consumer_tu5133_k$());
    this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.h3' call
    // Inline function 'kotlinx.html.visit' call
    var this_11 = new H3(attributesMapOf('class', null), this_10.get_consumer_tu5133_k$());
    this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_11.unaryPlus_76unot_k$('\u5BAB\u9996\u8986\u76D6\uFF0812 \u4E2A\uFF0C\u6052\u661F\u9EC4\u7ECF\u5EA6\uFF09');
    this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
    // Inline function 'kotlinx.html.p' call
    var classes_4 = 'card-hint';
    // Inline function 'kotlinx.html.visit' call
    var this_12 = new P(attributesMapOf('class', classes_4), this_10.get_consumer_tu5133_k$());
    this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_12.unaryPlus_76unot_k$('\u7559\u7A7A\u5219\u81EA\u52A8\u8BA1\u7B97\u3002\u8986\u76D6\u7B2C 1 \u5BAB\u4F1A\u540C\u6B65\u8986\u76D6\u4E0A\u5347\u70B9\u3002');
    this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
    // Inline function 'kotlin.collections.forEach' call
    var progression = numberRangeToNumber(1, 12);
    var inductionVariable = progression.get_first_irdx8n_k$();
    var last = progression.get_last_wopotb_k$();
    if (inductionVariable <= last)
      do {
        var element_0 = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
        var i = element_0;
        // Inline function 'kotlinx.html.div' call
        var classes_5 = 'field-row compact';
        // Inline function 'kotlinx.html.visit' call
        var this_13 = new DIV(attributesMapOf('class', classes_5), this_10.get_consumer_tu5133_k$());
        this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.label' call
        // Inline function 'kotlinx.html.visit' call
        var this_14 = new LABEL(attributesMapOf('class', null), this_13.get_consumer_tu5133_k$());
        this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_14.unaryPlus_76unot_k$('\u7B2C ' + i + ' \u5BAB');
        this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
        // Inline function 'kotlinx.html.input' call
        // Inline function 'kotlinx.html.visit' call
        var tmp0_safe_receiver_0 = InputType_number_getInstance();
        var tmp_1 = tmp0_safe_receiver_0 == null ? null : enumEncode(tmp0_safe_receiver_0);
        var tmp_2 = null == null ? null : enumEncode(null);
        var this_15 = new INPUT(attributesMapOf_0(['type', tmp_1, 'formenctype', tmp_2, 'formmethod', null == null ? null : enumEncode(null), 'name', null, 'class', null]), this_13.get_consumer_tu5133_k$());
        this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        set_id(this_15, 'override-cusp-' + i);
        this_15.set_step_xzssjj_k$('0.0001');
        this_15.set_placeholder_w9fsc_k$('auto');
        this_15.set_value_hd9162_k$('');
        this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
        this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
      }
       while (!(element_0 === last));
    this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_16 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
    // Inline function 'kotlinx.html.div' call
    var classes_6 = 'button-row';
    // Inline function 'kotlinx.html.visit' call
    var this_17 = new DIV(attributesMapOf('class', classes_6), this_0.get_consumer_tu5133_k$());
    this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.button' call
    var type = ButtonType_button_getInstance();
    var classes_7 = 'secondary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_3 = null == null ? null : enumEncode(null);
    var tmp_4 = null == null ? null : enumEncode(null);
    var this_18 = new BUTTON(attributesMapOf_0(['formenctype', tmp_3, 'formmethod', tmp_4, 'name', null, 'type', type == null ? null : enumEncode(type), 'class', classes_7]), this_17.get_consumer_tu5133_k$());
    this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_18.unaryPlus_76unot_k$('\u6E05\u7A7A\u6240\u6709\u8986\u76D6');
    set_onClickFunction(this_18, renderDebugPanel$lambda);
    this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
    // Inline function 'kotlinx.html.button' call
    var type_0 = ButtonType_button_getInstance();
    var classes_8 = 'secondary-btn';
    // Inline function 'kotlinx.html.visit' call
    var tmp_5 = null == null ? null : enumEncode(null);
    var tmp_6 = null == null ? null : enumEncode(null);
    var this_19 = new BUTTON(attributesMapOf_0(['formenctype', tmp_5, 'formmethod', tmp_6, 'name', null, 'type', type_0 == null ? null : enumEncode(type_0), 'class', classes_8]), this_17.get_consumer_tu5133_k$());
    this_19.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_19);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_19.unaryPlus_76unot_k$('\u5E94\u7528\u8986\u76D6\u5E76\u6392\u76D8');
    set_onClickFunction(this_19, renderDebugPanel$lambda_0);
    this_19.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_19);
    this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
    // Inline function 'kotlinx.html.hr' call
    // Inline function 'kotlinx.html.visit' call
    var this_20 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
    this_20.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_20);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    this_20.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_20);
    // Inline function 'kotlinx.html.div' call
    var classes_9 = 'debug-section';
    // Inline function 'kotlinx.html.visit' call
    var this_21 = new DIV(attributesMapOf('class', classes_9), this_0.get_consumer_tu5133_k$());
    this_21.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_21);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.h3' call
    // Inline function 'kotlinx.html.visit' call
    var this_22 = new H3(attributesMapOf('class', null), this_21.get_consumer_tu5133_k$());
    this_22.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_22);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    this_22.unaryPlus_76unot_k$('\u8C03\u8BD5\u8F93\u51FA');
    this_22.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_22);
    // Inline function 'kotlinx.html.div' call
    var classes_10 = 'debug-output';
    // Inline function 'kotlinx.html.visit' call
    var this_23 = new DIV(attributesMapOf('class', classes_10), this_21.get_consumer_tu5133_k$());
    this_23.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_23);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderDebugPanel.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_23, 'debug-output');
    this_23.unaryPlus_76unot_k$('\u6392\u76D8\u540E\u6B64\u5904\u663E\u793A\u4E2D\u95F4\u8BA1\u7B97\u503C\uFF08JD\u3001LST\u3001RAMC\u3001\u7AE0\u52A8\u3001\u884C\u661F\u901F\u5EA6\u7B49\uFF09\u3002');
    this_23.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_23);
    this_21.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_21);
    this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
  }
  function readInput() {
    var tmp = document.getElementById('year');
    var year = toInt((tmp instanceof HTMLInputElement ? tmp : THROW_CCE()).value);
    var tmp_0 = document.getElementById('month');
    var month = toInt((tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE()).value);
    var tmp_1 = document.getElementById('day');
    var day = toInt((tmp_1 instanceof HTMLInputElement ? tmp_1 : THROW_CCE()).value);
    var tmp_2 = document.getElementById('hour');
    var hour = toDouble((tmp_2 instanceof HTMLInputElement ? tmp_2 : THROW_CCE()).value);
    var tmp_3 = document.getElementById('lat');
    var lat = toDouble((tmp_3 instanceof HTMLInputElement ? tmp_3 : THROW_CCE()).value);
    var tmp_4 = document.getElementById('lon');
    var lon = toDouble((tmp_4 instanceof HTMLInputElement ? tmp_4 : THROW_CCE()).value);
    var tmp_5 = document.getElementById('ayanamsa-type');
    var ayaSel = (tmp_5 instanceof HTMLSelectElement ? tmp_5 : THROW_CCE()).value;
    var ayaType = valueOf_9(ayaSel);
    var tmp_6 = document.getElementById('custom-ayanamsa');
    var tmp0_elvis_lhs = toDoubleOrNull((tmp_6 instanceof HTMLInputElement ? tmp_6 : THROW_CCE()).value);
    var customAya = tmp0_elvis_lhs == null ? 0.0 : tmp0_elvis_lhs;
    var tmp_7 = document.getElementById('house-system');
    var houseSel = (tmp_7 instanceof HTMLSelectElement ? tmp_7 : THROW_CCE()).value;
    var houseSystem = valueOf_10(houseSel);
    var tmp_8 = document.getElementById('asc-override');
    var ascOverrideStr = (tmp_8 instanceof HTMLInputElement ? tmp_8 : THROW_CCE()).value;
    var ascOverride = toDoubleOrNull(ascOverrideStr);
    var planetOverrides = HashMap_init_$Create$();
    var _iterator__ex2g4s = get_entries_0().iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var p = _iterator__ex2g4s.next_20eer_k$();
      var tmp_9 = document.getElementById('override-planet-' + p.get_name_woqyms_k$());
      var tmp1_safe_receiver = tmp_9 instanceof HTMLInputElement ? tmp_9 : null;
      var v = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.value;
      var d = v == null ? null : toDoubleOrNull(v);
      if (!(d == null)) {
        // Inline function 'kotlin.collections.set' call
        planetOverrides.put_4fpzoq_k$(p, d);
      }
    }
    // Inline function 'kotlin.let' call
    // Inline function 'kotlin.collections.mapNotNull' call
    // Inline function 'kotlin.collections.mapNotNullTo' call
    var this_0 = numberRangeToNumber(1, 12);
    var destination = ArrayList_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable = this_0.get_first_irdx8n_k$();
    var last = this_0.get_last_wopotb_k$();
    if (inductionVariable <= last)
      do {
        var element = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.mapNotNullTo.<anonymous>' call
        // Inline function 'kp.astro.readInput.<anonymous>' call
        var i = element;
        var tmp_10 = document.getElementById('override-cusp-' + i);
        var tmp0_safe_receiver = tmp_10 instanceof HTMLInputElement ? tmp_10 : null;
        var tmp1_safe_receiver_0 = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.value;
        var tmp0_safe_receiver_0 = tmp1_safe_receiver_0 == null ? null : toDoubleOrNull(tmp1_safe_receiver_0);
        if (tmp0_safe_receiver_0 == null)
          null;
        else {
          // Inline function 'kotlin.let' call
          // Inline function 'kotlin.contracts.contract' call
          destination.add_utx5q5_k$(tmp0_safe_receiver_0);
        }
      }
       while (!(element === last));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kp.astro.readInput.<anonymous>' call
    var cuspOverrides = destination.get_size_woubt6_k$() === 12 ? destination : null;
    return new ChartInput(year, month, day, hour, lat, lon, ayaType, customAya, houseSystem, ascOverride, planetOverrides, cuspOverrides);
  }
  function computeChart(input) {
    var jd = julianDay(input.year_1, input.month_1, input.day_1, input.hour_1);
    var ayanamsa = input.ayanamsa_h0sqkn_k$(jd);
    var siderealPositions = computeAllSidereal(jd, ayanamsa);
    var lst = localSiderealTime(jd, input.lon_1);
    var tmp0_safe_receiver = input.ascendantOverride_1;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kp.astro.computeChart.<anonymous>' call
      tmp = (tmp0_safe_receiver + ayanamsa) % 360.0;
    }
    var tmp1_elvis_lhs = tmp;
    var ascTropical = tmp1_elvis_lhs == null ? computeAscendant(jd, input.lat_1, lst) : tmp1_elvis_lhs;
    var ascSidereal = ((ascTropical - ayanamsa) % 360.0 + 360.0) % 360.0;
    var mcTropical = computeMC(jd, lst);
    var mcSidereal = ((mcTropical - ayanamsa) % 360.0 + 360.0) % 360.0;
    var tmp2_elvis_lhs = input.cuspOverrides_1;
    var cusps = tmp2_elvis_lhs == null ? computeCuspsFromJd(jd, input.lat_1, ascSidereal, mcSidereal, input.houseSystem_1) : tmp2_elvis_lhs;
    // Inline function 'kotlin.collections.map' call
    var this_0 = Companion_getInstance_0().get_VEDIC_NINE_7vwslx_k$();
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var tmp0_iterator = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'kp.astro.computeChart.<anonymous>' call
      var tmp0_elvis_lhs = input.planetOverrides_1.get_wei43m_k$(item);
      var deg = tmp0_elvis_lhs == null ? ensureNotNull(siderealPositions.get_wei43m_k$(item)) : tmp0_elvis_lhs;
      var tmp$ret$2 = to(item, deg);
      destination.add_utx5q5_k$(tmp$ret$2);
    }
    var planets = destination;
    // Inline function 'kotlin.collections.associateWith' call
    var this_1 = get_entries_0();
    var result = LinkedHashMap_init_$Create$(coerceAtLeast(mapCapacity(collectionSizeOrDefault(this_1, 10)), 16));
    // Inline function 'kotlin.collections.associateWithTo' call
    var tmp0_iterator_0 = this_1.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'kp.astro.computeChart.<anonymous>' call
      var tmp$ret$5 = element.equals(Planet_Rahu_getInstance()) || element.equals(Planet_Ketu_getInstance()) ? true : isRetrograde(element, jd);
      result.put_4fpzoq_k$(element, tmp$ret$5);
    }
    var retrogrades = result;
    return new ComputedChart(input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades);
  }
  function computeAndRender() {
    try {
      var input = readInput();
      var chart = computeChart(input);
      renderChartTab(chart);
      renderDashaTab(chart);
      renderDebugOutput(chart);
    } catch ($p) {
      if ($p instanceof Error) {
        var e = $p;
        console.error('KP computation failed', e);
        var tmp0_elvis_lhs = document.getElementById('content-chart');
        var tmp;
        if (tmp0_elvis_lhs == null) {
          return Unit_getInstance();
        } else {
          tmp = tmp0_elvis_lhs;
        }
        var right = tmp;
        right.innerHTML = '';
        append(right, computeAndRender$lambda(e));
      } else {
        throw $p;
      }
    }
  }
  function renderChartTab(chart) {
    var tmp0_elvis_lhs = document.getElementById('content-chart');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var container = tmp;
    container.innerHTML = '';
    var input = chart.input_1;
    var sigs = computeSignificators(new KpChart(chart.cusps_1, chart.planets_1));
    var cuspal = cuspalAnalysis(chart.cusps_1, chart.planets_1);
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.first' call
      var tmp0_iterator = chart.planets_1.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.renderChartTab.<anonymous>' call
        if (element.get_first_irdx8n_k$().equals(Planet_Moon_getInstance())) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
    }
    var moonDeg = tmp$ret$1.get_second_jf7fjx_k$();
    var lagnaDeg = chart.ascSidereal_1;
    var dayLord = dayLordOfWeek(input.year_1, input.month_1, input.day_1);
    var moonSig = kpPosition(moonDeg);
    var lagnaSig = kpPosition(lagnaDeg);
    var moonSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(moonDeg).get_owner_iwkx3e_k$();
    var lagnaSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(lagnaDeg).get_owner_iwkx3e_k$();
    var tmp$ret$3;
    $l$block_0: {
      // Inline function 'kotlin.collections.first' call
      var tmp0_iterator_0 = chart.planets_1.iterator_jk1svi_k$();
      while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
        var element_0 = tmp0_iterator_0.next_20eer_k$();
        // Inline function 'kp.astro.renderChartTab.<anonymous>' call
        if (element_0.get_first_irdx8n_k$().equals(Planet_Rahu_getInstance())) {
          tmp$ret$3 = element_0;
          break $l$block_0;
        }
      }
      throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
    }
    var rahuPos = tmp$ret$3.get_second_jf7fjx_k$();
    var rahuSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(rahuPos).get_owner_iwkx3e_k$();
    var tmp$ret$5;
    $l$block_1: {
      // Inline function 'kotlin.collections.first' call
      var tmp0_iterator_1 = chart.planets_1.iterator_jk1svi_k$();
      while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
        var element_1 = tmp0_iterator_1.next_20eer_k$();
        // Inline function 'kp.astro.renderChartTab.<anonymous>' call
        if (element_1.get_first_irdx8n_k$().equals(Planet_Ketu_getInstance())) {
          tmp$ret$5 = element_1;
          break $l$block_1;
        }
      }
      throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
    }
    var ketuPos = tmp$ret$5.get_second_jf7fjx_k$();
    var ketuSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(ketuPos).get_owner_iwkx3e_k$();
    var rp = rulingPlanetsWithAgents(dayLord, ensureNotNull(planetToDashaLord(moonSignLord)), moonSig.get_starLord_a1nf0w_k$(), ensureNotNull(planetToDashaLord(lagnaSignLord)), lagnaSig.get_starLord_a1nf0w_k$(), planetToDashaLord(rahuSignLord), planetToDashaLord(ketuSignLord));
    // Inline function 'kotlin.collections.map' call
    var this_0 = get_entries_5();
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var tmp0_iterator_2 = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator_2.next_20eer_k$();
      // Inline function 'kp.astro.renderChartTab.<anonymous>' call
      var tmp$ret$6 = to(item, checkEventInChart(item, new KpChart(chart.cusps_1, chart.planets_1)));
      destination.add_utx5q5_k$(tmp$ret$6);
    }
    var events = destination;
    append(container, renderChartTab$lambda(input, chart, dayLord, cuspal, sigs, rp, events));
  }
  function renderDashaTab(chart) {
    var tmp0_elvis_lhs = document.getElementById('content-dasha');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var container = tmp;
    container.innerHTML = '';
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.first' call
      var tmp0_iterator = chart.planets_1.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.renderDashaTab.<anonymous>' call
        if (element.get_first_irdx8n_k$().equals(Planet_Moon_getInstance())) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
    }
    var moonDeg = tmp$ret$1.get_second_jf7fjx_k$();
    var dashaPeriods = vimshottariDasha(moonDeg, chart.jd_1, DashaLevel_Pratyantardasha_getInstance());
    append(container, renderDashaTab$lambda(moonDeg, dashaPeriods));
  }
  function computeHorary() {
    var tmp0_elvis_lhs = document.getElementById('horary-result');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var container = tmp;
    container.innerHTML = '';
    try {
      var input = readInput();
      var tmp_0 = document.getElementById('horary-num');
      var kpNum = toInt((tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE()).value);
      var tmp_1 = document.getElementById('horary-hour');
      var hourStr = (tmp_1 instanceof HTMLInputElement ? tmp_1 : THROW_CCE()).value;
      var tmp1_elvis_lhs = toDoubleOrNull(hourStr);
      var hour = tmp1_elvis_lhs == null ? input.hour_1 : tmp1_elvis_lhs;
      var horaryInput = input.copy$default_3puj35_k$(VOID, VOID, VOID, hour);
      var jd = julianDay(horaryInput.year_1, horaryInput.month_1, horaryInput.day_1, hour);
      var ayanamsa = horaryInput.ayanamsa_h0sqkn_k$(jd);
      var _destruct__k2r9zo = kpHoraryChart(kpNum, jd, horaryInput.lat_1, horaryInput.lon_1, ayanamsa, horaryInput.houseSystem_1);
      var cusps = _destruct__k2r9zo.component1_7eebsc_k$();
      var planets = _destruct__k2r9zo.component2_7eebsb_k$();
      var sigs = computeSignificators(new KpChart(cusps, planets));
      var cuspal = cuspalAnalysis(cusps, planets);
      // Inline function 'kotlin.collections.map' call
      var this_0 = get_entries_5();
      // Inline function 'kotlin.collections.mapTo' call
      var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
      var tmp0_iterator = this_0.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var item = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.computeHorary.<anonymous>' call
        var tmp$ret$0 = to(item, checkEventInChart(item, new KpChart(cusps, planets)));
        destination.add_utx5q5_k$(tmp$ret$0);
      }
      var events = destination;
      var tmp$ret$4;
      $l$block: {
        // Inline function 'kotlin.collections.first' call
        var tmp0_iterator_0 = planets.iterator_jk1svi_k$();
        while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
          var element = tmp0_iterator_0.next_20eer_k$();
          // Inline function 'kp.astro.computeHorary.<anonymous>' call
          if (element.get_first_irdx8n_k$().equals(Planet_Moon_getInstance())) {
            tmp$ret$4 = element;
            break $l$block;
          }
        }
        throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
      }
      var moonDeg = tmp$ret$4.get_second_jf7fjx_k$();
      var ascDeg = cusps.get_c1px32_k$(0);
      var dayLord = dayLordOfWeek(horaryInput.year_1, horaryInput.month_1, horaryInput.day_1);
      var moonSig = kpPosition(moonDeg);
      var lagnaSig = kpPosition(ascDeg);
      var moonSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(moonDeg).get_owner_iwkx3e_k$();
      var lagnaSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(ascDeg).get_owner_iwkx3e_k$();
      var tmp$ret$6;
      $l$block_0: {
        // Inline function 'kotlin.collections.first' call
        var tmp0_iterator_1 = planets.iterator_jk1svi_k$();
        while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
          var element_0 = tmp0_iterator_1.next_20eer_k$();
          // Inline function 'kp.astro.computeHorary.<anonymous>' call
          if (element_0.get_first_irdx8n_k$().equals(Planet_Rahu_getInstance())) {
            tmp$ret$6 = element_0;
            break $l$block_0;
          }
        }
        throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
      }
      var rahuPos = tmp$ret$6.get_second_jf7fjx_k$();
      var rahuSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(rahuPos).get_owner_iwkx3e_k$();
      var tmp$ret$8;
      $l$block_1: {
        // Inline function 'kotlin.collections.first' call
        var tmp0_iterator_2 = planets.iterator_jk1svi_k$();
        while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
          var element_1 = tmp0_iterator_2.next_20eer_k$();
          // Inline function 'kp.astro.computeHorary.<anonymous>' call
          if (element_1.get_first_irdx8n_k$().equals(Planet_Ketu_getInstance())) {
            tmp$ret$8 = element_1;
            break $l$block_1;
          }
        }
        throw NoSuchElementException_init_$Create$('Collection contains no element matching the predicate.');
      }
      var ketuPos = tmp$ret$8.get_second_jf7fjx_k$();
      var ketuSignLord = Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$(ketuPos).get_owner_iwkx3e_k$();
      var rp = rulingPlanetsWithAgents(dayLord, ensureNotNull(planetToDashaLord(moonSignLord)), moonSig.get_starLord_a1nf0w_k$(), ensureNotNull(planetToDashaLord(lagnaSignLord)), lagnaSig.get_starLord_a1nf0w_k$(), planetToDashaLord(rahuSignLord), planetToDashaLord(ketuSignLord));
      append(container, computeHorary$lambda(kpNum, moonDeg, horaryInput, hour, jd, ascDeg, rp, events, cusps, planets, cuspal));
    } catch ($p) {
      if ($p instanceof Error) {
        var e = $p;
        console.error('Horary failed', e);
        append(container, computeHorary$lambda_0(e));
      } else {
        throw $p;
      }
    }
  }
  function renderDebugOutput(chart) {
    var tmp0_elvis_lhs = document.getElementById('debug-output');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var container = tmp;
    container.innerHTML = '';
    var input = chart.input_1;
    var jd = chart.jd_1;
    var lst = localSiderealTime(jd, input.lon_1);
    var nutLon = nutationLongitude(jd);
    var nutObl = nutationObliquity(jd);
    var obliquity = trueObliquity(jd);
    // Inline function 'kotlin.collections.mutableListOf' call
    var lines = ArrayList_init_$Create$();
    // Inline function 'kotlin.collections.plusAssign' call
    var element = to('JD\uFF08\u5112\u7565\u65E5\uFF09', formatDouble(jd, 6));
    lines.add_utx5q5_k$(element);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_0 = to('Julian Century T', formatDouble((jd - 2451545.0) / 36525.0, 8));
    lines.add_utx5q5_k$(element_0);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_1 = to('\u5730\u65B9\u6052\u661F\u65F6 LST', formatDegree(lst));
    lines.add_utx5q5_k$(element_1);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_2 = to('\u771F\u9EC4\u8D64\u4EA4\u89D2', formatDouble(obliquity, 6) + '\xB0');
    lines.add_utx5q5_k$(element_2);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_3 = to('\u9EC4\u7ECF\u7AE0\u52A8 \u0394\u03C8', formatDouble(nutLon, 6) + '\xB0');
    lines.add_utx5q5_k$(element_3);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_4 = to('\u4EA4\u89D2\u7AE0\u52A8 \u0394\u03B5', formatDouble(nutObl, 6) + '\xB0');
    lines.add_utx5q5_k$(element_4);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_5 = to('\u5C81\u5DEE\u503C', formatDouble(chart.ayanamsa_1, 6) + '\xB0');
    lines.add_utx5q5_k$(element_5);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_6 = to('\u4E0A\u5347\u70B9\uFF08\u6052\u661F\uFF09', formatDegree(chart.ascSidereal_1));
    lines.add_utx5q5_k$(element_6);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_7 = to('\u4E2D\u5929 MC\uFF08\u6052\u661F\uFF09', formatDegree(chart.mcSidereal_1));
    lines.add_utx5q5_k$(element_7);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_8 = to('\u5BAB\u4F4D\u5236', input.houseSystem_1.displayName_1);
    lines.add_utx5q5_k$(element_8);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_9 = to('\u8986\u76D6\u884C\u661F\u6570', input.planetOverrides_1.get_size_woubt6_k$().toString());
    lines.add_utx5q5_k$(element_9);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_10 = to('\u8986\u76D6\u5BAB\u9996', !(input.cuspOverrides_1 == null) ? '\u662F\uFF0812 \u4E2A\uFF09' : '\u5426');
    lines.add_utx5q5_k$(element_10);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_11 = to('', '');
    lines.add_utx5q5_k$(element_11);
    // Inline function 'kotlin.collections.plusAssign' call
    var element_12 = to('=== \u884C\u661F\u77AC\u65F6\u89D2\u901F\u5EA6\uFF08\u5EA6/\u5929\uFF0C\u8D1F\u503C=\u9006\u884C\uFF09 ===', '');
    lines.add_utx5q5_k$(element_12);
    var _iterator__ex2g4s = Companion_getInstance_0().get_VEDIC_NINE_7vwslx_k$().iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var p = _iterator__ex2g4s.next_20eer_k$();
      var speed = p.equals(Planet_Rahu_getInstance()) || p.equals(Planet_Ketu_getInstance()) ? -0.05295 : planetAngularSpeed(p, jd);
      var retro = speed < 0 ? 'R' : 'D';
      // Inline function 'kotlin.collections.plusAssign' call
      var element_13 = to(p.get_displayName_sscnb0_k$() + '\uFF08' + p.get_symbol_jqdfoh_k$() + '\uFF09', formatDouble(speed, 6) + ' \xB0/\u5929 [' + retro + ']');
      lines.add_utx5q5_k$(element_13);
    }
    append(container, renderDebugOutput$lambda(lines));
  }
  function exportChartJson() {
    var input = readInput();
    var chart = computeChart(input);
    // Inline function 'kotlin.text.buildString' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.apply' call
    var this_0 = StringBuilder_init_$Create$();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kp.astro.exportChartJson.<anonymous>' call
    this_0.append_22ad7x_k$('{\n');
    this_0.append_22ad7x_k$('  "version": "2.0",\n');
    this_0.append_22ad7x_k$('  "input": {\n');
    this_0.append_22ad7x_k$('    "year": ' + input.year_1 + ',\n');
    this_0.append_22ad7x_k$('    "month": ' + input.month_1 + ',\n');
    this_0.append_22ad7x_k$('    "day": ' + input.day_1 + ',\n');
    this_0.append_22ad7x_k$('    "hour": ' + input.hour_1 + ',\n');
    this_0.append_22ad7x_k$('    "lat": ' + input.lat_1 + ',\n');
    this_0.append_22ad7x_k$('    "lon": ' + input.lon_1 + ',\n');
    this_0.append_22ad7x_k$('    "ayanamsaType": "' + input.ayanamsaType_1.get_name_woqyms_k$() + '",\n');
    this_0.append_22ad7x_k$('    "customAyanamsa": ' + input.customAyanamsa_1 + ',\n');
    this_0.append_22ad7x_k$('    "houseSystem": "' + input.houseSystem_1.get_name_woqyms_k$() + '",\n');
    var tmp0_elvis_lhs = input.ascendantOverride_1;
    this_0.append_22ad7x_k$('    "ascendantOverride": ' + toString(tmp0_elvis_lhs == null ? 'null' : tmp0_elvis_lhs) + ',\n');
    this_0.append_22ad7x_k$('    "planetOverrides": {');
    if (input.planetOverrides_1.isEmpty_y1axqb_k$()) {
      this_0.append_22ad7x_k$('},\n');
    } else {
      this_0.append_22ad7x_k$('\n');
      // Inline function 'kotlin.collections.forEachIndexed' call
      var index = 0;
      var tmp0_iterator = input.planetOverrides_1.get_entries_p20ztl_k$().iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var item = tmp0_iterator.next_20eer_k$();
        // Inline function 'kp.astro.exportChartJson.<anonymous>.<anonymous>' call
        var tmp1 = index;
        index = tmp1 + 1 | 0;
        var i = checkIndexOverflow(tmp1);
        // Inline function 'kotlin.collections.component1' call
        var p = item.get_key_18j28a_k$();
        // Inline function 'kotlin.collections.component2' call
        var v = item.get_value_j01efc_k$();
        var comma = i < (input.planetOverrides_1.get_size_woubt6_k$() - 1 | 0) ? ',' : '';
        this_0.append_22ad7x_k$('      "' + p.get_name_woqyms_k$() + '": ' + v + comma + '\n');
      }
      this_0.append_22ad7x_k$('    },\n');
    }
    this_0.append_22ad7x_k$('    "cuspOverrides": ');
    if (input.cuspOverrides_1 == null)
      this_0.append_22ad7x_k$('null\n');
    else {
      this_0.append_22ad7x_k$('[');
      this_0.append_22ad7x_k$(joinToString(input.cuspOverrides_1, ', '));
      this_0.append_22ad7x_k$(']\n');
    }
    this_0.append_22ad7x_k$('  },\n');
    this_0.append_22ad7x_k$('  "computed": {\n');
    this_0.append_22ad7x_k$('    "jd": ' + chart.jd_1 + ',\n');
    this_0.append_22ad7x_k$('    "ayanamsa": ' + chart.ayanamsa_1 + ',\n');
    this_0.append_22ad7x_k$('    "ascSidereal": ' + chart.ascSidereal_1 + ',\n');
    this_0.append_22ad7x_k$('    "mcSidereal": ' + chart.mcSidereal_1 + ',\n');
    this_0.append_22ad7x_k$('    "cusps": [' + joinToString(chart.cusps_1, ', ') + '],\n');
    this_0.append_22ad7x_k$('    "planets": {\n');
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_0 = 0;
    var tmp0_iterator_0 = chart.planets_1.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var item_0 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'kp.astro.exportChartJson.<anonymous>.<anonymous>' call
      var tmp1_0 = index_0;
      index_0 = tmp1_0 + 1 | 0;
      var i_0 = checkIndexOverflow(tmp1_0);
      var p_0 = item_0.component1_7eebsc_k$();
      var deg = item_0.component2_7eebsb_k$();
      var comma_0 = i_0 < (chart.planets_1.get_size_woubt6_k$() - 1 | 0) ? ',' : '';
      this_0.append_22ad7x_k$('      "' + p_0.get_name_woqyms_k$() + '": ' + deg + comma_0 + '\n');
    }
    this_0.append_22ad7x_k$('    },\n');
    this_0.append_22ad7x_k$('    "retrogrades": {\n');
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_1 = 0;
    var tmp0_iterator_1 = chart.retrogrades_1.get_entries_p20ztl_k$().iterator_jk1svi_k$();
    while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
      var item_1 = tmp0_iterator_1.next_20eer_k$();
      // Inline function 'kp.astro.exportChartJson.<anonymous>.<anonymous>' call
      var tmp1_1 = index_1;
      index_1 = tmp1_1 + 1 | 0;
      var i_1 = checkIndexOverflow(tmp1_1);
      // Inline function 'kotlin.collections.component1' call
      var p_1 = item_1.get_key_18j28a_k$();
      // Inline function 'kotlin.collections.component2' call
      var r = item_1.get_value_j01efc_k$();
      var comma_1 = i_1 < (chart.retrogrades_1.get_size_woubt6_k$() - 1 | 0) ? ',' : '';
      this_0.append_22ad7x_k$('      "' + p_1.get_name_woqyms_k$() + '": ' + r + comma_1 + '\n');
    }
    this_0.append_22ad7x_k$('    }\n');
    this_0.append_22ad7x_k$('  }\n');
    this_0.append_22ad7x_k$('}\n');
    var json = this_0.toString();
    var tmp = document.createElement('textarea');
    var ta = tmp instanceof HTMLTextAreaElement ? tmp : THROW_CCE();
    ta.value = json;
    var tmp0_safe_receiver = document.body;
    if (tmp0_safe_receiver == null)
      null;
    else
      tmp0_safe_receiver.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    var tmp1_safe_receiver = document.body;
    if (tmp1_safe_receiver == null)
      null;
    else
      tmp1_safe_receiver.removeChild(ta);
    window.alert('\u661F\u76D8 JSON \u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF08' + json.length + ' \u5B57\u7B26\uFF09\u3002');
  }
  function importChartJson() {
    var tmp0_elvis_lhs = window.prompt('\u7C98\u8D34\u661F\u76D8 JSON\uFF08\u4EC5 input \u90E8\u5206\u4F1A\u88AB\u8BFB\u53D6\uFF09', '');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var text = tmp;
    try {
      var parsed = JSON.parse(text);
      var tmp1_elvis_lhs = parsed['input'];
      var input = tmp1_elvis_lhs == null ? parsed : tmp1_elvis_lhs;
      var tmp_0 = input['year'];
      var tmp2_safe_receiver = isNumber(tmp_0) ? tmp_0 : null;
      var year = tmp2_safe_receiver == null ? null : numberToInt(tmp2_safe_receiver);
      var tmp_1 = input['month'];
      var tmp3_safe_receiver = isNumber(tmp_1) ? tmp_1 : null;
      var month = tmp3_safe_receiver == null ? null : numberToInt(tmp3_safe_receiver);
      var tmp_2 = input['day'];
      var tmp4_safe_receiver = isNumber(tmp_2) ? tmp_2 : null;
      var day = tmp4_safe_receiver == null ? null : numberToInt(tmp4_safe_receiver);
      var tmp_3 = input['hour'];
      var tmp5_safe_receiver = isNumber(tmp_3) ? tmp_3 : null;
      var hour = tmp5_safe_receiver == null ? null : numberToDouble(tmp5_safe_receiver);
      var tmp_4 = input['lat'];
      var tmp6_safe_receiver = isNumber(tmp_4) ? tmp_4 : null;
      var lat = tmp6_safe_receiver == null ? null : numberToDouble(tmp6_safe_receiver);
      var tmp_5 = input['lon'];
      var tmp7_safe_receiver = isNumber(tmp_5) ? tmp_5 : null;
      var lon = tmp7_safe_receiver == null ? null : numberToDouble(tmp7_safe_receiver);
      var tmp_6 = input['ayanamsaType'];
      var ayaType = (!(tmp_6 == null) ? typeof tmp_6 === 'string' : false) ? tmp_6 : null;
      var tmp_7 = input['customAyanamsa'];
      var tmp8_safe_receiver = isNumber(tmp_7) ? tmp_7 : null;
      var customAya = tmp8_safe_receiver == null ? null : numberToDouble(tmp8_safe_receiver);
      var tmp_8 = input['houseSystem'];
      var houseSys = (!(tmp_8 == null) ? typeof tmp_8 === 'string' : false) ? tmp_8 : null;
      var tmp_9 = input['ascendantOverride'];
      var tmp9_safe_receiver = isNumber(tmp_9) ? tmp_9 : null;
      var ascOverride = tmp9_safe_receiver == null ? null : numberToDouble(tmp9_safe_receiver);
      if (!(year == null)) {
        var tmp_10 = document.getElementById('year');
        (tmp_10 instanceof HTMLInputElement ? tmp_10 : THROW_CCE()).value = year.toString();
      }
      if (!(month == null)) {
        var tmp_11 = document.getElementById('month');
        (tmp_11 instanceof HTMLInputElement ? tmp_11 : THROW_CCE()).value = month.toString();
      }
      if (!(day == null)) {
        var tmp_12 = document.getElementById('day');
        (tmp_12 instanceof HTMLInputElement ? tmp_12 : THROW_CCE()).value = day.toString();
      }
      if (!(hour == null)) {
        var tmp_13 = document.getElementById('hour');
        (tmp_13 instanceof HTMLInputElement ? tmp_13 : THROW_CCE()).value = hour.toString();
      }
      if (!(lat == null)) {
        var tmp_14 = document.getElementById('lat');
        (tmp_14 instanceof HTMLInputElement ? tmp_14 : THROW_CCE()).value = lat.toString();
      }
      if (!(lon == null)) {
        var tmp_15 = document.getElementById('lon');
        (tmp_15 instanceof HTMLInputElement ? tmp_15 : THROW_CCE()).value = lon.toString();
      }
      if (!(ayaType == null)) {
        var tmp_16 = document.getElementById('ayanamsa-type');
        (tmp_16 instanceof HTMLSelectElement ? tmp_16 : THROW_CCE()).value = ayaType;
      }
      if (!(customAya == null)) {
        var tmp_17 = document.getElementById('custom-ayanamsa');
        (tmp_17 instanceof HTMLInputElement ? tmp_17 : THROW_CCE()).value = customAya.toString();
      }
      if (!(houseSys == null)) {
        var tmp_18 = document.getElementById('house-system');
        (tmp_18 instanceof HTMLSelectElement ? tmp_18 : THROW_CCE()).value = houseSys;
      }
      if (!(ascOverride == null)) {
        var tmp_19 = document.getElementById('asc-override');
        (tmp_19 instanceof HTMLInputElement ? tmp_19 : THROW_CCE()).value = ascOverride.toString();
      }
      var planetOverrides = input['planetOverrides'];
      if (planetOverrides != null) {
        var _iterator__ex2g4s = get_entries_0().iterator_jk1svi_k$();
        while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
          var p = _iterator__ex2g4s.next_20eer_k$();
          var tmp_20 = planetOverrides[p.get_name_woqyms_k$()];
          var tmp10_safe_receiver = isNumber(tmp_20) ? tmp_20 : null;
          var v = tmp10_safe_receiver == null ? null : numberToDouble(tmp10_safe_receiver);
          if (!(v == null)) {
            var tmp_21 = document.getElementById('override-planet-' + p.get_name_woqyms_k$());
            var tmp11_safe_receiver = tmp_21 instanceof HTMLInputElement ? tmp_21 : null;
            if (tmp11_safe_receiver == null)
              null;
            else {
              tmp11_safe_receiver.value = v.toString();
            }
          }
        }
      }
      var cuspOverrides = input['cuspOverrides'];
      if (cuspOverrides != null && typeof cuspOverrides === 'object') {
        var arr = (!(cuspOverrides == null) ? isArray(cuspOverrides) : false) ? cuspOverrides : THROW_CCE();
        if (arr.length === 12) {
          var inductionVariable = 0;
          if (inductionVariable < 12)
            do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              var v_0 = numberToDouble(arr[i]);
              var tmp_22 = document.getElementById('override-cusp-' + (i + 1 | 0));
              var tmp12_safe_receiver = tmp_22 instanceof HTMLInputElement ? tmp_22 : null;
              if (tmp12_safe_receiver == null)
                null;
              else {
                tmp12_safe_receiver.value = v_0.toString();
              }
            }
             while (inductionVariable < 12);
        }
      }
      window.alert('\u5DF2\u5BFC\u5165\u661F\u76D8\u914D\u7F6E\u3002\u70B9\u51FB\u300C\u6392 KP \u661F\u76D8\u300D\u5373\u53EF\u3002');
    } catch ($p) {
      if ($p instanceof Error) {
        var e = $p;
        window.alert('JSON \u89E3\u6790\u5931\u8D25\uFF1A' + e.message);
      } else {
        throw $p;
      }
    }
  }
  function clearOverrides() {
    var _iterator__ex2g4s = get_entries_0().iterator_jk1svi_k$();
    while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
      var p = _iterator__ex2g4s.next_20eer_k$();
      var tmp = document.getElementById('override-planet-' + p.get_name_woqyms_k$());
      var tmp0_safe_receiver = tmp instanceof HTMLInputElement ? tmp : null;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.value = '';
      }
    }
    var inductionVariable = 1;
    if (inductionVariable <= 12)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp_0 = document.getElementById('override-cusp-' + i);
        var tmp1_safe_receiver = tmp_0 instanceof HTMLInputElement ? tmp_0 : null;
        if (tmp1_safe_receiver == null)
          null;
        else {
          tmp1_safe_receiver.value = '';
        }
      }
       while (inductionVariable <= 12);
    var tmp_1 = document.getElementById('asc-override');
    var tmp2_safe_receiver = tmp_1 instanceof HTMLInputElement ? tmp_1 : null;
    if (tmp2_safe_receiver == null)
      null;
    else {
      tmp2_safe_receiver.value = '';
    }
  }
  function computeCusps$arc(start, end, n) {
    var s = (start % 360.0 + 360.0) % 360.0;
    var e = (end % 360.0 + 360.0) % 360.0;
    var span = e - s;
    if (span < 0)
      span = span + 360.0;
    // Inline function 'kotlin.collections.map' call
    var this_0 = until(1, n);
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
    var inductionVariable = this_0.get_first_irdx8n_k$();
    var last = this_0.get_last_wopotb_k$();
    if (inductionVariable <= last)
      do {
        var item = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kp.astro.computeCusps.arc.<anonymous>' call
        var tmp$ret$0 = (s + span * item / n) % 360.0;
        destination.add_utx5q5_k$(tmp$ret$0);
      }
       while (!(item === last));
    return destination;
  }
  function setupAyanamsaToggle$lambda($custom, $sel) {
    return function (_unused_var__etf5q3) {
      $custom.disabled = !($sel.value === 'Custom');
      return Unit_getInstance();
    };
  }
  function renderApp$lambda($this$append) {
    // Inline function 'kotlinx.html.js.div' call
    var classes = 'app-container';
    // Inline function 'kotlinx.html.visitAndFinalize' call
    // Inline function 'kotlinx.html.visitTagAndFinalize' call
    var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
    if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
      throw IllegalArgumentException_init_$Create$('Wrong exception');
    }
    // Inline function 'kotlinx.html.visitTag' call
    this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
    // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.div' call
    var classes_0 = 'app-header';
    // Inline function 'kotlinx.html.visit' call
    var this_1 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
    this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.h1' call
    // Inline function 'kotlinx.html.visit' call
    var this_2 = new H1(attributesMapOf('class', null), this_1.get_consumer_tu5133_k$());
    this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    this_2.unaryPlus_76unot_k$('KP \u5360\u661F \xB7 v2.0');
    this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
    // Inline function 'kotlinx.html.p' call
    var classes_1 = 'subtitle';
    // Inline function 'kotlinx.html.visit' call
    var this_3 = new P(attributesMapOf('class', classes_1), this_1.get_consumer_tu5133_k$());
    this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    this_3.unaryPlus_76unot_k$('Kotlin/JS \u79FB\u690D\u81EA ');
    // Inline function 'kotlinx.html.a' call
    // Inline function 'kotlinx.html.visit' call
    var this_4 = new A(attributesMapOf_0(['href', null, 'target', null, 'class', null]), this_3.get_consumer_tu5133_k$());
    this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    this_4.set_href_tj891e_k$('https://github.com/vedika-io/xalen-ephemeris');
    this_4.set_target_hzgw84_k$('_blank');
    this_4.unaryPlus_76unot_k$('xalen-ephemeris');
    this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
    this_3.unaryPlus_76unot_k$(' \xB7 249 \u5B50\u533A \xB7 \u771F\u661F\u5386 VSOP87 \xB7 Dasha \u65F6\u95F4\u8F74 \xB7 Horary \u95EE\u535C \xB7 \u8C03\u8BD5\u9762\u677F');
    this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
    this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
    // Inline function 'kotlinx.html.div' call
    // Inline function 'kotlinx.html.visit' call
    var this_5 = new DIV(attributesMapOf('class', 'tab-nav'), this_0.get_consumer_tu5133_k$());
    this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.button' call
    var type = ButtonType_button_getInstance();
    var classes_2 = 'tab-btn active';
    // Inline function 'kotlinx.html.visit' call
    var tmp = null == null ? null : enumEncode(null);
    var tmp_0 = null == null ? null : enumEncode(null);
    var this_6 = new BUTTON(attributesMapOf_0(['formenctype', tmp, 'formmethod', tmp_0, 'name', null, 'type', type == null ? null : enumEncode(type), 'class', classes_2]), this_5.get_consumer_tu5133_k$());
    this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_6, 'tab-chart');
    this_6.unaryPlus_76unot_k$('\u661F\u76D8');
    set_onClickFunction(this_6, renderApp$lambda$lambda);
    this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
    // Inline function 'kotlinx.html.button' call
    // Inline function 'kotlinx.html.visit' call
    var tmp_1 = null == null ? null : enumEncode(null);
    var tmp_2 = null == null ? null : enumEncode(null);
    var tmp2_safe_receiver = ButtonType_button_getInstance();
    var this_7 = new BUTTON(attributesMapOf_0(['formenctype', tmp_1, 'formmethod', tmp_2, 'name', null, 'type', tmp2_safe_receiver == null ? null : enumEncode(tmp2_safe_receiver), 'class', 'tab-btn']), this_5.get_consumer_tu5133_k$());
    this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_7, 'tab-dasha');
    this_7.unaryPlus_76unot_k$('\u5927\u8FD0 / Dasha');
    set_onClickFunction(this_7, renderApp$lambda$lambda_0);
    this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
    // Inline function 'kotlinx.html.button' call
    // Inline function 'kotlinx.html.visit' call
    var tmp_3 = null == null ? null : enumEncode(null);
    var tmp_4 = null == null ? null : enumEncode(null);
    var tmp2_safe_receiver_0 = ButtonType_button_getInstance();
    var this_8 = new BUTTON(attributesMapOf_0(['formenctype', tmp_3, 'formmethod', tmp_4, 'name', null, 'type', tmp2_safe_receiver_0 == null ? null : enumEncode(tmp2_safe_receiver_0), 'class', 'tab-btn']), this_5.get_consumer_tu5133_k$());
    this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_8, 'tab-horary');
    this_8.unaryPlus_76unot_k$('Horary \u95EE\u535C');
    set_onClickFunction(this_8, renderApp$lambda$lambda_1);
    this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
    // Inline function 'kotlinx.html.button' call
    // Inline function 'kotlinx.html.visit' call
    var tmp_5 = null == null ? null : enumEncode(null);
    var tmp_6 = null == null ? null : enumEncode(null);
    var tmp2_safe_receiver_1 = ButtonType_button_getInstance();
    var this_9 = new BUTTON(attributesMapOf_0(['formenctype', tmp_5, 'formmethod', tmp_6, 'name', null, 'type', tmp2_safe_receiver_1 == null ? null : enumEncode(tmp2_safe_receiver_1), 'class', 'tab-btn']), this_5.get_consumer_tu5133_k$());
    this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_9, 'tab-debug');
    this_9.unaryPlus_76unot_k$('\u8C03\u8BD5\u9762\u677F');
    set_onClickFunction(this_9, renderApp$lambda$lambda_2);
    this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
    this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
    // Inline function 'kotlinx.html.div' call
    var classes_3 = 'main-grid';
    // Inline function 'kotlinx.html.visit' call
    var this_10 = new DIV(attributesMapOf('class', classes_3), this_0.get_consumer_tu5133_k$());
    this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>' call
    // Inline function 'kotlinx.html.div' call
    var classes_4 = 'left-panel';
    // Inline function 'kotlinx.html.visit' call
    var this_11 = new DIV(attributesMapOf('class', classes_4), this_10.get_consumer_tu5133_k$());
    this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_11, 'left-panel');
    renderInputPanel(this_11);
    this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
    // Inline function 'kotlinx.html.div' call
    var classes_5 = 'right-panel';
    // Inline function 'kotlinx.html.visit' call
    var this_12 = new DIV(attributesMapOf('class', classes_5), this_10.get_consumer_tu5133_k$());
    this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_12, 'right-panel');
    // Inline function 'kotlinx.html.div' call
    var classes_6 = 'tab-content active';
    // Inline function 'kotlinx.html.visit' call
    var this_13 = new DIV(attributesMapOf('class', classes_6), this_12.get_consumer_tu5133_k$());
    this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_13, 'content-chart');
    // Inline function 'kotlinx.html.div' call
    var classes_7 = 'placeholder';
    // Inline function 'kotlinx.html.visit' call
    var this_14 = new DIV(attributesMapOf('class', classes_7), this_13.get_consumer_tu5133_k$());
    this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    this_14.unaryPlus_76unot_k$('\u8BF7\u5728\u5DE6\u4FA7\u8F93\u5165\u51FA\u751F\u8D44\u6599\uFF0C\u70B9\u51FB\u300C\u6392 KP \u661F\u76D8\u300D\u67E5\u770B\u7ED3\u679C\u3002');
    this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
    this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
    // Inline function 'kotlinx.html.div' call
    var classes_8 = 'tab-content';
    // Inline function 'kotlinx.html.visit' call
    var this_15 = new DIV(attributesMapOf('class', classes_8), this_12.get_consumer_tu5133_k$());
    this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_15, 'content-dasha');
    // Inline function 'kotlinx.html.div' call
    var classes_9 = 'placeholder';
    // Inline function 'kotlinx.html.visit' call
    var this_16 = new DIV(attributesMapOf('class', classes_9), this_15.get_consumer_tu5133_k$());
    this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    this_16.unaryPlus_76unot_k$('\u6392\u76D8\u540E\u6B64\u5904\u663E\u793A Vimshottari Dasha \u65F6\u95F4\u8F74\u3002');
    this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
    this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
    // Inline function 'kotlinx.html.div' call
    var classes_10 = 'tab-content';
    // Inline function 'kotlinx.html.visit' call
    var this_17 = new DIV(attributesMapOf('class', classes_10), this_12.get_consumer_tu5133_k$());
    this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_17, 'content-horary');
    renderHoraryPanel(this_17);
    this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
    // Inline function 'kotlinx.html.div' call
    var classes_11 = 'tab-content';
    // Inline function 'kotlinx.html.visit' call
    var this_18 = new DIV(attributesMapOf('class', classes_11), this_12.get_consumer_tu5133_k$());
    this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
    // Inline function 'kotlinx.html.visit.<anonymous>' call
    // Inline function 'kp.astro.renderApp.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
    set_id(this_18, 'content-debug');
    renderDebugPanel(this_18);
    this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
    this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
    this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
    this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
    var tmp_7 = $this$append.finalize_b9lof6_k$();
    tmp_7 instanceof HTMLDivElement || THROW_CCE();
    return Unit_getInstance();
  }
  function renderApp$lambda$lambda(it) {
    switchTab('chart');
    return Unit_getInstance();
  }
  function renderApp$lambda$lambda_0(it) {
    switchTab('dasha');
    return Unit_getInstance();
  }
  function renderApp$lambda$lambda_1(it) {
    switchTab('horary');
    return Unit_getInstance();
  }
  function renderApp$lambda$lambda_2(it) {
    switchTab('debug');
    return Unit_getInstance();
  }
  function renderInputPanel$lambda(it) {
    computeAndRender();
    return Unit_getInstance();
  }
  function renderInputPanel$lambda_0(it) {
    exportChartJson();
    return Unit_getInstance();
  }
  function renderInputPanel$lambda_1(it) {
    importChartJson();
    return Unit_getInstance();
  }
  function renderInputPanel$lambda_2($coords) {
    return function (it) {
      var tmp = document.getElementById('lat');
      (tmp instanceof HTMLInputElement ? tmp : THROW_CCE()).value = $coords.get_first_irdx8n_k$().toString();
      var tmp_0 = document.getElementById('lon');
      (tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE()).value = $coords.get_second_jf7fjx_k$().toString();
      return Unit_getInstance();
    };
  }
  function renderHoraryPanel$lambda(it) {
    computeHorary();
    return Unit_getInstance();
  }
  function renderDebugPanel$lambda(it) {
    clearOverrides();
    return Unit_getInstance();
  }
  function renderDebugPanel$lambda_0(it) {
    computeAndRender();
    return Unit_getInstance();
  }
  function computeAndRender$lambda($e) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'error-card';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.computeAndRender.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h3' call
      // Inline function 'kotlinx.html.visit' call
      var this_1 = new H3(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
      this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeAndRender.<anonymous>.<anonymous>.<anonymous>' call
      this_1.unaryPlus_76unot_k$('\u8BA1\u7B97\u9519\u8BEF');
      this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
      // Inline function 'kotlinx.html.pre' call
      // Inline function 'kotlinx.html.visit' call
      var this_2 = new PRE(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
      this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeAndRender.<anonymous>.<anonymous>.<anonymous>' call
      var tmp0_elvis_lhs = $e.message;
      this_2.unaryPlus_76unot_k$(tmp0_elvis_lhs == null ? $e.toString() : tmp0_elvis_lhs);
      this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp = $this$append.finalize_b9lof6_k$();
      tmp instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function renderChartTab$lambda($input, $chart, $dayLord, $cuspal, $sigs, $rp, $events) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'results-container';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.div' call
      var classes_0 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_1 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
      this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_2 = new H2(attributesMapOf('class', null), this_1.get_consumer_tu5133_k$());
      this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_2.unaryPlus_76unot_k$('\u661F\u76D8\u6982\u8981');
      this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
      // Inline function 'kotlinx.html.div' call
      var classes_1 = 'summary-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_3 = new DIV(attributesMapOf('class', classes_1), this_1.get_consumer_tu5133_k$());
      this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.div' call
      var classes_2 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_4 = new DIV(attributesMapOf('class', classes_2), this_3.get_consumer_tu5133_k$());
      this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_5 = new STRONG(attributesMapOf('class', null), this_4.get_consumer_tu5133_k$());
      this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_5.unaryPlus_76unot_k$('\u51FA\u751F\u65F6\u523B');
      this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_6 = new SPAN(attributesMapOf('class', null), this_4.get_consumer_tu5133_k$());
      this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_6.unaryPlus_76unot_k$('' + $input.year_1 + '-' + padStart($input.month_1.toString(), 2, _Char___init__impl__6a9atx(48)) + '-' + padStart($input.day_1.toString(), 2, _Char___init__impl__6a9atx(48)) + ' ' + formatHour($input.hour_1) + ' UT');
      this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
      this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
      // Inline function 'kotlinx.html.div' call
      var classes_3 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_7 = new DIV(attributesMapOf('class', classes_3), this_3.get_consumer_tu5133_k$());
      this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_8 = new STRONG(attributesMapOf('class', null), this_7.get_consumer_tu5133_k$());
      this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_8.unaryPlus_76unot_k$('\u7EAC/\u7ECF\u5EA6');
      this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_9 = new SPAN(attributesMapOf('class', null), this_7.get_consumer_tu5133_k$());
      this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_9.unaryPlus_76unot_k$('' + $input.lat_1 + '\xB0, ' + $input.lon_1 + '\xB0');
      this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
      this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
      // Inline function 'kotlinx.html.div' call
      var classes_4 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_10 = new DIV(attributesMapOf('class', classes_4), this_3.get_consumer_tu5133_k$());
      this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_11 = new STRONG(attributesMapOf('class', null), this_10.get_consumer_tu5133_k$());
      this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_11.unaryPlus_76unot_k$('\u5112\u7565\u65E5');
      this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_12 = new SPAN(attributesMapOf('class', null), this_10.get_consumer_tu5133_k$());
      this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_12.unaryPlus_76unot_k$(formatDouble($chart.jd_1, 4));
      this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
      this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
      // Inline function 'kotlinx.html.div' call
      var classes_5 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_13 = new DIV(attributesMapOf('class', classes_5), this_3.get_consumer_tu5133_k$());
      this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_14 = new STRONG(attributesMapOf('class', null), this_13.get_consumer_tu5133_k$());
      this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_14.unaryPlus_76unot_k$('\u5C81\u5DEE');
      this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_15 = new SPAN(attributesMapOf('class', null), this_13.get_consumer_tu5133_k$());
      this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_15.unaryPlus_76unot_k$(formatDouble($chart.ayanamsa_1, 4) + '\xB0 (' + take($input.ayanamsaType_1.get_displayName_sscnb0_k$(), 10) + ')');
      this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
      this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
      // Inline function 'kotlinx.html.div' call
      var classes_6 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_16 = new DIV(attributesMapOf('class', classes_6), this_3.get_consumer_tu5133_k$());
      this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_17 = new STRONG(attributesMapOf('class', null), this_16.get_consumer_tu5133_k$());
      this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_17.unaryPlus_76unot_k$('\u4E0A\u5347\u70B9');
      this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_18 = new SPAN(attributesMapOf('class', null), this_16.get_consumer_tu5133_k$());
      this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_18.unaryPlus_76unot_k$(formatSignDeg($chart.ascSidereal_1));
      this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
      this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
      // Inline function 'kotlinx.html.div' call
      var classes_7 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_19 = new DIV(attributesMapOf('class', classes_7), this_3.get_consumer_tu5133_k$());
      this_19.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_19);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_20 = new STRONG(attributesMapOf('class', null), this_19.get_consumer_tu5133_k$());
      this_20.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_20);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_20.unaryPlus_76unot_k$('\u4E2D\u5929\uFF08MC\uFF09');
      this_20.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_20);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_21 = new SPAN(attributesMapOf('class', null), this_19.get_consumer_tu5133_k$());
      this_21.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_21);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_21.unaryPlus_76unot_k$(formatSignDeg($chart.mcSidereal_1));
      this_21.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_21);
      this_19.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_19);
      // Inline function 'kotlinx.html.div' call
      var classes_8 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_22 = new DIV(attributesMapOf('class', classes_8), this_3.get_consumer_tu5133_k$());
      this_22.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_22);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_23 = new STRONG(attributesMapOf('class', null), this_22.get_consumer_tu5133_k$());
      this_23.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_23);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_23.unaryPlus_76unot_k$('\u65E5\u4E3B');
      this_23.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_23);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_24 = new SPAN(attributesMapOf('class', null), this_22.get_consumer_tu5133_k$());
      this_24.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_24);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_24.unaryPlus_76unot_k$($dayLord.get_displayName_sscnb0_k$());
      this_24.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_24);
      this_22.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_22);
      // Inline function 'kotlinx.html.div' call
      var classes_9 = 'summary-cell';
      // Inline function 'kotlinx.html.visit' call
      var this_25 = new DIV(attributesMapOf('class', classes_9), this_3.get_consumer_tu5133_k$());
      this_25.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_25);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.strong' call
      // Inline function 'kotlinx.html.visit' call
      var this_26 = new STRONG(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
      this_26.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_26);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_26.unaryPlus_76unot_k$('\u5BAB\u4F4D\u5236');
      this_26.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_26);
      // Inline function 'kotlinx.html.span' call
      // Inline function 'kotlinx.html.visit' call
      var this_27 = new SPAN(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
      this_27.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_27);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_27.unaryPlus_76unot_k$(take($input.houseSystem_1.displayName_1, 8));
      this_27.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_27);
      this_25.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_25);
      this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
      this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
      // Inline function 'kotlinx.html.div' call
      var classes_10 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_28 = new DIV(attributesMapOf('class', classes_10), this_0.get_consumer_tu5133_k$());
      this_28.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_28);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_29 = new H2(attributesMapOf('class', null), this_28.get_consumer_tu5133_k$());
      this_29.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_29);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_29.unaryPlus_76unot_k$('\u884C\u661F KP \u4F4D\u7F6E');
      this_29.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_29);
      // Inline function 'kotlinx.html.p' call
      var classes_11 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_30 = new P(attributesMapOf('class', classes_11), this_28.get_consumer_tu5133_k$());
      this_30.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_30);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_30.unaryPlus_76unot_k$('\u771F\u661F\u5386 VSOP87\uFF08\u7CBE\u5EA6 <0.1\xB0-0.3\xB0\uFF09\u3002\u9006\u884C\u6807 R\u3002\u624B\u52A8\u8986\u76D6\u503C\u5728\u8C03\u8BD5\u9762\u677F\u8BBE\u7F6E\u3002');
      this_30.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_30);
      // Inline function 'kotlinx.html.div' call
      var classes_12 = 'item-card-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_31 = new DIV(attributesMapOf('class', classes_12), this_28.get_consumer_tu5133_k$());
      this_31.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_31);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var kpChart = new KpChart($chart.cusps_1, $chart.planets_1);
      var _iterator__ex2g4s = $chart.planets_1.iterator_jk1svi_k$();
      while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo = _iterator__ex2g4s.next_20eer_k$();
        var planet = _destruct__k2r9zo.component1_7eebsc_k$();
        var deg = _destruct__k2r9zo.component2_7eebsb_k$();
        var kp = kpPosition(deg);
        var house = kpChart.houseOfDegree_ss35wj_k$(deg);
        var retro = $chart.retrogrades_1.get_wei43m_k$(planet) === true;
        var dignity = planetDignity(planet, numberToInt(deg / 30.0) % 12 | 0);
        // Inline function 'kotlinx.html.div' call
        var classes_13 = 'item-card planet-card';
        // Inline function 'kotlinx.html.visit' call
        var this_32 = new DIV(attributesMapOf('class', classes_13), this_31.get_consumer_tu5133_k$());
        this_32.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_32);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_14 = 'item-card-header';
        // Inline function 'kotlinx.html.visit' call
        var this_33 = new DIV(attributesMapOf('class', classes_14), this_32.get_consumer_tu5133_k$());
        this_33.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_33);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_15 = 'item-card-symbol';
        // Inline function 'kotlinx.html.visit' call
        var this_34 = new SPAN(attributesMapOf('class', classes_15), this_33.get_consumer_tu5133_k$());
        this_34.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_34);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_34.unaryPlus_76unot_k$(planet.get_symbol_jqdfoh_k$());
        this_34.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_34);
        // Inline function 'kotlinx.html.span' call
        var classes_16 = 'item-card-title';
        // Inline function 'kotlinx.html.visit' call
        var this_35 = new SPAN(attributesMapOf('class', classes_16), this_33.get_consumer_tu5133_k$());
        this_35.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_35);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_35.unaryPlus_76unot_k$(planet.get_displayName_sscnb0_k$());
        this_35.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_35);
        if (retro) {
          // Inline function 'kotlinx.html.span' call
          var classes_17 = 'item-card-tag retro-tag';
          // Inline function 'kotlinx.html.visit' call
          var this_36 = new SPAN(attributesMapOf('class', classes_17), this_33.get_consumer_tu5133_k$());
          this_36.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_36);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_36.unaryPlus_76unot_k$('R');
          this_36.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_36);
        }
        // Inline function 'kotlinx.html.span' call
        var classes_18 = 'item-card-tag';
        // Inline function 'kotlinx.html.visit' call
        var this_37 = new SPAN(attributesMapOf('class', classes_18), this_33.get_consumer_tu5133_k$());
        this_37.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_37);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_37.unaryPlus_76unot_k$('H' + house);
        this_37.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_37);
        // Inline function 'kotlinx.html.span' call
        // Inline function 'kotlin.text.lowercase' call
        // Inline function 'kotlin.js.asDynamic' call
        var classes_19 = 'item-card-tag dignity-' + dignity.get_name_woqyms_k$().toLowerCase();
        // Inline function 'kotlinx.html.visit' call
        var this_38 = new SPAN(attributesMapOf('class', classes_19), this_33.get_consumer_tu5133_k$());
        this_38.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_38);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_38.unaryPlus_76unot_k$(dignity.get_displayName_sscnb0_k$());
        this_38.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_38);
        this_33.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_33);
        // Inline function 'kotlinx.html.div' call
        var classes_20 = 'data-grid';
        // Inline function 'kotlinx.html.visit' call
        var this_39 = new DIV(attributesMapOf('class', classes_20), this_32.get_consumer_tu5133_k$());
        this_39.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_39);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_21 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_40 = new DIV(attributesMapOf('class', classes_21), this_39.get_consumer_tu5133_k$());
        this_40.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_40);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_22 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_41 = new SPAN(attributesMapOf('class', classes_22), this_40.get_consumer_tu5133_k$());
        this_41.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_41);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_41.unaryPlus_76unot_k$('\u9EC4\u7ECF');
        this_41.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_41);
        // Inline function 'kotlinx.html.span' call
        var classes_23 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_42 = new SPAN(attributesMapOf('class', classes_23), this_40.get_consumer_tu5133_k$());
        this_42.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_42);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_42.unaryPlus_76unot_k$(formatSignDeg(deg));
        this_42.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_42);
        this_40.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_40);
        // Inline function 'kotlinx.html.div' call
        var classes_24 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_43 = new DIV(attributesMapOf('class', classes_24), this_39.get_consumer_tu5133_k$());
        this_43.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_43);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_25 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_44 = new SPAN(attributesMapOf('class', classes_25), this_43.get_consumer_tu5133_k$());
        this_44.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_44);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_44.unaryPlus_76unot_k$('\u661F\u5EA7');
        this_44.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_44);
        // Inline function 'kotlinx.html.span' call
        var classes_26 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_45 = new SPAN(attributesMapOf('class', classes_26), this_43.get_consumer_tu5133_k$());
        this_45.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_45);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_45.unaryPlus_76unot_k$(kp.get_sign_woubd2_k$().get_displayName_sscnb0_k$());
        this_45.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_45);
        this_43.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_43);
        // Inline function 'kotlinx.html.div' call
        var classes_27 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_46 = new DIV(attributesMapOf('class', classes_27), this_39.get_consumer_tu5133_k$());
        this_46.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_46);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_28 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_47 = new SPAN(attributesMapOf('class', classes_28), this_46.get_consumer_tu5133_k$());
        this_47.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_47);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_47.unaryPlus_76unot_k$('\u661F\u5BBF');
        this_47.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_47);
        // Inline function 'kotlinx.html.span' call
        var classes_29 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_48 = new SPAN(attributesMapOf('class', classes_29), this_46.get_consumer_tu5133_k$());
        this_48.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_48);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_48.unaryPlus_76unot_k$(kp.get_nakshatra_6blf52_k$().get_displayName_sscnb0_k$());
        this_48.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_48);
        this_46.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_46);
        // Inline function 'kotlinx.html.div' call
        var classes_30 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_49 = new DIV(attributesMapOf('class', classes_30), this_39.get_consumer_tu5133_k$());
        this_49.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_49);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_31 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_50 = new SPAN(attributesMapOf('class', classes_31), this_49.get_consumer_tu5133_k$());
        this_50.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_50);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_50.unaryPlus_76unot_k$('Pada');
        this_50.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_50);
        // Inline function 'kotlinx.html.span' call
        var classes_32 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_51 = new SPAN(attributesMapOf('class', classes_32), this_49.get_consumer_tu5133_k$());
        this_51.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_51);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_51.unaryPlus_76unot_k$(nakshatraPada(deg).toString());
        this_51.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_51);
        this_49.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_49);
        // Inline function 'kotlinx.html.div' call
        var classes_33 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_52 = new DIV(attributesMapOf('class', classes_33), this_39.get_consumer_tu5133_k$());
        this_52.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_52);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_34 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_53 = new SPAN(attributesMapOf('class', classes_34), this_52.get_consumer_tu5133_k$());
        this_53.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_53);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_53.unaryPlus_76unot_k$('\u5BAB\u4E3B');
        this_53.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_53);
        // Inline function 'kotlinx.html.span' call
        var classes_35 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_54 = new SPAN(attributesMapOf('class', classes_35), this_52.get_consumer_tu5133_k$());
        this_54.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_54);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_54.unaryPlus_76unot_k$(kp.get_signLord_qnpvj9_k$());
        this_54.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_54);
        this_52.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_52);
        // Inline function 'kotlinx.html.div' call
        var classes_36 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_55 = new DIV(attributesMapOf('class', classes_36), this_39.get_consumer_tu5133_k$());
        this_55.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_55);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_37 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_56 = new SPAN(attributesMapOf('class', classes_37), this_55.get_consumer_tu5133_k$());
        this_56.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_56);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_56.unaryPlus_76unot_k$('\u5BBF\u4E3B');
        this_56.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_56);
        // Inline function 'kotlinx.html.span' call
        var classes_38 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_57 = new SPAN(attributesMapOf('class', classes_38), this_55.get_consumer_tu5133_k$());
        this_57.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_57);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_57.unaryPlus_76unot_k$(kp.get_starLord_a1nf0w_k$().get_displayName_sscnb0_k$());
        this_57.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_57);
        this_55.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_55);
        // Inline function 'kotlinx.html.div' call
        var classes_39 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_58 = new DIV(attributesMapOf('class', classes_39), this_39.get_consumer_tu5133_k$());
        this_58.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_58);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_40 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_59 = new SPAN(attributesMapOf('class', classes_40), this_58.get_consumer_tu5133_k$());
        this_59.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_59);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_59.unaryPlus_76unot_k$('\u5B50\u4E3B');
        this_59.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_59);
        // Inline function 'kotlinx.html.span' call
        var classes_41 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_60 = new SPAN(attributesMapOf('class', classes_41), this_58.get_consumer_tu5133_k$());
        this_60.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_60);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_60.unaryPlus_76unot_k$(kp.get_subLord_tn29as_k$().get_displayName_sscnb0_k$());
        this_60.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_60);
        this_58.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_58);
        // Inline function 'kotlinx.html.div' call
        var classes_42 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_61 = new DIV(attributesMapOf('class', classes_42), this_39.get_consumer_tu5133_k$());
        this_61.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_61);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_43 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_62 = new SPAN(attributesMapOf('class', classes_43), this_61.get_consumer_tu5133_k$());
        this_62.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_62);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_62.unaryPlus_76unot_k$('\u5B50\u5B50\u4E3B');
        this_62.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_62);
        // Inline function 'kotlinx.html.span' call
        var classes_44 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_63 = new SPAN(attributesMapOf('class', classes_44), this_61.get_consumer_tu5133_k$());
        this_63.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_63);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_63.unaryPlus_76unot_k$(kp.get_subSubLord_4jveyq_k$().get_displayName_sscnb0_k$());
        this_63.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_63);
        this_61.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_61);
        // Inline function 'kotlinx.html.div' call
        var classes_45 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_64 = new DIV(attributesMapOf('class', classes_45), this_39.get_consumer_tu5133_k$());
        this_64.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_64);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_46 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_65 = new SPAN(attributesMapOf('class', classes_46), this_64.get_consumer_tu5133_k$());
        this_65.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_65);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_65.unaryPlus_76unot_k$('KP\u53F7');
        this_65.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_65);
        // Inline function 'kotlinx.html.span' call
        var classes_47 = 'data-value kp-num';
        // Inline function 'kotlinx.html.visit' call
        var this_66 = new SPAN(attributesMapOf('class', classes_47), this_64.get_consumer_tu5133_k$());
        this_66.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_66);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_66.unaryPlus_76unot_k$(kp.get_kpNumber_o5erl5_k$().toString());
        this_66.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_66);
        this_64.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_64);
        // Inline function 'kotlinx.html.div' call
        var classes_48 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_67 = new DIV(attributesMapOf('class', classes_48), this_39.get_consumer_tu5133_k$());
        this_67.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_67);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_49 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_68 = new SPAN(attributesMapOf('class', classes_49), this_67.get_consumer_tu5133_k$());
        this_68.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_68);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_68.unaryPlus_76unot_k$('\u795E\u7947');
        this_68.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_68);
        // Inline function 'kotlinx.html.span' call
        var classes_50 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_69 = new SPAN(attributesMapOf('class', classes_50), this_67.get_consumer_tu5133_k$());
        this_69.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_69);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_69.unaryPlus_76unot_k$(deity(kp.get_nakshatra_6blf52_k$()));
        this_69.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_69);
        this_67.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_67);
        // Inline function 'kotlinx.html.div' call
        var classes_51 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_70 = new DIV(attributesMapOf('class', classes_51), this_39.get_consumer_tu5133_k$());
        this_70.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_70);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_52 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_71 = new SPAN(attributesMapOf('class', classes_52), this_70.get_consumer_tu5133_k$());
        this_71.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_71);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_71.unaryPlus_76unot_k$('Gana');
        this_71.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_71);
        // Inline function 'kotlinx.html.span' call
        var classes_53 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_72 = new SPAN(attributesMapOf('class', classes_53), this_70.get_consumer_tu5133_k$());
        this_72.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_72);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_72.unaryPlus_76unot_k$(gana(kp.get_nakshatra_6blf52_k$()).get_displayName_sscnb0_k$());
        this_72.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_72);
        this_70.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_70);
        this_39.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_39);
        this_32.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_32);
      }
      this_31.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_31);
      this_28.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_28);
      // Inline function 'kotlinx.html.div' call
      var classes_54 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_73 = new DIV(attributesMapOf('class', classes_54), this_0.get_consumer_tu5133_k$());
      this_73.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_73);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_74 = new H2(attributesMapOf('class', null), this_73.get_consumer_tu5133_k$());
      this_74.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_74);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_74.unaryPlus_76unot_k$('\u5BAB\u9996\u5B50\u661F\u5206\u6790');
      this_74.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_74);
      // Inline function 'kotlinx.html.p' call
      var classes_55 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_75 = new P(attributesMapOf('class', classes_55), this_73.get_consumer_tu5133_k$());
      this_75.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_75);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_75.unaryPlus_76unot_k$('12 \u5BAB\u5BAB\u9996\u5206\u522B\u663E\u793A\uFF1A\u5BAB\u9996\u5EA6\u6570\u3001\u661F\u5EA7\u3001\u661F\u4E3B\u3001\u5BBF\u4E3B\u3001\u5B50\u4E3B\u3001\u5409\u51F6\u627F\u8BFA\uFF08\u5409/\u51F6/\u6DF7\u5408\uFF09');
      this_75.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_75);
      // Inline function 'kotlinx.html.div' call
      var classes_56 = 'item-card-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_76 = new DIV(attributesMapOf('class', classes_56), this_73.get_consumer_tu5133_k$());
      this_76.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_76);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_0 = $cuspal.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_0.hasNext_bitz1p_k$()) {
        var c = _iterator__ex2g4s_0.next_20eer_k$();
        // Inline function 'kotlinx.html.div' call
        var classes_57 = 'item-card cusp-card';
        // Inline function 'kotlinx.html.visit' call
        var this_77 = new DIV(attributesMapOf('class', classes_57), this_76.get_consumer_tu5133_k$());
        this_77.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_77);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_58 = 'item-card-header';
        // Inline function 'kotlinx.html.visit' call
        var this_78 = new DIV(attributesMapOf('class', classes_58), this_77.get_consumer_tu5133_k$());
        this_78.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_78);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_59 = 'item-card-title';
        // Inline function 'kotlinx.html.visit' call
        var this_79 = new SPAN(attributesMapOf('class', classes_59), this_78.get_consumer_tu5133_k$());
        this_79.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_79);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_79.unaryPlus_76unot_k$('\u7B2C ' + c.get_house_islek7_k$() + ' \u5BAB');
        this_79.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_79);
        // Inline function 'kotlinx.html.span' call
        var classes_60 = 'item-card-tag ' + c.get_promise_3ujnbi_k$().get_cssClass_j5a41q_k$();
        // Inline function 'kotlinx.html.visit' call
        var this_80 = new SPAN(attributesMapOf('class', classes_60), this_78.get_consumer_tu5133_k$());
        this_80.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_80);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_80.unaryPlus_76unot_k$(c.get_promise_3ujnbi_k$().get_label_iuj8p7_k$());
        this_80.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_80);
        this_78.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_78);
        // Inline function 'kotlinx.html.div' call
        var classes_61 = 'data-grid';
        // Inline function 'kotlinx.html.visit' call
        var this_81 = new DIV(attributesMapOf('class', classes_61), this_77.get_consumer_tu5133_k$());
        this_81.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_81);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_62 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_82 = new DIV(attributesMapOf('class', classes_62), this_81.get_consumer_tu5133_k$());
        this_82.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_82);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_63 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_83 = new SPAN(attributesMapOf('class', classes_63), this_82.get_consumer_tu5133_k$());
        this_83.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_83);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_83.unaryPlus_76unot_k$('\u5BAB\u9996');
        this_83.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_83);
        // Inline function 'kotlinx.html.span' call
        var classes_64 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_84 = new SPAN(attributesMapOf('class', classes_64), this_82.get_consumer_tu5133_k$());
        this_84.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_84);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_84.unaryPlus_76unot_k$(formatSignDeg(c.get_cuspDeg_jx00ge_k$()));
        this_84.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_84);
        this_82.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_82);
        // Inline function 'kotlinx.html.div' call
        var classes_65 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_85 = new DIV(attributesMapOf('class', classes_65), this_81.get_consumer_tu5133_k$());
        this_85.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_85);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_66 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_86 = new SPAN(attributesMapOf('class', classes_66), this_85.get_consumer_tu5133_k$());
        this_86.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_86);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_86.unaryPlus_76unot_k$('\u661F\u5EA7');
        this_86.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_86);
        // Inline function 'kotlinx.html.span' call
        var classes_67 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_87 = new SPAN(attributesMapOf('class', classes_67), this_85.get_consumer_tu5133_k$());
        this_87.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_87);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_87.unaryPlus_76unot_k$(c.get_sign_woubd2_k$().get_displayName_sscnb0_k$());
        this_87.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_87);
        this_85.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_85);
        // Inline function 'kotlinx.html.div' call
        var classes_68 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_88 = new DIV(attributesMapOf('class', classes_68), this_81.get_consumer_tu5133_k$());
        this_88.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_88);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_69 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_89 = new SPAN(attributesMapOf('class', classes_69), this_88.get_consumer_tu5133_k$());
        this_89.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_89);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_89.unaryPlus_76unot_k$('\u661F\u4E3B');
        this_89.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_89);
        // Inline function 'kotlinx.html.span' call
        var classes_70 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_90 = new SPAN(attributesMapOf('class', classes_70), this_88.get_consumer_tu5133_k$());
        this_90.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_90);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_90.unaryPlus_76unot_k$(c.get_signLord_qnpvj9_k$());
        this_90.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_90);
        this_88.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_88);
        // Inline function 'kotlinx.html.div' call
        var classes_71 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_91 = new DIV(attributesMapOf('class', classes_71), this_81.get_consumer_tu5133_k$());
        this_91.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_91);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_72 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_92 = new SPAN(attributesMapOf('class', classes_72), this_91.get_consumer_tu5133_k$());
        this_92.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_92);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_92.unaryPlus_76unot_k$('\u5BBF\u4E3B');
        this_92.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_92);
        // Inline function 'kotlinx.html.span' call
        var classes_73 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_93 = new SPAN(attributesMapOf('class', classes_73), this_91.get_consumer_tu5133_k$());
        this_93.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_93);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_93.unaryPlus_76unot_k$(c.get_starLord_a1nf0w_k$().get_displayName_sscnb0_k$());
        this_93.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_93);
        this_91.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_91);
        // Inline function 'kotlinx.html.div' call
        var classes_74 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_94 = new DIV(attributesMapOf('class', classes_74), this_81.get_consumer_tu5133_k$());
        this_94.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_94);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_75 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_95 = new SPAN(attributesMapOf('class', classes_75), this_94.get_consumer_tu5133_k$());
        this_95.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_95);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_95.unaryPlus_76unot_k$('\u5B50\u4E3B');
        this_95.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_95);
        // Inline function 'kotlinx.html.span' call
        var classes_76 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_96 = new SPAN(attributesMapOf('class', classes_76), this_94.get_consumer_tu5133_k$());
        this_96.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_96);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_96.unaryPlus_76unot_k$(c.get_subLord_tn29as_k$().get_displayName_sscnb0_k$());
        this_96.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_96);
        this_94.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_94);
        this_81.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_81);
        this_77.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_77);
      }
      this_76.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_76);
      this_73.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_73);
      // Inline function 'kotlinx.html.div' call
      var classes_77 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_97 = new DIV(attributesMapOf('class', classes_77), this_0.get_consumer_tu5133_k$());
      this_97.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_97);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_98 = new H2(attributesMapOf('class', null), this_97.get_consumer_tu5133_k$());
      this_98.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_98);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_98.unaryPlus_76unot_k$('\u8C61\u5F81\u661F\uFF08\u5168\u90E8 9 \u884C\u661F\uFF09');
      this_98.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_98);
      // Inline function 'kotlinx.html.p' call
      var classes_78 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_99 = new P(attributesMapOf('class', classes_78), this_97.get_consumer_tu5133_k$());
      this_99.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_99);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_99.unaryPlus_76unot_k$('KP \u5F3A\u5F31\u7B49\u7EA7\uFF1AA\uFF08\u9A7B\u5B88\u661F\u4E4B\u5BBF\u4E3B\uFF09> B\uFF08\u9A7B\u5B88\u661F\uFF09> C\uFF08\u5BAB\u4E3B\u4E4B\u5BBF\u4E3B\uFF09> D\uFF08\u5BAB\u4E3B\uFF09> E\uFF08\u76F8\u4F4D\u661F\uFF09');
      this_99.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_99);
      // Inline function 'kotlinx.html.div' call
      var classes_79 = 'item-card-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_100 = new DIV(attributesMapOf('class', classes_79), this_97.get_consumer_tu5133_k$());
      this_100.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_100);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_1 = $sigs.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_1.hasNext_bitz1p_k$()) {
        var s = _iterator__ex2g4s_1.next_20eer_k$();
        // Inline function 'kotlinx.html.div' call
        var classes_80 = 'item-card sig-card';
        // Inline function 'kotlinx.html.visit' call
        var this_101 = new DIV(attributesMapOf('class', classes_80), this_100.get_consumer_tu5133_k$());
        this_101.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_101);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_81 = 'item-card-header';
        // Inline function 'kotlinx.html.visit' call
        var this_102 = new DIV(attributesMapOf('class', classes_81), this_101.get_consumer_tu5133_k$());
        this_102.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_102);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_82 = 'item-card-symbol';
        // Inline function 'kotlinx.html.visit' call
        var this_103 = new SPAN(attributesMapOf('class', classes_82), this_102.get_consumer_tu5133_k$());
        this_103.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_103);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_103.unaryPlus_76unot_k$(s.get_planet_i3vtlt_k$().get_symbol_jqdfoh_k$());
        this_103.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_103);
        // Inline function 'kotlinx.html.span' call
        var classes_83 = 'item-card-title';
        // Inline function 'kotlinx.html.visit' call
        var this_104 = new SPAN(attributesMapOf('class', classes_83), this_102.get_consumer_tu5133_k$());
        this_104.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_104);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_104.unaryPlus_76unot_k$(s.get_planet_i3vtlt_k$().get_displayName_sscnb0_k$());
        this_104.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_104);
        this_102.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_102);
        // Inline function 'kotlinx.html.div' call
        var classes_84 = 'sig-houses';
        // Inline function 'kotlinx.html.visit' call
        var this_105 = new DIV(attributesMapOf('class', classes_84), this_101.get_consumer_tu5133_k$());
        this_105.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_105);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        if (s.get_signifiedHouses_ee9a0o_k$().isEmpty_y1axqb_k$()) {
          // Inline function 'kotlinx.html.span' call
          var classes_85 = 'house-empty';
          // Inline function 'kotlinx.html.visit' call
          var this_106 = new SPAN(attributesMapOf('class', classes_85), this_105.get_consumer_tu5133_k$());
          this_106.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_106);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_106.unaryPlus_76unot_k$('\u2014 \u65E0\u8C61\u5F81\u5BAB \u2014');
          this_106.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_106);
        } else {
          // Inline function 'kotlin.collections.forEach' call
          var tmp0_iterator = s.get_signifiedHouses_ee9a0o_k$().iterator_jk1svi_k$();
          while (tmp0_iterator.hasNext_bitz1p_k$()) {
            var element = tmp0_iterator.next_20eer_k$();
            // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlinx.html.span' call
            var classes_86 = 'house-chip';
            // Inline function 'kotlinx.html.visit' call
            var this_107 = new SPAN(attributesMapOf('class', classes_86), this_105.get_consumer_tu5133_k$());
            this_107.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_107);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            this_107.unaryPlus_76unot_k$('H' + element);
            this_107.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_107);
          }
        }
        this_105.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_105);
        // Inline function 'kotlinx.html.div' call
        var classes_87 = 'sig-detail';
        // Inline function 'kotlinx.html.visit' call
        var this_108 = new DIV(attributesMapOf('class', classes_87), this_101.get_consumer_tu5133_k$());
        this_108.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_108);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlin.collections.forEach' call
        var tmp0_iterator_0 = s.get_strengthOrder_y626as_k$().iterator_jk1svi_k$();
        while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
          var element_0 = tmp0_iterator_0.next_20eer_k$();
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          var h = element_0.component1_7eebsc_k$();
          var type = element_0.component2_7eebsb_k$();
          // Inline function 'kotlinx.html.span' call
          // Inline function 'kotlin.text.lowercase' call
          // Inline function 'kotlin.js.asDynamic' call
          var classes_88 = 'sig-grade sig-grade-' + type.get_name_woqyms_k$().toLowerCase();
          // Inline function 'kotlinx.html.visit' call
          var this_109 = new SPAN(attributesMapOf('class', classes_88), this_108.get_consumer_tu5133_k$());
          this_109.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_109);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_109.unaryPlus_76unot_k$('H' + h + '\xB7' + toString_1(first(type.get_label_iuj8p7_k$())));
          this_109.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_109);
        }
        this_108.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_108);
        this_101.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_101);
      }
      this_100.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_100);
      this_97.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_97);
      // Inline function 'kotlinx.html.div' call
      var classes_89 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_110 = new DIV(attributesMapOf('class', classes_89), this_0.get_consumer_tu5133_k$());
      this_110.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_110);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_111 = new H2(attributesMapOf('class', null), this_110.get_consumer_tu5133_k$());
      this_111.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_111);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_111.unaryPlus_76unot_k$('\u6267\u638C\u884C\u661F\uFF08RP\uFF09');
      this_111.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_111);
      // Inline function 'kotlinx.html.p' call
      var classes_90 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_112 = new P(attributesMapOf('class', classes_90), this_110.get_consumer_tu5133_k$());
      this_112.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_112);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_112.unaryPlus_76unot_k$('\u65E5\u4E3B\u3001\u6708\u4EAE\u5BAB\u4E3B\u3001\u6708\u4EAE\u5BBF\u4E3B\u3001\u4E0A\u5347\u5BAB\u4E3B\u3001\u4E0A\u5347\u5BBF\u4E3B \u2014\u2014 \u542B\u7F57\u777A/\u8BA1\u90FD\u4EE3\u7406\u661F\u4E3B\u4EE3\u5165');
      this_112.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_112);
      // Inline function 'kotlinx.html.div' call
      // Inline function 'kotlinx.html.visit' call
      var this_113 = new DIV(attributesMapOf('class', 'rp-grid'), this_110.get_consumer_tu5133_k$());
      this_113.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_113);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_2 = $rp.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_2.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo_0 = _iterator__ex2g4s_2.next_20eer_k$();
        var lord = _destruct__k2r9zo_0.component1_7eebsc_k$();
        var count = _destruct__k2r9zo_0.component2_7eebsb_k$();
        // Inline function 'kotlinx.html.div' call
        // Inline function 'kotlinx.html.visit' call
        var this_114 = new DIV(attributesMapOf('class', 'rp-card'), this_113.get_consumer_tu5133_k$());
        this_114.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_114);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_91 = 'rp-header';
        // Inline function 'kotlinx.html.visit' call
        var this_115 = new DIV(attributesMapOf('class', classes_91), this_114.get_consumer_tu5133_k$());
        this_115.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_115);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        // Inline function 'kotlinx.html.visit' call
        var this_116 = new SPAN(attributesMapOf('class', 'rp-name'), this_115.get_consumer_tu5133_k$());
        this_116.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_116);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_116.unaryPlus_76unot_k$(lord.get_displayName_sscnb0_k$());
        this_116.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_116);
        // Inline function 'kotlinx.html.span' call
        var classes_92 = 'rp-count';
        // Inline function 'kotlinx.html.visit' call
        var this_117 = new SPAN(attributesMapOf('class', classes_92), this_115.get_consumer_tu5133_k$());
        this_117.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_117);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_117.unaryPlus_76unot_k$('\xD7' + count);
        this_117.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_117);
        this_115.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_115);
        // Inline function 'kotlinx.html.div' call
        var classes_93 = 'strength-bar';
        // Inline function 'kotlinx.html.visit' call
        var this_118 = new DIV(attributesMapOf('class', classes_93), this_114.get_consumer_tu5133_k$());
        this_118.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_118);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlin.repeat' call
        // Inline function 'kotlin.contracts.contract' call
        var inductionVariable = 0;
        if (inductionVariable < count)
          do {
            var index = inductionVariable;
            inductionVariable = inductionVariable + 1 | 0;
            // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlinx.html.span' call
            var classes_94 = 'strength-dot';
            // Inline function 'kotlinx.html.visit' call
            var this_119 = new SPAN(attributesMapOf('class', classes_94), this_118.get_consumer_tu5133_k$());
            this_119.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_119);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            this_119.unaryPlus_76unot_k$('\u25CF');
            this_119.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_119);
          }
           while (inductionVariable < count);
        this_118.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_118);
        this_114.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_114);
      }
      this_113.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_113);
      this_110.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_110);
      // Inline function 'kotlinx.html.div' call
      var classes_95 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_120 = new DIV(attributesMapOf('class', classes_95), this_0.get_consumer_tu5133_k$());
      this_120.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_120);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_121 = new H2(attributesMapOf('class', null), this_120.get_consumer_tu5133_k$());
      this_121.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_121);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_121.unaryPlus_76unot_k$('\u4EBA\u751F\u4E8B\u9879\u627F\u8BFA');
      this_121.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_121);
      // Inline function 'kotlinx.html.p' call
      var classes_96 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_122 = new P(attributesMapOf('class', classes_96), this_120.get_consumer_tu5133_k$());
      this_122.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_122);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_122.unaryPlus_76unot_k$('\u6BCF\u9879\u4E8B\u9879\u68C0\u67E5\u5176\u4E3B\u5BAB\u5BAB\u9996\u5B50\u661F\u662F\u5426\u627F\u8BFA\u8BE5\u4E8B\u9879');
      this_122.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_122);
      // Inline function 'kotlinx.html.div' call
      var classes_97 = 'event-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_123 = new DIV(attributesMapOf('class', classes_97), this_120.get_consumer_tu5133_k$());
      this_123.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_123);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_3 = $events.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_3.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo_1 = _iterator__ex2g4s_3.next_20eer_k$();
        var event = _destruct__k2r9zo_1.component1_7eebsc_k$();
        var promised = _destruct__k2r9zo_1.component2_7eebsb_k$();
        // Inline function 'kotlinx.html.div' call
        var classes_98 = 'event-card ' + (promised ? 'event-promised' : 'event-denied');
        // Inline function 'kotlinx.html.visit' call
        var this_124 = new DIV(attributesMapOf('class', classes_98), this_123.get_consumer_tu5133_k$());
        this_124.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_124);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_99 = 'event-icon';
        // Inline function 'kotlinx.html.visit' call
        var this_125 = new DIV(attributesMapOf('class', classes_99), this_124.get_consumer_tu5133_k$());
        this_125.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_125);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_125.unaryPlus_76unot_k$(promised ? '\u2713' : '\u2717');
        this_125.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_125);
        // Inline function 'kotlinx.html.div' call
        var classes_100 = 'event-name';
        // Inline function 'kotlinx.html.visit' call
        var this_126 = new DIV(attributesMapOf('class', classes_100), this_124.get_consumer_tu5133_k$());
        this_126.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_126);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_126.unaryPlus_76unot_k$(event.get_displayName_sscnb0_k$());
        this_126.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_126);
        // Inline function 'kotlinx.html.div' call
        var classes_101 = 'event-status';
        // Inline function 'kotlinx.html.visit' call
        var this_127 = new DIV(attributesMapOf('class', classes_101), this_124.get_consumer_tu5133_k$());
        this_127.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_127);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_127.unaryPlus_76unot_k$(promised ? '\u627F\u8BFA' : '\u4E0D\u627F\u8BFA');
        this_127.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_127);
        // Inline function 'kotlinx.html.div' call
        var classes_102 = 'event-detail';
        // Inline function 'kotlinx.html.visit' call
        var this_128 = new DIV(attributesMapOf('class', classes_102), this_124.get_consumer_tu5133_k$());
        this_128.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_128);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.small' call
        // Inline function 'kotlinx.html.visit' call
        var this_129 = new SMALL(attributesMapOf('class', null), this_128.get_consumer_tu5133_k$());
        this_129.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_129);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_129.unaryPlus_76unot_k$('\u4E3B\u5BAB H' + event.get_primaryHouse_e8jed5_k$() + ' \xB7 \u5409\u5BAB ' + joinToString(event.get_favorable_l0ij2p_k$(), ','));
        this_129.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_129);
        this_128.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_128);
        this_124.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_124);
      }
      this_123.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_123);
      this_120.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_120);
      // Inline function 'kotlinx.html.div' call
      var classes_103 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_130 = new DIV(attributesMapOf('class', classes_103), this_0.get_consumer_tu5133_k$());
      this_130.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_130);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_131 = new H2(attributesMapOf('class', null), this_130.get_consumer_tu5133_k$());
      this_131.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_131);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_131.unaryPlus_76unot_k$('\u6309\u5BAB\u4F4D\u5217\u8C61\u5F81\u661F');
      this_131.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_131);
      // Inline function 'kotlinx.html.p' call
      var classes_104 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_132 = new P(attributesMapOf('class', classes_104), this_130.get_consumer_tu5133_k$());
      this_132.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_132);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_132.unaryPlus_76unot_k$('\u6BCF\u5BAB\u5217\u51FA\u8C61\u5F81\u8BE5\u5BAB\u7684\u884C\u661F\uFF0C\u6309\u5F3A\u5F31\u6392\u5E8F\uFF08A > B > D > E\uFF09');
      this_132.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_132);
      // Inline function 'kotlinx.html.div' call
      var classes_105 = 'house-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_133 = new DIV(attributesMapOf('class', classes_105), this_130.get_consumer_tu5133_k$());
      this_133.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_133);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var inductionVariable_0 = 1;
      if (inductionVariable_0 <= 12)
        do {
          var house_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          var houseSigs = significatorsOfHouse(house_0, $sigs);
          // Inline function 'kotlinx.html.div' call
          var classes_106 = 'house-card';
          // Inline function 'kotlinx.html.visit' call
          var this_134 = new DIV(attributesMapOf('class', classes_106), this_133.get_consumer_tu5133_k$());
          this_134.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_134);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.div' call
          var classes_107 = 'house-title';
          // Inline function 'kotlinx.html.visit' call
          var this_135 = new DIV(attributesMapOf('class', classes_107), this_134.get_consumer_tu5133_k$());
          this_135.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_135);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_135.unaryPlus_76unot_k$('\u7B2C ' + house_0 + ' \u5BAB');
          this_135.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_135);
          if (houseSigs.isEmpty_y1axqb_k$()) {
            // Inline function 'kotlinx.html.div' call
            var classes_108 = 'house-empty';
            // Inline function 'kotlinx.html.visit' call
            var this_136 = new DIV(attributesMapOf('class', classes_108), this_134.get_consumer_tu5133_k$());
            this_136.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_136);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            this_136.unaryPlus_76unot_k$('\u2014 \u65E0 \u2014');
            this_136.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_136);
          } else {
            // Inline function 'kotlin.collections.forEach' call
            var tmp0_iterator_1 = houseSigs.iterator_jk1svi_k$();
            while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
              var element_1 = tmp0_iterator_1.next_20eer_k$();
              // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
              var planet_0 = element_1.component1_7eebsc_k$();
              var type_0 = element_1.component2_7eebsb_k$();
              // Inline function 'kotlinx.html.div' call
              // Inline function 'kotlin.text.lowercase' call
              // Inline function 'kotlin.js.asDynamic' call
              var classes_109 = 'house-sig sig-grade-' + type_0.get_name_woqyms_k$().toLowerCase();
              // Inline function 'kotlinx.html.visit' call
              var this_137 = new DIV(attributesMapOf('class', classes_109), this_134.get_consumer_tu5133_k$());
              this_137.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_137);
              // Inline function 'kotlinx.html.visit.<anonymous>' call
              // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
              // Inline function 'kotlinx.html.span' call
              var classes_110 = 'house-sig-planet';
              // Inline function 'kotlinx.html.visit' call
              var this_138 = new SPAN(attributesMapOf('class', classes_110), this_137.get_consumer_tu5133_k$());
              this_138.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_138);
              // Inline function 'kotlinx.html.visit.<anonymous>' call
              // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
              this_138.unaryPlus_76unot_k$(planet_0.get_symbol_jqdfoh_k$());
              this_138.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_138);
              // Inline function 'kotlinx.html.span' call
              var classes_111 = 'house-sig-grade';
              // Inline function 'kotlinx.html.visit' call
              var this_139 = new SPAN(attributesMapOf('class', classes_111), this_137.get_consumer_tu5133_k$());
              this_139.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_139);
              // Inline function 'kotlinx.html.visit.<anonymous>' call
              // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
              this_139.unaryPlus_76unot_k$(toString_1(first(type_0.get_label_iuj8p7_k$())));
              this_139.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_139);
              this_137.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_137);
            }
          }
          this_134.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_134);
        }
         while (inductionVariable_0 <= 12);
      this_133.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_133);
      this_130.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_130);
      // Inline function 'kotlinx.html.div' call
      var classes_112 = 'result-card notes-card';
      // Inline function 'kotlinx.html.visit' call
      var this_140 = new DIV(attributesMapOf('class', classes_112), this_0.get_consumer_tu5133_k$());
      this_140.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_140);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_141 = new H2(attributesMapOf('class', null), this_140.get_consumer_tu5133_k$());
      this_141.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_141);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_141.unaryPlus_76unot_k$('\u8BF4\u660E');
      this_141.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_141);
      // Inline function 'kotlinx.html.ul' call
      // Inline function 'kotlinx.html.visit' call
      var this_142 = new UL(attributesMapOf('class', null), this_140.get_consumer_tu5133_k$());
      this_142.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_142);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.li' call
      // Inline function 'kotlinx.html.visit' call
      var this_143 = new LI(attributesMapOf('class', null), this_142.get_consumer_tu5133_k$());
      this_143.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_143);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_143.unaryPlus_76unot_k$('\u7B97\u6CD5\u4E3A xalen-ephemeris Rust \u5B9E\u73B0\u7684 1:1 \u79FB\u690D\uFF0C\u6240\u6709 KP \u51FD\u6570\u4E0E Rust \u6E90\u4EE3\u7801\u4E00\u81F4\u3002');
      this_143.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_143);
      // Inline function 'kotlinx.html.li' call
      // Inline function 'kotlinx.html.visit' call
      var this_144 = new LI(attributesMapOf('class', null), this_142.get_consumer_tu5133_k$());
      this_144.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_144);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_144.unaryPlus_76unot_k$('\u884C\u661F\u9EC4\u7ECF\u91C7\u7528 VSOP87 \u622A\u65AD\u7EA7\u6570 + Meeus \u592A\u9633/\u6708\u4EAE\u516C\u5F0F\uFF08\u7CBE\u5EA6 <0.3\xB0\uFF09\uFF0C\u65E0\u9700\u4EFB\u4F55\u5916\u90E8\u6570\u636E\u6587\u4EF6\u3002');
      this_144.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_144);
      // Inline function 'kotlinx.html.li' call
      // Inline function 'kotlinx.html.visit' call
      var this_145 = new LI(attributesMapOf('class', null), this_142.get_consumer_tu5133_k$());
      this_145.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_145);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_145.unaryPlus_76unot_k$('\u771F Placidus \u5BAB\u4F4D\u5236\u91C7\u7528\u8FED\u4EE3\u7B97\u6CD5\uFF08\u57FA\u4E8E\u534A\u663C\u5F27\u4E09\u7B49\u5206\uFF09\uFF1B\u9AD8\u7EAC\u5EA6\u53EF\u9009\u7B49\u5BAB\u5236\u6216\u6574\u5BAB\u5236\u3002');
      this_145.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_145);
      // Inline function 'kotlinx.html.li' call
      // Inline function 'kotlinx.html.visit' call
      var this_146 = new LI(attributesMapOf('class', null), this_142.get_consumer_tu5133_k$());
      this_146.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_146);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_146.unaryPlus_76unot_k$('\u5C81\u5DEE\u503C\u6839\u636E JD \u52A8\u6001\u8BA1\u7B97\uFF0C\u4E0D\u518D\u4F7F\u7528 2026 \u56FA\u5B9A\u503C\uFF1B\u652F\u6301 KP / Lahiri / Raman / Fagan-Bradley / True Chitra \u4E94\u79CD\u3002');
      this_146.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_146);
      // Inline function 'kotlinx.html.li' call
      // Inline function 'kotlinx.html.visit' call
      var this_147 = new LI(attributesMapOf('class', null), this_142.get_consumer_tu5133_k$());
      this_147.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_147);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderChartTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_147.unaryPlus_76unot_k$('Rahu/Ketu \u9ED8\u8BA4\u9006\u884C\uFF08mean node\uFF09\uFF0C\u76F8\u4F4D\u6309\u7C7B\u6728\u661F\u7EA6\u5B9A\uFF085/7/9 \u5BAB\uFF09\u3002');
      this_147.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_147);
      this_142.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_142);
      this_140.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_140);
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp = $this$append.finalize_b9lof6_k$();
      tmp instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function renderDashaTab$lambda($moonDeg, $dashaPeriods) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'results-container';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.div' call
      var classes_0 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_1 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
      this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_2 = new H2(attributesMapOf('class', null), this_1.get_consumer_tu5133_k$());
      this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_2.unaryPlus_76unot_k$('Vimshottari Dasha \u65F6\u95F4\u8F74');
      this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
      // Inline function 'kotlinx.html.p' call
      var classes_1 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_3 = new P(attributesMapOf('class', classes_1), this_1.get_consumer_tu5133_k$());
      this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_3.unaryPlus_76unot_k$('\u4ECE\u6708\u4EAE\u6052\u661F\u9EC4\u7ECF\u8D77\u7B97\uFF0C\u4E09\u5C42\u6DF1\u5EA6\uFF1A\u5927\u8FD0 \u2192 \u5C0F\u8FD0 \u2192 \u8FC7\u8FD0\u3002');
      this_3.unaryPlus_76unot_k$('\u6708\u4EAE\u4F4D\u7F6E\uFF1A' + formatSignDeg($moonDeg) + '\uFF08' + kpPosition($moonDeg).get_nakshatra_6blf52_k$().get_displayName_sscnb0_k$() + '\u5BBF\u4E3B\uFF1A' + kpPosition($moonDeg).get_starLord_a1nf0w_k$().get_displayName_sscnb0_k$() + '\uFF09');
      this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
      // Inline function 'kotlinx.html.div' call
      var classes_2 = 'dasha-timeline';
      // Inline function 'kotlinx.html.visit' call
      var this_4 = new DIV(attributesMapOf('class', classes_2), this_1.get_consumer_tu5133_k$());
      this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s = $dashaPeriods.iterator_jk1svi_k$();
      while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
        var maha = _iterator__ex2g4s.next_20eer_k$();
        // Inline function 'kotlinx.html.div' call
        // Inline function 'kotlin.text.lowercase' call
        // Inline function 'kotlin.js.asDynamic' call
        var classes_3 = 'dasha-maha dasha-lord-' + maha.get_lord_wopz5q_k$().get_name_woqyms_k$().toLowerCase();
        // Inline function 'kotlinx.html.visit' call
        var this_5 = new DIV(attributesMapOf('class', classes_3), this_4.get_consumer_tu5133_k$());
        this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_4 = 'dasha-maha-header';
        // Inline function 'kotlinx.html.visit' call
        var this_6 = new DIV(attributesMapOf('class', classes_4), this_5.get_consumer_tu5133_k$());
        this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_5 = 'dasha-lord-name';
        // Inline function 'kotlinx.html.visit' call
        var this_7 = new SPAN(attributesMapOf('class', classes_5), this_6.get_consumer_tu5133_k$());
        this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_7.unaryPlus_76unot_k$(maha.get_lord_wopz5q_k$().get_displayName_sscnb0_k$());
        this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
        // Inline function 'kotlinx.html.span' call
        var classes_6 = 'dasha-period';
        // Inline function 'kotlinx.html.visit' call
        var this_8 = new SPAN(attributesMapOf('class', classes_6), this_6.get_consumer_tu5133_k$());
        this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_8.unaryPlus_76unot_k$(jdToDateStr(maha.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(maha.get_endJd_iqx07g_k$()));
        this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
        // Inline function 'kotlinx.html.span' call
        var classes_7 = 'dasha-duration';
        // Inline function 'kotlinx.html.visit' call
        var this_9 = new SPAN(attributesMapOf('class', classes_7), this_6.get_consumer_tu5133_k$());
        this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_9.unaryPlus_76unot_k$(formatDouble((maha.get_endJd_iqx07g_k$() - maha.get_startJd_u3zc19_k$()) / 365.25, 1) + ' \u5E74');
        this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
        this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
        // Inline function 'kotlinx.html.div' call
        var classes_8 = 'dasha-antars';
        // Inline function 'kotlinx.html.visit' call
        var this_10 = new DIV(attributesMapOf('class', classes_8), this_5.get_consumer_tu5133_k$());
        this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        var _iterator__ex2g4s_0 = maha.get_subPeriods_f4n1tn_k$().iterator_jk1svi_k$();
        while (_iterator__ex2g4s_0.hasNext_bitz1p_k$()) {
          var antar = _iterator__ex2g4s_0.next_20eer_k$();
          // Inline function 'kotlinx.html.div' call
          // Inline function 'kotlin.text.lowercase' call
          // Inline function 'kotlin.js.asDynamic' call
          var classes_9 = 'dasha-antar dasha-lord-' + antar.get_lord_wopz5q_k$().get_name_woqyms_k$().toLowerCase();
          // Inline function 'kotlinx.html.visit' call
          var this_11 = new DIV(attributesMapOf('class', classes_9), this_10.get_consumer_tu5133_k$());
          this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.div' call
          var classes_10 = 'dasha-antar-header';
          // Inline function 'kotlinx.html.visit' call
          var this_12 = new DIV(attributesMapOf('class', classes_10), this_11.get_consumer_tu5133_k$());
          this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.span' call
          var classes_11 = 'dasha-lord-name';
          // Inline function 'kotlinx.html.visit' call
          var this_13 = new SPAN(attributesMapOf('class', classes_11), this_12.get_consumer_tu5133_k$());
          this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_13.unaryPlus_76unot_k$(antar.get_lord_wopz5q_k$().get_displayName_sscnb0_k$());
          this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
          // Inline function 'kotlinx.html.span' call
          var classes_12 = 'dasha-period';
          // Inline function 'kotlinx.html.visit' call
          var this_14 = new SPAN(attributesMapOf('class', classes_12), this_12.get_consumer_tu5133_k$());
          this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_14.unaryPlus_76unot_k$(jdToDateStr(antar.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(antar.get_endJd_iqx07g_k$()));
          this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
          this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
          // Inline function 'kotlinx.html.div' call
          var classes_13 = 'dasha-pratyantars';
          // Inline function 'kotlinx.html.visit' call
          var this_15 = new DIV(attributesMapOf('class', classes_13), this_11.get_consumer_tu5133_k$());
          this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          var _iterator__ex2g4s_1 = antar.get_subPeriods_f4n1tn_k$().iterator_jk1svi_k$();
          while (_iterator__ex2g4s_1.hasNext_bitz1p_k$()) {
            var pratyantar = _iterator__ex2g4s_1.next_20eer_k$();
            // Inline function 'kotlinx.html.div' call
            var classes_14 = 'dasha-pratyantar';
            // Inline function 'kotlinx.html.visit' call
            var this_16 = new DIV(attributesMapOf('class', classes_14), this_15.get_consumer_tu5133_k$());
            this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlinx.html.span' call
            var classes_15 = 'dasha-lord-name';
            // Inline function 'kotlinx.html.visit' call
            var this_17 = new SPAN(attributesMapOf('class', classes_15), this_16.get_consumer_tu5133_k$());
            this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            this_17.unaryPlus_76unot_k$(pratyantar.get_lord_wopz5q_k$().get_displayName_sscnb0_k$());
            this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
            // Inline function 'kotlinx.html.span' call
            var classes_16 = 'dasha-period';
            // Inline function 'kotlinx.html.visit' call
            var this_18 = new SPAN(attributesMapOf('class', classes_16), this_16.get_consumer_tu5133_k$());
            this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
            // Inline function 'kotlinx.html.visit.<anonymous>' call
            // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            this_18.unaryPlus_76unot_k$(jdToDateStr(pratyantar.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(pratyantar.get_endJd_iqx07g_k$()));
            this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
            this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
          }
          this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
          this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
        }
        this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
        this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
      }
      this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
      this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
      // Inline function 'kotlinx.html.div' call
      var classes_17 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_19 = new DIV(attributesMapOf('class', classes_17), this_0.get_consumer_tu5133_k$());
      this_19.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_19);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_20 = new H2(attributesMapOf('class', null), this_19.get_consumer_tu5133_k$());
      this_20.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_20);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_20.unaryPlus_76unot_k$('\u5F53\u524D Dasha');
      this_20.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_20);
      var nowJd = julianDay(2026, 8, 5, 0.0);
      var currentMaha = findCurrentDasha($dashaPeriods, nowJd);
      if (!(currentMaha == null)) {
        var currentAntar = findCurrentDasha(currentMaha.get_subPeriods_f4n1tn_k$(), nowJd);
        var tmp;
        if (currentAntar == null) {
          tmp = null;
        } else {
          // Inline function 'kotlin.let' call
          // Inline function 'kotlin.contracts.contract' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          tmp = findCurrentDasha(currentAntar.get_subPeriods_f4n1tn_k$(), nowJd);
        }
        var currentPratyantar = tmp;
        // Inline function 'kotlinx.html.div' call
        var classes_18 = 'current-dasha';
        // Inline function 'kotlinx.html.visit' call
        var this_21 = new DIV(attributesMapOf('class', classes_18), this_19.get_consumer_tu5133_k$());
        this_21.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_21);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_19 = 'dasha-row';
        // Inline function 'kotlinx.html.visit' call
        var this_22 = new DIV(attributesMapOf('class', classes_19), this_21.get_consumer_tu5133_k$());
        this_22.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_22);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.strong' call
        // Inline function 'kotlinx.html.visit' call
        var this_23 = new STRONG(attributesMapOf('class', null), this_22.get_consumer_tu5133_k$());
        this_23.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_23);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_23.unaryPlus_76unot_k$('\u5927\u8FD0\uFF1A');
        this_23.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_23);
        // Inline function 'kotlinx.html.span' call
        // Inline function 'kotlinx.html.visit' call
        var this_24 = new SPAN(attributesMapOf('class', null), this_22.get_consumer_tu5133_k$());
        this_24.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_24);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_24.unaryPlus_76unot_k$(currentMaha.get_lord_wopz5q_k$().get_displayName_sscnb0_k$() + ' (' + jdToDateStr(currentMaha.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(currentMaha.get_endJd_iqx07g_k$()) + ')');
        this_24.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_24);
        this_22.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_22);
        if (!(currentAntar == null)) {
          // Inline function 'kotlinx.html.div' call
          var classes_20 = 'dasha-row';
          // Inline function 'kotlinx.html.visit' call
          var this_25 = new DIV(attributesMapOf('class', classes_20), this_21.get_consumer_tu5133_k$());
          this_25.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_25);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.strong' call
          // Inline function 'kotlinx.html.visit' call
          var this_26 = new STRONG(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
          this_26.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_26);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_26.unaryPlus_76unot_k$('\u5C0F\u8FD0\uFF1A');
          this_26.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_26);
          // Inline function 'kotlinx.html.span' call
          // Inline function 'kotlinx.html.visit' call
          var this_27 = new SPAN(attributesMapOf('class', null), this_25.get_consumer_tu5133_k$());
          this_27.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_27);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_27.unaryPlus_76unot_k$(currentAntar.get_lord_wopz5q_k$().get_displayName_sscnb0_k$() + ' (' + jdToDateStr(currentAntar.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(currentAntar.get_endJd_iqx07g_k$()) + ')');
          this_27.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_27);
          this_25.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_25);
        }
        if (!(currentPratyantar == null)) {
          // Inline function 'kotlinx.html.div' call
          var classes_21 = 'dasha-row';
          // Inline function 'kotlinx.html.visit' call
          var this_28 = new DIV(attributesMapOf('class', classes_21), this_21.get_consumer_tu5133_k$());
          this_28.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_28);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.strong' call
          // Inline function 'kotlinx.html.visit' call
          var this_29 = new STRONG(attributesMapOf('class', null), this_28.get_consumer_tu5133_k$());
          this_29.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_29);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_29.unaryPlus_76unot_k$('\u8FC7\u8FD0\uFF1A');
          this_29.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_29);
          // Inline function 'kotlinx.html.span' call
          // Inline function 'kotlinx.html.visit' call
          var this_30 = new SPAN(attributesMapOf('class', null), this_28.get_consumer_tu5133_k$());
          this_30.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_30);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_30.unaryPlus_76unot_k$(currentPratyantar.get_lord_wopz5q_k$().get_displayName_sscnb0_k$() + ' (' + jdToDateStr(currentPratyantar.get_startJd_u3zc19_k$()) + ' \u2192 ' + jdToDateStr(currentPratyantar.get_endJd_iqx07g_k$()) + ')');
          this_30.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_30);
          this_28.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_28);
        }
        this_21.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_21);
      } else {
        // Inline function 'kotlinx.html.p' call
        // Inline function 'kotlinx.html.visit' call
        var this_31 = new P(attributesMapOf('class', null), this_19.get_consumer_tu5133_k$());
        this_31.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_31);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.renderDashaTab.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_31.unaryPlus_76unot_k$('\u672A\u627E\u5230\u5F53\u524D Dasha\uFF08\u53EF\u80FD\u4E0D\u5728\u8303\u56F4\u5185\uFF09\u3002');
        this_31.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_31);
      }
      this_19.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_19);
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp_0 = $this$append.finalize_b9lof6_k$();
      tmp_0 instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function computeHorary$lambda($kpNum, $moonDeg, $horaryInput, $hour, $jd, $ascDeg, $rp, $events, $cusps, $planets, $cuspal) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'results-container';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.div' call
      var classes_0 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_1 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
      this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_2 = new H2(attributesMapOf('class', null), this_1.get_consumer_tu5133_k$());
      this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_2.unaryPlus_76unot_k$('Horary \u95EE\u535C\u76D8 \xB7 KP #' + $kpNum);
      this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
      // Inline function 'kotlinx.html.p' call
      var classes_1 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_3 = new P(attributesMapOf('class', classes_1), this_1.get_consumer_tu5133_k$());
      this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_3.unaryPlus_76unot_k$('\u865A\u62DF\u6708\u4EAE\u4F4D\u7F6E\uFF1A' + formatSignDeg($moonDeg) + '\uFF08' + kpPosition($moonDeg).get_nakshatra_6blf52_k$().get_displayName_sscnb0_k$() + '\uFF0CPada ' + nakshatraPada($moonDeg) + '\uFF09');
      this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
      // Inline function 'kotlinx.html.p' call
      var classes_2 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_4 = new P(attributesMapOf('class', classes_2), this_1.get_consumer_tu5133_k$());
      this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_4.unaryPlus_76unot_k$('\u95EE\u535C\u65F6\u95F4\uFF1A' + $horaryInput.year_1 + '-' + $horaryInput.month_1 + '-' + $horaryInput.day_1 + ' ' + formatHour($hour) + ' UT');
      this_4.unaryPlus_76unot_k$(' \xB7 JD ' + formatDouble($jd, 4));
      this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
      // Inline function 'kotlinx.html.p' call
      var classes_3 = 'card-hint';
      // Inline function 'kotlinx.html.visit' call
      var this_5 = new P(attributesMapOf('class', classes_3), this_1.get_consumer_tu5133_k$());
      this_5.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_5);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_5.unaryPlus_76unot_k$('\u4E0A\u5347\u70B9\uFF1A' + formatSignDeg($ascDeg) + '\uFF08' + Companion_getInstance_2().fromLongitudeDeg_qpnd6t_k$($ascDeg).get_displayName_sscnb0_k$() + '\uFF09');
      this_5.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_5);
      // Inline function 'kotlinx.html.div' call
      var classes_4 = 'rp-summary';
      // Inline function 'kotlinx.html.visit' call
      var this_6 = new DIV(attributesMapOf('class', classes_4), this_1.get_consumer_tu5133_k$());
      this_6.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_6);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h3' call
      // Inline function 'kotlinx.html.visit' call
      var this_7 = new H3(attributesMapOf('class', null), this_6.get_consumer_tu5133_k$());
      this_7.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_7);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_7.unaryPlus_76unot_k$('\u6267\u638C\u884C\u661F RP');
      this_7.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_7);
      // Inline function 'kotlinx.html.div' call
      var classes_5 = 'rp-grid compact';
      // Inline function 'kotlinx.html.visit' call
      var this_8 = new DIV(attributesMapOf('class', classes_5), this_6.get_consumer_tu5133_k$());
      this_8.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_8);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s = $rp.iterator_jk1svi_k$();
      while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo = _iterator__ex2g4s.next_20eer_k$();
        var lord = _destruct__k2r9zo.component1_7eebsc_k$();
        var count = _destruct__k2r9zo.component2_7eebsb_k$();
        // Inline function 'kotlinx.html.div' call
        // Inline function 'kotlinx.html.visit' call
        var this_9 = new DIV(attributesMapOf('class', 'rp-card'), this_8.get_consumer_tu5133_k$());
        this_9.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_9);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        // Inline function 'kotlinx.html.visit' call
        var this_10 = new SPAN(attributesMapOf('class', 'rp-name'), this_9.get_consumer_tu5133_k$());
        this_10.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_10);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_10.unaryPlus_76unot_k$(lord.get_displayName_sscnb0_k$());
        this_10.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_10);
        // Inline function 'kotlinx.html.span' call
        var classes_6 = 'rp-count';
        // Inline function 'kotlinx.html.visit' call
        var this_11 = new SPAN(attributesMapOf('class', classes_6), this_9.get_consumer_tu5133_k$());
        this_11.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_11);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_11.unaryPlus_76unot_k$('\xD7' + count);
        this_11.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_11);
        this_9.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_9);
      }
      this_8.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_8);
      this_6.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_6);
      this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
      // Inline function 'kotlinx.html.div' call
      var classes_7 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_12 = new DIV(attributesMapOf('class', classes_7), this_0.get_consumer_tu5133_k$());
      this_12.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_12);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_13 = new H2(attributesMapOf('class', null), this_12.get_consumer_tu5133_k$());
      this_13.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_13);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_13.unaryPlus_76unot_k$('\u4E8B\u9879\u5224\u5B9A');
      this_13.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_13);
      // Inline function 'kotlinx.html.div' call
      var classes_8 = 'event-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_14 = new DIV(attributesMapOf('class', classes_8), this_12.get_consumer_tu5133_k$());
      this_14.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_14);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_0 = $events.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_0.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo_0 = _iterator__ex2g4s_0.next_20eer_k$();
        var event = _destruct__k2r9zo_0.component1_7eebsc_k$();
        var promised = _destruct__k2r9zo_0.component2_7eebsb_k$();
        // Inline function 'kotlinx.html.div' call
        var classes_9 = 'event-card ' + (promised ? 'event-promised' : 'event-denied');
        // Inline function 'kotlinx.html.visit' call
        var this_15 = new DIV(attributesMapOf('class', classes_9), this_14.get_consumer_tu5133_k$());
        this_15.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_15);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_10 = 'event-icon';
        // Inline function 'kotlinx.html.visit' call
        var this_16 = new DIV(attributesMapOf('class', classes_10), this_15.get_consumer_tu5133_k$());
        this_16.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_16);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_16.unaryPlus_76unot_k$(promised ? '\u2713' : '\u2717');
        this_16.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_16);
        // Inline function 'kotlinx.html.div' call
        var classes_11 = 'event-name';
        // Inline function 'kotlinx.html.visit' call
        var this_17 = new DIV(attributesMapOf('class', classes_11), this_15.get_consumer_tu5133_k$());
        this_17.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_17);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_17.unaryPlus_76unot_k$(event.get_displayName_sscnb0_k$());
        this_17.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_17);
        // Inline function 'kotlinx.html.div' call
        var classes_12 = 'event-status';
        // Inline function 'kotlinx.html.visit' call
        var this_18 = new DIV(attributesMapOf('class', classes_12), this_15.get_consumer_tu5133_k$());
        this_18.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_18);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_18.unaryPlus_76unot_k$(promised ? '\u627F\u8BFA' : '\u4E0D\u627F\u8BFA');
        this_18.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_18);
        this_15.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_15);
      }
      this_14.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_14);
      this_12.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_12);
      // Inline function 'kotlinx.html.div' call
      var classes_13 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_19 = new DIV(attributesMapOf('class', classes_13), this_0.get_consumer_tu5133_k$());
      this_19.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_19);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_20 = new H2(attributesMapOf('class', null), this_19.get_consumer_tu5133_k$());
      this_20.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_20);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_20.unaryPlus_76unot_k$('\u884C\u661F\u4F4D\u7F6E\uFF08\u865A\u62DF\u6708\u4EAE + \u771F\u5B9E\u884C\u661F\uFF09');
      this_20.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_20);
      // Inline function 'kotlinx.html.div' call
      var classes_14 = 'item-card-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_21 = new DIV(attributesMapOf('class', classes_14), this_19.get_consumer_tu5133_k$());
      this_21.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_21);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var kpChart = new KpChart($cusps, $planets);
      var _iterator__ex2g4s_1 = $planets.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_1.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo_1 = _iterator__ex2g4s_1.next_20eer_k$();
        var planet = _destruct__k2r9zo_1.component1_7eebsc_k$();
        var deg = _destruct__k2r9zo_1.component2_7eebsb_k$();
        var kp = kpPosition(deg);
        var house = kpChart.houseOfDegree_ss35wj_k$(deg);
        var isVirtualMoon = planet.equals(Planet_Moon_getInstance());
        // Inline function 'kotlinx.html.div' call
        var classes_15 = 'item-card planet-card ' + (isVirtualMoon ? 'virtual-moon' : '');
        // Inline function 'kotlinx.html.visit' call
        var this_22 = new DIV(attributesMapOf('class', classes_15), this_21.get_consumer_tu5133_k$());
        this_22.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_22);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_16 = 'item-card-header';
        // Inline function 'kotlinx.html.visit' call
        var this_23 = new DIV(attributesMapOf('class', classes_16), this_22.get_consumer_tu5133_k$());
        this_23.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_23);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_17 = 'item-card-symbol';
        // Inline function 'kotlinx.html.visit' call
        var this_24 = new SPAN(attributesMapOf('class', classes_17), this_23.get_consumer_tu5133_k$());
        this_24.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_24);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_24.unaryPlus_76unot_k$(planet.get_symbol_jqdfoh_k$());
        this_24.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_24);
        // Inline function 'kotlinx.html.span' call
        var classes_18 = 'item-card-title';
        // Inline function 'kotlinx.html.visit' call
        var this_25 = new SPAN(attributesMapOf('class', classes_18), this_23.get_consumer_tu5133_k$());
        this_25.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_25);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_25.unaryPlus_76unot_k$(planet.get_displayName_sscnb0_k$());
        this_25.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_25);
        if (isVirtualMoon) {
          // Inline function 'kotlinx.html.span' call
          var classes_19 = 'item-card-tag virtual-tag';
          // Inline function 'kotlinx.html.visit' call
          var this_26 = new SPAN(attributesMapOf('class', classes_19), this_23.get_consumer_tu5133_k$());
          this_26.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_26);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_26.unaryPlus_76unot_k$('\u865A\u62DF');
          this_26.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_26);
        }
        // Inline function 'kotlinx.html.span' call
        var classes_20 = 'item-card-tag';
        // Inline function 'kotlinx.html.visit' call
        var this_27 = new SPAN(attributesMapOf('class', classes_20), this_23.get_consumer_tu5133_k$());
        this_27.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_27);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_27.unaryPlus_76unot_k$('H' + house);
        this_27.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_27);
        this_23.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_23);
        // Inline function 'kotlinx.html.div' call
        var classes_21 = 'data-grid';
        // Inline function 'kotlinx.html.visit' call
        var this_28 = new DIV(attributesMapOf('class', classes_21), this_22.get_consumer_tu5133_k$());
        this_28.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_28);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_22 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_29 = new DIV(attributesMapOf('class', classes_22), this_28.get_consumer_tu5133_k$());
        this_29.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_29);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_23 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_30 = new SPAN(attributesMapOf('class', classes_23), this_29.get_consumer_tu5133_k$());
        this_30.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_30);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_30.unaryPlus_76unot_k$('\u9EC4\u7ECF');
        this_30.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_30);
        // Inline function 'kotlinx.html.span' call
        var classes_24 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_31 = new SPAN(attributesMapOf('class', classes_24), this_29.get_consumer_tu5133_k$());
        this_31.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_31);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_31.unaryPlus_76unot_k$(formatSignDeg(deg));
        this_31.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_31);
        this_29.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_29);
        // Inline function 'kotlinx.html.div' call
        var classes_25 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_32 = new DIV(attributesMapOf('class', classes_25), this_28.get_consumer_tu5133_k$());
        this_32.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_32);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_26 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_33 = new SPAN(attributesMapOf('class', classes_26), this_32.get_consumer_tu5133_k$());
        this_33.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_33);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_33.unaryPlus_76unot_k$('\u5BBF\u4E3B');
        this_33.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_33);
        // Inline function 'kotlinx.html.span' call
        var classes_27 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_34 = new SPAN(attributesMapOf('class', classes_27), this_32.get_consumer_tu5133_k$());
        this_34.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_34);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_34.unaryPlus_76unot_k$(kp.get_starLord_a1nf0w_k$().get_displayName_sscnb0_k$());
        this_34.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_34);
        this_32.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_32);
        // Inline function 'kotlinx.html.div' call
        var classes_28 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_35 = new DIV(attributesMapOf('class', classes_28), this_28.get_consumer_tu5133_k$());
        this_35.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_35);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_29 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_36 = new SPAN(attributesMapOf('class', classes_29), this_35.get_consumer_tu5133_k$());
        this_36.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_36);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_36.unaryPlus_76unot_k$('\u5B50\u4E3B');
        this_36.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_36);
        // Inline function 'kotlinx.html.span' call
        var classes_30 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_37 = new SPAN(attributesMapOf('class', classes_30), this_35.get_consumer_tu5133_k$());
        this_37.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_37);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_37.unaryPlus_76unot_k$(kp.get_subLord_tn29as_k$().get_displayName_sscnb0_k$());
        this_37.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_37);
        this_35.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_35);
        // Inline function 'kotlinx.html.div' call
        var classes_31 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_38 = new DIV(attributesMapOf('class', classes_31), this_28.get_consumer_tu5133_k$());
        this_38.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_38);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_32 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_39 = new SPAN(attributesMapOf('class', classes_32), this_38.get_consumer_tu5133_k$());
        this_39.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_39);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_39.unaryPlus_76unot_k$('KP\u53F7');
        this_39.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_39);
        // Inline function 'kotlinx.html.span' call
        var classes_33 = 'data-value kp-num';
        // Inline function 'kotlinx.html.visit' call
        var this_40 = new SPAN(attributesMapOf('class', classes_33), this_38.get_consumer_tu5133_k$());
        this_40.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_40);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_40.unaryPlus_76unot_k$(kp.get_kpNumber_o5erl5_k$().toString());
        this_40.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_40);
        this_38.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_38);
        this_28.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_28);
        this_22.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_22);
      }
      this_21.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_21);
      this_19.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_19);
      // Inline function 'kotlinx.html.div' call
      var classes_34 = 'result-card';
      // Inline function 'kotlinx.html.visit' call
      var this_41 = new DIV(attributesMapOf('class', classes_34), this_0.get_consumer_tu5133_k$());
      this_41.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_41);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h2' call
      // Inline function 'kotlinx.html.visit' call
      var this_42 = new H2(attributesMapOf('class', null), this_41.get_consumer_tu5133_k$());
      this_42.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_42);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      this_42.unaryPlus_76unot_k$('\u5BAB\u9996\u5B50\u661F\u5206\u6790');
      this_42.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_42);
      // Inline function 'kotlinx.html.div' call
      var classes_35 = 'item-card-grid';
      // Inline function 'kotlinx.html.visit' call
      var this_43 = new DIV(attributesMapOf('class', classes_35), this_41.get_consumer_tu5133_k$());
      this_43.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_43);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s_2 = $cuspal.iterator_jk1svi_k$();
      while (_iterator__ex2g4s_2.hasNext_bitz1p_k$()) {
        var c = _iterator__ex2g4s_2.next_20eer_k$();
        // Inline function 'kotlinx.html.div' call
        var classes_36 = 'item-card cusp-card';
        // Inline function 'kotlinx.html.visit' call
        var this_44 = new DIV(attributesMapOf('class', classes_36), this_43.get_consumer_tu5133_k$());
        this_44.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_44);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_37 = 'item-card-header';
        // Inline function 'kotlinx.html.visit' call
        var this_45 = new DIV(attributesMapOf('class', classes_37), this_44.get_consumer_tu5133_k$());
        this_45.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_45);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_38 = 'item-card-title';
        // Inline function 'kotlinx.html.visit' call
        var this_46 = new SPAN(attributesMapOf('class', classes_38), this_45.get_consumer_tu5133_k$());
        this_46.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_46);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_46.unaryPlus_76unot_k$('\u7B2C ' + c.get_house_islek7_k$() + ' \u5BAB');
        this_46.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_46);
        // Inline function 'kotlinx.html.span' call
        var classes_39 = 'item-card-tag ' + c.get_promise_3ujnbi_k$().get_cssClass_j5a41q_k$();
        // Inline function 'kotlinx.html.visit' call
        var this_47 = new SPAN(attributesMapOf('class', classes_39), this_45.get_consumer_tu5133_k$());
        this_47.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_47);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_47.unaryPlus_76unot_k$(c.get_promise_3ujnbi_k$().get_label_iuj8p7_k$());
        this_47.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_47);
        this_45.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_45);
        // Inline function 'kotlinx.html.div' call
        var classes_40 = 'data-grid';
        // Inline function 'kotlinx.html.visit' call
        var this_48 = new DIV(attributesMapOf('class', classes_40), this_44.get_consumer_tu5133_k$());
        this_48.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_48);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.div' call
        var classes_41 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_49 = new DIV(attributesMapOf('class', classes_41), this_48.get_consumer_tu5133_k$());
        this_49.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_49);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_42 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_50 = new SPAN(attributesMapOf('class', classes_42), this_49.get_consumer_tu5133_k$());
        this_50.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_50);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_50.unaryPlus_76unot_k$('\u5BAB\u9996');
        this_50.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_50);
        // Inline function 'kotlinx.html.span' call
        var classes_43 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_51 = new SPAN(attributesMapOf('class', classes_43), this_49.get_consumer_tu5133_k$());
        this_51.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_51);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_51.unaryPlus_76unot_k$(formatSignDeg(c.get_cuspDeg_jx00ge_k$()));
        this_51.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_51);
        this_49.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_49);
        // Inline function 'kotlinx.html.div' call
        var classes_44 = 'data-cell';
        // Inline function 'kotlinx.html.visit' call
        var this_52 = new DIV(attributesMapOf('class', classes_44), this_48.get_consumer_tu5133_k$());
        this_52.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_52);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        // Inline function 'kotlinx.html.span' call
        var classes_45 = 'data-label';
        // Inline function 'kotlinx.html.visit' call
        var this_53 = new SPAN(attributesMapOf('class', classes_45), this_52.get_consumer_tu5133_k$());
        this_53.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_53);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_53.unaryPlus_76unot_k$('\u5B50\u4E3B');
        this_53.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_53);
        // Inline function 'kotlinx.html.span' call
        var classes_46 = 'data-value';
        // Inline function 'kotlinx.html.visit' call
        var this_54 = new SPAN(attributesMapOf('class', classes_46), this_52.get_consumer_tu5133_k$());
        this_54.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_54);
        // Inline function 'kotlinx.html.visit.<anonymous>' call
        // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
        this_54.unaryPlus_76unot_k$(c.get_subLord_tn29as_k$().get_displayName_sscnb0_k$());
        this_54.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_54);
        this_52.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_52);
        this_48.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_48);
        this_44.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_44);
      }
      this_43.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_43);
      this_41.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_41);
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp = $this$append.finalize_b9lof6_k$();
      tmp instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function computeHorary$lambda_0($e) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'error-card';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>' call
      // Inline function 'kotlinx.html.h3' call
      // Inline function 'kotlinx.html.visit' call
      var this_1 = new H3(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
      this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      this_1.unaryPlus_76unot_k$('Horary \u8BA1\u7B97\u9519\u8BEF');
      this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
      // Inline function 'kotlinx.html.pre' call
      // Inline function 'kotlinx.html.visit' call
      var this_2 = new PRE(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
      this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
      // Inline function 'kotlinx.html.visit.<anonymous>' call
      // Inline function 'kp.astro.computeHorary.<anonymous>.<anonymous>.<anonymous>' call
      var tmp0_elvis_lhs = $e.message;
      this_2.unaryPlus_76unot_k$(tmp0_elvis_lhs == null ? $e.toString() : tmp0_elvis_lhs);
      this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp = $this$append.finalize_b9lof6_k$();
      tmp instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function renderDebugOutput$lambda($lines) {
    return function ($this$append) {
      // Inline function 'kotlinx.html.js.div' call
      var classes = 'debug-lines';
      // Inline function 'kotlinx.html.visitAndFinalize' call
      // Inline function 'kotlinx.html.visitTagAndFinalize' call
      var this_0 = new DIV(attributesMapOf('class', classes), $this$append);
      if (!(this_0.get_consumer_tu5133_k$() === $this$append)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      // Inline function 'kotlinx.html.visitTag' call
      this_0.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_0);
      // Inline function 'kotlinx.html.visitAndFinalize.<anonymous>' call
      // Inline function 'kp.astro.renderDebugOutput.<anonymous>.<anonymous>' call
      var _iterator__ex2g4s = $lines.iterator_jk1svi_k$();
      while (_iterator__ex2g4s.hasNext_bitz1p_k$()) {
        var _destruct__k2r9zo = _iterator__ex2g4s.next_20eer_k$();
        var k = _destruct__k2r9zo.component1_7eebsc_k$();
        var v = _destruct__k2r9zo.component2_7eebsb_k$();
        // Inline function 'kotlin.text.isEmpty' call
        if (charSequenceLength(k) === 0) {
          // Inline function 'kotlinx.html.hr' call
          // Inline function 'kotlinx.html.visit' call
          var this_1 = new HR(attributesMapOf('class', null), this_0.get_consumer_tu5133_k$());
          this_1.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_1);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDebugOutput.<anonymous>.<anonymous>.<anonymous>' call
          this_1.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_1);
        } else {
          // Inline function 'kotlinx.html.div' call
          var classes_0 = 'debug-line';
          // Inline function 'kotlinx.html.visit' call
          var this_2 = new DIV(attributesMapOf('class', classes_0), this_0.get_consumer_tu5133_k$());
          this_2.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_2);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDebugOutput.<anonymous>.<anonymous>.<anonymous>' call
          // Inline function 'kotlinx.html.span' call
          var classes_1 = 'debug-key';
          // Inline function 'kotlinx.html.visit' call
          var this_3 = new SPAN(attributesMapOf('class', classes_1), this_2.get_consumer_tu5133_k$());
          this_3.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_3);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDebugOutput.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_3.unaryPlus_76unot_k$(k);
          this_3.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_3);
          // Inline function 'kotlinx.html.span' call
          var classes_2 = 'debug-val';
          // Inline function 'kotlinx.html.visit' call
          var this_4 = new SPAN(attributesMapOf('class', classes_2), this_2.get_consumer_tu5133_k$());
          this_4.get_consumer_tu5133_k$().onTagStart_7c9gr1_k$(this_4);
          // Inline function 'kotlinx.html.visit.<anonymous>' call
          // Inline function 'kp.astro.renderDebugOutput.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
          this_4.unaryPlus_76unot_k$(v);
          this_4.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_4);
          this_2.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_2);
        }
      }
      this_0.get_consumer_tu5133_k$().onTagEnd_41rex2_k$(this_0);
      var tmp = $this$append.finalize_b9lof6_k$();
      tmp instanceof HTMLDivElement || THROW_CCE();
      return Unit_getInstance();
    };
  }
  function HouseSystem_Placidus_getInstance() {
    HouseSystem_initEntries();
    return HouseSystem_Placidus_instance;
  }
  function HouseSystem_Equal_getInstance() {
    HouseSystem_initEntries();
    return HouseSystem_Equal_instance;
  }
  function HouseSystem_WholeSign_getInstance() {
    HouseSystem_initEntries();
    return HouseSystem_WholeSign_instance;
  }
  function mainWrapper() {
    main();
  }
  //region block: init
  YEAR_IN_DAYS = 365.25;
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $kp = _.kp || (_.kp = {});
    var $kp$astro = $kp.astro || ($kp.astro = {});
    $kp$astro.setupAyanamsaToggle = setupAyanamsaToggle;
    $kp$astro.initApp = initApp;
  }
  $jsExportAll$(_);
  //endregion
  mainWrapper();
  return _;
}));

//# sourceMappingURL=kp-astro.js.map
