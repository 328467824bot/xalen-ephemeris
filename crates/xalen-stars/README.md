# xalen-stars
> A catalog of 108 astrologically significant fixed stars with precession- and proper-motion-corrected ecliptic positions.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- Built-in `CATALOG` of 108 fixed stars, each with J2000.0 ecliptic longitude/latitude, visual magnitude, Ptolemaic planetary nature, and proper-motion components (mas/yr).
- `FixedStar::longitude_at_epoch` / `latitude_at_epoch` / `longitude_at_jd` — positions at any decimal year or Julian Date. Precession (50.28796″/yr, the IAU 2006 J2000 linear rate) is applied to the **ecliptic longitude** only; **ecliptic latitude** changes solely through per-star proper motion (a linear-rate precession does not alter ecliptic latitude).
- `find_by_name` (case-insensitive lookup) and `find_conjunctions` / `find_conjunctions_at_epoch` — stars within a given orb of a planetary longitude.
- `nakshatra_yogatara` — maps each of the 27 nakshatra indices (0 = Ashwini … 26 = Revati) to its primary reference star.
- `catalog` module — load and merge external catalogs (e.g. Hipparcos) from CSV at runtime via `load_catalog_from_csv` / `load_catalog_from_str`, `merge_catalogs`, `find_in_catalog`, and `find_conjunctions_in_catalog`.
- `serde`-serializable `FixedStar`; no `unsafe`, no global mutable state.

## Usage
```rust
use xalen_stars::{find_by_name, find_conjunctions, nakshatra_yogatara};

// Look up a star and compute its precessed longitude in the year 2100.
let spica = find_by_name("Spica").unwrap();
let lon_2100 = spica.longitude_at_epoch(2100.0);
println!("Spica longitude in 2100: {lon_2100:.3}°");

// The reference star (yogatara) for Chitra nakshatra (index 13) is Spica.
let chitra = nakshatra_yogatara(13).unwrap();
assert_eq!(chitra.name, "Spica");

// Find catalog stars within a 2° orb of ecliptic longitude 70°.
for (star, dist) in find_conjunctions(70.0, 2.0) {
    println!("{} at {:.2}° away", star.name, dist);
}
```

## Accuracy & sources
J2000.0 positions and proper motions are drawn from standard astrometric data; epoch propagation uses general precession plus per-star proper motion (CSV imports apply an approximate equatorial-to-ecliptic conversion). See [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
