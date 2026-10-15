# Star Legends – Galactic Wars (SL100) Character Sheet for Roll20

A Roll20 character sheet for **Star Legends – Galactic Wars** (**SL100**), a space-opera d100 roleplaying game.

The layout, panel structure and sheetworker engine come from the
[Warhammer Fantasy Roleplay 4e Official sheet](https://github.com/Roll20/roll20-character-sheets/tree/master/Warhammer%20Fantasy%20Roleplay%204e%20Official).
The game content and visual theme have been replaced: it uses a gunmetal console frame,
datapad panels, Bruno Ace SC (thickened, outlined) for the title, Orbitron and Exo 2 type, and a signal-yellow accent. None of the
WFRP artwork is used.

![Sheet preview](preview.png)

## What's on the sheet

| Tab | Contents |
| --- | --- |
| **Main** | Character portrait (the avatar from the Bio & Info tab), Characteristics (with a Species / Origin row), Resilience/Resolve/Motivation and Extra Points, Destiny & Fortune (with refresh buttons), Movement (metres), Experience, Basic and Advanced Skills, Talents (with the talent library), Conditions, Psychology, Dark Side, Ambitions, Party |
| **Combat** | Gear, Encumbrance, Wealth (Credits / Bank / Debt), d100 hit-location Armour Points, quick-roll Controls, Advantage, Wounds, Critical Wounds, Armour, Weapons |
| **Force** | Force Powers (rolled against Use the Force: Sense, Control or Alter, showing the discipline rank as +SL on success) and Conflict |
| **Advances** | Careers (with the career library), Species, Origin, Granted Skills & Talents (from talents such as Perfect Pitch, species, career or GM, with a reason), Faction, Character Creation helper, XP awards and spends |
| **Settings** | Custom modifiers, non-career advances, roll options |
| **NPC** | A compact stat-block view (toggle **NPC** in Settings) |

Rolls use the d100 roll-under engine from the WFRP sheet: difficulty query, bonuses,
Advantage, Success Levels, automatic success and failure, and hit locations. All of
this goes to a themed roll template.

### Rules sources

The rules content comes from the SL100 rules pages of the
[SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki). Each part of the sheet is listed with the wiki page it follows. Nothing is invented on the
sheet: where a document is silent, the field is left blank and editable and the gap is listed in
[`NOTES-rules-gaps.md`](NOTES-rules-gaps.md) and [`docs/data-report.md`](docs/data-report.md).

| Sheet part | Wiki page |
| --- | --- |
| Characteristics, creation methods, bonus XP, point-buy (110), Wounds by Size (set by the Small and Large talents), Destiny/Fortune, Resilience/Resolve, Extra Points | Characteristics |
| Species (223: modifiers, talents, Movement, Destiny, Resilience, Extra Points, Size, Traits) | Species |
| Origin (13 worlds, +5 bonuses, 12 starting skills) | Origin |
| Faction (145 factions: details and recruitment; no game effects are written) | Faction |
| Career library (91 careers x 4 levels, grouped by class; 12 skill slots at level 1) | Careers |
| Skills and specialisations | Skills |
| Talent library (191 talents, plus named versions such as Night Vision (Thermal)) and random-talent table | Talents (with its index and random-talent table) |

### How WFRP 4e maps to SL100

| WFRP 4e | SL100 | Attribute (for macros) |
| --- | --- | --- |
| Fate / Fortune | Destiny / Fortune (labels only; attributes unchanged) | `fate` / `fortune` |
| Corruption & Mutations | Dark Side Points & taints | `corruption_points`, `repeating_corruption` |
| Spells & Prayers, Sin | Force Powers, Conflict | `repeating_spells`, `sin` |
| Channelling | Use the Force (Sense / Control / Alter / Custom) | `force`; `sense`, `control`, `alter`, `custom` |
| Read/Write | Datapad Use (talent) | — |
| GC / SS / BP | Credits / Bank / Debt | `credits`, `bank`, `debt` |
| Trappings | Gear | `repeating_trappings` |
| Hair | Homeworld | `homeworld` |
| Yards | Metres (Walk = 2 x Movement, Run = 4 x Movement) | `walk`, `run` |

**Characteristics.** WS, BS, S, T, I, Ag, Dex, Int, WP, Fel (ten, per Characteristics).

**Skills.** Basic: Art, Athletics, Bribery, Charm, Charm Creature, Climb, Consume Intoxicant,
Cool, Dodge, Endurance, Entertain, Gamble, Gossip, Haggle, Intimidate, Intuition, Leadership,
Melee (1H, 2H, Brawling, Lightsaber), Navigation, Outdoor Survival, Perception, Pilot (Speeder, Starship),
Ride (Air, Land, Water), Stealth (Rural, Underground, Urban). Advanced: Codes, Creature Care, Creature
Training, Demolitions, Evaluate, Language, Lore, Medicine, Meditate, Perform, Pilot (Capital Ship) (Mega
Freighter, Capital Ship, Space Station), Play, Profession, Ranged (Archaic, Blaster, Exotic, Ordnance,
Thrown), Research, Sleight of Hand, Slice Security System, Swim, Track, Use the Force (Sense, Control, Alter).
Careers and origins write weapon choices with slashes, e.g. Melee (1H/2H): the player edits the career
skill to one group before Update. Career level 1 has 12 skill slots (10 from the career, 2 for skills
from special circumstances).

**Species.** The 17 design-group species (Arkanian, Besalisk, Chironian, Chiss,
Echani, Human, Kel Dor, Miraluka, Nautolan, Otolla Gungan, Togruta, Trandoshan, T'surr, Twi'lek,
Weequay, Wookiee, Zabrak), then 206 provisional species added from Legends lore, plus Custom
(applies nothing).

### Rules data and how to regenerate it

Species, origins, factions, careers and talents are generated from the wiki's rules pages (the master copy of
the rules, exported as markdown by `./wiki.sh rules-md`) by
`scripts/gen-data.js` into `src/js/data/sl100-data.js` (sheet workers) and
`src/pug/sl100-data.pug` (templates). Both are committed, so the sheet builds without the wiki.
When the wiki changes:

```bash
# SL100-Wiki checked out next to this repository as SL100-Wiki or sl100-wiki (or set SL100_WIKI=/path/to/SL100-Wiki)
(cd ../SL100-Wiki && git pull && ./wiki.sh rules-md)   # markdown copies of the rules pages, in build/rules
npm run gen        # regenerate the data and docs/data-report.md
npm run build      # compile and check
npm run i18n       # add/remove translation keys for new or removed names
npm run build      # rebuild so labels pick up the translations
```

`gen` warns if the Talents page and its index list a different number of talents (the Talents page is used).
Names that the Species or Careers pages spell differently from the Talents or Skills pages are mapped in
`scripts/data/renames.json` (e.g. Read/Write -> Datapad Use); `docs/data-report.md` lists every name that
still does not match.

The WFRP sheet loaded species and talent data from the WFRP compendium.
SL100 has no compendium (Roll20 does not allow custom ones), so the libraries are built into the sheet.

## Building

The sheet is written in Pug and SCSS and compiled to `sl100.html` and `sl100.css`.
Upload those two files to Roll20, along with `translation.json`.

```bash
npm install
npm run build     # compile once, then run the consistency checks
npm start         # watch mode while editing
```

`npm run build` finishes by running `scripts/check.js`. It fails if any of these drift apart:

- the skill and specialisation lists, which live in three places:
  - `src/pug/abstracts.pug`
  - `src/js/sheetworkers.js` (the `sl` object)
  - `src/scss/_abstracts.scss`
- the `data-i18n` keys used in the HTML and the entries in `translation.json`. Roll20
  shows a blank label for any key that has no translation.
- the rules data counts: talents vs the Talents page, 13 origins, species vs the Species page.
- retired terms in visible labels ("Fate", "Read/Write").

It also fails if any Roll20-hosted WFRP artwork is referenced.

To add or rename a skill, update all three lists and add the label to
`translation.json`. Then run `npm run build`.

### Installing in Roll20

Custom sheets need a Pro subscription on the game creator's account.

1. Run `npm run build`. Upload the **generated** files, not anything in `src/`.
2. In the game, open **Settings → Game Settings**, set **Character Sheet Template**
   to **Custom**, and paste:
   - the whole of `sl100.html` into the **HTML Layout** tab
   - the whole of `sl100.css` into the **CSS Styling** tab
   - the whole of `translation.json` into the **Translation** tab
3. Click **Save Changes**, then close and reopen any open character sheets.

The build writes the `sheet-` class prefix and fallback label text into the
HTML, so the sheet styles correctly whether **Legacy Sanitization** is on or
off. If it still looks unstyled, check that the CSS tab contains `sl100.css`
starting with `@import url("https://fonts.googleapis.com/...")`, and that the
HTML tab contains `sl100.html` (its first line is a hidden `attr_sheet_version`
input).

### Previewing without Roll20

```bash
node scripts/preview.js            # screenshots of every tab, the NPC view and a roll card -> screenshots/
node scripts/preview.js --preview-png   # regenerate preview.png
```

The preview script mimics how Roll20 renders a sheet: it adds the `sheet-` class
prefix, fills in translations and expands repeating sections. Sheetworkers do not
run, so derived values come from sample data. It needs Playwright with Chromium.

## Adding your own artwork

The theme is pure CSS by default. You can add images without touching the
layout code: set any variable in `src/scss/_art.scss` to an image URL in quotes,
then run `npm run build`. Variables left as `null` keep the CSS look.

| Variable | Where it shows | Suggested size |
| --- | --- | --- |
| `$sl-art-logo` | Title image; replaces the "Star Legends / Galactic Wars" text | 600×150 transparent PNG |
| `$sl-art-header-background` | Backdrop behind the title | 840×110 |
| `$sl-art-frame-background` | Texture for the dark frame | 256×256, tileable |
| `$sl-art-panel-background` | Texture for the light panels (keep it pale) | 512×512, tileable |
| `$sl-art-armour-figure` | Figure behind the hit locations on the Combat tab | 230×330 transparent PNG |
| `$sl-art-npc-banner` | Banner behind the NPC name and stats | 840×200 |
| `$sl-art-rollcard-banner` | Strip at the top of roll cards | 300×40 |

A relative path such as `"art/logo.png"` (relative to the repo root) works in
`scripts/preview.js`. Use that while designing. Roll20 can't read files from
your computer, so before uploading the CSS, switch each value to an `https://`
URL: an image uploaded to your Roll20 art library, or a raw GitHub link.

## Source layout

```
src/pug/sl100.pug          entry point (hidden attributes, layout includes, roll templates, workers)
src/pug/abstracts.pug      game data: header fields, characteristics, skills, wealth
src/pug/layout/            pc.pug, npc.pug, settings.pug
src/pug/components/        mixins for skills, characteristic columns and repeating rows
src/pug/rolls.pug          roll macro builders
src/pug/rolltemplates.pug  the sl roll template
src/scss/_abstracts.scss   colour tokens and the skill lists used by show/hide rules
src/scss/styling/          theme (panels, header, navigation, grids)
src/js/sheetworkers.js     calculations: characteristics, skills, careers, XP, armour, Force powers
scripts/                   build check and preview tooling
```

### Internal names

CSS classes use the `sl-` prefix (`sheet-sl-…` once built). The roll template
is `sl`, so macros call it with `&{template:sl}`. The sheet-worker module is
`slModule`. Attribute names that store character data don't use the prefix,
so characters keep their values across the rename.

## Licence

The original material in this repository is released under CC0 (see `LICENSE`).
The code adapted from the Roll20 WFRP 4e Official sheet is MIT-licensed (see
`THIRD_PARTY_LICENSE.md`). The sheet's layout derives from a Warhammer Fantasy
Roleplay sheet; this project is not affiliated with or endorsed by Cubicle 7 or
Games Workshop.
