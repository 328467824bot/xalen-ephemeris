// ============================================================================
// KP 占星 Web 版主入口（重写 v2.0）
//
// 主要变更：
//   1. 用真星历（VSOP87 + Meeus）替换 J2000 平均运动
//   2. 加入真 Placidus 宫位制（迭代算法）
//   3. 分 Tab UI：星盘 / Dasha / Horary / 调试
//   4. 调试面板：手动覆盖任意行星/宫首/岁差/宫位制
//   5. JSON 导入导出：保存/恢复任意星盘
//   6. Vimshottari Dasha 时间轴（大运 → 小运 → 过运 三层）
//   7. KP Horary 1-249 数字问卜
// ============================================================================

package kp.astro

import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.html.*
import kotlinx.html.dom.append
import kotlinx.html.js.div
import kotlinx.html.js.onClickFunction
import kotlinx.html.js.tr
import org.w3c.dom.*
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.round
import kotlin.math.sin
import kotlin.math.tan

// ---------------------------------------------------------------------------
// 周日 → DashaLord 映射
// ---------------------------------------------------------------------------

fun dayLordOfWeek(year: Int, month: Int, day: Int): DashaLord {
    val m = if (month < 3) month + 12 else month
    val y = if (month < 3) year - 1 else year
    val h = (day + (13 * (m + 1)) / 5 + y + y / 4 - y / 100 + y / 400) % 7
    return when (h) {
        0 -> DashaLord.Saturn  // Saturday
        1 -> DashaLord.Sun     // Sunday
        2 -> DashaLord.Moon    // Monday
        3 -> DashaLord.Mars    // Tuesday
        4 -> DashaLord.Mercury // Wednesday
        5 -> DashaLord.Jupiter // Thursday
        6 -> DashaLord.Venus   // Friday
        else -> DashaLord.Sun
    }
}

// ---------------------------------------------------------------------------
// 度数格式化
// ---------------------------------------------------------------------------

fun formatDegree(deg: Double): String {
    val d = ((deg % 360.0) + 360.0) % 360.0
    val wholeDeg = floor(d).toInt()
    val minFrac = (d - wholeDeg) * 60.0
    val min = floor(minFrac).toInt()
    val sec = round((minFrac - min) * 60.0).toInt()
    return "${wholeDeg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}\""
}

fun formatSignDeg(deg: Double): String {
    val sign = ZodiacSign.fromLongitudeDeg(deg)
    val inSign = ((deg % 360.0) + 360.0) % 360.0 % 30.0
    val wholeDeg = floor(inSign).toInt()
    val minFrac = (inSign - wholeDeg) * 60.0
    val min = floor(minFrac).toInt()
    val sec = round((minFrac - min) * 60.0).toInt()
    return "${sign.symbol} ${wholeDeg}°${min.toString().padStart(2, '0')}'${sec.toString().padStart(2, '0')}\""
}

fun formatHour(h: Double): String {
    val hh = floor(h).toInt()
    val mm = floor((h - hh) * 60.0).toInt()
    return "${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}"
}

fun formatDouble(value: Double, decimals: Int): String {
    val isNegative = value < 0
    val absValue = if (isNegative) -value else value
    val factor = run { var f = 1; repeat(decimals) { f *= 10 }; f }
    val scaled = (absValue * factor + 0.5).toLong()
    val intPart = (scaled / factor).toString()
    val fracPart = (scaled % factor).toString().padStart(decimals, '0')
    return (if (isNegative && scaled != 0L) "-" else "") + intPart + "." + fracPart
}

// ---------------------------------------------------------------------------
// 宫位制（保留与原版兼容的接口，并加入真 Placidus）
// ---------------------------------------------------------------------------

enum class HouseSystem(val displayName: String, val description: String) {
    Placidus("普拉西德制（Placidus）", "KP 标准，不等宫四分法，迭代求解。"),
    Equal("等宫制（Equal House）", "每宫从上升点起算 30 度。"),
    WholeSign("整宫制（Whole Sign）", "第一宫宫首 = 上升点所在星座 0 度。")
}

fun computeCusps(ascendant: Double, mc: Double?, system: HouseSystem): List<Double> {
    return when (system) {
        HouseSystem.Equal -> (0 until 12).map { (ascendant + it * 30.0) % 360.0 }
        HouseSystem.WholeSign -> {
            val signStart = floor(ascendant / 30.0) * 30.0
            (0 until 12).map { (signStart + it * 30.0) % 360.0 }
        }
        HouseSystem.Placidus -> {
            // 真 Placidus —— 需要原 jd 信息，这里回退到四象限三等分（旧版算法）
            // 真 Placidus 在 computeCuspsFromJd() 中实现
            val mcDeg = mc ?: ((ascendant + 270.0) % 360.0)
            val desc = (ascendant + 180.0) % 360.0
            val ic = (mcDeg + 180.0) % 360.0
            fun arc(start: Double, end: Double, n: Int): List<Double> {
                val s = ((start % 360.0) + 360.0) % 360.0
                val e = ((end % 360.0) + 360.0) % 360.0
                var span = e - s
                if (span < 0) span += 360.0
                return (1 until n).map { (s + span * it / n) % 360.0 }
            }
            val c1 = ascendant
            val c4 = ic
            val c7 = desc
            val c10 = mcDeg
            val c2c3 = arc(c1, c4, 3)
            val c5c6 = arc(c4, c7, 3)
            val c8c9 = arc(c7, c10, 3)
            val c11c12 = arc(c10, c1, 3)
            listOf(c1, c2c3[0], c2c3[1], c4, c5c6[0], c5c6[1],
                   c7, c8c9[0], c8c9[1], c10, c11c12[0], c11c12[1])
        }
    }
}

/**
 * 真 Placidus 宫首 —— 用 jd + 经纬度 + LST 直接调用迭代算法。
 */
fun computeCuspsFromJd(jd: Double, latDeg: Double, ascSidereal: Double, mcSidereal: Double,
                       system: HouseSystem): List<Double> {
    return if (system == HouseSystem.Placidus) {
        placidusCusps(jd, latDeg, ascSidereal, mcSidereal)
    } else {
        computeCusps(ascSidereal, mcSidereal, system)
    }
}

// ===========================================================================
// 数据结构 —— 整个星盘的完整状态
// ===========================================================================

data class ChartInput(
    val year: Int,
    val month: Int,
    val day: Int,
    val hour: Double,
    val lat: Double,
    val lon: Double,
    val ayanamsaType: AyanamsaType,
    val customAyanamsa: Double,
    val houseSystem: HouseSystem,
    val ascendantOverride: Double?,
    val planetOverrides: Map<Planet, Double>,  // 手动覆盖行星位置（恒星黄经）
    val cuspOverrides: List<Double>?            // 手动覆盖全部 12 宫首
) {
    fun ayanamsa(jd: Double): Double =
        computeAyanamsa(ayanamsaType, jd, customAyanamsa)
}

data class ComputedChart(
    val input: ChartInput,
    val jd: Double,
    val ayanamsa: Double,
    val ascSidereal: Double,
    val mcSidereal: Double,
    val cusps: List<Double>,
    val planets: List<Pair<Planet, Double>>,
    val retrogrades: Map<Planet, Boolean>
)

// ===========================================================================
// 主入口
// ===========================================================================

fun main() {
    println("KP Astrology v2.0 starting...")
    val root = document.getElementById("app") ?: error("No #app element")
    root.innerHTML = ""
    renderApp(root)
}

private fun renderApp(root: Element) {
    root.append {
        div("app-container") {
            div("app-header") {
                h1 { +"KP 占星 · v2.0" }
                p("subtitle") {
                    +"Kotlin/JS 移植自 "
                    a {
                        href = "https://github.com/vedika-io/xalen-ephemeris"
                        target = "_blank"
                        +"xalen-ephemeris"
                    }
                    +" · 249 子区 · 真星历 VSOP87 · Dasha 时间轴 · Horary 问卜 · 调试面板"
                }
            }

            // Tab 导航
            div("tab-nav") {
                button(type = ButtonType.button, classes = "tab-btn active") {
                    id = "tab-chart"
                    +"星盘"
                    onClickFunction = { switchTab("chart") }
                }
                button(type = ButtonType.button, classes = "tab-btn") {
                    id = "tab-dasha"
                    +"大运 / Dasha"
                    onClickFunction = { switchTab("dasha") }
                }
                button(type = ButtonType.button, classes = "tab-btn") {
                    id = "tab-horary"
                    +"Horary 问卜"
                    onClickFunction = { switchTab("horary") }
                }
                button(type = ButtonType.button, classes = "tab-btn") {
                    id = "tab-debug"
                    +"调试面板"
                    onClickFunction = { switchTab("debug") }
                }
            }

            div("main-grid") {
                div("left-panel") {
                    id = "left-panel"
                    renderInputPanel()
                }
                div("right-panel") {
                    id = "right-panel"
                    div("tab-content active") {
                        id = "content-chart"
                        div("placeholder") {
                            +"请在左侧输入出生资料，点击「排 KP 星盘」查看结果。"
                        }
                    }
                    div("tab-content") {
                        id = "content-dasha"
                        div("placeholder") { +"排盘后此处显示 Vimshottari Dasha 时间轴。" }
                    }
                    div("tab-content") {
                        id = "content-horary"
                        renderHoraryPanel()
                    }
                    div("tab-content") {
                        id = "content-debug"
                        renderDebugPanel()
                    }
                }
            }
        }
    }
}

// ===========================================================================
// Tab 切换
// ===========================================================================

private fun switchTab(tabId: String) {
    // NodeList.toList() 在 Kotlin/JS 中需要额外导入，直接用 length/item 更稳
    val tabBtns = document.querySelectorAll(".tab-btn")
    for (i in 0 until tabBtns.length) {
        (tabBtns.item(i) as? Element)?.classList?.remove("active")
    }
    document.getElementById("tab-$tabId")?.classList?.add("active")

    val tabContents = document.querySelectorAll(".tab-content")
    for (i in 0 until tabContents.length) {
        (tabContents.item(i) as? Element)?.classList?.remove("active")
    }
    document.getElementById("content-$tabId")?.classList?.add("active")
}

// ===========================================================================
// 输入面板
// ===========================================================================

private fun DIV.renderInputPanel() {
    div("input-card") {
        h2 { +"出生资料" }

        div("field-row") {
            label { +"年" }
            input(type = InputType.number) {
                id = "year"; value = "1990"; min = "1800"; max = "2400"
            }
        }
        div("field-row") {
            label { +"月" }
            input(type = InputType.number) {
                id = "month"; value = "3"; min = "1"; max = "12"
            }
        }
        div("field-row") {
            label { +"日" }
            input(type = InputType.number) {
                id = "day"; value = "15"; min = "1"; max = "31"
            }
        }
        div("field-row") {
            label { +"时（小数制，24h）" }
            input(type = InputType.number) {
                id = "hour"; value = "10.5"; step = "0.01"
            }
            small { +"例如 10.5 = 上午 10:30，22.25 = 下午 10:15（UT 时间）" }
        }
        hr {}
        div("field-row") {
            label { +"纬度（度）" }
            input(type = InputType.number) {
                id = "lat"; value = "28.6139"; step = "0.0001"
            }
            small { +"默认：新德里" }
        }
        div("field-row") {
            label { +"经度（度）" }
            input(type = InputType.number) {
                id = "lon"; value = "77.2090"; step = "0.0001"
            }
            small { +"+ 东经，− 西经" }
        }
        hr {}
        div("field-row") {
            label { +"岁差（Ayanamsa）" }
            select {
                id = "ayanamsa-type"
                AyanamsaType.entries.forEach { type ->
                    option { value = type.name; +type.displayName }
                }
            }
        }
        div("field-row") {
            label { +"自定义岁差（度）" }
            input(type = InputType.number) {
                id = "custom-ayanamsa"; value = "0.0"; step = "0.0001"; disabled = true
            }
        }
        div("field-row") {
            label { +"宫位制" }
            select {
                id = "house-system"
                HouseSystem.entries.forEach { sys ->
                    option { value = sys.name; +sys.displayName }
                }
            }
        }
        div("field-row") {
            label { +"上升点覆盖（度，可选）" }
            input(type = InputType.number) {
                id = "asc-override"; value = ""; step = "0.0001"; placeholder = "auto"
            }
            small { +"留空则自动计算（推荐）。覆盖时所有宫首会基于此重算。" }
        }
        hr {}
        div("button-row") {
            button(type = ButtonType.button, classes = "primary-btn") {
                +"排 KP 星盘"
                onClickFunction = { computeAndRender() }
            }
            button(type = ButtonType.button, classes = "secondary-btn") {
                +"导出 JSON"
                onClickFunction = { exportChartJson() }
            }
            button(type = ButtonType.button, classes = "secondary-btn") {
                +"导入 JSON"
                onClickFunction = { importChartJson() }
            }
        }

        div("city-presets") {
            p("preset-label") { +"城市预设：" }
            mapOf(
                "新德里" to Pair(28.6139, 77.2090),
                "孟买" to Pair(19.0760, 72.8777),
                "金奈" to Pair(13.0827, 80.2707),
                "加尔各答" to Pair(22.5726, 88.3639),
                "纽约" to Pair(40.7128, -74.0060),
                "伦敦" to Pair(51.5074, -0.1278),
                "悉尼" to Pair(-33.8688, 151.2093),
                "东京" to Pair(35.6762, 139.6503),
                "北京" to Pair(39.9042, 116.4074),
                "上海" to Pair(31.2304, 121.4737),
                "台北" to Pair(25.0330, 121.5654),
                "香港" to Pair(22.3193, 114.1694),
                "新加坡" to Pair(1.3521, 103.8198)
            ).forEach { (name, coords) ->
                button(type = ButtonType.button, classes = "preset-btn") {
                    +name
                    onClickFunction = {
                        (document.getElementById("lat") as HTMLInputElement).value = coords.first.toString()
                        (document.getElementById("lon") as HTMLInputElement).value = coords.second.toString()
                    }
                }
            }
        }
    }
}

// ===========================================================================
// Horary 面板
// ===========================================================================

private fun DIV.renderHoraryPanel() {
    div("input-card") {
        h2 { +"KP Horary 数字问卜" }
        p("card-hint") {
            +"心里默想一个问题，然后输入 1-249 之间的数字。该数字对应一个固定的恒星黄经，"
            +"将作为「虚拟月亮」配合当前实际行星位置生成问卜盘。"
        }
        div("field-row") {
            label { +"KP 编号（1-249）" }
            input(type = InputType.number) {
                id = "horary-num"; value = "1"; min = "1"; max = "249"; step = "1"
            }
        }
        div("field-row") {
            label { +"问卜时刻（小数小时，UT）" }
            input(type = InputType.number) {
                id = "horary-hour"; value = "12.0"; step = "0.01"
            }
            small { +"使用左侧的日期 + 此时刻作为占卜时间" }
        }
        div("field-row") {
            label { +"问卜地经纬度" }
            small { +"使用左侧填写的纬度/经度" }
        }
        hr {}
        button(type = ButtonType.button, classes = "primary-btn") {
            +"排出问卜盘"
            onClickFunction = { computeHorary() }
        }
        div("horary-result") {
            id = "horary-result"
        }
    }
}

// ===========================================================================
// 调试面板
// ===========================================================================

private fun DIV.renderDebugPanel() {
    div("input-card") {
        h2 { +"调试面板 · 手动覆盖" }
        p("card-hint") {
            +"可手动覆盖任意行星位置或宫首度数。覆盖后排盘、Dasha、Horary 全部使用新值。"
            +"留空则使用真星历计算结果。"
        }
        div("debug-section") {
            h3 { +"行星位置覆盖（恒星黄经度）" }
            Planet.entries.forEach { p ->
                div("field-row compact") {
                    label { +p.displayName }
                    input(type = InputType.number) {
                        id = "override-planet-${p.name}"
                        step = "0.0001"
                        placeholder = "auto"
                        value = ""
                    }
                    small { +"(${p.symbol})" }
                }
            }
        }
        hr {}
        div("debug-section") {
            h3 { +"宫首覆盖（12 个，恒星黄经度）" }
            p("card-hint") { +"留空则自动计算。覆盖第 1 宫会同步覆盖上升点。" }
            (1..12).forEach { i ->
                div("field-row compact") {
                    label { +"第 $i 宫" }
                    input(type = InputType.number) {
                        id = "override-cusp-$i"
                        step = "0.0001"
                        placeholder = "auto"
                        value = ""
                    }
                }
            }
        }
        hr {}
        div("button-row") {
            button(type = ButtonType.button, classes = "secondary-btn") {
                +"清空所有覆盖"
                onClickFunction = { clearOverrides() }
            }
            button(type = ButtonType.button, classes = "secondary-btn") {
                +"应用覆盖并排盘"
                onClickFunction = { computeAndRender() }
            }
        }
        hr {}
        div("debug-section") {
            h3 { +"调试输出" }
            div("debug-output") {
                id = "debug-output"
                +"排盘后此处显示中间计算值（JD、LST、RAMC、章动、行星速度等）。"
            }
        }
    }
}

// ===========================================================================
// 读取输入
// ===========================================================================

private fun readInput(): ChartInput {
    val year = (document.getElementById("year") as HTMLInputElement).value.toInt()
    val month = (document.getElementById("month") as HTMLInputElement).value.toInt()
    val day = (document.getElementById("day") as HTMLInputElement).value.toInt()
    val hour = (document.getElementById("hour") as HTMLInputElement).value.toDouble()
    val lat = (document.getElementById("lat") as HTMLInputElement).value.toDouble()
    val lon = (document.getElementById("lon") as HTMLInputElement).value.toDouble()

    val ayaSel = (document.getElementById("ayanamsa-type") as HTMLSelectElement).value
    val ayaType = AyanamsaType.valueOf(ayaSel)
    val customAya = (document.getElementById("custom-ayanamsa") as HTMLInputElement).value.toDoubleOrNull() ?: 0.0

    val houseSel = (document.getElementById("house-system") as HTMLSelectElement).value
    val houseSystem = HouseSystem.valueOf(houseSel)

    val ascOverrideStr = (document.getElementById("asc-override") as HTMLInputElement).value
    val ascOverride = ascOverrideStr.toDoubleOrNull()

    // 读取行星覆盖
    val planetOverrides = HashMap<Planet, Double>()
    for (p in Planet.entries) {
        val v = (document.getElementById("override-planet-${p.name}") as? HTMLInputElement)?.value
        val d = v?.toDoubleOrNull()
        if (d != null) planetOverrides[p] = d
    }

    // 读取宫首覆盖
    val cuspOverrides = (1..12).mapNotNull { i ->
        (document.getElementById("override-cusp-$i") as? HTMLInputElement)?.value?.toDoubleOrNull()
    }.let { lst -> if (lst.size == 12) lst else null }

    return ChartInput(year, month, day, hour, lat, lon,
                      ayaType, customAya, houseSystem,
                      ascOverride, planetOverrides, cuspOverrides)
}

// ===========================================================================
// 核心计算
// ===========================================================================

fun computeChart(input: ChartInput): ComputedChart {
    val jd = julianDay(input.year, input.month, input.day, input.hour)
    val ayanamsa = input.ayanamsa(jd)

    // 真星历计算
    val siderealPositions = computeAllSidereal(jd, ayanamsa)

    // 上升 / 中天 / 宫首
    val lst = localSiderealTime(jd, input.lon)
    val ascTropical = input.ascendantOverride?.let { (it + ayanamsa) % 360.0 }
        ?: computeAscendant(jd, input.lat, lst)
    val ascSidereal = ((ascTropical - ayanamsa) % 360.0 + 360.0) % 360.0
    val mcTropical = computeMC(jd, lst)
    val mcSidereal = ((mcTropical - ayanamsa) % 360.0 + 360.0) % 360.0

    val cusps = input.cuspOverrides
        ?: computeCuspsFromJd(jd, input.lat, ascSidereal, mcSidereal, input.houseSystem)

    // 行星位置（含覆盖）
    val planets = Planet.VEDIC_NINE.map { p ->
        val deg = input.planetOverrides[p] ?: siderealPositions[p]!!
        p to deg
    }

    // 逆行判定（外行星也计算）
    val retrogrades = Planet.entries.associateWith { p ->
        if (p == Planet.Rahu || p == Planet.Ketu) true
        else isRetrograde(p, jd)
    }

    return ComputedChart(input, jd, ayanamsa, ascSidereal, mcSidereal, cusps, planets, retrogrades)
}

// ===========================================================================
// 排盘触发 + 渲染所有 Tab
// ===========================================================================

private fun computeAndRender() {
    try {
        val input = readInput()
        val chart = computeChart(input)

        // 渲染主星盘 Tab
        renderChartTab(chart)

        // 渲染 Dasha Tab
        renderDashaTab(chart)

        // 渲染调试输出
        renderDebugOutput(chart)

    } catch (e: Throwable) {
        console.error("KP computation failed", e)
        val right = document.getElementById("content-chart") ?: return
        right.innerHTML = ""
        right.append {
            div("error-card") {
                h3 { +"计算错误" }
                pre { +(e.message ?: e.toString()) }
            }
        }
    }
}

// ===========================================================================
// 主星盘 Tab
// ===========================================================================

private fun renderChartTab(chart: ComputedChart) {
    val container = document.getElementById("content-chart") ?: return
    container.innerHTML = ""
    val input = chart.input
    val sigs = computeSignificators(KpChart(chart.cusps, chart.planets))
    val cuspal = cuspalAnalysis(chart.cusps, chart.planets)

    val moonDeg = chart.planets.first { it.first == Planet.Moon }.second
    val lagnaDeg = chart.ascSidereal
    val dayLord = dayLordOfWeek(input.year, input.month, input.day)
    val moonSig = kpPosition(moonDeg)
    val lagnaSig = kpPosition(lagnaDeg)
    val moonSignLord = ZodiacSign.fromLongitudeDeg(moonDeg).owner
    val lagnaSignLord = ZodiacSign.fromLongitudeDeg(lagnaDeg).owner
    val rahuPos = chart.planets.first { it.first == Planet.Rahu }.second
    val rahuSignLord = ZodiacSign.fromLongitudeDeg(rahuPos).owner
    val ketuPos = chart.planets.first { it.first == Planet.Ketu }.second
    val ketuSignLord = ZodiacSign.fromLongitudeDeg(ketuPos).owner

    val rp = rulingPlanetsWithAgents(
        dayLord = dayLord,
        moonSignLord = planetToDashaLord(moonSignLord)!!,
        moonStarLord = moonSig.starLord,
        lagnaSignLord = planetToDashaLord(lagnaSignLord)!!,
        lagnaStarLord = lagnaSig.starLord,
        rahuSignLord = planetToDashaLord(rahuSignLord),
        ketuSignLord = planetToDashaLord(ketuSignLord)
    )

    val events = KpEvent.entries.map { event ->
        event to checkEventInChart(event, KpChart(chart.cusps, chart.planets))
    }

    container.append {
        div("results-container") {
            // 概要卡
            div("result-card") {
                h2 { +"星盘概要" }
                div("summary-grid") {
                    div("summary-cell") {
                        strong { +"出生时刻" }
                        span { +"${input.year}-${input.month.toString().padStart(2,'0')}-${input.day.toString().padStart(2,'0')} ${formatHour(input.hour)} UT" }
                    }
                    div("summary-cell") {
                        strong { +"纬/经度" }
                        span { +"${input.lat}°, ${input.lon}°" }
                    }
                    div("summary-cell") {
                        strong { +"儒略日" }
                        span { +formatDouble(chart.jd, 4) }
                    }
                    div("summary-cell") {
                        strong { +"岁差" }
                        span { +"${formatDouble(chart.ayanamsa, 4)}° (${input.ayanamsaType.displayName.take(10)})" }
                    }
                    div("summary-cell") {
                        strong { +"上升点" }
                        span { +"${formatSignDeg(chart.ascSidereal)}" }
                    }
                    div("summary-cell") {
                        strong { +"中天（MC）" }
                        span { +"${formatSignDeg(chart.mcSidereal)}" }
                    }
                    div("summary-cell") {
                        strong { +"日主" }
                        span { +dayLord.displayName }
                    }
                    div("summary-cell") {
                        strong { +"宫位制" }
                        span { +input.houseSystem.displayName.take(8) }
                    }
                }
            }

            // 行星位置卡
            div("result-card") {
                h2 { +"行星 KP 位置" }
                p("card-hint") { +"真星历 VSOP87（精度 <0.1°-0.3°）。逆行标 R。手动覆盖值在调试面板设置。" }
                div("item-card-grid") {
                    val kpChart = KpChart(chart.cusps, chart.planets)
                    for ((planet, deg) in chart.planets) {
                        val kp = kpPosition(deg)
                        val house = kpChart.houseOfDegree(deg)
                        val retro = chart.retrogrades[planet] == true
                        val dignity = planetDignity(planet, (deg / 30.0).toInt() % 12)
                        div("item-card planet-card") {
                            div("item-card-header") {
                                span("item-card-symbol") { +planet.symbol }
                                span("item-card-title") { +planet.displayName }
                                if (retro) span("item-card-tag retro-tag") { +"R" }
                                span("item-card-tag") { +"H$house" }
                                span("item-card-tag dignity-${dignity.name.lowercase()}") { +dignity.displayName }
                            }
                            div("data-grid") {
                                div("data-cell") {
                                    span("data-label") { +"黄经" }
                                    span("data-value") { +formatSignDeg(deg) }
                                }
                                div("data-cell") {
                                    span("data-label") { +"星座" }
                                    span("data-value") { +kp.sign.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"星宿" }
                                    span("data-value") { +kp.nakshatra.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"Pada" }
                                    span("data-value") { +nakshatraPada(deg).toString() }
                                }
                                div("data-cell") {
                                    span("data-label") { +"宫主" }
                                    span("data-value") { +kp.signLord }
                                }
                                div("data-cell") {
                                    span("data-label") { +"宿主" }
                                    span("data-value") { +kp.starLord.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"子主" }
                                    span("data-value") { +kp.subLord.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"子子主" }
                                    span("data-value") { +kp.subSubLord.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"KP号" }
                                    span("data-value kp-num") { +kp.kpNumber.toString() }
                                }
                                div("data-cell") {
                                    span("data-label") { +"神祇" }
                                    span("data-value") { +kp.nakshatra.deity() }
                                }
                                div("data-cell") {
                                    span("data-label") { +"Gana" }
                                    span("data-value") { +kp.nakshatra.gana().displayName }
                                }
                            }
                        }
                    }
                }
            }

            // 宫首子星分析
            div("result-card") {
                h2 { +"宫首子星分析" }
                p("card-hint") { +"12 宫宫首分别显示：宫首度数、星座、星主、宿主、子主、吉凶承诺（吉/凶/混合）" }
                div("item-card-grid") {
                    for (c in cuspal) {
                        div("item-card cusp-card") {
                            div("item-card-header") {
                                span("item-card-title") { +"第 ${c.house} 宫" }
                                span("item-card-tag ${c.promise.cssClass}") { +c.promise.label }
                            }
                            div("data-grid") {
                                div("data-cell") {
                                    span("data-label") { +"宫首" }
                                    span("data-value") { +formatSignDeg(c.cuspDeg) }
                                }
                                div("data-cell") {
                                    span("data-label") { +"星座" }
                                    span("data-value") { +c.sign.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"星主" }
                                    span("data-value") { +c.signLord }
                                }
                                div("data-cell") {
                                    span("data-label") { +"宿主" }
                                    span("data-value") { +c.starLord.displayName }
                                }
                                div("data-cell") {
                                    span("data-label") { +"子主" }
                                    span("data-value") { +c.subLord.displayName }
                                }
                            }
                        }
                    }
                }
            }

            // 象征星
            div("result-card") {
                h2 { +"象征星（全部 9 行星）" }
                p("card-hint") { +"KP 强弱等级：A（驻守星之宿主）> B（驻守星）> C（宫主之宿主）> D（宫主）> E（相位星）" }
                div("item-card-grid") {
                    for (s in sigs) {
                        div("item-card sig-card") {
                            div("item-card-header") {
                                span("item-card-symbol") { +s.planet.symbol }
                                span("item-card-title") { +s.planet.displayName }
                            }
                            div("sig-houses") {
                                if (s.signifiedHouses.isEmpty()) {
                                    span("house-empty") { +"— 无象征宫 —" }
                                } else {
                                    s.signifiedHouses.forEach { h ->
                                        span("house-chip") { +"H$h" }
                                    }
                                }
                            }
                            div("sig-detail") {
                                s.strengthOrder.forEach { (h, type) ->
                                    span("sig-grade sig-grade-${type.name.lowercase()}") {
                                        +"H$h·${type.label.first()}"
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 执掌行星 RP
            div("result-card") {
                h2 { +"执掌行星（RP）" }
                p("card-hint") { +"日主、月亮宫主、月亮宿主、上升宫主、上升宿主 —— 含罗睺/计都代理星主代入" }
                div("rp-grid") {
                    for ((lord, count) in rp) {
                        div("rp-card") {
                            div("rp-header") {
                                span("rp-name") { +lord.displayName }
                                span("rp-count") { +"×$count" }
                            }
                            div("strength-bar") {
                                repeat(count) { span("strength-dot") { +"●" } }
                            }
                        }
                    }
                }
            }

            // 事件承诺
            div("result-card") {
                h2 { +"人生事项承诺" }
                p("card-hint") { +"每项事项检查其主宫宫首子星是否承诺该事项" }
                div("event-grid") {
                    for ((event, promised) in events) {
                        div("event-card ${if (promised) "event-promised" else "event-denied"}") {
                            div("event-icon") { +if (promised) "✓" else "✗" }
                            div("event-name") { +event.displayName }
                            div("event-status") { +if (promised) "承诺" else "不承诺" }
                            div("event-detail") {
                                small { +"主宫 H${event.primaryHouse} · 吉宫 ${event.favorable.joinToString(",")}" }
                            }
                        }
                    }
                }
            }

            // 按宫位列象征星
            div("result-card") {
                h2 { +"按宫位列象征星" }
                p("card-hint") { +"每宫列出象征该宫的行星，按强弱排序（A > B > D > E）" }
                div("house-grid") {
                    for (house in 1..12) {
                        val houseSigs = significatorsOfHouse(house, sigs)
                        div("house-card") {
                            div("house-title") { +"第 $house 宫" }
                            if (houseSigs.isEmpty()) {
                                div("house-empty") { +"— 无 —" }
                            } else {
                                houseSigs.forEach { (planet, type) ->
                                    div("house-sig sig-grade-${type.name.lowercase()}") {
                                        span("house-sig-planet") { +planet.symbol }
                                        span("house-sig-grade") { +type.label.first().toString() }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 说明
            div("result-card notes-card") {
                h2 { +"说明" }
                ul {
                    li { +"算法为 xalen-ephemeris Rust 实现的 1:1 移植，所有 KP 函数与 Rust 源代码一致。" }
                    li { +"行星黄经采用 VSOP87 截断级数 + Meeus 太阳/月亮公式（精度 <0.3°），无需任何外部数据文件。" }
                    li { +"真 Placidus 宫位制采用迭代算法（基于半昼弧三等分）；高纬度可选等宫制或整宫制。" }
                    li { +"岁差值根据 JD 动态计算，不再使用 2026 固定值；支持 KP / Lahiri / Raman / Fagan-Bradley / True Chitra 五种。" }
                    li { +"Rahu/Ketu 默认逆行（mean node），相位按类木星约定（5/7/9 宫）。" }
                }
            }
        }
    }
}

// ===========================================================================
// Dasha 时间轴 Tab
// ===========================================================================

private fun renderDashaTab(chart: ComputedChart) {
    val container = document.getElementById("content-dasha") ?: return
    container.innerHTML = ""

    val moonDeg = chart.planets.first { it.first == Planet.Moon }.second
    val dashaPeriods = vimshottariDasha(moonDeg, chart.jd, DashaLevel.Pratyantardasha)

    container.append {
        div("results-container") {
            div("result-card") {
                h2 { +"Vimshottari Dasha 时间轴" }
                p("card-hint") {
                    +"从月亮恒星黄经起算，三层深度：大运 → 小运 → 过运。"
                    +"月亮位置：${formatSignDeg(moonDeg)}（${kpPosition(moonDeg).nakshatra.displayName}宿主：${kpPosition(moonDeg).starLord.displayName}）"
                }

                div("dasha-timeline") {
                    for (maha in dashaPeriods) {
                        div("dasha-maha dasha-lord-${maha.lord.name.lowercase()}") {
                            div("dasha-maha-header") {
                                span("dasha-lord-name") { +maha.lord.displayName }
                                span("dasha-period") {
                                    +"${jdToDateStr(maha.startJd)} → ${jdToDateStr(maha.endJd)}"
                                }
                                span("dasha-duration") {
                                    +"${formatDouble((maha.endJd - maha.startJd) / YEAR_IN_DAYS, 1)} 年"
                                }
                            }
                            div("dasha-antars") {
                                for (antar in maha.subPeriods) {
                                    div("dasha-antar dasha-lord-${antar.lord.name.lowercase()}") {
                                        div("dasha-antar-header") {
                                            span("dasha-lord-name") { +antar.lord.displayName }
                                            span("dasha-period") {
                                                +"${jdToDateStr(antar.startJd)} → ${jdToDateStr(antar.endJd)}"
                                            }
                                        }
                                        div("dasha-pratyantars") {
                                            for (pratyantar in antar.subPeriods) {
                                                div("dasha-pratyantar") {
                                                    span("dasha-lord-name") { +pratyantar.lord.displayName }
                                                    span("dasha-period") {
                                                        +"${jdToDateStr(pratyantar.startJd)} → ${jdToDateStr(pratyantar.endJd)}"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            div("result-card") {
                h2 { +"当前 Dasha" }
                val nowJd = julianDay(2026, 8, 5, 0.0)  // 当前 JD
                val currentMaha = findCurrentDasha(dashaPeriods, nowJd)
                if (currentMaha != null) {
                    val currentAntar = findCurrentDasha(currentMaha.subPeriods, nowJd)
                    val currentPratyantar = currentAntar?.let { findCurrentDasha(it.subPeriods, nowJd) }
                    div("current-dasha") {
                        div("dasha-row") {
                            strong { +"大运：" }
                            span { +"${currentMaha.lord.displayName} (${jdToDateStr(currentMaha.startJd)} → ${jdToDateStr(currentMaha.endJd)})" }
                        }
                        if (currentAntar != null) {
                            div("dasha-row") {
                                strong { +"小运：" }
                                span { +"${currentAntar.lord.displayName} (${jdToDateStr(currentAntar.startJd)} → ${jdToDateStr(currentAntar.endJd)})" }
                            }
                        }
                        if (currentPratyantar != null) {
                            div("dasha-row") {
                                strong { +"过运：" }
                                span { +"${currentPratyantar.lord.displayName} (${jdToDateStr(currentPratyantar.startJd)} → ${jdToDateStr(currentPratyantar.endJd)})" }
                            }
                        }
                    }
                } else {
                    p { +"未找到当前 Dasha（可能不在范围内）。" }
                }
            }
        }
    }
}

// ===========================================================================
// Horary 计算
// ===========================================================================

private fun computeHorary() {
    val container = document.getElementById("horary-result") ?: return
    container.innerHTML = ""
    try {
        val input = readInput()
        val kpNum = (document.getElementById("horary-num") as HTMLInputElement).value.toInt()
        val hourStr = (document.getElementById("horary-hour") as HTMLInputElement).value
        val hour = hourStr.toDoubleOrNull() ?: input.hour

        val horaryInput = input.copy(hour = hour)
        val jd = julianDay(horaryInput.year, horaryInput.month, horaryInput.day, hour)
        val ayanamsa = horaryInput.ayanamsa(jd)

        val (cusps, planets) = kpHoraryChart(
            kpNum, jd, horaryInput.lat, horaryInput.lon, ayanamsa, horaryInput.houseSystem
        )

        val sigs = computeSignificators(KpChart(cusps, planets))
        val cuspal = cuspalAnalysis(cusps, planets)
        val events = KpEvent.entries.map { e -> e to checkEventInChart(e, KpChart(cusps, planets)) }

        val moonDeg = planets.first { it.first == Planet.Moon }.second
        val ascDeg = cusps[0]
        val dayLord = dayLordOfWeek(horaryInput.year, horaryInput.month, horaryInput.day)
        val moonSig = kpPosition(moonDeg)
        val lagnaSig = kpPosition(ascDeg)
        val moonSignLord = ZodiacSign.fromLongitudeDeg(moonDeg).owner
        val lagnaSignLord = ZodiacSign.fromLongitudeDeg(ascDeg).owner
        val rahuPos = planets.first { it.first == Planet.Rahu }.second
        val rahuSignLord = ZodiacSign.fromLongitudeDeg(rahuPos).owner
        val ketuPos = planets.first { it.first == Planet.Ketu }.second
        val ketuSignLord = ZodiacSign.fromLongitudeDeg(ketuPos).owner

        val rp = rulingPlanetsWithAgents(
            dayLord = dayLord,
            moonSignLord = planetToDashaLord(moonSignLord)!!,
            moonStarLord = moonSig.starLord,
            lagnaSignLord = planetToDashaLord(lagnaSignLord)!!,
            lagnaStarLord = lagnaSig.starLord,
            rahuSignLord = planetToDashaLord(rahuSignLord),
            ketuSignLord = planetToDashaLord(ketuSignLord)
        )

        container.append {
            div("results-container") {
                div("result-card") {
                    h2 { +"Horary 问卜盘 · KP #$kpNum" }
                    p("card-hint") {
                        +"虚拟月亮位置：${formatSignDeg(moonDeg)}（${kpPosition(moonDeg).nakshatra.displayName}，Pada ${nakshatraPada(moonDeg)}）"
                    }
                    p("card-hint") {
                        +"问卜时间：${horaryInput.year}-${horaryInput.month}-${horaryInput.day} ${formatHour(hour)} UT"
                        +" · JD ${formatDouble(jd, 4)}"
                    }
                    p("card-hint") {
                        +"上升点：${formatSignDeg(ascDeg)}（${ZodiacSign.fromLongitudeDeg(ascDeg).displayName}）"
                    }

                    div("rp-summary") {
                        h3 { +"执掌行星 RP" }
                        div("rp-grid compact") {
                            for ((lord, count) in rp) {
                                div("rp-card") {
                                    span("rp-name") { +lord.displayName }
                                    span("rp-count") { +"×$count" }
                                }
                            }
                        }
                    }
                }

                div("result-card") {
                    h2 { +"事项判定" }
                    div("event-grid") {
                        for ((event, promised) in events) {
                            div("event-card ${if (promised) "event-promised" else "event-denied"}") {
                                div("event-icon") { +if (promised) "✓" else "✗" }
                                div("event-name") { +event.displayName }
                                div("event-status") { +if (promised) "承诺" else "不承诺" }
                            }
                        }
                    }
                }

                div("result-card") {
                    h2 { +"行星位置（虚拟月亮 + 真实行星）" }
                    div("item-card-grid") {
                        val kpChart = KpChart(cusps, planets)
                        for ((planet, deg) in planets) {
                            val kp = kpPosition(deg)
                            val house = kpChart.houseOfDegree(deg)
                            val isVirtualMoon = planet == Planet.Moon
                            div("item-card planet-card ${if (isVirtualMoon) "virtual-moon" else ""}") {
                                div("item-card-header") {
                                    span("item-card-symbol") { +planet.symbol }
                                    span("item-card-title") { +planet.displayName }
                                    if (isVirtualMoon) span("item-card-tag virtual-tag") { +"虚拟" }
                                    span("item-card-tag") { +"H$house" }
                                }
                                div("data-grid") {
                                    div("data-cell") {
                                        span("data-label") { +"黄经" }
                                        span("data-value") { +formatSignDeg(deg) }
                                    }
                                    div("data-cell") {
                                        span("data-label") { +"宿主" }
                                        span("data-value") { +kp.starLord.displayName }
                                    }
                                    div("data-cell") {
                                        span("data-label") { +"子主" }
                                        span("data-value") { +kp.subLord.displayName }
                                    }
                                    div("data-cell") {
                                        span("data-label") { +"KP号" }
                                        span("data-value kp-num") { +kp.kpNumber.toString() }
                                    }
                                }
                            }
                        }
                    }
                }

                div("result-card") {
                    h2 { +"宫首子星分析" }
                    div("item-card-grid") {
                        for (c in cuspal) {
                            div("item-card cusp-card") {
                                div("item-card-header") {
                                    span("item-card-title") { +"第 ${c.house} 宫" }
                                    span("item-card-tag ${c.promise.cssClass}") { +c.promise.label }
                                }
                                div("data-grid") {
                                    div("data-cell") {
                                        span("data-label") { +"宫首" }
                                        span("data-value") { +formatSignDeg(c.cuspDeg) }
                                    }
                                    div("data-cell") {
                                        span("data-label") { +"子主" }
                                        span("data-value") { +c.subLord.displayName }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (e: Throwable) {
        console.error("Horary failed", e)
        container.append {
            div("error-card") {
                h3 { +"Horary 计算错误" }
                pre { +(e.message ?: e.toString()) }
            }
        }
    }
}

// ===========================================================================
// 调试输出
// ===========================================================================

private fun renderDebugOutput(chart: ComputedChart) {
    val container = document.getElementById("debug-output") ?: return
    container.innerHTML = ""

    val input = chart.input
    val jd = chart.jd
    val lst = localSiderealTime(jd, input.lon)
    val nutLon = nutationLongitude(jd)
    val nutObl = nutationObliquity(jd)
    val obliquity = trueObliquity(jd)

    val lines = mutableListOf<Pair<String, String>>()
    lines += "JD（儒略日）" to formatDouble(jd, 6)
    lines += "Julian Century T" to formatDouble((jd - 2451545.0) / 36525.0, 8)
    lines += "地方恒星时 LST" to formatDegree(lst)
    lines += "真黄赤交角" to formatDouble(obliquity, 6) + "°"
    lines += "黄经章动 Δψ" to formatDouble(nutLon, 6) + "°"
    lines += "交角章动 Δε" to formatDouble(nutObl, 6) + "°"
    lines += "岁差值" to formatDouble(chart.ayanamsa, 6) + "°"
    lines += "上升点（恒星）" to formatDegree(chart.ascSidereal)
    lines += "中天 MC（恒星）" to formatDegree(chart.mcSidereal)
    lines += "宫位制" to input.houseSystem.displayName
    lines += "覆盖行星数" to input.planetOverrides.size.toString()
    lines += "覆盖宫首" to (if (input.cuspOverrides != null) "是（12 个）" else "否")

    lines += "" to ""  // 分隔
    lines += "=== 行星瞬时角速度（度/天，负值=逆行） ===" to ""
    for (p in Planet.VEDIC_NINE) {
        val speed = if (p == Planet.Rahu || p == Planet.Ketu) -0.05295
                    else planetAngularSpeed(p, jd)
        val retro = if (speed < 0) "R" else "D"
        lines += "${p.displayName}（${p.symbol}）" to
                 "${formatDouble(speed, 6)} °/天 [$retro]"
    }

    container.append {
        div("debug-lines") {
            for ((k, v) in lines) {
                if (k.isEmpty()) {
                    hr {}
                } else {
                    div("debug-line") {
                        span("debug-key") { +k }
                        span("debug-val") { +v }
                    }
                }
            }
        }
    }
}

// ===========================================================================
// JSON 导入导出
// ===========================================================================

private fun exportChartJson() {
    val input = readInput()
    val chart = computeChart(input)
    val json = buildString {
        append("{\n")
        append("  \"version\": \"2.0\",\n")
        append("  \"input\": {\n")
        append("    \"year\": ${input.year},\n")
        append("    \"month\": ${input.month},\n")
        append("    \"day\": ${input.day},\n")
        append("    \"hour\": ${input.hour},\n")
        append("    \"lat\": ${input.lat},\n")
        append("    \"lon\": ${input.lon},\n")
        append("    \"ayanamsaType\": \"${input.ayanamsaType.name}\",\n")
        append("    \"customAyanamsa\": ${input.customAyanamsa},\n")
        append("    \"houseSystem\": \"${input.houseSystem.name}\",\n")
        append("    \"ascendantOverride\": ${input.ascendantOverride ?: "null"},\n")
        append("    \"planetOverrides\": {")
        if (input.planetOverrides.isEmpty()) {
            append("},\n")
        } else {
            append("\n")
            input.planetOverrides.entries.forEachIndexed { i, (p, v) ->
                val comma = if (i < input.planetOverrides.size - 1) "," else ""
                append("      \"${p.name}\": $v$comma\n")
            }
            append("    },\n")
        }
        append("    \"cuspOverrides\": ")
        if (input.cuspOverrides == null) append("null\n")
        else {
            append("[")
            append(input.cuspOverrides.joinToString(", "))
            append("]\n")
        }
        append("  },\n")
        append("  \"computed\": {\n")
        append("    \"jd\": ${chart.jd},\n")
        append("    \"ayanamsa\": ${chart.ayanamsa},\n")
        append("    \"ascSidereal\": ${chart.ascSidereal},\n")
        append("    \"mcSidereal\": ${chart.mcSidereal},\n")
        append("    \"cusps\": [${chart.cusps.joinToString(", ")}],\n")
        append("    \"planets\": {\n")
        chart.planets.forEachIndexed { i, (p, deg) ->
            val comma = if (i < chart.planets.size - 1) "," else ""
            append("      \"${p.name}\": $deg$comma\n")
        }
        append("    },\n")
        append("    \"retrogrades\": {\n")
        chart.retrogrades.entries.forEachIndexed { i, (p, r) ->
            val comma = if (i < chart.retrogrades.size - 1) "," else ""
            append("      \"${p.name}\": $r$comma\n")
        }
        append("    }\n")
        append("  }\n")
        append("}\n")
    }

    // 复制到剪贴板
    val ta = document.createElement("textarea") as HTMLTextAreaElement
    ta.value = json
    document.body?.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body?.removeChild(ta)
    window.alert("星盘 JSON 已复制到剪贴板（${json.length} 字符）。")
}

private fun importChartJson() {
    val text = window.prompt("粘贴星盘 JSON（仅 input 部分会被读取）", "") ?: return
    try {
        // 使用 Kotlin/JS 原生 JSON 解析
        val parsed = JSON.parse<dynamic>(text)
        val input = parsed["input"] ?: parsed

        val year = (input["year"] as? Number)?.toInt()
        val month = (input["month"] as? Number)?.toInt()
        val day = (input["day"] as? Number)?.toInt()
        val hour = (input["hour"] as? Number)?.toDouble()
        val lat = (input["lat"] as? Number)?.toDouble()
        val lon = (input["lon"] as? Number)?.toDouble()
        val ayaType = input["ayanamsaType"] as? String
        val customAya = (input["customAyanamsa"] as? Number)?.toDouble()
        val houseSys = input["houseSystem"] as? String
        val ascOverride = (input["ascendantOverride"] as? Number)?.toDouble()

        if (year != null) (document.getElementById("year") as HTMLInputElement).value = year.toString()
        if (month != null) (document.getElementById("month") as HTMLInputElement).value = month.toString()
        if (day != null) (document.getElementById("day") as HTMLInputElement).value = day.toString()
        if (hour != null) (document.getElementById("hour") as HTMLInputElement).value = hour.toString()
        if (lat != null) (document.getElementById("lat") as HTMLInputElement).value = lat.toString()
        if (lon != null) (document.getElementById("lon") as HTMLInputElement).value = lon.toString()
        if (ayaType != null) (document.getElementById("ayanamsa-type") as HTMLSelectElement).value = ayaType
        if (customAya != null) (document.getElementById("custom-ayanamsa") as HTMLInputElement).value = customAya.toString()
        if (houseSys != null) (document.getElementById("house-system") as HTMLSelectElement).value = houseSys
        if (ascOverride != null) (document.getElementById("asc-override") as HTMLInputElement).value = ascOverride.toString()

        // 行星覆盖
        val planetOverrides = input["planetOverrides"]
        if (planetOverrides != null) {
            for (p in Planet.entries) {
                val v = (planetOverrides[p.name] as? Number)?.toDouble()
                if (v != null) {
                    (document.getElementById("override-planet-${p.name}") as? HTMLInputElement)?.value = v.toString()
                }
            }
        }

        // 宫首覆盖
        val cuspOverrides = input["cuspOverrides"]
        if (cuspOverrides != null && jsTypeOf(cuspOverrides) == "object") {
            val arr = cuspOverrides as Array<Number>
            if (arr.size == 12) {
                for (i in 0 until 12) {
                    val v = arr[i].toDouble()
                    (document.getElementById("override-cusp-${i + 1}") as? HTMLInputElement)?.value = v.toString()
                }
            }
        }

        window.alert("已导入星盘配置。点击「排 KP 星盘」即可。")
    } catch (e: Throwable) {
        window.alert("JSON 解析失败：${e.message}")
    }
}

private fun clearOverrides() {
    for (p in Planet.entries) {
        (document.getElementById("override-planet-${p.name}") as? HTMLInputElement)?.value = ""
    }
    for (i in 1..12) {
        (document.getElementById("override-cusp-$i") as? HTMLInputElement)?.value = ""
    }
    (document.getElementById("asc-override") as? HTMLInputElement)?.value = ""
}

// ===========================================================================
// 岁差下拉联动
// ===========================================================================

@OptIn(ExperimentalJsExport::class)
@JsExport
fun setupAyanamsaToggle() {
    val sel = document.getElementById("ayanamsa-type") as? HTMLSelectElement ?: return
    val custom = document.getElementById("custom-ayanamsa") as? HTMLInputElement ?: return
    sel.addEventListener("change", { _ ->
        custom.disabled = sel.value != "Custom"
    })
}

@OptIn(ExperimentalJsExport::class)
@JsExport
fun initApp() {
    main()
    setupAyanamsaToggle()
}
