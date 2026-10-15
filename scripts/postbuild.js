// Post-processes the compiled sl100.html so it works under either Roll20
// sanitizer:
//
// 1. Class prefixes. The CSS targets `.sheet-*` classes. Roll20's legacy
//    sanitizer adds that prefix to HTML classes automatically, but the current
//    (non-legacy) sanitizer does not, so an unprefixed sheet renders unstyled.
//    Writing the prefix into the HTML makes both modes match; legacy mode
//    leaves classes that already start with "sheet-" alone. Fieldset classes
//    such as "repeating_talent" must stay bare: Roll20 uses them to name
//    repeating sections.
//
// 2. Label fallbacks. Roll20 fills data-i18n elements from translation.json.
//    Empty elements are given their English text so labels still show if the
//    translation is missing or not yet loaded.
//
// Run automatically by `npm run build` (build:pug).

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "sl100.html");
const translation = JSON.parse(fs.readFileSync(path.join(root, "translation.json"), "utf8"));

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unescapeAttr = (text) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

const prefixClasses = (markup) => markup.replace(/(\sclass=")([^"]*)(")/g, (match, open, classes, close) => {
    const prefixed = classes.split(/\s+/).filter(Boolean)
        .map(name => (name.startsWith("sheet-") || name.startsWith("repeating_")) ? name : `sheet-${name}`)
        .join(" ");
    return `${open}${prefixed}${close}`;
});

// Only fills elements with nothing between the tags; elements that already
// hold text or children are left for Roll20 to translate.
const fillLabels = (markup) => markup.replace(/(<([a-z0-9]+)\b[^>]*\sdata-i18n="([^"]*)"[^>]*>)(<\/\2>)/g,
    (match, openTag, tag, key, closeTag) => {
        const text = translation[unescapeAttr(key)];
        return (text === undefined) ? match : `${openTag}${escapeHtml(text)}${closeTag}`;
    });

let html = fs.readFileSync(htmlPath, "utf8");

// Leave the sheet worker script untouched.
const parts = html.split(/(<script type="text\/worker">[\s\S]*?<\/script>)/);
html = parts.map(part => part.startsWith('<script type="text/worker">') ? part : fillLabels(prefixClasses(part))).join("");

// 3. Build stamp: the date and time of this build, shown under the header title
//    (HTML) and after it (CSS), so it is easy to see which build Roll20 runs.
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
html = html.split("__SL_BUILD__").join(`Build ${stamp}`);
const cssPath = path.join(root, "sl100.css");
fs.writeFileSync(cssPath, fs.readFileSync(cssPath, "utf8").split("__SL_BUILD__").join(stamp));

fs.writeFileSync(htmlPath, html);
console.log("postbuild: classes prefixed with sheet-, label fallbacks filled");
