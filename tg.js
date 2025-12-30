// Roger's Original Architecture
const key = ($argument || "Turrit").replace(/["']/g, "").trim();
const apps = { "Turrit": "turrit", "Swiftgram": "swiftgram", "iMe": "imem", "Nicegram": "nicegram", "Telegram": "tg" };
const scheme = apps[key] || "turrit";
const url = $request.url;

const getPath = () => {
  if (url.includes("/joinchat/")) return { type: "join", val: "invite=" + url.split("/joinchat/")[1] };
  if (url.includes("/addstickers/")) return { type: "addstickers", val: "set=" + url.split("/addstickers/")[1] };
  if (url.includes("/proxy?")) return { type: "proxy", val: url.split("/proxy?")[1] };
  
  const m = url.match(/t\.me\/(.+)/);
  if (m && !m[1].startsWith("s/") && !m[1].startsWith("iv")) return { type: "resolve", val: "domain=" + m[1] };
  return null;
};

const data = getPath();
if (data) {
  $done({ response: { status: 307, headers: { Location: `${scheme}://${data.type}?${data.val}` } } });
} else {
  $done({});
}
