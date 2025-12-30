// 1. 获取用户选择的 App (去除可能的引号和空格)
let appName = "Telegram";
if (typeof $argument !== "undefined" && $argument) {
    appName = $argument.replace(/"/g, "").trim();
}

const url = $request.url;

// 2. 协议头映射表
const schemes = {
    "Telegram": "tg://",
    "Swiftgram": "swiftgram://",
    "Turrit": "turrit://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

// 3. 确定目标协议
let targetScheme = schemes[appName] || "tg://";
let newPath = "";

// 4. 解析链接逻辑
let joinMatch = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
if (joinMatch) {
    newPath = `join?invite=${joinMatch[1]}`;
} else if (url.match(/\/addstickers\//)) {
    let stickerMatch = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (stickerMatch) newPath = `addstickers?set=${stickerMatch[1]}`;
} else if (url.match(/\/proxy\?/)) {
    let proxyMatch = url.split("/proxy?")[1];
    if (proxyMatch) newPath = `proxy?${proxyMatch}`;
} else {
    let path = url.split(/t\.me\//)[1];
    if (path && !path.startsWith("s/") && !path.startsWith("share/")) {
        let cleanPath = path.split("?")[0];
        if (cleanPath) newPath = `resolve?domain=${cleanPath}`;
    }
}

// 5. 执行跳转 (使用 HTML 方式，防拦截，成功率最高)
if (newPath) {
    const finalUrl = `${targetScheme}${newPath}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0;url=${finalUrl}">
        <title>跳转中...</title>
        <style>body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;}</style>
    </head>
    <body>
        <div style="text-align:center">
            <p>正在跳转到 ${appName}...</p>
            <br>
            <a href="${finalUrl}" style="color:#007aff;font-size:18px;">如未跳转请点此</a>
        </div>
        <script>
            window.location.href = "${finalUrl}";
            setTimeout(function(){ window.location.href = "${finalUrl}"; }, 500);
        </script>
    </body>
    </html>`;

    $done({
        response: {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: html
        }
    });
} else {
    $done({});
}
