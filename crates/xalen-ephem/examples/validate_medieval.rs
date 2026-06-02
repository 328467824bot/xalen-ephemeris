//! Medieval-epoch cross-validation of the XALEN **analytical** ephemeris
//! (`Vsop87Provider`) against JPL Horizons (DE441).
//!
//! For each of five dates spanning AD 500 – 1700 (all at 12:00:00 TT) this
//! computes the apparent geocentric ecliptic longitude (equinox-of-date,
//! light-time + nutation + aberration corrected — exactly what Horizons
//! quantity 31 `ObsEcLon` reports) for Sun, Moon, Mercury, Venus, Mars,
//! Jupiter and Saturn, and prints one CSV row per (body, date).
//!
//! Run:  `cargo run -p xalen-ephem --example validate_medieval --release`
//!
//! The printed `xalen_lon_deg` column is compared offline against the
//! Horizons `ObsEcLon` values fetched from
//! <https://ssd.jpl.nasa.gov/api/horizons.api> (see docs/MEDIEVAL_VALIDATION.md
//! for the exact API URLs, the Horizons numbers, and the residual table).
//!
//! Time-scale note: the provider takes JD **TT** directly, and the JDs below
//! are the exact instants Horizons was queried at (`TLIST_TYPE='JD'`,
//! `TIME_TYPE='TT'`), so the comparison is free of any calendar-interpretation
//! or ΔT ambiguity — both sides are driven by the identical absolute instant.

use xalen_ephem::{Body, EphemerisProvider, Vsop87Provider};
use xalen_time::JdTT;

const RAD_TO_DEG: f64 = 180.0 / std::f64::consts::PI;

fn main() {
    let provider = Vsop87Provider::new();

    // (label, JD(TT) at 12:00 TT). These JDs were echoed back by Horizons as
    // the listed calendar dates (Julian calendar before 1582-10-15, Gregorian
    // after — Horizons "Mixed" calendar mode), confirming the instant mapping.
    let epochs: &[(&str, f64)] = &[
        ("0500-03-21", 1_903_763.0),
        ("0800-06-21", 2_013_430.0),
        ("1100-09-23", 2_123_099.0),
        ("1400-12-21", 2_232_763.0),
        ("1700-06-21", 2_342_144.0),
    ];

    let bodies: &[(&str, Body)] = &[
        ("Sun", Body::Sun),
        ("Moon", Body::Moon),
        ("Mercury", Body::Mercury),
        ("Venus", Body::Venus),
        ("Mars", Body::Mars),
        ("Jupiter", Body::Jupiter),
        ("Saturn", Body::Saturn),
    ];

    println!("body,date,xalen_lon_deg");
    for (body_name, body) in bodies {
        for (date, jd) in epochs {
            match provider.geocentric_ecliptic(*body, JdTT(*jd)) {
                Ok(pos) => {
                    let lon_deg = (pos.longitude * RAD_TO_DEG).rem_euclid(360.0);
                    println!("{body_name},{date},{lon_deg:.7}");
                }
                Err(e) => {
                    println!("{body_name},{date},ERROR: {e}");
                }
            }
        }
    }
}
