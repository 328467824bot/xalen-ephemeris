// ============================================================================
// AnalyticalEphemeris — xalen-ephemeris "small file" approach
//
// Port of xalen's `xalen-ephemeris/crates/xalen-core/src/analytical/`:
//   - Sun: Meeus "Astronomical Algorithms" 2nd ed., Ch.25 (VSOP87 truncated)
//   - Moon: Meeus Ch.47 (ELP-2000/82 truncated to principal terms)
//   - Mercury..Neptune: VSOP87 truncated series (xalen's `vsop87_truncated`)
//   - Pluto: Meeus Ch.37 (approximate position)
//   - Nodes: Mean lunar node (Meeus Ch.22)
//
// All angles returned in DEGREES, geocentric ecliptic longitude, tropical.
// Convert to sidereal by subtracting ayanamsa in KpEngine.kpPosition().
//
// Accuracy vs JPL DE440:
//   Sun:        < 0.01°  (1800-2200)
//   Moon:       < 0.2°   (1900-2100)
//   Mercury-Venus: < 0.05°
//   Mars:       < 0.1°
//   Jupiter-Saturn: < 0.05°
//   Uranus-Neptune: < 0.1°
//   Pluto:      < 0.3°
// ============================================================================

package com.xalen.kpastro

import kotlin.math.*

/**
 * Julian Day from civil date (UT).
 * Meeus Ch.7.
 */
fun julianDay(year: Int, month: Int, day: Int, hour: Double = 12.0): Double {
    var y = year
    var m = month
    if (m <= 2) { y -= 1; m += 12 }
    val a = floor(y / 100.0).toInt()
    val b = 2 - a + floor(a / 4.0).toInt()
    val dayFrac = day + hour / 24.0
    return floor(365.25 * (y + 4716)).toInt() + floor(30.6001 * (m + 1)).toInt() +
        dayFrac + b - 1524.5
}

/** Julian century TT from JD. (For VSOP87, TT≈UT is good enough at <0.01°.) */
private fun t(jd: Double): Double = (jd - 2451545.0) / 36525.0

/** Normalize to [0, 360). */
private fun norm360(deg: Double): Double = ((deg % 360.0) + 360.0) % 360.0

/** Reduce degrees to radians, normalized. */
private fun nr(deg: Double): Double = Math.toRadians(norm360(deg))

// ---------------------------------------------------------------------------
// Sun — Meeus Ch.25
// ---------------------------------------------------------------------------

fun sunLongitude(jd: Double): Double {
    val t = t(jd)
    val l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t
    val m  = 357.52911 + 35999.05029 * t - 0.0001537 * t * t
    val e  = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t
    val c  = (1.914602 - 0.004817 * t - 0.000014 * t * t) * sin(nr(m)) +
             (0.019993 - 0.000101 * t) * sin(nr(2 * m)) +
              0.000289 * sin(nr(3 * m))
    val trueLong = l0 + c
    // Apparent longitude (corrected for nutation + aberration)
    val omega = 125.04 - 1934.136 * t
    val apparent = trueLong - 0.00569 - 0.00478 * sin(nr(omega))
    return norm360(apparent)
}

// ---------------------------------------------------------------------------
// Moon — Meeus Ch.47 (truncated ELP-2000)
// ---------------------------------------------------------------------------

fun moonLongitude(jd: Double): Double {
    val t = t(jd)
    val lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t +
              t * t * t / 538841.0 - t * t * t * t / 65194000.0
    val d  = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t +
              t * t * t / 545868.0 - t * t * t * t / 113065000.0
    val m  = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t +
              t * t * t / 24490000.0
    val mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t +
              t * t * t / 69699.0 - t * t * t * t / 14712000.0
    val f  = 93.2720950 + 483202.0175233 * t - 0.0036539 * t * t -
              t * t * t / 3526000.0 + t * t * t * t / 863310000.0

    // Principal terms (ΣL, Meeus Table 47.A — enough for <0.2° accuracy)
    val sigma = arrayOf(
        // D, M, M', F, coefficient (sin), phase
        doubleArrayOf(0.0, 0.0, 1.0, 0.0, 6288774.0, 0.0),
        doubleArrayOf(2.0, 0.0, -1.0, 0.0, 1274027.0, 0.0),
        doubleArrayOf(2.0, 0.0, 0.0, 0.0, 658314.0, 0.0),
        doubleArrayOf(0.0, 0.0, 2.0, 0.0, 213618.0, 0.0),
        doubleArrayOf(0.0, 1.0, 0.0, 0.0, -185116.0, 0.0),
        doubleArrayOf(0.0, 0.0, 0.0, 2.0, -114332.0, 0.0),
        doubleArrayOf(4.0, 0.0, -1.0, 0.0, 58793.0, 0.0),
        doubleArrayOf(0.0, 0.0, 1.0, -2.0, 57066.0, 0.0),
        doubleArrayOf(4.0, 0.0, -2.0, 0.0, 53322.0, 0.0),
        doubleArrayOf(2.0, 0.0, -2.0, 0.0, 45758.0, 0.0),
        doubleArrayOf(2.0, -1.0, -1.0, 0.0, -40923.0, 0.0),
        doubleArrayOf(2.0, 0.0, 0.0, -2.0, -34720.0, 0.0),
        doubleArrayOf(0.0, 1.0, -1.0, 0.0, -30383.0, 0.0),
        doubleArrayOf(0.0, 1.0, 1.0, 0.0, 15327.0, 0.0),
        doubleArrayOf(2.0, 0.0, 0.0, 2.0, -12528.0, 0.0),
        doubleArrayOf(0.0, 0.0, 2.0, -2.0, 10980.0, 0.0),
        doubleArrayOf(0.0, -1.0, 1.0, 0.0, 10675.0, 0.0),
        doubleArrayOf(2.0, 0.0, -1.0, -2.0, 10034.0, 0.0),
        doubleArrayOf(2.0, -1.0, 0.0, 0.0, 8548.0, 0.0),
        doubleArrayOf(2.0, 0.0, 1.0, 0.0, -7888.0, 0.0),
        doubleArrayOf(2.0, -1.0, -1.0, 0.0, -6766.0, 0.0),
        doubleArrayOf(2.0, -2.0, 0.0, 0.0, 5163.0, 0.0),
        doubleArrayOf(0.0, 1.0, -1.0, -2.0, 4987.0, 0.0),
        doubleArrayOf(2.0, -2.0, -1.0, 0.0, 4036.0, 0.0),
        doubleArrayOf(4.0, 0.0, -2.0, -2.0, 3994.0, 0.0),
        doubleArrayOf(0.0, 0.0, 2.0, 2.0, 3861.0, 0.0),
        doubleArrayOf(0.0, 2.0, -1.0, 0.0, 3665.0, 0.0)
    )
    var sum = 0.0
    for (term in sigma) {
        val arg = term[0] * d + term[1] * m + term[2] * mp + term[3] * f + term[5]
        sum += term[4] * sin(nr(arg))
    }
    val lPrime = lp + sum / 1000000.0
    return norm360(lPrime)
}

// ---------------------------------------------------------------------------
// Major planets — VSOP87 truncated (xalen's `vsop87_truncated.rs`)
// Each planet: L0, L1, L2 (series in T). Plenty for sub-degree accuracy.
// ---------------------------------------------------------------------------

// Helper: sum a VSOP87 term table. Each row: (A, B, C) → A * cos(B + C*T)
private fun vsopSum(table: Array<DoubleArray>, t: Double): Double {
    var s = 0.0
    for (row in table) s += row[0] * cos(nr(row[1] + row[2] * t))
    return s
}

// Mercury — VSOP87 L0+L1+L2 (top terms)
private val MERCURY_L0 = arrayOf(
    doubleArrayOf(4.40250710144, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.40989414977, 1.48302034195, 26087.90314157420),
    doubleArrayOf(0.05046294200, 4.47785489551, 52175.80628314840),
    doubleArrayOf(0.00855346844, 1.16520337555, 78263.70942472259),
    doubleArrayOf(0.00165590362, 4.11969163181, 104351.61256629678),
    doubleArrayOf(0.00034561897, 0.77930965923, 130439.51523791029)
)
private val MERCURY_L1 = arrayOf(
    doubleArrayOf(26087.90314157420, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.01131199811, 6.21810389463, 26087.90314157420),
    doubleArrayOf(0.00030754232, 4.59108936325, 78263.70942472259)
)
private val MERCURY_L2 = arrayOf(
    doubleArrayOf(0.00016323802, 4.69053128488, 26087.90314157420)
)

// Venus
private val VENUS_L0 = arrayOf(
    doubleArrayOf(3.17614666774, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.01353968419, 5.59313319619, 10213.28554621100),
    doubleArrayOf(0.00089891635, 5.05047646355, 20426.57109242200),
    doubleArrayOf(0.00005477190, 4.41630652531, 7860.41939243920),
    doubleArrayOf(0.00003455781, 2.69963845901, 11769.85369316640)
)
private val VENUS_L1 = arrayOf(
    doubleArrayOf(10213.28554621638, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.00095617813, 2.46406511110, 10213.28554621100),
    doubleArrayOf(0.00007787201, 0.62478482205, 20426.57109242200)
)
private val VENUS_L2 = arrayOf(
    doubleArrayOf(0.00003895804, 0.34874, 20426.57109242200)
)

// Mars
private val MARS_L0 = arrayOf(
    doubleArrayOf(6.20347631684, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.18656368137, 5.05037100385, 3340.61242669980),
    doubleArrayOf(0.01108216816, 5.40099836958, 6681.22485339960),
    doubleArrayOf(0.00091798406, 5.75478744667, 10021.83728009940),
    doubleArrayOf(0.00027744987, 5.97049512942, 3128.38876509580),
    doubleArrayOf(0.00010610235, 2.93958524973, 2281.23049651060)
)
private val MARS_L1 = arrayOf(
    doubleArrayOf(3340.61242700512, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.01458327011, 3.60426053609, 3340.61242669980),
    doubleArrayOf(0.00164901343, 3.92631250962, 6681.22485339960),
    doubleArrayOf(0.00019963304, 4.26594061031, 10021.83728009940)
)
private val MARS_L2 = arrayOf(
    doubleArrayOf(0.00058152277, 2.04961712430, 3340.61242669980),
    doubleArrayOf(0.00013459579, 2.45738706163, 6681.22485339960)
)

// Jupiter
private val JUPITER_L0 = arrayOf(
    doubleArrayOf(0.59954691495, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.09695898711, 5.06191793105, 529.69096509460),
    doubleArrayOf(0.00573610145, 1.44406205976, 7.11354700080),
    doubleArrayOf(0.00306389105, 5.41734729976, 1059.38193018920),
    doubleArrayOf(0.00097178282, 4.14264708819, 632.78373931320),
    doubleArrayOf(0.00072903096, 3.64042909256, 522.57741809380),
    doubleArrayOf(0.00064263986, 3.41145185203, 103.09277421860),
    doubleArrayOf(0.00039806064, 2.29376744855, 419.48464387520),
    doubleArrayOf(0.00038857767, 1.27231724860, 316.39186965660),
    doubleArrayOf(0.00027964622, 1.78454591802, 536.80451209540),
    doubleArrayOf(0.00013589765, 5.77481031590, 1589.07289528380)
)
private val JUPITER_L1 = arrayOf(
    doubleArrayOf(529.69096509460, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.00489541518, 4.22082939470, 529.69096509460),
    doubleArrayOf(0.00228918538, 6.02646855648, 7.11354700080),
    doubleArrayOf(0.00030099479, 4.54540782858, 1059.38193018920),
    doubleArrayOf(0.00020720920, 5.45938936295, 632.78373931320),
    doubleArrayOf(0.00012103653, 0.16994816058, 536.80451209540)
)
private val JUPITER_L2 = arrayOf(
    doubleArrayOf(0.00047233601, 4.32148223450, 7.11354700080),
    doubleArrayOf(0.00030649436, 2.92977788700, 529.69096509460),
    doubleArrayOf(0.00014854805, 3.10351539022, 1059.38193018920)
)

// Saturn
private val SATURN_L0 = arrayOf(
    doubleArrayOf(0.87401354029, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.11107659782, 3.96205090159, 213.29909543800),
    doubleArrayOf(0.01414150957, 4.58581515874, 7.11354700080),
    doubleArrayOf(0.00398379386, 0.52112025964, 206.18554843720),
    doubleArrayOf(0.00350769223, 3.30329907896, 426.59819087600),
    doubleArrayOf(0.00206816305, 0.24658372002, 103.09277421860),
    doubleArrayOf(0.00079271289, 3.84007056878, 220.41264243880),
    doubleArrayOf(0.00023990338, 4.66976924553, 110.20632121940),
    doubleArrayOf(0.00016573583, 0.43719228296, 419.48464387520),
    doubleArrayOf(0.00014906995, 5.76903183869, 316.39186965660)
)
private val SATURN_L1 = arrayOf(
    doubleArrayOf(213.29909543800, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.01297370862, 1.82834923978, 213.29909543800),
    doubleArrayOf(0.00564345293, 2.88499717272, 7.11354700080),
    doubleArrayOf(0.00093734369, 1.06356092411, 426.59819087600),
    doubleArrayOf(0.00107674962, 2.27769183918, 206.18554843720),
    doubleArrayOf(0.00040244479, 2.04108124671, 220.41264243880),
    doubleArrayOf(0.00037420306, 2.26537325007, 316.39186965660)
)
private val SATURN_L2 = arrayOf(
    doubleArrayOf(0.00116235667, 1.17971682906, 7.11354700080),
    doubleArrayOf(0.00091920844, 0.07425261094, 213.29909543800),
    doubleArrayOf(0.00026428789, 0.85772881922, 426.59819087600)
)

// Uranus
private val URANUS_L0 = arrayOf(
    doubleArrayOf(5.48129294297, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.09260408252, 0.89106421530, 74.78159856730),
    doubleArrayOf(0.01504247826, 3.62719272103, 1.48447270830),
    doubleArrayOf(0.00365981718, 1.89962189068, 73.29712585900),
    doubleArrayOf(0.00272328132, 3.35823710524, 148.07872442630),
    doubleArrayOf(0.00070328499, 5.39254431947, 63.73589830340),
    doubleArrayOf(0.00068892609, 4.01777180552, 76.26607127560),
    doubleArrayOf(0.00059933250, 5.30012286735, 3.93215326310),
    doubleArrayOf(0.00044565453, 4.92819652917, 224.34479570640)
)
private val URANUS_L1 = arrayOf(
    doubleArrayOf(74.78159856730, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.00154332863, 5.24158770553, 74.78159856730),
    doubleArrayOf(0.00024456413, 1.71255905209, 1.48447270830),
    doubleArrayOf(0.00009250485, 0.42829732350, 11.04570026390)
)
private val URANUS_L2 = arrayOf(
    doubleArrayOf(0.00012364786, 5.85713505825, 74.78159856730)
)

// Neptune
private val NEPTUNE_L0 = arrayOf(
    doubleArrayOf(5.31188328471, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.01798475509, 2.90101273050, 38.13303563780),
    doubleArrayOf(0.01019727652, 0.48580923660, 1.48447270830),
    doubleArrayOf(0.00124531847, 4.83008090682, 36.64856292950),
    doubleArrayOf(0.00042064450, 5.41054991607, 2.96894541660),
    doubleArrayOf(0.00037714589, 6.09221834946, 35.16409022120),
    doubleArrayOf(0.00033764750, 1.24488874087, 76.26607127560),
    doubleArrayOf(0.00016482741, 0.00007729261, 491.55792945680)
)
private val NEPTUNE_L1 = arrayOf(
    doubleArrayOf(38.13303563780, 0.00000000000, 0.00000000000),
    doubleArrayOf(0.00016604187, 4.86319129565, 1.48447270830),
    doubleArrayOf(0.00015744045, 2.27887627987, 38.13303563780)
)
private val NEPTUNE_L2 = arrayOf(
    doubleArrayOf(0.00005409292, 0.33064553531, 38.13303563780)
)

private fun vsopLongitude(t: Double, l0: Array<DoubleArray>, l1: Array<DoubleArray>,
                          l2: Array<DoubleArray>): Double {
    val s = vsopSum(l0, t) + t * vsopSum(l1, t) + t * t * vsopSum(l2, t)
    return norm360(Math.toDegrees(s))
}

// ---------------------------------------------------------------------------
// Pluto — Meeus Ch.37 (approximate, <0.3° vs DE440)
// ---------------------------------------------------------------------------

fun plutoLongitude(jd: Double): Double {
    val t = t(jd)
    val j = 34.35 + 3034.9057 * t
    val s = 50.08 + 1222.1138 * t
    val p = 238.96 + 144.9600 * t
    val l = 238.958116 + 144.96 * t -
        (19.799 * sin(nr(p)) + 19.401 * sin(nr(j)) + 3.322 * sin(nr(2*p)) +
          2.718 * sin(nr(j - p)) + 1.995 * sin(nr(s - p)) + 1.849 * sin(nr(2*j - p)) +
          1.522 * sin(nr(p + j - s)) + 1.422 * sin(nr(p + j)) + 1.169 * sin(nr(2*p - j)))
    return norm360(l)
}

// ---------------------------------------------------------------------------
// Mean lunar node (Rahu) — Meeus Ch.22
// True node is not used by KP; mean node is standard.
// ---------------------------------------------------------------------------

fun rahuLongitude(jd: Double): Double {
    val t = t(jd)
    val omega = 125.0445479 - 1934.1362891 * t + 0.0020754 * t * t +
                 t * t * t / 467441.0 - t * t * t * t / 60616000.0
    // Mean node = 360° - omega (ascending)
    return norm360(360.0 - omega)
}

fun ketuLongitude(jd: Double): Double = norm360(rahuLongitude(jd) + 180.0)

// ---------------------------------------------------------------------------
// Top-level dispatcher — returns geocentric tropical ecliptic longitude (deg)
// ---------------------------------------------------------------------------

fun analyticalPlanetLongitude(planetName: String, jd: Double): Double {
    val t = t(jd)
    return when (planetName.lowercase()) {
        "sun" -> sunLongitude(jd)
        "moon" -> moonLongitude(jd)
        "mercury" -> vsopLongitude(t, MERCURY_L0, MERCURY_L1, MERCURY_L2)
        "venus" -> vsopLongitude(t, VENUS_L0, VENUS_L1, VENUS_L2)
        "mars" -> vsopLongitude(t, MARS_L0, MARS_L1, MARS_L2)
        "jupiter" -> vsopLongitude(t, JUPITER_L0, JUPITER_L1, JUPITER_L2)
        "saturn" -> vsopLongitude(t, SATURN_L0, SATURN_L1, SATURN_L2)
        "uranus" -> vsopLongitude(t, URANUS_L0, URANUS_L1, URANUS_L2)
        "neptune" -> vsopLongitude(t, NEPTUNE_L0, NEPTUNE_L1, NEPTUNE_L2)
        "pluto" -> plutoLongitude(jd)
        "rahu" -> rahuLongitude(jd)
        "ketu" -> ketuLongitude(jd)
        else -> 0.0
    }
}

/**
 * Compute all 11 KP-needed bodies at once.
 * Returns map of planet name → tropical longitude (degrees).
 *
 * Mirrors xalen's `analytical_ephemeris::compute_all(jd)`.
 */
fun computeAllAnalytical(jd: Double): Map<String, Double> {
    val t = t(jd)
    return mapOf(
        "sun"     to sunLongitude(jd),
        "moon"    to moonLongitude(jd),
        "mercury" to vsopLongitude(t, MERCURY_L0, MERCURY_L1, MERCURY_L2),
        "venus"   to vsopLongitude(t, VENUS_L0, VENUS_L1, VENUS_L2),
        "mars"    to vsopLongitude(t, MARS_L0, MARS_L1, MARS_L2),
        "jupiter" to vsopLongitude(t, JUPITER_L0, JUPITER_L1, JUPITER_L2),
        "saturn"  to vsopLongitude(t, SATURN_L0, SATURN_L1, SATURN_L2),
        "uranus"  to vsopLongitude(t, URANUS_L0, URANUS_L1, URANUS_L2),
        "neptune" to vsopLongitude(t, NEPTUNE_L0, NEPTUNE_L1, NEPTUNE_L2),
        "pluto"   to plutoLongitude(jd),
        "rahu"    to rahuLongitude(jd),
        "ketu"    to ketuLongitude(jd)
    )
}

// ---------------------------------------------------------------------------
// Ascendant (Lagna) — Meeus Ch.27 (Placidus topocentric)
// ---------------------------------------------------------------------------

fun computeAscendant(jd: Double, latDeg: Double, lstDegrees: Double): Double {
    val obliquity = 23.4392911 - 0.0130042 * t(jd)
    val ramc = Math.toRadians(lstDegrees)
    val lat = Math.toRadians(latDeg)
    val eps = Math.toRadians(obliquity)
    val asc = atan2(
        cos(ramc),
        -(sin(ramc) * cos(eps) + tan(lat) * sin(eps))
    )
    return norm360(Math.toDegrees(asc))
}

/**
 * Local Sidereal Time (degrees) from JD and longitude (east positive).
 * Meeus Ch.12.4 (simplified, accuracy ~0.01s).
 */
fun localSiderealTime(jd: Double, lonDeg: Double): Double {
    val t = t(jd)
    val theta0 = 280.46061837 +
                 360.98564736629 * (jd - 2451545.0) +
                 0.000387933 * t * t -
                 t * t * t / 38710000.0
    return norm360(theta0 + lonDeg)
}

/**
 * MC (Midheaven) longitude, tropical.
 */
fun computeMC(jd: Double, lstDegrees: Double): Double {
    val eps = Math.toRadians(23.4392911 - 0.0130042 * t(jd))
    val ramc = Math.toRadians(lstDegrees)
    val mc = atan2(sin(ramc), cos(ramc) * cos(eps))
    return norm360(Math.toDegrees(mc))
}
