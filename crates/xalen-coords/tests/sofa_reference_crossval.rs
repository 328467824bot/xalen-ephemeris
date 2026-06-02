//! IAU SOFA reference cross-validation for the reduction-chain primitives.
//!
//! XALEN's apparent-place accuracy is normally proven end-to-end against JPL
//! DE440 and Swiss Ephemeris. This test validates the two reduction-chain
//! primitives — IAU 2000B nutation and IAU 2006 mean obliquity — DIRECTLY
//! against the IAU's own reference implementation, SOFA (Standards of
//! Fundamental Astronomy). The expected values are taken verbatim from the SOFA
//! validation suite `t_sofa_c.c` (rev. 2013-08-07), so this is a primary-source
//! check of the physics, not a transitive one.
//!
//! SOFA references (t_sofa_c.c):
//!   iauNut00b(2400000.5, 53736.0) -> dpsi = -0.9632552291148362783e-5,
//!                                    deps =  0.4063197106621159367e-4  (rad)
//!   iauObl06 (2400000.5, 54388.0) -> 0.4090749229387258204             (rad)
//!
//! Source: https://raw.githubusercontent.com/Starlink/sofa/master/src/t_sofa_c.c

use xalen_coords::{mean_obliquity, nutation_2000b};

const J2000: f64 = 2_451_545.0;
const ARCSEC_PER_RAD: f64 = 206_264.806_247_096_36;

/// SOFA passes a 2-part TT Julian Date; XALEN takes Julian centuries TT from J2000.
fn centuries_tt(jd_tt: f64) -> f64 {
    (jd_tt - J2000) / 36525.0
}

#[test]
fn nutation_2000b_matches_sofa() {
    let jd = 2_400_000.5 + 53_736.0;
    let n = nutation_2000b(centuries_tt(jd));

    let dpsi_err = (n.delta_psi - (-0.9632552291148362783e-5)).abs();
    let deps_err = (n.delta_epsilon - 0.4063197106621159367e-4).abs();

    println!(
        "\nNut00b @ TT JD {jd}: |Δ(Δψ)| = {dpsi_err:.3e} rad ({:.4e}\"), |Δ(Δε)| = {deps_err:.3e} rad ({:.4e}\")",
        dpsi_err * ARCSEC_PER_RAD,
        deps_err * ARCSEC_PER_RAD
    );

    // IAU 2000B vs the SOFA reference. A perfect match (incl. the fixed planetary
    // bias offsets) lands ~1e-12 rad; gate at 5e-9 rad (~1 mas) to report honestly
    // and still catch a real regression.
    assert!(
        dpsi_err < 5e-9,
        "Δψ off SOFA iauNut00b by {dpsi_err:.3e} rad"
    );
    assert!(
        deps_err < 5e-9,
        "Δε off SOFA iauNut00b by {deps_err:.3e} rad"
    );
}

#[test]
fn mean_obliquity_matches_sofa_obl06() {
    let jd = 2_400_000.5 + 54_388.0;
    let eps = mean_obliquity(centuries_tt(jd));
    let err = (eps - 0.4090749229387258204).abs();

    println!(
        "Obl06 @ TT JD {jd}: |Δε| = {err:.3e} rad ({:.4e}\")",
        err * ARCSEC_PER_RAD
    );

    assert!(
        err < 5e-9,
        "mean obliquity off SOFA iauObl06 by {err:.3e} rad"
    );
}
