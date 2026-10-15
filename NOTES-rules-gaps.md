# SL100 rules gaps found while syncing the sheet

This file lists every gap and ambiguity in the SL100 rules that affects the Roll20 sheet. **None of them has been
resolved on the sheet.** Where a rule is missing, the field is blank and editable. Where the wiki pages disagree, the
choice made is stated so it can be reversed.

References are to the SL100 wiki pages (Characteristics, Species, Origin, Faction, Careers, Skills, Talents) and the
section within them. The data was read from [SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki), main plus the
weapon-skills branch ([SL100-Wiki#1](https://github.com/AndrisArickson/SL100-Wiki/pull/1)). The machine-generated
list of gaps is in [`docs/data-report.md`](docs/data-report.md); re-run `npm run gen` after the wiki changes.

## 1. Characteristics and creation (Characteristics)

- **Size and Wounds:** Wounds follow the Size table in Characteristics, Wounds (Small = 2 × TB + WPB, Large = double
  the Average total, and so on). The **Small** and **Large** talents set Size by themselves, whether they come from the
  species or are added as talent rows; removing the talent puts the character back to Average unless Size was changed
  by hand in Settings.
- **Hardy** "adds to this total" (Characteristics, Wounds; Talents: + Toughness Bonus). It isn't automated: add it in
  the talent's Modifiers box (`Wounds +3`) or the Wounds modifier.
- **Bonus XP:** rolled and kept = 50, rearranged = 25, rolled again = 0, point-buy = 0 (Characteristics, Determine
  Characteristics). The sheet adds it to earned XP.
- **The creation check never blocks.** It explains what to enter in the Initial column, counts points (point-buy) or
  checks the 22–40 range (rolled), and lists anything outside the rules.

## 2. Species (Species)

**223 species**, all tagged `[sl100]`.

| Species | Missing on the Species page |
|---|---|
| Human | characteristic modifiers |
| Otolla Gungan | characteristic modifiers |
| Togruta | characteristic modifiers |
| Wookiee | Movement, Destiny, Resilience, Extra Points |
| Zabrak | Movement, Destiny, Resilience, Extra Points |

These fields are blank on the sheet, with a "Rules TBD on the Species page" hint. Destiny, Resilience and Extra
Points can be typed in by hand for these species.

- **Species skills:** the Species page gives none. The species skill block is hidden. It appears only on characters
  that already have entries in it, so their values and XP don't change.
- **Kel Dor:** "Force Sense, Force Control or Force Alter (Discipline)". The comma makes this read as Force Sense
  plus a choice of Control or Alter; it probably means a choice of one of the three. The sheet follows the text as
  written.
- **Size "Medium or Large"** (T'surr, Wookiee): the Size field is a choice, but both have the Large talent, so the
  sheet makes them Large.
- **"No Datapad Use"** (e.g. Yuzzem, Yuzzum) is shown as a note.
- **Zeltron** "Fel +20 (near-human)": the "(near-human)" is shown as a note.
- **Human:** "Choose any one Talent … Gain +5 free ranks in any skill." Shown as a note, not automated.
- **Natural weapons** and **Traits** are shown as notes; no weapon rows are created.
- **Possibly Small:** eight Average species described as short (Bothan, Elom, Gand, Meerian, Pacithhip, Rybet, Sullustan,
  Svivreni) carry review notes on the Species page; they stay Average until the notes are settled.
- **"Roll N talents from the random talents list"** becomes N "Random talent (roll)" slots. The roll button uses the
  d100 table in Talents, Random Talents.

## 3. Origin (Origin)

- **Choice entries** are left for the player to edit before they gain advances, e.g. "Melee (1H/2H/Brawling)",
  "Ranged (Archaic/Blaster)", "Ride (Air, Land or Water)".
- **Space** is the only Origin heading without "Worlds"; the sheet uses the names as written.

## 4. Faction (Faction)

- The Faction page gives **lore only**: no skills, talents or characteristic changes. The selector is flavour only.
  It covers 145 factions and shows section, group, era, description and, where the page says, who the faction draws
  its members from.

## 5. Careers (Careers)

**91 careers**, all `[sl100]`. Every level has 10 / 6 / 4 / 2 skills and 4 talents. The career library groups them by
class.

- **Level 1 has 12 skill slots on the sheet:** the career's 10 plus 2 empty slots for skills from special
  circumstances (Careers, introduction).
- **Weapon choices** such as Melee (1H/2H) are filled in as written and count for nothing until the player edits the
  skill to one group, e.g. Melee (1H). The career panel says so.
- **Force Savant level 3 title** is still a placeholder ("Jedi Councillor / (Tradition) xxx / Sith Apprentice").
- **Etiquette (Trade Guild)** and **Etiquette (Trade Guilds)** are both used; the library offers both.
- **Statuses** are written Brass / Silver / Gold (renaming them is an open decision on the Careers page).

## 6. Skills (Skills)

The sheet's skill list follows the Skills page:

- **Melee** (basic): 1H, 2H, Brawling, Lightsaber.
- **Ranged** (advanced): Archaic, Blaster, Exotic, Ordnance, Thrown. Ordnance covers heavy, tripod and turreted
  weapons and every vehicle and starship weapon.
- **Stealth:** Rural, Underground, Urban.
- **Meditate** is Willpower.

Still open on the Skills page:

- **Charm Creature** is described inside Charm (WP) but isn't in the Basic list. The sheet keeps it as a basic WP skill.
- **Use the Force** is in the Advanced list but has no characteristic. The sheet uses WP; disciplines Sense / Control /
  Alter come from the Force talents on the Talents page.
- **Begging** has a heading but is a use of Bribery. Not added.
- **Pilot (Starship)** still has WFRP Row text ("pulling an oar").
- **Lightsaber penalty** of −20 for wielders who aren't Force sensitive is not automated.

## 7. Talents (Talents)

- **191 talents**; the Talents page and its index agree.
- **Characteristic bonuses:** ten talents give "a permanent +5 bonus to your starting …": Coolheaded (WP), Lightning
  Reflexes (Ag), Marksman (BS), Nimble Fingered (Dex), Savvy (Int), Sharp (I), Suave (Fel), Very Resilient (T), Very
  Strong (S) and Warrior Born (WS). Picking one fills its Modifiers box (e.g. `WS +5`), which applies the bonus.
- **Named versions** such as Night Vision (Thermal), Resistance (Cold) and Etiquette (Scholars) are in the talent
  library, taken from the names the Species and Careers pages use. Others can still be typed.
- **Talents that grant a skill** (three wordings are used): Amphibious (Swim), Artistic (Profession (Artist)),
  Craftsman (the Profession of its specialisation), Perfect Pitch (Entertain (Singing)) and Seasoned Traveller (Lore
  (Local)). Each adds a row to **Granted Skills & Talents** by itself. The skill counts as a career skill in every
  career and, by design decision (13 Oct), always costs **5 XP less per Advance**. Craftsman's text gives no discount,
  but it gets one under that decision. A `**Grants:** Career skill X; Talent Y` line under a talent's Max/Tests would
  be read in place of the prose.
- **Max values** "None", "Number of spells available" and similar can't be resolved, so the Max number is left blank.
  "<Characteristic> Bonus" follows the character's bonus.
- **Force section:** Jedi and other disciplines are talents with +1 SL per rank. Force power rolls show that rank as
  "+SL on success". Sorcery has no roll support.

## 8. Sheet compatibility notes (not rules gaps)

**Sheet version 1.3.0.** Migrations run once when an existing character is opened. Old attributes are left in place.

- **From 1.0.0 (1.1.0 step):** bonus and notes are copied from Carouse, Survival, Animal Handling and Security to
  Consume Intoxicant, Outdoor Survival, Charm Creature and Slice Security System; Knowledge rows are copied to Lore.
- **1.2.0 step:** the species skill block shows only where it is already used; talent rows whose talent gives a
  characteristic bonus get it in an empty Modifiers box.
- **1.3.0 step (weapon groups):** old specialisations map onto the Skills page groups. Bonus and notes are copied (the
  first found wins); weapon groups and NPC attack types are renamed.
  - 1H: Basic, Vibroweapon, Stun, Parry, Vibroblade, Stun Baton.
  - 2H: Two-Handed, Polearm, Vibro-Axe, Force Pike, Electrostaff.
  - Blaster: Pistol, Rifle, Blaster Pistol, Blaster Rifle, Heavy Blaster, Disruptor, Sniper.
  - Ordnance: Heavy, Gunnery, Missile/Rocket, Ordinance.
  - Thrown: Explosives, Throwing, Grenade/Explosives.
  - Exotic: Entangling. Archaic: Slugthrower, Bowcaster.
  - Brawling, Lightsaber, Exotic, 1H, 2H, Archaic and Blaster keep their names. Wilderness (a 1.1.0 test Stealth group)
    has no successor.
- **Granted Skills & Talents** (Advances tab, `repeating_grants`): granted skills add paid Advances at the row's
  discount; granted talents add free ranks (at least 1) and create the talent row if needed. The Settings "Non-Career
  Advances" list is unchanged. Origin skills stay in the Origin panel.
