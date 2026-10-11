// Renders the built sheet outside Roll20 and saves screenshots, so layout
// changes can be checked without uploading to a sandbox game.
//
//   node scripts/preview.js [outdir]            -> one PNG per tab + NPC + roll card
//   node scripts/preview.js --preview-png       -> regenerates preview.png
//
// Roll20 behaviour emulated here: "sheet-" class prefixing, data-i18n text
// from translation.json, attribute values written to inputs and spans, and
// repeating fieldsets expanded into repcontainer/repcontrol markup. Sheet
// workers do not run, so derived values come from the sample data below.

const fs = require("fs");
const path = require("path");

const resolvePlaywright = () => {
    const candidates = ["playwright", "/opt/node-tools/node_modules/playwright"];
    for (const candidate of candidates) {
        try { return require(candidate); } catch (error) { /* try next */ }
    }
    throw new Error("playwright is not installed (npm i -D playwright)");
};

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const sample = {
    character_name: "Kessa Varn", species: "Twi'lek", class: "Scoundrel", career: "Smuggler",
    career_level: "Freighter Captain", career_path: "Spacer ⟶ Smuggler", status: "Silver 3",
    age: "31", height: "1.72m", homeworld: "Ryloth", eyes: "Amber",
    fate: 2, fortune: 2, resilience: 1, resolve: 1, motivation: "Never owe the Hutts again",
    movement: 4, walk: 8, run: 16, current_xp: 340, spent_xp: 1260, total_xp: 1600,
    wounds: 11, wounds_max: 13, advantage: 2, encumbrance: 6, encumbrance_max: 7,
    credits: 2450, bank: 800, debt: 12000, corruption_points: 1, sin: 0,
    armour_head: 0, armour_leftarm: 1, armour_rightarm: 1, armour_body: 3,
    armour_leftleg: 1, armour_rightleg: 1, armour_shield: 0, toughness_bonus: 3,
};

const chars = {
    weapon_skill: [31, 5], ballistic_skill: [44, 10], strength: [28, 0], toughness: [33, 0],
    initiative: [41, 5], agility: [45, 10], dexterity: [38, 5], intelligence: [36, 0],
    willpower: [32, 0], fellowship: [47, 10],
};
for (const [char, [initial, adv]] of Object.entries(chars)) {
    sample[`${char}_initial`] = initial;
    sample[`${char}_advances`] = adv;
    sample[`${char}_modifier`] = 0;
    sample[char] = initial + adv;
    sample[`${char}_bonus`] = Math.floor((initial + adv) / 10);
}

const rows = {
    talent: [{ talent_name: "Fast Talker", talent_ranks: 1 }, { talent_name: "Sure Shot", talent_ranks: 2 }, { talent_name: "Lucky", talent_ranks: 1 }],
    conditions: [{ condition_name: "Fatigued", condition_ranks: 1 }],
    psychology: [{ psychology_name: "Hatred (Hutt Cartel)" }],
    corruption: [{ corruption_name: "Flash of Anger" }],
    trappings: [
        { trappings_name: "Comlink", trappings_amount: 1, trappings_enc: 0 },
        { trappings_name: "Medpac", trappings_amount: 2, trappings_enc: 1 },
        { trappings_name: "Datapad", trappings_amount: 1, trappings_enc: 0 },
    ],
    armour: [{ armour_name: "Padded Flight Suit", armour_locations_display: "Arms, Body, Legs", armour_points: 1, armour_qualities: "Flexible" }],
    weapons: [
        { weapon_name: "DL-44 Heavy Blaster Pistol", weapon_group: "Pistol", weapon_target_display: 54, weapon_range: "30", weapon_damage_flat: "+6", weapon_qualities: "Stun, Penetrating" },
        { weapon_name: "Vibroknife", weapon_group: "Vibroweapon", weapon_target_display: 36, weapon_range: "Very Short", weapon_damage_flat: "+3", weapon_qualities: "Fast" },
    ],
    criticals: [{ critical_name: "Blaster Burn", critical_location: "Left Arm", critical_wounds: 3 }],
    spells: [{ spell_name: "Sense Danger", spell_lore: "Universal", spell_display: 37, spell_cn: 3, spell_range: "Self", spell_target: "Self", spell_duration: "1 hour" }],
    careers: [{ career_name: "Smuggler", career_level: "Freighter Captain", career_status: "Silver 3" }],
    experience: [{ experience_desc: "Escaped the Imperial blockade", experience_amount: 150 }],
    experiencespent: [{ experience_desc: "Ranged (Pistol) +5", experience_amount: 50 }],
    knowledge: [{ specialisation_name: "Outer Rim", specialisation: 41 }],
    pilot: [{ specialisation_name: "Freighter", specialisation: 60 }],
    language: [{ specialisation_name: "Ryl", specialisation: 41 }],
    attacks: [{ attack_name: "E-11 Blaster Rifle", attack_attacks: 1, attack_target: 40, attack_range: "100", attack_damage: "+7" }],
    "npc-traits": [{ trait_name: "Armour 3" }],
};

const skillTotals = {
    athletics: 55, charm: 57, cool: 32, dodge: 50, perception: 46, streetwise: 52, gamble: 41,
    haggle: 52, pistol: 54, rifle: 44, astrogation: 41, computers: 36, mechanics: 41, slicing: 36,
    deceive: 57, intuition: 41, alter: 32, sense: 37, control: 32, basic: 31, brawling: 31,
};

const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// A resolved skill test for the roll card screenshot.
const cardValues = {
    name: "Kessa Varn", roll_name: "Ranged (Pistol)", roll_type: "Skill", roll: 23, target: 64,
    difficulty: 20, bonus: 0, roll_damage: 10, roll_qualities: "Stun, Penetrating", roll_range: "30",
    roll_notes: "Aimed shot from cover", roll_hit_location: 1, roll_crit_location: 32,
};

// Minimal Roll20 roll-template evaluator: {{key}}, {{#key}}..{{/key}},
// {{#^key}} negation and the rollTotal/rollLess/rollGreater/rollBetween helpers.
const renderTemplate = (template, values) => {
    const num = (token) => Number(token in values ? values[token] : token);
    const test = (expression) => {
        const [helper, ...args] = expression.trim().split(/\s+/);
        switch (helper) {
            case "rollTotal()": return num(args[0]) === num(args[1]);
            case "rollLess()": return num(args[0]) < num(args[1]);
            case "rollGreater()": return num(args[0]) > num(args[1]);
            case "rollBetween()": return num(args[0]) >= num(args[1]) && num(args[0]) <= num(args[2]);
            case "rollWasCrit()": case "rollWasFumble()": return false;
            default: return expression.trim() in values;
        }
    };
    const stack = [];
    let out = "";
    for (const token of template.split(/({{[^}]*}})/)) {
        const open = token.match(/^{{#(\^?)(.*)}}$/);
        const close = token.match(/^{{\/(.*)}}$/);
        const active = stack.every(Boolean);
        if (open) stack.push(active && (open[1] ? !test(open[2]) : test(open[2])));
        else if (close) stack.pop();
        else if (active) {
            const field = token.match(/^{{(.*)}}$/);
            out += field ? escapeHtml(values[field[1]] !== undefined ? values[field[1]] : "") : token;
        }
    }
    return out;
};

const buildPage = (state) => {
    const translation = JSON.parse(read("translation.json"));
    let html = read("sw100.html");
    const css = read("sw100.css");

    // Strip sheet workers and roll templates; they are not rendered in the sheet body.
    html = html.replace(/<script type="text\/worker">[\s\S]*?<\/script>/, "");
    const templateMatch = html.match(/<rolltemplate class="sheet-rolltemplate-sw">([\s\S]*?)<\/rolltemplate>/);
    html = html.replace(/<rolltemplate[\s\S]*?<\/rolltemplate>/g, "");

    return `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { margin: 0; padding: 16px; background: #6b6f75; font-family: sans-serif; }
  .charsheet { width: 840px; margin: 0 auto; background: #fff; }
  .repcontrol { overflow: hidden; padding: 2px; }
  .repcontrol button { float: left; margin-right: 4px; }
  .repcontrol .repcontrol_edit { float: right; }
  .itemcontrol { display: none; }
  button[type=roll] { background: none; border: 0; padding: 0; cursor: pointer; font: inherit; color: inherit; }
  fieldset[class^="repeating_"] { display: none; }
  .sheet-rolltemplate-sw { width: 260px; }
  #card { margin: 16px auto; width: 300px; background: #fff; padding: 8px; }
</style>
<style>${css}</style>
<style>
  /* Pictos stand-ins for the repeating section controls. */
  .charsheet .repcontrol button:before { font-family: sans-serif !important; }
  .charsheet .repcontrol button.repcontrol_add:before { content: "+" !important; }
  .charsheet .repcontrol button.repcontrol_edit:before { content: "✎" !important; }
</style></head><body>
<div class="charsheet" id="sheet">${html}</div>
<div id="card" class="sheet-rolltemplate-sw" style="display:none">${templateMatch ? renderTemplate(templateMatch[1], cardValues) : ""}</div>
<script>
(() => {
const translation = ${JSON.stringify(translation)};
const sample = ${JSON.stringify(sample)};
const rows = ${JSON.stringify(rows)};
const skillTotals = ${JSON.stringify(skillTotals)};
const state = ${JSON.stringify(state)};

const prefix = (scope) => scope.querySelectorAll("[class]").forEach(el => {
    el.className = el.className.split(/\\s+/).filter(Boolean)
        .map(c => (c.startsWith("sheet-") || c.startsWith("repeating_") || /^(repcontainer|repitem|itemcontrol|repcontrol|repcontrol_add|repcontrol_edit|btn|charsheet|inlinerollresult|fullcrit|fullfail)$/.test(c)) ? c : "sheet-" + c)
        .join(" ");
});

const setValue = (scope, name, value) => {
    scope.querySelectorAll('[name="attr_' + name + '"]').forEach(el => {
        if (el.tagName === "INPUT" && (el.type === "radio" || el.type === "checkbox")) {
            el.checked = (el.value == value);
        } else if (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA") {
            el.value = value;
            el.setAttribute("value", value);
        } else {
            el.textContent = value;
        }
    });
};

const sheet = document.getElementById("sheet");

// Expand repeating sections.
sheet.querySelectorAll('fieldset[class^="repeating_"]').forEach(fieldset => {
    const group = fieldset.className.replace("repeating_", "");
    const container = document.createElement("div");
    container.className = "repcontainer";
    container.dataset.groupname = fieldset.className;
    (rows[group] || []).forEach(data => {
        const item = document.createElement("div");
        item.className = "repitem";
        item.innerHTML = '<div class="itemcontrol"></div>' + fieldset.innerHTML;
        Object.entries(data).forEach(([key, value]) => setValue(item, key, value));
        // Show rows collapsed, as they look once a player has filled them in.
        item.querySelectorAll('[name$="_settings"]').forEach(el => { el.checked = false; el.value = "0"; el.setAttribute("value", "0"); });
        container.appendChild(item);
    });
    const control = document.createElement("div");
    control.className = "repcontrol";
    control.innerHTML = '<button class="btn repcontrol_edit">Modify</button><button class="btn repcontrol_add">+Add</button>';
    fieldset.after(container, control);
});

prefix(sheet);
prefix(document.getElementById("card"));

document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key in translation) el.textContent = translation[key];
    else el.style.outline = "2px solid magenta";
});
document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = translation[el.getAttribute("data-i18n-placeholder")] || "";
});

Object.entries({...sample, ...skillTotals, ...state}).forEach(([key, value]) => setValue(sheet, key, value));

// Roll20 supplies the Pictos icon font; stand in with Unicode glyphs here.
const pictos = {y: "⚙", "&": "+", p: "✎", w: "❝", "}": "›", "{": "‹", "#": "✕"};
document.querySelectorAll("#sheet *").forEach(el => {
    const style = getComputedStyle(el);
    if (/pictos/i.test(style.fontFamily) && el.children.length === 0 && pictos[el.textContent.trim()]) {
        el.textContent = pictos[el.textContent.trim()];
        el.style.fontFamily = "sans-serif";
    }
});

if (state.card) document.getElementById("card").style.display = "block";
})();
</script></body></html>`;
};

const main = async () => {
    const { chromium } = resolvePlaywright();
    const args = process.argv.slice(2);
    const browser = await chromium.launch(fs.existsSync("/opt/pw-browsers/chromium") ? {} : {});
    const shoot = async (state, file, selector = "#sheet") => {
        const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1 });
        page.on("pageerror", error => console.error(`page error: ${error.message}`));
        await page.setContent(buildPage(state), { waitUntil: "networkidle" }).catch(() => page.setContent(buildPage(state)));
        await page.waitForTimeout(300);
        await page.locator(selector).screenshot({ path: file });
        await page.close();
        console.log(`saved ${file}`);
    };

    if (args.includes("--preview-png")) {
        await shoot({ nav: "main", npc: "0" }, path.join(root, "preview.png"));
    } else {
        const outdir = args[0] || path.join(root, "screenshots");
        fs.mkdirSync(outdir, { recursive: true });
        for (const nav of ["main", "combat", "force", "advances", "settings"]) {
            await shoot({ nav, npc: "0" }, path.join(outdir, `pc-${nav}.png`));
        }
        await shoot({ nav: "main", npc: "on", skill_flag: "on", trapping_flag: "on" }, path.join(outdir, "npc.png"));
        await shoot({ card: true }, path.join(outdir, "rolltemplate.png"), "#card");
    }

    await browser.close();
};

main().catch(error => { console.error(error); process.exit(1); });
