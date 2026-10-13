# SL100 rules gaps and disagreements found while syncing the sheet

This file lists every gap, ambiguity and source disagreement found while bringing the Roll20 sheet
into line with the SL100 design documents. **None of them has been resolved on the sheet.** Where a
rule is missing, the field is blank and editable. Where the sources disagree, the choice made is
stated so it can be reversed.

**Source snapshot.** The documents were read from
[SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki) at commit `c89dd36` (2026-10-13). The
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

**223 species:** 17 written by the design group (`[sl100]`) and 206 added from Legends lore (`[review]`).
02 says the review entries are provisional until reviewed. The sheet says so in the species notes.

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
  "Ranged (Blaster Pistol or Blaster Rifle)", "Ride (Air, Land or Water)", "Melee (any one)".
- **Space** is the only Origin heading without "Worlds" (03:162); the sheet uses the names as written.

## 5. Faction (04)

- 04 gives **lore only**: no skills, talents or characteristic changes. The selector is flavour only.
  It now covers 145 factions and shows section, group, era, description and, where 04:44–59
  says, who the faction draws its members from.

## 6. Careers (05 revised)

**91 careers:** 24 by the design group (`[sl100]`) and 67 converted or new (`[review]`). 05 says the
advance-scheme levels 2–4 of converted careers are proposals. The career library groups them by class,
including the new Spacers class.

- **Conversion typos**, read correctly by `scripts/data/renames.json` but worth fixing in the wiki:
  - **"Briberyry"** (16 places, e.g. 05:252, 05:384) for the skill Bribery;
  - **"Briberyr"** (9 places, e.g. 05:456, 05:875) for the talent Briber (07:124).
- **Levels that differ from 8 / 6 / 4 / 2 skills and 4 talents:**
  - Force Savant: 3 levels (05:1567); level 2 has 4 skills.
  - Force Warrior 1: 4 skills. Force Warrior 2: 3 talents.
  - Bounty Hunter 1: 9 skills and 5 talents. Bounty Hunter 4: 1 skill.
  - Smuggler 2: 7 skills.
- **Specialisations not in 06** get their own extra row under the skill, so their advances still land:
  Melee (Force Tradition Weapon), Ranged (Entangling) and similar.
- **Etiquette (Trade Guild)** and **Etiquette (Trade Guilds)** are both used; the library offers both.
- **Statuses** are still WFRP Brass / Silver / Gold (05 lists renaming them as an open decision).

## 7. Skills (06)

The sheet's skill list now follows 06:16 and 06:25:

- **Melee:** Brawling, Vibroblade, Vibro-Axe, Force Pike, Lightsaber, Electrostaff, Stun Baton, Parry, Two-Handed.
- **Ranged** (advanced): Blaster Pistol, Blaster Rifle, Heavy Blaster, Slugthrower, Bowcaster,
  Disruptor, Grenade/Explosives, Missile/Rocket, Sniper.
- **Stealth:** Rural, Underground, Urban.
- **Meditate** is now Willpower (06:228).
- **Removed** (no longer used by 03 or 05): the stand-ins Consume Alcohol, Heal, Secret Signs and Trade.

Still open in 06:

- **Charm Creature** is described inside Charm (06:73, WP) but isn't in the Basic list (06:16). The sheet keeps it as a basic WP skill.
- **Use the Force** is in the Advanced list (06:25) but has no entry or characteristic. The sheet uses WP; disciplines Sense / Control / Alter come from the 07 Force talents.
- **Begging** (06:61) has a heading but is a use of Bribery. Not added.
- **Pilot (Starship)** (06:318) still has WFRP Row text ("pulling an oar").
- **Lightsaber penalty** of −20 for wielders who aren't Force sensitive (06:19) is not automated.

## 8. Talents (07 revised)

- **07 has 191 entries; the Talent List (revised) lists 187.** Animal Companion, Cadence,
  Captain's Word and Large have entries in 07 but aren't in the list. The sheet uses all 191.
- **Characteristic bonuses:** ten talents give "a permanent +5 bonus to your starting …":
  Coolheaded (WP), Lightning Reflexes (Ag), Marksman (BS), Nimble Fingered (Dex), Savvy (Int),
  Sharp (I), Suave (Fel), Very Resilient (T), Very Strong (S) and Warrior Born (WS). Picking one
  fills its Modifiers box (e.g. `WS +5`), which applies the bonus.
- **Named versions** such as Night Vision (Thermal), Resistance (Cold) and Etiquette (Scholars) are
  in the talent library, taken from the names 02 and 05 use. Others can still be typed.
- **Talents that grant a skill** (07 has three wordings for it): Amphibious (Swim, 07:62),
  Artistic (Profession (Artist), 07:77), Craftsman (the Profession of its specialisation, 07:212),
  Perfect Pitch (Entertain (Sing), 07:572) and Seasoned Traveller (Lore (Local), 07:684). Each adds
  a row to **Granted Skills & Talents** by itself. The skill counts as a career skill in every
  career and, by design decision (13 Oct), always costs **5 XP less per Advance**. Craftsman's text
  gives no discount, but it gets one under that decision. A `**Grants:** Career skill X; Talent Y`
  line under a talent's Max/Tests would be read in place of the prose.
- **Entertain (Sing)** (Perfect Pitch) vs 06's Entertain specialisation **Singing** (06:141). The
  sheet uses the talent's wording, so the advances land on a "Sing" row.
- **Max values** "None", "Number of spells available" and similar can't be resolved, so the Max
  number is left blank. "<Characteristic> Bonus" follows the character's bonus.
- **Force section:** Jedi and other disciplines are talents with +1 SL per rank. Force power rolls show
  that rank as "+SL on success". Sorcery has no roll support.

## 9. Sheet compatibility notes (not rules gaps)

**Sheet version 1.2.0.** Migrations run once when an existing character is opened. Old attributes are
left in place.

- **From 1.0.0:**
  - Bonus and notes are copied from Carouse, Survival, Animal Handling and Security to Consume
    Intoxicant, Outdoor Survival, Charm Creature and Slice Security System.
  - The same is done for Pistol, Rifle, Heavy, Explosives and Stun to Blaster Pistol, Blaster Rifle,
    Heavy Blaster, Grenade/Explosives and Stun Baton.
  - Knowledge rows are copied to Lore.
  - Weapon groups Pistol, Rifle, Heavy, Explosives and Stun are renamed to their 06 successors.
    Brawling, Lightsaber, Parry and Two-Handed are unchanged.
- **Weapon groups not remapped:** Basic, Vibroweapon (Vibroblade or Vibro-Axe?), Polearm (Force Pike?),
  Gunnery, Exotic, Entangling and Throwing have no clear 06 successor. Players re-select the group.
- **From 1.1.0 test builds:** 2H becomes Two-Handed. 1H, Archaic, Blaster, Ordinance and Wilderness
  need re-selecting.
- **Granted Skills & Talents** (Advances tab, new section `repeating_grants`): granted skills add
  paid Advances at the row's discount; granted talents add free ranks (at least 1) and create the
  talent row if needed. The Settings "Non-Career Advances" list is unchanged. Origin skills stay in
  the Origin panel.
- **Talent rows** whose talent gives a characteristic bonus get it in their Modifiers box if that box is empty.
- **NPC attack rows** using old "Melee (…)" / "Ranged (…)" names need re-selecting.
