# xalen-time
> Astronomical time primitives: Julian Dates, delta-T, time scales, and calendar conversions.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **Typed Julian Dates** — `JdTT`, `JdUT1`, and `JdTDB` are distinct newtypes over `f64`, so time scales never get mixed up silently. All implement the `JulianDay` trait (`as_f64`, `julian_centuries_from_j2000`).
- **Time-scale conversions** — UT1↔TT (via delta-T, with iterative TT→UT1 solve) and TT↔TDB (Fairhead & Bretagnon periodic terms). `TimeScale` enum plus the fixed TAI↔TT offset (32.184 s).
- **delta-T (TT − UT1)** — four selectable models via `DeltaTModel`: Stephenson–Morrison–Hohenkerk 2016, Espenak–Meeus 2006, Morrison–Stephenson 2004, and `Zero`. `delta_t_with_uncertainty` returns an estimated 1-sigma error that grows for ancient dates.
- **Calendar conversions** — `calendar_to_jd` / `jd_to_calendar` for proleptic Gregorian, proleptic Julian, and a configurable Julian→Gregorian cutover (`CalendarSystem`).
- **`Epoch`** — a builder combining a UT1 Julian Date, calendar system, and delta-T model; construct from local date/time + timezone offset and derive TT.
- **serde** — every public type derives `Serialize`/`Deserialize`.
- **Standard constants** — `J2000_JD`, `DAYS_PER_JULIAN_CENTURY`, `SECONDS_PER_DAY`.

## Usage
```rust
use xalen_time::{Epoch, DeltaTModel, JulianDay};

// 1990-01-15 10:30 local, IST (UTC+5.5) — e.g. a birth time in Pune.
let epoch = Epoch::new(1990, 1, 15, 10.5, 5.5);

// Stored internally as a UT1 Julian Date (10:30 IST == 05:00 UTC).
let (y, m, d, hour) = epoch.to_calendar();
assert_eq!((y, m, d), (1990, 1, 15));

// Convert to Terrestrial Time using the default delta-T model.
let tt = epoch.jd_tt();
println!("{tt}"); // JD(TT) 2447906.708...

// delta-T at J2000.0 is ~63.8 s.
let dt = xalen_time::delta_t(
    xalen_time::J2000_JD,
    &DeltaTModel::StephensonMorrisonHohenkerk2016,
);
assert!((dt - 63.83).abs() < 2.0);
```

## Accuracy & sources
delta-T and time-scale formulae follow published models (Stephenson–Morrison–Hohenkerk 2016, Espenak–Meeus, Fairhead & Bretagnon); see [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md) for the model ranges, validation, and references.

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
