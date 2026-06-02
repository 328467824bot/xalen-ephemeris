use crate::body::Body;
use xalen_coords::{EclipticPosition, EclipticSpeed};
use xalen_time::{JdTT, JulianDay};

#[derive(Debug, thiserror::Error)]
/// Errors that can occur during ephemeris computation.
pub enum EphemerisError {
    #[error("body {0} not available in this provider")]
    /// The requested body is not supported by this provider.
    BodyNotAvailable(Body),
    #[error("epoch JD {0} outside coverage")]
    /// The requested epoch falls outside the provider's valid date range.
    EpochOutOfRange(f64),
    #[error("computation failed: {0}")]
    /// A numerical or algorithmic error occurred during computation.
    ComputationFailed(String),
    #[error("I/O error: {0}")]
    /// A file I/O error occurred (e.g. reading a binary ephemeris file).
    IoError(#[from] std::io::Error),
    #[error("invalid file format: {0}")]
    /// The binary ephemeris file has an invalid or unsupported format.
    InvalidFormat(String),
}

/// Trait for computing planetary positions at a given epoch.
pub trait EphemerisProvider: Send + Sync {
    /// Compute heliocentric ecliptic position for a body at the given TT epoch.
    fn heliocentric_ecliptic(
        &self,
        body: Body,
        jd_tt: JdTT,
    ) -> Result<EclipticPosition, EphemerisError>;
    /// Compute geocentric ecliptic position for a body at the given TT epoch.
    fn geocentric_ecliptic(
        &self,
        body: Body,
        jd_tt: JdTT,
    ) -> Result<EclipticPosition, EphemerisError>;
    /// Return the valid Julian Date range (start, end) for this provider.
    fn coverage(&self) -> (f64, f64);
    /// Worst-case apparent-longitude accuracy, in arcseconds, for the PHYSICAL
    /// bodies this provider serves (Sun, Moon, planets). Derived auxiliary points
    /// — the lunar nodes especially — are model-sensitive vs. external references
    /// and are characterised separately (see the provider's docs / ACCURACY.md),
    /// not folded into this single figure.
    fn accuracy_arcsec(&self) -> f64;
    /// Human-readable name identifying this provider and its tier.
    fn name(&self) -> &str;

    /// Geocentric ecliptic **speed** (apparent daily motion) for a body, by
    /// central finite difference of [`Self::geocentric_ecliptic`] over ±0.5 day.
    ///
    /// Has a default implementation that works for any provider, so every
    /// backend gets velocity for free. The longitude rate is the astrological
    /// "speed": negative means retrograde. Accurate to ~1e-6 rad/day for smooth
    /// orbits. At a true station the speed is ~0 and its sign is method-sensitive
    /// (the station instant itself has zero speed) — use [`crate::event_search`]
    /// to locate the station precisely.
    fn geocentric_ecliptic_speed(
        &self,
        body: Body,
        jd_tt: JdTT,
    ) -> Result<EclipticSpeed, EphemerisError> {
        use std::f64::consts::{PI, TAU};
        const DT: f64 = 0.5; // days; central difference => the body's daily motion
        let before = self.geocentric_ecliptic(body, JdTT(jd_tt.as_f64() - DT))?;
        let after = self.geocentric_ecliptic(body, JdTT(jd_tt.as_f64() + DT))?;
        let mut dlon = after.longitude - before.longitude;
        if dlon > PI {
            dlon -= TAU;
        } else if dlon < -PI {
            dlon += TAU;
        }
        Ok(EclipticSpeed {
            longitude: dlon / (2.0 * DT),
            latitude: (after.latitude - before.latitude) / (2.0 * DT),
            distance: (after.distance - before.distance) / (2.0 * DT),
        })
    }
}
