# Medieval-Epoch Validation — XALEN Analytical Ephemeris vs JPL Horizons

**What this is:** an independent, third-party cross-check of the XALEN
**analytical** ephemeris (`Vsop87Provider`, Tier 0 — VSOP87A planets + truncated
Meeus/ELP Moon) at five dates spanning **AD 500 – 1700**, against
**JPL Horizons** (the authoritative DE441 numerical integration), fetched live
from the public Horizons API.

**Why it matters:** it provides real evidence of how the *analytical* engine
behaves at historical/medieval epochs **without hosting the 3 GB DE441 binary
kernel**. The reference numbers come straight from JPL's online service, so the
accuracy claim is grounded in an external authority rather than self-comparison.

> **Anti-fabrication statement.** Every Horizons number in the tables below was
> fetched from `https://ssd.jpl.nasa.gov/api/horizons.api` (DE441) during this
> validation run — not estimated, not interpolated, not recalled. The exact
> request parameters are given in §4 and two complete sample URLs are pasted
> verbatim. Anyone can reproduce them. XALEN numbers come from
> `cargo run -p xalen-ephem --example validate_medieval --release`.

---

## 1. Method

- **Quantity compared:** apparent geocentric ecliptic **longitude** of date
  (Horizons quantity **31**, `ObsEcLon`, geocentric observer `500@399`,
  apparent place — light-time + aberration + nutation + precession to the
  true equinox of date). XALEN's `geocentric_ecliptic` applies exactly the same
  chain (light-time iteration → IAU 2006/P03 precession → IAU 2000B nutation →
  Bradley aberration), so the two are directly comparable.
- **Epochs:** five dates at **12:00:00 TT**, listed below. Pre-1582-10-15 dates
  are Julian-calendar (Horizons "Mixed" calendar mode); 1700-06-21 is Gregorian.
- **Time-scale handling — no ΔT or calendar ambiguity.** Both sides are driven by
  the **identical absolute instant**, expressed as a Julian Date in the **TT**
  scale. Horizons was queried with `TLIST_TYPE='JD'` + `TIME_TYPE='TT'`; XALEN's
  provider takes `JdTT(jd)` directly. Because the comparison is anchored on the
  same JD(TT), no ΔT model and no calendar-interpretation step enters the
  residual — the only thing under test is the position model itself.
- **JD ↔ date check:** each JD was echoed back by Horizons as the intended
  calendar date (e.g. JD 1903763.0 → `0500-Mar-21 12:00:00.000 TT`), confirming
  the instant mapping.

| Date (12:00 TT) | Calendar | JD (TT) |
|---|---|---|
| 0500-03-21 | Julian | 1903763.0 |
| 0800-06-21 | Julian | 2013430.0 |
| 1100-09-23 | Julian | 2123099.0 |
| 1400-12-21 | Julian | 2232763.0 |
| 1700-06-21 | Gregorian | 2342144.0 |

**Bodies & Horizons targets.** Sun (`10`), Moon (`301`), Mercury (`199`),
Venus (`299`) were taken as body centres. Mars/Jupiter/Saturn body centres
(`499/599/699`) have **no Horizons coverage before AD 1600**, so their
**system barycenters** (`4/5/6`, DE441) were used. For Mars the planet↔barycenter
difference is nil (negligible satellite mass); for Jupiter and Saturn the
geocentric-longitude offset between planet centre and system barycenter is at
the **sub-arcsecond** level at 4–10 AU and is the only known systematic in those
two rows (it does not change any conclusion below).

---

## 2. Residual table (arcseconds, XALEN − Horizons, longitude, 360°-wrapped)

A positive value means XALEN's longitude is larger than Horizons'.

| Body | 0500-03-21 | 0800-06-21 | 1100-09-23 | 1400-12-21 | 1700-06-21 | max \|res\| |
|---|---:|---:|---:|---:|---:|---:|
| Sun     |  +3.45 |  +2.76 |  +2.59 |  +2.22 |  +0.63 |  3.45 |
| Moon    |  +1.02 | −17.27 |  +8.60 |  −7.39 |  −1.98 | 17.27 |
| Mercury |  +3.61 |  +2.73 |  +2.80 |  +2.15 |  +0.64 |  3.61 |
| Venus   |  +3.68 |  +2.76 |  +2.77 |  +2.14 |  +0.70 |  3.68 |
| Mars    |  +6.74 |  +2.63 |  +1.74 |  +1.21 |  +0.36 |  6.74 |
| Jupiter |  +1.39 |  +0.77 |  +1.41 |  +1.75 |  +0.88 |  1.75 |
| Saturn  |  −0.26 |  +0.16 |  +0.33 |  +0.55 |  +0.61 |  0.61 |

**Aggregate residuals (absolute, longitude):**

| Set | max | mean \|res\| | RMS |
|---|---:|---:|---:|
| All 7 bodies | 17.27″ | 2.65″ | 4.13″ |
| Planets (Me,Ve,Ma,Ju,Sa) | 6.74″ | 1.79″ | 2.31″ |
| Sun | 3.45″ | 2.33″ | — |
| Moon | 17.27″ | 7.25″ | — |

---

## 3. Raw values used

### XALEN (`cargo run -p xalen-ephem --example validate_medieval --release`)
```
body,date,xalen_lon_deg
Sun,0500-03-21,2.5688336
Sun,0800-06-21,93.2411635
Sun,1100-09-23,186.6265001
Sun,1400-12-21,278.7819839
Sun,1700-06-21,89.9256374
Moon,0500-03-21,65.7756308
Moon,0800-06-21,43.2221368
Moon,1100-09-23,42.0540916
Moon,1400-12-21,342.8352191
Moon,1700-06-21,150.5501660
Mercury,0500-03-21,335.1327001
Mercury,0800-06-21,105.8042913
Mercury,1100-09-23,197.5256604
Mercury,1400-12-21,266.0729145
Mercury,1700-06-21,71.1865570
Venus,0500-03-21,316.4010606
Venus,0800-06-21,133.7309203
Venus,1100-09-23,222.6659373
Venus,1400-12-21,286.2370585
Venus,1700-06-21,135.2841290
Mars,0500-03-21,200.7106723
Mars,0800-06-21,85.6677509
Mars,1100-09-23,260.1035389
Mars,1400-12-21,207.3519944
Mars,1700-06-21,219.1579163
Jupiter,0500-03-21,220.2044228
Jupiter,0800-06-21,343.6199046
Jupiter,1100-09-23,107.0419300
Jupiter,1400-12-21,214.2660683
Jupiter,1700-06-21,300.6275333
Saturn,0500-03-21,55.7252269
Saturn,0800-06-21,135.3321025
Saturn,1100-09-23,210.1672926
Saturn,1400-12-21,279.6921023
Saturn,1700-06-21,344.3523246
```

### JPL Horizons `ObsEcLon` (DE441) — fetched values
```
body,date,horizons_ObsEcLon_deg
Sun,0500-03-21,2.5678761
Sun,0800-06-21,93.2403965
Sun,1100-09-23,186.6257805
Sun,1400-12-21,278.7813676
Sun,1700-06-21,89.9254635
Moon,0500-03-21,65.7753467
Moon,0800-06-21,43.2269336
Moon,1100-09-23,42.0517016
Moon,1400-12-21,342.8372726
Moon,1700-06-21,150.5507147
Mercury,0500-03-21,335.1316962
Mercury,0800-06-21,105.8035339
Mercury,1100-09-23,197.5248831
Mercury,1400-12-21,266.0723160
Mercury,1700-06-21,71.1863804
Venus,0500-03-21,316.4000375
Venus,0800-06-21,133.7301535
Venus,1100-09-23,222.6651666
Venus,1400-12-21,286.2364636
Venus,1700-06-21,135.2839353
Mars,0500-03-21,200.7087993
Mars,0800-06-21,85.6670194
Mars,1100-09-23,260.1030568
Mars,1400-12-21,207.3516591
Mars,1700-06-21,219.1578150
Jupiter,0500-03-21,220.2040355
Jupiter,0800-06-21,343.6196907
Jupiter,1100-09-23,107.0415376
Jupiter,1400-12-21,214.2655819
Jupiter,1700-06-21,300.6272883
Saturn,0500-03-21,55.7252992
Saturn,0800-06-21,135.3320587
Saturn,1100-09-23,210.1672020
Saturn,1400-12-21,279.6919493
Saturn,1700-06-21,344.3521563
```
(Mars/Jupiter/Saturn are the DE441 **barycenters** `4/5/6` — see §1.)

---

## 4. Exact Horizons API requests (reproducible)

All requests used the public endpoint with these common parameters:

```
format=text   OBJ_DATA='NO'   MAKE_EPHEM='YES'   EPHEM_TYPE='OBSERVER'
CENTER='500@399'              (geocentric observer)
TLIST_TYPE='JD'   TIME_TYPE='TT'
TLIST='1903763.0 2013430.0 2123099.0 2232763.0 2342144.0'
QUANTITIES='31'   ANG_FORMAT='DEG'   CSV_FORMAT='YES'
COMMAND='<target code>'       (10 Sun, 301 Moon, 199 Mercury, 299 Venus,
                               4 Mars-bary, 5 Jupiter-bary, 6 Saturn-bary)
```

Two complete sample URLs (paste into a browser to reproduce):

**Sun (`COMMAND=10`):**
```
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='10'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&TLIST_TYPE='JD'&TIME_TYPE='TT'&TLIST='1903763.0 2013430.0 2123099.0 2232763.0 2342144.0'&QUANTITIES='31'&ANG_FORMAT='DEG'&CSV_FORMAT='YES'
```

**Mars barycenter (`COMMAND=4`):**
```
https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='4'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&TLIST_TYPE='JD'&TIME_TYPE='TT'&TLIST='1903763.0 2013430.0 2123099.0 2232763.0 2342144.0'&QUANTITIES='31'&ANG_FORMAT='DEG'&CSV_FORMAT='YES'
```

Reported by Horizons for every request: `API VERSION: 1.2`,
`{source: DE441}`, `Calendar mode: Mixed Julian/Gregorian`.

---

## 5. Honest accuracy summary

At **medieval epochs (AD 500 – 1700)** the XALEN analytical engine, judged
against JPL Horizons / DE441, holds up well and degrades **gracefully**:

- **Planets (Mercury–Saturn): max 6.74″, RMS ≈ 2.3″.** Sub-arcminute across the
  whole range. The outer planets are the best (Saturn ≤ 0.61″, Jupiter ≤ 1.75″);
  the largest single planet residual is **Mars at AD 500 (6.74″)**, consistent
  with VSOP87A's known growth in the inner-planet terms toward the −1500…−4000
  edge of its validity. There is a small common ~2–3″ offset shared by Sun and
  the inner planets (largest at AD 500, shrinking toward 1700), the signature of
  a sub-arcsec-per-century model/precession-bias term integrated over ~1500 yr —
  it is well within the engine's stated tier.
- **Sun: max 3.45″** — essentially the same ~2–3″ shared offset.
- **Moon: max 17.27″ (at AD 800), mean ≈ 7.25″.** As predicted by the source
  (`vsop.rs`: truncated Meeus Ch.47 / ELP series), **the Moon is the worst
  body.** 17″ is ≈ 0.0048° — about 1/100 of a lunar diameter — and stems from
  the **truncated lunar series**, not from any time-scale or precession error
  (the residual is non-monotonic in epoch, which is the fingerprint of series
  truncation rather than a secular drift). This matches the provider's own
  `accuracy_arcsec()` rationale, which reports a physical-body worst case of 75″
  dominated by the Moon across 1850–2150; the medieval Moon here (≤17″ on these
  five epochs) sits comfortably inside that envelope.

**Bottom line.** For chart-scale and historical/archaeo-astronomical work back to
at least AD 500, the analytical provider delivers **arcsecond-to-few-arcsecond**
planetary longitudes and **sub-20″** lunar longitudes — verified against JPL's
own DE441 service. This is more than adequate for sign placements, nakshatras,
and classical-text reconstruction, and it removes any need to **ship or host the
~3 GB DE441 binary kernel purely to claim medieval validity**: the medieval
accuracy is now externally documented from JPL's authoritative reference.

**Where it degrades (stated plainly):** the Moon is the soft spot (tens of
arcsec from ELP/Meeus truncation), and the inner-planet/Sun residual grows
toward the oldest epoch (≈ a few arcsec by AD 500, and Mars reaches ~6.7″ there).
For sub-arcsecond positions at these epochs — e.g. precise occultation or eclipse
contact timing — load the numerical **DE440/DE441** backend instead of the
analytical Tier-0 provider. This validation characterises the **analytical**
engine only.

---

*Reproduce: `cargo run -p xalen-ephem --example validate_medieval --release`
for the XALEN column; the URLs in §4 for the Horizons column.*
