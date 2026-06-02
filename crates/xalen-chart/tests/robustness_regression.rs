//! Regression: malformed/NaN/Inf inputs must not panic and must not leak
//! "NaN"/"inf" tokens into the SVG. Pins the robustness-audit fixes:
//! south_indian house-clamp (usize underflow) + safe_longitude on cusps/ayanamsa
//! across all three renderers.

use xalen_chart::{
    ChartData, PlanetPosition, render_north_indian, render_south_indian, render_western_wheel,
};

fn nasty_chart() -> ChartData {
    ChartData {
        planet_positions: vec![
            // house = 0 previously underflowed usize in south_indian::sign_index_for_house
            PlanetPosition {
                abbreviation: "Su".into(),
                house: 0,
                longitude_deg: f64::NAN,
            },
            PlanetPosition {
                abbreviation: "Mo".into(),
                house: 99,
                longitude_deg: f64::INFINITY,
            },
        ],
        house_cusps_deg: [
            f64::NAN,
            f64::INFINITY,
            f64::NEG_INFINITY,
            0.0,
            30.0,
            60.0,
            90.0,
            120.0,
            150.0,
            180.0,
            210.0,
            240.0,
        ],
        ascendant_sign_index: 0,
        ayanamsa_deg: f64::NAN,
    }
}

fn assert_clean(svg: &str, who: &str) {
    assert!(svg.starts_with("<svg"), "{who}: output is not an SVG");
    assert!(svg.trim_end().ends_with("</svg>"), "{who}: SVG not closed");
    assert!(!svg.contains("NaN"), "{who}: leaked NaN into SVG");
    assert!(!svg.contains("inf"), "{who}: leaked inf into SVG");
}

#[test]
fn nan_inf_and_malformed_house_render_clean_no_panic() {
    let c = nasty_chart();
    assert_clean(&render_north_indian(&c), "north_indian");
    assert_clean(&render_south_indian(&c), "south_indian");
    assert_clean(&render_western_wheel(&c), "western_wheel");
}
