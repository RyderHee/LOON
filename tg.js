const appName = $argument ? $argument : "Telegram";
const url = $request.url;

// 各种 App 的协议头
const schemes = {
    "Telegram": "tg://",
    "Swiftgram": "swiftgram://",
    "Turrit": "turrit://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

let targetScheme = schemes[appName] || "tg://";
let newPath = "";

// 1. 进群
let joinMatch = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
if (joinMatch) {
    newPath = `join?invite=${joinMatch[1]}`;
} 
// 2. 贴纸
else if (url.match(/\/addstickers\//)) {
    let stickerMatch = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (stickerMatch) newPath = `addstickers?set=${stickerMatch[1]}`;
}
// 3. 代理
else if (url.match(/\/proxy\?/)) {
    let proxyMatch = url.split("/proxy?")[1];
    if (proxyMatch) newPath = `proxy?${proxyMatch}`;
}
// 4. 普通频道/个人
else {
    let path = url.split(/t\.me\//)[1];
    if (path && !path.startsWith("s/") && !path.startsWith("share/")) {
        let cleanPath = path.split("?")[0];
        if (cleanPath) newPath = `resolve?domain=${cleanPath}`;
    }
}

// 跳转
if (newPath) {
    $done({
        response: {
            status: 302,
            headers: { "Location": `${targetScheme}${newPath}` }
        }
    });
} else {
    $done({});
}
