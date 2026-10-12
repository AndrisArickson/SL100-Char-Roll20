// Consistency checks for the SL100 sheet. Run after a build: `npm run check`.
//
// The skill lists live in three places (Pug data, sheetworkers, SCSS); Roll20
// also needs a translation entry for every data-i18n key or the label renders
// blank. This script fails the build if any of those drift apart.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const errors = [];
const warnings = [];

const sameSet = (label, a, b) => {
    const missingFromB = a.filter(item => !b.includes(item));
    const missingFromA = b.filter(item => !a.includes(item));
    if (missingFromB.length || missingFromA.length) {
        errors.push(`${label}: only in first [${missingFromB.join(", ")}], only in second [${missingFromA.join(", ")}]`);
    }
};

// Generated rules data (scripts/gen-data.js).
const sl100Data = (() => {
    const context = {};
    vm.runInNewContext(`${read("src/js/data/sl100-data.js")}\nthis.result = sl100Data;`, context);
    return context.result;
})();

// Pug data: the abstracts file is a single unbuffered code block.
const abstracts = (() => {
    const source = read("src/pug/abstracts.pug").replace(/^-\s*\n/, "");
    const context = {sl100Data};
    vm.runInNewContext(`${source}\nthis.result = {skills, characteristics};`, context);
    return context.result;
})();

const allSkills = [...abstracts.skills.basic, ...abstracts.skills.advanced];
const skillAttr = (skill) => skill.attr || skill.name.toLowerCase().replace(/ /g, "-");
const specAttr = (spec) => spec.toLowerCase().replace(/ /g, "_");
const pugSkills = allSkills.map(skillAttr);
const pugSpecialisations = allSkills.flatMap(skill => skill.specialisations || []).map(specAttr);
const pugRepeating = allSkills
    .filter(skill => skill.grouped && (!skill.specialisations || skill.forced === 1))
    .map(skillAttr);
const pugWeaponSpecs = ["Melee", "Ranged"]
    .flatMap(name => allSkills.find(skill => skill.name === name).specialisations)
    .map(specAttr);
const pugForceSpecs = allSkills.find(skill => skill.name === "Use the Force").specialisations
    .filter(spec => spec !== "Custom")
    .map(specAttr);

// Sheetworkers: run the module with Roll20 globals stubbed out.
const sl = (() => {
    const noop = () => {};
    const context = {
        on: noop, getAttrs: noop, setAttrs: noop, getSectionIDs: noop,
        generateRowID: () => "", removeRepeatingRow: noop, getTranslationByKey: noop,
        console,
    };
    const source = ["sheetworkers.js", "helperfunctions.js"]
        .map(file => read(`src/js/${file}`))
        .join("\n");
    vm.runInNewContext(`${source}\nthis.result = slModule.sl;`, context);
    return context.result;
})();

sameSet("skills (pug vs sheetworkers)", pugSkills, sl.skills);
sameSet("specialisations (pug vs sheetworkers)", pugSpecialisations, sl.specialisations);
sameSet("repeating skills (pug vs sheetworkers)", pugRepeating, sl.repeating_skills);
sameSet("weapon specialisations (pug vs sheetworkers)", pugWeaponSpecs, sl.weapon_specialisations);
sameSet("force specialisations (pug vs sheetworkers)", pugForceSpecs, sl.force_specialisations);
sameSet("characteristics (pug vs sheetworkers)",
    abstracts.characteristics.map(c => c.name.toLowerCase().replace(/ /g, "_")), sl.characteristics);

// SCSS lists drive the show/hide rules for skill settings rows.
const scss = read("src/scss/_abstracts.scss");
const scssList = (name) => {
    const match = scss.match(new RegExp(`\\$${name}:([^;]*);`));
    return match ? [...match[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : [];
};
// Roll20's CSS sanitizer mangles "evaluate", so the SCSS list spells it "eva1uate".
sameSet("skills (pug vs scss)", pugSkills.map(s => (s === "evaluate" ? "eva1uate" : s)), scssList("skills"));
sameSet("specialisations (pug vs scss)", pugSpecialisations, scssList("specialisations"));

// Translations: every data-i18n key used in the HTML (and every key sheet.json
// names for its user options) needs an entry.
const html = read("sl100.html");
const translation = JSON.parse(read("translation.json"));
const used = new Set();
for (const match of html.matchAll(/data-i18n(?:-placeholder|-title)?="([^"]*)"/g)) {
    used.add(match[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
}
// Keys the sheet workers look up with t("key", fallback).
for (const match of read("src/js/sheetworkers.js").matchAll(/\bt\("([^"]+)"/g)) used.add(match[1]);

const sheetJson = JSON.parse(read("sheet.json"));
for (const option of sheetJson.useroptions || []) {
    for (const key of [option.displaytranslationkey, option.descriptiontranslationkey, ...(option.optiontranslationkeys || [])]) {
        if (key) used.add(key);
    }
}

const missing = [...used].filter(key => !(key in translation));
if (missing.length) errors.push(`translation.json is missing ${missing.length} key(s): ${missing.join(" | ")}`);
const unused = Object.keys(translation).filter(key => !used.has(key));
if (unused.length) warnings.push(`translation.json has ${unused.length} unused key(s): ${unused.join(" | ")}`);

// Every HTML class must carry the sheet- prefix (see scripts/postbuild.js);
// otherwise the CSS does not apply when Legacy Sanitization is off.
{
    const body = html.replace(/<script type="text\/worker">[\s\S]*?<\/script>/, "");
    const bare = new Set();
    for (const match of body.matchAll(/\sclass="([^"]*)"/g)) {
        match[1].split(/\s+/).filter(name => name && !name.startsWith("sheet-") && !name.startsWith("repeating_")).forEach(name => bare.add(name));
    }
    const prefixedRepeating = body.match(/class="[^"]*sheet-repeating_/);
    if (prefixedRepeating) errors.push("a repeating_ fieldset class was given the sheet- prefix; Roll20 will not treat it as a repeating section");
    if (bare.size) errors.push(`sl100.html has classes without the sheet- prefix (run npm run build): ${[...bare].slice(0, 10).join(", ")}`);
}

// Roll20's CSS sanitizer can discard the whole stylesheet over unusual syntax
// in url(); keep ';' and '@' out of them (e.g. Google Fonts css2 URLs).
{
    const css = read("sl100.css");
    for (const match of css.matchAll(/url\(\s*["']?([^"')]*)/g)) {
        if (/[;@]/.test(match[1])) errors.push(`sl100.css has a url() containing ';' or '@', which Roll20 may reject: ${match[1]}`);
    }
    // Modern Sass colour maths emits rgb(12.3%, ...) / hsl(...); stick to hex and rgba(r, g, b, a).
    const modernColour = css.match(/rgba?\([^)]*%[^)]*\)|hsla?\([^)]*\)/);
    if (modernColour) errors.push(`sl100.css has a percentage/hsl colour Roll20 may reject: ${modernColour[0]} (use a hex token in _abstracts.scss)`);
}

// The WFRP artwork is Cubicle 7's; none of it should ship with this sheet.
const css = read("sl100.css");
for (const [name, text] of [["sl100.css", css], ["sl100.html", html]]) {
    const hits = text.match(/files\.d20\.io\/images\/[^"')\s]*/g);
    if (hits) errors.push(`${name} still references Roll20-hosted images: ${[...new Set(hits)].join(", ")}`);
}

warnings.forEach(message => console.warn(`warning: ${message}`));
if (errors.length) {
    errors.forEach(message => console.error(`error: ${message}`));
    process.exit(1);
}
console.log(`check passed: ${pugSkills.length} skills, ${pugSpecialisations.length} specialisations, ${used.size} translation keys`);
