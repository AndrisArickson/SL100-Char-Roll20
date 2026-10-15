# SL100 Character Sheet – Roadmap

Progress on the Roll20 sheet for **Star Legends – Galactic Wars (SL100)**.
Updated 2026-10-15 (sheet version 1.3.0, build 2026-10-15 12:37 UTC).

The rules come from the SL100 wiki pages, which are the master copy of the rules
([SL100-Wiki](https://github.com/AndrisArickson/SL100-Wiki)). Gaps the wiki still
leaves open are listed in [`NOTES-rules-gaps.md`](NOTES-rules-gaps.md).

## Done

- **Layout and engine:** Main, Combat, Force, Advances and Settings tabs plus an NPC view, with
  d100 rolls, Success Levels, crits, damage and hit location on the roll card.
- **Look:** the Star Legends – Galactic Wars title, portrait from the Bio & Info avatar, optional
  artwork slots, and styling that works with Roll20's legacy and current sanitisation.
- **Characteristics and creation:** ten characteristics; rolled or point-buy creation (budget 110)
  with a creation check; bonus XP; Wounds by Size; Movement in metres; Destiny/Fortune and
  Resilience/Resolve with Extra Points.
- **Species:** all 223 species from the wiki's Species page (A to Z), with modifiers, talents,
  Movement, Destiny, Resilience, Extra Points, Size, traits and notes.
- **Size:** the Small and Large talents set the character's Size, and Wounds follow it.
- **Origin and Faction:** 13 origins with their bonuses and starting skills; 145 factions with
  details and who they recruit from.
- **Careers:** library of 91 careers in four levels, grouped by class. Weapon choices such as
  Melee (1H/2H) are picked by the player; level 1 has 12 skill slots.
- **Skills:** the wiki's skill list, with the weapon groups Melee (1H, 2H, Brawling, Lightsaber) and
  Ranged (Archaic, Blaster, Exotic, Ordnance, Thrown).
- **Talents:** library of 191 talents with named versions (e.g. Night Vision (Thermal)), the random
  talent table, characteristic bonuses filled into Modifiers, and Force discipline ranks.
- **Level completion:** each career level shows whether it is complete, or what it still needs; the
  career's Status turns green with a tick when its current level is complete.
- **Tested live in Roll20** (15 Oct, build 2026-10-15 12:37 UTC): level completion, rolls and chat cards.
- **Build safeguards:** the header shows the build date; `npm run build` fails if the HTML passes 1.4 MB
  or the CSS contains anything that makes Roll20 drop the chat-card styles.
- **Granted Skills & Talents:** skills granted by talents cost 5 XP less per Advance; granted
  talents add free ranks.
- **Migrations:** characters made with earlier versions convert themselves when opened (1.1.0 to
  1.3.0).
- **Checks:** `npm run build` checks the skill lists, the translations and the rules data;
  sheet workers are exercised in a simulated Roll20 runtime.

## Next

- [ ] **Rules still open in the wiki** (see `NOTES-rules-gaps.md`): Human, Otolla Gungan and Togruta
      modifiers; Wookiee and Zabrak Movement, Destiny, Resilience and Extra Points; the Force Savant
      level 3 title; Status tier names.
- [ ] **Possibly-Small species:** eight species carry review notes on the Species page; the sheet
      picks up any change with `npm run gen`.
- [ ] **Hardy:** add its Toughness Bonus to Wounds automatically (today it goes in the Modifiers box).
- [ ] **Franchise terms:** decide whether to rename species, Lightsaber, Force and similar terms, as
      one step later.
- [ ] **Roll20 public sheet repository (optional):** submit the sheet so it appears in Roll20's
      sheet dropdown.
