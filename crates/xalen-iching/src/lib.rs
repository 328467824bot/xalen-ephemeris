//! # I Ching (Yijing) — Book of Changes
//!
//! Complete implementation of the 64 hexagram system with 8 trigrams (Ba Gua),
//! date-based hexagram derivation, nuclear hexagrams, and relating hexagrams.
//!
//! ## Text source
//! The judgment (Thwan / T'uan) and image (Great Symbolism / Xiang) text for all
//! 64 hexagrams is taken verbatim from James Legge, *The Yî King*, Sacred Books of
//! the East Vol. XVI (1882) — public domain. Legge's editorial parentheticals
//! (e.g. "(represents)") and diacritics (ă, ĕ, ǔ, etc.) are preserved as published.

use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Line type
// ---------------------------------------------------------------------------

/// A single line of a hexagram.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Line {
    /// ⚊ — solid, active, odd
    Yang,
    /// ⚋ — broken, receptive, even
    Yin,
}

impl Line {
    /// `true` for Yang, `false` for Yin.
    pub fn is_yang(self) -> bool {
        self == Line::Yang
    }

    /// Flip Yang ↔ Yin.
    pub fn flip(self) -> Line {
        match self {
            Line::Yang => Line::Yin,
            Line::Yin => Line::Yang,
        }
    }
}

// ---------------------------------------------------------------------------
// Trigram (Ba Gua)
// ---------------------------------------------------------------------------

/// The eight trigrams (八卦 Ba Gua).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Trigram {
    /// ☰ Heaven, Creative (乾)
    Qian = 0,
    /// ☷ Earth, Receptive (坤)
    Kun = 1,
    /// ☳ Thunder, Arousing (震)
    Zhen = 2,
    /// ☵ Water, Abysmal (坎)
    Kan = 3,
    /// ☶ Mountain, Keeping Still (艮)
    Gen = 4,
    /// ☴ Wind, Gentle (巽)
    Xun = 5,
    /// ☲ Fire, Clinging (離)
    Li = 6,
    /// ☱ Lake, Joyous (兌)
    Dui = 7,
}

impl Trigram {
    pub const ALL: [Trigram; 8] = [
        Trigram::Qian,
        Trigram::Kun,
        Trigram::Zhen,
        Trigram::Kan,
        Trigram::Gen,
        Trigram::Xun,
        Trigram::Li,
        Trigram::Dui,
    ];

    /// Retrieve a trigram by its index (0-7), wrapping on overflow.
    pub fn from_index(i: usize) -> Trigram {
        Trigram::ALL[i % 8]
    }

    /// Map a Pre-Heaven (Xian Tian / Fu Xi) Ba Gua sequence number to a trigram.
    ///
    /// This is the numbering used by Mei Hua Yi Shu (Plum Blossom Numerology):
    ///   1=Qian ☰, 2=Dui ☱, 3=Li ☲, 4=Zhen ☳, 5=Xun ☴, 6=Kan ☵, 7=Gen ☶, 8=Kun ☷.
    ///
    /// The input is reduced `mod 8`; a remainder of 0 maps to the 8th trigram,
    /// Kun, exactly as in the classical method where the divisor 8 yields Kun.
    /// Reference: Shao Yong, *Mei Hua Yi Shu* (Plum Blossom Numerology); the
    /// Pre-Heaven (先天八卦) sequence Qian–Dui–Li–Zhen–Xun–Kan–Gen–Kun.
    pub fn from_pre_heaven_number(n: u64) -> Trigram {
        // Reduce to 1..=8 (remainder 0 -> 8 = Kun).
        let r = n % 8;
        match r {
            1 => Trigram::Qian,
            2 => Trigram::Dui,
            3 => Trigram::Li,
            4 => Trigram::Zhen,
            5 => Trigram::Xun,
            6 => Trigram::Kan,
            7 => Trigram::Gen,
            _ => Trigram::Kun, // r == 0  ->  8th trigram
        }
    }

    /// The three lines of this trigram (bottom to top).
    pub fn lines(self) -> [Line; 3] {
        use Line::*;
        match self {
            Trigram::Qian => [Yang, Yang, Yang], // ☰
            Trigram::Kun => [Yin, Yin, Yin],     // ☷
            Trigram::Zhen => [Yang, Yin, Yin],   // ☳
            Trigram::Kan => [Yin, Yang, Yin],    // ☵
            Trigram::Gen => [Yin, Yin, Yang],    // ☶
            Trigram::Xun => [Yin, Yang, Yang],   // ☴
            Trigram::Li => [Yang, Yin, Yang],    // ☲
            Trigram::Dui => [Yang, Yang, Yin],   // ☱
        }
    }

    /// English name of the trigram.
    pub fn name_en(self) -> &'static str {
        match self {
            Trigram::Qian => "Heaven",
            Trigram::Kun => "Earth",
            Trigram::Zhen => "Thunder",
            Trigram::Kan => "Water",
            Trigram::Gen => "Mountain",
            Trigram::Xun => "Wind",
            Trigram::Li => "Fire",
            Trigram::Dui => "Lake",
        }
    }

    /// Chinese name of the trigram.
    pub fn name_zh(self) -> &'static str {
        match self {
            Trigram::Qian => "乾",
            Trigram::Kun => "坤",
            Trigram::Zhen => "震",
            Trigram::Kan => "坎",
            Trigram::Gen => "艮",
            Trigram::Xun => "巽",
            Trigram::Li => "離",
            Trigram::Dui => "兌",
        }
    }

    /// Attribute: Creative quality of the trigram.
    pub fn attribute(self) -> &'static str {
        match self {
            Trigram::Qian => "Creative",
            Trigram::Kun => "Receptive",
            Trigram::Zhen => "Arousing",
            Trigram::Kan => "Abysmal",
            Trigram::Gen => "Keeping Still",
            Trigram::Xun => "Gentle",
            Trigram::Li => "Clinging",
            Trigram::Dui => "Joyous",
        }
    }

    /// Unicode symbol for the trigram.
    pub fn symbol(self) -> char {
        match self {
            Trigram::Qian => '☰',
            Trigram::Kun => '☷',
            Trigram::Zhen => '☳',
            Trigram::Kan => '☵',
            Trigram::Gen => '☶',
            Trigram::Xun => '☴',
            Trigram::Li => '☲',
            Trigram::Dui => '☱',
        }
    }
}

/// Identify a trigram from its three lines (bottom to top).
/// `true` = Yang, `false` = Yin.
pub fn trigram_from_lines(lines: [bool; 3]) -> Trigram {
    match lines {
        [true, true, true] => Trigram::Qian,
        [false, false, false] => Trigram::Kun,
        [true, false, false] => Trigram::Zhen,
        [false, true, false] => Trigram::Kan,
        [false, false, true] => Trigram::Gen,
        [false, true, true] => Trigram::Xun,
        [true, false, true] => Trigram::Li,
        [true, true, false] => Trigram::Dui,
    }
}

// ---------------------------------------------------------------------------
// Hexagram
// ---------------------------------------------------------------------------

/// A hexagram from the I Ching (Book of Changes).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Hexagram {
    /// King Wen sequence number (1-64).
    pub number: u8,
    /// English name.
    pub name_en: &'static str,
    /// Chinese name.
    pub name_zh: &'static str,
    /// Upper (outer) trigram.
    pub upper_trigram: Trigram,
    /// Lower (inner) trigram.
    pub lower_trigram: Trigram,
    /// Six lines, bottom (1) to top (6).
    pub lines: [Line; 6],
    /// Brief judgment text (Tuan).
    pub judgment: &'static str,
    /// Brief image text (Xiang).
    pub image: &'static str,
}

/// Result of a date-based hexagram reading.
///
/// Note: only `Serialize` is derived because the struct holds `&'static`
/// references into the compiled hexagram table, which cannot be deserialized.
#[derive(Debug, Clone, Serialize)]
pub struct HexagramReading {
    /// The primary hexagram.
    pub primary: &'static Hexagram,
    /// The index (0-5, bottom to top) of the changing line.
    pub changing_line: usize,
    /// The relating (transformed) hexagram after flipping the changing line.
    pub relating: &'static Hexagram,
}

// ---------------------------------------------------------------------------
// Static hexagram table — all 64 hexagrams in King Wen sequence
//
// I-Ching judgment (Thwan) and image (Great Symbolism) text from James Legge,
// The Yî King, Sacred Books of the East Vol. XVI (1882) — public domain.
// Copied verbatim; Legge's parentheticals and diacritics are intentional.
// ---------------------------------------------------------------------------

macro_rules! hex {
    ($num:expr, $en:expr, $zh:expr, $upper:ident, $lower:ident,
     [$l1:ident,$l2:ident,$l3:ident,$l4:ident,$l5:ident,$l6:ident],
     $judgment:expr, $image:expr) => {
        Hexagram {
            number: $num,
            name_en: $en,
            name_zh: $zh,
            upper_trigram: Trigram::$upper,
            lower_trigram: Trigram::$lower,
            lines: [
                Line::$l1,
                Line::$l2,
                Line::$l3,
                Line::$l4,
                Line::$l5,
                Line::$l6,
            ],
            judgment: $judgment,
            image: $image,
        }
    };
}

static HEXAGRAMS: [Hexagram; 64] = [
    hex!(
        1,
        "The Creative",
        "乾",
        Qian,
        Qian,
        [Yang, Yang, Yang, Yang, Yang, Yang],
        "Khien (represents) what is great and originating, penetrating, advantageous, correct and firm.",
        "Heaven, in its motion, (gives the idea of) strength. The superior man, in accordance with this, nerves himself to ceaseless activity."
    ),
    hex!(
        2,
        "The Receptive",
        "坤",
        Kun,
        Kun,
        [Yin, Yin, Yin, Yin, Yin, Yin],
        "Khwăn (represents) what is great and originating, penetrating, advantageous, correct and having the firmness of a mare. When the superior man (here intended) has to make any movement, if he take the initiative, he will go astray; if he follow, he will find his (proper) lord. The advantageousness will be seen in his getting friends in the south-west, and losing friends in the north-east. If he rest in correctness and firmness, there will be good fortune.",
        "The (capacity and sustaining) power of the earth is what is denoted by Khwăn. The superior man, in accordance with this, with his large virtue supports (men and) things."
    ),
    hex!(
        3,
        "Difficulty at the Beginning",
        "屯",
        Kan,
        Zhen,
        [Yang, Yin, Yin, Yin, Yang, Yin],
        "Kun (indicates that in the case which it presupposes) there will be great progress and success, and the advantage will come from being correct and firm. (But) any movement in advance should not be (lightly) undertaken. There will be advantage in appointing feudal princes.",
        "(The trigram representing) clouds and (that representing) thunder form Kun. The superior man, in accordance with this, (adjusts his measures of government) as in sorting the threads of the warp and woof."
    ),
    hex!(
        4,
        "Youthful Folly",
        "蒙",
        Gen,
        Kan,
        [Yin, Yang, Yin, Yin, Yin, Yang],
        "Măng (indicates that in the case which it presupposes) there will be progress and success. I do not (go and) seek the youthful and inexperienced, but he comes and seeks me. When he shows (the sincerity that marks) the first recourse to divination, I instruct him. If he apply a second and third time, that is troublesome; and I do not instruct the troublesome. There will be advantage in being firm and correct.",
        "(The trigram representing) a mountain, and beneath it that for a spring issuing forth form Măng. The superior man, in accordance with this, strives to be resolute in his conduct and nourishes his virtue."
    ),
    hex!(
        5,
        "Waiting",
        "需",
        Kan,
        Qian,
        [Yang, Yang, Yang, Yin, Yang, Yin],
        "Hsü intimates that, with the sincerity which is declared in it, there will be brilliant success. With firmness there will be good fortune; and it will be advantageous to cross the great stream.",
        "(The trigram for) clouds ascending over that for the sky forms Hsü. The superior man, in accordance with this, eats and drinks, feasts and enjoys himself (as if there were nothing else to employ him)."
    ),
    hex!(
        6,
        "Conflict",
        "訟",
        Qian,
        Kan,
        [Yin, Yang, Yin, Yang, Yang, Yang],
        "Sung intimates how, though there is sincerity in one's contention, he will yet meet with opposition and obstruction; but if he cherish an apprehensive caution, there will be good fortune, while, if he must prosecute the contention to the (bitter) end, there will be evil. It will be advantageous to see the great man; it will not be advantageous to cross the great stream.",
        "(The trigram representing) heaven and (that representing) water, moving away from each other, form Sung. The superior man, in accordance with this, in the transaction of affairs takes good counsel about his first steps."
    ),
    hex!(
        7,
        "The Army",
        "師",
        Kun,
        Kan,
        [Yin, Yang, Yin, Yin, Yin, Yin],
        "Sze indicates how, in the case which it supposes, with firmness and correctness, and (a leader of) age and experience, there will be good fortune and no error.",
        "(The trigram representing) the earth and in the midst of it that representing water, form Sze. The superior man, in accordance with this, nourishes and educates the people, and collects (from among them) the multitudes (of the hosts)."
    ),
    hex!(
        8,
        "Holding Together",
        "比",
        Kan,
        Kun,
        [Yin, Yin, Yin, Yin, Yang, Yin],
        "Pî indicates that (under the conditions which it supposes) there is good fortune. But let (the principal party intended in it) re-examine himself, (as if) by divination, whether his virtue be great, unintermitting, and firm. If it be so, there will be no error. Those who have not rest will then come to him; and with those who are (too) late in coming it will be ill.",
        "(The trigram representing) the earth, and over it (that representing) water, form Pî. The ancient kings, in accordance with this, established the various states and maintained an affectionate relation to their princes."
    ),
    hex!(
        9,
        "The Taming Power of the Small",
        "小畜",
        Xun,
        Qian,
        [Yang, Yang, Yang, Yin, Yang, Yang],
        "Hsiâo Khû indicates that (under its conditions) there will be progress and success. (We see) dense clouds, but no rain coming from our borders in the west.",
        "(The trigram representing) the sky, and that representing wind moving above it, form Hsiâo Khû The superior man, in accordance with this, adorns the outward manifestation of his virtue."
    ),
    hex!(
        10,
        "Treading",
        "履",
        Qian,
        Dui,
        [Yang, Yang, Yin, Yang, Yang, Yang],
        "(Lî suggests the idea of) one treading on the tail of a tiger, which does not bite him. There will be progress and success.",
        "(The trigram representing) the sky above, and below it (that representing the waters of) a marsh, form Lî. The superior man, in accordance with this, discriminates between high and low, and gives settlement to the aims of the people."
    ),
    hex!(
        11,
        "Peace",
        "泰",
        Kun,
        Qian,
        [Yang, Yang, Yang, Yin, Yin, Yin],
        "In Thâi (we see) the little gone and the great come. (It indicates that) there will be good fortune, with progress and success.",
        "(The trigrams for) heaven and earth in communication together form Thâi. The (sage) sovereign, in harmony with this, fashions and completes (his regulations) after the courses of heaven and earth, and assists the application of the adaptations furnished by them,--in order to benefit the people."
    ),
    hex!(
        12,
        "Standstill",
        "否",
        Qian,
        Kun,
        [Yin, Yin, Yin, Yang, Yang, Yang],
        "In Phî there is the want of good understanding between the (different classes of) men, and its indication is unfavourable to the firm and correct course of the superior man. We see in it the great gone and the little come.",
        "(The trigrams of) heaven and earth, not in intercommunication, form Phî. The superior man, in accordance with this, restrains (the manifestation) of) his virtue, and avoids the calamities (that threaten him). There is no opportunity of conferring on him the glory of emolument."
    ),
    hex!(
        13,
        "Fellowship with Men",
        "同人",
        Qian,
        Li,
        [Yang, Yin, Yang, Yang, Yang, Yang],
        "Thung Zăn (or 'Union of men') appears here (as we find it) in the (remote districts of the) country, indicating progress and success. It will be advantageous to cross the great stream. It will be advantageous to maintain the firm correctness of the superior man.",
        "(The trigrams for) heaven and fire form Thung Zăn. The superior man, in accordance with this), distinguishes things according to their kinds and classes."
    ),
    hex!(
        14,
        "Possession in Great Measure",
        "大有",
        Li,
        Qian,
        [Yang, Yang, Yang, Yang, Yin, Yang],
        "Tâ Yû indicates that, (under the circumstances which it implies), there will be great progress and success.",
        "(The trigram for) heaven and (that of) fire above it form Tâ Yû The superior man, in accordance with this, represses what is evil and gives distinction to what is good, in sympathy with the excellent Heaven-conferred (nature)."
    ),
    hex!(
        15,
        "Modesty",
        "謙",
        Kun,
        Gen,
        [Yin, Yin, Yang, Yin, Yin, Yin],
        "Khien indicates progress and success. The superior man, (being humble as it implies), will have a (good) issue (to his undertakings).",
        "(The trigram for) the earth and (that of) a mountain in the midst of it form Khien. The superior man, in accordance with this, diminishes what is excessive (in himself), and increases where there is any defect, bringing about an equality, according to the nature of the case, in his treatment (of himself and others)."
    ),
    hex!(
        16,
        "Enthusiasm",
        "豫",
        Zhen,
        Kun,
        [Yin, Yin, Yin, Yang, Yin, Yin],
        "Yü indicates that, (in the state which it implies), feudal princes may be set up, and the hosts put in motion, with advantage.",
        "(The trigrams for) the earth and thunder issuing from it with its crashing noise form Yü. The ancient kings, in accordance with this, composed their music and did honour to virtue, presenting it especially and most grandly to God, when they associated with Him (at the service) their highest ancestor and their father."
    ),
    hex!(
        17,
        "Following",
        "隨",
        Dui,
        Zhen,
        [Yang, Yin, Yin, Yang, Yang, Yin],
        "Sui indicates that (under its conditions) there will be great progress and success. But it will be advantageous to be firm and correct. There will (then) be no error.",
        "(The trigram for the waters of) a marsh and (that for) thunder (hidden) in the midst of it form Sui. The superior man in accordance with this, when it is getting towards dark, enters (his house) and rests."
    ),
    hex!(
        18,
        "Work on What Has Been Spoiled",
        "蠱",
        Gen,
        Xun,
        [Yin, Yang, Yang, Yin, Yin, Yang],
        "Kû indicates great progress and success (to him who deals properly with the condition represented by it). There will be advantage in (efforts like that of) crossing the great stream. (He should weigh well, however, the events of) three days before the turning point, and those (to be done) three days after it.",
        "(The trigram for) a mountain, and below it that for wind, form Kû. The superior man, in accordance with this, (addresses himself to) help the people and nourish his own virtue."
    ),
    hex!(
        19,
        "Approach",
        "臨",
        Kun,
        Dui,
        [Yang, Yang, Yin, Yin, Yin, Yin],
        "Lin (indicates that under the conditions supposed in it) there will be great progress and success, while it will be advantageous to be firmly correct. In the eighth month there will be evil.",
        "(The trigram for) the waters of a marsh and that for the earth above it form Lin. The superior man, in accordance with this, has his purposes of instruction that are inexhaustible, and nourishes and supports the people without limit."
    ),
    hex!(
        20,
        "Contemplation",
        "觀",
        Xun,
        Kun,
        [Yin, Yin, Yin, Yin, Yang, Yang],
        "Kwân shows (how he whom it represents should be like) the worshipper who has washed his hands, but not (yet) presented his offerings;--with sincerity and an appearance of dignity (commanding reverent regard).",
        "(The trigram representing) the earth, and that for wind moving above it, form Kwan. The ancient kings, in accordance with this, examined the (different) regions (of the kingdom), to see the (ways of the) people, and set forth their instructions."
    ),
    hex!(
        21,
        "Biting Through",
        "噬嗑",
        Li,
        Zhen,
        [Yang, Yin, Yin, Yang, Yin, Yang],
        "Shih Ho indicates successful progress (in the condition of things which it supposes). It will be advantageous to use legal constraints.",
        "(The trigrams representing) thunder and lightning form Shih Ho. The ancient kings, in accordance with this, framed their penalties with intelligence, and promulgated their laws."
    ),
    hex!(
        22,
        "Grace",
        "賁",
        Gen,
        Li,
        [Yang, Yin, Yang, Yin, Yin, Yang],
        "Pî indicates that there should be free course (in what it denotes). There will be little advantage (however) if it be allowed to advance (and take the lead).",
        "(The trigram representing) a mountain and that for fire under it form Pî. The superior man, in accordance with this, throws a brilliancy around his various processes of government, but does not dare (in a similar way) to decide cases of criminal litigation."
    ),
    hex!(
        23,
        "Splitting Apart",
        "剝",
        Gen,
        Kun,
        [Yin, Yin, Yin, Yin, Yin, Yang],
        "Po indicates that (in the state which it symbolises) it will not be advantageous to make a movement in any direction whatever.",
        "(The trigrams representing) the earth, and (above it) that for a mountain, which adheres to the earth, form Po. Superiors, in accordance with this, seek to strengthen those below them, to secure the peace and stability of their own position."
    ),
    hex!(
        24,
        "Return",
        "復",
        Kun,
        Zhen,
        [Yang, Yin, Yin, Yin, Yin, Yin],
        "Fû indicates that there will be free course and progress (in what it denotes). (The subject of it) finds no one to distress him in his exits and entrances; friends come to him, and no error is committed. He will return and repeat his (proper) course. In seven days comes his return. There will be advantage in whatever direction movement is made.",
        "(The trigram representing) the earth and that for thunder in the midst of it form Fû. The ancient kings, in accordance with this, on the day of the (winter) solstice, shut the gates of the passes (from one state to another), so that the travelling merchants could not (then) pursue their journeys, nor the princes go on with the inspection of their states."
    ),
    hex!(
        25,
        "Innocence",
        "無妄",
        Qian,
        Zhen,
        [Yang, Yin, Yin, Yang, Yang, Yang],
        "Wû Wang indicates great progress and success, while there will be advantage in being firm and correct. If (its subject and his action) be not correct, he will fall into errors, and it will not be advantageous for him to move in any direction.",
        "The thunder rolls all under the sky, and to (every)thing there is given (its nature), free from all insincerity. The ancient kings, in accordance with this, (made their regulations) in complete accordance with the seasons, thereby nourishing all things."
    ),
    hex!(
        26,
        "The Taming Power of the Great",
        "大畜",
        Gen,
        Qian,
        [Yang, Yang, Yang, Yin, Yin, Yang],
        "Under the conditions of Tâ Khû it will be advantageous to be firm and correct. (If its subject do not seek to) enjoy his revenues in his own family (without taking service at court), there will be good fortune. It will be advantageous for him to cross the great stream.",
        "(The trigram representing) a mountain, and in the midst of it that (representing) heaven, form Tâ Khû. The superior man, in accordance with this, stores largely in his memory the words and deeds of former men, to subserve the accumulation of his virtue."
    ),
    hex!(
        27,
        "The Corners of the Mouth",
        "頤",
        Gen,
        Zhen,
        [Yang, Yin, Yin, Yin, Yin, Yang],
        "Î indicates that with firm correctness there will be good fortune (in what is denoted by it). We must look at what we are seeking to nourish, and by the exercise of our thoughts seek for the proper aliment.",
        "(The trigram representing) a mountain and under it that for thunder form Î. The superior man, in accordance with this, (enjoins) watchfulness over our words, and the temperate regulation of our eating and drinking."
    ),
    hex!(
        28,
        "Preponderance of the Great",
        "大過",
        Dui,
        Xun,
        [Yin, Yang, Yang, Yang, Yang, Yin],
        "Tâ Kwo suggests to us a beam that is weak. There will be advantage in moving (under its conditions) in any direction whatever; there will be success.",
        "(The trigram representing) trees hidden beneath that for the waters of a marsh forms Tâ Kwo. The superior man, in accordance with this, stands up alone and has no fear, and keeps retired from the world without regret."
    ),
    hex!(
        29,
        "The Abysmal",
        "坎",
        Kan,
        Kan,
        [Yin, Yang, Yin, Yin, Yang, Yin],
        "Khan, here repeated, shows the possession of sincerity, through which the mind is penetrating. Action (in accordance with this) will be of high value.",
        "(The representation of) water flowing on continuously forms the repeated Khan. The superior man, in accordance with this, maintains constantly the virtue (of his heart) and (the integrity of) his conduct, and practises the business of instruction."
    ),
    hex!(
        30,
        "The Clinging",
        "離",
        Li,
        Li,
        [Yang, Yin, Yang, Yang, Yin, Yang],
        "Lî indicates that, (in regard to what it denotes), it will be advantageous to be firm and correct, and that thus there will be free course and success. Let (its subject) also nourish (a docility like that of) the cow, and there will be good fortune.",
        "(The trigram for) brightness, repeated, forms Lî. The great man, in accordance with this, cultivates more and more his brilliant (virtue), and diffuses its brightness over the four quarters (of the land)."
    ),
    hex!(
        31,
        "Influence",
        "咸",
        Dui,
        Gen,
        [Yin, Yin, Yang, Yang, Yang, Yin],
        "Hsien indicates that, (on the fulfilment of the conditions implied in it), there will be free course and success. Its advantageousness will depend on the being firm and correct, (as) in marrying a young lady. There will be good fortune.",
        "(The trigram representing) a mountain and above it that for (the waters of) a marsh form Hsien. The superior man, in accordance with this, keeps his mind free from pre-occupation, and open to receive (the influences of) others."
    ),
    hex!(
        32,
        "Duration",
        "恆",
        Zhen,
        Xun,
        [Yin, Yang, Yang, Yang, Yin, Yin],
        "Hăng indicates successful progress and no error (in what it denotes). But the advantage will come from being firm and correct; and movement in any direction whatever will be advantageous.",
        "(The trigram representing) thunder and that for wind form Hăng. The superior man, in accordance with this, stands firm, and does not change his method (of operation)."
    ),
    hex!(
        33,
        "Retreat",
        "遯",
        Qian,
        Gen,
        [Yin, Yin, Yang, Yang, Yang, Yang],
        "Thun indicates successful progress (in its circumstances). To a small extent it will (still) be advantageous to be firm and correct.",
        "(The trigram representing) the sky and below it that for a mountain form Thun. The superior man, in accordance with this, keeps small men at a distance, not by showing that he hates them, but by his own dignified gravity."
    ),
    hex!(
        34,
        "The Power of the Great",
        "大壯",
        Zhen,
        Qian,
        [Yang, Yang, Yang, Yang, Yin, Yin],
        "Tâ Kwang indicates that (under the conditions which it symbolises) it will be advantageous to be firm and correct.",
        "(The trigram representing) heaven and above it that for thunder form Tâ Kwang. The superior man, in accordance with this, does not take a step which is not according to propriety."
    ),
    hex!(
        35,
        "Progress",
        "晉",
        Li,
        Kun,
        [Yin, Yin, Yin, Yang, Yin, Yang],
        "In Žin we see a prince who secures the tranquillity (of the people) presented on that account with numerous horses (by the king), and three times in a day received at interviews.",
        "(The trigram representing) the earth and that for the bright (sun) coming forth above it form Žin. The superior man, according to this, gives himself to make more brilliant his bright virtue."
    ),
    hex!(
        36,
        "Darkening of the Light",
        "明夷",
        Kun,
        Li,
        [Yang, Yin, Yang, Yin, Yin, Yin],
        "Ming Î indicates that (in the circumstances which it denotes) it will be advantageous to realise the difficulty (of the position), and maintain firm correctness.",
        "(The trigram representing) the earth and that for the bright (sun) entering within it form Ming Î. The superior man, in accordance with this, conducts his management of men;--he shows his intelligence by keeping it obscured."
    ),
    hex!(
        37,
        "The Family",
        "家人",
        Xun,
        Li,
        [Yang, Yin, Yang, Yin, Yang, Yang],
        "For (the realisation of what is taught in) Kiâ Zăn, (or for the regulation of the family), what is most advantageous is that the wife be firm and correct.",
        "(The trigram representing) fire, and that for wind coming forth from it, form Kiâ Zăn. The superior man, in accordance with this, orders his words according to (the truth of) things, and his conduct so that it is uniformly consistent."
    ),
    hex!(
        38,
        "Opposition",
        "睽",
        Li,
        Dui,
        [Yang, Yang, Yin, Yang, Yin, Yang],
        "Khwei indicates that, (notwithstanding the condition of things which it denotes), in small matters there will (still) be good success.",
        "(The trigram representing) fire above, and that for (the waters of) a marsh below, form Khwei. The superior man, in accordance with this, where there is a general agreement, yet admits diversity."
    ),
    hex!(
        39,
        "Obstruction",
        "蹇",
        Kan,
        Gen,
        [Yin, Yin, Yang, Yin, Yang, Yin],
        "In (the state indicated by) Kien advantage will be found in the south-west, and the contrary in the north-east. It will be advantageous (also) to meet with the great man. (In these circumstances), with firmness and correctness, there will be good fortune.",
        "(The trigram representing) a mountain, and above it that for water, form Kien. The superior man, in accordance with this, turns round (and examines) himself, and cultivates his virtue."
    ),
    hex!(
        40,
        "Deliverance",
        "解",
        Zhen,
        Kan,
        [Yin, Yang, Yin, Yang, Yin, Yin],
        "In (the state indicated by) Kieh advantage will be found in the south-west. If no (further) operations be called for, there will be good fortune in coming back (to the old conditions). If some operations be called for, there will be good fortune in the early conducting of them.",
        "(The trigram representing) thunder and that for rain, with these phenomena in a state of manifestation, form Kieh. The superior man, in accordance with this, forgives errors, and deals gently with crimes."
    ),
    hex!(
        41,
        "Decrease",
        "損",
        Gen,
        Dui,
        [Yang, Yang, Yin, Yin, Yin, Yang],
        "In (what is denoted by) Sun, if there be sincerity (in him who employs it), there will be great good fortune:--freedom from error; firmness and correctness that can be maintained; and advantage in every movement that shall be made. In what shall this (sincerity in the exercise of Sun) be employed? (Even) in sacrifice two baskets of grain, (though there be nothing else), may be presented.",
        "(The trigram representing) a mountain and beneath it that for the waters of a marsh form Sun. The superior man, in accordance with this, restrains his wrath and represses his desires."
    ),
    hex!(
        42,
        "Increase",
        "益",
        Xun,
        Zhen,
        [Yang, Yin, Yin, Yin, Yang, Yang],
        "Yî indicates that (in the state which it denotes) there will be advantage in every movement which shall be undertaken, that it will be advantageous (even) to cross the great stream.",
        "(The trigram representing) wind and that for thunder form Yî. The superior man, in accordance with this, when he sees what is good, moves towards it; and when he sees his errors, he turns from them."
    ),
    hex!(
        43,
        "Breakthrough",
        "夬",
        Dui,
        Qian,
        [Yang, Yang, Yang, Yang, Yang, Yin],
        "Kwâi requires (in him who would fulfil its meaning) the exhibition (of the culprit's guilt) in the royal court, and a sincere and earnest appeal (for sympathy and support), with a consciousness of the peril (involved in cutting off the criminal). He should (also) make announcement in his own city, and show that it will not be well to have recourse at once to arms. (In this way) there will be advantage in whatever he shall go forward to.",
        "(The trigram representing) heaven and that for the waters of a marsh mounting above it form Kwâi. The superior man, in accordance with this, bestows emolument on those below him, and dislikes allowing his gifts to accumulate (undispensed)."
    ),
    hex!(
        44,
        "Coming to Meet",
        "姤",
        Qian,
        Xun,
        [Yin, Yang, Yang, Yang, Yang, Yang],
        "Kâu shows a female who is bold and strong. It will not be good to marry (such) a female.",
        "(The trigram representing) wind and that for the sky above it form Kâu. The sovereign, in accordance with this, delivers his charges, and promulgates his announcements throughout the four quarters (of the kingdom)."
    ),
    hex!(
        45,
        "Gathering Together",
        "萃",
        Dui,
        Kun,
        [Yin, Yin, Yin, Yang, Yang, Yin],
        "In (the state denoted by) Žhui, the king will repair to his ancestral temple. It will be advantageous (also) to meet with the great man; and then there will be progress and success, though the advantage must come through firm correctness. The use of great victims will conduce to good fortune; and in whatever direction movement is made, it will be advantageous.",
        "(The trigram representing the) earth and that for the waters of a marsh raised above it form Žhui. The superior man, in accordance with this, has his weapons of war put in good repair, to be prepared against unforeseen contingencies."
    ),
    hex!(
        46,
        "Pushing Upward",
        "升",
        Kun,
        Xun,
        [Yin, Yang, Yang, Yin, Yin, Yin],
        "Shăng indicates that (under its conditions) there will be great progress and success. Seeking by (the qualities implied in it) to meet with the great man, its subject need have no anxiety. Advance to the south will be fortunate.",
        "(The trigram representing) wood and that for the earth with the wood growing in the midst of it form Shăng. The superior man, in accordance with this, pays careful attention to his virtue, and accumulates the small developments of it till it is high and great."
    ),
    hex!(
        47,
        "Oppression",
        "困",
        Dui,
        Kan,
        [Yin, Yang, Yin, Yang, Yang, Yin],
        "In (the condition denoted by) Khwăn there may (yet be) progress and success. For the firm and correct, the (really) great man, there will be good fortune. He will fall into no error. If he make speeches, his words cannot be made good.",
        "(The trigram representing) a marsh, and (below it that for a defile, which has drained the other dry so that there is) no water in it, form Khwăn. The superior man, in accordance with this, will sacrifice his life in order to carry out his purpose."
    ),
    hex!(
        48,
        "The Well",
        "井",
        Kan,
        Xun,
        [Yin, Yang, Yang, Yin, Yang, Yin],
        "(Looking at) Žing, (we think of) how (the site of) a town may be changed, while (the fashion of) its wells undergoes no change. (The water of a well) never disappears and never receives (any great) increase, and those who come and those who go can draw and enjoy the benefit. If (the drawing) have nearly been accomplished, but, before the rope has quite reached the water, the bucket is broken, this is evil.",
        "(The trigram representing) wood and above it that for water form Žing. The superior man, in accordance with this, comforts the people, and stimulates them to mutual helpfulness."
    ),
    hex!(
        49,
        "Revolution",
        "革",
        Dui,
        Li,
        [Yang, Yin, Yang, Yang, Yang, Yin],
        "(What takes place as indicated by) Ko is believed in only after it has been accomplished. There will be great progress and success. Advantage will come from being firm and correct. (In that case) occasion for repentance will disappear.",
        "(The trigram representing the waters of) a marsh and that for fire in the midst of them form Ko. The superior man, in accordance with this, regulates his (astronomical) calculations, and makes clear the seasons and times."
    ),
    hex!(
        50,
        "The Cauldron",
        "鼎",
        Li,
        Xun,
        [Yin, Yang, Yang, Yang, Yin, Yang],
        "Ting gives the intimation of great progress and success.",
        "(The trigram representing) wood and above it that for fire form Ting. The superior man, in accordance with this, keeps his every position correct, and maintains secure the appointment (of Heaven)."
    ),
    hex!(
        51,
        "The Arousing",
        "震",
        Zhen,
        Zhen,
        [Yang, Yin, Yin, Yang, Yin, Yin],
        "Kăn gives the intimation of ease and development. When (the time of) movement (which it indicates) comes, (the subject of the hexagram) will be found looking out with apprehension, and yet smiling and talking cheerfully. When the movement (like a crash of thunder) terrifies all within a hundred lî, he will be (like the sincere worshipper) who is not (startled into) letting go his ladle and (cup of) sacrificial spirits.",
        "(The trigram representing) thunder, being repeated, forms Kăn. The superior man, in accordance with this, is fearful and apprehensive, cultivates (his virtue), and examines (his faults)."
    ),
    hex!(
        52,
        "Keeping Still",
        "艮",
        Gen,
        Gen,
        [Yin, Yin, Yang, Yin, Yin, Yang],
        "When one's resting is like that of the back, and he loses all consciousness of self; when he walks in his courtyard, and does not see any (of the persons) in it,--there will be no error.",
        "(Two trigrams representing) a mountain, one over the other, form Kăn. The superior man, in accordance with this, does not go in his thoughts beyond the (duties of the) position in which he is."
    ),
    hex!(
        53,
        "Development",
        "漸",
        Xun,
        Gen,
        [Yin, Yin, Yang, Yin, Yang, Yang],
        "Kien suggests to us the marriage of a young lady, and the good fortune (attending it). There will be advantage in being firm and correct.",
        "(The trigram representing) a mountain and above it that for a tree form Kien. The superior man, in accordance with this, attains to and maintains his extraordinary virtue, and makes the manners of the people good."
    ),
    hex!(
        54,
        "The Marrying Maiden",
        "歸妹",
        Zhen,
        Dui,
        [Yang, Yang, Yin, Yang, Yin, Yin],
        "Kwei Mei indicates that (under the conditions which it denotes) action will be evil, and in no wise advantageous.",
        "(The trigram representing the waters of) a marsh and over it that for thunder form Kwei Mei. The superior man, in accordance with this, having regard to the far-distant end, knows the mischief (that may be done at the beginning)."
    ),
    hex!(
        55,
        "Abundance",
        "豐",
        Zhen,
        Li,
        [Yang, Yin, Yang, Yang, Yin, Yin],
        "Făng intimates progress and development. When a king has reached the point (which the name denotes) there is no occasion to be anxious (through fear of a change). Let him be as the sun at noon.",
        "(The trigrams representing) thunder and lightning combine to form Făng. The superior man, in accordance with this, decides cases of litigation, and apportions punishments with exactness."
    ),
    hex!(
        56,
        "The Wanderer",
        "旅",
        Li,
        Gen,
        [Yin, Yin, Yang, Yang, Yin, Yang],
        "Lü intimates that (in the condition which it denotes) there may be some little attainment and progress. If the stranger or traveller be firm and correct as he ought to be, there will be good fortune.",
        "(The trigram representing) a mountain and above it that for fire form Lü. The superior man, in accordance with this, exerts his wisdom and caution in the use of punishments and not allowing litigations to continue."
    ),
    hex!(
        57,
        "The Gentle",
        "巽",
        Xun,
        Xun,
        [Yin, Yang, Yang, Yin, Yang, Yang],
        "Sun intimates that (under the conditions which it denotes) there will be some little attainment and progress. There will be advantage in movement onward in whatever direction. It will be advantageous (also) to see the great man.",
        "(Two trigrams representing) wind, following each other, form Sun. The superior man, in accordance with this, reiterates his orders, and secures the practice of his affairs."
    ),
    hex!(
        58,
        "The Joyous",
        "兌",
        Dui,
        Dui,
        [Yang, Yang, Yin, Yang, Yang, Yin],
        "Tui intimates that (under its conditions) there will be progress and attainment. (But) it will be advantageous to be firm and correct.",
        "(Two symbols representing) the waters of a marsh, one over the other, form Tui. The superior man, in accordance with this, (encourages) the conversation of friends and (the stimulus of) their (common) practice."
    ),
    hex!(
        59,
        "Dispersion",
        "渙",
        Xun,
        Kan,
        [Yin, Yang, Yin, Yin, Yang, Yang],
        "Hwân intimates that (under its conditions) there will be progress and success. The king goes to his ancestral temple; and it will be advantageous to cross the great stream. It will be advantageous to be firm and correct.",
        "(The trigram representing) water and that for wind moving above the water form Hwân. The ancient kings, in accordance with this, presented offerings to God and established the ancestral temple."
    ),
    hex!(
        60,
        "Limitation",
        "節",
        Kan,
        Dui,
        [Yang, Yang, Yin, Yin, Yang, Yin],
        "Kieh intimates that (under its conditions) there will be progress and attainment. (But) if the regulations (which it prescribes) be severe and difficult, they cannot be permanent.",
        "(The trigram representing) a lake, and above it that for water, form Kieh. The superior man, in accordance with this, constructs his (methods of) numbering and measurement, and discusses (points of) virtue and conduct."
    ),
    hex!(
        61,
        "Inner Truth",
        "中孚",
        Xun,
        Dui,
        [Yang, Yang, Yin, Yin, Yang, Yang],
        "Kung Fû (moves even) pigs and fish, and leads to good fortune. There will be advantage in crossing the great stream. There will be advantage in being firm and correct.",
        "(The trigram representing the waters of) a marsh and that for wind above it form Kung Fû. The superior man, in accordance with this, deliberates about cases of litigation and delays (the infliction of) death."
    ),
    hex!(
        62,
        "Preponderance of the Small",
        "小過",
        Zhen,
        Gen,
        [Yin, Yin, Yang, Yang, Yin, Yin],
        "Hsiâo Kwo indicates that (in the circumstances which it implies) there will be progress and attainment. But it will be advantageous to be firm and correct. (What the name denotes) may be done in small affairs, but not in great affairs. (It is like) the notes that come down from a bird on the wing;--to descend is better than to ascend. There will (in this way) be great good fortune.",
        "(The trigram representing) a hill and that for thunder above it form Hsiâo Kwo. The superior man, in accordance with this, in his conduct exceeds in humility, in mourning exceeds in sorrow, and in his expenditure exceeds in economy."
    ),
    hex!(
        63,
        "After Completion",
        "既濟",
        Kan,
        Li,
        [Yang, Yin, Yang, Yin, Yang, Yin],
        "Kî Žî intimates progress and success in small matters. There will be advantage in being firm and correct. There has been good fortune in the beginning; there may be disorder in the end.",
        "(The trigram representing) fire and that for water above it form Kî Žî. The superior man, in accordance with this, thinks of evil (that may come), and beforehand guards against it."
    ),
    hex!(
        64,
        "Before Completion",
        "未濟",
        Li,
        Kan,
        [Yin, Yang, Yin, Yang, Yin, Yang],
        "Wei Žî intimates progress and success (in the circumstances which it implies). (We see) a young fox that has nearly crossed (the stream), when its tail gets immersed. There will be no advantage in any way.",
        "(The trigram representing) water and that for fire above it form Wei Žî. The superior man, in accordance with this, carefully discriminates among (the qualities of) things, and the (different) positions they (naturally) occupy."
    ),
];

// ---------------------------------------------------------------------------
// Lookup table: upper trigram x lower trigram -> King Wen hexagram number
// ---------------------------------------------------------------------------

/// King Wen hexagram lookup: `KING_WEN_TABLE[upper][lower]` gives the hexagram
/// number (1-64) for the given trigram pair.
///
/// Row = upper trigram index, Column = lower trigram index.
/// Ordering: Qian(0) Kun(1) Zhen(2) Kan(3) Gen(4) Xun(5) Li(6) Dui(7).
static KING_WEN_TABLE: [[u8; 8]; 8] = [
    // Upper Qian
    [1, 12, 25, 6, 33, 44, 13, 10],
    // Upper Kun
    [11, 2, 24, 7, 15, 46, 36, 19],
    // Upper Zhen
    [34, 16, 51, 40, 62, 32, 55, 54],
    // Upper Kan
    [5, 8, 3, 29, 39, 48, 63, 60],
    // Upper Gen
    [26, 23, 27, 4, 52, 18, 22, 41],
    // Upper Xun
    [9, 20, 42, 59, 53, 57, 37, 61],
    // Upper Li
    [14, 35, 21, 64, 56, 50, 30, 38],
    // Upper Dui
    [43, 45, 17, 47, 31, 28, 49, 58],
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/// Retrieve a hexagram by its King Wen sequence number (1-64).
///
/// Returns `None` if `number` is 0 or greater than 64.
pub fn hexagram(number: u8) -> Option<&'static Hexagram> {
    if (1..=64).contains(&number) {
        Some(&HEXAGRAMS[(number - 1) as usize])
    } else {
        None
    }
}

/// Look up the hexagram formed by the given upper and lower trigrams.
pub fn hexagram_from_trigrams(upper: Trigram, lower: Trigram) -> &'static Hexagram {
    let number = KING_WEN_TABLE[upper as usize][lower as usize];
    // Safety: KING_WEN_TABLE values are always 1-64 by construction
    hexagram(number).expect("KING_WEN_TABLE contains only valid 1-64 values")
}

/// Derive a hexagram reading from a date/time.
///
/// The method used (Mei Hua Yi Shu — Plum Blossom Numerology, Shao Yong):
/// - Upper trigram: `(year + month + day) % 8`, read in the Pre-Heaven
///   (Xian Tian / Fu Xi) Ba Gua sequence (1=Qian … 8=Kun; remainder 0 → Kun).
/// - Lower trigram: `(year + month + day + hour) % 8`, same Pre-Heaven sequence.
/// - Changing line:  `(year + month + day + hour) % 6`, where the divisor 6
///   yields the 6th line (so a remainder of 0 maps to the top line, index 5).
///
/// The Pre-Heaven sequence is essential: the previous code indexed the trigram
/// table by enum-declaration order, which silently mapped remainder 0 → Qian
/// (and 1 → Kun, …), inverting the classical assignment. See
/// [`Trigram::from_pre_heaven_number`].
pub fn hexagram_from_date(year: i32, month: u32, day: u32, hour: u32) -> HexagramReading {
    let sum_upper = (year.unsigned_abs() as u64)
        .wrapping_add(month as u64)
        .wrapping_add(day as u64);
    let sum_lower = sum_upper.wrapping_add(hour as u64);

    let upper = Trigram::from_pre_heaven_number(sum_upper);
    let lower = Trigram::from_pre_heaven_number(sum_lower);

    // Changing line: remainder mod 6. Classical method counts lines 1..=6, so a
    // remainder of 0 means the 6th line. Convert to a 0-based index (0..=5).
    let line_number = match sum_lower % 6 {
        0 => 6,
        r => r,
    };
    let changing = (line_number - 1) as usize;

    let primary = hexagram_from_trigrams(upper, lower);
    let relating = relating_hexagram_inner(&primary.lines, changing);

    HexagramReading {
        primary,
        changing_line: changing,
        relating,
    }
}

/// Compute the nuclear hexagram.
///
/// The nuclear hexagram is formed by:
/// - Inner lower trigram: lines 2, 3, 4 (indices 1, 2, 3)
/// - Inner upper trigram: lines 3, 4, 5 (indices 2, 3, 4)
pub fn nuclear_hexagram(hex: &Hexagram) -> &'static Hexagram {
    let inner_lower = trigram_from_lines([
        hex.lines[1].is_yang(),
        hex.lines[2].is_yang(),
        hex.lines[3].is_yang(),
    ]);
    let inner_upper = trigram_from_lines([
        hex.lines[2].is_yang(),
        hex.lines[3].is_yang(),
        hex.lines[4].is_yang(),
    ]);
    hexagram_from_trigrams(inner_upper, inner_lower)
}

/// Compute the relating hexagram by flipping the changing line.
///
/// `changing_line` is 0-5 (bottom to top). Values >= 6 are clamped to 5.
pub fn relating_hexagram(hex: &Hexagram, changing_line: usize) -> &'static Hexagram {
    let changing_line = changing_line.min(5);
    relating_hexagram_inner(&hex.lines, changing_line)
}

fn relating_hexagram_inner(lines: &[Line; 6], changing_line: usize) -> &'static Hexagram {
    let mut new_lines = *lines;
    new_lines[changing_line] = new_lines[changing_line].flip();

    let lower = trigram_from_lines([
        new_lines[0].is_yang(),
        new_lines[1].is_yang(),
        new_lines[2].is_yang(),
    ]);
    let upper = trigram_from_lines([
        new_lines[3].is_yang(),
        new_lines[4].is_yang(),
        new_lines[5].is_yang(),
    ]);
    hexagram_from_trigrams(upper, lower)
}

/// Return the opposite hexagram (all lines flipped).
pub fn opposite_hexagram(hex: &Hexagram) -> &'static Hexagram {
    let new_lines: [bool; 3] = [
        !hex.lines[0].is_yang(),
        !hex.lines[1].is_yang(),
        !hex.lines[2].is_yang(),
    ];
    let new_upper: [bool; 3] = [
        !hex.lines[3].is_yang(),
        !hex.lines[4].is_yang(),
        !hex.lines[5].is_yang(),
    ];
    let lower = trigram_from_lines(new_lines);
    let upper = trigram_from_lines(new_upper);
    hexagram_from_trigrams(upper, lower)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_64_hexagrams_present() {
        assert_eq!(HEXAGRAMS.len(), 64);
        for (i, h) in HEXAGRAMS.iter().enumerate() {
            assert_eq!(
                h.number,
                (i + 1) as u8,
                "Hexagram at index {i} has wrong number"
            );
        }
    }

    #[test]
    fn hexagram_lookup_by_number() {
        let h1 = hexagram(1).unwrap();
        assert_eq!(h1.name_en, "The Creative");
        assert_eq!(h1.name_zh, "乾");
        assert_eq!(h1.upper_trigram, Trigram::Qian);
        assert_eq!(h1.lower_trigram, Trigram::Qian);

        let h64 = hexagram(64).unwrap();
        assert_eq!(h64.name_en, "Before Completion");
        assert_eq!(h64.name_zh, "未濟");
    }

    #[test]
    fn hexagram_zero_returns_none() {
        assert!(hexagram(0).is_none());
    }

    #[test]
    fn hexagram_65_returns_none() {
        assert!(hexagram(65).is_none());
    }

    #[test]
    fn trigram_from_lines_roundtrip() {
        for t in Trigram::ALL {
            let lines = t.lines();
            let bools = [lines[0].is_yang(), lines[1].is_yang(), lines[2].is_yang()];
            assert_eq!(trigram_from_lines(bools), t, "Roundtrip failed for {:?}", t);
        }
    }

    #[test]
    fn all_8_trigrams_have_names() {
        for t in Trigram::ALL {
            assert!(!t.name_en().is_empty());
            assert!(!t.name_zh().is_empty());
            assert!(!t.attribute().is_empty());
        }
    }

    #[test]
    fn trigram_symbols() {
        assert_eq!(Trigram::Qian.symbol(), '☰');
        assert_eq!(Trigram::Kun.symbol(), '☷');
        assert_eq!(Trigram::Li.symbol(), '☲');
    }

    #[test]
    fn hexagram_from_trigrams_creative() {
        let h = hexagram_from_trigrams(Trigram::Qian, Trigram::Qian);
        assert_eq!(h.number, 1);
        assert_eq!(h.name_en, "The Creative");
    }

    #[test]
    fn hexagram_from_trigrams_receptive() {
        let h = hexagram_from_trigrams(Trigram::Kun, Trigram::Kun);
        assert_eq!(h.number, 2);
        assert_eq!(h.name_en, "The Receptive");
    }

    #[test]
    fn hexagram_from_trigrams_all_64_covered() {
        let mut seen = [false; 64];
        for upper in Trigram::ALL {
            for lower in Trigram::ALL {
                let h = hexagram_from_trigrams(upper, lower);
                assert!(h.number >= 1 && h.number <= 64);
                seen[(h.number - 1) as usize] = true;
            }
        }
        for (i, &s) in seen.iter().enumerate() {
            assert!(
                s,
                "Hexagram {} was never produced by trigram pair lookup",
                i + 1
            );
        }
    }

    #[test]
    fn hexagram_lines_match_trigrams() {
        for h in HEXAGRAMS.iter() {
            let lower_lines = h.lower_trigram.lines();
            let upper_lines = h.upper_trigram.lines();
            assert_eq!(
                h.lines[0], lower_lines[0],
                "Hex {} line 1 mismatch",
                h.number
            );
            assert_eq!(
                h.lines[1], lower_lines[1],
                "Hex {} line 2 mismatch",
                h.number
            );
            assert_eq!(
                h.lines[2], lower_lines[2],
                "Hex {} line 3 mismatch",
                h.number
            );
            assert_eq!(
                h.lines[3], upper_lines[0],
                "Hex {} line 4 mismatch",
                h.number
            );
            assert_eq!(
                h.lines[4], upper_lines[1],
                "Hex {} line 5 mismatch",
                h.number
            );
            assert_eq!(
                h.lines[5], upper_lines[2],
                "Hex {} line 6 mismatch",
                h.number
            );
        }
    }

    #[test]
    fn nuclear_hexagram_creative() {
        // Creative (all yang) -> nuclear should also be Creative
        let h = hexagram(1).unwrap();
        let nuc = nuclear_hexagram(h);
        assert_eq!(nuc.number, 1, "Nuclear of Creative should be Creative");
    }

    #[test]
    fn nuclear_hexagram_receptive() {
        // Receptive (all yin) -> nuclear should also be Receptive
        let h = hexagram(2).unwrap();
        let nuc = nuclear_hexagram(h);
        assert_eq!(nuc.number, 2, "Nuclear of Receptive should be Receptive");
    }

    #[test]
    fn nuclear_hexagram_hex3() {
        // Hex 3 (Difficulty): lines [Yang,Yin,Yin,Yin,Yang,Yin] (indices 0-5)
        // Inner lower (lines 1,2,3) = Yin,Yin,Yin = Kun
        // Inner upper (lines 2,3,4) = Yin,Yin,Yang = Gen
        // Gen over Kun = hex 23 (Splitting Apart)
        let h = hexagram(3).unwrap();
        let nuc = nuclear_hexagram(h);
        let expected = hexagram_from_trigrams(Trigram::Gen, Trigram::Kun);
        assert_eq!(
            nuc.number, expected.number,
            "Nuclear of hex 3 should be Gen/Kun = {}",
            expected.number
        );
    }

    #[test]
    fn relating_hexagram_flip_line_0() {
        // Creative (all yang), flip line 0 -> bottom trigram becomes Dui
        // Qian over Dui = hex 10 (Treading)
        let h = hexagram(1).unwrap();
        let rel = relating_hexagram(h, 0);
        assert_eq!(
            rel.number, 44,
            "Flipping line 1 of Creative: Qian/Xun = hex 44 Coming to Meet"
        );
    }

    #[test]
    fn relating_hexagram_flip_line_5() {
        // Creative (all yang), flip line 5 -> upper trigram becomes Dui
        // Dui over Qian = hex 43 (Breakthrough)
        let h = hexagram(1).unwrap();
        let rel = relating_hexagram(h, 5);
        assert_eq!(
            rel.number, 43,
            "Flipping line 6 of Creative: Dui/Qian = hex 43 Breakthrough"
        );
    }

    #[test]
    fn hexagram_from_date_produces_valid_reading() {
        let reading = hexagram_from_date(2024, 6, 15, 10);
        assert!(reading.primary.number >= 1 && reading.primary.number <= 64);
        assert!(reading.relating.number >= 1 && reading.relating.number <= 64);
        assert!(reading.changing_line < 6);
    }

    #[test]
    fn hexagram_from_date_deterministic() {
        let r1 = hexagram_from_date(2024, 6, 15, 10);
        let r2 = hexagram_from_date(2024, 6, 15, 10);
        assert_eq!(r1.primary.number, r2.primary.number);
        assert_eq!(r1.relating.number, r2.relating.number);
        assert_eq!(r1.changing_line, r2.changing_line);
    }

    #[test]
    fn hexagram_from_date_different_hours_differ() {
        let r1 = hexagram_from_date(2024, 1, 1, 0);
        let r2 = hexagram_from_date(2024, 1, 1, 3);
        // Different hours should produce different lower trigram or changing line
        assert!(
            r1.primary.number != r2.primary.number || r1.changing_line != r2.changing_line,
            "Different hours should generally produce different readings"
        );
    }

    #[test]
    fn opposite_hexagram_creative_is_receptive() {
        let h = hexagram(1).unwrap();
        let opp = opposite_hexagram(h);
        assert_eq!(opp.number, 2, "Opposite of Creative should be Receptive");
    }

    #[test]
    fn opposite_hexagram_receptive_is_creative() {
        let h = hexagram(2).unwrap();
        let opp = opposite_hexagram(h);
        assert_eq!(opp.number, 1, "Opposite of Receptive should be Creative");
    }

    #[test]
    fn opposite_hexagram_involutory() {
        // For every hexagram, opposite(opposite(h)) == h
        for n in 1..=64 {
            let h = hexagram(n).unwrap();
            let opp = opposite_hexagram(h);
            let opp2 = opposite_hexagram(opp);
            assert_eq!(
                opp2.number, h.number,
                "Double opposite of hex {} should be itself, got {}",
                n, opp2.number
            );
        }
    }

    #[test]
    fn line_flip() {
        assert_eq!(Line::Yang.flip(), Line::Yin);
        assert_eq!(Line::Yin.flip(), Line::Yang);
    }

    #[test]
    fn trigram_from_index_wraps() {
        assert_eq!(Trigram::from_index(0), Trigram::Qian);
        assert_eq!(Trigram::from_index(8), Trigram::Qian);
        assert_eq!(Trigram::from_index(15), Trigram::Dui);
    }

    #[test]
    fn pre_heaven_sequence_matches_mei_hua() {
        // Mei Hua Yi Shu Pre-Heaven (Xian Tian) numbering: 1=Qian … 8=Kun.
        assert_eq!(Trigram::from_pre_heaven_number(1), Trigram::Qian);
        assert_eq!(Trigram::from_pre_heaven_number(2), Trigram::Dui);
        assert_eq!(Trigram::from_pre_heaven_number(3), Trigram::Li);
        assert_eq!(Trigram::from_pre_heaven_number(4), Trigram::Zhen);
        assert_eq!(Trigram::from_pre_heaven_number(5), Trigram::Xun);
        assert_eq!(Trigram::from_pre_heaven_number(6), Trigram::Kan);
        assert_eq!(Trigram::from_pre_heaven_number(7), Trigram::Gen);
        assert_eq!(Trigram::from_pre_heaven_number(8), Trigram::Kun);
        // The defining property: a remainder of 0 (divisor 8) is Kun, the 8th.
        assert_eq!(Trigram::from_pre_heaven_number(0), Trigram::Kun);
        assert_eq!(Trigram::from_pre_heaven_number(16), Trigram::Kun);
        // And it wraps past 8.
        assert_eq!(Trigram::from_pre_heaven_number(9), Trigram::Qian);
    }

    #[test]
    fn hexagram_from_date_uses_pre_heaven_trigrams() {
        // Hand-computed: pick a date whose digit sums land on known trigrams.
        // sum_upper = 8 + 4 + 4 = 16 -> 16 % 8 = 0 -> Kun (Pre-Heaven 8th).
        // sum_lower = 16 + 6 = 22 -> 22 % 8 = 6 -> Kan (Pre-Heaven 6th).
        // changing  = 22 % 6 = 4 -> 4th line -> index 3.
        let reading = hexagram_from_date(8, 4, 4, 6);
        assert_eq!(
            reading.primary.upper_trigram,
            Trigram::Kun,
            "upper should be Kun (remainder 0 -> 8th trigram)"
        );
        assert_eq!(
            reading.primary.lower_trigram,
            Trigram::Kan,
            "lower should be Kan (Pre-Heaven 6)"
        );
        assert_eq!(reading.changing_line, 3, "4th line -> 0-based index 3");
    }

    #[test]
    fn hexagram_from_date_changing_line_zero_remainder_is_top_line() {
        // sum_lower divisible by 6 must map to the 6th line (index 5), never panic.
        // year+month+day+hour = 6 + 0 + 0 + 0 = 6 ; 6 % 6 == 0 -> line 6 -> index 5.
        let reading = hexagram_from_date(6, 0, 0, 0);
        assert_eq!(reading.changing_line, 5);
    }

    #[test]
    fn king_wen_table_consistency() {
        // Every hexagram in the table should match the trigrams stored in the hexagram struct
        for upper in Trigram::ALL {
            for lower in Trigram::ALL {
                let h = hexagram_from_trigrams(upper, lower);
                assert_eq!(
                    h.upper_trigram, upper,
                    "Hex {} upper trigram mismatch",
                    h.number
                );
                assert_eq!(
                    h.lower_trigram, lower,
                    "Hex {} lower trigram mismatch",
                    h.number
                );
            }
        }
    }
}
