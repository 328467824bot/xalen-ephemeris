use serde::{Deserialize, Serialize};

/// A Sabian Symbol entry for one degree of the zodiac.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
/// A Sabian Symbol for one of the 360 zodiac degrees.
pub struct SabianSymbol {
    /// Absolute degree 1-360 (Aries 1 = 1, Pisces 30 = 360)
    pub degree: u16,
    /// Degree within the sign, 1-30
    pub sign_degree: u8,
    /// Sign name
    pub sign: &'static str,
    /// The symbolic image text
    pub symbol: &'static str,
    /// degree keyword (1-2 words)
    pub keynote: &'static str,
}

/// Degree classification.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
/// Classification of a zodiac degree (critical, anaretic, etc.).
pub enum DegreeType {
    /// Critical degrees: 0/13/26 cardinal, 8-9/21-22 fixed, 4/17 mutable
    Critical,
    /// 29th degree of any sign
    Anaretic,
    /// Neither critical nor anaretic
    Normal,
}

const SIGN_NAMES: [&str; 12] = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
];

/// (symbol, keynote) for each of the 360 degrees, indexed 0-359.
/// Order: Aries 1Â° at index 0 through Pisces 30Â° at index 359.
/// Prose payload removed; structure preserved.
const SYMBOL_DATA: [(&str, &str); 360] = [
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
    ("", ""),
];

/// All 360 Sabian symbols, pre-built as a static array.
static SYMBOLS: std::sync::LazyLock<[SabianSymbol; 360]> = std::sync::LazyLock::new(|| {
    let mut arr: [SabianSymbol; 360] = [SabianSymbol {
        degree: 0,
        sign_degree: 0,
        sign: "",
        symbol: "",
        keynote: "",
    }; 360];
    for i in 0..360 {
        let sign_idx = i / 30;
        let deg_in_sign = (i % 30) + 1;
        let (sym, key) = SYMBOL_DATA[i];
        arr[i] = SabianSymbol {
            degree: (i + 1) as u16,
            sign_degree: deg_in_sign as u8,
            sign: SIGN_NAMES[sign_idx],
            symbol: sym,
            keynote: key,
        };
    }
    arr
});

/// Convert ecliptic longitude (0.0-360.0) to the Sabian degree index (0-359).
///
/// Traditional Sabian convention rounds UP: 0°00'01" through 1°00'00" of Aries
/// maps to "1st degree of Aries" (index 0). Exactly 0.0 maps to 360th degree
/// (Pisces 30°, index 359).
fn longitude_to_index(longitude: f64) -> usize {
    let lng = longitude.rem_euclid(360.0);
    if lng == 0.0 {
        359
    } else {
        (lng.ceil() as usize).saturating_sub(1)
    }
}

/// Look up the Sabian symbol for an absolute ecliptic longitude (0.0-360.0).
///
/// Uses the traditional "round up" convention: 0°00'01"-1°00'00" Aries = degree 1.
pub fn sabian_for_degree(absolute_degree: f64) -> &'static SabianSymbol {
    &SYMBOLS[longitude_to_index(absolute_degree)]
}

/// Look up the Sabian symbol by sign index (0 = Aries .. 11 = Pisces) and
/// degree within the sign (1-30).
///
/// Returns `None` if `sign_index > 11` or `degree` is 0 or > 30.
pub fn sabian_for_sign_degree(sign_index: usize, degree: u8) -> Option<&'static SabianSymbol> {
    if sign_index >= 12 || !(1..=30).contains(&degree) {
        return None;
    }
    let idx = sign_index * 30 + (degree as usize - 1);
    Some(&SYMBOLS[idx])
}

/// Return the Sabian symbol at the opposite point (180° away).
pub fn opposite_sabian(absolute_degree: f64) -> &'static SabianSymbol {
    sabian_for_degree(absolute_degree + 180.0)
}

/// Classify a degree as Critical, Anaretic, or Normal.
///
/// Critical degrees (traditional):
/// - Cardinal signs (Aries/Cancer/Libra/Capricorn): 0°, 13°, 26°
/// - Fixed signs (Taurus/Leo/Scorpio/Aquarius): 8°-9°, 21°-22°
/// - Mutable signs (Gemini/Virgo/Sagittarius/Pisces): 4°, 17°
///
/// Anaretic: 29th degree of any sign (28°00'-28°59').
///
/// Degree values here refer to the integer floor of the degree within the sign
/// (i.e. 13°30' = degree 13).
pub fn degree_type(absolute_degree: f64) -> DegreeType {
    let lng = absolute_degree.rem_euclid(360.0);
    let sign_idx = (lng / 30.0).floor() as usize % 12;
    let deg_in_sign = (lng % 30.0).floor() as u8; // 0-29

    // Anaretic: 29th degree (29°00'-29°59')
    if deg_in_sign == 29 {
        return DegreeType::Anaretic;
    }

    // Modality: 0=cardinal, 1=fixed, 2=mutable
    let modality = match sign_idx {
        0 | 3 | 6 | 9 => 0,  // cardinal
        1 | 4 | 7 | 10 => 1, // fixed
        _ => 2,              // mutable
    };

    match modality {
        0 if deg_in_sign == 0 || deg_in_sign == 13 || deg_in_sign == 26 => DegreeType::Critical,
        1 if (8..=9).contains(&deg_in_sign) || (21..=22).contains(&deg_in_sign) => {
            DegreeType::Critical
        }
        2 if deg_in_sign == 4 || deg_in_sign == 17 => DegreeType::Critical,
        _ => DegreeType::Normal,
    }
}

/// Decanate (face) of a degree.
///
/// Each sign is divided into 3 decanates of 10° each. The ruling sign of each
/// decanate follows the triplicity (element) order:
/// - 1st decanate (0°-9°59'): same sign
/// - 2nd decanate (10°-19°59'): next sign of same element
/// - 3rd decanate (20°-29°59'): third sign of same element
///
/// Returns `(decanate_number, ruler_sign_name)` where decanate_number is 1-3.
pub fn decanate(absolute_degree: f64) -> (usize, &'static str) {
    let lng = absolute_degree.rem_euclid(360.0);
    let sign_idx = (lng / 30.0).floor() as usize % 12;
    let deg_in_sign = (lng % 30.0).floor() as u8;

    let decanate_num = match deg_in_sign {
        0..=9 => 1,
        10..=19 => 2,
        _ => 3,
    };

    // Element order: signs sharing the same element are 4 apart
    // Fire: Ari(0), Leo(4), Sag(8)
    // Earth: Tau(1), Vir(5), Cap(9)
    // Air: Gem(2), Lib(6), Aqu(10)
    // Water: Can(3), Sco(7), Pis(11)
    let ruler_idx = match decanate_num {
        1 => sign_idx,
        2 => (sign_idx + 4) % 12,
        _ => (sign_idx + 8) % 12,
    };

    (decanate_num, SIGN_NAMES[ruler_idx])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn aries_1_degree() {
        let s = sabian_for_degree(0.5);
        assert_eq!(s.degree, 1);
        assert_eq!(s.sign, "Aries");
        assert_eq!(s.sign_degree, 1);
    }

    #[test]
    fn aries_30_degree() {
        let s = sabian_for_sign_degree(0, 30).unwrap();
        assert_eq!(s.degree, 30);
        assert_eq!(s.sign, "Aries");
        assert_eq!(s.sign_degree, 30);
    }

    #[test]
    fn taurus_1_degree() {
        let s = sabian_for_degree(30.1);
        assert_eq!(s.degree, 31);
        assert_eq!(s.sign, "Taurus");
        assert_eq!(s.sign_degree, 1);
    }

    #[test]
    fn pisces_30_degree_wrap() {
        // Exactly 0.0 should map to Pisces 30 (degree 360)
        let s = sabian_for_degree(0.0);
        assert_eq!(s.degree, 360);
        assert_eq!(s.sign, "Pisces");
        assert_eq!(s.sign_degree, 30);
    }

    #[test]
    fn sign_degree_lookup() {
        let s = sabian_for_sign_degree(5, 15).unwrap(); // Virgo 15
        assert_eq!(s.sign, "Virgo");
        assert_eq!(s.sign_degree, 15);
        assert_eq!(s.degree, 165);
    }

    #[test]
    fn opposite_degree() {
        // Aries 1 (0.5°) opposite is Libra 1 (180.5°)
        let opp = opposite_sabian(0.5);
        assert_eq!(opp.sign, "Libra");
        assert_eq!(opp.sign_degree, 1);
        assert_eq!(opp.degree, 181);
    }

    #[test]
    fn wrap_around_360() {
        // 359.5° should be Pisces 30
        let s = sabian_for_degree(359.5);
        assert_eq!(s.degree, 360);
        assert_eq!(s.sign, "Pisces");

        // 360.5° wraps to Aries 1
        let s2 = sabian_for_degree(360.5);
        assert_eq!(s2.degree, 1);
        assert_eq!(s2.sign, "Aries");
    }

    #[test]
    fn critical_degrees_cardinal() {
        // Aries 0° (0.0-0.999...) = critical (cardinal sign, degree 0)
        assert_eq!(degree_type(0.5), DegreeType::Critical);
        assert_eq!(degree_type(0.0), DegreeType::Critical);
        // Aries 1° = normal
        assert_eq!(degree_type(1.0), DegreeType::Normal);
        // Cancer 13°
        assert_eq!(degree_type(90.0 + 13.5), DegreeType::Critical);
        // Libra 26°
        assert_eq!(degree_type(180.0 + 26.3), DegreeType::Critical);
    }

    #[test]
    fn critical_degrees_fixed() {
        // Taurus 9° (fixed sign, 8-9 critical)
        assert_eq!(degree_type(30.0 + 9.0), DegreeType::Critical);
        // Leo 21°
        assert_eq!(degree_type(120.0 + 21.5), DegreeType::Critical);
        // Taurus 10° = normal
        assert_eq!(degree_type(30.0 + 10.5), DegreeType::Normal);
    }

    #[test]
    fn critical_degrees_mutable() {
        // Gemini 4°
        assert_eq!(degree_type(60.0 + 4.2), DegreeType::Critical);
        // Virgo 17°
        assert_eq!(degree_type(150.0 + 17.9), DegreeType::Critical);
        // Gemini 5° = normal
        assert_eq!(degree_type(60.0 + 5.0), DegreeType::Normal);
    }

    #[test]
    fn anaretic_degree() {
        // Aries 29°
        assert_eq!(degree_type(29.5), DegreeType::Anaretic);
        // Pisces 29°
        assert_eq!(degree_type(330.0 + 29.1), DegreeType::Anaretic);
    }

    #[test]
    fn decanate_first() {
        // Aries 5° → 1st decanate, ruler = Aries
        let (dec, ruler) = decanate(5.0);
        assert_eq!(dec, 1);
        assert_eq!(ruler, "Aries");
    }

    #[test]
    fn decanate_second() {
        // Aries 15° → 2nd decanate, ruler = Leo (next fire sign)
        let (dec, ruler) = decanate(15.0);
        assert_eq!(dec, 2);
        assert_eq!(ruler, "Leo");
    }

    #[test]
    fn decanate_third() {
        // Aries 25° → 3rd decanate, ruler = Sagittarius (3rd fire sign)
        let (dec, ruler) = decanate(25.0);
        assert_eq!(dec, 3);
        assert_eq!(ruler, "Sagittarius");
    }

    #[test]
    fn decanate_water_sign() {
        // Cancer 0° → 1st decanate, ruler = Cancer
        let (dec, ruler) = decanate(90.0);
        assert_eq!(dec, 1);
        assert_eq!(ruler, "Cancer");

        // Cancer 12° → 2nd decanate, ruler = Scorpio
        let (dec2, ruler2) = decanate(102.0);
        assert_eq!(dec2, 2);
        assert_eq!(ruler2, "Scorpio");

        // Cancer 22° → 3rd decanate, ruler = Pisces
        let (dec3, ruler3) = decanate(112.0);
        assert_eq!(dec3, 3);
        assert_eq!(ruler3, "Pisces");
    }

    #[test]
    fn all_360_symbols_present() {
        for i in 0..360 {
            let s = &SYMBOLS[i];
            assert_eq!(s.degree, (i + 1) as u16);
            assert_eq!(s.sign, SIGN_NAMES[i / 30]);
            assert_eq!(s.sign_degree, ((i % 30) + 1) as u8);
        }
    }

    #[test]
    fn sign_boundaries() {
        // Last degree of each sign -> first degree of next sign
        for sign_idx in 0..12 {
            let last = sabian_for_sign_degree(sign_idx, 30).unwrap();
            assert_eq!(last.sign, SIGN_NAMES[sign_idx]);
            assert_eq!(last.sign_degree, 30);

            if sign_idx < 11 {
                let first_next = sabian_for_sign_degree(sign_idx + 1, 1).unwrap();
                assert_eq!(first_next.sign, SIGN_NAMES[sign_idx + 1]);
                assert_eq!(first_next.sign_degree, 1);
                assert_eq!(first_next.degree, last.degree + 1);
            }
        }
    }

    #[test]
    fn invalid_sign_index_returns_none() {
        assert!(sabian_for_sign_degree(12, 1).is_none());
    }

    #[test]
    fn invalid_degree_returns_none() {
        assert!(sabian_for_sign_degree(0, 0).is_none());
        assert!(sabian_for_sign_degree(0, 31).is_none());
    }
}
