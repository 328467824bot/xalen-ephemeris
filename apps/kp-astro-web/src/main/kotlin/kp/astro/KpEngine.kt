// ============================================================================
// KP (Krishnamurti Paddhati) Astrology Engine — Kotlin port of xalen-ephemeris
// Based on: github.com/vedika-io/xalen-ephemeris/crates/xalen-vedic/src/kp.rs
// ============================================================================

package kp.astro

import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.round

// ---------------------------------------------------------------------------
// DashaLord — the 9 Vimshottari dasha lords (KP sequence)
// ---------------------------------------------------------------------------

enum class DashaLord(val displayName: String, val vimshottariYears: Double) {
    Ketu("计都", 7.0),
    Venus("金星", 20.0),
    Sun("太阳", 6.0),
    Moon("月亮", 10.0),
    Mars("火星", 7.0),
    Rahu("罗睺", 18.0),
    Jupiter("木星", 16.0),
    Saturn("土星", 19.0),
    Mercury("水星", 17.0);

    companion object {
        val SEQUENCE = listOf(Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury)
    }
}

// ---------------------------------------------------------------------------
// Planet — the 9 Vedic grahas + outer planets
// ---------------------------------------------------------------------------

enum class Planet(val displayName: String, val symbol: String) {
    Sun("太阳", "日"),
    Moon("月亮", "月"),
    Mars("火星", "火"),
    Mercury("水星", "水"),
    Jupiter("木星", "木"),
    Venus("金星", "金"),
    Saturn("土星", "土"),
    Rahu("罗睺", "罗"),
    Ketu("计都", "计"),
    Uranus("天王星", "天"),
    Neptune("海王星", "海"),
    Pluto("冥王星", "冥");

    companion object {
        val VEDIC_NINE = listOf(Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
        val SEVEN_VISIBLE = listOf(Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
    }
}

fun planetToDashaLord(p: Planet): DashaLord? = when (p) {
    Planet.Sun -> DashaLord.Sun
    Planet.Moon -> DashaLord.Moon
    Planet.Mars -> DashaLord.Mars
    Planet.Mercury -> DashaLord.Mercury
    Planet.Jupiter -> DashaLord.Jupiter
    Planet.Venus -> DashaLord.Venus
    Planet.Saturn -> DashaLord.Saturn
    Planet.Rahu -> DashaLord.Rahu
    Planet.Ketu -> DashaLord.Ketu
    Planet.Uranus, Planet.Neptune, Planet.Pluto -> null
}

fun planetFromDashaLord(dl: DashaLord): Planet = when (dl) {
    DashaLord.Sun -> Planet.Sun
    DashaLord.Moon -> Planet.Moon
    DashaLord.Mars -> Planet.Mars
    DashaLord.Mercury -> Planet.Mercury
    DashaLord.Jupiter -> Planet.Jupiter
    DashaLord.Venus -> Planet.Venus
    DashaLord.Saturn -> Planet.Saturn
    DashaLord.Rahu -> Planet.Rahu
    DashaLord.Ketu -> Planet.Ketu
}

// ---------------------------------------------------------------------------
// Nakshatra — 27 lunar mansions, KP uses the same 27-star scheme as Vedic
// ---------------------------------------------------------------------------

enum class Nakshatra(val displayName: String, val lord: DashaLord) {
    Ashwini("娄宿（Ashwini）", DashaLord.Ketu),
    Bharani("胃宿（Bharani）", DashaLord.Venus),
    Krittika("昴宿（Krittika）", DashaLord.Sun),
    Rohini("毕宿（Rohini）", DashaLord.Moon),
    Mrigashira("觜宿（Mrigashira）", DashaLord.Mars),
    Ardra("参宿（Ardra）", DashaLord.Rahu),
    Punarvasu("井宿（Punarvasu）", DashaLord.Jupiter),
    Pushya("鬼宿（Pushya）", DashaLord.Saturn),
    Ashlesha("柳宿（Ashlesha）", DashaLord.Mercury),
    Magha("星宿（Magha）", DashaLord.Ketu),
    PurvaPhalguni("张宿（Purva Phalguni）", DashaLord.Venus),
    UttaraPhalguni("翼宿（Uttara Phalguni）", DashaLord.Sun),
    Hasta("轸宿（Hasta）", DashaLord.Moon),
    Chitra("角宿（Chitra）", DashaLord.Mars),
    Swati("亢宿（Swati）", DashaLord.Rahu),
    Vishakha("氐宿（Vishakha）", DashaLord.Jupiter),
    Anuradha("房宿（Anuradha）", DashaLord.Saturn),
    Jyeshtha("心宿（Jyeshtha）", DashaLord.Mercury),
    Mula("尾宿（Mula）", DashaLord.Ketu),
    PurvaAshadha("箕宿（Purva Ashadha）", DashaLord.Venus),
    UttaraAshadha("斗宿（Uttara Ashadha）", DashaLord.Sun),
    Shravana("牛宿（Shravana）", DashaLord.Moon),
    Dhanishta("女宿（Dhanishta）", DashaLord.Mars),
    Shatabhisha("虚宿（Shatabhisha）", DashaLord.Rahu),
    PurvaBhadrapada("危宿（Purva Bhadrapada）", DashaLord.Jupiter),
    UttaraBhadrapada("室宿（Uttara Bhadrapada）", DashaLord.Saturn),
    Revati("壁宿（Revati）", DashaLord.Mercury);

    companion object {
        val ALL = entries.toList()
        val SPAN: Double = 360.0 / 27.0  // 13.3333°

        fun fromLongitudeDeg(deg: Double): Nakshatra {
            val lon = ((deg % 360.0) + 360.0) % 360.0
            val idx = floor(lon / SPAN).toInt() % 27
            return ALL[idx]
        }
    }
}

// ---------------------------------------------------------------------------
// Zodiac sign — 12 signs, KP uses standard rulerships
// ---------------------------------------------------------------------------

enum class ZodiacSign(val displayName: String, val symbol: String, val owner: Planet) {
    Aries("白羊座", "羊", Planet.Mars),
    Taurus("金牛座", "牛", Planet.Venus),
    Gemini("双子座", "子", Planet.Mercury),
    Cancer("巨蟹座", "蟹", Planet.Moon),
    Leo("狮子座", "狮", Planet.Sun),
    Virgo("处女座", "女", Planet.Mercury),
    Libra("天秤座", "秤", Planet.Venus),
    Scorpio("天蝎座", "蝎", Planet.Mars),
    Sagittarius("射手座", "射", Planet.Jupiter),
    Capricorn("摩羯座", "羯", Planet.Saturn),
    Aquarius("水瓶座", "瓶", Planet.Saturn),
    Pisces("双鱼座", "鱼", Planet.Jupiter);

    companion object {
        val ALL = entries.toList()
        fun fromLongitudeDeg(deg: Double): ZodiacSign {
            val lon = ((deg % 360.0) + 360.0) % 360.0
            return ALL[floor(lon / 30.0).toInt() % 12]
        }

        fun fromIndex(idx: Int): ZodiacSign = ALL[((idx % 12) + 12) % 12]
    }
}

// KP co-rulership convention (Rahu co-rules Aquarius, Ketu co-rules Scorpio)
fun kpOwnedSigns(p: Planet): List<Int> = when (p) {
    Planet.Sun -> listOf(4)         // Leo
    Planet.Moon -> listOf(3)        // Cancer
    Planet.Mars -> listOf(0, 7)     // Aries, Scorpio
    Planet.Mercury -> listOf(2, 5)  // Gemini, Virgo
    Planet.Jupiter -> listOf(8, 11) // Sagittarius, Pisces
    Planet.Venus -> listOf(1, 6)    // Taurus, Libra
    Planet.Saturn -> listOf(9, 10)  // Capricorn, Aquarius
    Planet.Rahu -> listOf(10)       // Aquarius (KP co-rule)
    Planet.Ketu -> listOf(7)        // Scorpio (KP co-rule)
    else -> emptyList()
}

// Vedic full-strength aspects (1-indexed house advances)
fun kpAspectOffsets(p: Planet): List<Int> = when (p) {
    Planet.Mars -> listOf(3, 6, 7)     // 4th, 7th, 8th
    Planet.Jupiter -> listOf(4, 6, 8)  // 5th, 7th, 9th
    Planet.Saturn -> listOf(2, 6, 9)   // 3rd, 7th, 10th
    Planet.Rahu, Planet.Ketu -> listOf(4, 6, 8)  // like Jupiter (debated)
    else -> listOf(6)                   // Sun, Moon, Mercury, Venus: 7th only
}

// ---------------------------------------------------------------------------
// KP sub-spans — Vimshottari proportions inside each nakshatra
// ---------------------------------------------------------------------------

private val NAKSHATRA_SPAN: Double = 360.0 / 27.0

// Each sub-span = (lord.years / 120) * nakshatra_span
private val SUB_SPANS: List<Pair<DashaLord, Double>> = DashaLord.SEQUENCE.map { lord ->
    lord to (lord.vimshottariYears / 120.0) * NAKSHATRA_SPAN
}

// ---------------------------------------------------------------------------
// KpPosition — full KP breakdown for a sidereal degree
// ---------------------------------------------------------------------------

data class KpPosition(
    val signLord: String,
    val starLord: DashaLord,
    val subLord: DashaLord,
    val subSubLord: DashaLord,
    val kpNumber: Int,  // 1-249
    val sign: ZodiacSign,
    val nakshatra: Nakshatra,
    val signDeg: Double,
    val nakshatraDeg: Double,
    val subDeg: Double
)

/**
 * Find which sub-lord contains pos_in_parent, starting from starting_lord.
 * Returns Triple(sub_lord, pos_in_sub, sub_span).
 */
private fun findSub(
    posInParent: Double,
    startingLord: DashaLord,
    parentSpan: Double
): Triple<DashaLord, Double, Double> {
    val startIdx = DashaLord.SEQUENCE.indexOf(startingLord)
    val normalized = ((posInParent % parentSpan) + parentSpan) % parentSpan

    var accumulated = 0.0
    for (i in 0 until 9) {
        val idx = (startIdx + i) % 9
        val lord = DashaLord.SEQUENCE[idx]
        val span = (lord.vimshottariYears / 120.0) * parentSpan
        if (accumulated + span > normalized) {
            return Triple(lord, normalized - accumulated, span)
        }
        accumulated += span
    }
    val lord = DashaLord.SEQUENCE[startIdx]
    val span = (lord.vimshottariYears / 120.0) * parentSpan
    return Triple(lord, 0.0, span)
}

/**
 * Build the canonical 249 KP sub-division starting degrees.
 * 27 nakshatras × 9 subs = 243 base segments.
 * Krishnamurti splits any segment that crosses a 30° sign boundary into two,
 * yielding 6 extra segments → 249-division table.
 *
 * Direct port of kp_segment_starts() in xalen.
 */
private val kpSegmentStarts: List<Double> by lazy {
    val raw = mutableListOf<Pair<Double, Double>>()
    var degree = 0.0
    for (nakIdx in 0 until 27) {
        val starLord = Nakshatra.ALL[nakIdx].lord
        val startIdx = DashaLord.SEQUENCE.indexOf(starLord)
        for (subI in 0 until 9) {
            val dlIdx = (startIdx + subI) % 9
            val span = SUB_SPANS[dlIdx].second
            val start = degree
            val end = degree + span
            raw.add(start to end)
            degree = end
        }
    }

    val eps = 1e-6
    val snap = { x: Double ->
        val nearestBoundary = round(x / 30.0) * 30.0
        if (abs(x - nearestBoundary) < eps) nearestBoundary else x
    }

    val starts = mutableListOf<Double>()
    for ((s, e) in raw) {
        val ss = snap(s)
        starts.add(ss)
        var b = (floor(ss / 30.0).toLong() + 1) * 30
        while (b.toDouble() < e - eps) {
            if (b.toDouble() > s + eps) {
                starts.add(b.toDouble())
            }
            b += 30
        }
    }
    starts
}

private fun computeKpNumber(lon: Double): Int {
    val l = ((lon % 360.0) + 360.0) % 360.0
    val starts = kpSegmentStarts
    // count of segment-starts at or before lon (1-based)
    var n = 0
    for (s in starts) {
        if (s <= l) n++
        else break
    }
    return n.coerceIn(1, 249)
}

/**
 * KP position breakdown — port of xalen's kp_position().
 */
fun kpPosition(siderealDeg: Double): KpPosition {
    val lon = ((siderealDeg % 360.0) + 360.0) % 360.0
    val sign = ZodiacSign.fromLongitudeDeg(lon)
    val nak = Nakshatra.fromLongitudeDeg(lon)
    val starLord = nak.lord

    val posInNak = lon % NAKSHATRA_SPAN
    val (subLord, posInSub, subSpan) = findSub(posInNak, starLord, NAKSHATRA_SPAN)
    val (subSubLord, _, _) = findSub(posInSub, subLord, subSpan)

    val kpNumber = computeKpNumber(lon)

    return KpPosition(
        signLord = sign.owner.displayName,
        starLord = starLord,
        subLord = subLord,
        subSubLord = subSubLord,
        kpNumber = kpNumber,
        sign = sign,
        nakshatra = nak,
        signDeg = lon % 30.0,
        nakshatraDeg = posInNak,
        subDeg = posInSub
    )
}

/**
 * KP 编号 → 星座序号（1=Aries .. 12=Pisces）。
 * 越界时抛出 IllegalArgumentException，不再静默返回白羊宫。
 */
fun kpNumberToSign(kpNum: Int): Int {
    require(kpNum in 1..249) { "KP number must be 1..249, got $kpNum" }
    val starts = kpSegmentStarts
    return (floor(starts[kpNum - 1] / 30.0).toInt()) + 1
}

/**
 * KP 编号 → 该子区起始恒星黄经（度）。
 */
fun kpNumberToStartDegree(kpNum: Int): Double {
    require(kpNum in 1..249) { "KP number must be 1..249, got $kpNum" }
    return kpSegmentStarts[kpNum - 1]
}

/**
 * KP 编号 → 该子区结束恒星黄经（度）。
 * 第 249 号的结束是 360°（=0°）。
 */
fun kpNumberToEndDegree(kpNum: Int): Double {
    require(kpNum in 1..249) { "KP number must be 1..249, got $kpNum" }
    return if (kpNum == 249) 360.0 else kpSegmentStarts[kpNum]
}

/**
 * KP 编号 → 中间度数（用于 Horary 占卜排盘）。
 */
fun kpNumberToMidDegree(kpNum: Int): Double {
    val s = kpNumberToStartDegree(kpNum)
    val e = kpNumberToEndDegree(kpNum)
    return ((s + e) / 2.0) % 360.0
}

// ---------------------------------------------------------------------------
// KpChart — cusps + planet positions
// ---------------------------------------------------------------------------

data class KpChart(
    val cusps: List<Double>,    // 12 sidereal cusp degrees
    val planets: List<Pair<Planet, Double>>
) {
    /** House (1-12) for a sidereal degree, Placidus-style unequal houses. */
    fun houseOfDegree(deg: Double): Int {
        val d = ((deg % 360.0) + 360.0) % 360.0
        for (i in 0 until 12) {
            val start = ((cusps[i] % 360.0) + 360.0) % 360.0
            val end = ((cusps[(i + 1) % 12] % 360.0) + 360.0) % 360.0
            if (start < end) {
                if (d >= start && d < end) return i + 1
            } else {
                if (d >= start || d < end) return i + 1
            }
        }
        return 1
    }

    fun planetHouse(planet: Planet): Int? =
        planets.firstOrNull { it.first == planet }?.let { (_, deg) -> houseOfDegree(deg) }
}

// ---------------------------------------------------------------------------
// Significator system — KP's heart
// ---------------------------------------------------------------------------

enum class SignificatorType(val rank: Int, val label: String) {
    StarLord(1, "A · 驻守星之宿主"),
    Occupant(2, "B · 驻守星"),
    Owner(3, "D · 宫主"),
    Aspecting(4, "E · 相位星")
}

data class KpSignificator(
    val planet: Planet,
    val signifiedHouses: List<Int>,
    val strengthOrder: List<Pair<Int, SignificatorType>>
)

/**
 * Compute the full significator table for all 9 planets.
 * Direct port of xalen's compute_significators().
 *
 * KP hierarchy:
 *   A (strongest) — planet is star lord of an occupant of house H
 *   B             — planet occupies house H
 *   C             — planet is star lord of the owner of house H
 *   D             — planet owns house H's cusp sign
 *   E (weakest)   — planet aspects house H
 */
fun computeSignificators(chart: KpChart): List<KpSignificator> {
    val result = mutableListOf<KpSignificator>()

    val planetHouses = chart.planets.map { (p, deg) -> p to chart.houseOfDegree(deg) }
    val planetStarLords = chart.planets.map { (p, deg) ->
        p to Nakshatra.fromLongitudeDeg(deg).lord
    }
    val cuspOwners = (0 until 12).map { i ->
        floor(((chart.cusps[i] % 360.0 + 360.0) % 360.0) / 30.0).toInt()
    }
    val houseOwnerPlanets = (0 until 12).map { i ->
        val signIdx = cuspOwners[i]
        Planet.VEDIC_NINE.firstOrNull { p -> kpOwnedSigns(p).contains(signIdx) }
    }

    for (planet in Planet.VEDIC_NINE) {
        val strengthOrder = mutableListOf<Pair<Int, SignificatorType>>()

        // Grade A: star lord of any occupant planet
        for ((otherPlanet, starLord) in planetStarLords) {
            if (planetToDashaLord(planet) == starLord) {
                val house = planetHouses.firstOrNull { it.first == otherPlanet }?.second
                if (house != null) {
                    strengthOrder.add(house to SignificatorType.StarLord)
                }
            }
        }

        // Grade B: planet occupies this house
        val occHouse = planetHouses.firstOrNull { it.first == planet }?.second
        if (occHouse != null) {
            strengthOrder.add(occHouse to SignificatorType.Occupant)
        }

        // Grade C: planet is star lord of an owner
        for ((houseIdx, ownerOpt) in houseOwnerPlanets.withIndex()) {
            val ownerPlanet = ownerOpt ?: continue
            val ownerStar = planetStarLords.firstOrNull { it.first == ownerPlanet }?.second ?: continue
            if (planetToDashaLord(planet) == ownerStar) {
                val h = houseIdx + 1
                if (strengthOrder.none { it.first == h }) {
                    strengthOrder.add(h to SignificatorType.StarLord)
                }
            }
        }

        // Grade D: planet owns the cusp sign
        val owned = kpOwnedSigns(planet)
        for ((houseIdx, signIdx) in cuspOwners.withIndex()) {
            if (owned.contains(signIdx)) {
                strengthOrder.add(houseIdx + 1 to SignificatorType.Owner)
            }
        }

        // Grade E: planet aspects this house
        if (occHouse != null) {
            for (offset in kpAspectOffsets(planet)) {
                val aspected = ((occHouse - 1 + offset) % 12) + 1
                strengthOrder.add(aspected to SignificatorType.Aspecting)
            }
        }

        val signifiedHouses = mutableListOf<Int>()
        for ((h, _) in strengthOrder) {
            if (h !in signifiedHouses) signifiedHouses.add(h)
        }

        result.add(KpSignificator(planet, signifiedHouses, strengthOrder))
    }

    return result
}

// ---------------------------------------------------------------------------
// Cuspal Sub-Lord Theory
// ---------------------------------------------------------------------------

enum class HousePromise(val label: String, val cssClass: String) {
    Positive("吉", "promise-positive"),
    Negative("凶", "promise-negative"),
    Mixed("混合", "promise-mixed")
}

data class CuspalSubLord(
    val house: Int,
    val cuspDeg: Double,
    val signLord: String,
    val starLord: DashaLord,
    val subLord: DashaLord,
    val promise: HousePromise,
    val sign: ZodiacSign
)

fun favorableHousesForCusp(house: Int): List<Int> = when (house) {
    1 -> listOf(1, 5, 9, 11)
    2 -> listOf(2, 6, 10, 11)
    3 -> listOf(3, 6, 10, 11)
    4 -> listOf(4, 2, 11)
    5 -> listOf(2, 5, 11)
    6 -> listOf(1, 2, 6, 10, 11)
    7 -> listOf(2, 7, 11)
    8 -> listOf(1, 5, 8, 11)
    9 -> listOf(2, 9, 11)
    10 -> listOf(2, 6, 10, 11)
    11 -> listOf(2, 3, 6, 11)
    12 -> listOf(3, 9, 12)
    else -> emptyList()
}

fun unfavorableHousesForCusp(house: Int): List<Int> = when (house) {
    1 -> listOf(6, 8, 12)
    2 -> listOf(5, 8, 12)
    3 -> listOf(8, 12)
    4 -> listOf(3, 5, 12)
    5 -> listOf(4, 8, 12)
    6 -> listOf(5, 11, 12)
    7 -> listOf(1, 6, 10, 12)
    8 -> listOf(6, 12)
    9 -> listOf(3, 8, 12)
    10 -> listOf(5, 8, 12)
    11 -> listOf(5, 8, 12)
    12 -> listOf(1, 2, 6, 10)
    else -> emptyList()
}

fun cuspalAnalysis(
    cuspDegrees: List<Double>,
    planetPositions: List<Pair<Planet, Double>>
): List<CuspalSubLord> {
    val chart = KpChart(cuspDegrees, planetPositions)
    val significators = computeSignificators(chart)
    val results = mutableListOf<CuspalSubLord>()

    for (i in cuspDegrees.indices) {
        val house = i + 1
        val cuspDeg = cuspDegrees[i]
        val kp = kpPosition(cuspDeg)
        val subLordPlanet = planetFromDashaLord(kp.subLord)
        val subLordSigs = significators.firstOrNull { it.planet == subLordPlanet }

        val promise = if (subLordSigs != null) {
            val favorable = favorableHousesForCusp(house)
            val unfavorable = unfavorableHousesForCusp(house)
            val favCount = subLordSigs.signifiedHouses.count { it in favorable }
            val unfavCount = subLordSigs.signifiedHouses.count { it in unfavorable }
            when {
                favCount > 0 && unfavCount == 0 -> HousePromise.Positive
                unfavCount > 0 && favCount == 0 -> HousePromise.Negative
                else -> HousePromise.Mixed
            }
        } else {
            HousePromise.Mixed
        }

        results.add(CuspalSubLord(
            house = house,
            cuspDeg = cuspDeg,
            signLord = kp.signLord,
            starLord = kp.starLord,
            subLord = kp.subLord,
            promise = promise,
            sign = kp.sign
        ))
    }

    return results
}

// ---------------------------------------------------------------------------
// Ruling Planets (RP)
// ---------------------------------------------------------------------------

fun rulingPlanets(
    dayLord: DashaLord,
    moonSignLord: DashaLord,
    moonStarLord: DashaLord,
    lagnaSignLord: DashaLord,
    lagnaStarLord: DashaLord
): List<DashaLord> {
    val all = listOf(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord)
    val unique = mutableListOf<DashaLord>()
    for (lord in all) {
        if (lord !in unique) unique.add(lord)
    }
    return unique
}

fun rulingPlanetsWithStrength(
    dayLord: DashaLord,
    moonSignLord: DashaLord,
    moonStarLord: DashaLord,
    lagnaSignLord: DashaLord,
    lagnaStarLord: DashaLord
): List<Pair<DashaLord, Int>> {
    val all = listOf(dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord)
    val counts = mutableListOf<Pair<DashaLord, Int>>()
    for (lord in all) {
        val existing = counts.firstOrNull { it.first == lord }
        if (existing != null) {
            counts[counts.indexOf(existing)] = existing.first to existing.second + 1
        } else {
            counts.add(lord to 1)
        }
    }
    return counts.sortedByDescending { it.second }
}

fun rulingPlanetsWithAgents(
    dayLord: DashaLord,
    moonSignLord: DashaLord,
    moonStarLord: DashaLord,
    lagnaSignLord: DashaLord,
    lagnaStarLord: DashaLord,
    rahuSignLord: DashaLord? = null,
    ketuSignLord: DashaLord? = null
): List<Pair<DashaLord, Int>> {
    val result = rulingPlanetsWithStrength(
        dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord
    ).toMutableList()

    if (rahuSignLord != null && result.any { it.first == DashaLord.Rahu }) {
        val existing = result.firstOrNull { it.first == rahuSignLord }
        if (existing != null) {
            result[result.indexOf(existing)] = rahuSignLord to existing.second + 1
        } else {
            result.add(rahuSignLord to 1)
        }
    }

    if (ketuSignLord != null && result.any { it.first == DashaLord.Ketu }) {
        val existing = result.firstOrNull { it.first == ketuSignLord }
        if (existing != null) {
            result[result.indexOf(existing)] = ketuSignLord to existing.second + 1
        } else {
            result.add(ketuSignLord to 1)
        }
    }

    return result.sortedByDescending { it.second }
}

// ---------------------------------------------------------------------------
// KP Event Promise
// ---------------------------------------------------------------------------

enum class KpEvent(
    val displayName: String,
    val primaryHouse: Int,
    val favorable: List<Int>,
    val negating: List<Int>
) {
    Marriage("婚姻 / 伴侣", 7, listOf(2, 7, 11), listOf(1, 6, 10, 12)),
    Job("工作 / 事业", 10, listOf(2, 6, 10, 11), listOf(5, 8, 12)),
    Health("健康 / 康复", 1, listOf(1, 5, 11), listOf(6, 8, 12)),
    ChildBirth("生育子女", 5, listOf(2, 5, 11), listOf(4, 8, 12)),
    Education("学业", 4, listOf(4, 9, 11), listOf(3, 8, 12)),
    ForeignTravel("出国 / 远行", 12, listOf(3, 9, 12), listOf(1, 4, 10)),
    Wealth("财富 / 收益", 2, listOf(1, 2, 6, 11), listOf(5, 8, 12)),
    Litigation("诉讼 / 纠纷", 6, listOf(1, 2, 6, 11), listOf(5, 8, 12))
}

fun isEventPromised(
    event: KpEvent,
    cuspalSubLord: DashaLord,
    significators: List<KpSignificator>
): Boolean {
    val subPlanet = planetFromDashaLord(cuspalSubLord)
    val sigs = significators.firstOrNull { it.planet == subPlanet } ?: return false
    val favCount = sigs.signifiedHouses.count { it in event.favorable }
    val negCount = sigs.signifiedHouses.count { it in event.negating }
    return favCount > negCount
}

fun checkEventInChart(event: KpEvent, chart: KpChart): Boolean {
    val sigs = computeSignificators(chart)
    val primary = event.primaryHouse
    val cuspKp = kpPosition(chart.cusps[primary - 1])
    return isEventPromised(event, cuspKp.subLord, sigs)
}

fun significatorsOfHouse(
    house: Int,
    allSignificators: List<KpSignificator>
): List<Pair<Planet, SignificatorType>> {
    val result = mutableListOf<Pair<Planet, SignificatorType>>()
    for (sigType in listOf(
        SignificatorType.StarLord,
        SignificatorType.Occupant,
        SignificatorType.Owner,
        SignificatorType.Aspecting
    )) {
        for (sig in allSignificators) {
            for ((h, st) in sig.strengthOrder) {
                if (h == house && st == sigType && result.none { it.first == sig.planet }) {
                    result.add(sig.planet to sigType)
                }
            }
        }
    }
    return result
}

// ===========================================================================
// 扩展功能 —— Dasha / Nakshatra 详情 / 行星庙旺 / Horary / 岁差计算
// ===========================================================================

// ---------------------------------------------------------------------------
// Nakshatra 扩展：pada / deity / gana / 性别
// ---------------------------------------------------------------------------

/** Nakshatra Pada（1-4）。 */
fun nakshatraPada(siderealDeg: Double): Int {
    val posInNak = ((siderealDeg % 360.0 + 360.0) % 360.0) % NAKSHATRA_SPAN
    return (floor(posInNak / (NAKSHATRA_SPAN / 4.0)).toInt()) + 1
}

/** Nakshatra 主持神祇。 */
fun Nakshatra.deity(): String = when (this) {
    Nakshatra.Ashwini -> "Ashwini Kumaras（双马童）"
    Nakshatra.Bharani -> "Yama（阎摩）"
    Nakshatra.Krittika -> "Agni（火神）"
    Nakshatra.Rohini -> "Brahma（梵天）"
    Nakshatra.Mrigashira -> "Soma（月神）"
    Nakshatra.Ardra -> "Rudra（暴风神）"
    Nakshatra.Punarvasu -> "Aditi（无限之母）"
    Nakshatra.Pushya -> "Brihaspati（祭主）"
    Nakshatra.Ashlesha -> "Sarpa（蛇神）"
    Nakshatra.Magha -> "Pitris（祖灵）"
    Nakshatra.PurvaPhalguni -> "Bhaga（财富神）"
    Nakshatra.UttaraPhalguni -> "Aryaman（首领神）"
    Nakshatra.Hasta -> "Savitar（日神）"
    Nakshatra.Chitra -> "Tvashtar（工匠神）"
    Nakshatra.Swati -> "Vayu（风神）"
    Nakshatra.Vishakha -> "Indra-Agni（雷电与火）"
    Nakshatra.Anuradha -> "Mitra（友爱神）"
    Nakshatra.Jyeshtha -> "Indra（雷帝）"
    Nakshatra.Mula -> "Nirriti（毁灭女神）"
    Nakshatra.PurvaAshadha -> "Apas（水神）"
    Nakshatra.UttaraAshadha -> "Vishvadevas（众神）"
    Nakshatra.Shravana -> "Vishnu（毗湿奴）"
    Nakshatra.Dhanishta -> "Vasu（八光神）"
    Nakshatra.Shatabhisha -> "Varuna（水天）"
    Nakshatra.PurvaBhadrapada -> "Aja Ekapada（一足山羊神）"
    Nakshatra.UttaraBhadrapada -> "Ahir Budhnya（蛇龙神）"
    Nakshatra.Revati -> "Pushan（牧养神）"
}

/** Nakshatra 性情分类（Gana）。 */
enum class Gana(val displayName: String) {
    Deva("天神"),
    Manushya("人类"),
    Rakshasa("罗刹");
}

fun Nakshatra.gana(): Gana = when (this) {
    Nakshatra.Ashwini, Nakshatra.Mrigashira, Nakshatra.Punarvasu, Nakshatra.Pushya,
    Nakshatra.Hasta, Nakshatra.Swati, Nakshatra.Anuradha, Nakshatra.Shravana,
    Nakshatra.Revati -> Gana.Deva
    Nakshatra.Bharani, Nakshatra.Rohini, Nakshatra.Ardra, Nakshatra.PurvaPhalguni,
    Nakshatra.UttaraPhalguni, Nakshatra.PurvaAshadha, Nakshatra.UttaraAshadha,
    Nakshatra.PurvaBhadrapada, Nakshatra.UttaraBhadrapada -> Gana.Manushya
    else -> Gana.Rakshasa
}

// ---------------------------------------------------------------------------
// 行星庙旺（Dignity）
// ---------------------------------------------------------------------------

enum class Dignity(val displayName: String, val strength: Int) {
    Exalted("庙旺", 5),
    Moolatrikona("本源", 4),
    OwnSign("入庙", 3),
    GreatFriend("挚友宫", 2),
    Friend("友宫", 1),
    Neutral("中性", 0),
    Enemy("敌宫", -1),
    GreatEnemy("大敌宫", -2),
    Debilitated("落陷", -3);
}

/**
 * 计算行星在某星座的庙旺状态。
 * @param planet 行星
 * @param signIdx 0-11（0=Aries）
 */
fun planetDignity(planet: Planet, signIdx: Int): Dignity {
    // 各行星庙旺度数（古典占星标准表）
    val exaltedSign = when (planet) {
        Planet.Sun -> 0          // Aries (庙 0°-30°)
        Planet.Moon -> 1         // Taurus
        Planet.Mars -> 9         // Capricorn
        Planet.Mercury -> 5      // Virgo
        Planet.Jupiter -> 3      // Cancer
        Planet.Venus -> 11       // Pisces
        Planet.Saturn -> 6       // Libra
        Planet.Rahu -> 1         // Taurus (KP 争议，部分用 Gemini)
        Planet.Ketu -> 6         // Libra (KP 争议，部分用 Sagittarius)
        else -> -1
    }
    val debilitatedSign = when (planet) {
        Planet.Sun -> 6          // Libra
        Planet.Moon -> 7         // Scorpio
        Planet.Mars -> 2         // Gemini (争议，部分用 Cancer)
        Planet.Mercury -> 11     // Pisces
        Planet.Jupiter -> 9      // Capricorn
        Planet.Venus -> 5        // Virgo
        Planet.Saturn -> 0       // Aries
        Planet.Rahu -> 6         // Libra (争议)
        Planet.Ketu -> 0         // Aries (争议)
        else -> -1
    }
    val ownSigns = when (planet) {
        Planet.Sun -> listOf(4)            // Leo
        Planet.Moon -> listOf(3)           // Cancer
        Planet.Mars -> listOf(0, 7)        // Aries, Scorpio
        Planet.Mercury -> listOf(2, 5)     // Gemini, Virgo
        Planet.Jupiter -> listOf(8, 11)    // Sagittarius, Pisces
        Planet.Venus -> listOf(1, 6)       // Taurus, Libra
        Planet.Saturn -> listOf(9, 10)     // Capricorn, Aquarius
        else -> emptyList()
    }
    // Moolatrikona（本源宫）—— 各行星的最佳度数区间
    val moolatrikonaSigns = when (planet) {
        Planet.Sun -> listOf(0)            // Aries 0-12°
        Planet.Moon -> listOf(2)           // Gemini 3-15°（部分传统用 Taurus 3-15°）
        Planet.Mars -> listOf(0)           // Aries 12-28°
        Planet.Mercury -> listOf(5)        // Virgo 15-20°
        Planet.Jupiter -> listOf(8)        // Sagittarius 5-13°
        Planet.Venus -> listOf(5)          // Virgo 0-15°（争议，部分用 Libra）
        Planet.Saturn -> listOf(10)        // Aquarius 0-20°
        else -> emptyList()
    }
    // 临时友好/敌对关系（简化版）
    val friends = when (planet) {
        Planet.Sun -> listOf(Planet.Moon, Planet.Mars, Planet.Jupiter)
        Planet.Moon -> listOf(Planet.Sun, Planet.Mercury)
        Planet.Mars -> listOf(Planet.Sun, Planet.Moon, Planet.Jupiter)
        Planet.Mercury -> listOf(Planet.Sun, Planet.Venus)
        Planet.Jupiter -> listOf(Planet.Sun, Planet.Moon, Planet.Mars)
        Planet.Venus -> listOf(Planet.Mercury, Planet.Saturn)
        Planet.Saturn -> listOf(Planet.Mercury, Planet.Venus)
        Planet.Rahu -> listOf(Planet.Mercury, Planet.Venus, Planet.Saturn)
        Planet.Ketu -> listOf(Planet.Mars, Planet.Sun, Planet.Jupiter)
        else -> emptyList()
    }
    val enemies: List<Planet> = when (planet) {
        Planet.Sun -> listOf(Planet.Venus, Planet.Saturn)
        Planet.Moon -> emptyList()  // 月亮无天然敌人
        Planet.Mars -> listOf(Planet.Mercury, Planet.Venus)
        Planet.Mercury -> listOf(Planet.Moon)
        Planet.Jupiter -> listOf(Planet.Mercury, Planet.Venus)
        Planet.Venus -> listOf(Planet.Sun, Planet.Moon)
        Planet.Saturn -> listOf(Planet.Sun, Planet.Moon, Planet.Mars)
        Planet.Rahu -> listOf(Planet.Sun, Planet.Moon, Planet.Mars, Planet.Jupiter)
        Planet.Ketu -> listOf(Planet.Venus, Planet.Saturn, Planet.Mercury)
        else -> emptyList()
    }

    val signPlanet = Planet.entries.firstOrNull { p ->
        p != planet && ownSigns(p).contains(signIdx)
    }
    return when {
        exaltedSign == signIdx -> Dignity.Exalted
        moolatrikonaSigns.contains(signIdx) -> Dignity.Moolatrikona
        ownSigns.contains(signIdx) -> Dignity.OwnSign
        debilitatedSign == signIdx -> Dignity.Debilitated
        signPlanet != null && friends.contains(signPlanet) -> Dignity.GreatFriend
        signPlanet != null && enemies.contains(signPlanet) -> Dignity.GreatEnemy
        signPlanet != null -> Dignity.Neutral
        else -> Dignity.Neutral
    }
}

private fun ownSigns(p: Planet): List<Int> = when (p) {
    Planet.Sun -> listOf(4)
    Planet.Moon -> listOf(3)
    Planet.Mars -> listOf(0, 7)
    Planet.Mercury -> listOf(2, 5)
    Planet.Jupiter -> listOf(8, 11)
    Planet.Venus -> listOf(1, 6)
    Planet.Saturn -> listOf(9, 10)
    else -> emptyList()
}

// ---------------------------------------------------------------------------
// Vimshottari Dasha —— 从月亮恒星黄经推算
// ---------------------------------------------------------------------------

enum class DashaLevel(val displayName: String) {
    Mahadasha("大运"),
    Antardasha("小运"),
    Pratyantardasha("过运"),
    Sookshmadasha("微运"),
    Pranadasha("气运");
}

const val YEAR_IN_DAYS: Double = 365.25

data class DashaPeriod(
    val lord: DashaLord,
    val startJd: Double,
    val endJd: Double,
    val level: DashaLevel,
    val subPeriods: List<DashaPeriod>
)

/**
 * 计算从月亮黄经开始的 Vimshottari 大运序列。
 *
 * @param moonSiderealDeg 月亮恒星黄经
 * @param birthJd 出生时刻儒略日
 * @param depth 最大深度（Mahadasha=1, Antardasha=2, Pratyantardasha=3）
 */
fun vimshottariDasha(
    moonSiderealDeg: Double,
    birthJd: Double,
    depth: DashaLevel = DashaLevel.Pratyantardasha
): List<DashaPeriod> {
    val nak = Nakshatra.fromLongitudeDeg(moonSiderealDeg)
    val startingLord = nak.lord

    // 出生时已走过的宿比例 → 余额
    val posInNak = ((moonSiderealDeg % 360.0) + 360.0) % 360.0 % NAKSHATRA_SPAN
    val elapsedFraction = posInNak / NAKSHATRA_SPAN
    val remainingFraction = 1.0 - elapsedFraction

    val startIdx = DashaLord.SEQUENCE.indexOf(startingLord)
    val periods = mutableListOf<DashaPeriod>()
    var currentJd = birthJd

    for (cycle in 0 until 9) {
        val lordIdx = (startIdx + cycle) % 9
        val lord = DashaLord.SEQUENCE[lordIdx]
        val fullYears = lord.vimshottariYears
        val years = if (cycle == 0) fullYears * remainingFraction else fullYears
        val endJd = currentJd + years * YEAR_IN_DAYS

        val subPeriods = if (depth.ordinal > DashaLevel.Mahadasha.ordinal) {
            computeSubPeriods(lord, currentJd, endJd, DashaLevel.Antardasha, depth)
        } else emptyList()

        periods.add(DashaPeriod(lord, currentJd, endJd, DashaLevel.Mahadasha, subPeriods))
        currentJd = endJd
    }
    return periods
}

private fun computeSubPeriods(
    parentLord: DashaLord,
    startJd: Double,
    endJd: Double,
    currentLevel: DashaLevel,
    targetDepth: DashaLevel
): List<DashaPeriod> {
    val totalDuration = endJd - startJd
    val startIdx = DashaLord.SEQUENCE.indexOf(parentLord)
    val subPeriods = mutableListOf<DashaPeriod>()
    var currentJd = startJd

    for (cycle in 0 until 9) {
        val lordIdx = (startIdx + cycle) % 9
        val lord = DashaLord.SEQUENCE[lordIdx]
        val fraction = lord.vimshottariYears / 120.0
        val duration = totalDuration * fraction
        val end = currentJd + duration

        val children = if (targetDepth.ordinal > currentLevel.ordinal) {
            computeSubPeriods(lord, currentJd, end, nextLevel(currentLevel), targetDepth)
        } else emptyList()

        subPeriods.add(DashaPeriod(lord, currentJd, end, currentLevel, children))
        currentJd = end
    }
    return subPeriods
}

private fun nextLevel(current: DashaLevel): DashaLevel = when (current) {
    DashaLevel.Mahadasha -> DashaLevel.Antardasha
    DashaLevel.Antardasha -> DashaLevel.Pratyantardasha
    DashaLevel.Pratyantardasha -> DashaLevel.Sookshmadasha
    DashaLevel.Sookshmadasha -> DashaLevel.Pranadasha
    DashaLevel.Pranadasha -> DashaLevel.Pranadasha
}

/** 在 Dasha 序列中查找指定 JD 所在的运。 */
fun findCurrentDasha(periods: List<DashaPeriod>, jd: Double): DashaPeriod? {
    return periods.firstOrNull { jd >= it.startJd && jd < it.endJd }
}

/** JD → 公历日期字符串（YYYY-MM-DD）。 */
fun jdToDate(jd: Double): Triple<Int, Int, Int> {
    val jd0 = jd + 0.5
    val z = floor(jd0).toLong()
    val f = jd0 - z
    val a = if (z < 2299161) z else {
        val alpha = floor((z - 1867216.25) / 36524.25).toLong()
        z + 1 + alpha - alpha / 4
    }
    val b = a + 1524
    val c = floor((b - 122.1) / 365.25).toLong()
    val d = floor(365.25 * c).toLong()
    val e = floor((b - d) / 30.6001).toLong()
    val day = b - d - floor(30.6001 * e).toLong()
    val month = if (e < 14) e - 1 else e - 13
    val year = if (month > 2) c - 4716 else c - 4715
    val dayInt = day.toInt() + if (f * 24.0 >= 12.0) 0 else 0  // 简化：不四舍五入
    return Triple(year.toInt(), month.toInt(), day.toInt())
}

/** JD → YYYY-MM-DD 字符串。 */
fun jdToDateStr(jd: Double): String {
    val (y, m, d) = jdToDate(jd)
    return "${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}"
}

// ---------------------------------------------------------------------------
// KP Horary —— 1-249 数字问卜
// ---------------------------------------------------------------------------

/**
 * KP Horary 排盘：用 1-249 数字直接生成星盘。
 *
 * KP 经典方法：占卜者心里想一个 1-249 的数字，该数字对应一个固定的恒星黄经。
 * 用此黄经作为"虚拟月亮"位置，搭配当时的实际上升点与行星位置生成问卜盘。
 *
 * @param kpNum 1-249
 * @param jd 占卜时刻儒略日
 * @param latDeg 占卜地纬度
 * @param lonDeg 占卜地经度
 * @param ayanamsaDeg 岁差
 * @return (cusps, planets) 行星里包括"虚拟月亮"（覆盖真实月亮）
 */
fun kpHoraryChart(
    kpNum: Int,
    jd: Double,
    latDeg: Double,
    lonDeg: Double,
    ayanamsaDeg: Double,
    houseSystem: HouseSystem = HouseSystem.Placidus
): Pair<List<Double>, List<Pair<Planet, Double>>> {
    require(kpNum in 1..249) { "KP Horary number must be 1..249" }

    val moonDeg = kpNumberToMidDegree(kpNum)  // 虚拟月亮黄经（已恒星）

    // 计算上升/中天/宫首
    val lst = localSiderealTime(jd, lonDeg)
    val ascTropical = computeAscendant(jd, latDeg, lst)
    val ascSidereal = ((ascTropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0
    val mcTropical = computeMC(jd, lst)
    val mcSidereal = ((mcTropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0

    val cusps = computeCusps(ascSidereal, mcSidereal, houseSystem)

    // 行星位置 —— 真实行星位置（用解析星历），但月亮用虚拟数字
    val planets = Planet.VEDIC_NINE.map { p ->
        val sidereal = if (p == Planet.Moon) {
            moonDeg
        } else {
            val tropical = analyticalPlanetLongitude(p, jd)
            ((tropical - ayanamsaDeg) % 360.0 + 360.0) % 360.0
        }
        p to sidereal
    }
    return Pair(cusps, planets)
}

// ---------------------------------------------------------------------------
// 岁差动态计算（不再用固定 2026 值）
// ---------------------------------------------------------------------------

enum class AyanamsaType(val displayName: String) {
    KP("KP（Krishnamurti 克里希那穆提）"),
    Lahiri("Lahiri / Chitrapaksha（拉希里 恒星黄道）"),
    Raman("Raman（拉曼）"),
    FaganBradley("Fagan-Bradley（费根-布拉德利）"),
    TrueChitra("True Chitra（真实摄提）"),
    Custom("自定义")
}

/**
 * 计算指定岁差类型在给定 JD 下的度数。
 *
 * 各岁差的参考基准：
 * - Lahiri: 285° 黄经（春分点 50.29" / 年退行）
 * - KP: 与 Lahiri 接近但略有偏移（约 -0.012°）
 * - Raman: 21.9° @ 1900.0
 * - Fagan-Bradley: 24.5° @ 1900.0（与 Lahiri 相差约 1°）
 *
 * @param type 岁差类型
 * @param jd 儒略日
 * @param customValue 自定义值（仅 Custom 使用）
 */
fun computeAyanamsa(type: AyanamsaType, jd: Double, customValue: Double = 0.0): Double {
    if (type == AyanamsaType.Custom) return customValue

    val tt = (jd - 2451545.0) / 36525.0
    // 春分点退行（岁差）= 50.2875" / 年 = 0.01396875° / 年
    val precessionRate = 50.2875 / 3600.0  // 度/年
    val yearsSince2000 = tt * 100.0

    return when (type) {
        AyanamsaType.Lahiri -> {
            // Lahiri 在 J2000.0 = 23.85°（2000.0）
            23.85 + precessionRate * yearsSince2000
        }
        AyanamsaType.KP -> {
            // KP 在 J2000.0 ≈ 23.84°（略小于 Lahiri ~0.012°）
            23.84 + precessionRate * yearsSince2000
        }
        AyanamsaType.Raman -> {
            // Raman 在 1900.0 = 21.9°，向后退行
            val yearsSince1900 = (jd - 2415020.5) / 365.25
            21.9 + precessionRate * yearsSince1900
        }
        AyanamsaType.FaganBradley -> {
            // Fagan-Bradley 在 1900.0 = 24.5°
            val yearsSince1900 = (jd - 2415020.5) / 365.25
            24.5 + precessionRate * yearsSince1900
        }
        AyanamsaType.TrueChitra -> {
            // True Chitra 与 Lahiri 接近，在 2000.0 ≈ 23.85°
            23.85 + precessionRate * yearsSince2000
        }
        AyanamsaType.Custom -> customValue
    }
}
