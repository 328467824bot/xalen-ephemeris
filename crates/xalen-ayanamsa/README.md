# xalen-ayanamsa
> Ayanamsa (sidereal precession offset) for tropical-to-sidereal longitude conversion across 50 named astronomical systems.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **50 named ayanamsa systems** plus a user-defined `Custom` variant — the 47 predefined Swiss Ephemeris systems (SE IDs 0–46) plus 3 additional variants: Lahiri, KP (Krishnamurti), Raman, Fagan-Bradley, True Chitra, the Babylonian (Kugler/Huber/Mercier/Britton), galactic-reference, Hellenistic, theosophical, and reference-epoch (J2000/J1900/B1950) families.
- `compute(jd_tt) -> f64` (radians) and `compute_deg(jd_tt) -> f64` (degrees) at any Terrestrial Time Julian Day.
- `tropical_to_sidereal` / `sidereal_to_tropical` longitude conversion helpers (radians, wrapped to `[0, 2π)`).
- Swiss Ephemeris interop: `swiss_ephem_id()` and `from_swiss_ephem_id(id)` round-trip the SE `SE_SIDM_*` constants.
- Convenience constructors `Ayanamsa::vedic_default()` (Lahiri), `Ayanamsa::kp_default()` (Krishnamurti), and `Ayanamsa::all_named()` to enumerate every named system.
- `Copy`, `Debug`, `PartialEq`, `Display`, and `serde` `Serialize`/`Deserialize` on the `Ayanamsa` enum.

## Usage
```rust
use xalen_ayanamsa::{Ayanamsa, tropical_to_sidereal};

// J2000.0 (2000 Jan 1.5 TT)
let jd_tt = 2_451_545.0;

// Lahiri is the Vedic default; ~23.85 deg at J2000.
let lahiri = Ayanamsa::vedic_default();
println!("{lahiri} ayanamsa: {:.4} deg", lahiri.compute_deg(jd_tt));

// Convert a tropical longitude (radians) to sidereal.
let tropical = 280.0_f64.to_radians();
let sidereal = tropical_to_sidereal(tropical, &lahiri, jd_tt);
println!("sidereal longitude: {:.4} deg", sidereal.to_degrees());

// Map to/from a Swiss Ephemeris sidereal-mode ID.
assert_eq!(lahiri.swiss_ephem_id(), Some(1));
assert_eq!(Ayanamsa::from_swiss_ephem_id(5), Some(Ayanamsa::KPKrishnamurti));
```

## Accuracy & sources
Values use the Vondrák et al. (2011) general-precession rate anchored to Swiss Ephemeris `sweph.h` reference data and cross-validated at J2000 (1 arcsec tolerance for epoch-based systems). **True Chitra** is a full dynamic apparent-place reduction (Spica + proper motion + IAU 2006 precession + IAU 2000B nutation + aberration; 0.015″ at J2000, ≤1.6″ across 1900–2100). The remaining star-anchored systems (e.g. True Revati) still use a linear approximation. See [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
