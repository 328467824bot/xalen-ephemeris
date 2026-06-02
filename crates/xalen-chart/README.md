# xalen-chart
> Renders astrological birth charts as standalone SVG strings — no browser, canvas, or image library required.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **North Indian** diamond chart (Vedic standard) — `render_north_indian`
- **South Indian** box chart with fixed sign positions — `render_south_indian`
- **Western wheel** chart with zodiac ring and house segments — `render_western_wheel`
- Each renderer returns a complete, self-contained `<svg>` string
- Takes pre-computed positions via a single `ChartData` struct (planet placements, house cusps, ascendant, ayanamsa annotation)
- All text is XML-escaped to prevent SVG/XML injection; NaN/Inf longitudes are sanitized so rendering never panics
- `serde` `Serialize`/`Deserialize` on the public input types
- Zero external dependencies beyond the XALEN core crates

## Usage
```rust
use xalen_chart::{ChartData, PlanetPosition, render_north_indian};

let chart = ChartData {
    planet_positions: vec![
        PlanetPosition { abbreviation: "Su".into(), house: 1, longitude_deg: 15.0 },
        PlanetPosition { abbreviation: "Mo".into(), house: 4, longitude_deg: 105.0 },
    ],
    house_cusps_deg: [
        0.0, 30.0, 60.0, 90.0, 120.0, 150.0,
        180.0, 210.0, 240.0, 270.0, 300.0, 330.0,
    ],
    ascendant_sign_index: 0, // 0 = Aries/Mesha
    ayanamsa_deg: 23.87,
};

let svg = render_north_indian(&chart);
assert!(svg.starts_with("<svg"));
```

See [`examples/full_chart_svg.rs`](https://github.com/vedika-io/xalen-ephemeris/blob/main/examples/full_chart_svg.rs) for an end-to-end run that computes positions from the ephemeris and feeds them into this crate.

## Accuracy & sources
This crate is a renderer, not a calculator — it draws the positions you pass in and does not compute any astronomical values itself. For the accuracy of the upstream calculation crates that produce those positions, see [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
