# SL100 Character Sheet – Roadmap

Progress on the Roll20 sheet for **Star Legends – Galactic Wars (SL100)**.
Updated 2026-10-11.

## Done

- **Layout and engine:** adapted from the Roll20 Warhammer Fantasy Roleplay
  4e Official sheet. Tabs: Main, Combat, Force, Advances and Settings, plus an
  NPC view.
- **Characteristics:** kept the ten WFRP characteristics (WS, BS, S, T, I, Ag,
  Dex, Int, WP, Fel).
- **Skills and specialisations:** a space-opera skill list (including
  Astrogation, Computers, Pilot and Slicing) and weapon groups.
- **Sheet workers:** characteristics, skills, specialisations, weapons, Force
  powers, careers and XP. Checked in a simulated Roll20 runtime.
- **d100 rolls and roll card:** target number, Success Levels, crit/fumble,
  damage and hit location.
- **Rebrand:** Star Legends – Galactic Wars (SL100), with internal names moved
  from `sw` to `sl`.
- **Title:** bold outlined Bruno Ace SC (black interior, yellow rim).
- **Roll20 compatibility:** styles correctly with Legacy Sanitization
  (confirmed in a live game), with fixes for non-legacy mode.
- **Character portrait** on the Main tab, from the Bio & Info avatar.
- **Optional artwork slots:** logo, textures and banners
  (`src/scss/_art.scss`).
- **Pro install:** package and README instructions.
- **Live test:** tested in a Roll20 sandbox game.

## Next

- [ ] **Define SL100 careers:** levels, skills, talents and status. The sheet
      still uses WFRP-style career rows.
- [ ] **Define SL100 talents:** name, max rank, tests and effects.
- [ ] **In-sheet talent library:** auto-fill talent rows from the talent list.
      Roll20 has no custom compendium, so the data is built into the sheet.
      Blocked on the talent list.
- [ ] **In-sheet career library:** auto-fill career levels. Blocked on the
      career list.
- [ ] **Species:** finalise the species list and replace the placeholder
      species presets.
- [ ] **Franchise terms:** decide whether to rename species, Lightsaber, Force
      and similar terms, as one step later.
- [ ] **Roll20 public sheet repository (optional):** submit the sheet so it
      appears in Roll20's sheet dropdown.
