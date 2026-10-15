# SL100 rules gaps and disagreements found while syncing the sheet

This file lists every gap, ambiguity and source disagreement found while bringing the Roll20 sheet
into line with the SL100 design documents. **None of them has been resolved on the sheet.** Where a
rule is missing, the field is blank and editable. Where the sources disagree, the choice made is
stated so it can be reversed.

**Source snapshot.** The documents were read from
[SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki) at main `0542ff6` plus the 15 Oct weapon-skills
branch (`claude/weapon-skills`, [SL100-Wiki#1](https://github.com/AndrisArickson/SL100-Wiki/pull/1)). The
sheet uses **02 Species (revised)**, **05 Careers (revised)**, **07 Talents (revised)** and the
Talent List (revised), with 01, 03, 04 and 06 as they stand. The machine-generated list of gaps and
mismatches is in [`docs/data-report.md`](docs/data-report.md); re-run `npm run gen` after the wiki
changes.

Line references are `file:line` in SL100-Wiki.

## 1. Settled by the 13 October documents

These were gaps in the earlier snapshot and are now taken from the documents:

- **Ten characteristics** including Dexterity (01:17, 01:28, 01:57), matching the 05 advance schemes.
- **Point-buy budget 110**, base 20, 4 to 18 per characteristic (01:60). The sheet's default budget is now 110.
- **Wounds** = SB + 2×TB + WPB (01:75), **Movement** and Walk/Run in metres (01:81–93),
  **Destiny and Fortune** (01:95), **Resilience and Resolve** (01:112), **Motivation** (01:127) and
  **Extra Points** (01:131–135).
- **"Not Today", "That Was Close", "I Will Not Fail", "Not My Path"** (01:107–125) are now on the
  sheet as one-line reminders under the Destiny and Resilience panels.
- **Starting Fortune = Destiny and starting Resolve = Resilience** (01:133). Allocating Extra Points
  now sets all four.
- **Talents used by careers** that were missing from 07 (Strong Back, Unshakeable, Tower of Memories
  and so on) all have entries in 07 (revised) now.
- **Origin d100 table** (03:12–26) now covers 01–00 with no gaps or overlaps, and every Origin lists 12 skills.
- **Trandoshan's "Regenerate (Minor)"** is now "Regeneration (Minor)" in 02, as in 07 (07:611).
  `renames.json` also maps the old spelling, in case it appears again.

## 2. Characteristics and creation (01)

- **Size and Wounds:** 01:75 gives one formula. The sheet keeps WFRP's size scaling (Small, Large and so on)
  from the Size setting. 01 doesn't mention size.
- **Hardy** "adds to this total" (01:77; 07: + Toughness Bonus). It isn't automated: add it in the
  talent's Modifiers box (`Wounds +3`) or the Wounds modifier.
- **Bonus XP:** rolled and kept = 50, rearranged = 25, rolled again = 0, point-buy = 0 (01:57–60).
  The sheet adds it to earned XP.
- **The creation check never blocks.** It explains what to enter in the Initial column, counts
  points (point-buy) or checks the 22–40 range (rolled), and lists anything outside the rules.

## 3. Species (02 revised)

**223 species**, all now tagged `[sl100]` in 02 (17 by the design group, 206 added from Legends lore).

| Species | Missing in 02 | Line |
|---|---|---|
| Human | characteristic modifiers | 02:313 |
| Otolla Gungan | characteristic modifiers | 02:369 |
| Togruta | characteristic modifiers | 02:382 |
| Wookiee | Movement, Destiny, Resilience, Extra Points | 02:455 |
| Zabrak | Movement, Destiny, Resilience, Extra Points | 02:469 |

These fields are blank on the sheet, with a "Rules TBD in 02" hint. Destiny, Resilience and Extra
Points can be typed in by hand for these species.

- **Species skills:** 02 gives none. The species skill block is hidden. It reappears only on
  characters from earlier versions that already have entries in it, so their values and XP don't change.
- **Kel Dor** (02:337): "Force Sense, Force Control or Force Alter (Discipline)". The comma makes this
  read as Force Sense plus a choice of Control or Alter; it probably means a choice of one of the
  three. The sheet follows the text as written.
- **Size "Medium or Large"** (T'surr, Wookiee) is a choice, so Size isn't set. Both also get the
  Large talent from their "Size talent" lines, which suggests Large.
- **"No Datapad Use"** (18 review species, e.g. Yuzzem, Yuzzum) is shown as a note.
- **Zeltron** "Fel +20 (near-human)": the "(near-human)" is shown as a note.
- **Human** (02:321): "Choose any one Talent … Gain +5 free ranks in any skill." Shown as a note, not automated.
- **Natural weapons** and **Traits** are shown as notes; no weapon rows are created.
- **"Roll N talents from the random talents list"** becomes N "Random talent (roll)" slots. The roll
  button uses the d100 table at 07:9–30.

## 4. Origin (03)

- **Choice entries** are left for the player to edit before they gain advances, e.g.
  "Melee (1H/2H/Brawling)", "Ranged (Archaic/Blaster)", "Ride (Air, Land or Water)".
- **Space** is the only Origin heading without "Worlds" (03:162); the sheet uses the names as written.

## 5. Faction (04)

- 04 gives **lore only**: no skills, talents or characteristic changes. The selector is flavour only.
  It now covers 145 factions and shows section, group, era, description and, where 04:44–59
  says, who the faction draws its members from.

## 6. Careers (05 revised)

**91 careers**, all `[sl100]` after the 15 Oct pass ([SL100-Wiki#1](https://github.com/AndrisArickson/SL100-Wiki/pull/1)):
Conversion notes accepted (alternatives taken), weapon skills in slash form, Ranged (Blaster) at level 1–2 almost
everywhere, Ranged (Ordnance) in starship careers, Lightsaber only in Force-tradition careers, Datapad Use removed
from career talents. Every level now has 10 / 6 / 4 / 2 skills and 4 talents. The career library groups them by class.

- **Level 1 has 12 skill slots on the sheet:** the career's 10 plus 2 empty slots for skills from special
  circumstances (05 intro).
- **Weapon choices** such as Melee (1H/2H) are filled in as written and count for nothing until the player edits
  the skill to one group, e.g. Melee (1H). The career panel says so.
- **Force Savant level 3 title** is still a placeholder ("Jedi Councillor / (Tradition) xxx / Sith Apprentice").
- **Etiquette (Trade Guild)** and **Etiquette (Trade Guilds)** are both used; the library offers both.
- **Statuses** are still WFRP Brass / Silver / Gold (05 lists renaming them as an open decision).

## 7. Skills (06)

The sheet's skill list follows 06:17 and 06:25:

- **Melee** (basic): 1H, 2H, Brawling, Lightsaber.
- **Ranged** (advanced): Archaic, Blaster, Exotic, Ordnance, Thrown. Ordnance covers heavy, tripod and turreted
  weapons and every vehicle and starship weapon.
- **Stealth:** Rural, Underground, Urban.
- **Meditate** is Willpower (06:228).
- **Removed** (no longer used by 03 or 05): the stand-ins Consume Alcohol, Heal, Secret Signs and Trade.

Still open in 06:

- **Charm Creature** is described inside Charm (06:73, WP) but isn't in the Basic list (06:16). The sheet keeps it as a basic WP skill.
- **Use the Force** is in the Advanced list (06:25) but has no entry or characteristic. The sheet uses WP; disciplines Sense / Control / Alter come from the 07 Force talents.
- **Begging** (06:61) has a heading but is a use of Bribery. Not added.
- **Pilot (Starship)** (06:318) still has WFRP Row text ("pulling an oar").
- **Lightsaber penalty** of −20 for wielders who aren't Force sensitive (06:19) is not automated.

## 8. Talents (07 revised)

- **191 talents** (07 and the Talent List (revised) now agree).
- **Characteristic bonuses:** ten talents give "a permanent +5 bonus to your starting …":
  Coolheaded (WP), Lightning Reflexes (Ag), Marksman (BS), Nimble Fingered (Dex), Savvy (Int),
  Sharp (I), Suave (Fel), Very Resilient (T), Very Strong (S) and Warrior Born (WS). Picking one
  fills its Modifiers box (e.g. `WS +5`), which applies the bonus.
- **Named versions** such as Night Vision (Thermal), Resistance (Cold) and Etiquette (Scholars) are
  in the talent library, taken from the names 02 and 05 use. Others can still be typed.
- **Talents that grant a skill** (07 has three wordings for it): Amphibious (Swim, 07:62),
  Artistic (Profession (Artist), 07:77), Craftsman (the Profession of its specialisation, 07:212),
  Perfect Pitch (Entertain (Singing), 07:572) and Seasoned Traveller (Lore (Local), 07:684). Each adds
  a row to **Granted Skills & Talents** by itself. The skill counts as a career skill in every
  career and, by design decision (13 Oct), always costs **5 XP less per Advance**. Craftsman's text
  gives no discount, but it gets one under that decision. A `**Grants:** Career skill X; Talent Y`
  line under a talent's Max/Tests would be read in place of the prose.
- **Max values** "None", "Number of spells available" and similar can't be resolved, so the Max
  number is left blank. "<Characteristic> Bonus" follows the character's bonus.
- **Force section:** Jedi and other disciplines are talents with +1 SL per rank. Force power rolls show
  that rank as "+SL on success". Sorcery has no roll support.

## 9. Sheet compatibility notes (not rules gaps)

**Sheet version 1.3.0.** Migrations run once when an existing character is opened. Old attributes are
left in place.

- **From 1.0.0 (1.1.0 step):** bonus and notes are copied from Carouse, Survival, Animal Handling and
  Security to Consume Intoxicant, Outdoor Survival, Charm Creature and Slice Security System;
  Knowledge rows are copied to Lore.
- **1.2.0 step:** the species skill block shows only where it is already used; talent rows whose talent
  gives a characteristic bonus get it in an empty Modifiers box.
- **1.3.0 step (weapon groups):** old specialisations map onto the 06 groups as the wiki's
  `tools/consolidate/skillmap.py` does. Bonus and notes are copied (the first found wins); weapon groups
  and NPC attack types are renamed.
  - 1H: Basic, Vibroweapon, Stun, Parry, Vibroblade, Stun Baton.
  - 2H: Two-Handed, Polearm, Vibro-Axe, Force Pike, Electrostaff.
  - Blaster: Pistol, Rifle, Blaster Pistol, Blaster Rifle, Heavy Blaster, Disruptor, Sniper.
  - Ordnance: Heavy, Gunnery, Missile/Rocket, Ordinance.
  - Thrown: Explosives, Throwing, Grenade/Explosives.
  - Exotic: Entangling. Archaic: Slugthrower, Bowcaster.
  - Brawling, Lightsaber, Exotic, 1H, 2H, Archaic and Blaster keep their names. Wilderness (a 1.1.0 test
    Stealth group) has no successor.
- **Granted Skills & Talents** (Advances tab, `repeating_grants`): granted skills add paid Advances at
  the row's discount; granted talents add free ranks (at least 1) and create the talent row if needed.
  The Settings "Non-Career Advances" list is unchanged. Origin skills stay in the Origin panel.
