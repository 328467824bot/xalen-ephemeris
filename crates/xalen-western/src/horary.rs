use crate::aspects::{AspectDirection, AspectType, angular_distance, find_aspect};
use crate::dignity::{
    is_detriment, is_domicile, is_exaltation, is_face_ruler, is_fall, is_term_ruler,
};
use serde::{Deserialize, Serialize};

// ── Horary topic → house mapping (Lilly, CA I) ──────────────────────

/// Which house governs a given horary question topic.
pub fn house_for_topic(topic: &str) -> usize {
    match topic.to_ascii_lowercase().as_str() {
        "self" | "health" | "body" => 1,
        "money" | "possessions" | "finances" => 2,
        "siblings" | "neighbors" | "travel_short" => 3,
        "home" | "property" | "father" | "real_estate" => 4,
        "children" | "pleasure" | "creativity" | "gambling" => 5,
        "illness" | "servants" | "pets" | "work" => 6,
        "marriage" | "partner" | "relationship" | "open_enemies" => 7,
        "death" | "inheritance" | "taxes" | "surgery" => 8,
        "higher_education" | "travel_long" | "religion" | "law" => 9,
        "career" | "reputation" | "mother" => 10,
        "friends" | "hopes" | "groups" | "wishes" => 11,
        "hidden_enemies" | "prison" | "isolation" | "loss" => 12,
        _ => 7, // default: 7th house (the "other party")
    }
}

// ── Sign rulers (traditional, as used in horary) ────────────────────

pub fn sign_ruler(sign_index: usize) -> &'static str {
    const RULERS: [&str; 12] = [
        "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
        "Saturn", "Jupiter",
    ];
    RULERS[sign_index % 12]
}

/// Return the sign index (0=Aries..11=Pisces) for a given ecliptic longitude.
pub fn sign_of(lon_deg: f64) -> usize {
    ((lon_deg.rem_euclid(360.0)) / 30.0) as usize
}

// ── Considerations before judgment ──────────────────────────────────

/// Strictures against judgment — conditions that indicate the chart may
/// not be fit to read (William Lilly, *Christian Astrology* I, ch.22).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HoraryConsiderations {
    /// Chart is radical (fit to judge) when none of the warning flags fire.
    pub is_radical: bool,
    /// Moon is void of course (makes no applying major aspect before
    /// leaving its current sign).
    pub moon_void: bool,
    /// Saturn in the 7th house — astrologer is hampered or the querent
    /// may be insincere.
    pub saturn_in_7th: bool,
    /// Ascending degree < 3° — the matter is premature.
    pub asc_too_early: bool,
    /// Ascending degree > 27° — the matter is already decided.
    pub asc_too_late: bool,
}

/// Evaluate horary considerations before judgment.
///
/// * `asc_deg` — ecliptic longitude of the Ascendant.
/// * `moon_lon` / `moon_speed` — Moon's longitude & daily motion.
/// * `saturn_lon` — Saturn's ecliptic longitude.
/// * `cusps` — 12 house cusps (index 0 = cusp of house 1).
/// * `planet_lons` — longitudes of planets the Moon might aspect
///   (Sun, Mercury, Venus, Mars, Jupiter, Saturn) in order to check
///   void-of-course.
pub fn considerations(
    asc_deg: f64,
    moon_lon: f64,
    moon_speed: f64,
    saturn_lon: f64,
    cusps: &[f64; 12],
    planet_lons: &[f64],
) -> HoraryConsiderations {
    let asc_in_sign = asc_deg.rem_euclid(30.0);
    let asc_too_early = asc_in_sign < 3.0;
    let asc_too_late = asc_in_sign > 27.0;

    let saturn_in_7th = is_in_house(saturn_lon, cusps, 7);

    let moon_void = is_moon_void(moon_lon, moon_speed, planet_lons);

    let is_radical = !moon_void && !saturn_in_7th && !asc_too_early && !asc_too_late;

    HoraryConsiderations {
        is_radical,
        moon_void,
        saturn_in_7th,
        asc_too_early,
        asc_too_late,
    }
}

/// Check whether a planet falls in a given house (1-indexed).
///
/// `lon` and the cusps are normalized into `[0, 360)` so raw longitudes
/// (≥ 360 or negative) are handled correctly.
fn is_in_house(lon: f64, cusps: &[f64; 12], house: usize) -> bool {
    let lon = lon.rem_euclid(360.0);
    let idx = (house - 1) % 12;
    let next = house % 12;
    let start = cusps[idx].rem_euclid(360.0);
    let end = cusps[next].rem_euclid(360.0);
    if start < end {
        lon >= start && lon < end
    } else {
        // Wraps around 0° Aries
        lon >= start || lon < end
    }
}

/// True when the Moon makes no applying major aspect before leaving its
/// current sign (William Lilly, *Christian Astrology* I, ch.22: the Moon is
/// "void of course" when "she doth not aspect any Planet whilst she is in
/// that signe wherein she is").
///
/// The correct rule looks at *future* perfections, not only aspects that are
/// already within orb: an aspect that the Moon will complete exactly before
/// reaching the next sign boundary keeps it from being void, even if the Moon
/// is currently too far away to be in orb. The other body (`p_lon`) is treated
/// as effectively fixed relative to the swift Moon (the planets are assumed to
/// hold position over the ~≤2.3-day span the Moon needs to traverse one sign).
fn is_moon_void(moon_lon: f64, moon_speed: f64, planet_lons: &[f64]) -> bool {
    if moon_speed.abs() < 1e-6 {
        return true;
    }

    let m_lon = moon_lon.rem_euclid(360.0);
    let within = m_lon.rem_euclid(30.0);
    // Degrees of ecliptic longitude until the Moon's next sign boundary, in
    // its direction of travel.
    let deg_to_boundary = if moon_speed > 0.0 {
        30.0 - within
    } else if within == 0.0 {
        30.0
    } else {
        within
    };

    for &p_lon in planet_lons {
        let p = p_lon.rem_euclid(360.0);
        for &asp_type in AspectType::MAJOR {
            let target = asp_type.angle_deg();
            let g = |delta: f64| -> f64 {
                let ml = (m_lon + moon_speed.signum() * delta).rem_euclid(360.0);
                angular_distance(ml, p) - target
            };
            // Scan from 0 up to the sign boundary in fine steps, looking for a
            // crossing of (separation − aspect_angle) == 0. A sign change is the
            // general case; for conjunction/opposition the folded separation can
            // *touch* the angle without changing sign, so we also treat a very
            // small |g| (well below one scan step) as a perfection.
            let step = 0.1_f64;
            let mut prev = g(0.0);
            if prev.abs() < 1e-9 {
                return false; // already exactly partile
            }
            let mut d = 0.0;
            while d < deg_to_boundary {
                let next_d = (d + step).min(deg_to_boundary);
                let curr = g(next_d);
                if prev * curr < 0.0 || curr.abs() < step {
                    return false; // Moon perfects this aspect before the boundary
                }
                prev = curr;
                if next_d == deg_to_boundary {
                    break;
                }
                d = next_d;
            }
        }
    }
    true
}

// ── Combustion ──────────────────────────────────────────────────────

/// A planet is combust when within 8°30' of the Sun (Lilly).
pub fn is_combust(planet_lon: f64, sun_lon: f64) -> bool {
    angular_distance(planet_lon, sun_lon) < 8.5
}

/// A planet is under the Sun's beams when within 17° (but beyond 8°30').
pub fn is_under_sunbeams(planet_lon: f64, sun_lon: f64) -> bool {
    let d = angular_distance(planet_lon, sun_lon);
    (8.5..17.0).contains(&d)
}

// ── Perfection (applying aspect between significators) ──────────────

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PerfectionOutcome {
    /// Conjunction, trine, or sextile — clear yes.
    Yes,
    /// Square — yes but with difficulty or delay.
    WithDifficulty,
    /// Opposition — the matter is denied or only comes with full awareness
    /// of consequences.
    DeniedWithAwareness,
    /// No applying aspect — the matter will not perfect.
    NoPerfection,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerfectionResult {
    pub outcome: PerfectionOutcome,
    /// The aspect type producing perfection, if any.
    pub aspect: Option<AspectType>,
    /// Orb in degrees at the moment of the question. `None` when no aspect
    /// is found (avoids serializing a non-finite `NaN`, which `serde_json`
    /// cannot represent and emits as `null` with no round-trip guarantee).
    pub orb_deg: Option<f64>,
    /// True when the faster planet is applying to the slower.
    pub is_applying: bool,
    /// When set, the JD offset (in days from the question) at which the
    /// aspect perfects exactly. `None` for an immediate / already-in-orb
    /// applying aspect or when there is no perfection.
    pub perfects_in_days: Option<f64>,
}

/// Map a perfecting aspect type to its horary outcome (Lilly, *Christian
/// Astrology* I, ch.17–20: perfection by conjunction / sextile / trine is
/// favourable, by square is favourable with difficulty, by opposition the
/// matter is denied or comes with full awareness of consequences).
fn perfection_outcome_for(aspect: AspectType) -> PerfectionOutcome {
    match aspect {
        AspectType::Conjunction | AspectType::Trine | AspectType::Sextile => PerfectionOutcome::Yes,
        AspectType::Square => PerfectionOutcome::WithDifficulty,
        AspectType::Opposition => PerfectionOutcome::DeniedWithAwareness,
        _ => PerfectionOutcome::NoPerfection,
    }
}

/// Determine whether the querent significator perfects an aspect with the
/// quesited significator.
///
/// Per Lilly (*Christian Astrology* I, ch.17–22), perfection happens not only
/// when the two significators are *already* within orb, but whenever the
/// faster-relative-mover applies to and completes (perfects) a major aspect
/// **before the faster significator leaves its current sign** — at a sign
/// boundary the significator's rulership changes and any unperfected
/// application is broken (refranation by sign change). We therefore search
/// forward in time for the first exact major aspect that occurs before the
/// faster significator's next sign ingress.
///
/// * `querent_lon` / `querent_speed` — querent ruler's longitude & daily speed.
/// * `quesited_lon` / `quesited_speed` — quesited ruler's longitude & daily speed.
pub fn check_perfection(
    querent_lon: f64,
    quesited_lon: f64,
    querent_speed: f64,
    quesited_speed: f64,
) -> PerfectionResult {
    let q_lon = querent_lon.rem_euclid(360.0);
    let s_lon = quesited_lon.rem_euclid(360.0);

    // 1) Already within orb? Honour the immediate aspect (applying or separating).
    if let Some(asp) = find_aspect(
        q_lon,
        s_lon,
        querent_speed,
        quesited_speed,
        AspectType::MAJOR,
        1.0,
    ) {
        let is_applying =
            asp.direction == AspectDirection::Applying || asp.direction == AspectDirection::Exact;

        if !is_applying {
            // Separating aspect now — the matter has already passed; do not
            // claim perfection. (A future application could still occur after
            // the bodies separate and re-approach, but a separating aspect is
            // never itself a perfection.)
            return PerfectionResult {
                outcome: PerfectionOutcome::NoPerfection,
                aspect: Some(asp.aspect_type),
                orb_deg: Some(asp.orb_deg),
                is_applying: false,
                perfects_in_days: None,
            };
        }

        return PerfectionResult {
            outcome: perfection_outcome_for(asp.aspect_type),
            aspect: Some(asp.aspect_type),
            orb_deg: Some(asp.orb_deg),
            is_applying: true,
            perfects_in_days: None,
        };
    }

    // 2) Not yet in orb — search forward for a future perfection that occurs
    //    before the faster significator changes sign.
    if let Some((aspect, days)) = forward_perfection(q_lon, s_lon, querent_speed, quesited_speed) {
        return PerfectionResult {
            outcome: perfection_outcome_for(aspect),
            aspect: Some(aspect),
            orb_deg: Some(0.0), // perfects exactly at the future moment
            is_applying: true,
            perfects_in_days: Some(days),
        };
    }

    PerfectionResult {
        outcome: PerfectionOutcome::NoPerfection,
        aspect: None,
        orb_deg: None,
        is_applying: false,
        perfects_in_days: None,
    }
}

/// Search forward (assuming uniform motion) for the first exact major aspect
/// between two significators that perfects **before the faster significator
/// leaves its current sign**. Returns `(aspect_type, days_until_exact)`.
///
/// Linear-motion model: longitudes advance at their given daily speeds. We
/// bound the look-ahead by the time the faster body reaches its next sign
/// boundary (perfection after a sign change is broken by refranation, per
/// Lilly I, ch.21).
fn forward_perfection(
    q_lon: f64,
    s_lon: f64,
    q_speed: f64,
    s_speed: f64,
) -> Option<(AspectType, f64)> {
    // Horizon = time (days) until EITHER significator reaches its next sign
    // boundary, whichever is sooner. Crossing a sign boundary breaks the
    // application (refranation), so any perfection must occur before then.
    let horizon = sign_change_horizon(q_lon, q_speed)
        .into_iter()
        .chain(sign_change_horizon(s_lon, s_speed))
        .filter(|d| *d > 0.0)
        .fold(f64::INFINITY, f64::min);

    // Both bodies effectively motionless (geometry frozen) ⇒ no forward
    // perfection; or already at a boundary (horizon ~0) ⇒ no in-sign window.
    if !horizon.is_finite() || horizon < 1e-6 {
        return None;
    }

    // Fine scan over [0, horizon] detecting the first exact major aspect by
    // sign change of (separation − aspect_angle). Step is small relative to
    // the bodies' approach rate so we never skip a crossing.
    let rel_speed = (q_speed - s_speed).abs();
    if rel_speed < 1e-9 {
        return None; // no relative motion → separation never changes
    }
    // ~0.25° of relative motion per step keeps the scan well below any orb,
    // capped at the horizon so we never step past the sign boundary.
    let step = (0.25 / rel_speed).min(horizon).max(1e-6);

    let separation = |t: f64| -> f64 {
        let ql = (q_lon + q_speed * t).rem_euclid(360.0);
        let sl = (s_lon + s_speed * t).rem_euclid(360.0);
        angular_distance(ql, sl)
    };

    let mut best: Option<(AspectType, f64)> = None;
    let mut t = 0.0;
    let mut prev_sep = separation(0.0);
    while t < horizon {
        let next_t = (t + step).min(horizon);
        let next_sep = separation(next_t);

        for &asp in AspectType::MAJOR {
            let target = asp.angle_deg();
            let g0 = prev_sep - target;
            let g1 = next_sep - target;
            // A perfection occurs when (separation − aspect_angle) reaches 0
            // while *approaching* it. Sign change is the general case and we
            // interpolate the crossing time. For conjunction/opposition the
            // folded separation can touch 0 without a sign change — accept that
            // only while still tightening (|g1| < |g0|), never on a separating
            // aspect.
            let sign_change = g0 * g1 < 0.0;
            let approaching_touch = g1.abs() < step * rel_speed && g1.abs() < g0.abs();
            if g0 == 0.0 || sign_change || approaching_touch {
                let cross = if sign_change && (g1 - g0).abs() > 1e-12 {
                    t + step * (g0 / (g0 - g1))
                } else {
                    next_t
                };
                if cross <= horizon && best.as_ref().is_none_or(|(_, bt)| cross < *bt) {
                    best = Some((asp, cross));
                }
            }
        }

        prev_sep = next_sep;
        if next_t == horizon {
            break;
        }
        t = next_t;
    }
    best
}

/// Days until a body at `lon` moving at `speed` deg/day reaches the next 30°
/// sign boundary in its direction of travel. `None` when motionless.
fn sign_change_horizon(lon: f64, speed: f64) -> Option<f64> {
    if speed.abs() < 1e-9 {
        return None;
    }
    let pos = lon.rem_euclid(360.0);
    let within = pos.rem_euclid(30.0);
    let deg_to_boundary = if speed > 0.0 {
        30.0 - within
    } else {
        // Moving retrograde: distance back to the start of the current sign.
        if within == 0.0 { 30.0 } else { within }
    };
    Some(deg_to_boundary / speed.abs())
}

// ── Moon's last and next aspect (translation / collection of light) ─

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoonAspectInfo {
    pub aspect_type: AspectType,
    pub planet_name: String,
    pub orb_deg: f64,
    pub direction: AspectDirection,
}

/// Find the Moon's most recent separating aspect and next applying aspect
/// from a set of planet positions.
///
/// Returns `(last_aspect, next_aspect)`.
pub fn moon_last_next_aspect(
    moon_lon: f64,
    moon_speed: f64,
    planets: &[(String, f64, f64)], // (name, lon, speed)
) -> (Option<MoonAspectInfo>, Option<MoonAspectInfo>) {
    let mut last: Option<(MoonAspectInfo, f64)> = None; // tightest separating
    let mut next: Option<(MoonAspectInfo, f64)> = None; // tightest applying

    for (name, p_lon, p_speed) in planets {
        if let Some(asp) = find_aspect(
            moon_lon,
            *p_lon,
            moon_speed,
            *p_speed,
            AspectType::MAJOR,
            1.0,
        ) {
            let info = MoonAspectInfo {
                aspect_type: asp.aspect_type,
                planet_name: name.clone(),
                orb_deg: asp.orb_deg,
                direction: asp.direction,
            };
            match asp.direction {
                AspectDirection::Separating => {
                    if last.as_ref().is_none_or(|(_, o)| asp.orb_deg < *o) {
                        last = Some((info, asp.orb_deg));
                    }
                }
                AspectDirection::Applying | AspectDirection::Exact => {
                    if next.as_ref().is_none_or(|(_, o)| asp.orb_deg < *o) {
                        next = Some((info, asp.orb_deg));
                    }
                }
            }
        }
    }

    (last.map(|(i, _)| i), next.map(|(i, _)| i))
}

// ── Lilly's Essential Dignities Scoring (Christian Astrology, 1647) ─

/// Full breakdown of a planet's essential dignity per Lilly's point system.
///
/// Source: William Lilly, *Christian Astrology* (1647), Table of Essential Dignities.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EssentialDignityScore {
    pub planet: &'static str,
    pub sign: usize,
    pub degree: f64,
    pub domicile: i8,   // +5
    pub exaltation: i8, // +4
    pub triplicity: i8, // +3
    pub term: i8,       // +2
    pub face: i8,       // +1
    pub detriment: i8,  // -5
    pub fall: i8,       // -4
    pub peregrine: i8,  // -5
    pub total: i8,
}

/// Triplicity rulers with day/night distinction per Lilly's horary system.
///
/// Lilly's triplicity rulers (Dorothean):
///   Fire  (Aries, Leo, Sag):   Day=Sun,    Night=Jupiter
///   Earth (Taurus, Vir, Cap):  Day=Venus,  Night=Moon
///   Air   (Gemini, Lib, Aqu):  Day=Saturn, Night=Mercury
///   Water (Cancer, Sco, Pis):  Day=Mars,   Night=Mars (some authorities: Moon)
fn is_triplicity_ruler_lilly(planet: &str, sign: usize, is_day: bool) -> bool {
    let element = sign % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water (Aries=0 mod 4=0, Tau=1 mod 4=1, etc.)
    match element {
        0 => {
            // Fire
            if is_day {
                planet == "Sun"
            } else {
                planet == "Jupiter"
            }
        }
        1 => {
            // Earth
            if is_day {
                planet == "Venus"
            } else {
                planet == "Moon"
            }
        }
        2 => {
            // Air
            if is_day {
                planet == "Saturn"
            } else {
                planet == "Mercury"
            }
        }
        3 => {
            // Water
            // Lilly gives Mars for both day and night in water triplicity
            planet == "Mars"
        }
        _ => false,
    }
}

/// Canonical planet name lookup. Returns a &'static str if recognized, None otherwise.
fn canonical_planet(planet: &str) -> Option<&'static str> {
    match planet {
        "Sun" => Some("Sun"),
        "Moon" => Some("Moon"),
        "Mercury" => Some("Mercury"),
        "Venus" => Some("Venus"),
        "Mars" => Some("Mars"),
        "Jupiter" => Some("Jupiter"),
        "Saturn" => Some("Saturn"),
        _ => None,
    }
}

/// Compute Lilly's essential dignity score for a planet at a given sign and degree.
///
/// * `planet` — one of "Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn".
/// * `sign`   — 0=Aries .. 11=Pisces.
/// * `degree` — degree within the sign (0.0 .. 29.999).
/// * `is_day` — true for a day chart (Sun above horizon), false for night.
///
/// Scoring per Lilly:
///   Domicile +5, Exaltation +4, Triplicity +3, Term +2, Face +1,
///   Detriment -5, Fall -4, Peregrine -5.
///
/// Peregrine applies only when the planet has ZERO positive essential dignities.
pub fn essential_dignity_score_lilly(
    planet: &str,
    sign: usize,
    degree: f64,
    is_day: bool,
) -> EssentialDignityScore {
    let canon = canonical_planet(planet).unwrap_or(planet);
    let s = sign % 12;
    let d = degree.clamp(0.0, 29.999);

    let domicile: i8 = if is_domicile(canon, s) { 5 } else { 0 };
    let exaltation: i8 = if is_exaltation(canon, s) { 4 } else { 0 };
    let triplicity: i8 = if is_triplicity_ruler_lilly(canon, s, is_day) {
        3
    } else {
        0
    };
    let term: i8 = if is_term_ruler(canon, s, d) { 2 } else { 0 };
    let face: i8 = if is_face_ruler(canon, s, d) { 1 } else { 0 };
    let detriment: i8 = if is_detriment(canon, s) { -5 } else { 0 };
    let fall: i8 = if is_fall(canon, s) { -4 } else { 0 };

    let has_positive = domicile > 0 || exaltation > 0 || triplicity > 0 || term > 0 || face > 0;
    let peregrine: i8 = if !has_positive && detriment == 0 && fall == 0 {
        -5
    } else {
        0
    };

    let total = domicile + exaltation + triplicity + term + face + detriment + fall + peregrine;

    EssentialDignityScore {
        planet: canonical_planet(planet).unwrap_or("Unknown"),
        sign: s,
        degree: d,
        domicile,
        exaltation,
        triplicity,
        term,
        face,
        detriment,
        fall,
        peregrine,
        total,
    }
}

// ── Accidental Dignities (Lilly, simplified) ───────────────────────

/// Compute accidental dignity score for horary use per Lilly's system.
///
/// * `planet`     — planet name (used for oriental/occidental logic).
/// * `house`      — house number 1..12.
/// * `is_retrograde` — true if planet is retrograde.
/// * `speed_ratio`   — actual speed / mean speed (>1 = swift, <1 = slow).
/// * `is_oriental`   — true if planet rises before the Sun; relevant for
///   superior planets (Mars, Jupiter, Saturn). For inferior planets
///   (Mercury, Venus), occidental (rising after Sun) is dignified.
///
/// Simplified accidental scoring per Lilly:
///   House 1: +5, House 10: +5, House 7: +4, House 4: +3
///   Succedent (2,5,8,11): +2
///   Cadent (3,6,9,12): -5
///   Retrograde: -5
///   Direct and swift (speed_ratio > 1.0): +2
///   Oriental (superior) / Occidental (inferior): +2
pub fn accidental_dignity_score_lilly(
    planet: &str,
    house: usize,
    is_retrograde: bool,
    speed_ratio: f64,
    is_oriental: bool,
) -> i8 {
    let mut score: i8 = 0;

    // House position
    match house {
        1 => score += 5,
        10 => score += 5,
        7 => score += 4,
        4 => score += 3,
        2 | 5 | 8 | 11 => score += 2,
        3 | 6 | 9 | 12 => score -= 5,
        _ => {}
    }

    // Motion
    if is_retrograde {
        score -= 5;
    } else if speed_ratio > 1.0 {
        // Direct and swift
        score += 2;
    }

    // Oriental/occidental
    let is_superior = matches!(planet, "Mars" | "Jupiter" | "Saturn");
    let is_inferior = matches!(planet, "Mercury" | "Venus");
    if (is_superior && is_oriental) || (is_inferior && !is_oriental) {
        score += 2;
    }

    score
}

// ── Tests ───────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn default_cusps() -> [f64; 12] {
        // Roughly equal-house from 0° Aries ASC
        [
            0.0, 30.0, 60.0, 90.0, 120.0, 150.0, 180.0, 210.0, 240.0, 270.0, 300.0, 330.0,
        ]
    }

    #[test]
    fn considerations_radical_chart() {
        let cusps = default_cusps();
        let c = considerations(
            15.0,  // ASC at 15° Aries — neither early nor late
            100.0, // Moon at 10° Leo
            13.0,  // Moon speed
            100.0, // Saturn at 10° Leo (house 4, NOT 7th)
            &cusps,
            &[280.0, 40.0, 200.0], // some planet longitudes
        );
        assert!(!c.asc_too_early);
        assert!(!c.asc_too_late);
        assert!(!c.saturn_in_7th);
        // Moon at 100° with planets at 280, 40, 200 — check whether Moon has applying aspect
        // The specifics depend on orb math; what matters is the struct is well-formed.
        // is_radical = all clear flags must be false
        let expected_radical =
            !c.moon_void && !c.saturn_in_7th && !c.asc_too_early && !c.asc_too_late;
        assert_eq!(c.is_radical, expected_radical);
    }

    #[test]
    fn asc_too_early_detected() {
        let cusps = default_cusps();
        let c = considerations(1.5, 100.0, 13.0, 100.0, &cusps, &[280.0]);
        assert!(c.asc_too_early);
        assert!(!c.asc_too_late);
        assert!(!c.is_radical);
    }

    #[test]
    fn asc_too_late_detected() {
        let cusps = default_cusps();
        let c = considerations(28.0, 100.0, 13.0, 100.0, &cusps, &[280.0]);
        assert!(c.asc_too_late);
        assert!(!c.asc_too_early);
        assert!(!c.is_radical);
    }

    #[test]
    fn saturn_in_7th_detected() {
        let cusps = default_cusps();
        // Saturn at 195° = house 7 (cusp 7 = 180°, cusp 8 = 210°)
        let c = considerations(15.0, 100.0, 13.0, 195.0, &cusps, &[280.0]);
        assert!(c.saturn_in_7th);
        assert!(!c.is_radical);
    }

    #[test]
    fn combustion_within_8_5_deg() {
        assert!(is_combust(100.0, 105.0)); // 5° apart
        assert!(is_combust(100.0, 108.0)); // 8° apart
        assert!(!is_combust(100.0, 120.0)); // 20° apart
    }

    #[test]
    fn under_sunbeams_between_8_5_and_17() {
        assert!(!is_under_sunbeams(100.0, 105.0)); // 5° → combust, not beams
        assert!(is_under_sunbeams(100.0, 112.0)); // 12° → under beams
        assert!(!is_under_sunbeams(100.0, 120.0)); // 20° → free
    }

    #[test]
    fn perfection_conjunction_applying() {
        // Querent at 100°, speed 1.2; quesited at 104°, speed 0.5
        // → applying conjunction within 8° orb
        let r = check_perfection(100.0, 104.0, 1.2, 0.5);
        assert_eq!(r.outcome, PerfectionOutcome::Yes);
        assert_eq!(r.aspect, Some(AspectType::Conjunction));
        assert!(r.is_applying);
    }

    #[test]
    fn perfection_square_with_difficulty() {
        // Querent at 5°, quesited at 98° → 93° apart, within 7° orb of square (90°).
        // Querent faster (1.5 vs 0.3) → distance shrinks toward 90° → applying square.
        let r = check_perfection(5.0, 98.0, 1.5, 0.3);
        assert_eq!(r.outcome, PerfectionOutcome::WithDifficulty);
        assert_eq!(r.aspect, Some(AspectType::Square));
    }

    #[test]
    fn perfection_no_aspect() {
        // Querent at 10°, quesited at 55° → 45° apart, no major aspect within orb,
        // and the separation only narrows toward (never reaches) any aspect angle
        // before the quesited leaves its sign → no perfection.
        let r = check_perfection(10.0, 55.0, 1.0, 0.5);
        assert_eq!(r.outcome, PerfectionOutcome::NoPerfection);
        assert!(r.aspect.is_none());
        // No-aspect path must NOT serialize a NaN orb (C5c).
        assert!(r.orb_deg.is_none());
        assert!(r.perfects_in_days.is_none());
    }

    #[test]
    fn perfection_no_aspect_orb_is_none_not_nan() {
        // Regression for C5c: the no-perfection branch must use `None`, never a
        // NaN sentinel (which serde_json renders as `null` with no round-trip
        // and breaks any consumer doing arithmetic on the field).
        let r = check_perfection(10.0, 55.0, 1.0, 0.5);
        assert_eq!(r.outcome, PerfectionOutcome::NoPerfection);
        assert!(
            r.orb_deg.is_none(),
            "orb_deg must be None, was {:?}",
            r.orb_deg
        );
        // And whenever orb_deg IS present it must be finite.
        if let Some(orb) = r.orb_deg {
            assert!(orb.is_finite());
        }
    }

    #[test]
    fn perfection_future_before_sign_change() {
        // C5a: significators NOT yet in orb now, but the faster one applies to
        // an exact aspect before it changes sign.
        // Querent at 0° Aries moving +2°/day, quesited fixed at 100°.
        //   • initial separation = 100° → outside every major-aspect orb
        //     (nearest is square 90°, diff 10° > 7° orb).
        //   • separation narrows 2°/day; reaches the 90° square exactly at
        //     t = 5 days.
        //   • querent reaches its 30° sign boundary at t = 15 days, so the
        //     square perfects well before the sign change.
        let r = check_perfection(0.0, 100.0, 2.0, 0.0);
        assert_eq!(r.aspect, Some(AspectType::Square));
        assert_eq!(r.outcome, PerfectionOutcome::WithDifficulty);
        assert!(r.is_applying);
        let days = r.perfects_in_days.expect("future perfection has a time");
        assert!((days - 5.0).abs() < 0.3, "expected ~5 days, got {days}");
    }

    #[test]
    fn perfection_denied_when_sign_changes_first() {
        // Faster significator would reach the aspect angle only AFTER leaving
        // its current sign → refranation by sign change → no perfection.
        // Querent at 29° Aries moving +2°/day reaches its 30° boundary in just
        // 0.5 day. Quesited fixed at 130°: initial separation 101° (outside the
        // 90° square's 7° orb), would need ~5.5° of querent motion (~2.75 days)
        // to reach the square — long after the 0.5-day boundary. So no aspect
        // perfects in-sign.
        let r = check_perfection(29.0, 130.0, 2.0, 0.0);
        assert_eq!(r.outcome, PerfectionOutcome::NoPerfection);
        assert!(r.aspect.is_none());
        assert!(r.orb_deg.is_none());
    }

    #[test]
    fn check_perfection_normalizes_longitudes() {
        // Raw longitudes ≥ 360 must behave like their normalized form.
        let r_raw = check_perfection(460.0, 464.0, 1.2, 0.5); // 100° / 104°
        let r_norm = check_perfection(100.0, 104.0, 1.2, 0.5);
        assert_eq!(r_raw.outcome, r_norm.outcome);
        assert_eq!(r_raw.aspect, r_norm.aspect);
    }

    #[test]
    fn moon_last_next_aspects() {
        let planets = vec![
            ("Sun".into(), 280.0_f64, 1.0_f64),
            ("Jupiter".into(), 220.0, 0.1),
            ("Venus".into(), 165.0, 1.2),
        ];
        let (last, next) = moon_last_next_aspect(100.0, 13.0, &planets);
        // At 100° Moon, 280° Sun → 180° apart → opposition within orb
        // Whether last or next depends on applying/separating
        // Just verify the function returns coherent results without panic
        let has_some = last.is_some() || next.is_some();
        assert!(
            has_some,
            "Moon should find at least one aspect among 3 planets"
        );
    }

    #[test]
    fn house_for_topic_mapping() {
        assert_eq!(house_for_topic("career"), 10);
        assert_eq!(house_for_topic("marriage"), 7);
        assert_eq!(house_for_topic("money"), 2);
        assert_eq!(house_for_topic("children"), 5);
        assert_eq!(house_for_topic("unknown_topic"), 7); // default
    }

    #[test]
    fn sign_ruler_traditional() {
        assert_eq!(sign_ruler(0), "Mars"); // Aries
        assert_eq!(sign_ruler(1), "Venus"); // Taurus
        assert_eq!(sign_ruler(4), "Sun"); // Leo
        assert_eq!(sign_ruler(9), "Saturn"); // Capricorn
        assert_eq!(sign_ruler(11), "Jupiter"); // Pisces
    }

    // ── Lilly essential dignity tests ──────────────────────────────

    #[test]
    fn lilly_sun_in_leo_domicile() {
        // Sun in Leo (sign 4) = domicile (+5)
        let s = essential_dignity_score_lilly("Sun", 4, 15.0, true);
        assert_eq!(s.domicile, 5);
        assert_eq!(s.detriment, 0);
        assert_eq!(s.fall, 0);
        assert_eq!(s.peregrine, 0);
        assert!(
            s.total >= 5,
            "Sun in Leo total should be >= 5, got {}",
            s.total
        );
    }

    #[test]
    fn lilly_sun_in_aries_exaltation() {
        // Sun exalted in Aries (sign 0), day chart = triplicity ruler too
        let s = essential_dignity_score_lilly("Sun", 0, 19.0, true);
        assert_eq!(s.exaltation, 4);
        assert_eq!(s.triplicity, 3); // Sun = day ruler of fire
        assert!(
            s.total >= 7,
            "Sun in Aries day chart should score >= 7, got {}",
            s.total
        );
    }

    #[test]
    fn lilly_sun_in_aquarius_detriment() {
        // Sun in Aquarius (sign 10) = detriment (-5)
        let s = essential_dignity_score_lilly("Sun", 10, 15.0, true);
        assert_eq!(s.detriment, -5);
        assert_eq!(s.domicile, 0);
        assert_eq!(s.peregrine, 0); // detriment precludes peregrine
        assert!(
            s.total < 0,
            "Sun in Aquarius should be negative, got {}",
            s.total
        );
    }

    #[test]
    fn lilly_moon_in_scorpio_fall() {
        // Moon in Scorpio (sign 7) = fall (-4)
        let s = essential_dignity_score_lilly("Moon", 7, 20.0, false);
        assert_eq!(s.fall, -4);
        assert_eq!(s.peregrine, 0); // fall precludes peregrine
    }

    #[test]
    fn lilly_peregrine_no_dignity() {
        // Moon in Aries (sign 0): not domicile, not exalted, not triplicity (earth=Moon night),
        // not face or term at 15 deg. Should be peregrine.
        let s = essential_dignity_score_lilly("Moon", 0, 15.0, true);
        assert_eq!(s.domicile, 0);
        assert_eq!(s.exaltation, 0);
        assert_eq!(s.triplicity, 0);
        // Peregrine only if also no term and no face
        if s.term == 0 && s.face == 0 {
            assert_eq!(s.peregrine, -5);
            assert_eq!(s.total, -5);
        }
    }

    #[test]
    fn lilly_triplicity_day_vs_night() {
        // Fire sign (Aries = 0): Day ruler = Sun, Night ruler = Jupiter
        let day = essential_dignity_score_lilly("Sun", 0, 5.0, true);
        let night = essential_dignity_score_lilly("Sun", 0, 5.0, false);
        assert_eq!(day.triplicity, 3); // Sun is day ruler of fire
        assert_eq!(night.triplicity, 0); // Sun is NOT night ruler of fire

        let jup_night = essential_dignity_score_lilly("Jupiter", 0, 5.0, false);
        assert_eq!(jup_night.triplicity, 3); // Jupiter is night ruler of fire
    }

    #[test]
    fn lilly_term_and_face_contribute() {
        // Jupiter in Aries at 3 deg: term ruler is Jupiter (0-5), face = Mars (first decan)
        let s = essential_dignity_score_lilly("Jupiter", 0, 3.0, true);
        assert_eq!(s.term, 2); // Jupiter rules 0-5 in Aries per Egyptian terms
    }

    #[test]
    fn lilly_total_calculation() {
        // Venus in Taurus (sign 1): domicile (+5)
        // Day chart: triplicity = Venus for earth day (+3)
        // At degree 10: term ruler for Taurus 8-14 = Mercury, so no term
        let s = essential_dignity_score_lilly("Venus", 1, 10.0, true);
        assert_eq!(s.domicile, 5);
        assert_eq!(s.triplicity, 3);
        let expected = s.domicile
            + s.exaltation
            + s.triplicity
            + s.term
            + s.face
            + s.detriment
            + s.fall
            + s.peregrine;
        assert_eq!(s.total, expected, "Total should equal sum of components");
    }

    // ── Accidental dignity tests ───────────────────────────────────

    #[test]
    fn accidental_angular_houses() {
        // House 1: +5, House 10: +5, House 7: +4, House 4: +3
        assert_eq!(
            accidental_dignity_score_lilly("Mars", 1, false, 1.5, true),
            5 + 2 + 2
        ); // angular + swift + oriental
        assert_eq!(
            accidental_dignity_score_lilly("Mars", 10, false, 0.8, false),
            5
        ); // angular only
        assert_eq!(
            accidental_dignity_score_lilly("Mars", 7, false, 0.8, false),
            4
        ); // 7th house
        assert_eq!(
            accidental_dignity_score_lilly("Mars", 4, false, 0.8, false),
            3
        ); // 4th house
    }

    #[test]
    fn accidental_cadent_penalty() {
        // Cadent house: -5
        let score = accidental_dignity_score_lilly("Jupiter", 6, false, 0.8, false);
        assert_eq!(score, -5);
    }

    #[test]
    fn accidental_retrograde_penalty() {
        // Retrograde in angular house: +5 - 5 = 0
        let score = accidental_dignity_score_lilly("Saturn", 1, true, 0.5, false);
        assert_eq!(score, 0); // +5 angular, -5 retrograde
    }

    #[test]
    fn accidental_oriental_superior_occidental_inferior() {
        // Mars (superior) oriental: +2
        let mars_oriental = accidental_dignity_score_lilly("Mars", 2, false, 0.8, true);
        let mars_occidental = accidental_dignity_score_lilly("Mars", 2, false, 0.8, false);
        assert_eq!(mars_oriental - mars_occidental, 2);

        // Venus (inferior) occidental (is_oriental=false): +2
        let venus_occidental = accidental_dignity_score_lilly("Venus", 2, false, 0.8, false);
        let venus_oriental = accidental_dignity_score_lilly("Venus", 2, false, 0.8, true);
        assert_eq!(venus_occidental - venus_oriental, 2);
    }
}
