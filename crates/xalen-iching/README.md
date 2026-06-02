# xalen-iching
> The I Ching (Yijing, Book of Changes) in pure Rust — 64 hexagrams, 8 trigrams, date-based casting, nuclear and relating hexagrams.

Part of the [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) suite — pure-Rust, thread-safe, Apache-2.0.

## Features
- **64 hexagrams** — the complete King Wen sequence as a static table, each carrying its number (1–64), English and Chinese names, upper/lower trigrams, six `Line`s, and brief judgment (Tuan) and image (Xiang) text. Look up by number with `hexagram(n)`.
- **8 trigrams (Ba Gua / 八卦)** — the `Trigram` enum with `lines()`, `name_en()`, `name_zh()`, `attribute()`, and the Unicode `symbol()` (☰ ☷ ☳ ☵ ☶ ☴ ☲ ☱). Build a hexagram from a trigram pair via `hexagram_from_trigrams`, or recover a trigram from its lines with `trigram_from_lines`.
- **Date-based casting** — `hexagram_from_date` derives a `HexagramReading` (primary hexagram, changing line, relating hexagram) from a date and hour using the Mei Hua Yi Shu (Plum Blossom Numerology) method.
- **Derived hexagrams** — `nuclear_hexagram` (inner trigrams), `relating_hexagram` (flip a changing line), and `opposite_hexagram` (flip all six lines).
- **`Line` helpers** — `Yang`/`Yin` with `is_yang()` and `flip()`.
- Public types derive `serde` (`Hexagram` and the enums are `Serialize + Deserialize`; `HexagramReading` is `Serialize` only, as it holds `&'static` references into the compiled table).

## Usage
```rust
use xalen_iching::{hexagram_from_trigrams, hexagram_from_date, nuclear_hexagram, Trigram};

// Heaven over Heaven = hexagram 1, The Creative.
let creative = hexagram_from_trigrams(Trigram::Qian, Trigram::Qian);
assert_eq!(creative.number, 1);
assert_eq!(creative.name_en, "The Creative");

// The nuclear hexagram of The Creative is itself.
assert_eq!(nuclear_hexagram(creative).number, 1);

// Cast a reading from a date/time (Plum Blossom method).
let reading = hexagram_from_date(2024, 6, 15, 10);
println!(
    "Primary: {} ({}), changing line {}, relating: {}",
    reading.primary.name_en,
    reading.primary.name_zh,
    reading.changing_line + 1,
    reading.relating.name_en,
);
```

## Accuracy & sources
The 64 hexagrams follow the King Wen sequence. The bundled judgment (Thwan) and image (Great Symbolism) text is taken verbatim from James Legge, *The Yî King*, Sacred Books of the East Vol. XVI (1882) — public domain. Legge's editorial parentheticals (e.g. "(represents)") and diacritics (ă, ĕ, ǔ) are preserved as published. Date casting uses the Mei Hua Yi Shu (Plum Blossom) trigram derivation. See [ACCURACY.md](../../docs/ACCURACY.md) and [CREDITS.md](../../CREDITS.md) for methods, references, and limitations.

## License
Licensed under Apache-2.0. See [LICENSE](../../LICENSE).
