# xalen-houses
> Astrological house cusps and chart angles (Ascendant, MC, IC, Descendant, Vertex) across 20+ house systems, with polar-region fallback.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **20+ house systems** via the `HouseSystem` enum: Whole Sign, Equal, Placidus, Koch, Porphyry, Regiomontanus, Campanus, Morinus, Alcabitius (+ Classic variant), Topocentric, Meridian, Vehlow, Sripati, Krusinski-Pisa, Gauquelin, Sunshine (Makransky/Treindl), Pullen Sinusoidal (Delta/Ratio), Carter Poli-Equatorial, APC, and Axial Rotation (Zariel).
- **Chart angles** from a Julian Day, location, and obliquity: Ascendant, MC, IC, Descendant, and Vertex, plus the RAMC and sidereal-time helpers (`compute_ramc`, `compute_mc`, `compute_ascendant`, `gmst`, `local_sidereal_time`).
- **Polar-region handling** — latitude-dependent systems automatically fall back to Porphyry beyond the Arctic/Antarctic Circle, flagged via `HouseCusps::fallback_used`. Query a system's behaviour with `needs_latitude()` and `has_polar_limitation()`.
- **House placement** — `HouseCusps::planet_in_house()` maps any ecliptic longitude to its house (1–12); `cusp_deg()` returns cusps in degrees.
- **Tradition defaults** — `HouseSystem::vedic_default()` (Whole Sign), `western_default()` (Placidus), `kp_default()` (Placidus), plus `swiss_ephem_code()` for Swiss Ephemeris interop.
- **Offline geocoding** — the `geocoding` module resolves 100+ astrology-relevant cities to coordinates with zero network calls (`city_coordinates`, `available_cities`).
- **Serde-ready** — `HouseSystem`, `GeoLocation`, and `HouseCusps` all derive `Serialize`/`Deserialize`.

## Usage
```rust
use xalen_houses::{HouseSystem, compute_houses, geocoding::city_coordinates};

// Resolve a location (or build one with GeoLocation::new(lat_deg, lon_deg)).
let location = city_coordinates("london").expect("known city");

// Julian Day (UT1) for the moment of interest and the obliquity of the
// ecliptic in radians. Pair with `xalen-time` / `xalen-coords` to derive
// these; J2000.0 and the mean obliquity at that epoch are used here.
let jd_ut1 = 2_451_545.0;
let epsilon = 23.4393_f64.to_radians();

let houses = compute_houses(jd_ut1, &location, epsilon, HouseSystem::Placidus);

println!("Ascendant: {:.2}°", houses.ascendant.to_degrees());
println!("MC:        {:.2}°", houses.mc.to_degrees());
for i in 0..12 {
    println!("House {:>2}: {:>7.2}°", i + 1, houses.cusp_deg(i));
}
if houses.fallback_used {
    println!("Note: polar latitude — fell back to Porphyry cusps.");
}
```

## Accuracy & sources
House angles (Ascendant, MC, Vertex) and **Placidus** cusps are cross-validated
against Swiss Ephemeris (Placidus ascendant/cusps p99 < 0.013° at scale, Vertex
< 0.01°). The other standard systems share the same validated Ascendant/MC
primitives; per-system Swiss validation is in progress, and the specialised
systems (Gauquelin, Sunshine, Pullen, Carter, APC) are **experimental** analytical
approximations, not yet Swiss-validated. See [ACCURACY.md](../../docs/ACCURACY.md)
and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
