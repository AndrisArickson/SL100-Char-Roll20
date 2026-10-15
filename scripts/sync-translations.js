// Brings translation.json in line with the built sheet: adds every key the
// HTML, sheet.json or the sheet workers use (English text = the key) and drops
// keys nothing uses. Existing translations are kept. Run after `npm run build`
// when labels or generated data change:  npm run i18n

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const unescape = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const translation = JSON.parse(read("translation.json"));
const used = new Map();

const html = read("sl100.html").replace(/<script type="text\/worker">[\s\S]*?<\/script>/, "");
for (const m of html.matchAll(/data-i18n(?:-placeholder|-title)?="([^"]*)"/g)) used.set(unescape(m[1]), unescape(m[1]));
for (const m of read("src/js/sheetworkers.js").matchAll(/\bt\("([^"]+)",\s*"([^"]*)"/g)) used.set(m[1], m[2]);
for (const option of JSON.parse(read("sheet.json")).useroptions || []) {
    [[option.displaytranslationkey, option.displayname], [option.descriptiontranslationkey, option.description]]
        .forEach(([key, text]) => key && used.set(key, text || key));
    (option.optiontranslationkeys || []).forEach(key => used.set(key, key));
}

const out = {};
let added = 0;
for (const [key, fallback] of used) {
    if (key in translation) out[key] = translation[key];
    else { out[key] = fallback; added++; }
}
const removed = Object.keys(translation).filter(key => !used.has(key)).length;

fs.writeFileSync(path.join(root, "translation.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`translation.json: ${Object.keys(out).length} keys (${added} added, ${removed} removed)`);
