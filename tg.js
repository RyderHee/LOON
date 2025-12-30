const target = ($argument || "Turrit").replace(/["']/g, "").trim().toUpperCase();
const map = { "TURRIT": "turrit", "SWIFTGRAM": "swiftgram", "IME": "imem", "NICEGRAM": "nicegram", "TELEGRAM": "tg" };
const scheme = map[target] || "turrit";
const url = $request.url;
let action, value;

if (url.includes("/joinchat/")) {
    action = "join";
    value = "invite=" + url.split("/joinchat/")[1];
} else if (url.includes("/addstickers/")) {
    action = "addstickers";
    value = "set=" + url.split("/addstickers/")[1];
} else if (url.includes("/proxy?")) {
    action = "proxy";
    value = url.split("/proxy?")[1];
} else {
    const m = url.match(/t\.me\/(.+)/);
    if (m && !m[1].startsWith("s/") && !m[1].endsWith(".ico")) {
        action = "resolve";
        value = "domain=" + m[1];
    }
}

if (action) {
    $done({ response: { status: 307, headers: { Location: `${scheme}://${action}?${value}`, "Cache-Control": "no-cache" } } });
} else {
    $done({});
}
