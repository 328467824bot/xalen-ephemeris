# xalen-coords
> Coordinate frames, precession, nutation, obliquity, and frame transforms for the XALEN Ephemeris.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **IAU 2006/P03 precession** — precession angles (`precession_angles`), the J2000→equinox-of-date rotation matrix, and general precession in ecliptic longitude (`general_precession_longitude`).
- **IAU 2000B nutation** — 77-term lunisolar series returning nutation in longitude (Δψ) and obliquity (Δε) via `nutation_2000b`.
- **IAU 2006 obliquity** — mean obliquity of the ecliptic (`mean_obliquity`) and true obliquity (mean + nutation).
- **Frame transforms** — round-trippable geometric conversions between ecliptic, equatorial, and Cartesian positions (`ecliptic_to_equatorial`, `equatorial_to_ecliptic`, `ecliptic_to_cartesian`, `cartesian_to_ecliptic`). (Apparent-place corrections — nutation, aberration, light-time — are applied by the `xalen-ephem` pipeline, not by these geometric transforms.)
- **Position types** — `EclipticPosition`, `EquatorialPosition`, `CartesianPosition`, with degree/hour accessors and longitude normalization. All `Copy` and `serde`-serializable.
- **Canonical `Planet` enum** — 14 bodies spanning Vedic, Hellenistic/Western, and modern traditions, with classification helpers (`is_classical`, `is_node`, `is_outer`, …), `Display`, and `FromStr`.

## Usage
```rust
use xalen_coords::{mean_obliquity, ecliptic_to_equatorial, EclipticPosition, DEG_TO_RAD};

// Mean obliquity of the ecliptic at J2000.0 (t = Julian centuries from J2000).
let epsilon = mean_obliquity(0.0);

// A point one degree along the ecliptic, on the equinox.
let ecl = EclipticPosition {
    longitude: 1.0 * DEG_TO_RAD,
    latitude: 0.0,
    distance: 1.0,
};

let eq = ecliptic_to_equatorial(&ecl, epsilon);
println!("RA = {:.4} h, Dec = {:.4}°", eq.ra_hours(), eq.dec_deg());
```

## Accuracy & sources
Angles follow the IAU 2006/P03 precession model, the IAU 2000B nutation series, and the IAU 2006 obliquity expression. For measured errors and validation methodology see [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
