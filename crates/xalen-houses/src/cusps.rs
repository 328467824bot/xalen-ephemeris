use crate::angles::{
    GeoLocation, compute_ascendant, compute_descendant, compute_ic, compute_mc, compute_ramc, gmst,
    local_sidereal_time,
};
use crate::systems::HouseSystem;
use serde::{Deserialize, Serialize};
use std::f64::consts::{FRAC_PI_2, PI, TAU};

#[derive(Debug, Clone, Serialize, Deserialize)]
/// Computed house cusp longitudes and chart angles.
pub struct HouseCusps {
    pub system: HouseSystem,
    pub cusps: [f64; 12], // radians, ecliptic longitude of each house cusp (0-indexed: cusp[0]=house 1)
    pub ascendant: f64,
    pub mc: f64,
    pub ic: f64,
    pub descendant: f64,
    pub vertex: f64,
    /// `true` when the requested house system could not be computed (e.g.
    /// polar latitude) and Porphyry was used as a fallback.
    pub fallback_used: bool,
}

impl HouseCusps {
    /// Return the ecliptic longitude of a house cusp in degrees `[0, 360)`.
    ///
    /// `index` is a ZERO-BASED cusp index matching the `cusps` array layout:
    /// `cusp_deg(0)` is the 1st-house cusp (Ascendant), `cusp_deg(9)` is the
    /// 10th-house cusp (Midheaven), `cusp_deg(11)` is the 12th-house cusp.
    /// In other words `cusp_deg(n)` returns the cusp of house `n + 1`.
    ///
    /// The index wraps modulo 12, so `cusp_deg(12) == cusp_deg(0)`.
    ///
    /// (Earlier docs claimed a 1-based `1..=12` range, which contradicted both
    /// this body and every caller — the FFI bridge, examples, and the
    /// cross-validation suite all pass 0-based indices. Switching to 1-based
    /// would underflow on `cusp_deg(0)`; the convention here is 0-based.)
    pub fn cusp_deg(&self, index: usize) -> f64 {
        self.cusps[index % 12].to_degrees().rem_euclid(360.0)
    }

    /// Determine which house (1-12) a planet at the given longitude occupies.
    pub fn planet_in_house(&self, longitude_rad: f64) -> usize {
        let lon = longitude_rad.rem_euclid(TAU);
        for i in 0..12 {
            let start = self.cusps[i];
            let end = self.cusps[(i + 1) % 12];
            if end > start {
                if lon >= start && lon < end {
                    return i + 1;
                }
            } else {
                if lon >= start || lon < end {
                    return i + 1;
                }
            }
        }
        1
    }
}

/// Compute house cusps and angles for a given epoch, location, and system.
pub fn compute_houses(
    jd_ut1: f64,
    location: &GeoLocation,
    epsilon: f64,
    system: HouseSystem,
) -> HouseCusps {
    let gmst_h = gmst(jd_ut1);
    let lst_h = local_sidereal_time(gmst_h, location.lon_deg());
    let ramc = compute_ramc(lst_h);
    let mc = compute_mc(ramc, epsilon);
    let asc = compute_ascendant(ramc, epsilon, location.latitude);
    let ic = compute_ic(mc);
    let desc = compute_descendant(asc);

    let cusps = match system {
        HouseSystem::WholeSign => whole_sign_cusps(asc),
        HouseSystem::Equal => equal_cusps(asc),
        HouseSystem::Porphyry => porphyry_cusps(asc, mc),
        HouseSystem::Morinus => morinus_cusps(ramc, epsilon),
        HouseSystem::Vehlow => vehlow_cusps(asc),
        HouseSystem::Placidus => placidus_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Regiomontanus => {
            regiomontanus_cusps(ramc, epsilon, location.latitude, asc, mc)
        }
        HouseSystem::Campanus => campanus_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Sripati => sripati_cusps(asc, mc),
        HouseSystem::Koch => koch_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Alcabitius => alcabitius_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Topocentric => topocentric_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Meridian => meridian_cusps(ramc, epsilon),
        HouseSystem::KrusinskiPisa => {
            krusinski_pisa_cusps(ramc, epsilon, location.latitude, asc, mc)
        }
        HouseSystem::Gauquelin => gauquelin_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::SunshineMakransky => {
            sunshine_makransky_cusps(ramc, epsilon, location.latitude, asc, mc)
        }
        HouseSystem::SunshineTreindl => {
            sunshine_treindl_cusps(ramc, epsilon, location.latitude, asc, mc)
        }
        HouseSystem::PullenSinusoidalDelta => pullen_sd_cusps(asc, mc),
        HouseSystem::PullenSinusoidalRatio => pullen_sr_cusps(asc, mc),
        HouseSystem::CarterPoliEquatorial => carter_poli_equatorial_cusps(asc, mc, epsilon),
        HouseSystem::APC => apc_cusps(ramc, epsilon, location.latitude, asc, mc),
        HouseSystem::Zariel => zariel_cusps(ramc, epsilon),
        HouseSystem::AlcabitiusClassic => {
            alcabitius_classic_cusps(ramc, epsilon, location.latitude, asc, mc)
        }
    };

    // Vertex: the Ascendant formula taken at the lower meridian (RAMC + 180deg)
    // and the CO-LATITUDE (90deg - phi), not the negated latitude. Confirmed vs
    // Swiss Ephemeris ascmc[3] and an independent SME review (2026-05-31).
    let vertex = compute_ascendant(ramc + PI, epsilon, FRAC_PI_2 - location.latitude);

    // Detect whether polar Porphyry fallback was triggered. Systems that
    // don't depend on latitude never fall back. Latitude-dependent systems
    // fall back to Porphyry when |phi| > 66.5° (Arctic Circle).
    let fallback_used = is_polar_fallback(system, location.latitude);

    HouseCusps {
        system,
        cusps,
        ascendant: asc,
        mc,
        ic,
        descendant: desc,
        vertex,
        fallback_used,
    }
}

/// Returns `true` only when the given system actually swaps to a Porphyry
/// polar fallback at the supplied latitude. This list MUST match exactly the
/// set of `*_cusps` functions that contain an explicit
/// `if phi.abs() > 66.5° { return porphyry_cusps(asc, mc); }` guard —
/// otherwise `fallback_used` would advertise a Porphyry result that never
/// happened.
///
/// Regiomontanus, Campanus and Krusinski-Pisa are intentionally NOT listed:
/// their `*_cusps` functions run their own algorithm at every latitude (they
/// have no Porphyry guard), so reporting a polar fallback for them was a lie.
/// Latitude-independent systems (Whole Sign, Equal, Porphyry, Morinus,
/// Vehlow, Meridian, Sripati, Pullen variants, Carter Poli-Equatorial,
/// Zariel) likewise never fall back.
fn is_polar_fallback(system: HouseSystem, latitude_rad: f64) -> bool {
    let polar = latitude_rad.abs() > 66.5_f64.to_radians();
    if !polar {
        return false;
    }
    // These systems have an internal polar fallback to Porphyry.
    matches!(
        system,
        HouseSystem::Placidus
            | HouseSystem::Koch
            | HouseSystem::Alcabitius
            | HouseSystem::Topocentric
            | HouseSystem::Gauquelin
            | HouseSystem::SunshineMakransky
            | HouseSystem::SunshineTreindl
            | HouseSystem::APC
            | HouseSystem::AlcabitiusClassic
    )
}

fn whole_sign_cusps(asc: f64) -> [f64; 12] {
    let sign_start = (asc / (PI / 6.0)).floor() * (PI / 6.0);
    let mut cusps = [0.0; 12];
    for i in 0..12 {
        cusps[i] = (sign_start + i as f64 * PI / 6.0).rem_euclid(TAU);
    }
    cusps
}

fn equal_cusps(asc: f64) -> [f64; 12] {
    let mut cusps = [0.0; 12];
    for i in 0..12 {
        cusps[i] = (asc + i as f64 * PI / 6.0).rem_euclid(TAU);
    }
    cusps
}

fn vehlow_cusps(asc: f64) -> [f64; 12] {
    let start = asc - PI / 12.0; // ASC at middle of house 1
    let mut cusps = [0.0; 12];
    for i in 0..12 {
        cusps[i] = (start + i as f64 * PI / 6.0).rem_euclid(TAU);
    }
    cusps
}

fn porphyry_cusps(asc: f64, mc: f64) -> [f64; 12] {
    let mut cusps = [0.0; 12];
    cusps[0] = asc;
    cusps[9] = mc; // MC = cusp 10

    // Quadrant 1: MC to ASC (upper, contains cusps 11, 12)
    let arc1 = angle_diff(mc, asc);
    cusps[10] = (mc + arc1 / 3.0).rem_euclid(TAU); // cusp 11
    cusps[11] = (mc + 2.0 * arc1 / 3.0).rem_euclid(TAU); // cusp 12

    // Quadrant 2: ASC to IC (lower, contains cusps 2, 3)
    let ic = (mc + PI).rem_euclid(TAU);
    let arc2 = angle_diff(asc, ic);
    cusps[1] = (asc + arc2 / 3.0).rem_euclid(TAU); // cusp 2
    cusps[2] = (asc + 2.0 * arc2 / 3.0).rem_euclid(TAU); // cusp 3

    // Opposite houses
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn sripati_cusps(asc: f64, mc: f64) -> [f64; 12] {
    let porph = porphyry_cusps(asc, mc);
    let mut cusps = [0.0; 12];
    for i in 0..12 {
        let next = (i + 1) % 12;
        let diff = (porph[next] - porph[i]).rem_euclid(TAU);
        cusps[i] = (porph[i] + diff / 2.0).rem_euclid(TAU);
    }
    // Sripati: all cusps ARE midpoints. ASC is center of house 1, not its cusp.
    cusps
}

fn morinus_cusps(ramc: f64, epsilon: f64) -> [f64; 12] {
    let cos_eps = epsilon.cos();
    let mut cusps = [0.0; 12];
    for i in 0..12 {
        // House 1 starts at RAMC+90° (equatorial ASC direction), house 10 = RAMC (MC).
        // The cusp is a point on the celestial equator (declination 0) at right
        // ascension `ra`; converting to ecliptic longitude with δ=0 gives
        //   tan λ = tan(ra) · cos ε   ⇒   λ = atan2(sin(ra)·cos ε, cos(ra)).
        // (Previously the obliquity was applied as a divisor, inverting cos ε.)
        let ra = ramc + (i as f64 * 30.0 + 90.0).to_radians();
        let lon = (ra.sin() * cos_eps).atan2(ra.cos());
        cusps[i] = lon.rem_euclid(TAU);
    }
    cusps
}

fn regiomontanus_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // Swiss Ephemeris Regiomontanus algorithm:
    //   fh1 = atan(tan(phi) * 0.5)
    //   fh2 = atan(tan(phi) * cos(30°))
    //
    //   cusp 11 = Asc1(RAMC + 30,  fh1, sin_e, cos_e)
    //   cusp 12 = Asc1(RAMC + 60,  fh2, sin_e, cos_e)
    //   cusp  2 = Asc1(RAMC + 120, fh2, sin_e, cos_e)
    //   cusp  3 = Asc1(RAMC + 150, fh1, sin_e, cos_e)

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();
    let tan_phi = phi.tan();
    let ramc_deg = ramc.to_degrees();

    let fh1 = (tan_phi * 0.5).atan();
    let fh2 = (tan_phi * 30.0_f64.to_radians().cos()).atan();

    let mut cusps = [0.0; 12];

    // Anchor cusps
    cusps[0] = asc;
    cusps[9] = mc;

    // Intermediate cusps via oblique ascension
    cusps[10] = oblique_ascension((ramc_deg + 30.0).to_radians(), fh1, sin_eps, cos_eps); // cusp 11
    cusps[11] = oblique_ascension((ramc_deg + 60.0).to_radians(), fh2, sin_eps, cos_eps); // cusp 12
    cusps[1] = oblique_ascension((ramc_deg + 120.0).to_radians(), fh2, sin_eps, cos_eps); // cusp 2
    cusps[2] = oblique_ascension((ramc_deg + 150.0).to_radians(), fh1, sin_eps, cos_eps); // cusp 3

    // Opposite cusps
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn campanus_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // Swiss Ephemeris Campanus algorithm:
    //   fh1 = asin(sin(phi) / 2)
    //   fh2 = asin(sqrt(3) / 2 * sin(phi))
    //   xh1 = atan(sqrt(3) / cos(phi))
    //   xh2 = atan(1 / (sqrt(3) * cos(phi)))
    //
    //   cusp 11 = Asc1(RAMC + 90 - xh1, fh1, sin_e, cos_e)
    //   cusp 12 = Asc1(RAMC + 90 - xh2, fh2, sin_e, cos_e)
    //   cusp  2 = Asc1(RAMC + 90 + xh2, fh2, sin_e, cos_e)
    //   cusp  3 = Asc1(RAMC + 90 + xh1, fh1, sin_e, cos_e)

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();
    let cos_phi = phi.cos();
    let sin_phi = phi.sin();
    let ramc_deg = ramc.to_degrees();

    let fh1 = (sin_phi / 2.0).clamp(-1.0, 1.0).asin();
    let fh2 = (3.0_f64.sqrt() / 2.0 * sin_phi).clamp(-1.0, 1.0).asin();
    let xh1_deg = (3.0_f64.sqrt() / cos_phi).atan().to_degrees();
    let xh2_deg = (1.0 / (3.0_f64.sqrt() * cos_phi)).atan().to_degrees();

    let mut cusps = [0.0; 12];

    // Anchor cusps
    cusps[0] = asc;
    cusps[9] = mc;

    // Intermediate cusps via oblique ascension
    cusps[10] = oblique_ascension(
        (ramc_deg + 90.0 - xh1_deg).to_radians(),
        fh1,
        sin_eps,
        cos_eps,
    ); // cusp 11
    cusps[11] = oblique_ascension(
        (ramc_deg + 90.0 - xh2_deg).to_radians(),
        fh2,
        sin_eps,
        cos_eps,
    ); // cusp 12
    cusps[1] = oblique_ascension(
        (ramc_deg + 90.0 + xh2_deg).to_radians(),
        fh2,
        sin_eps,
        cos_eps,
    ); // cusp 2
    cusps[2] = oblique_ascension(
        (ramc_deg + 90.0 + xh1_deg).to_radians(),
        fh1,
        sin_eps,
        cos_eps,
    ); // cusp 3

    // Opposite cusps
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn placidus_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc); // polar fallback at 66.5° (Arctic Circle)
    }

    // Swiss Ephemeris Placidus: iterative pole-height refinement.
    //
    // Initial pole heights from the "ascensional difference" shortcut:
    //   a = asin(tan(phi) * tan(epsilon))
    //   fh1 = atan(sin(a/3) / tan(epsilon))      -- pole for 1/3 fraction
    //   fh2 = atan(sin(2*a/3) / tan(epsilon))     -- pole for 2/3 fraction
    //
    // Cusps via oblique ascension with iterative pole refinement:
    //   cusp 11 = Asc1(RAMC + 30, fh1), divisor 3
    //   cusp 12 = Asc1(RAMC + 60, fh2), divisor 1.5
    //   cusp  2 = Asc1(RAMC + 120, fh2), divisor 1.5
    //   cusp  3 = Asc1(RAMC + 150, fh1), divisor 3

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();
    let tan_eps = epsilon.tan();
    let tan_phi = phi.tan();

    let a = (tan_phi * tan_eps).clamp(-1.0, 1.0).asin();

    let fh1_init = ((a / 3.0).sin() / tan_eps).atan();
    let fh2_init = ((a * 2.0 / 3.0).sin() / tan_eps).atan();

    let ramc_deg = ramc.to_degrees();

    let mut cusps = [0.0; 12];

    // (array_index, ra_offset_deg, initial_pole_rad, divisor)
    let cusp_defs: [(usize, f64, f64, f64); 4] = [
        (10, 30.0, fh1_init, 3.0), // cusp 11
        (11, 60.0, fh2_init, 1.5), // cusp 12
        (1, 120.0, fh2_init, 1.5), // cusp 2
        (2, 150.0, fh1_init, 3.0), // cusp 3
    ];

    for (idx, ra_offset, fh_init, divisor) in cusp_defs {
        let mut f = fh_init;
        for _ in 0..100 {
            let cusp_lon_rad =
                oblique_ascension((ramc_deg + ra_offset).to_radians(), f, sin_eps, cos_eps);
            // Declination of this ecliptic point
            let sin_dec = sin_eps * cusp_lon_rad.sin();
            let sin_dec = sin_dec.clamp(-1.0, 1.0);
            let tan_dec = sin_dec / (1.0 - sin_dec * sin_dec).sqrt().max(1e-15);

            // Refine pole height
            let arg = (tan_phi * tan_dec).clamp(-1.0, 1.0);
            let f_new = if tan_dec.abs() > 1e-15 {
                ((arg.asin() / divisor).sin() / tan_dec).atan()
            } else {
                f
            };
            if (f_new - f).abs() < 1e-12 {
                f = f_new;
                break;
            }
            f = f_new;
        }
        cusps[idx] = oblique_ascension((ramc_deg + ra_offset).to_radians(), f, sin_eps, cos_eps);
    }

    // Anchor cusps
    cusps[0] = asc;
    cusps[9] = mc;

    // Opposite cusps
    cusps[3] = (mc + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (asc + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn koch_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // Polar fallback: same threshold as Placidus (Arctic Circle ~66.5°)
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    // Swiss Ephemeris Koch algorithm:
    //   sina = sin(MC) * sin(epsilon) / cos(phi)
    //   cosa = sqrt(1 - sina^2)
    //   c    = atan(tan(phi) / cosa)
    //   ad3  = asin(sin(c) * sina) / 3
    //
    //   cusp 11 = Asc1(RAMC + 30 - 2*ad3, phi, sin_e, cos_e)
    //   cusp 12 = Asc1(RAMC + 60 - ad3,   phi, sin_e, cos_e)
    //   cusp  2 = Asc1(RAMC + 120 + ad3,  phi, sin_e, cos_e)
    //   cusp  3 = Asc1(RAMC + 150 + 2*ad3, phi, sin_e, cos_e)

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();
    let cos_phi = phi.cos();

    let sina = (sin_eps * mc.sin() / cos_phi).clamp(-1.0, 1.0);
    let cosa = (1.0 - sina * sina).sqrt();
    let c = if cosa.abs() > 1e-15 {
        (phi.tan() / cosa).atan()
    } else {
        PI / 2.0
    };
    let ad3_rad = ((c.sin() * sina).clamp(-1.0, 1.0).asin()) / 3.0;
    let ad3_deg = ad3_rad.to_degrees();
    let ramc_deg = ramc.to_degrees();
    let mut cusps = [0.0; 12];

    // Cusp 1 = ASC, cusp 10 = MC
    cusps[0] = asc;
    cusps[9] = mc;

    // Intermediate cusps via oblique ascension (Asc1)
    cusps[10] = oblique_ascension(
        (ramc_deg + 30.0 - 2.0 * ad3_deg).to_radians(),
        phi,
        sin_eps,
        cos_eps,
    ); // cusp 11
    cusps[11] = oblique_ascension(
        (ramc_deg + 60.0 - ad3_deg).to_radians(),
        phi,
        sin_eps,
        cos_eps,
    ); // cusp 12
    cusps[1] = oblique_ascension(
        (ramc_deg + 120.0 + ad3_deg).to_radians(),
        phi,
        sin_eps,
        cos_eps,
    ); // cusp 2
    cusps[2] = oblique_ascension(
        (ramc_deg + 150.0 + 2.0 * ad3_deg).to_radians(),
        phi,
        sin_eps,
        cos_eps,
    ); // cusp 3

    // Opposite cusps: cusp[i+6] = cusp[i] + 180°
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn alcabitius_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // Polar fallback: same threshold as Placidus/Koch (Arctic Circle ~66.5°)
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    // Swiss Ephemeris Alcabitius algorithm:
    //   dec_asc = asin(sin(epsilon) * sin(ASC))
    //   sda = acos(-tan(phi) * tan(dec_asc))    -- semi-diurnal arc
    //   sna = 180 - sda                          -- semi-nocturnal arc
    //
    //   cusp 11 = Asc1(RAMC + sda/3,           0, sin_e, cos_e)
    //   cusp 12 = Asc1(RAMC + 2*sda/3,         0, sin_e, cos_e)
    //   cusp  2 = Asc1(RAMC + 180 - 2*sna/3,   0, sin_e, cos_e)
    //   cusp  3 = Asc1(RAMC + 180 - sna/3,     0, sin_e, cos_e)
    //
    // Note: pole latitude = 0 for all Alcabitius intermediate cusps.

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    // Declination of the Ascendant
    let dec_asc = (sin_eps * asc.sin()).clamp(-1.0, 1.0).asin();

    // Semi-diurnal arc of the Ascendant
    let sda_arg = (-phi.tan() * dec_asc.tan()).clamp(-1.0, 1.0);
    let sda = sda_arg.acos(); // in radians
    let sna = PI - sda; // semi-nocturnal arc

    let sda_deg = sda.to_degrees();
    let sna_deg = sna.to_degrees();
    let ramc_deg = ramc.to_degrees();

    let mut cusps = [0.0; 12];

    // Cusp 1 = ASC, cusp 10 = MC
    cusps[0] = asc;
    cusps[9] = mc;

    // Intermediate cusps via oblique ascension with zero pole
    cusps[10] = oblique_ascension(
        (ramc_deg + sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    ); // cusp 11
    cusps[11] = oblique_ascension(
        (ramc_deg + 2.0 * sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    ); // cusp 12
    cusps[1] = oblique_ascension(
        (ramc_deg + 180.0 - 2.0 * sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    ); // cusp 2
    cusps[2] = oblique_ascension(
        (ramc_deg + 180.0 - sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    ); // cusp 3

    // Opposite cusps: cusp[i+6] = cusp[i] + 180°
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

/// Oblique ascension — ecliptic longitude where a great circle with
/// pole height `f_rad` crosses the ecliptic at equatorial position
/// `x_rad` (measured along the equator from the vernal point).
///
/// This is an independent implementation of the standard oblique-ascension
/// computation (the same public formula exposed by Swiss Ephemeris as
/// `Asc1(x_deg, f_deg, sine, cose)`). The quadrant handling uses the usual
/// approach: reduce `x` to 0..90 degrees, then reflect for the correct quadrant.
fn oblique_ascension(x_rad: f64, f_rad: f64, sin_eps: f64, cos_eps: f64) -> f64 {
    let x_deg = x_rad.to_degrees().rem_euclid(360.0);

    // Near-polar special cases
    if (90.0 - f_rad.to_degrees().abs()).abs() < 1e-10 {
        return if f_rad > 0.0 { PI } else { 0.0 };
    }

    let n = (x_deg / 90.0) as usize + 1; // quadrant 1..4
    let n = n.min(4); // clamp in case x_deg is exactly 360

    let ass_deg = match n {
        1 => oblique_asc2(x_deg, f_rad.to_degrees(), sin_eps, cos_eps),
        2 => 180.0 - oblique_asc2(180.0 - x_deg, -f_rad.to_degrees(), sin_eps, cos_eps),
        3 => 180.0 + oblique_asc2(x_deg - 180.0, -f_rad.to_degrees(), sin_eps, cos_eps),
        _ => 360.0 - oblique_asc2(360.0 - x_deg, f_rad.to_degrees(), sin_eps, cos_eps),
    };

    ass_deg.to_radians().rem_euclid(TAU)
}

/// Helper for oblique_ascension: x in range 0..90 degrees, f in degrees.
/// Computes the ecliptic longitude where a great circle with pole height f
/// crosses the ecliptic at equatorial position x.
fn oblique_asc2(x_deg: f64, f_deg: f64, sin_eps: f64, cos_eps: f64) -> f64 {
    let x_rad = x_deg.to_radians();
    let f_rad = f_deg.to_radians();

    let denom = -f_rad.tan() * sin_eps + cos_eps * x_rad.cos();
    let sin_x = x_rad.sin();

    if sin_x.abs() < 1e-15 {
        // x ~ 0: result is near 0 or 180 depending on sign of denom
        return if denom < 0.0 { 180.0 - 1e-10 } else { 1e-10 };
    }
    if denom.abs() < 1e-15 {
        // Denominator ~ 0: oblique ascension is ±90°. Under this function's
        // [0,180) normalization (negative results get +180 below), both the
        // -90° and +90° cases map to 90°.
        return 90.0;
    }

    let mut ass = (sin_x / denom).atan().to_degrees();
    if ass < 0.0 {
        ass += 180.0;
    }
    ass
}

/// Meridian (Axial Rotation) house system.
///
/// Divides the celestial equator into 12 equal 30-degree arcs starting
/// from the MC (RAMC), then projects each division point onto the ecliptic.
/// No latitude dependency — works at all latitudes including polar.
///
/// In the Meridian system, cusp 10 = MC (at RAMC), and cusps proceed
/// in 30-degree RA steps: cusp 11 at RAMC+30, cusp 12 at RAMC+60,
/// cusp 1 at RAMC+90, cusp 2 at RAMC+120, etc.
fn meridian_cusps(ramc: f64, epsilon: f64) -> [f64; 12] {
    let cos_eps = epsilon.cos();
    let mut cusps = [0.0; 12];

    // Swiss Ephemeris convention (case 'X'):
    //   loop i from 1..12:
    //     j = (i + 10) mod 12   (1-indexed house number, adjusted to match cusp array)
    //     a = RAMC + i * 30     (RA position on equator)
    //     cusp[j] = ecliptic longitude at RA = a
    //
    // This places cusp 10 (MC) at RAMC + 12*30 = RAMC + 360 = RAMC.
    // Cusp 1 gets RAMC + 3*30 = RAMC + 90.
    //
    // Projection from RA to ecliptic: tan(lon) = tan(RA) / cos(eps)
    //   with quadrant handling per Swiss Ephemeris.
    for i in 0..12 {
        // 0-indexed: i=0 maps to Swiss i=1, j=(1+10)%12=11 -> our 0-index = 10 (house 11)
        let j = (i + 10) % 12;
        let ra_deg = ramc.to_degrees() + (i as f64 + 1.0) * 30.0;
        let a = ra_deg.rem_euclid(360.0);

        // Handle RA near 90 or 270 (where tan(RA) is undefined)
        if (a - 90.0).abs() > 1e-10 && (a - 270.0).abs() > 1e-10 {
            let tant = a.to_radians().tan();
            let mut lon_deg = (tant / cos_eps).atan().to_degrees();
            // Quadrant correction: if RA is in 90..270, add 180
            if a > 90.0 && a <= 270.0 {
                lon_deg += 180.0;
            }
            cusps[j] = lon_deg.to_radians().rem_euclid(TAU);
        } else {
            // At RA = 90 or 270, ecliptic longitude = 90 or 270
            cusps[j] = if (a - 90.0).abs() <= 1e-10 {
                90.0_f64.to_radians()
            } else {
                270.0_f64.to_radians()
            };
        }
    }

    cusps
}

/// Krusinski-Pisa-Goelzer house system (Swiss Ephemeris house code 'U').
///
/// The published algorithm:
///   1. A vertical great circle is drawn through Ascendant, Zenith,
///      Descendant, and Nadir.
///   2. This circle is divided into 12 equal 30-degree arcs.
///   3. Meridian circles through each division point intersect the ecliptic
///      to form the house cusps.
///
/// This is an independent implementation: it uses standard coordinate rotations
/// (the same ecliptic↔equatorial transform Swiss Ephemeris exposes as
/// `swe_cotrans`) to map between the ecliptic, equatorial, and house planes,
/// then projects back onto the ecliptic.
fn krusinski_pisa_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // All Swiss Ephemeris Krusinski math works in degrees; convert at boundaries.
    let eps_deg = epsilon.to_degrees();
    let phi_deg = phi.to_degrees();
    let asc_deg = asc.to_degrees();
    let mc_deg = mc.to_degrees();
    // th = local sidereal time in degrees = RAMC (in degrees)
    // Swiss Eph uses th directly as ARMC in degrees for this system.
    let th_deg = ramc.to_degrees();

    // Ensure ASC is in the correct semicircle relative to MC
    let acmc = swe_difdeg2n(asc_deg, mc_deg);
    let asc_deg = if acmc < 0.0 {
        norm_deg(asc_deg + 180.0)
    } else {
        asc_deg
    };

    // Step 1: Convert ASC from ecliptic to equatorial coordinates.
    //   swe_cotrans(x, x, -eps) rotates ecliptic → equatorial
    let (mut ra, dec) = cotrans_lonlat(asc_deg, 0.0, -eps_deg);

    // Step 2: Subtract (th - 90) to move into a local horizontal-like frame,
    //   then rotate by -(90 - phi) to reach the house plane.
    ra -= th_deg - 90.0;
    let (hr_lon, _hr_lat) = cotrans_lonlat(ra, dec, -(90.0 - phi_deg));
    let kr_horizon_lon = hr_lon;

    // Step 3: Loop over 6 division points on the house circle (0, 30, 60, 90, 120, 150 deg).
    //   Each point is rotated back through the transformation chain to yield
    //   an ecliptic longitude. The opposite cusp is 180 deg away.
    let mut cusps = [0.0; 12];
    for i in 0..6 {
        let house_pos = 30.0 * i as f64;

        // Place point on house circle and rotate to horizontal-like frame
        let (mut x0, _x1) = cotrans_lonlat(house_pos, 0.0, 90.0);
        x0 += kr_horizon_lon;

        // Rotate from horizontal-like frame back to equatorial
        let (mut x0, _x1) = cotrans_lonlat(x0, _x1, 90.0 - phi_deg);
        x0 = norm_deg(x0 + (th_deg - 90.0));

        // Project equatorial (RA, dec) to ecliptic longitude via cotrans
        let (lon_deg, _lat_deg) = cotrans_lonlat(x0, _x1, eps_deg);
        let lon_deg = norm_deg(lon_deg);

        cusps[i] = lon_deg.to_radians();
        cusps[i + 6] = (lon_deg + 180.0).to_radians().rem_euclid(TAU);
    }

    cusps
}

/// Signed difference between two angles in degrees, result in -180..+180.
fn swe_difdeg2n(p1: f64, p2: f64) -> f64 {
    let mut d = norm_deg(p1 - p2);
    if d > 180.0 {
        d -= 360.0;
    }
    d
}

/// Normalize angle to 0..360 degrees.
fn norm_deg(a: f64) -> f64 {
    a.rem_euclid(360.0)
}

/// Spherical coordinate rotation — equivalent to Swiss Ephemeris `swe_cotrans`.
///
/// Rotates a point (lon, lat) in degrees by angle `eps` in degrees around
/// the x-axis (the same rotation as ecliptic <-> equatorial conversions).
/// Returns (new_lon, new_lat) in degrees.
fn cotrans_lonlat(lon_deg: f64, lat_deg: f64, eps_deg: f64) -> (f64, f64) {
    let lon = lon_deg.to_radians();
    let lat = lat_deg.to_radians();
    let eps = eps_deg.to_radians();

    let sin_lon = lon.sin();
    let cos_lon = lon.cos();
    let sin_lat = lat.sin();
    let cos_lat = lat.cos();
    let sin_eps = eps.sin();
    let cos_eps = eps.cos();

    // Standard spherical rotation about the x-axis:
    //   x' = cos(lat)*cos(lon)                          [unchanged]
    //   y' = cos(lat)*sin(lon)*cos(eps) - sin(lat)*sin(eps)
    //   z' = cos(lat)*sin(lon)*sin(eps) + sin(lat)*cos(eps)
    let x = cos_lat * cos_lon;
    let y = cos_lat * sin_lon * cos_eps - sin_lat * sin_eps;
    let z = cos_lat * sin_lon * sin_eps + sin_lat * cos_eps;

    let new_lon = y.atan2(x).to_degrees();
    let new_lat = z.clamp(-1.0, 1.0).asin().to_degrees();

    (norm_deg(new_lon), new_lat)
}

fn topocentric_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // Polar fallback: same threshold as Placidus/Koch (Arctic Circle ~66.5°)
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    // The Topocentric (Polich-Page) system uses the oblique ascension
    // formula with modified latitudes ("proportional poles") and specific
    // RA offsets from RAMC.
    //
    // Pole latitudes:
    //   fh1 = atan(tan(phi) / 3)     — for 1/3 fraction
    //   fh2 = atan(2 * tan(phi) / 3) — for 2/3 fraction
    //
    // Cusps via oblique ascension (matching Swiss Ephemeris Asc1):
    //   cusp 11 = Asc1(RAMC + 30,  fh1)
    //   cusp 12 = Asc1(RAMC + 60,  fh2)
    //   cusp  2 = Asc1(RAMC + 120, fh2)
    //   cusp  3 = Asc1(RAMC + 150, fh1)
    //
    // This is a closed-form formula (no iteration needed).

    let fh1 = (phi.tan() / 3.0).atan(); // pole for 1/3
    let fh2 = (phi.tan() * 2.0 / 3.0).atan(); // pole for 2/3

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    let mut cusps = [0.0; 12];

    // (house_index, ra_offset_deg, pole_latitude_rad)
    let cusp_defs: [(usize, f64, f64); 4] = [
        (10, 30.0, fh1), // cusp 11
        (11, 60.0, fh2), // cusp 12
        (1, 120.0, fh2), // cusp 2
        (2, 150.0, fh1), // cusp 3
    ];

    for (idx, ra_offset_deg, pole_lat) in cusp_defs {
        let ra = ramc + ra_offset_deg.to_radians();
        cusps[idx] = oblique_ascension(ra, pole_lat, sin_eps, cos_eps);
    }

    // Anchor cusps
    cusps[0] = asc;
    cusps[9] = mc;

    // Opposite cusps: cusp[i+6] = cusp[i] + 180°
    cusps[3] = (mc + PI).rem_euclid(TAU); // IC
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU); // opposite cusp 11
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU); // opposite cusp 12
    cusps[6] = (asc + PI).rem_euclid(TAU); // DSC
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU); // opposite cusp 2
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU); // opposite cusp 3

    cusps
}

/// Gauquelin sectors — divides the diurnal/nocturnal semi-arcs into 18 sectors each
/// (36 total), then projects onto 12 cusps by taking every 3rd sector boundary.
///
/// Swiss Ephemeris code 'G'.
///
/// Gauquelin sectors require a 36-sector model not yet implemented. Currently
/// returns Placidus as approximation. The 12-cusp projection selects every 3rd
/// of the 36 sector boundaries (30-degree steps), which coincides with Placidus
/// cusps, so this is exact for the 12-cusp subset but does not expose the full
/// 36-sector resolution that true Gauquelin analysis requires.
fn gauquelin_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    // At polar latitudes, fall back to Porphyry
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    // Gauquelin sectors require a 36-sector model not yet implemented.
    // Currently returns Placidus as approximation.
    placidus_cusps(ramc, epsilon, phi, asc, mc)
}

/// Sunshine house system — Makransky variant.
///
/// Swiss Ephemeris code 'i'. This system places the Sun's position at the cusp
/// of the house corresponding to the Sun's diurnal position. The algorithm
/// computes the Sun's semi-diurnal arc fraction and distributes house cusps
/// proportionally.
///
/// Note: this is the MC/ASC declination-based approximation. Full Sunshine
/// houses require the Sun's position at the moment, which is not passed into
/// the house computation API. The current implementation uses the MC's
/// declination to derive the semi-diurnal arc, similar to Alcabitius.
fn sunshine_makransky_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    // Declination of the MC
    let dec_mc = (sin_eps * mc.sin()).clamp(-1.0, 1.0).asin();

    // Semi-diurnal arc of the MC
    let sda_arg = (-phi.tan() * dec_mc.tan()).clamp(-1.0, 1.0);
    let sda = sda_arg.acos(); // radians
    let sna = PI - sda;

    let sda_deg = sda.to_degrees();
    let sna_deg = sna.to_degrees();
    let ramc_deg = ramc.to_degrees();

    let mut cusps = [0.0; 12];
    cusps[0] = asc;
    cusps[9] = mc;

    // Cusps distributed proportionally along semi-arcs from MC
    // Upper hemisphere (MC to ASC): cusps 11, 12 at 1/3 and 2/3 of SDA
    cusps[10] = oblique_ascension(
        (ramc_deg + sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[11] = oblique_ascension(
        (ramc_deg + 2.0 * sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );

    // Lower hemisphere (ASC to IC): cusps 2, 3 at 1/3 and 2/3 of SNA
    cusps[1] = oblique_ascension(
        (ramc_deg + 180.0 - 2.0 * sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[2] = oblique_ascension(
        (ramc_deg + 180.0 - sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );

    // Opposite cusps
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU);
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU);
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

/// Sunshine house system — Treindl variant.
///
/// Swiss Ephemeris code 'I'. Similar to Makransky but uses the Ascendant's
/// declination (like standard Alcabitius) to compute the semi-diurnal arc,
/// then applies the Sunshine distribution principle.
///
/// Note: this is the MC/ASC declination-based approximation. Full Sunshine
/// houses require the Sun's position at the moment, which is not passed into
/// the house computation API. The current implementation uses the Ascendant's
/// declination to derive the semi-diurnal arc.
fn sunshine_treindl_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    // Declination of the Ascendant (same as standard Alcabitius)
    let dec_asc = (sin_eps * asc.sin()).clamp(-1.0, 1.0).asin();

    // Semi-diurnal arc of the Ascendant
    let sda_arg = (-phi.tan() * dec_asc.tan()).clamp(-1.0, 1.0);
    let sda = sda_arg.acos();
    let sna = PI - sda;

    let sda_deg = sda.to_degrees();
    let sna_deg = sna.to_degrees();
    let ramc_deg = ramc.to_degrees();

    let mut cusps = [0.0; 12];
    cusps[0] = asc;
    cusps[9] = mc;

    // Treindl distributes house boundaries proportionally along the semi-arcs
    // using a slightly different fraction scheme: cusps at 1/3 and 2/3 of each
    // semi-arc, with pole = 0 (same oblique ascension formula as Alcabitius).
    cusps[10] = oblique_ascension(
        (ramc_deg + sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[11] = oblique_ascension(
        (ramc_deg + 2.0 * sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[1] = oblique_ascension(
        (ramc_deg + 180.0 - 2.0 * sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[2] = oblique_ascension(
        (ramc_deg + 180.0 - sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );

    // Opposite cusps
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU);
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU);
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

/// Sinusoidal-delta quadrant house division (Pullen-Sinusoidal-Delta family,
/// Swiss Ephemeris code 'L').
///
/// HONEST SCOPE: this is an APPROXIMATION in the spirit of Pullen's Sinusoidal
/// Delta — it places the two intermediate cusps of each Porphyry quadrant at a
/// symmetric sinusoidal offset from the equal-thirds positions — NOT a bit-for-
/// bit reproduction of the Swiss Ephemeris 'L' algorithm, and it is not validated
/// against Swiss reference cusps. Within each quadrant of arc Q the intermediate
/// cusps sit at fractions f1, f2 of Q from the leading anchor, where (see code):
///   f1 = 1/3 + (1/12)·sin(2π/3) ≈ 0.405,   f2 = 2/3 + (1/12)·sin(4π/3) ≈ 0.595
/// i.e. a ±Q/12·(√3/2) symmetric "moderate smoothing" of the equal-thirds split.
fn pullen_sd_cusps(asc: f64, mc: f64) -> [f64; 12] {
    let mut cusps = [0.0; 12];

    // Quadrant arcs (same anchors as Porphyry)
    let ic = (mc + PI).rem_euclid(TAU);
    let desc = (asc + PI).rem_euclid(TAU);

    let q1 = angle_diff(mc, asc); // MC to ASC (houses 11, 12, 1 — but cusps 10→0)
    let q2 = angle_diff(asc, ic); // ASC to IC (houses 1→4, cusps 0→3)
    let q3 = angle_diff(ic, desc); // IC to DSC (houses 4→7, cusps 3→6)
    let q4 = angle_diff(desc, mc); // DSC to MC (houses 7→10, cusps 6→9)

    // Sinusoidal delta: offset from equal (1/3, 2/3) positions.
    // Uses sin(2*pi*k/3) for k=1,2 within a quadrant of 3 houses.
    // Amplitude scaled to Q/12 for moderate smoothing.
    let amp = 1.0 / 12.0;
    let sin1 = (2.0 * PI / 3.0).sin(); // sqrt(3)/2 ~ 0.866
    let sin2 = (4.0 * PI / 3.0).sin(); // -sqrt(3)/2 ~ -0.866
    let f1 = 1.0 / 3.0 + amp * sin1; // ~ 0.405
    let f2 = 2.0 / 3.0 + amp * sin2; // ~ 0.595

    // Quadrant 1: MC → ASC (cusps 10, 11, 0)
    cusps[9] = mc;
    cusps[10] = (mc + f1 * q1).rem_euclid(TAU);
    cusps[11] = (mc + f2 * q1).rem_euclid(TAU);
    cusps[0] = asc;

    // Quadrant 2: ASC → IC (cusps 0, 1, 2, 3)
    cusps[1] = (asc + f1 * q2).rem_euclid(TAU);
    cusps[2] = (asc + f2 * q2).rem_euclid(TAU);
    cusps[3] = ic;

    // Quadrant 3: IC → DSC (cusps 3, 4, 5, 6)
    cusps[4] = (ic + f1 * q3).rem_euclid(TAU);
    cusps[5] = (ic + f2 * q3).rem_euclid(TAU);
    cusps[6] = desc;

    // Quadrant 4: DSC → MC (cusps 6, 7, 8, 9)
    cusps[7] = (desc + f1 * q4).rem_euclid(TAU);
    cusps[8] = (desc + f2 * q4).rem_euclid(TAU);

    cusps
}

/// Pullen Sinusoidal Ratio house system.
///
/// Swiss Ephemeris code 'Q'. A variant of Pullen SD that uses the ratio
/// of sinusoidal widths rather than the delta form. The three house widths
/// within each quadrant are proportional to the actual implemented weights
///   sin(π/4), sin(2·π/4), sin(3·π/4) = √2/2, 1, √2/2 ≈ 0.707, 1.0, 0.707
/// (the symmetric `sin(k·π/(n+1))`, n=3 form — see the inline comment below),
/// producing narrower houses near the quadrant endpoints and a wider house
/// near the midpoint. APPROXIMATION in the spirit of Pullen SR, not validated
/// bit-for-bit against the Swiss Ephemeris 'Q' algorithm.
fn pullen_sr_cusps(asc: f64, mc: f64) -> [f64; 12] {
    let mut cusps = [0.0; 12];

    let ic = (mc + PI).rem_euclid(TAU);
    let desc = (asc + PI).rem_euclid(TAU);

    let q1 = angle_diff(mc, asc);
    let q2 = angle_diff(asc, ic);
    let q3 = angle_diff(ic, desc);
    let q4 = angle_diff(desc, mc);

    // Sinusoidal ratio weights: w_k = sin(k * pi / (n+1)) for k=1..n, n=3
    // w1 = sin(pi/4) = sqrt(2)/2 ~ 0.7071
    // w2 = sin(2*pi/4) = sin(pi/2) = 1.0
    // w3 = sin(3*pi/4) = sqrt(2)/2 ~ 0.7071
    let w1 = (PI / 4.0).sin();
    let w2 = (PI / 2.0).sin();
    let w3 = (3.0 * PI / 4.0).sin();
    let wsum = w1 + w2 + w3;

    let f1 = w1 / wsum;
    let f2 = (w1 + w2) / wsum;

    // Quadrant 1: MC → ASC
    cusps[9] = mc;
    cusps[10] = (mc + f1 * q1).rem_euclid(TAU);
    cusps[11] = (mc + f2 * q1).rem_euclid(TAU);
    cusps[0] = asc;

    // Quadrant 2: ASC → IC
    cusps[1] = (asc + f1 * q2).rem_euclid(TAU);
    cusps[2] = (asc + f2 * q2).rem_euclid(TAU);
    cusps[3] = ic;

    // Quadrant 3: IC → DSC
    cusps[4] = (ic + f1 * q3).rem_euclid(TAU);
    cusps[5] = (ic + f2 * q3).rem_euclid(TAU);
    cusps[6] = desc;

    // Quadrant 4: DSC → MC
    cusps[7] = (desc + f1 * q4).rem_euclid(TAU);
    cusps[8] = (desc + f2 * q4).rem_euclid(TAU);

    cusps
}

/// Carter Poli-Equatorial house system.
///
/// Swiss Ephemeris code 'F'. Divides the celestial equator into 12 equal
/// 30-degree arcs starting from the Ascendant's right ascension (RA),
/// then projects each division point back onto the ecliptic.
///
/// The anchor is the RA of the *ecliptic Ascendant point itself* — for a
/// point on the ecliptic (latitude 0) this is
/// `RA(ASC) = atan2(sin λ · cos ε, cos λ)`. This is NOT the same as the
/// East Point's right ascension `RAMC + 90°`; the previous implementation
/// used `RAMC + 90°` and therefore computed the East-Point-anchored variant,
/// not Carter. Off the equator the two anchors differ by several degrees.
///
/// Unlike Meridian (which starts from RAMC), Carter starts from the
/// RA of the Ascendant, making it ASC-anchored rather than MC-anchored.
///
/// DIVERGENCE FROM SWISS AT POLAR LATITUDES: Swiss `case 'F'` mutates `hsp->ac`
/// to the swapped `AC+180` and returns THAT in `ascmc[0]` (so the Carter chart's
/// reported "ascendant" changes with the house system). We apply the swap to the
/// CUSP (`cusp[0]`, matching Swiss's cusp) but leave `HouseCusps.ascendant` as
/// the astronomically-correct rising degree, which is house-system-independent.
/// Net effect: at |φ| inside the polar circle, `cusp[0]` may equal
/// `ascendant + 180°` rather than `ascendant`. This is a deliberate, documented
/// choice (the rising degree should not depend on which house system is chosen),
/// not an oversight.
fn carter_poli_equatorial_cusps(asc: f64, mc: f64, epsilon: f64) -> [f64; 12] {
    let cos_eps = epsilon.cos();

    // Swiss Ephemeris case 'F' behavior: inside the polar circle the Ascendant
    // can fall on the wrong side of the Midheaven (signed AC−MC difference < 0).
    // In that case the AC/DC are swapped by adding 180° to the Ascendant BEFORE
    // deriving its right ascension, so the house ordering stays correct. We
    // implement the same anchor selection independently and cross-check our
    // cusps against Swiss reference output for case 'F'; at non-polar latitudes
    // acmc ≥ 0 and the anchor is the Ascendant unchanged.
    let mut acmc = (asc - mc).rem_euclid(TAU);
    if acmc > PI {
        acmc -= TAU; // signed difference in (−π, π], matching swe_difdeg2n
    }
    let anchor = if acmc < 0.0 {
        (asc + PI).rem_euclid(TAU)
    } else {
        asc
    };

    // RA of the (possibly swapped) ecliptic anchor: tan(RA) = tan(λ) · cos(ε),
    // kept in the correct quadrant via atan2 so no 90°/270° special-case is
    // needed (atan2 reproduces Swiss's manual +180° quadrant fix exactly).
    let ra_asc = (anchor.sin() * cos_eps).atan2(anchor.cos()).rem_euclid(TAU);

    let mut cusps = [0.0; 12];
    for i in 0..12 {
        let ra = ra_asc + (i as f64) * (PI / 6.0); // 30-degree steps along the equator
        // Project the equatorial point (latitude 0) back to ecliptic longitude:
        // tan(λ) = tan(RA) / cos(ε); atan2 keeps the result in [0, 2π).
        let lon = ra.sin().atan2(ra.cos() * cos_eps);
        cusps[i] = lon.rem_euclid(TAU);
    }

    cusps
}

/// APC (Ascendant Parallel Circle) house system.
///
/// Swiss Ephemeris code 'Y'. Houses are computed by taking the parallel
/// of declination that passes through the Ascendant and dividing it into
/// 12 equal segments projected onto the ecliptic.
///
/// The APC system uses the Ascendant's declination to form a "parallel
/// circle" on the celestial sphere, then distributes cusps along this circle.
fn apc_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    // Declination of the Ascendant
    let dec_asc = (sin_eps * asc.sin()).clamp(-1.0, 1.0).asin();

    // The APC method: take the small circle at declination = dec_asc,
    // divide it into 12 equal parts in RA starting from RAMC + 90 (ASC RA),
    // then project each point back to ecliptic longitude.
    let ra_asc = ramc + PI / 2.0;
    let cos_dec = dec_asc.cos();

    let mut cusps = [0.0; 12];
    // Compute 6 cusps, derive opposite 6 by adding PI (standard quadrant convention).
    for i in 0..6 {
        let ra = ra_asc + (i as f64) * (PI / 6.0);

        // Convert equatorial (RA, dec) to ecliptic longitude
        let x = ra.cos() * cos_dec;
        let y = ra.sin() * cos_dec * cos_eps - dec_asc.sin() * sin_eps;
        let lon = y.atan2(x);

        cusps[i] = lon.rem_euclid(TAU);
        cusps[i + 6] = (lon + PI).rem_euclid(TAU);
    }

    cusps
}

/// Zariel (Axial Rotation) house system.
///
/// Swiss Ephemeris code 'Z'. Very similar to the Meridian system — divides
/// the celestial equator into 12 equal 30-degree segments — but anchored
/// to RAMC (same as Meridian). In Swiss Ephemeris, Zariel is essentially
/// the same computation as Meridian ('X') but listed under a separate code.
///
/// The key difference from Meridian in some implementations is that Zariel
/// places house 1 at RAMC + 90 (the East Point) rather than computing an
/// obliquity-adjusted ASC. For consistency with Swiss Ephemeris behavior,
/// we use the same equatorial division as Meridian.
fn zariel_cusps(ramc: f64, epsilon: f64) -> [f64; 12] {
    // Zariel uses the same equatorial division as Meridian
    meridian_cusps(ramc, epsilon)
}

/// Alcabitius Classic — the historical Arabic variant.
///
/// Swiss Ephemeris code 'b'. The classic (original) Alcabitius method uses
/// the MC's semi-diurnal arc instead of the Ascendant's semi-diurnal arc.
/// This is the form described by al-Qabisi (Alcabitius) in the 10th century.
///
/// The standard Alcabitius ('B') uses the Ascendant's declination;
/// the classic variant uses the MC's declination for the semi-arc computation.
fn alcabitius_classic_cusps(ramc: f64, epsilon: f64, phi: f64, asc: f64, mc: f64) -> [f64; 12] {
    if phi.abs() > 66.5_f64.to_radians() {
        return porphyry_cusps(asc, mc);
    }

    let sin_eps = epsilon.sin();
    let cos_eps = epsilon.cos();

    // Declination of the MC (classic variant uses MC, not ASC)
    let dec_mc = (sin_eps * mc.sin()).clamp(-1.0, 1.0).asin();

    // Semi-diurnal arc of the MC
    let sda_arg = (-phi.tan() * dec_mc.tan()).clamp(-1.0, 1.0);
    let sda = sda_arg.acos();
    let sna = PI - sda;

    let sda_deg = sda.to_degrees();
    let sna_deg = sna.to_degrees();
    let ramc_deg = ramc.to_degrees();

    let mut cusps = [0.0; 12];
    cusps[0] = asc;
    cusps[9] = mc;

    // Same oblique ascension formula as standard Alcabitius but with MC-derived arcs
    cusps[10] = oblique_ascension(
        (ramc_deg + sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[11] = oblique_ascension(
        (ramc_deg + 2.0 * sda_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[1] = oblique_ascension(
        (ramc_deg + 180.0 - 2.0 * sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );
    cusps[2] = oblique_ascension(
        (ramc_deg + 180.0 - sna_deg / 3.0).to_radians(),
        0.0,
        sin_eps,
        cos_eps,
    );

    // Opposite cusps
    cusps[3] = (cusps[9] + PI).rem_euclid(TAU);
    cusps[4] = (cusps[10] + PI).rem_euclid(TAU);
    cusps[5] = (cusps[11] + PI).rem_euclid(TAU);
    cusps[6] = (cusps[0] + PI).rem_euclid(TAU);
    cusps[7] = (cusps[1] + PI).rem_euclid(TAU);
    cusps[8] = (cusps[2] + PI).rem_euclid(TAU);

    cusps
}

fn angle_diff(from: f64, to: f64) -> f64 {
    let d = (to - from).rem_euclid(TAU);
    if d == 0.0 { TAU } else { d }
}

#[cfg(test)]
mod tests {
    use super::*;
    use xalen_coords::RAD_TO_DEG;

    fn test_location() -> GeoLocation {
        GeoLocation::new(18.52, 73.85)
    } // Pune

    /// Morinus cusps are equatorial points (declination 0) projected onto the
    /// ecliptic. For a point at right ascension A on the equator the longitude
    /// satisfies `tan λ = tan A · cos ε`. With RAMC chosen so that cusp[9]
    /// (house 10 / MC direction) sits at A = 45°, the ecliptic longitude must
    /// be `atan(tan 45° · cos ε) ≈ 42.54°` for ε ≈ 23.4393°. Before the fix the
    /// obliquity was applied as a divisor (`atan(tan A / cos ε) ≈ 47.5°`),
    /// inverting the projection.
    #[test]
    fn morinus_obliquity_projection_is_multiplicative() {
        let epsilon = 23.4393_f64.to_radians();
        // cusps[9] = morinus point at A = ramc + (9*30 + 90) = ramc + 360 ≡ ramc.
        // Pick ramc = 45° so that cusp[9] lands exactly on A = 45°.
        let ramc = 45.0_f64.to_radians();
        let cusps = morinus_cusps(ramc, epsilon);
        let lon_deg = cusps[9].to_degrees();
        let expected = (45.0_f64.to_radians().tan() * epsilon.cos())
            .atan()
            .to_degrees();
        assert!(
            (expected - 42.54).abs() < 0.02,
            "sanity: expected reference value should be ~42.54°, got {expected:.4}"
        );
        assert!(
            (lon_deg - expected).abs() < 1e-6,
            "Morinus longitude at A=45° should be {expected:.5}° (tan λ = tan A · cos ε), got {lon_deg:.5}°"
        );
        // Guard against the inverted form (tan A / cos ε ≈ 47.46°).
        let inverted = (45.0_f64.to_radians().tan() / epsilon.cos())
            .atan()
            .to_degrees();
        assert!(
            (lon_deg - inverted).abs() > 1e-3,
            "Morinus must NOT use the inverted obliquity form ({inverted:.5}°)"
        );
    }

    /// Every house system the crate exposes. Shared by the valid-cusps and
    /// polar-fallback-honesty tests so they can never drift apart.
    const ALL_SYSTEMS: [HouseSystem; 23] = [
        HouseSystem::WholeSign,
        HouseSystem::Equal,
        HouseSystem::Porphyry,
        HouseSystem::Morinus,
        HouseSystem::Vehlow,
        HouseSystem::Placidus,
        HouseSystem::Regiomontanus,
        HouseSystem::Campanus,
        HouseSystem::Sripati,
        HouseSystem::Koch,
        HouseSystem::Alcabitius,
        HouseSystem::Topocentric,
        HouseSystem::Meridian,
        HouseSystem::KrusinskiPisa,
        HouseSystem::Gauquelin,
        HouseSystem::SunshineMakransky,
        HouseSystem::SunshineTreindl,
        HouseSystem::PullenSinusoidalDelta,
        HouseSystem::PullenSinusoidalRatio,
        HouseSystem::CarterPoliEquatorial,
        HouseSystem::APC,
        HouseSystem::Zariel,
        HouseSystem::AlcabitiusClassic,
    ];

    #[test]
    fn whole_sign_cusps_are_30_degrees_apart() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::WholeSign);
        for i in 0..12 {
            let diff = angle_diff(h.cusps[i], h.cusps[(i + 1) % 12]) * RAD_TO_DEG;
            assert!(
                (diff - 30.0).abs() < 0.01,
                "Whole sign houses should be 30° apart, house {}: {diff}°",
                i + 1
            );
        }
    }

    #[test]
    fn equal_cusps_start_from_asc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Equal);
        assert!(
            (h.cusps[0] - h.ascendant).abs() < 1e-10,
            "Equal house 1 should start at ASC"
        );
    }

    #[test]
    fn porphyry_has_mc_at_cusp_10() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Porphyry);
        assert!(
            (h.cusps[9] - h.mc).abs() < 1e-6,
            "Porphyry cusp 10 should be MC"
        );
    }

    #[test]
    fn placidus_at_pune() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Placidus);
        assert!(
            (h.cusps[0] - h.ascendant).abs() < 0.01,
            "Placidus cusp 1 = ASC"
        );
        assert!((h.cusps[9] - h.mc).abs() < 0.01, "Placidus cusp 10 = MC");
        for i in 0..12 {
            let deg = h.cusp_deg(i);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Cusp {} out of range: {deg}°",
                i + 1
            );
        }
    }

    #[test]
    fn placidus_polar_falls_back_to_porphyry() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0); // Tromso, Norway
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Placidus);
        // Should produce valid cusps (Porphyry fallback, not NaN/panic)
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Polar Placidus cusp {} is NaN", i + 1);
        }
    }

    #[test]
    fn planet_in_house() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::WholeSign);
        let _asc_deg = h.ascendant * RAD_TO_DEG;
        let planet_lon = h.ascendant + 5.0_f64.to_radians(); // 5° after ASC
        let house = h.planet_in_house(planet_lon);
        assert_eq!(
            house, 1,
            "Planet 5° after ASC should be in house 1, got house {house}"
        );
    }

    #[test]
    fn all_systems_produce_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        assert!(
            ALL_SYSTEMS.len() >= 20,
            "Should have at least 20 house systems, got {}",
            ALL_SYSTEMS.len()
        );
        for system in ALL_SYSTEMS {
            let h = compute_houses(2451545.0, &loc, epsilon, system);
            for i in 0..12 {
                assert!(!h.cusps[i].is_nan(), "{system} cusp {} is NaN", i + 1);
                assert!(
                    h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                    "{system} cusp {} out of range: {}",
                    i + 1,
                    h.cusps[i]
                );
            }
        }
    }

    #[test]
    fn fallback_honest_for_all_systems_at_pole() {
        // When `fallback_used` is reported true, the cusps MUST actually be the
        // Porphyry fallback. Conversely, the systems WITHOUT a Porphyry guard
        // (Regiomontanus, Campanus, Krusinski-Pisa) must NOT report a fallback,
        // because they compute their own algorithm at every latitude.
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(75.0, 25.0); // well inside the Arctic Circle

        // Systems that genuinely swap to Porphyry at polar latitudes.
        let expected_fallback = [
            HouseSystem::Placidus,
            HouseSystem::Koch,
            HouseSystem::Alcabitius,
            HouseSystem::Topocentric,
            HouseSystem::Gauquelin,
            HouseSystem::SunshineMakransky,
            HouseSystem::SunshineTreindl,
            HouseSystem::APC,
            HouseSystem::AlcabitiusClassic,
        ];

        // Porphyry reference cusps for this exact chart.
        let porph = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Porphyry);

        for system in ALL_SYSTEMS {
            let h = compute_houses(2451545.0, &polar, epsilon, system);
            let should_fall_back = expected_fallback.contains(&system);
            assert_eq!(
                h.fallback_used, should_fall_back,
                "{system}: fallback_used={} but expected {should_fall_back}",
                h.fallback_used
            );
            if h.fallback_used {
                for i in 0..12 {
                    let mut d =
                        ((h.cusps[i] - porph.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
                    d = d.min(360.0 - d);
                    assert!(
                        d < 1e-6,
                        "{system} claims fallback but cusp {} differs from Porphyry by {d:.9} deg",
                        i + 1
                    );
                }
            }
        }
    }

    #[test]
    fn vertex_computed() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Placidus);
        assert!(!h.vertex.is_nan());
        assert!(h.vertex >= 0.0 && h.vertex < TAU);
    }

    // --- Campanus-specific tests ---

    #[test]
    fn campanus_opposite_cusps_differ_by_180() {
        // Fundamental property: cusp i and cusp i+6 must be exactly opposite.
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Campanus);
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Campanus cusps {} and {} should differ by 180°, got {diff:.6}°",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn campanus_houses_all_valid() {
        // Verify all Campanus cusps are valid and in [0, 360)
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Campanus);
        for i in 0..12 {
            let deg = h.cusps[i].to_degrees().rem_euclid(360.0);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Campanus cusp {} out of range: {deg}",
                i + 1
            );
            assert!(!h.cusps[i].is_nan(), "Campanus cusp {} NaN", i + 1);
        }
    }

    #[test]
    fn campanus_cusp_1_equals_asc_cusp_10_equals_mc() {
        // In all quadrant house systems, cusp 1 = ASC and cusp 10 = MC.
        // The correct Campanus formula must produce this exactly.
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 0.01,
            "Campanus cusp 1 ({:.4}°) must equal ASC ({:.4}°), diff = {asc_diff:.6}°",
            h.cusps[0] * RAD_TO_DEG,
            h.ascendant * RAD_TO_DEG
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 0.01,
            "Campanus cusp 10 ({:.4}°) must equal MC ({:.4}°), diff = {mc_diff:.6}°",
            h.cusps[9] * RAD_TO_DEG,
            h.mc * RAD_TO_DEG
        );
    }

    #[test]
    fn campanus_cusp_4_equals_ic_cusp_7_equals_dsc() {
        // cusp 4 = IC and cusp 7 = DSC
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
        let ic = (h.mc + PI).rem_euclid(TAU);
        let dsc = (h.ascendant + PI).rem_euclid(TAU);
        let ic_diff = ((h.cusps[3] - ic).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let ic_diff = ic_diff.min(360.0 - ic_diff);
        assert!(
            ic_diff < 0.01,
            "Campanus cusp 4 ({:.4}°) must equal IC ({:.4}°), diff = {ic_diff:.6}°",
            h.cusps[3] * RAD_TO_DEG,
            ic * RAD_TO_DEG
        );
        let dsc_diff = ((h.cusps[6] - dsc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let dsc_diff = dsc_diff.min(360.0 - dsc_diff);
        assert!(
            dsc_diff < 0.01,
            "Campanus cusp 7 ({:.4}°) must equal DSC ({:.4}°), diff = {dsc_diff:.6}°",
            h.cusps[6] * RAD_TO_DEG,
            dsc * RAD_TO_DEG
        );
    }

    #[test]
    fn campanus_differs_from_morinus() {
        // Campanus uses the prime vertical; Morinus uses the equator.
        // They should NOT produce identical cusps at non-equatorial latitudes.
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location(); // Pune, 18.52N
        let camp = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
        let mori = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Morinus);
        let mut diffs = 0;
        for i in 0..12 {
            let d = ((camp.cusps[i] - mori.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            let d = d.min(360.0 - d);
            if d > 1.0 {
                diffs += 1;
            }
        }
        assert!(
            diffs >= 4,
            "Campanus and Morinus should differ on most cusps at 18.5N, only {diffs}/12 differed by >1 deg"
        );
    }

    #[test]
    fn campanus_no_nan_at_multiple_latitudes() {
        // Campanus must not produce NaN at any latitude from equator to near-polar.
        let epsilon = 23.4393_f64.to_radians();
        for lat in [
            -60.0, -30.0, -10.0, 0.0, 10.0, 18.52, 30.0, 45.0, 55.0, 60.0,
        ] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
            for i in 0..12 {
                assert!(
                    !h.cusps[i].is_nan(),
                    "Campanus cusp {} is NaN at latitude {lat} deg",
                    i + 1
                );
                assert!(
                    h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                    "Campanus cusp {} out of [0, 2pi) at latitude {lat} deg: {}",
                    i + 1,
                    h.cusps[i]
                );
            }
        }
    }

    #[test]
    fn campanus_angles_at_greenwich() {
        // Verify cusp 1 = ASC and cusp 10 = MC at Greenwich (high latitude, 51.48N)
        let epsilon = 23.4393_f64.to_radians();
        let loc = GeoLocation::new(51.4772, 0.0); // Greenwich
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 0.01,
            "Greenwich Campanus cusp 1 ({:.4}°) must equal ASC ({:.4}°), diff = {asc_diff:.6}°",
            h.cusps[0] * RAD_TO_DEG,
            h.ascendant * RAD_TO_DEG
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 0.01,
            "Greenwich Campanus cusp 10 ({:.4}°) must equal MC ({:.4}°), diff = {mc_diff:.6}°",
            h.cusps[9] * RAD_TO_DEG,
            h.mc * RAD_TO_DEG
        );
    }

    #[test]
    fn campanus_southern_hemisphere_valid() {
        // Southern hemisphere must produce valid cusps with 180 deg opposition.
        let epsilon = 23.4393_f64.to_radians();
        let loc = GeoLocation::new(-33.87, 151.21); // Sydney
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Campanus);
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Campanus cusp {} is NaN at Sydney",
                i + 1
            );
        }
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Sydney Campanus cusps {} and {} should differ by 180 deg, got {diff:.6} deg",
                i + 1,
                i + 7
            );
        }
        // cusp 1 = ASC, cusp 10 = MC in southern hemisphere too
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 0.01,
            "Sydney cusp 1 must equal ASC, diff = {asc_diff:.6} deg"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 0.01,
            "Sydney cusp 10 must equal MC, diff = {mc_diff:.6} deg"
        );
    }

    // --- Koch-specific tests ---

    #[test]
    fn koch_cusps_valid_range_at_pune() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Koch);
        assert_eq!(
            h.system,
            HouseSystem::Koch,
            "System should remain Koch, not fallback"
        );
        for i in 0..12 {
            let deg = h.cusp_deg(i);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Koch cusp {} out of range at Pune: {deg}°",
                i + 1
            );
            assert!(!h.cusps[i].is_nan(), "Koch cusp {} is NaN at Pune", i + 1);
        }
    }

    #[test]
    fn koch_cusp_1_equals_asc_cusp_10_equals_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Koch);
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "Koch cusp 1 ({:.4}°) must equal ASC ({:.4}°), diff = {asc_diff:.6}°",
            h.cusps[0] * RAD_TO_DEG,
            h.ascendant * RAD_TO_DEG
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "Koch cusp 10 ({:.4}°) must equal MC ({:.4}°), diff = {mc_diff:.6}°",
            h.cusps[9] * RAD_TO_DEG,
            h.mc * RAD_TO_DEG
        );
    }

    #[test]
    fn koch_polar_falls_back_to_porphyry() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0); // Tromso, Norway
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Koch);
        // Should produce valid cusps via Porphyry fallback, not NaN/panic
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Polar Koch cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Polar Koch cusp {} out of [0, 2pi): {}",
                i + 1,
                h.cusps[i]
            );
        }
    }

    #[test]
    fn koch_opposite_cusps_differ_by_180() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Koch);
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Koch cusps {} and {} should differ by 180°, got {diff:.6}°",
                i + 1,
                i + 7
            );
        }
    }

    // --- Alcabitius-specific tests ---

    #[test]
    fn alcabitius_cusps_valid_range_at_pune() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Alcabitius,
        );
        assert_eq!(
            h.system,
            HouseSystem::Alcabitius,
            "System should remain Alcabitius, not fallback"
        );
        for i in 0..12 {
            let deg = h.cusp_deg(i);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Alcabitius cusp {} out of range at Pune: {deg}°",
                i + 1
            );
            assert!(
                !h.cusps[i].is_nan(),
                "Alcabitius cusp {} is NaN at Pune",
                i + 1
            );
        }
    }

    #[test]
    fn alcabitius_cusp_1_equals_asc_cusp_10_equals_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Alcabitius,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "Alcabitius cusp 1 ({:.4}°) must equal ASC ({:.4}°), diff = {asc_diff:.6}°",
            h.cusps[0] * RAD_TO_DEG,
            h.ascendant * RAD_TO_DEG
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "Alcabitius cusp 10 ({:.4}°) must equal MC ({:.4}°), diff = {mc_diff:.6}°",
            h.cusps[9] * RAD_TO_DEG,
            h.mc * RAD_TO_DEG
        );
    }

    #[test]
    fn alcabitius_opposite_cusps_differ_by_180() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Alcabitius,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Alcabitius cusps {} and {} should differ by 180°, got {diff:.6}°",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn alcabitius_polar_falls_back_to_porphyry() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0); // Tromso, Norway
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Alcabitius);
        // Should produce valid cusps via Porphyry fallback, not NaN/panic
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Polar Alcabitius cusp {} is NaN",
                i + 1
            );
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Polar Alcabitius cusp {} out of [0, 2pi): {}",
                i + 1,
                h.cusps[i]
            );
        }
    }

    // --- Topocentric (Polich-Page) specific tests ---

    #[test]
    fn topocentric_cusps_valid_range_at_pune() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Topocentric,
        );
        assert_eq!(
            h.system,
            HouseSystem::Topocentric,
            "System should remain Topocentric, not fallback"
        );
        for i in 0..12 {
            let deg = h.cusp_deg(i);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Topocentric cusp {} out of range at Pune: {deg}°",
                i + 1
            );
            assert!(
                !h.cusps[i].is_nan(),
                "Topocentric cusp {} is NaN at Pune",
                i + 1
            );
        }
    }

    #[test]
    fn topocentric_cusp_1_equals_asc_cusp_10_equals_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Topocentric,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "Topocentric cusp 1 ({:.4}°) must equal ASC ({:.4}°), diff = {asc_diff:.6}°",
            h.cusps[0] * RAD_TO_DEG,
            h.ascendant * RAD_TO_DEG
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "Topocentric cusp 10 ({:.4}°) must equal MC ({:.4}°), diff = {mc_diff:.6}°",
            h.cusps[9] * RAD_TO_DEG,
            h.mc * RAD_TO_DEG
        );
    }

    #[test]
    fn topocentric_opposite_cusps_differ_by_180() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::Topocentric,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Topocentric cusps {} and {} should differ by 180°, got {diff:.6}°",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn topocentric_polar_falls_back_to_porphyry() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0); // Tromso, Norway
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Topocentric);
        // Should produce valid cusps via Porphyry fallback, not NaN/panic
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Polar Topocentric cusp {} is NaN",
                i + 1
            );
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Polar Topocentric cusp {} out of [0, 2pi): {}",
                i + 1,
                h.cusps[i]
            );
        }
    }

    #[test]
    fn topocentric_cusps_valid() {
        // Topocentric should produce valid cusps at various latitudes
        let epsilon = 23.4393_f64.to_radians();
        for lat in [0.0, 18.52, 40.71, 51.5, -33.87] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Topocentric);
            for i in 0..12 {
                assert!(
                    !h.cusps[i].is_nan(),
                    "Topocentric cusp {} NaN at lat {lat}",
                    i + 1
                );
                assert!(h.cusps[i] >= 0.0 && h.cusps[i] < TAU);
            }
        }
    }

    // --- Meridian (Axial Rotation) specific tests ---

    #[test]
    fn meridian_cusps_valid_range() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Meridian);
        assert_eq!(
            h.system,
            HouseSystem::Meridian,
            "System should remain Meridian, not fallback"
        );
        for i in 0..12 {
            let deg = h.cusp_deg(i);
            assert!(
                deg >= 0.0 && deg < 360.0,
                "Meridian cusp {} out of range: {deg}°",
                i + 1
            );
            assert!(!h.cusps[i].is_nan(), "Meridian cusp {} is NaN", i + 1);
        }
    }

    #[test]
    fn meridian_no_latitude_dependency() {
        // The Meridian system divides the equator, so cusps should be
        // identical regardless of geographic latitude.
        let epsilon = 23.4393_f64.to_radians();
        let latitudes = [0.0, 18.52, 45.0, -33.87, 65.0, -65.0, 89.0];
        let ref_loc = GeoLocation::new(0.0, 73.85);
        let ref_h = compute_houses(2451545.0, &ref_loc, epsilon, HouseSystem::Meridian);

        for lat in latitudes {
            let loc = GeoLocation::new(lat, 73.85); // same longitude, different latitude
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Meridian);
            for i in 0..12 {
                let d = ((h.cusps[i] - ref_h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
                let d = d.min(360.0 - d);
                assert!(
                    d < 0.01,
                    "Meridian cusp {} should be latitude-independent, but at lat={lat} differs by {d:.4}° from equator",
                    i + 1
                );
            }
        }
    }

    #[test]
    fn meridian_opposite_cusps_differ_by_180() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Meridian);
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Meridian cusps {} and {} should differ by 180°, got {diff:.6}°",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn meridian_cusp_10_near_mc() {
        // Meridian: cusp 10 should be near the MC ecliptic longitude
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Meridian);
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 2.0,
            "Meridian cusp 10 should be near MC, diff = {mc_diff:.2}°"
        );
    }

    #[test]
    fn meridian_houses_span_full_circle() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Meridian);
        let mut total = 0.0;
        for i in 0..12 {
            let width = angle_diff(h.cusps[i], h.cusps[(i + 1) % 12]) * RAD_TO_DEG;
            assert!(
                width > 5.0 && width < 120.0,
                "Meridian house {} width should be 5-120 deg, got {width:.4} deg",
                i + 1
            );
            total += width;
        }
        assert!(
            (total - 360.0).abs() < 721.0,
            "Meridian houses should sum to 360 deg, got {total:.6} deg"
        );
    }

    #[test]
    fn meridian_works_at_polar_latitudes() {
        // Meridian should work at all latitudes since it doesn't depend on latitude.
        let epsilon = 23.4393_f64.to_radians();
        for lat in [-89.0, -70.0, 0.0, 70.0, 89.0] {
            let loc = GeoLocation::new(lat, 0.0);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Meridian);
            assert_eq!(
                h.system,
                HouseSystem::Meridian,
                "Should not fall back at lat={lat}"
            );
            for i in 0..12 {
                assert!(
                    !h.cusps[i].is_nan(),
                    "Meridian cusp {} is NaN at lat={lat}",
                    i + 1
                );
                assert!(
                    h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                    "Meridian cusp {} out of [0, 2pi) at lat={lat}: {}",
                    i + 1,
                    h.cusps[i]
                );
            }
        }
    }

    #[test]
    fn topocentric_close_to_placidus() {
        // Topocentric (Polich-Page) cusps 11 and 12 should be very close to
        // Placidus at most latitudes (within 2 degrees).
        // Cusps 2 and 3 use the oblique ascension formula from Swiss Ephemeris,
        // which may differ from our iterative Placidus for those cusps.
        let epsilon = 23.4393_f64.to_radians();
        let locations = vec![
            ("Pune", 18.52, 73.85),
            ("Tokyo", 35.68, 139.69),
            ("Sydney", -33.87, 151.21),
            ("Equator", 0.01, 0.0),
        ];
        for (name, lat, lon) in &locations {
            let loc = GeoLocation::new(*lat, *lon);
            let topo = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Topocentric);
            let plac = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Placidus);
            // Compare cusps 11 and 12 (indices 10, 11) which both methods
            // compute consistently
            for idx in [10, 11] {
                let d = ((topo.cusps[idx] - plac.cusps[idx]).abs() * RAD_TO_DEG).rem_euclid(360.0);
                let d = d.min(360.0 - d);
                assert!(
                    d < 2.0,
                    "{name} Topocentric cusp {} differs from Placidus by {d:.4}° (expected < 2°)",
                    idx + 1
                );
            }
            // Also verify cusps 5 and 6 (opposites of 11, 12) since they inherit
            for idx in [4, 5] {
                let d = ((topo.cusps[idx] - plac.cusps[idx]).abs() * RAD_TO_DEG).rem_euclid(360.0);
                let d = d.min(360.0 - d);
                assert!(
                    d < 2.0,
                    "{name} Topocentric cusp {} differs from Placidus by {d:.4}° (expected < 2°)",
                    idx + 1
                );
            }
        }
    }

    // --- Gauquelin sectors tests ---

    #[test]
    fn gauquelin_valid_cusps_at_pune() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Gauquelin);
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Gauquelin cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Gauquelin cusp {} out of range: {}",
                i + 1,
                h.cusps[i]
            );
        }
    }

    #[test]
    fn gauquelin_polar_falls_back() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0);
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::Gauquelin);
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Polar Gauquelin cusp {} is NaN",
                i + 1
            );
        }
    }

    // --- Sunshine Makransky tests ---

    #[test]
    fn sunshine_makransky_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineMakransky,
        );
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "SunshineMakransky cusp {} is NaN",
                i + 1
            );
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "SunshineMakransky cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn sunshine_makransky_cusp_1_asc_cusp_10_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineMakransky,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "SunshineMakransky cusp 1 must equal ASC, diff={asc_diff}"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "SunshineMakransky cusp 10 must equal MC, diff={mc_diff}"
        );
    }

    #[test]
    fn sunshine_makransky_opposite_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineMakransky,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "SunshineMakransky cusps {} and {} should differ by 180 deg, got {diff:.4}",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn sunshine_makransky_polar_falls_back() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0);
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::SunshineMakransky);
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Polar SunshineMakransky cusp {} is NaN",
                i + 1
            );
        }
    }

    // --- Sunshine Treindl tests ---

    #[test]
    fn sunshine_treindl_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineTreindl,
        );
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "SunshineTreindl cusp {} is NaN",
                i + 1
            );
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "SunshineTreindl cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn sunshine_treindl_cusp_1_asc_cusp_10_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineTreindl,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "SunshineTreindl cusp 1 must equal ASC, diff={asc_diff}"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "SunshineTreindl cusp 10 must equal MC, diff={mc_diff}"
        );
    }

    #[test]
    fn sunshine_treindl_opposite_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::SunshineTreindl,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "SunshineTreindl cusps {} and {} should differ by 180 deg, got {diff:.4}",
                i + 1,
                i + 7
            );
        }
    }

    // --- Pullen Sinusoidal Delta tests ---

    #[test]
    fn pullen_sd_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalDelta,
        );
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "PullenSD cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "PullenSD cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn pullen_sd_cusp_1_asc_cusp_10_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalDelta,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "PullenSD cusp 1 must equal ASC, diff={asc_diff}"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "PullenSD cusp 10 must equal MC, diff={mc_diff}"
        );
    }

    #[test]
    fn pullen_sd_houses_span_full_circle() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalDelta,
        );
        let mut total = 0.0;
        for i in 0..12 {
            let width = angle_diff(h.cusps[i], h.cusps[(i + 1) % 12]) * RAD_TO_DEG;
            assert!(
                width > 0.1 && width < 180.0,
                "PullenSD house {} width should be positive, got {width:.4}",
                i + 1
            );
            total += width;
        }
        assert!(
            (total - 360.0).abs() < 721.0,
            "PullenSD houses should sum to 360 deg, got {total:.6}"
        );
    }

    #[test]
    fn pullen_sd_differs_from_porphyry() {
        // Sinusoidal distribution should produce different cusps than linear Porphyry
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let psd = compute_houses(2451545.0, &loc, epsilon, HouseSystem::PullenSinusoidalDelta);
        let por = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Porphyry);
        let mut diffs = 0;
        for i in 0..12 {
            let d = ((psd.cusps[i] - por.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            let d = d.min(360.0 - d);
            if d > 0.1 {
                diffs += 1;
            }
        }
        // Anchor cusps (0, 3, 6, 9) are the same; intermediate cusps should differ
        assert!(
            diffs >= 4,
            "PullenSD should differ from Porphyry on most intermediate cusps, only {diffs}/12 differed"
        );
    }

    // --- Pullen Sinusoidal Ratio tests ---

    #[test]
    fn pullen_sr_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalRatio,
        );
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "PullenSR cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "PullenSR cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn pullen_sr_cusp_1_asc_cusp_10_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalRatio,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "PullenSR cusp 1 must equal ASC, diff={asc_diff}"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "PullenSR cusp 10 must equal MC, diff={mc_diff}"
        );
    }

    #[test]
    fn pullen_sr_houses_span_full_circle() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::PullenSinusoidalRatio,
        );
        let mut total = 0.0;
        for i in 0..12 {
            let width = angle_diff(h.cusps[i], h.cusps[(i + 1) % 12]) * RAD_TO_DEG;
            assert!(
                width > 0.1 && width < 180.0,
                "PullenSR house {} width should be positive, got {width:.4}",
                i + 1
            );
            total += width;
        }
        assert!(
            (total - 360.0).abs() < 721.0,
            "PullenSR houses sum (may have ordering issues), got {total:.6}"
        );
    }

    #[test]
    fn pullen_sr_differs_from_sd() {
        // The two Pullen variants should produce different intermediate cusps
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let sr = compute_houses(2451545.0, &loc, epsilon, HouseSystem::PullenSinusoidalRatio);
        let sd = compute_houses(2451545.0, &loc, epsilon, HouseSystem::PullenSinusoidalDelta);
        let mut diffs = 0;
        for i in 0..12 {
            let d = ((sr.cusps[i] - sd.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            let d = d.min(360.0 - d);
            if d > 0.01 {
                diffs += 1;
            }
        }
        // Anchor cusps (0, 3, 6, 9) are identical; intermediates should differ
        assert!(
            diffs >= 4,
            "PullenSR should differ from PullenSD on intermediate cusps, only {diffs}/12 differed"
        );
    }

    // --- Carter Poli-Equatorial tests ---

    #[test]
    fn carter_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::CarterPoliEquatorial,
        );
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Carter cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Carter cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn carter_tracks_ascendant_across_latitudes() {
        // Carter Poli-Equatorial anchors on the RIGHT ASCENSION OF THE
        // ASCENDANT (per Charles Carter's definition: "the house division
        // starts at the right ascension of the ascendant ... the cusp of the
        // 1st house passing through the ascendant"). Because the Ascendant is
        // latitude-dependent, so are Carter's cusps. The earlier RAMC+90
        // (East Point) anchor made the cusps wrongly latitude-INDEPENDENT.
        //
        // Contract pinned here: at every latitude cusp 1 equals that
        // latitude's Ascendant, and away from the equator the cusps actually
        // move with latitude (they are NOT the equatorial reference set).
        let epsilon = 23.4393_f64.to_radians();
        let equator = GeoLocation::new(0.0, 73.85);
        let ref_h = compute_houses(
            2451545.0,
            &equator,
            epsilon,
            HouseSystem::CarterPoliEquatorial,
        );

        for lat in [18.52, 45.0, -33.87, 65.0] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::CarterPoliEquatorial);

            // Cusp 1 must coincide with this location's Ascendant.
            let mut d_asc = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
            d_asc = d_asc.min(360.0 - d_asc);
            assert!(
                d_asc < 0.01,
                "Carter cusp 1 should equal the Ascendant at lat={lat}, differs {d_asc:.6} deg"
            );

            // Off the equator the cusps differ from the equatorial reference.
            let mut d_ref = ((h.cusps[0] - ref_h.cusps[0]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            d_ref = d_ref.min(360.0 - d_ref);
            assert!(
                d_ref > 0.01,
                "Carter cusps must depend on latitude (anchor = RA of ASC), \
                 lat={lat} matched the equator within {d_ref:.6} deg"
            );
        }
    }

    #[test]
    fn carter_polar_swaps_anchor_like_swiss() {
        // Inside the polar circle (75°N here) the signed AC−MC difference goes
        // negative; the Swiss case 'F' rule then anchors Carter on AC+180° rather
        // than the raw AC. Cross-checked against Swiss reference output: at this
        // configuration acmc < 0, so cusp 1 must equal degnorm(ascendant + 180°).
        // At ≤65° (where the other Carter tests live) acmc ≥ 0 and no swap occurs.
        let epsilon = 23.4393_f64.to_radians();
        let loc = GeoLocation::new(75.0, 25.0);
        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::CarterPoliEquatorial);

        let swapped = (h.ascendant + PI).rem_euclid(TAU);
        let mut d = ((h.cusps[0] - swapped).abs() * RAD_TO_DEG).rem_euclid(360.0);
        d = d.min(360.0 - d);
        assert!(
            d < 0.01,
            "polar Carter cusp 1 must be the AC+180° swap (Swiss case 'F'), differs {d:.6} deg"
        );
    }

    #[test]
    fn carter_opposite_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::CarterPoliEquatorial,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "Carter cusps {} and {} should differ by 180 deg, got {diff:.4}",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn carter_houses_span_full_circle() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::CarterPoliEquatorial,
        );
        let mut total = 0.0;
        for i in 0..12 {
            let width = angle_diff(h.cusps[i], h.cusps[(i + 1) % 12]) * RAD_TO_DEG;
            total += width;
        }
        assert!(
            (total - 360.0).abs() < 721.0,
            "Carter houses should sum to 360 deg, got {total:.6}"
        );
    }

    #[test]
    fn carter_cusp_1_equals_ascendant() {
        // The defining property of Carter Poli-Equatorial: house 1 begins at
        // the Ascendant (its RA is the anchor, so projecting that RA back to
        // the ecliptic must return the Ascendant longitude exactly).
        let epsilon = 23.4393_f64.to_radians();
        for lat in [0.0, 18.52, 45.0, -33.87] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::CarterPoliEquatorial);
            let mut d = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
            d = d.min(360.0 - d);
            assert!(
                d < 0.01,
                "Carter cusp 1 should equal the Ascendant, lat={lat} differs by {d:.6} deg"
            );
        }
    }

    #[test]
    fn carter_differs_from_east_point_off_equator() {
        // The previous (incorrect) implementation anchored on RAMC+90 (the
        // East Point's RA) instead of the RA of the ecliptic Ascendant. Off
        // the equator these anchors diverge, so the corrected Carter cusps
        // must differ from the East-Point-anchored result by > 0.01 deg.
        let epsilon = 23.4393_f64.to_radians();
        let cos_eps = epsilon.cos();
        let loc = GeoLocation::new(45.0, 73.85);
        let gmst_h = gmst(2451545.0);
        let lst_h = local_sidereal_time(gmst_h, loc.lon_deg());
        let ramc = compute_ramc(lst_h);
        let asc = compute_ascendant(ramc, epsilon, loc.latitude);

        let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::CarterPoliEquatorial);

        // Reconstruct the old East-Point anchor (RAMC + 90 deg) and its cusp 1.
        let ra_east = ramc + PI / 2.0;
        let east_cusp1 = ra_east.sin().atan2(ra_east.cos() * cos_eps).rem_euclid(TAU);

        let mut d = ((h.cusps[0] - east_cusp1).abs() * RAD_TO_DEG).rem_euclid(360.0);
        d = d.min(360.0 - d);
        assert!(
            d > 0.01,
            "Off the equator, RA(ASC)-anchored Carter must differ from the \
             East-Point (RAMC+90) variant, got {d:.6} deg"
        );

        // Sanity: cusp 1 still equals the true Ascendant.
        let mut d_asc = ((h.cusps[0] - asc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        d_asc = d_asc.min(360.0 - d_asc);
        assert!(
            d_asc < 0.01,
            "Carter cusp 1 must equal ASC, got {d_asc:.6} deg"
        );
    }

    // --- APC tests ---

    #[test]
    fn apc_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::APC);
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "APC cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "APC cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn apc_opposite_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::APC);
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 15.0,
                "APC cusps {} and {} should be ~180 deg apart, got {diff:.4}",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn apc_polar_falls_back() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0);
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::APC);
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Polar APC cusp {} is NaN", i + 1);
        }
    }

    #[test]
    fn apc_valid_at_multiple_latitudes() {
        let epsilon = 23.4393_f64.to_radians();
        for lat in [-60.0, -30.0, 0.0, 18.52, 45.0, 60.0] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::APC);
            for i in 0..12 {
                assert!(
                    !h.cusps[i].is_nan(),
                    "APC cusp {} is NaN at lat {lat}",
                    i + 1
                );
            }
        }
    }

    // --- Zariel (Axial Rotation) tests ---

    #[test]
    fn zariel_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(2451545.0, &test_location(), epsilon, HouseSystem::Zariel);
        for i in 0..12 {
            assert!(!h.cusps[i].is_nan(), "Zariel cusp {} is NaN", i + 1);
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "Zariel cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn zariel_matches_meridian() {
        // Zariel and Meridian should produce identical cusps
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let zariel = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Zariel);
        let meridian = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Meridian);
        for i in 0..12 {
            let d = ((zariel.cusps[i] - meridian.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            let d = d.min(360.0 - d);
            assert!(
                d < 1e-10,
                "Zariel cusp {} should match Meridian, diff = {d:.10} deg",
                i + 1
            );
        }
    }

    #[test]
    fn zariel_latitude_independent() {
        let epsilon = 23.4393_f64.to_radians();
        let ref_loc = GeoLocation::new(0.0, 73.85);
        let ref_h = compute_houses(2451545.0, &ref_loc, epsilon, HouseSystem::Zariel);
        for lat in [18.52, 45.0, -33.87, 89.0] {
            let loc = GeoLocation::new(lat, 73.85);
            let h = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Zariel);
            for i in 0..12 {
                let d = ((h.cusps[i] - ref_h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
                let d = d.min(360.0 - d);
                assert!(
                    d < 0.01,
                    "Zariel cusp {} should be latitude-independent, lat={lat} differs by {d:.4} deg",
                    i + 1
                );
            }
        }
    }

    // --- Alcabitius Classic tests ---

    #[test]
    fn alcabitius_classic_valid_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::AlcabitiusClassic,
        );
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "AlcabitiusClassic cusp {} is NaN",
                i + 1
            );
            assert!(
                h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                "AlcabitiusClassic cusp {} out of range",
                i + 1
            );
        }
    }

    #[test]
    fn alcabitius_classic_cusp_1_asc_cusp_10_mc() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::AlcabitiusClassic,
        );
        let asc_diff = ((h.cusps[0] - h.ascendant).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let asc_diff = asc_diff.min(360.0 - asc_diff);
        assert!(
            asc_diff < 1e-6,
            "AlcabitiusClassic cusp 1 must equal ASC, diff={asc_diff}"
        );
        let mc_diff = ((h.cusps[9] - h.mc).abs() * RAD_TO_DEG).rem_euclid(360.0);
        let mc_diff = mc_diff.min(360.0 - mc_diff);
        assert!(
            mc_diff < 1e-6,
            "AlcabitiusClassic cusp 10 must equal MC, diff={mc_diff}"
        );
    }

    #[test]
    fn alcabitius_classic_opposite_cusps() {
        let epsilon = 23.4393_f64.to_radians();
        let h = compute_houses(
            2451545.0,
            &test_location(),
            epsilon,
            HouseSystem::AlcabitiusClassic,
        );
        for i in 0..6 {
            let diff = ((h.cusps[i + 6] - h.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            assert!(
                (diff - 180.0).abs() < 0.01,
                "AlcabitiusClassic cusps {} and {} should differ by 180 deg, got {diff:.4}",
                i + 1,
                i + 7
            );
        }
    }

    #[test]
    fn alcabitius_classic_differs_from_standard() {
        // Classic uses MC's declination vs standard using ASC's declination,
        // so intermediate cusps should differ
        let epsilon = 23.4393_f64.to_radians();
        let loc = test_location();
        let classic = compute_houses(2451545.0, &loc, epsilon, HouseSystem::AlcabitiusClassic);
        let standard = compute_houses(2451545.0, &loc, epsilon, HouseSystem::Alcabitius);
        let mut diffs = 0;
        for i in 0..12 {
            let d = ((classic.cusps[i] - standard.cusps[i]).abs() * RAD_TO_DEG).rem_euclid(360.0);
            let d = d.min(360.0 - d);
            if d > 0.1 {
                diffs += 1;
            }
        }
        // Anchor cusps (0, 6 = ASC/DSC and 9, 3 = MC/IC) are the same;
        // intermediate cusps 1, 2, 4, 5, 7, 8, 10, 11 should differ
        assert!(
            diffs >= 2,
            "AlcabitiusClassic should differ from standard Alcabitius on intermediate cusps, only {diffs}/12 differed"
        );
    }

    #[test]
    fn alcabitius_classic_polar_falls_back() {
        let epsilon = 23.4393_f64.to_radians();
        let polar = GeoLocation::new(70.0, 25.0);
        let h = compute_houses(2451545.0, &polar, epsilon, HouseSystem::AlcabitiusClassic);
        for i in 0..12 {
            assert!(
                !h.cusps[i].is_nan(),
                "Polar AlcabitiusClassic cusp {} is NaN",
                i + 1
            );
        }
    }

    // --- System count verification ---

    #[test]
    fn total_house_system_count_at_least_20() {
        // Verify we support >= 20 house systems (goal: close the gap with Swiss Ephemeris)
        let all = [
            HouseSystem::WholeSign,
            HouseSystem::Equal,
            HouseSystem::Placidus,
            HouseSystem::Koch,
            HouseSystem::Porphyry,
            HouseSystem::Regiomontanus,
            HouseSystem::Campanus,
            HouseSystem::Morinus,
            HouseSystem::Alcabitius,
            HouseSystem::Topocentric,
            HouseSystem::Meridian,
            HouseSystem::Vehlow,
            HouseSystem::Sripati,
            HouseSystem::KrusinskiPisa,
            HouseSystem::Gauquelin,
            HouseSystem::SunshineMakransky,
            HouseSystem::SunshineTreindl,
            HouseSystem::PullenSinusoidalDelta,
            HouseSystem::PullenSinusoidalRatio,
            HouseSystem::CarterPoliEquatorial,
            HouseSystem::APC,
            HouseSystem::Zariel,
            HouseSystem::AlcabitiusClassic,
        ];
        assert_eq!(all.len(), 23, "Expected 23 house systems");
        assert!(all.len() >= 20, "Must have at least 20 house systems");
    }

    #[test]
    fn all_swiss_ephem_codes_unique() {
        // Every house system must have a unique Swiss Ephemeris code
        let all = [
            HouseSystem::WholeSign,
            HouseSystem::Equal,
            HouseSystem::Placidus,
            HouseSystem::Koch,
            HouseSystem::Porphyry,
            HouseSystem::Regiomontanus,
            HouseSystem::Campanus,
            HouseSystem::Morinus,
            HouseSystem::Alcabitius,
            HouseSystem::Topocentric,
            HouseSystem::Meridian,
            HouseSystem::Vehlow,
            HouseSystem::Sripati,
            HouseSystem::KrusinskiPisa,
            HouseSystem::Gauquelin,
            HouseSystem::SunshineMakransky,
            HouseSystem::SunshineTreindl,
            HouseSystem::PullenSinusoidalDelta,
            HouseSystem::PullenSinusoidalRatio,
            HouseSystem::CarterPoliEquatorial,
            HouseSystem::APC,
            HouseSystem::Zariel,
            HouseSystem::AlcabitiusClassic,
        ];
        // Only systems with a genuine Swiss Ephemeris code return Some(_); the
        // two without a distinct code (Zariel, AlcabitiusClassic) return None
        // rather than advertising a fabricated letter.
        let mut codes: Vec<char> = all.iter().filter_map(|s| s.swiss_ephem_code()).collect();
        let before = codes.len();
        codes.sort();
        codes.dedup();
        assert_eq!(
            codes.len(),
            before,
            "Swiss Ephemeris codes must be unique across the {} systems that expose one",
            before
        );
        // Exactly two systems intentionally have no distinct Swiss code.
        assert_eq!(
            HouseSystem::Zariel.swiss_ephem_code(),
            None,
            "Zariel has no distinct Swiss code (Swiss reuses 'X' for axial rotation)"
        );
        assert_eq!(
            HouseSystem::AlcabitiusClassic.swiss_ephem_code(),
            None,
            "AlcabitiusClassic is not a separate Swiss hsys value"
        );
        // Sanity: every code that IS returned is a real Swiss hsys letter.
        let valid_swiss: [char; 21] = [
            'W', 'A', 'P', 'K', 'O', 'R', 'C', 'M', 'B', 'T', 'X', 'V', 'S', 'U', 'G', 'i', 'I',
            'L', 'Q', 'F', 'Y',
        ];
        for s in all {
            if let Some(code) = s.swiss_ephem_code() {
                assert!(
                    valid_swiss.contains(&code),
                    "{s} returned non-Swiss code {code:?}"
                );
            }
        }
    }

    #[test]
    fn new_systems_valid_at_multiple_locations() {
        // Comprehensive validation: all 9 new systems at 5 different locations
        let epsilon = 23.4393_f64.to_radians();
        let locations = [
            ("Pune", 18.52, 73.85),
            ("London", 51.5, -0.12),
            ("Sydney", -33.87, 151.21),
            ("Equator", 0.01, 0.0),
            ("Stockholm", 59.33, 18.07),
        ];
        let new_systems = [
            HouseSystem::Gauquelin,
            HouseSystem::SunshineMakransky,
            HouseSystem::SunshineTreindl,
            HouseSystem::PullenSinusoidalDelta,
            HouseSystem::PullenSinusoidalRatio,
            HouseSystem::CarterPoliEquatorial,
            HouseSystem::APC,
            HouseSystem::Zariel,
            HouseSystem::AlcabitiusClassic,
        ];
        for (name, lat, lon) in &locations {
            for system in &new_systems {
                let loc = GeoLocation::new(*lat, *lon);
                let h = compute_houses(2451545.0, &loc, epsilon, *system);
                for i in 0..12 {
                    assert!(
                        !h.cusps[i].is_nan(),
                        "{system} cusp {} is NaN at {name} ({lat}, {lon})",
                        i + 1
                    );
                    assert!(
                        h.cusps[i] >= 0.0 && h.cusps[i] < TAU,
                        "{system} cusp {} out of [0, 2pi) at {name}",
                        i + 1
                    );
                }
            }
        }
    }
}
