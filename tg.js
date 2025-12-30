// Core Logic: Response Modification
// Mode: http-response

const userSelection = ($argument || "Turrit").replace(/["']/g, "").trim();
let appScheme = "turrit";

// 严格匹配协议头
switch (userSelection) {
    case "Swiftgram": appScheme = "sg"; break;
    case "iMe": appScheme = "imem"; break;
    case "Nicegram": appScheme = "nicegram"; break;
    case "Telegram": appScheme = "tg"; break;
    default: appScheme = "turrit";
}

const requestLink = $request.url;
let targetPath = null;

// 路径特征提取
const patterns = {
    join: /\/joinchat\/([a-zA-Z0-9_-]+)/,
    sticker: /\/addstickers\/([a-zA-Z0-9_-]+)/,
    proxy: /\/proxy\?(.+)/,
    resolve: /t\.me\/([^?\/]+)/
};

if (requestLink.match(patterns.join)) {
    targetPath = "join?invite=" + requestLink.match(patterns.join)[1];
} else if (requestLink.match(patterns.sticker)) {
    targetPath = "addstickers?set=" + requestLink.match(patterns.sticker)[1];
} else if (requestLink.match(patterns.proxy)) {
    targetPath = "proxy?" + requestLink.match(patterns.proxy)[1];
} else {
    const match = requestLink.match(patterns.resolve);
    // 过滤 icon 和 weird paths
    if (match && !match[1].startsWith("s/") && !match[1].startsWith("iv")) {
        targetPath = "resolve?domain=" + match[1];
    }
}

if (targetPath) {
    $done({
        status: 307, // 强制覆写状态码
        headers: {
            "Location": `${appScheme}://${targetPath}`,
            "Cache-Control": "no-cache, no-store, must-revalidate", // 杀绝缓存
            "Pragma": "no-cache"
        }
    });
} else {
    $done({});
}
