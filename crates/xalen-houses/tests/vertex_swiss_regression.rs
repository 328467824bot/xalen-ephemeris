//! Vertex regression vs Swiss Ephemeris (swe_houses ascmc[3], Placidus, tropical).
//!
//! Pins the co-latitude Vertex fix (cusps.rs: `FRAC_PI_2 - phi`, replacing the
//! earlier `-phi`). Swiss reference values were produced by `swe_houses` in an
//! external Swiss-Ephemeris FFI harness and independently cross-checked against
//! the Swiss Ephemeris reference (2026-05-31).

use xalen_houses::{GeoLocation, HouseSystem, compute_houses};

/// IAU 2006 mean obliquity (radians) from a Julian Day — matches xalen-coords.
fn mean_obliquity_rad(jd: f64) -> f64 {
    let t = (jd - 2_451_545.0) / 36525.0;
    let eps_arcsec = 84381.406 - 46.836769 * t - 0.0001831 * t * t + 0.00200340 * t * t * t
        - 0.000000576 * t.powi(4)
        - 0.0000000434 * t.powi(5);
    (eps_arcsec / 3600.0).to_radians()
}

fn ang(a: f64, b: f64) -> f64 {
    let d = (a - b).abs() % 360.0;
    d.min(360.0 - d)
}

#[test]
fn vertex_matches_swiss_reference() {
    // (jd_ut, lat, lon, Swiss ascmc[3] in degrees)
    let cases = [
        (2451545.0_f64, 40.71_f64, -74.0_f64, 134.21391_f64),
        (2451545.0, 51.50, 0.0, 188.47111),
        (2451545.0, -33.87, 151.2, 347.86390),
        (2460000.0, 18.52, 73.85, 232.92369),
    ];

    let mut worst = 0.0f64;
    for (jd, lat, lon, swiss_vtx) in cases {
        let eps = mean_obliquity_rad(jd);
        let loc = GeoLocation::new(lat, lon);
        let h = compute_houses(jd, &loc, eps, HouseSystem::Placidus);
        let vtx_deg = h.vertex.to_degrees().rem_euclid(360.0);
        let d = ang(swiss_vtx, vtx_deg);
        println!(
            "lat={lat:>7} lon={lon:>7}: swiss={swiss_vtx:9.4}  xalen={vtx_deg:9.4}  diff={d:.4}°"
        );
        worst = worst.max(d);
    }
    println!("worst vertex diff vs Swiss: {worst:.4}°");
    assert!(
        worst < 0.05,
        "Vertex disagrees with Swiss by {worst:.4}° (> 0.05°)"
    );
}
