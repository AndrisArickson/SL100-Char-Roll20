// Generates the SL100 rules data the sheet uses (species, origins, factions,
// careers, talents) from the SL100 design documents.
//
//   node scripts/gen-data.js            reads ../SL100-Wiki
//   SL100_WIKI=/path/to/SL100-Wiki node scripts/gen-data.js
//
// Outputs (committed, so the sheet builds without the wiki present):
//   src/js/data/sl100-data.js     data for the sheet workers
//   src/pug/sl100-data.pug        the same data for the Pug templates
//   docs/data-report.md           what was parsed, and every gap or mismatch
//
// Nothing here decides rules: names and numbers are copied as written. Where a
// document is silent the field is left empty and the gap is reported. The only
// edits are the talent renames in scripts/data/renames.json.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const wiki = path.resolve(process.env.SL100_WIKI || path.join(root, "..", "SL100-Wiki"));
const renames = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "renames.json"), "utf8")).talents;

const SOURCES = {
    species: "02 New Star Wars - Species.md",
    origins: "03 New Star Wars - Origin.md",
    factions: "04 New Star Wars - Faction.md",
    careers: "05 New Star Wars - Careers.md",
    talents: "07 New Star Wars - Talents (revised).md",
    talentList: "Talent List (revised).md",
};

const report = { gaps: [], mismatches: [], notes: [] };
const gap = (where, text) => report.gaps.push(`${where}: ${text}`);
const mismatch = (where, text) => report.mismatches.push(`${where}: ${text}`);

const readSource = (key) => {
    const file = path.join(wiki, SOURCES[key]);
    if (!fs.existsSync(file)) {
        console.error(`gen-data: missing ${file}\nSet SL100_WIKI to the SL100-Wiki folder.`);
        process.exit(1);
    }
    return fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
};

// Markdown cleanup: bold markers, HTML space entities, stray spaces.
const clean = (text) => text
    .replace(/&#32;/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Split a comma-separated list, ignoring commas inside brackets.
const splitList = (text) => {
    const out = [];
    let depth = 0;
    let current = "";
    for (const ch of text) {
        if (ch === "(") depth++;
        if (ch === ")") depth = Math.max(0, depth - 1);
        if (ch === "," && depth === 0) {
            out.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    out.push(current);
    return out.map(item => item.trim().replace(/\.$/, "").trim()).filter(Boolean);
};

// Split "A or B" choices, ignoring " or " inside brackets ("Acute Sense (Taste or Touch)").
const splitOr = (text) => {
    const out = [];
    let depth = 0;
    let current = "";
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "(") depth++;
        if (ch === ")") depth = Math.max(0, depth - 1);
        if (depth === 0 && /^\s+or\s+/i.test(text.slice(i)) && current.trim()) {
            out.push(current.trim());
            current = "";
            i += text.slice(i).match(/^\s+or\s+/i)[0].length - 1;
            continue;
        }
        current += ch;
    }
    if (current.trim()) out.push(current.trim());
    return out;
};

// The option separator used in the generated data and on the sheet.
const OR = " or ";

const renameTalent = (name) => {
    // Rename whole names and the base of "Base (Specialisation)" names.
    if (renames[name]) return renames[name];
    const base = name.split("(")[0].trim();
    if (renames[base]) return name.replace(base, renames[base]);
    return name;
};

// Characteristic abbreviations as written in 02/03/05, mapped to sheet attributes.
const CHAR_ALIASES = {
    "WS": "weapon_skill", "WEAPON SKILL": "weapon_skill",
    "BS": "ballistic_skill", "BALLISTIC SKILL": "ballistic_skill",
    "S": "strength", "STR": "strength", "STRENGTH": "strength",
    "T": "toughness", "TOUGHNESS": "toughness",
    "I": "initiative", "INITIATIVE": "initiative",
    "AG": "agility", "AGI": "agility", "AGILITY": "agility",
    "DEX": "dexterity", "DEXTERITY": "dexterity",
    "INT": "intelligence", "INTELLIGENCE": "intelligence",
    "WP": "willpower", "WILL": "willpower", "WIL": "willpower", "WILLPOWER": "willpower",
    "FEL": "fellowship", "FELLOWSHIP": "fellowship",
};

// ---------------------------------------------------------------- talents (07)

const parseTalents = () => {
    const lines = readSource("talents");
    const talents = [];
    const randomTable = [];
    let section = "";
    let current = null;

    lines.forEach((raw, index) => {
        const line = raw.trim();
        const lineNo = index + 1;

        if (/^## /.test(line)) {
            section = clean(line.replace(/^## /, ""));
            current = null;
            return;
        }

        if (section === "Random Talents" && /^\|/.test(line) && !/^\|\s*(Roll|---)/.test(line)) {
            const cells = line.split("|").slice(1, -1).map(cell => clean(cell));
            for (let i = 0; i + 1 < cells.length; i += 2) {
                if (cells[i]) randomTable.push({ roll: cells[i], talent: cells[i + 1] });
            }
            return;
        }

        if (/^### /.test(line)) {
            current = {
                name: clean(line.replace(/^### /, "")),
                group: /force/i.test(section) ? "Force" : "General",
                max: "",
                tests: "",
                summary: "",
                line: lineNo,
            };
            talents.push(current);
            return;
        }

        if (!current) return;

        if (/^\*\*Max:\*\*/.test(line)) {
            const text = clean(line);
            const max = text.match(/Max:\s*([^·]*)/);
            const tests = text.match(/Tests:\s*(.*)$/);
            current.max = max ? max[1].trim() : "";
            current.tests = tests ? tests[1].trim() : "";
            return;
        }

        // Rules text: every prose paragraph of the entry (tables and italic
        // power lists are left out). 07 has no separate one-line summaries.
        if (line && !/^\|/.test(line)) {
            current.summary = current.summary ? `${current.summary}\n\n${clean(line)}` : clean(line);
        }
    });

    talents.forEach(talent => {
        if (!talent.max) gap(`${SOURCES.talents}:${talent.line}`, `talent "${talent.name}" has no Max`);
        if (!talent.summary) gap(`${SOURCES.talents}:${talent.line}`, `talent "${talent.name}" has no rules text`);
    });

    const rollStart = (roll) => (roll.split("-")[0] === "00" ? 100 : Number(roll.split("-")[0]));
    randomTable.sort((a, b) => rollStart(a.roll) - rollStart(b.roll));

    return { talents, randomTable };
};

// Cross-check 07 against the revised Talent List index.
const checkTalentList = (talents) => {
    const lines = readSource("talentList");
    const listed = [];
    const declared = [];
    lines.forEach(line => {
        const header = line.match(/^## .*\((\d+)\)/);
        if (header) declared.push(Number(header[1]));
        const row = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/);
        if (row && !/^(Talent|---)/.test(row[1])) listed.push({ name: clean(row[1]), max: clean(row[2]), tests: clean(row[3]) });
    });

    const names07 = talents.map(t => t.name);
    const namesList = listed.map(t => t.name);
    const declaredTotal = declared.reduce((a, b) => a + b, 0);

    namesList.filter(n => !names07.includes(n)).forEach(n => mismatch(SOURCES.talentList, `"${n}" is listed but has no entry in 07 (revised)`));
    names07.filter(n => !namesList.includes(n)).forEach(n => mismatch(SOURCES.talents, `"${n}" has an entry but is not in the Talent List (revised)`));

    listed.forEach(entry => {
        const talent = talents.find(t => t.name === entry.name);
        if (!talent) return;
        const listTests = entry.tests === "-" ? "" : entry.tests;
        if (entry.max !== talent.max) mismatch("Talent List vs 07", `"${entry.name}" Max: list "${entry.max}", 07 "${talent.max}" (07 used)`);
        if (listTests !== talent.tests) mismatch("Talent List vs 07", `"${entry.name}" Tests: list "${listTests}", 07 "${talent.tests}" (07 used)`);
    });

    return { listedCount: listed.length, declaredTotal };
};

// ---------------------------------------------------------------- species (02)

const parseSpecies = (talentNames) => {
    const lines = readSource("species");
    const species = [];
    let current = null;

    const startSpecies = (name, url, lineNo) => {
        current = { name, url, line: lineNo, modifiers: {}, talents: [], random_talents: 0,
            movement: null, fate: null, resilience: null, extra_points: null, size: "", natural_weapons: "", notes: [], gap: [] };
        species.push(current);
    };

    lines.forEach((raw, index) => {
        const lineNo = index + 1;
        const heading = raw.match(/^(?:#+\s*)?\[([^\]]*)\]\((https?:[^)]+)\)\s*$/);
        if (heading) {
            if (heading[1].trim()) startSpecies(heading[1].trim(), heading[2], lineNo);
            else current = null;
            return;
        }
        if (!current) return;

        const line = clean(raw);
        if (!line || line.startsWith("|")) return;

        const talentMatch = line.match(/Talents?\s*:\s*(.*)$/i);
        if (talentMatch) {
            const before = line.slice(0, talentMatch.index);
            const mods = before.replace(/Characteristics\s*:/i, "").matchAll(/([A-Za-z]+)\s*:?\s*([+-]\s*\d+)/g);
            for (const [, abbr, value] of mods) {
                const attr = CHAR_ALIASES[abbr.toUpperCase()];
                if (attr) current.modifiers[attr] = Number(value.replace(/\s/g, ""));
                else mismatch(`${SOURCES.species}:${lineNo}`, `${current.name}: unknown characteristic "${abbr}"`);
            }
            splitList(talentMatch[1]).forEach(entry => {
                const random = entry.match(/roll\s+(\d+)\s+talents?\s+from\s+the\s+random/i);
                if (random) {
                    current.random_talents += Number(random[1]);
                } else if (/random talents list/i.test(entry)) {
                    current.random_talents += 1;
                    mismatch(`${SOURCES.species}:${lineNo}`, `${current.name}: "${entry}" has no count; treated as 1 random talent`);
                } else {
                    current.talents.push(splitOr(entry).map(renameTalent).join(OR));
                }
            });
            return;
        }

        const stats = line.match(/(?:Movement|Mv)\s*:\s*(\d+)/i);
        if (stats) {
            current.movement = Number(stats[1]);
            const fate = line.match(/Fate\s*:\s*(\d+)/i);
            const res = line.match(/Resilience\s*:\s*(\d+)/i);
            const extra = line.match(/Extra points\s*:\s*(\d+)/i);
            current.fate = fate ? Number(fate[1]) : null;
            current.resilience = res ? Number(res[1]) : null;
            current.extra_points = extra ? Number(extra[1]) : null;
            return;
        }

        const size = line.match(/Size\s*:\s*([^]*?)(?:\s{2,}|Natural Weapon|$)/i);
        if (size && /size\s*:/i.test(line)) current.size = size[1].trim();
        const weapon = line.match(/Natural Weapon\s*[-:]?\s*(.*)$/i);
        if (weapon) current.natural_weapons = weapon[1].trim();
        if (/^Claws\s/i.test(line)) current.natural_weapons = line.replace(/,?\s*Size\s*:.*$/i, "").replace(/,$/, "").trim();
        if (size || weapon || /^Claws\s/i.test(line)) return;

        // Rules notes between the stat lines and the next species (short lines only).
        if (current.talents.length || current.movement !== null) {
            if (line.length < 260) current.notes.push(line);
        } else if (/^Choose any one Talent/i.test(line)) {
            current.notes.push(line);
        }
    });

    species.forEach(sp => {
        const where = `${SOURCES.species}:${sp.line}`;
        if (!Object.keys(sp.modifiers).length) { sp.gap.push("characteristics"); gap(where, `${sp.name} has no characteristic modifiers`); }
        if (!sp.talents.length && !sp.random_talents) { sp.gap.push("talents"); gap(where, `${sp.name} has no talents`); }
        ["movement", "fate", "resilience", "extra_points"].forEach(field => {
            if (sp[field] === null) { sp.gap.push(field); gap(where, `${sp.name} has no ${field.replace("_", " ")}`); }
        });
        if (!sp.size) sp.size = "";
        sp.talents.forEach(talent => {
            splitOr(talent).forEach(option => {
                if (!talentNames.has(baseName(option))) mismatch(where, `${sp.name}: talent "${option}" is not in 07 (revised)`);
            });
        });
        if (sp.talents.length + sp.random_talents > 10) mismatch(where, `${sp.name} needs more than 10 species talent slots`);
    });

    return species;
};

// Talent names in lists carry specialisations ("Resistance (Cold)"); 07 entries
// use placeholders ("Resistance (Threat)"). Compare on the part before "(".
const baseName = (name) => name.split("(")[0].replace(/\s+-\s+.*$/, "").trim().toLowerCase();

// ---------------------------------------------------------------- origins (03)

const parseOrigins = () => {
    const lines = readSource("origins");
    const table = [];
    const origins = [];
    let current = null;

    lines.forEach((raw, index) => {
        const lineNo = index + 1;
        const row = raw.match(/^\|\s*(\d[\d-]*)\s*\|\s*([^|]+)\|\s*([^|]+)\|/);
        if (row) {
            table.push({ d100: row[1].trim(), short: clean(row[2]), text: clean(row[3]), line: lineNo });
            return;
        }
        const heading = raw.match(/^## (.+?):?\s*$/);
        if (heading && !/ORIGIN/i.test(heading[1])) {
            current = { name: clean(heading[1]).replace(/:$/, ""), line: lineNo, description: "", fixed: null, choice: [], skills: [] };
            origins.push(current);
            return;
        }
        if (!current) return;
        const line = clean(raw);
        if (!line) return;
        if (/^Starting Characteristics/i.test(line)) {
            const m = line.match(/\+5\s+([A-Za-z ]+?)\s+and\s+\+5\s+to\s+either\s+(.+?)\.?$/i);
            if (!m) { mismatch(`${SOURCES.origins}:${lineNo}`, `${current.name}: could not read the characteristic bonus`); return; }
            current.fixed = CHAR_ALIASES[m[1].trim().toUpperCase()] || null;
            current.choice = m[2].split(/,\s*|\s+or\s+/).map(s => s.replace(/^or\s+/i, "").trim()).filter(Boolean)
                .map(s => CHAR_ALIASES[s.toUpperCase()]).filter(Boolean);
            if (!current.fixed || current.choice.length !== 3) mismatch(`${SOURCES.origins}:${lineNo}`, `${current.name}: bonus not in the "+5 X and +5 to either A, B or C" form`);
            return;
        }
        if (/^Starting Skills/i.test(line)) {
            current.skills = splitList(line.replace(/^Starting Skills\s*:\s*/i, ""));
            return;
        }
        if (!current.description) current.description = line;
    });

    origins.forEach(origin => {
        const short = origin.name.replace(/\s+Worlds?$/i, "");
        const entry = table.find(t => t.short.toLowerCase() === short.toLowerCase());
        origin.d100 = entry ? entry.d100 : "";
        if (!entry) mismatch(SOURCES.origins, `${origin.name} is not in the d100 table`);
        if (origin.skills.length !== 12) gap(`${SOURCES.origins}:${origin.line}`, `${origin.name} lists ${origin.skills.length} starting skills (03 says 12)`);
    });
    table.forEach(t => {
        if (!origins.find(o => o.name.replace(/\s+Worlds?$/i, "").toLowerCase() === t.short.toLowerCase())) {
            mismatch(`${SOURCES.origins}:${t.line}`, `table entry "${t.short}" has no section`);
        }
    });

    // The d100 ranges as printed: report holes and overlaps.
    const covered = new Array(101).fill(0);
    table.forEach(t => {
        const [a, b] = t.d100.split("-").map(n => (n === "00" ? 100 : Number(n)));
        for (let n = a; n <= (b || a); n++) covered[n]++;
    });
    const holes = [];
    const overlaps = [];
    for (let n = 1; n <= 100; n++) {
        if (!covered[n]) holes.push(n);
        if (covered[n] > 1) overlaps.push(n);
    }
    if (holes.length) gap(SOURCES.origins, `d100 table leaves ${compactRanges(holes)} unassigned`);
    if (overlaps.length) mismatch(SOURCES.origins, `d100 table assigns ${compactRanges(overlaps)} to more than one origin`);

    return origins;
};

const compactRanges = (numbers) => {
    const parts = [];
    let start = numbers[0];
    let prev = numbers[0];
    for (const n of numbers.slice(1).concat([null])) {
        if (n !== prev + 1) {
            parts.push(start === prev ? `${start}` : `${start}-${prev}`);
            start = n;
        }
        prev = n;
    }
    return parts.join(", ");
};

// ---------------------------------------------------------------- factions (04)

const parseFactions = () => {
    const lines = readSource("factions");
    const factions = [];
    let section = "";
    let group = "";

    lines.forEach((raw, index) => {
        const h2 = raw.match(/^## (.*)$/);
        if (h2) { section = clean(h2[1]); group = ""; return; }
        const h3 = raw.match(/^### (.*)$/);
        if (h3) { group = clean(h3[1]).replace(/^[^A-Za-z]+/, ""); return; }
        const row = raw.match(/^\|\s*\*\*([^|*]+)\*\*\s*\|\s*([^|]*)\|\s*([^|]*)\|/);
        if (row && group && !/^(Tradition|Organisation|Organization|Name|Syndicate|Group|Faction|Corporation|Body|Guild)$/i.test(row[1].trim())) {
            factions.push({ name: row[1].trim(), section, group, description: clean(row[2]), era: clean(row[3]), line: index + 1 });
        }
    });

    report.notes.push(`${SOURCES.factions}: factions carry lore only (no skills, talents or characteristic effects are written), so the sheet's Faction field is flavour only.`);
    return factions;
};

// ---------------------------------------------------------------- careers (05)

const SCHEME_COLUMNS = ["weapon_skill", "ballistic_skill", "strength", "toughness", "initiative", "agility", "dexterity", "intelligence", "willpower", "fellowship"];

const parseCareers = (talentNames) => {
    const lines = readSource("careers");
    const careers = [];
    let className = "";
    let career = null;
    let level = null;
    let schemeHeader = false;

    lines.forEach((raw, index) => {
        const lineNo = index + 1;
        const h1 = raw.match(/^# (.*)$/);
        if (h1) { className = clean(h1[1]); career = null; return; }
        const h2 = raw.match(/^## (.*)$/);
        if (h2) {
            career = { name: clean(h2[1]), class: className, line: lineNo, scheme: {}, levels: [] };
            careers.push(career);
            level = null;
            schemeHeader = false;
            return;
        }
        if (!career) return;

        if (/^\|\s*\*\*WS\*\*/.test(raw)) {
            const cols = raw.split("|").slice(1, -1).map(c => clean(c).toUpperCase());
            const expected = ["WS", "BS", "S", "T", "I", "AGI", "DEX", "INT", "WP", "FEL"];
            if (cols.join(",") !== expected.join(",")) mismatch(`${SOURCES.careers}:${lineNo}`, `${career.name}: advance scheme columns are ${cols.join(" ")}`);
            schemeHeader = true;
            return;
        }
        if (schemeHeader && /^\|/.test(raw)) {
            const cells = raw.split("|").slice(1, -1).map(c => clean(c));
            SCHEME_COLUMNS.forEach((attr, i) => {
                const n = parseInt(cells[i], 10);
                if (n >= 1 && n <= 4) career.scheme[attr] = n;
            });
            schemeHeader = false;
            return;
        }

        const lv = raw.match(/^\*\*(\d)\.\s*(.+?)\s+[—–-]\s+(.+?)\*\*\s*$/);
        if (lv) {
            level = { level: Number(lv[1]), title: clean(lv[2]), status: clean(lv[3]), skills: [], talents: [], trappings: [], line: lineNo };
            career.levels.push(level);
            return;
        }
        if (!level) return;

        const field = clean(raw).match(/^(Skills|Talents|Trappings)\s*:\s*(.*)$/i);
        if (field) {
            const key = field[1].toLowerCase();
            const items = splitList(field[2]);
            level[key] = key === "talents" ? items.map(item => splitOr(item).map(renameTalent).join(OR)) : items;
        }
    });

    careers.forEach(c => {
        const where = `${SOURCES.careers}:${c.line}`;
        if (c.levels.length !== 4) gap(where, `${c.name} has ${c.levels.length} career levels (expected 4)`);
        if (!Object.keys(c.scheme).length) gap(where, `${c.name} has no advance scheme`);
        c.levels.forEach(l => {
            const lw = `${SOURCES.careers}:${l.line}`;
            if (!l.skills.length) gap(lw, `${c.name} level ${l.level} lists no skills`);
            if (!l.talents.length) gap(lw, `${c.name} level ${l.level} lists no talents`);
            if (/\bx{2,}\b/i.test(l.title)) gap(lw, `${c.name} level ${l.level} title is a placeholder ("${l.title}")`);
            if (l.skills.length > 10) mismatch(lw, `${c.name} level ${l.level} has ${l.skills.length} skills; the sheet holds 10`);
            if (l.talents.length > 5) mismatch(lw, `${c.name} level ${l.level} has ${l.talents.length} talents; the sheet holds 5`);
            l.talents.forEach(t => splitOr(t).forEach(option => {
                if (!talentNames.has(baseName(option))) mismatch(lw, `${c.name} ${l.level}: talent "${option}" is not in 07 (revised)`);
            }));
        });
    });

    return careers;
};

// ---------------------------------------------------------------- main

const { talents, randomTable } = parseTalents();
const talentNames = new Set(talents.map(t => baseName(t.name)));
const listCheck = checkTalentList(talents);
const species = parseSpecies(talentNames);
const origins = parseOrigins();
const factions = parseFactions();
const careers = parseCareers(talentNames);

randomTable.forEach(row => {
    if (!talentNames.has(baseName(row.talent))) mismatch(SOURCES.talents, `random table entry "${row.talent}" (${row.roll}) is not a talent in 07 (revised)`);
});

// Cross-check against the collation CSVs (docs/collation in the wiki). They
// are extracts and can lag the documents; the markdown is used and any
// disagreement is reported.
const readCsv = (file) => {
    const full = path.join(wiki, "docs", "collation", file);
    if (!fs.existsSync(full)) { report.notes.push(`docs/collation/${file} not found; cross-check skipped.`); return null; }
    const rows = [];
    let field = "", row = [], quoted = false;
    const text = fs.readFileSync(full, "utf8");
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quoted) {
            if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (ch === '"') quoted = false;
            else field += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ",") { row.push(field); field = ""; }
        else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (ch !== "\r") field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const [header, ...body] = rows;
    return body.filter(r => r.length > 1).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])));
};
const normList = (list) => list.map(x => x.replace(/\s+/g, " ").trim().toLowerCase()).sort().join(" | ");

const csvSpecies = readCsv("species.csv");
if (csvSpecies) {
    csvSpecies.forEach(row => {
        const sp = species.find(x => x.name === row.species);
        if (!sp) { mismatch("species.csv", `"${row.species}" is not a species in 02`); return; }
        const csvTalents = splitList(row.talents || "").filter(t => !/random/i.test(t)).map(t => splitOr(t).map(renameTalent).join(OR));
        if (normList(csvTalents) !== normList(sp.talents)) mismatch("species.csv vs 02", `${sp.name} talents: CSV "${row.talents}" vs 02 "${sp.talents.join(", ")}" (02 used)`);
        ["movement", "fate", "resilience", "extra_points"].forEach(f => {
            const csv = row[f] === "" ? null : Number(row[f]);
            if (csv !== sp[f]) mismatch("species.csv vs 02", `${sp.name} ${f}: CSV ${row[f] || "blank"} vs 02 ${sp[f] === null ? "blank" : sp[f]} (02 used)`);
        });
    });
}

const csvOrigins = readCsv("origins.csv");
if (csvOrigins) {
    csvOrigins.forEach(row => {
        const origin = origins.find(o => o.name === row.origin);
        if (!origin) { mismatch("origins.csv", `"${row.origin}" is not an origin in 03`); return; }
        if (normList(splitList(row.starting_skills || "")) !== normList(origin.skills)) mismatch("origins.csv vs 03", `${origin.name} skills differ: CSV "${row.starting_skills || "(none)"}" (03 used)`);
    });
}

const csvCareers = readCsv("careers_l1.csv");
if (csvCareers) {
    csvCareers.forEach(row => {
        const career = careers.find(c => c.name === row.career);
        if (!career) { mismatch("careers_l1.csv", `"${row.career}" is not a career in 05`); return; }
        const l1 = career.levels.find(l => l.level === 1);
        if (!l1) return;
        const csvTalents = splitList(row.talents || "").map(t => splitOr(t).map(renameTalent).join(OR));
        if (normList(splitList(row.skills || "")) !== normList(l1.skills)) mismatch("careers_l1.csv vs 05", `${career.name} level 1 skills differ (05 used)`);
        if (normList(csvTalents) !== normList(l1.talents)) mismatch("careers_l1.csv vs 05", `${career.name} level 1 talents differ (05 used)`);
    });
}

// The talent count is checked against the revised Talent List, not a fixed
// number, so it stays right as the documents grow.
let failed = false;
if (talents.length !== listCheck.listedCount || talents.length !== listCheck.declaredTotal) {
    console.error(`gen-data: talent count mismatch: 07 (revised) has ${talents.length}, Talent List (revised) lists ${listCheck.listedCount} and declares ${listCheck.declaredTotal}`);
    failed = true;
}

const strip = (list, keys) => list.map(item => {
    const copy = { ...item };
    keys.forEach(k => delete copy[k]);
    return copy;
});

const data = {
    generated_from: Object.values(SOURCES),
    species: strip(species, ["line", "url"]),
    origins: strip(origins, ["line"]),
    factions: factions.map(f => ({ name: f.name, section: f.section, group: f.group, era: f.era, description: f.description })),
    careers: careers.map(c => ({ name: c.name, class: c.class, scheme: c.scheme,
        levels: c.levels.map(l => ({ level: l.level, title: l.title, status: l.status, skills: l.skills, talents: l.talents, trappings: l.trappings })) })),
    talents: talents.map(t => ({ name: t.name, group: t.group, max: t.max, tests: t.tests, text: t.summary })),
    random_talents: randomTable,
};

const json = JSON.stringify(data);
fs.writeFileSync(path.join(root, "src/js/data/sl100-data.js"),
    `// GENERATED by scripts/gen-data.js from the SL100-Wiki design documents. Do not edit by hand.\nconst sl100Data = ${json};\n`);
fs.writeFileSync(path.join(root, "src/pug/sl100-data.pug"),
    `//- GENERATED by scripts/gen-data.js from the SL100-Wiki design documents. Do not edit by hand.\n- const sl100Data = ${json};\n`);

const md = [
    "# SL100 data generation report",
    "",
    "Generated by `scripts/gen-data.js`. Lists what was read from the SL100-Wiki design documents and every gap or",
    "mismatch the generator found. Nothing here was resolved by the generator: fields with no source value are left",
    "empty on the sheet.",
    "",
    "| Data | Count | Source |",
    "|---|---|---|",
    `| Species | ${species.length} | ${SOURCES.species} |`,
    `| Origins | ${origins.length} | ${SOURCES.origins} |`,
    `| Factions | ${factions.length} | ${SOURCES.factions} |`,
    `| Careers | ${careers.length} | ${SOURCES.careers} |`,
    `| Talents | ${talents.length} (${talents.filter(t => t.group === "General").length} general, ${talents.filter(t => t.group === "Force").length} Force) | ${SOURCES.talents} |`,
    `| Random talent table rows | ${randomTable.length} | ${SOURCES.talents} |`,
    `| Talent List (revised) entries | ${listCheck.listedCount} (headers declare ${listCheck.declaredTotal}) | ${SOURCES.talentList} |`,
    "",
    `Talent renames applied (scripts/data/renames.json): ${Object.entries(renames).map(([a, b]) => `${a} -> ${b}`).join("; ")}.`,
    "",
    `## Gaps (${report.gaps.length})`, "",
    ...report.gaps.map(g => `- ${g}`), "",
    `## Mismatches (${report.mismatches.length})`, "",
    ...report.mismatches.map(m => `- ${m}`), "",
    "## Notes", "",
    ...report.notes.map(n => `- ${n}`), "",
].join("\n");
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data-report.md"), md);

console.log(`gen-data: ${species.length} species, ${origins.length} origins, ${factions.length} factions, ${careers.length} careers, ${talents.length} talents, ${randomTable.length} random-table rows; ${report.gaps.length} gaps, ${report.mismatches.length} mismatches (docs/data-report.md)`);
if (failed) process.exit(1);
