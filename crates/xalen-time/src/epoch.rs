use crate::calendar::{CalendarSystem, calendar_to_jd, jd_to_calendar};
use crate::delta_t::DeltaTModel;
use crate::julian::{JdTT, JdUT1};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
/// A fully-specified astronomical epoch combining UT1, calendar, and delta-T model.
pub struct Epoch {
    /// The epoch expressed as a UT1 Julian Date.
    pub jd_ut1: JdUT1,
    /// Calendar system used for date display and input.
    pub calendar: CalendarSystem,
    /// Delta-T model for TT conversion.
    pub delta_t_model: DeltaTModel,
}

impl Epoch {
    /// Create an epoch from a local date/time with timezone offset (hours east of UTC).
    ///
    /// The local time minus the offset yields civil UTC, which is stored in
    /// `jd_ut1` as an **approximation of UT1** (UTC ≈ UT1 to within ±0.9 s — see
    /// [`crate::calendar_to_jd`]). No DUT1 correction is applied; pass an
    /// already-UT1 instant via [`Epoch::from_jd_ut1`] if sub-second UT1 accuracy
    /// is required.
    pub fn new(year: i32, month: u32, day: u32, hour: f64, tz_offset_hours: f64) -> Self {
        let ut_hour = hour - tz_offset_hours;
        let jd = calendar_to_jd(
            year,
            month,
            day,
            ut_hour,
            CalendarSystem::ProlepticGregorian,
        );
        Self {
            jd_ut1: jd,
            calendar: CalendarSystem::ProlepticGregorian,
            delta_t_model: DeltaTModel::StephensonMorrisonHohenkerk2016,
        }
    }

    /// Create an epoch directly from a UT1 Julian Date.
    pub fn from_jd_ut1(jd: f64) -> Self {
        Self {
            jd_ut1: JdUT1(jd),
            calendar: CalendarSystem::ProlepticGregorian,
            delta_t_model: DeltaTModel::StephensonMorrisonHohenkerk2016,
        }
    }

    /// Set the calendar system (builder pattern).
    pub fn with_calendar(mut self, cal: CalendarSystem) -> Self {
        self.calendar = cal;
        self
    }

    /// Set the delta-T model (builder pattern).
    pub fn with_delta_t(mut self, model: DeltaTModel) -> Self {
        self.delta_t_model = model;
        self
    }

    /// Convert this epoch to TT using the configured delta-T model.
    pub fn jd_tt(&self) -> JdTT {
        self.jd_ut1.to_tt(&self.delta_t_model)
    }

    /// Convert this epoch to TT, also returning the 1σ uncertainty envelope of
    /// the conversion.
    ///
    /// The returned `JdTT` is identical to [`Epoch::jd_tt`] — purely additive.
    /// The second element is the **1σ uncertainty of the ΔT (TT−UT1) model in
    /// SECONDS of time** — the time-conversion envelope, NOT a position or
    /// output covariance. Mirrors [`crate::JdUT1::to_tt_with_sigma`].
    pub fn jd_tt_with_sigma(&self) -> (JdTT, f64) {
        self.jd_ut1.to_tt_with_sigma(&self.delta_t_model)
    }

    /// Convert this epoch to a calendar date (year, month, day, hour).
    pub fn to_calendar(&self) -> (i32, u32, u32, f64) {
        jd_to_calendar(self.jd_ut1.0, self.calendar)
    }

    /// Return the decimal year (e.g. 2000.5 for mid-2000).
    pub fn year(&self) -> f64 {
        2000.0 + (self.jd_ut1.0 - 2_451_545.0) / 365.25
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn epoch_pune_ist() {
        let e = Epoch::new(1990, 1, 15, 10.5, 5.5);
        let (y, m, d, h) = e.to_calendar();
        assert_eq!(y, 1990);
        assert_eq!(m, 1);
        assert_eq!(d, 15);
        assert!((h - 5.0).abs() < 0.01, "10:30 IST = 05:00 UTC, got {h}");
    }

    #[test]
    fn epoch_year() {
        let e = Epoch::from_jd_ut1(2_451_545.0);
        assert!((e.year() - 2000.0).abs() < 0.01);
    }
}
