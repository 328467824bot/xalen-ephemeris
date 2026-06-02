# xalen-wasm
> WebAssembly bindings for the XALEN Ephemeris — compute Vedic charts, panchang, houses, and dasha periods in any browser or Node.js.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

This crate wraps the XALEN core crates behind a single `XalenWasm` handle exported to JavaScript via `wasm-bindgen`. Build it with `wasm-pack build --target web` (or `--target nodejs`). The same handle also compiles to native Rust, so it can be exercised in ordinary `cargo test`.

## Features
- **`XalenWasm` handle** — constructed once (`new`), it holds an `Almanac` configured for Vedic work and serves every other call.
- **Planetary longitudes** — `tropicalLongitude(jd_ut1, body_id)` and `siderealLongitude(jd_ut1, body_id, ayanamsa_id)`. Ketu (body 13) is derived as Rahu + 180°.
- **Full chart** — `fullChartJson(jd_ut1, lat, lon, ayanamsa_id)` returns the nine grahas (longitude, nakshatra, pada, rashi) plus Whole-Sign ascendant, MC, and ayanamsa as JSON.
- **Panchang** — `panchangJson(jd_ut1, ayanamsa_id)` for the five limbs (tithi, vara, nakshatra, yoga, karana).
- **Houses** — `housesJson(jd_ut1, lat, lon, system_id)` across 14 supported house systems (Whole Sign, Equal, Placidus, Koch, …).
- **Nakshatra & rashi lookups** — `getNakshatra(moon_sidereal_deg)`, `getRashi(sidereal_deg)`.
- **Vimshottari Dasha** — `vimshottariDasha(moon_deg, birth_jd)` returns all 9 Mahadashas with Antardasha sub-periods.
- **Ashta Koota compatibility** — `compatibility(boy_moon_deg, girl_moon_deg)` (sidereal Moon longitudes in degrees, 0–360) returns the 8 koota scores and total (out of 36). Both nakshatra and rashi are resolved from the longitude, so a Moon near a sign boundary maps correctly.
- **Divisional (Varga) charts** — `divisionalChart(lon_deg, varga)` for D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60.
- **Time & ayanamsa helpers** — `julianDay(year, month, day, hour)`, `ayanamsaDeg(jd_ut1, ayanamsa_id)` (17 systems), `deltaT(jd)`, `bodyName(body_id)`.
- Numeric IDs are documented inline in the source (bodies 0–13, ayanamsas 0–16, house systems 0–13, vargas as listed above).

## Usage
```rust
use xalen_wasm::XalenWasm;

let w = XalenWasm::new();

// Julian Day for 2000-01-01 12:00 UT (J2000.0).
let jd = XalenWasm::julian_day(2000, 1, 1, 12.0);

// Lahiri ayanamsa (id 0) at J2000.0 — about 23.85 degrees.
let ayanamsa = XalenWasm::ayanamsa_deg(jd, 0).unwrap();
assert!(ayanamsa > 23.0 && ayanamsa < 25.0);

// Full Vedic chart for Pune (18.52 N, 73.85 E) as a JSON string.
let chart = w.full_chart_json(jd, 18.52, 73.85, 0).unwrap();
assert!(chart.contains("Sun") && chart.contains("Moon"));
```

In JavaScript after `wasm-pack build`:
```js
import init, { XalenWasm } from "./pkg/xalen_wasm.js";
await init();
const w = new XalenWasm();
const chart = JSON.parse(w.fullChartJson(2451545.0, 18.52, 73.85, 0));
```

## Accuracy & sources
Positions and derived quantities come from the XALEN core crates (VSOP87 with IAU 2000B nutation, ELP2000-82 for the Moon) cross-validated against JPL DE440 — see [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
