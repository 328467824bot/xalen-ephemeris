//! Cross-validation against the OFFICIAL VSOP87 check file.
//!
//! `vsop87.chk` is the reference data distributed by Bretagnon & Francou
//! (IMCCE / Bureau des Longitudes) alongside the VSOP87 theory itself, precisely
//! so implementations can prove correctness against the source. Each `VSOP87A`
//! record tabulates heliocentric rectangular ecliptic-of-J2000 coordinates (AU)
//! for a body at a fixed epoch. This test parses every VSOP87A position record
//! and checks XALEN's VSOP87A output against it — i.e. it validates the
//! analytical theory layer against its own primary source, not against another
//! library.
//!
//! Source: ftp://ftp.imcce.fr/pub/ephem/planets/vsop87/vsop87.chk
//! (public scientific reference data; vendored at tests/data/vsop87.chk).

use xalen_ephem::{Body, Vsop87Provider};

const CHK: &str = include_str!("data/vsop87.chk");
const AU_KM: f64 = 149_597_870.7;

const NAMES: [&str; 8] = [
    "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune",
];

fn map_planet(name: &str) -> Option<Body> {
    Some(match name {
        "MERCURY" => Body::Mercury,
        "VENUS" => Body::Venus,
        "EARTH" => Body::Earth,
        "MARS" => Body::Mars,
        "JUPITER" => Body::Jupiter,
        "SATURN" => Body::Saturn,
        "URANUS" => Body::Uranus,
        "NEPTUNE" => Body::Neptune,
        // EMB, SUN and other VSOP87 variants are not in XALEN's VSOP87A Body set.
        _ => return None,
    })
}

fn body_idx(b: Body) -> usize {
    match b {
        Body::Mercury => 0,
        Body::Venus => 1,
        Body::Earth => 2,
        Body::Mars => 3,
        Body::Jupiter => 4,
        Body::Saturn => 5,
        Body::Uranus => 6,
        Body::Neptune => 7,
        _ => unreachable!("map_planet only yields the 8 VSOP87A planets"),
    }
}

#[test]
fn xalen_matches_official_vsop87_check_file() {
    let provider = Vsop87Provider::new();
    let lines: Vec<&str> = CHK.lines().collect();

    let mut max_err = [0.0f64; 8];
    let mut count = [0usize; 8];
    let mut overall_max = 0.0f64;
    let mut checked = 0usize;

    for i in 0..lines.len() {
        let toks: Vec<&str> = lines[i].split_whitespace().collect();
        if toks.len() < 3 || toks[0] != "VSOP87A" {
            continue;
        }
        let body = match map_planet(toks[1]) {
            Some(b) => b,
            None => continue,
        };
        // Header epoch token looks like "JD2451545.0".
        let jde: f64 = match toks[2].trim_start_matches("JD").parse() {
            Ok(v) => v,
            Err(_) => continue,
        };
        // The position line immediately follows: "x VAL au   y VAL au   z VAL au".
        if i + 1 >= lines.len() {
            continue;
        }
        let p: Vec<&str> = lines[i + 1].split_whitespace().collect();
        if p.len() < 8 || p[0] != "x" {
            continue; // not a position line (e.g. the x' velocity line)
        }
        let (rx, ry, rz): (f64, f64, f64) = match (p[1].parse(), p[4].parse(), p[7].parse()) {
            (Ok(a), Ok(b), Ok(c)) => (a, b, c),
            _ => continue,
        };

        let (gx, gy, gz) = provider
            .heliocentric_rectangular_j2000(body, jde)
            .expect("VSOP87A body must resolve to rectangular coordinates");

        let err = ((gx - rx).powi(2) + (gy - ry).powi(2) + (gz - rz).powi(2)).sqrt();
        let bi = body_idx(body);
        max_err[bi] = max_err[bi].max(err);
        count[bi] += 1;
        overall_max = overall_max.max(err);
        checked += 1;
    }

    println!(
        "\n==== XALEN vs OFFICIAL VSOP87 check file (heliocentric rectangular, ecliptic J2000) ===="
    );
    println!("records checked: {checked}");
    for k in 0..8 {
        if count[k] == 0 {
            continue;
        }
        println!(
            "  {:<8} n={:<3} max |Δr| = {:.3e} AU  ({:.3e} km)",
            NAMES[k],
            count[k],
            max_err[k],
            max_err[k] * AU_KM
        );
    }
    println!(
        "  OVERALL max |Δr| = {:.3e} AU  ({:.3e} km)",
        overall_max,
        overall_max * AU_KM
    );
    println!(
        "====================================================================================="
    );

    // Parsing must actually have happened (guards against a silently-empty pass).
    assert!(
        checked >= 40,
        "only {checked} VSOP87A records parsed — the check-file parser is broken"
    );
    // Measured precision vs the official check file across its full epoch span
    // (~1100–2000 CE): inner planets reproduce the source theory to ~1e-9 AU
    // (meters); the outer-planet residual peaks at ~2e-6 AU (~300 km on Uranus
    // ~900 yr from epoch, i.e. ~0.02"), negligible for the modern astrological era.
    // Per-tier gates catch a real regression that a single loose bound would miss.
    let inner_max = max_err[0].max(max_err[1]).max(max_err[2]).max(max_err[3]);
    let outer_max = max_err[4].max(max_err[5]).max(max_err[6]).max(max_err[7]);
    assert!(
        inner_max < 1e-8,
        "inner-planet VSOP87A deviation {inner_max:.3e} AU exceeds 1e-8 AU vs the official check file"
    );
    assert!(
        outer_max < 3e-6,
        "outer-planet VSOP87A deviation {outer_max:.3e} AU exceeds 3e-6 AU vs the official check file"
    );
}
