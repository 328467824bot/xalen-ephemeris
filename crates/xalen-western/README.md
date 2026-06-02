# xalen-western

> Western astrology computations — aspects, dignities, lots, returns, progressions, and Hellenistic techniques over ecliptic positions.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

`xalen-western` takes planetary longitudes and chart angles (produced by `xalen-ephem` / `xalen-chart`) and turns them into the interpretive structures Western astrologers work with. It performs no ephemeris integration itself — it operates on positions you supply.

## Features

- **Aspects** — major and minor aspect detection (conjunction through bi-quintile) with per-aspect default orbs, applying/separating/exact direction, and transit-to-natal exact-time search.
- **Dignities** — essential dignity scoring (domicile, exaltation, triplicity, terms/bounds, faces), accidental dignity, mutual reception, and almuten / almuten figuris.
- **Arabic Parts / Lots** — Part of Fortune, Part of Spirit, and a configurable formula engine with day/night sect reversal.
- **Returns & progressions** — solar and lunar return charts; secondary progressions and solar arc directions.
- **Hellenistic & traditional** — sect, bounds, decans, horary judgment helpers, and electional timing rules.
- **Chart patterns** — T-square, Grand Trine, Yod and related configurations.
- **Sabian symbols** — full 360-degree symbol catalog with degree-type and decanate lookup.
- **Specialist systems** — midpoints / midpoint trees, harmonics, Uranian (Transneptunian) points, cosmobiology (90° dial and planetary-picture geometry — Ebertin's interpretive midpoint keywords are **not bundled** in this open-source release, so the key-interpretation slots are currently empty), heliacal phenomena, fixed stars, and Western sidereal (Fagan–Bradley).

## Usage

```rust
use xalen_western::aspects::{find_all_aspects, AspectType, AspectDirection};

// (name, ecliptic longitude °, daily speed °/day)
let positions = vec![
    ("Sun".to_string(),  10.0, 0.98),
    ("Moon".to_string(), 130.5, 13.2),
    ("Mars".to_string(), 190.2, 0.52),
];

let aspects = find_all_aspects(&positions, AspectType::MAJOR);

for a in &aspects {
    let state = match a.direction {
        AspectDirection::Applying   => "applying",
        AspectDirection::Separating => "separating",
        AspectDirection::Exact      => "exact",
    };
    println!("{} {:?} {} — orb {:.2}° ({state})", a.body1, a.aspect_type, a.body2, a.orb_deg);
}
```

## Accuracy & sources

Outputs are deterministic functions of the longitudes you provide; orb tables and dignity rulerships follow standard traditional sources. See [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md).

## License

Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
