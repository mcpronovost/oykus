/* eslint-disable quotes */
export const oykCode = (text) => {
  let r = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br />")
    .replace(/\[g\]/g, '<span style="font-weight:bold;">')
    .replace(/\[\/g\]/g, "</span>")
    .replace(/\[i\]/g, '<span style="font-style:italic;">')
    .replace(/\[\/i\]/g, "</span>")
    .replace(/\[s\]/g, '<span style="text-decoration:underline;">')
    .replace(/\[\/s\]/g, "</span>")
    .replace(/\[b\]/g, '<span style="text-decoration:line-through;">')
    .replace(/\[\/b\]/g, "</span>")
    .replace(/\[ag\]/g, '<div style="text-align:left;">')
    .replace(/\[\/ag\]/g, "</div>")
    .replace(/\[ac\]/g, '<div style="text-align:center;">')
    .replace(/\[\/ac\]/g, "</div>")
    .replace(/\[ad\]/g, '<div style="text-align:right;">')
    .replace(/\[\/ad\]/g, "</div>")
    .replace(
      /\[c=#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\]/g,
      '<span style="color:#$1;">'
    )
    .replace(/\[c=([a-zA-Z0-9_]+)\]/g, '<span style="color:var(--oyk-c-$1);">')
    .replace(/\[\/c\]/g, "</span>")
    .replace(/\[url=([^<>[\]]+)\]/g, '<a href="$1">')
    .replace(/\[\/url\]/g, "</a>")
    .replace(/\[urlo=([^<>[\]]+)\]/g, '<a href="$1" target="_blank">')
    .replace(/\[\/urlo\]/g, "</a>")
    .replace(/\[img=([^<>[\]]+)\]/g, '<img src="$1" alt="" />')
    .replace(/\[ico=([a-z- ]+)\]/g, '<i class="mdi $1"></i>')
    .replace(/\[table\]/g, "<table>")
    .replace(/\[\/table\]/g, "</table>")
    .replace(/\[th col=([0-9]+)\]/g, '<th colspan="$1">')
    .replace(/\[th\]/g, "<th>")
    .replace(/\[\/th\]/g, "</th>")
    .replace(/\[tr\]/g, "<tr>")
    .replace(/\[\/tr\]/g, "</tr>")
    .replace(/\[td col=([0-9]+)\]/g, '<td colspan="$1">')
    .replace(/\[td\]/g, "<td>")
    .replace(/\[\/td\]/g, "</td>");
  return r;
};
/* eslint-enable quotes */

function oykDateUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

export const oykDate = (
  value,
  show = "full",
  lang = "fr",
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  if (lang === "en") lang = "en-CA";
  if (lang === "fr") lang = "fr-FR";
  let d = value ? oykDateUTC(new Date(value)) : oykDateUTC(new Date(new Date().toString()));
  let o = {
    timeZone: tz,
    hour12: false,
    year: ["full", "date"].includes(show) ? "numeric" : undefined,
    month: ["full", "date"].includes(show) ? "long" : undefined,
    day: ["full", "date"].includes(show) ? "numeric" : undefined,
    hour: ["full", "time"].includes(show) ? "2-digit" : undefined,
    minute: ["full", "time"].includes(show) ? "2-digit" : undefined,
  };
  return d.toLocaleString(lang, o);
};

export const oykDateLessThan = (date, days) => {
  return new Date(date) < new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
};

export const oykTimeAgo = (
  value,
  lang = "fr",
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const rtf = new Intl.RelativeTimeFormat(lang, { timeZone: tz, numeric: "auto" });
  const date = oykDateUTC(new Date(value));
  const now = new Date();

  const seconds = Math.floor((date - now) / 1000);

  const divisions = [
    { amount: 60, name: "second" },
    { amount: 60, name: "minute" },
    { amount: 24, name: "hour" },
    { amount: 7,  name: "day" },
    { amount: 4.34524, name: "week" },
    { amount: 12, name: "month" },
    { amount: Infinity, name: "year" },
  ];

  let duration = seconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

export const oykUnit = (num, digits = 2) => {
  const l = [
    { v: 1, u: "" },
    { v: 1e3, u: "k" },
    { v: 1e6, u: "M" },
    { v: 1e9, u: "G" },
    { v: 1e12, u: "T" },
    { v: 1e15, u: "P" },
    { v: 1e18, u: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i = l
    .slice()
    .reverse()
    .find(function (i) {
      return num >= i.v;
    });
  return i ? (num / i.v).toFixed(digits).replace(rx, "$1") + i.u : "0";
};

// Helper functions to manipulate colors
const hexToRGB = (hex) => {
  if (!hex) return null;
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16),
  };
};

const isLightColor = (colour) => {
  if (!colour) return true;
  const rgb = hexToRGB(colour);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
};

const adjustColor = (colour, percent) => {
  if (!colour) return null;
  const rgb = hexToRGB(colour);
  const adjust = (value) => {
    const adjusted = Math.floor(value * (1 + percent));
    return Math.min(255, Math.max(0, adjusted));
  };

  const r = adjust(rgb.r).toString(16).padStart(2, "0");
  const g = adjust(rgb.g).toString(16).padStart(2, "0");
  const b = adjust(rgb.b).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
};

export const oykContrast = (colour) => {
  return isLightColor(colour)
    ? adjustColor(colour, -0.6)
    : adjustColor(colour, 0.6);
};