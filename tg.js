// --- Telegram 302 强力重定向版 ---

const appName = $argument ? $argument.replace(/"/g, "").trim() : "Turrit";
const url = $request.url;

// 1. 协议头映射 (强制使用专用协议，防止官方 App 抢夺)
const schemes = {
    "Telegram": "tg://",
    "Turrit": "turrit://",
    "Swiftgram": "swiftgram://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

let scheme = schemes[appName] || "turrit://";
let newUrl = "";

// 2. 解析逻辑
if (url.indexOf("/joinchat/") !== -1) {
    let match = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
    if (match) newUrl = `${scheme}join?invite=${match[1]}`;
} else if (url.indexOf("/addstickers/") !== -1) {
    let match = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (match) newUrl = `${scheme}addstickers?set=${match[1]}`;
} else if (url.indexOf("/proxy?") !== -1) {
    let match = url.split("/proxy?")[1];
    if (match) newUrl = `${scheme}proxy?${match}`;
} else {
    // 普通 t.me 链接
    let cleanUrl = url.split("?")[0];
    let pathParts = cleanUrl.split(/t\.me\//);
    if (pathParts.length > 1) {
        let path = pathParts[1];
        // 排除资源文件
        if (path && !path.startsWith("s/") && !path.endsWith(".jpg") && !path.endsWith(".ico")) {
            newUrl = `${scheme}resolve?domain=${path}`;
        }
    }
}

// 3. 302 跳转
if (newUrl) {
    $done({
        response: {
            status: 302,
            headers: { "Location": newUrl }
        }
    });
} else {
    $done({});
}
