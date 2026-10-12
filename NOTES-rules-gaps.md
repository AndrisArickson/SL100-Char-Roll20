# SL100 rules gaps and disagreements found while syncing the sheet

This file lists every gap, ambiguity and source disagreement found while bringing the Roll20 sheet
into line with the SL100 design documents. **None of them has been resolved on the sheet.** Where a
rule is missing, the field is blank and editable. Where the sources disagree, the choice made is
stated so it can be reversed.

**Source snapshot.** The documents were read from the GitHub copy of
[SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki) at commit `4bd5f02` (2026-10-12 20:44).
The local copy may be newer. That copy has 167 talents, not 187, no *Unshakeable*, and no
`docs/collation/wording_cleanup_2026-10-12.md`. After pushing the wiki or pointing `SL100_WIKI` at
the local copy, re-run `npm run gen`. The machine-generated list of gaps and mismatches is in
[`docs/data-report.md`](docs/data-report.md).

Line references are `file:line` in SL100-Wiki. The files are 01 Introduction & Characteristics,
02 Species, 03 Origin, 04 Faction, 05 Careers, 06 Skills and 07 Talents (revised).

## 1. Where the brief and the documents differ

| # | Brief | Documents | What the sheet does |
|---|---|---|---|
| 1.1 | Ten characteristics including Dexterity, "per 01" | 01:25 and 01:13 say **nine** (no Dex), but the 05 advance schemes have ten (including Dex) | Keeps **ten**, matching 05 and the existing sheet. 01 and 05 need reconciling. |
| 1.2 | Point-buy budget **110** | 01:28: base 20, **100** points, 4 to 18 per characteristic | Budget field defaults to **100**. It's editable (Advances → Character Creation). |
| 1.3 | 01 covers derived values, Destiny, Fortune, Resilience, Resolve, Motivation, Extra Points, Movement | 01 has none of these, only characteristics and creation steps | Keeps the WFRP formulas already on the sheet: Wounds SB + 2×TB + WPB, scaled by size; walk 2×M and run 4×M. Extra Points come from 02; the split between Destiny and Resilience follows the brief. |
| 1.4 | Roll-template reminders "Not Today", "That Was Close", "I Will Not Fail", "Not My Path", worded from 01 | Not found in any document | **Not added.** Effects can't be written without a source. |
| 1.5 | Fortune refreshes from Destiny, Resolve from Resilience, "as 01 describes" | Not in 01. 07:414 (Luck): max Fortune = Fate + Luck levels. 07:717 (Strong-Minded) adds its level to max Resolve | Refresh buttons use Destiny + Luck ranks and Resilience + Strong-Minded ranks. |
| 1.6 | Talent library of **187**, including *Unshakeable* | 07 (revised) has **167** (148 general + 19 Force), matching Talent List (revised). *Unshakeable* is absent, but five careers use it (§6) | Library has 167. `gen` checks 07 against the Talent List, not a fixed number. |
| 1.7 | One-line talent summary | 07 (revised) has full rules text but no summaries. Talent List (revised) has Name / Max / Tests only | The description holds the full rules text. No summaries written. |
| 1.8 | "Skills … with Datapad Use and the Intuition skill kept" | Datapad Use is a **talent** (07:192), not a skill. Intuition is a skill (06:183) | Datapad Use is in the talent library; Intuition is kept as a skill. |
| 1.9 | Force Warrior level 1 talent "Ace Pilot or Roughrider" | 05:688 reads "Roughrider (Mounted Beast Combat) or Pilot" | Uses the 05 text. The local 05 may already say Ace Pilot. |
| 1.10 | Renames from `wording_cleanup_2026-10-12.md` | File not in the repository | Applies only Read/Write → Datapad Use, Animal Affinity → Creature Affinity and Warleader → War Leader (brief examples), plus Datapad Literate → Datapad Use (inferred from 07:5, the note on literacy). All in `scripts/data/renames.json`. |

## 2. Characteristics and creation (01)

- **Abbreviations** are not consistent:
  - the 01 table uses WS, BS, S, T, AG, INT, I, WP, FEL;
  - the 01:19 example uses "Strength (Str) … StrB" and "Willpower (Wil) … WilB";
  - 02 uses STR, AGI, WILL and INT.
  The generator accepts all of them.
- **"I" is ambiguous** in 02 (Chiss 02:45, Kel Dor 02:86, Nautolan 02:110). It's read as Initiative, per the 01 table.
- **Creation order:** 01:25–27 goes from Characteristics straight to "2) Origin on page 51". Species (02) and Faction (04) aren't placed in the creation order.
- **Bonus XP:** rolled and kept = 50, rearranged = 25, rolled again = 0, point-buy = 0 (01:25–28). The sheet adds it to earned XP.

## 3. Species (02)

| Species | Missing in 02 | Line |
|---|---|---|
| Human | characteristic modifiers | 02:66–76 |
| Otolla Gungan | characteristic modifiers | 02:114–123 |
| Togruta | characteristic modifiers | 02:125–134 |
| Wookiee | Movement, Fate (Destiny), Resilience, Extra Points | 02:186–194 |
| Zabrak | Movement, Fate (Destiny), Resilience, Extra Points | 02:196–201 |

These fields are blank on the sheet, with a "Rules TBD in 02" hint.

- **No species skills** for any species. WFRP species have 3×+5 / 3×+3 skill lists. The species skill slots are kept but cleared.
- **Human** (02:72): "Choose any one Talent … Gain +5 free ranks in any skill." Shown as a note, not automated.
- **Kel Dor** (02:90): a Force - Sense cost reduction. Shown as a note.
- **Talent names not in 07 (revised):**
  - "Stride (Sprinter?)" (Chironian, 02:31); 07 has Sprinter at 07:664;
  - "Force Ability (Alter, Control or Sense)" (Kel Dor, 02:86) and "Force Ability - Sense" (Miraluka, 02:100); 07 has Force Sense / Control / Alter (Discipline);
  - "Night Sight(Thermal)" (Trandoshan, 02:142); 07 has Night Vision at 07:451;
  - "Regenerate (Minor)" (Trandoshan, 02:142); 07 has Regeneration (Minor) at 07:534.
- **Size "Medium or Large"** (T'surr 02:158, Wookiee 02:192) is a choice, so it isn't set. Chironian "Large" (02:35) is set.
- **Natural weapons** (Chironian, T'surr, Wookiee) are shown as notes; no weapon rows are created.
- **"Roll N talents from the random talents list"** becomes N "Random talent (roll)" slots. The roll button uses the d100 table at 07:7–28.
- **Random table names not in 07:** none. The table uses Creature Affinity and Datapad Use.

## 4. Origin (03)

- **d100 table** (03:7–21):
  - 41–45 and 91–99 are unassigned;
  - 55 belongs to both Industrial (51–55) and Lava (55–60);
  - Lava is listed out of order.
- **Lava Worlds** lists **11** starting skills (03:119); 03:23 says 12. The sheet shows a hint.
- **Choice entries** are left for the player to edit before they gain advances: "Melee (1H/2H)", "Ranged (Blaster/Heavy)", "Ride(Air/Land/Water)", "Stealth(Urban/Wilderness)".
- **Starting-skill names not in 06:** none. Origins use 06 names, e.g. Consume Intoxicant.

## 5. Faction (04)

- 04 gives **lore only**: no skills, talents, characteristic changes or Patron rules. The Faction selector is flavour only. It shows section, group, era and description, plus notes.
- 04 doesn't say where Faction sits in creation, or how Origin changes the chance of a faction (03:3 says it does).

## 6. Careers (05)

**Talents used by careers but missing from 07 (revised):**

| Talent | Careers (05 line) | Note |
|---|---|---|
| Strong Back | Artisan 1 (132), Bounty Hunter 2 (771), Smuggler 1 (853), Soldier 1 (1217) | |
| Unshakeable | Force Savant 3, Force Shadow 3, Force Warrior 3, Guard 3, Soldier 3 | Brief says it is new; not in this 07 |
| Tower of Memories | Investigator 4 (201), Spy 4 (428) | |
| Master Tradesman (Any) | Artisan 3 (148) | |
| Shadowy | Force Shadow 2 (617) | |
| Resistant (Disease) | Bawd 2 (908) | 07 has Resistance (Threat) |
| Dirty Fighter | Pit Fighter 1 (1172) | 07 has Dirty Fighting (07:214) |
| Public Speaking | Soldier 4 (1241) | 07 has Public Speaker (07:507) |

**Other career gaps:**

- **Skill counts per level:** the 05 design note asks for 10 / 6 / 4 / 2.
  - Most level-1 entries list 8 skills.
  - Force Warrior 1 lists 4.
  - Bounty Hunter 1 lists 9 skills and 5 talents.
  - Smuggler 2 lists 7.
  - Bounty Hunter 4 lists 1.
- **Force Warrior 2** lists 3 talents.
- **Placeholders:** Force Savant 3 title "Jedi Councillor / (Tradition) xxx / Sith Apprentice" (05:542). Tradition flavour lines read "xx" or "xxx".
- **Skills used by careers that 06 doesn't define:**
  - kept as pending basic skills on their usual WFRP characteristic: Consume Alcohol (T), Heal (Int), Secret Signs (Int), Trade (Dex);
  - spelling variants aliased: Bribe → Bribery (Envoy 2), Slice Security → Slice Security System (Charlatan 3, Investigator 2, Thief 2);
  - not placed: "Underworld (Street — …)" (Force Shadow 2, 05:615). It has no skill and no WFRP equivalent.
- **Specialisations not in 06** get their own extra row under the skill, so their advances still land:
  - Melee (Basic), (Brawling), (Any), (Vibroblade), (Force Tradition Weapon);
  - Pilot (Land Vehicle);
  - Ride (Bantha).
- **Statuses** are WFRP Brass / Silver / Gold. **Trappings** include WFRP leftovers ("Healing Draught", "Hammer and Nails", "Impressive Hat").
- **Choices:** "X or Y" talents and skills (e.g. "Stealth (Rural or Urban)") are kept as written for the player to choose.

## 7. Skills (06)

- **Ranged:** listed as **Basic** at 06:17 but "advanced" in its entry (06:317). The sheet uses advanced.
- **Charm Creature:** in the Basic list (06:17) but has no entry or characteristic. The sheet uses WP (WFRP Charm Animal).
- **Use the Force:** in the Advanced list (06:23) but has no entry or characteristic. The sheet uses WP, from the 01 description of Willpower. Disciplines Sense / Control / Alter come from the 07 Force talents.
- **Begging** (06:61) has a heading but is a use of Charm, not a skill. Not added.
- **Pilot (Starship)** (06:293–295) still has WFRP Row text ("pulling an oar").
- **Consume Intoxicant** (06:93) and **Consume Alcohol** (used by 05) both exist on the sheet until one is chosen.
- **Pilot** appears three times (06:271, 293, 297). It's modelled as basic Pilot (Speeder, Starship) plus advanced Pilot (Capital Ship) (Mega Freighter, Capital Ship, Space Station).
- **Specialisation lists** in 06 used as fixed rows: Melee 1H / 2H / Lightsaber; Ranged Archaic / Blaster / Heavy / Ordinance; Ride Air / Land / Water; Stealth Urban / Wilderness.
- **Lightsaber penalty** of −20 for wielders who aren't Force sensitive (06:19) is not automated.

## 8. Talents (07 revised)

- **Talent List vs 07:** the 167 entries agree on names, Max and Tests (`gen` reports any difference).
- **Max values** "None", "Number of spells available" and similar can't be resolved, so the Max number is left blank. "<Characteristic> Bonus" follows the character's bonus.
- **Force section:** Jedi and other disciplines are talents with +1 SL per rank (07:804+). Force power rolls show that rank as "+SL on success". Sorcery (Language (The Force) casting, Miscasts) has no roll support.

## 9. Sheet compatibility notes (not rules gaps)

- **Sheet version 1.1.0.** The migration runs once when an existing character is opened:
  - copies bonus and notes from Carouse, Survival, Animal Handling and Security to Consume Intoxicant, Outdoor Survival, Charm Creature and Slice Security System;
  - copies Knowledge rows to Lore;
  - remaps weapon groups Basic → 1H and Two-Handed → 2H.
  Old attributes are left in place.
- **Weapon groups not remapped:** Pistol, Rifle, Gunnery, Exotic, Entangling, Explosives, Throwing, Brawling, Vibroweapon, Parry, Polearm, Stun. A mapping would be a rules decision, so players re-select the group.
- **NPC attack rows** using the old "Melee (…)" / "Ranged (…)" names need re-selecting.
- **Header selectors:** Species, Class, Origin and Faction were hidden since the earlier reset change (the WFRP `display: unset`). They're shown again.
