#[cfg(test)]
use std::ffi::CStr;
use std::ffi::{c_char, c_double, c_int};
use std::sync::OnceLock;

use xalen_ayanamsa::Ayanamsa;
use xalen_coords::obliquity::mean_obliquity;
use xalen_ephem::{Almanac, Body};
use xalen_houses::{GeoLocation, HouseSystem, compute_houses};
use xalen_time::{JdUT1, JulianDay};

static ALMANAC: OnceLock<Almanac> = OnceLock::new();

fn get_almanac() -> &'static Almanac {
    ALMANAC.get_or_init(Almanac::default_vedic)
}

#[repr(C)]
pub struct XalenPosition {
    pub longitude_deg: c_double,
    pub latitude_deg: c_double,
    pub distance_au: c_double,
    pub status: c_int,
}

#[repr(C)]
pub struct XalenHouses {
    pub cusps: [c_double; 12],
    pub ascendant_deg: c_double,
    pub mc_deg: c_double,
    pub status: c_int,
}

/// Status sentinel returned by every FFI entrypoint when a Rust panic was
/// caught crossing the C ABI. Unwinding past `extern "C"` is undefined behaviour
/// (it aborts the process under the default panic strategy), so each body is run
/// inside `std::panic::catch_unwind` and converted to this value instead.
const XALEN_FFI_PANIC: c_int = -99;
/// Floating-point variant of [`XALEN_FFI_PANIC`] for functions that return a
/// `c_double`. Distinct from the ordinary `-1.0` / `-2.0` error sentinels so a
/// caught panic is distinguishable from a normal invalid-argument rejection.
const XALEN_FFI_PANIC_F64: c_double = -99.0;

/// Run `f` and catch any unwinding panic, returning `sentinel` instead of
/// letting the panic cross the C ABI (which would be UB / abort).
fn guard_int(f: impl FnOnce() -> c_int + std::panic::UnwindSafe, sentinel: c_int) -> c_int {
    std::panic::catch_unwind(f).unwrap_or(sentinel)
}

/// Like [`guard_int`] for `c_double`-returning entrypoints.
fn guard_f64(
    f: impl FnOnce() -> c_double + std::panic::UnwindSafe,
    sentinel: c_double,
) -> c_double {
    std::panic::catch_unwind(f).unwrap_or(sentinel)
}

/// Initialize the XALEN Ephemeris library. Thread-safe, idempotent.
///
/// Returns 0 on success, or [`XALEN_FFI_PANIC`] if an internal panic was caught.
#[unsafe(no_mangle)]
pub extern "C" fn xalen_init() -> c_int {
    guard_int(
        || {
            let _ = get_almanac();
            0
        },
        XALEN_FFI_PANIC,
    )
}

/// Map a body integer ID to the Body enum.
/// Canonical mapping:
/// 0=Sun, 1=Moon, 2=Mercury, 3=Venus, 4=Mars, 5=Jupiter, 6=Saturn,
/// 7=Uranus, 8=Neptune, 9=Rahu/MeanNode, 10=TrueNode, 11=Pluto,
/// 12=Chiron, 13=Ketu (computed as Rahu+180)
fn body_from_id(body_id: c_int) -> Option<Body> {
    match body_id {
        0 => Some(Body::Sun),
        1 => Some(Body::Moon),
        2 => Some(Body::Mercury),
        3 => Some(Body::Venus),
        4 => Some(Body::Mars),
        5 => Some(Body::Jupiter),
        6 => Some(Body::Saturn),
        7 => Some(Body::Uranus),
        8 => Some(Body::Neptune),
        9 => Some(Body::MeanNode),
        10 => Some(Body::TrueNode),
        11 => Some(Body::Pluto),
        12 => Some(Body::Chiron),
        // 13 = Ketu handled specially by callers
        _ => None,
    }
}

/// Map an ayanamsa integer ID to the Ayanamsa enum.
/// Canonical mapping:
/// 0=Lahiri, 1=KP, 2=Raman, 3=FaganBradley, 4=TrueChitra, 5=TrueRevati,
/// 6=SuryaSiddhanta, 7=Yukteswar, 8=JNBhasin, 9=DeLuce, 10=Ushashashi,
/// 11=PushyaPaksha, 12=GalacticCenter, 13=LahiriICRC, 14=KPStraightLine,
/// 15=Hipparchos, 16=LahiriVP285
fn ayanamsa_from_id(id: c_int) -> Option<Ayanamsa> {
    match id {
        0 => Some(Ayanamsa::Lahiri),
        1 => Some(Ayanamsa::KPKrishnamurti),
        2 => Some(Ayanamsa::Raman),
        3 => Some(Ayanamsa::FaganBradley),
        4 => Some(Ayanamsa::TrueChitra),
        5 => Some(Ayanamsa::TrueRevati),
        6 => Some(Ayanamsa::SuryaSiddhanta),
        7 => Some(Ayanamsa::YukteswarSriSS),
        8 => Some(Ayanamsa::JNBhasin),
        9 => Some(Ayanamsa::DeLuce),
        10 => Some(Ayanamsa::Ushashashi),
        11 => Some(Ayanamsa::PushyaPaksha),
        12 => Some(Ayanamsa::GalacticCenter0Sag),
        13 => Some(Ayanamsa::LahiriICRC),
        14 => Some(Ayanamsa::KPStraightLine),
        15 => Some(Ayanamsa::Hipparchos),
        16 => Some(Ayanamsa::LahiriVP285),
        _ => None,
    }
}

/// Map a house system integer ID to the HouseSystem enum.
/// Canonical mapping:
/// 0=WholeSign, 1=Equal, 2=Placidus, 3=Koch, 4=Porphyry, 5=Regiomontanus,
/// 6=Campanus, 7=Morinus, 8=Alcabitius, 9=Topocentric, 10=Sripati,
/// 11=Vehlow, 12=Meridian, 13=Krusinski
fn house_system_from_id(id: c_int) -> Option<HouseSystem> {
    match id {
        0 => Some(HouseSystem::WholeSign),
        1 => Some(HouseSystem::Equal),
        2 => Some(HouseSystem::Placidus),
        3 => Some(HouseSystem::Koch),
        4 => Some(HouseSystem::Porphyry),
        5 => Some(HouseSystem::Regiomontanus),
        6 => Some(HouseSystem::Campanus),
        7 => Some(HouseSystem::Morinus),
        8 => Some(HouseSystem::Alcabitius),
        9 => Some(HouseSystem::Topocentric),
        10 => Some(HouseSystem::Sripati),
        11 => Some(HouseSystem::Vehlow),
        12 => Some(HouseSystem::Meridian),
        13 => Some(HouseSystem::KrusinskiPisa),
        _ => None,
    }
}

/// Compute geocentric tropical longitude of a planet.
/// body: 0=Sun, 1=Moon, 2=Mercury, 3=Venus, 4=Mars, 5=Jupiter, 6=Saturn,
///       7=Uranus, 8=Neptune, 9=Rahu/MeanNode, 10=TrueNode, 11=Pluto,
///       12=Chiron, 13=Ketu (Rahu+180)
///
/// # Safety
/// `out` must be a valid, writable pointer to a `XalenPosition` (or null, which
/// returns -1). The function zero-initializes `*out` before use.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn xalen_planet_position(
    jd_ut1: c_double,
    body_id: c_int,
    out: *mut XalenPosition,
) -> c_int {
    if out.is_null() {
        return -1;
    }

    // Zero-initialize output struct so callers never see stale data on error paths.
    unsafe {
        std::ptr::write_bytes(out, 0, 1);
    }

    // Run the body inside catch_unwind so a panic in the math layer becomes the
    // XALEN_FFI_PANIC sentinel instead of unwinding across the C ABI (UB/abort).
    // `out` is captured behind AssertUnwindSafe: we only write through it, and on
    // a caught panic we stamp the panic status below.
    let out_guard = std::panic::AssertUnwindSafe(out);
    let result = std::panic::catch_unwind(move || {
        let out = out_guard.0;
        // Reject non-finite (NaN/Inf) Julian Day before any computation.
        if !jd_ut1.is_finite() {
            unsafe {
                (*out).status = -2;
            }
            return -2;
        }

        // Handle Ketu (id 13) as Rahu + 180
        if body_id == 13 {
            let almanac = get_almanac();
            return match almanac.geocentric_ecliptic(Body::MeanNode, JdUT1(jd_ut1)) {
                Ok(pos) => {
                    unsafe {
                        (*out).longitude_deg =
                            (pos.longitude.to_degrees() + 180.0).rem_euclid(360.0);
                        (*out).latitude_deg = pos.latitude.to_degrees();
                        (*out).distance_au = pos.distance;
                        (*out).status = 0;
                    }
                    0
                }
                Err(_) => {
                    unsafe {
                        (*out).status = -3;
                    }
                    -3
                }
            };
        }

        let body = match body_from_id(body_id) {
            Some(b) => b,
            None => {
                unsafe {
                    (*out).status = -2;
                }
                return -2;
            }
        };

        let almanac = get_almanac();
        match almanac.geocentric_ecliptic(body, JdUT1(jd_ut1)) {
            Ok(pos) => {
                unsafe {
                    (*out).longitude_deg = pos.longitude.to_degrees().rem_euclid(360.0);
                    (*out).latitude_deg = pos.latitude.to_degrees();
                    (*out).distance_au = pos.distance;
                    (*out).status = 0;
                }
                0
            }
            Err(_) => {
                unsafe {
                    (*out).status = -3;
                }
                -3
            }
        }
    });

    match result {
        Ok(code) => code,
        Err(_) => {
            // Panic was caught: record it in the (non-null, already-zeroed) struct.
            unsafe {
                (*out).status = XALEN_FFI_PANIC;
            }
            XALEN_FFI_PANIC
        }
    }
}

/// Compute sidereal longitude with specified ayanamsa.
/// ayanamsa_id: 0=Lahiri, 1=KP, 2=Raman, 3=FaganBradley, ... 16=LahiriVP285
/// body_id: 0=Sun .. 12=Chiron, 13=Ketu (Rahu+180)
/// Returns -1.0 on invalid body_id, -2.0 on invalid ayanamsa_id.
#[unsafe(no_mangle)]
pub extern "C" fn xalen_sidereal_longitude(
    jd_ut1: c_double,
    body_id: c_int,
    ayanamsa_id: c_int,
) -> c_double {
    guard_f64(
        move || {
            // Reject non-finite (NaN/Inf) Julian Day before any computation.
            if !jd_ut1.is_finite() {
                return -2.0;
            }

            let ayanamsa = match ayanamsa_from_id(ayanamsa_id) {
                Some(a) => a,
                None => return -2.0,
            };

            let almanac = get_almanac();
            let jd = JdUT1(jd_ut1);
            let tt = jd.to_tt(&xalen_time::DeltaTModel::StephensonMorrisonHohenkerk2016);
            let aya_deg = ayanamsa.compute_deg(tt.as_f64());

            // Handle Ketu (id 13) as Rahu + 180
            if body_id == 13 {
                return match almanac.sidereal_longitude_deg(Body::MeanNode, jd, aya_deg) {
                    Ok(lon) => (lon + 180.0).rem_euclid(360.0),
                    Err(_) => -1.0,
                };
            }

            let body = match body_from_id(body_id) {
                Some(b) => b,
                None => return -1.0,
            };

            almanac
                .sidereal_longitude_deg(body, jd, aya_deg)
                .unwrap_or(-1.0)
        },
        XALEN_FFI_PANIC_F64,
    )
}

/// Compute house cusps.
/// system: 0=WholeSign, 1=Equal, 2=Placidus, 3=Koch, 4=Porphyry,
///         5=Regiomontanus, 6=Campanus, 7=Morinus, 8=Alcabitius,
///         9=Topocentric, 10=Sripati, 11=Vehlow, 12=Meridian, 13=Krusinski
/// Returns -2 on invalid system_id.
///
/// # Safety
/// `out` must be a valid, writable pointer to a `XalenHouses` (or null, which
/// returns -1). The function zero-initializes `*out` before use.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn xalen_houses(
    jd_ut1: c_double,
    latitude_deg: c_double,
    longitude_deg: c_double,
    system_id: c_int,
    out: *mut XalenHouses,
) -> c_int {
    if out.is_null() {
        return -1;
    }

    // Zero-initialize output struct so callers never see stale data on error paths.
    unsafe {
        std::ptr::write_bytes(out, 0, 1);
    }

    // Run the math inside catch_unwind: a panic in the house-cusp solver becomes
    // the XALEN_FFI_PANIC sentinel rather than unwinding across the C ABI.
    let out_guard = std::panic::AssertUnwindSafe(out);
    let result = std::panic::catch_unwind(move || {
        let out = out_guard.0;
        // Reject non-finite (NaN/Inf) jd/lat/lon and out-of-range latitude before
        // any math runs. Longitude is intentionally NOT range-bounded: it is
        // periodic and legitimate callers may pass values outside [-180, 360].
        if !jd_ut1.is_finite()
            || !latitude_deg.is_finite()
            || !longitude_deg.is_finite()
            || !(-90.0..=90.0).contains(&latitude_deg)
        {
            unsafe {
                (*out).status = -2;
            }
            return -2;
        }

        let system = match house_system_from_id(system_id) {
            Some(s) => s,
            None => {
                unsafe {
                    (*out).status = -2;
                }
                return -2;
            }
        };

        let loc = GeoLocation::new(latitude_deg, longitude_deg);
        let t = (jd_ut1 - 2_451_545.0) / 36525.0;
        let epsilon = mean_obliquity(t);
        let houses = compute_houses(jd_ut1, &loc, epsilon, system);

        unsafe {
            for i in 0..12 {
                (*out).cusps[i] = houses.cusp_deg(i);
            }
            (*out).ascendant_deg = houses.ascendant.to_degrees().rem_euclid(360.0);
            (*out).mc_deg = houses.mc.to_degrees().rem_euclid(360.0);
            (*out).status = 0;
        }
        0
    });

    match result {
        Ok(code) => code,
        Err(_) => {
            unsafe {
                (*out).status = XALEN_FFI_PANIC;
            }
            XALEN_FFI_PANIC
        }
    }
}

/// Get the XALEN Ephemeris version string.
///
/// Returns a pointer to a static, NUL-terminated string. Returns a null pointer
/// only if an internal panic was caught (it cannot happen in practice — the
/// value is a compile-time constant — but the guard keeps the no-unwind-across-
/// the-C-ABI invariant uniform across every entrypoint).
#[unsafe(no_mangle)]
pub extern "C" fn xalen_version() -> *const c_char {
    // Sourced from the crate version so it can never drift from Cargo.toml; the
    // original literal was stuck at "0.1.0".
    let ptr = std::panic::catch_unwind(|| {
        concat!("XALEN Ephemeris ", env!("CARGO_PKG_VERSION"), "\0").as_ptr() as usize
    })
    .unwrap_or(0);
    ptr as *const c_char
}

/// Compute ayanamsa value in degrees for a given JD.
/// Returns -1.0 on an invalid `ayanamsa_id` or a non-finite `jd_ut1`.
#[unsafe(no_mangle)]
pub extern "C" fn xalen_ayanamsa(jd_ut1: c_double, ayanamsa_id: c_int) -> c_double {
    guard_f64(
        move || {
            let ayanamsa = match ayanamsa_from_id(ayanamsa_id) {
                Some(a) => a,
                None => return -1.0,
            };
            // Guard non-finite input like the other FFI entrypoints, so NaN/Inf
            // can never silently return a non-finite ayanamsa instead of -1.0.
            if !jd_ut1.is_finite() {
                return -1.0;
            }
            let jd = JdUT1(jd_ut1);
            let tt = jd.to_tt(&xalen_time::DeltaTModel::StephensonMorrisonHohenkerk2016);
            ayanamsa.compute_deg(tt.as_f64())
        },
        XALEN_FFI_PANIC_F64,
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn init_succeeds() {
        assert_eq!(xalen_init(), 0);
    }

    #[test]
    fn planet_position_sun() {
        xalen_init();
        let mut pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: -1,
        };
        let ret = unsafe { xalen_planet_position(2451545.0, 0, &mut pos) };
        assert_eq!(ret, 0);
        assert_eq!(pos.status, 0);
        assert!(pos.longitude_deg >= 0.0 && pos.longitude_deg < 360.0);
    }

    #[test]
    fn all_body_ids_valid() {
        xalen_init();
        // 0=Sun through 12=Chiron (real bodies)
        for id in 0..=12 {
            let mut pos = XalenPosition {
                longitude_deg: 0.0,
                latitude_deg: 0.0,
                distance_au: 0.0,
                status: -1,
            };
            let ret = unsafe { xalen_planet_position(2451545.0, id, &mut pos) };
            assert_eq!(ret, 0, "Body ID {id} should succeed");
            assert!(
                pos.longitude_deg >= 0.0 && pos.longitude_deg < 360.0,
                "Body {id} longitude should be [0,360), got {}",
                pos.longitude_deg
            );
        }
    }

    #[test]
    fn ketu_body_id_13() {
        xalen_init();
        let mut rahu_pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: -1,
        };
        unsafe { xalen_planet_position(2451545.0, 9, &mut rahu_pos) }; // Rahu
        let mut ketu_pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: -1,
        };
        let ret = unsafe { xalen_planet_position(2451545.0, 13, &mut ketu_pos) }; // Ketu
        assert_eq!(ret, 0, "Ketu (body 13) should succeed");
        let expected = (rahu_pos.longitude_deg + 180.0).rem_euclid(360.0);
        assert!(
            (ketu_pos.longitude_deg - expected).abs() < 1e-10,
            "Ketu should be Rahu+180: expected {expected}, got {}",
            ketu_pos.longitude_deg
        );
    }

    #[test]
    fn sidereal_longitude_reasonable() {
        xalen_init();
        let lon = xalen_sidereal_longitude(2451545.0, 0, 0); // Sun, Lahiri
        assert!(
            lon >= 0.0 && lon < 360.0,
            "Sidereal Sun should be 0-360°, got {lon}°"
        );
    }

    #[test]
    fn sidereal_all_ayanamsa_ids_valid() {
        xalen_init();
        for id in 0..=16 {
            let lon = xalen_sidereal_longitude(2451545.0, 0, id); // Sun
            assert!(
                lon >= 0.0 && lon < 360.0,
                "Ayanamsa ID {id} should produce valid sidereal lon, got {lon}"
            );
        }
    }

    #[test]
    fn sidereal_invalid_ayanamsa_returns_error() {
        let lon = xalen_sidereal_longitude(2451545.0, 0, 99);
        assert!(
            lon < 0.0,
            "Invalid ayanamsa should return negative, got {lon}"
        );
    }

    #[test]
    fn sidereal_ketu_body_13() {
        xalen_init();
        let rahu_lon = xalen_sidereal_longitude(2451545.0, 9, 0); // Rahu, Lahiri
        let ketu_lon = xalen_sidereal_longitude(2451545.0, 13, 0); // Ketu, Lahiri
        assert!(
            ketu_lon >= 0.0 && ketu_lon < 360.0,
            "Ketu sidereal should be [0,360), got {ketu_lon}"
        );
        let expected = (rahu_lon + 180.0).rem_euclid(360.0);
        assert!(
            (ketu_lon - expected).abs() < 1e-10,
            "Ketu sidereal should be Rahu+180: expected {expected}, got {ketu_lon}"
        );
    }

    #[test]
    fn houses_compute() {
        xalen_init();
        let mut h = XalenHouses {
            cusps: [0.0; 12],
            ascendant_deg: 0.0,
            mc_deg: 0.0,
            status: -1,
        };
        let ret = unsafe { xalen_houses(2451545.0, 18.52, 73.85, 0, &mut h) };
        assert_eq!(ret, 0);
        assert_eq!(h.status, 0);
        assert!(h.ascendant_deg >= 0.0 && h.ascendant_deg < 360.0);
    }

    #[test]
    fn houses_all_system_ids_valid() {
        xalen_init();
        for id in 0..=13 {
            let mut h = XalenHouses {
                cusps: [0.0; 12],
                ascendant_deg: 0.0,
                mc_deg: 0.0,
                status: -1,
            };
            let ret = unsafe { xalen_houses(2451545.0, 18.52, 73.85, id, &mut h) };
            assert_eq!(ret, 0, "House system ID {id} should succeed");
            assert!(
                h.ascendant_deg >= 0.0 && h.ascendant_deg < 360.0,
                "House system {id} should produce valid ascendant"
            );
        }
    }

    #[test]
    fn houses_invalid_system_returns_error() {
        let mut h = XalenHouses {
            cusps: [0.0; 12],
            ascendant_deg: 0.0,
            mc_deg: 0.0,
            status: 0,
        };
        let ret = unsafe { xalen_houses(2451545.0, 18.52, 73.85, 99, &mut h) };
        assert_eq!(ret, -2, "Invalid house system should return -2");
    }

    #[test]
    fn invalid_body_returns_error() {
        let mut pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: 0,
        };
        let ret = unsafe { xalen_planet_position(2451545.0, 99, &mut pos) };
        assert_eq!(ret, -2);
    }

    #[test]
    fn null_pointer_returns_error() {
        let ret = unsafe { xalen_planet_position(2451545.0, 0, std::ptr::null_mut()) };
        assert_eq!(ret, -1);
    }

    #[test]
    fn ayanamsa_at_j2000() {
        let aya = xalen_ayanamsa(2451545.0, 0);
        assert!(
            (aya - 23.85).abs() < 0.1,
            "Lahiri at J2000 should be ~23.85°, got {aya}°"
        );
    }

    #[test]
    fn ayanamsa_all_ids_valid() {
        for id in 0..=16 {
            let aya = xalen_ayanamsa(2451545.0, id);
            assert!(
                aya.is_finite() && aya > 0.0,
                "Ayanamsa ID {id} should produce finite positive value, got {aya}"
            );
        }
    }

    #[test]
    fn ayanamsa_invalid_id_returns_error() {
        let aya = xalen_ayanamsa(2451545.0, 99);
        assert!(
            aya < 0.0,
            "Invalid ayanamsa ID should return negative, got {aya}"
        );
    }

    #[test]
    fn ayanamsa_non_finite_jd_returns_error() {
        // A non-finite JD (with a VALID id) must return the -1.0 sentinel like
        // the other FFI entrypoints, not a silently non-finite ayanamsa.
        assert_eq!(xalen_ayanamsa(f64::NAN, 0), -1.0);
        assert_eq!(xalen_ayanamsa(f64::INFINITY, 0), -1.0);
    }

    #[test]
    fn houses_reject_non_finite_and_out_of_range_lat() {
        xalen_init();
        // NaN / Inf jd, lat, lon and out-of-range latitude must all return -2
        // and leave status == -2. Longitude is periodic, so values like 540.0
        // are NOT rejected by range (only by non-finiteness).
        let bad_inputs: [(c_double, c_double, c_double); 9] = [
            (f64::NAN, 18.52, 73.85),              // NaN jd
            (f64::INFINITY, 18.52, 73.85),         // Inf jd
            (2451545.0, f64::NAN, 73.85),          // NaN lat
            (2451545.0, f64::INFINITY, 73.85),     // Inf lat
            (2451545.0, 18.52, f64::NAN),          // NaN lon
            (2451545.0, 18.52, f64::INFINITY),     // +Inf lon
            (2451545.0, 18.52, f64::NEG_INFINITY), // -Inf lon
            (2451545.0, 91.0, 73.85),              // lat > 90
            (2451545.0, -90.5, 73.85),             // lat < -90
        ];
        for (jd, lat, lon) in bad_inputs {
            let mut h = XalenHouses {
                cusps: [0.0; 12],
                ascendant_deg: 0.0,
                mc_deg: 0.0,
                status: 0,
            };
            let ret = unsafe { xalen_houses(jd, lat, lon, 0, &mut h) };
            assert_eq!(
                ret, -2,
                "jd={jd} lat={lat} lon={lon} should be rejected with -2"
            );
            assert_eq!(
                h.status, -2,
                "status should be -2 for jd={jd} lat={lat} lon={lon}"
            );
        }

        // Sanity: out-of-[-180,360] longitude is periodic and MUST still succeed.
        let mut h = XalenHouses {
            cusps: [0.0; 12],
            ascendant_deg: 0.0,
            mc_deg: 0.0,
            status: -1,
        };
        let ret = unsafe { xalen_houses(2451545.0, 18.52, 540.0, 0, &mut h) };
        assert_eq!(ret, 0, "Periodic longitude 540.0 should be accepted");
        assert_eq!(h.status, 0);
    }

    #[test]
    fn planet_position_rejects_non_finite_jd() {
        xalen_init();
        for jd in [f64::NAN, f64::INFINITY, f64::NEG_INFINITY] {
            let mut pos = XalenPosition {
                longitude_deg: 0.0,
                latitude_deg: 0.0,
                distance_au: 0.0,
                status: 0,
            };
            let ret = unsafe { xalen_planet_position(jd, 0, &mut pos) };
            assert_eq!(ret, -2, "Non-finite jd={jd} should return -2");
            assert_eq!(pos.status, -2, "status should be -2 for jd={jd}");
        }
        // Ketu (id 13) path must also reject non-finite jd.
        let mut pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: 0,
        };
        let ret = unsafe { xalen_planet_position(f64::NAN, 13, &mut pos) };
        assert_eq!(ret, -2, "Non-finite jd on Ketu path should return -2");
        assert_eq!(pos.status, -2);
    }

    #[test]
    fn sidereal_longitude_rejects_non_finite_jd() {
        xalen_init();
        for jd in [f64::NAN, f64::INFINITY, f64::NEG_INFINITY] {
            let lon = xalen_sidereal_longitude(jd, 0, 0);
            assert_eq!(lon, -2.0, "Non-finite jd={jd} should return -2.0");
        }
    }

    #[test]
    fn panic_sentinels_are_distinct_from_normal_errors() {
        // The caught-panic sentinels must not collide with the ordinary
        // invalid-argument sentinels (-1/-2/-3 for ints, -1.0/-2.0 for f64),
        // so a caught panic is always distinguishable from a normal rejection.
        assert_ne!(XALEN_FFI_PANIC, -1);
        assert_ne!(XALEN_FFI_PANIC, -2);
        assert_ne!(XALEN_FFI_PANIC, -3);
        // Compare floats by distance to dodge clippy::float_cmp under -D warnings.
        assert!((XALEN_FFI_PANIC_F64 - (-1.0)).abs() > 0.5);
        assert!((XALEN_FFI_PANIC_F64 - (-2.0)).abs() > 0.5);
    }

    #[test]
    fn catch_unwind_wrappers_preserve_normal_returns() {
        // Sanity: wrapping the bodies in catch_unwind must not change the happy
        // path. A valid call still returns 0 / a finite value.
        assert_eq!(xalen_init(), 0);
        let mut pos = XalenPosition {
            longitude_deg: 0.0,
            latitude_deg: 0.0,
            distance_au: 0.0,
            status: -1,
        };
        assert_eq!(unsafe { xalen_planet_position(2451545.0, 0, &mut pos) }, 0);
        assert_eq!(pos.status, 0);
        let aya = xalen_ayanamsa(2451545.0, 0);
        assert!(aya.is_finite() && aya > 0.0);
        let lon = xalen_sidereal_longitude(2451545.0, 0, 0);
        assert!(lon >= 0.0 && lon < 360.0);
    }

    #[test]
    fn version_string() {
        let v = xalen_version();
        assert!(!v.is_null());
        let s = unsafe { CStr::from_ptr(v) }.to_str().unwrap();
        assert!(
            s.contains("XALEN"),
            "Version should contain XALEN, got '{s}'"
        );
        // The version must track the crate, not the old hard-coded "0.1.0".
        assert!(
            s.contains(env!("CARGO_PKG_VERSION")),
            "Version should contain the crate version {}, got '{s}'",
            env!("CARGO_PKG_VERSION")
        );
    }
}
