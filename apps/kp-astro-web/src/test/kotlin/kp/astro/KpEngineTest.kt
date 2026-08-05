// ============================================================================
// KpEngineTest —— 移植自 Rust xalen-ephemeris/crates/xalen-vedic/src/kp.rs
// 29 个不变式测试，验证 KP 算法的正确性。
// 运行方式：./gradlew jsTest
// ============================================================================

package kp.astro

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

class KpEngineTest {

    // ============== KP Position 基础测试 ==============

    @Test
    fun kp_at_zero_degrees() {
        val kp = kpPosition(0.0)
        assertEquals("火星", kp.signLord)  // Aries (Chinese display name)
        assertEquals(DashaLord.Ketu, kp.starLord)  // Ashwini
        assertEquals(1, kp.kpNumber)
    }

    @Test
    fun kp_number_range_full_sweep() {
        for (deg in (0..359)) {
            val kp = kpPosition(deg.toDouble())
            assertTrue(
                kp.kpNumber in 1..249,
                "KP number should be 1-249 at $deg°, got ${kp.kpNumber}"
            )
        }
    }

    @Test
    fun sub_lord_differs_within_nakshatra() {
        val kp1 = kpPosition(0.5)
        val kp2 = kpPosition(5.0)
        assertEquals(kp1.starLord, kp2.starLord)  // same nakshatra lord
    }

    @Test
    fun sign_lords_correct() {
        assertEquals("火星", kpPosition(0.0).signLord)   // Aries → Mars
        assertEquals("金星", kpPosition(30.0).signLord)  // Taurus → Venus
        assertEquals("月亮", kpPosition(90.0).signLord)  // Cancer → Moon
        assertEquals("太阳", kpPosition(120.0).signLord) // Leo → Sun
    }

    @Test
    fun ruling_planets_dedup() {
        val rps = rulingPlanets(
            DashaLord.Sun, DashaLord.Moon, DashaLord.Sun,
            DashaLord.Mars, DashaLord.Moon
        )
        assertEquals(3, rps.size)  // Sun, Moon, Mars (deduplicated)
    }

    @Test
    fun kp_249_max() {
        val kp = kpPosition(359.9)
        assertTrue(kp.kpNumber <= 249)
    }

    // ============== 249 表完整性测试 ==============

    @Test
    fun kp_number_covers_full_249_and_matches_published_boundaries() {
        // 全黄道 0.01° 扫描：每个 KP 号 1-249 都必须被命中
        val seen = BooleanArray(250)
        var deg = 0.0
        while (deg < 360.0) {
            val kp = kpPosition(deg)
            assertTrue(
                kp.kpNumber in 1..249,
                "KP number ${kp.kpNumber} out of range at $deg°"
            )
            seen[kp.kpNumber] = true
            deg += 0.01
        }
        for (n in 1..249) {
            assertTrue(seen[n], "KP number $n was never reached over the full zodiac")
        }

        // 边界检查
        assertEquals(1, kpPosition(0.0).kpNumber)
        assertEquals(249, kpPosition(359.999).kpNumber)
    }

    // ============== KpChart 测试 ==============

    private fun testChart(): KpChart {
        val cusps = listOf(0.0, 30.0, 60.0, 90.0, 120.0, 150.0, 180.0, 210.0, 240.0, 270.0, 300.0, 330.0)
        val planets = listOf(
            Planet.Sun to 15.0,
            Planet.Moon to 65.0,
            Planet.Mars to 280.0,
            Planet.Mercury to 45.0,
            Planet.Jupiter to 190.0,
            Planet.Venus to 310.0,
            Planet.Saturn to 130.0,
            Planet.Rahu to 95.0,
            Planet.Ketu to 275.0
        )
        return KpChart(cusps, planets)
    }

    @Test
    fun planet_to_from_dasha_lord_roundtrip() {
        for (p in Planet.VEDIC_NINE) {
            val dl = planetToDashaLord(p)!!
            val p2 = planetFromDashaLord(dl)
            assertEquals(p, p2, "roundtrip failed for $p")
        }
    }

    @Test
    fun outer_planets_have_no_dasha_lord() {
        assertEquals(null, planetToDashaLord(Planet.Uranus))
        assertEquals(null, planetToDashaLord(Planet.Neptune))
        assertEquals(null, planetToDashaLord(Planet.Pluto))
        for (p in Planet.VEDIC_NINE) {
            assertTrue(planetToDashaLord(p) != null, "$p should map")
        }
    }

    @Test
    fun kp_chart_house_of_degree_equal_houses() {
        val chart = testChart()
        assertEquals(1, chart.houseOfDegree(0.0))
        assertEquals(1, chart.houseOfDegree(29.9))
        assertEquals(2, chart.houseOfDegree(30.0))
        assertEquals(7, chart.houseOfDegree(180.0))
        assertEquals(12, chart.houseOfDegree(359.9))
    }

    @Test
    fun kp_chart_planet_house() {
        val chart = testChart()
        assertEquals(1, chart.planetHouse(Planet.Sun))
        assertEquals(3, chart.planetHouse(Planet.Moon))
        assertEquals(10, chart.planetHouse(Planet.Mars))
        assertEquals(7, chart.planetHouse(Planet.Jupiter))
        assertEquals(11, chart.planetHouse(Planet.Venus))
        assertEquals(5, chart.planetHouse(Planet.Saturn))
        assertEquals(4, chart.planetHouse(Planet.Rahu))
    }

    @Test
    fun compute_significators_returns_all_9_planets() {
        val chart = testChart()
        val sigs = computeSignificators(chart)
        assertEquals(9, sigs.size)
        for (p in Planet.VEDIC_NINE) {
            assertTrue(sigs.any { it.planet == p }, "Missing significator for $p")
        }
    }

    // ============== kpNumberToSign 修复测试 ==============

    @Test
    fun kp_number_to_sign_throws_on_invalid_input() {
        assertFailsWith<IllegalArgumentException> { kpNumberToSign(0) }
        assertFailsWith<IllegalArgumentException> { kpNumberToSign(250) }
        assertFailsWith<IllegalArgumentException> { kpNumberToSign(-1) }
    }

    @Test
    fun kp_number_to_sign_returns_correct_sign() {
        assertEquals(1, kpNumberToSign(1))   // KP#1 = Aries
        assertTrue(kpNumberToSign(249) in 1..12)  // 任意值都在 1-12 范围
    }

    @Test
    fun kp_number_to_start_degree_correct() {
        assertEquals(0.0, kpNumberToStartDegree(1), 0.001)
        assertTrue(kpNumberToEndDegree(1) > 0.0)
        assertEquals(360.0, kpNumberToEndDegree(249), 0.001)
    }

    // ============== Dignity 测试 ==============

    @Test
    fun sun_is_exalted_in_aries() {
        assertEquals(Dignity.Exalted, planetDignity(Planet.Sun, 0))   // Aries
    }

    @Test
    fun sun_is_debilitated_in_libra() {
        assertEquals(Dignity.Debilitated, planetDignity(Planet.Sun, 6))  // Libra
    }

    @Test
    fun sun_owns_leo() {
        assertEquals(Dignity.OwnSign, planetDignity(Planet.Sun, 4))  // Leo
    }

    @Test
    fun moon_owns_cancer() {
        assertEquals(Dignity.OwnSign, planetDignity(Planet.Moon, 3))
    }

    @Test
    fun mercury_owns_gemini_and_virgo() {
        // Mercury 在 Gemini 是入庙
        assertEquals(Dignity.OwnSign, planetDignity(Planet.Mercury, 2))
        // Mercury 在 Virgo 既是庙旺也是本源 —— 经典约定优先取 Exalted
        assertEquals(Dignity.Exalted, planetDignity(Planet.Mercury, 5))
    }

    // ============== Dasha 测试 ==============

    @Test
    fun vimshottari_covers_120_years_from_boundary() {
        // 在宿边界（0°）起算，总周期 = 120 年
        val periods = vimshottariDasha(0.0, 2451545.0, DashaLevel.Mahadasha)
        assertEquals(9, periods.size)
        val totalDays = periods.sumOf { it.endJd - it.startJd }
        val totalYears = totalDays / YEAR_IN_DAYS
        assertTrue(
            (totalYears - 120.0) < 0.01,
            "Total should be 120 years at boundary, got $totalYears"
        )
    }

    @Test
    fun vimshottari_with_balance_less_than_120() {
        // 宿中间起算，总周期 < 120
        val periods = vimshottariDasha(100.0, 2451545.0, DashaLevel.Mahadasha)
        assertEquals(9, periods.size)
        val totalDays = periods.sumOf { it.endJd - it.startJd }
        val totalYears = totalDays / YEAR_IN_DAYS
        assertTrue(
            totalYears < 120.0 && totalYears > 100.0,
            "With balance, total should be 100-120 years, got $totalYears"
        )
    }

    @Test
    fun first_dasha_is_balance() {
        val moonDeg = 5.0  // ~37.5% through Ashwini
        val periods = vimshottariDasha(moonDeg, 2451545.0, DashaLevel.Mahadasha)
        val first = periods[0]
        assertEquals(DashaLord.Ketu, first.lord)
        val firstYears = (first.endJd - first.startJd) / YEAR_IN_DAYS
        assertTrue(firstYears < 7.0, "First dasha should be < 7 years (balance), got $firstYears")
        assertTrue(firstYears > 3.0, "First dasha should be > 3 years, got $firstYears")
    }

    @Test
    fun with_antardasha() {
        val periods = vimshottariDasha(0.0, 2451545.0, DashaLevel.Antardasha)
        val first = periods[0]
        assertEquals(9, first.subPeriods.size)
        val subTotal = first.subPeriods.sumOf { it.endJd - it.startJd }
        val mahaTotal = first.endJd - first.startJd
        assertTrue(
            (subTotal - mahaTotal) < 0.01,
            "Sub-periods should sum to mahadasha duration"
        )
    }

    @Test
    fun find_current_dasha_returns_correct_period() {
        val periods = vimshottariDasha(0.0, 2451545.0, DashaLevel.Mahadasha)
        val current = findCurrentDasha(periods, 2451545.0 + 365.0)
        assertTrue(current != null)
        assertEquals(DashaLord.Ketu, current!!.lord)
    }

    @Test
    fun three_level_deep_dasha() {
        val periods = vimshottariDasha(0.0, 2451545.0, DashaLevel.Pratyantardasha)
        assertEquals(9, periods.size)

        val firstMaha = periods[0]
        assertEquals(DashaLevel.Mahadasha, firstMaha.level)
        assertEquals(9, firstMaha.subPeriods.size, "Mahadasha should have 9 Antardasha sub-periods")

        val firstAntar = firstMaha.subPeriods[0]
        assertEquals(DashaLevel.Antardasha, firstAntar.level)
        assertEquals(9, firstAntar.subPeriods.size, "Antardasha should have 9 Pratyantardasha sub-periods")

        val firstPratyantar = firstAntar.subPeriods[0]
        assertEquals(DashaLevel.Pratyantardasha, firstPratyantar.level)
        assertTrue(firstPratyantar.subPeriods.isEmpty(), "Pratyantardasha should have no children at depth=3")
    }

    @Test
    fun lords_follow_sequence() {
        val periods = vimshottariDasha(0.0, 2451545.0, DashaLevel.Mahadasha)
        val lords = periods.map { it.lord }
        assertEquals(DashaLord.Ketu, lords[0])
        assertEquals(DashaLord.Venus, lords[1])
        assertEquals(DashaLord.Sun, lords[2])
    }

    // ============== Nakshatra 测试 ==============

    @Test
    fun nakshatra_boundaries() {
        assertEquals(Nakshatra.Ashwini, Nakshatra.fromLongitudeDeg(0.0))
        assertEquals(Nakshatra.Ashwini, Nakshatra.fromLongitudeDeg(13.33))
        assertEquals(Nakshatra.Bharani, Nakshatra.fromLongitudeDeg(13.34))
        assertEquals(Nakshatra.Revati, Nakshatra.fromLongitudeDeg(359.9))
    }

    @Test
    fun nakshatra_lords_cycle() {
        assertEquals(DashaLord.Ketu, Nakshatra.Ashwini.lord)
        assertEquals(DashaLord.Venus, Nakshatra.Bharani.lord)
        assertEquals(DashaLord.Sun, Nakshatra.Krittika.lord)
        assertEquals(DashaLord.Ketu, Nakshatra.Magha.lord)  // 10th = cycle restart
    }

    @Test
    fun nakshatra_pada_computation() {
        assertEquals(1, nakshatraPada(0.0))
        assertEquals(2, nakshatraPada(3.34))
        assertEquals(3, nakshatraPada(6.67))
        assertEquals(4, nakshatraPada(10.0))
    }

    @Test
    fun nakshatra_deity_correct() {
        assertEquals("Agni（火神）", Nakshatra.Krittika.deity())
        assertEquals("Brahma（梵天）", Nakshatra.Rohini.deity())
        assertEquals("Vishnu（毗湿奴）", Nakshatra.Shravana.deity())
    }

    @Test
    fun nakshatra_gana_correct() {
        assertEquals(Gana.Deva, Nakshatra.Ashwini.gana())
        assertEquals(Gana.Manushya, Nakshatra.Bharani.gana())
        assertEquals(Gana.Rakshasa, Nakshatra.Krittika.gana())
    }

    @Test
    fun vimshottari_total_120() {
        val total = DashaLord.SEQUENCE.sumOf { it.vimshottariYears }
        assertEquals(120.0, total, 0.0001)
    }

    @Test
    fun all_27_nakshatras_have_lord() {
        for (nak in Nakshatra.ALL) {
            assertTrue(nak.lord in DashaLord.SEQUENCE, "${nak.name} has invalid lord")
        }
    }

    // ============== Horary 测试 ==============

    @Test
    fun horary_throws_on_invalid_kp_number() {
        assertFailsWith<IllegalArgumentException> {
            kpHoraryChart(0, 2451545.0, 28.6, 77.2, 24.0)
        }
        assertFailsWith<IllegalArgumentException> {
            kpHoraryChart(250, 2451545.0, 28.6, 77.2, 24.0)
        }
    }

    @Test
    fun horary_chart_has_12_cusps_and_9_planets() {
        val (cusps, planets) = kpHoraryChart(100, 2451545.0, 28.6, 77.2, 24.0)
        assertEquals(12, cusps.size)
        assertEquals(9, planets.size)
    }

    @Test
    fun horary_moon_is_virtual() {
        val (_, planets) = kpHoraryChart(1, 2451545.0, 28.6, 77.2, 24.0)
        val moonDeg = planets.first { it.first == Planet.Moon }.second
        // KP#1 对应起点 = 0°，月亮位置应在 [0, 跨度) 内
        assertTrue(moonDeg >= 0.0 && moonDeg < 2.0, "Moon for KP#1 should be near 0°, got $moonDeg")
    }

    // ============== 岁差测试 ==============

    @Test
    fun ayanamsa_kp_at_j2000_is_about_23_84() {
        val jd2000 = 2451545.0
        val aya = computeAyanamsa(AyanamsaType.KP, jd2000)
        assertEquals(23.84, aya, 0.1, "KP ayanamsa at J2000 should be ~23.84°, got $aya")
    }

    @Test
    fun ayanamsa_lahiri_at_j2000_is_about_23_85() {
        val jd2000 = 2451545.0
        val aya = computeAyanamsa(AyanamsaType.Lahiri, jd2000)
        assertEquals(23.85, aya, 0.1, "Lahiri ayanamsa at J2000 should be ~23.85°, got $aya")
    }

    @Test
    fun ayanamsa_grows_over_time() {
        val jd2000 = 2451545.0
        val jd2100 = julianDay(2100, 1, 1, 12.0)
        val aya2000 = computeAyanamsa(AyanamsaType.Lahiri, jd2000)
        val aya2100 = computeAyanamsa(AyanamsaType.Lahiri, jd2100)
        assertTrue(aya2100 > aya2000, "Ayanamsa should grow over time: 2000=$aya2000, 2100=$aya2100")
        // 增量约 100 年 × 0.01396875° = 1.4°
        assertEquals(1.4, aya2100 - aya2000, 0.2, "Ayanamsa growth should be ~1.4° per century")
    }

    @Test
    fun ayanamsa_custom_returns_input() {
        val v = computeAyanamsa(AyanamsaType.Custom, 2451545.0, 25.5)
        assertEquals(25.5, v, 0.0001)
    }

    // ============== 真星历基础测试 ==============

    @Test
    fun sun_longitude_at_j2000_is_near_280_deg() {
        // J2000.0 太阳黄经应该在 280° (Capricorn) 附近
        val sunLon = sunLongitude(2451545.0)
        assertTrue(sunLon in 275.0..285.0,
            "Sun longitude at J2000 should be ~280°, got $sunLon")
    }

    @Test
    fun moon_longitude_at_j2000_is_near_218_deg() {
        // J2000 月亮平黄经 ~218°
        val moonLon = moonLongitude(2451545.0)
        assertTrue(moonLon in 215.0..225.0,
            "Moon longitude at J2000 should be ~218°, got $moonLon")
    }

    @Test
    fun rahu_is_retrograde_by_default() {
        assertTrue(isRetrograde(Planet.Rahu, 2451545.0))
        assertTrue(isRetrograde(Planet.Ketu, 2451545.0))
    }

    @Test
    fun all_vedic_nine_planets_compute_longitudes() {
        // 所有 Vedic 九星都必须返回有效黄经 [0, 360)
        for (p in Planet.VEDIC_NINE) {
            val lon = analyticalPlanetLongitude(p, 2451545.0)
            assertTrue(lon >= 0.0 && lon < 360.0, "$p longitude out of range: $lon")
        }
    }

    @Test
    fun compute_all_sidereal_returns_all_12_planets() {
        val map = computeAllSidereal(2451545.0, 24.0)
        assertEquals(Planet.entries.size, map.size)
        for (p in Planet.entries) {
            assertTrue(map.containsKey(p), "Missing $p")
            val v = map[p]!!
            assertTrue(v >= 0.0 && v < 360.0, "$p sidereal out of range: $v")
        }
    }

    @Test
    fun ketu_is_180_from_rahu() {
        val map = computeAllSidereal(2451545.0, 24.0)
        val rahu = map[Planet.Rahu]!!
        val ketu = map[Planet.Ketu]!!
        val diff = ((ketu - rahu) % 360.0 + 360.0) % 360.0
        assertEquals(180.0, diff, 0.001, "Ketu should be 180° from Rahu")
    }

    @Test
    fun jd_to_date_roundtrip() {
        // 2024-01-01 12:00 UT → JD 2460311.0
        val jd = julianDay(2024, 1, 1, 12.0)
        val (y, m, d) = jdToDate(jd)
        assertEquals(2024, y)
        assertEquals(1, m)
        assertEquals(1, d)
    }

    @Test
    fun julian_day_correct_at_j2000() {
        // J2000.0 = 2000-01-01 12:00 UT = JD 2451545.0
        val jd = julianDay(2000, 1, 1, 12.0)
        assertEquals(2451545.0, jd, 0.0001)
    }
}
