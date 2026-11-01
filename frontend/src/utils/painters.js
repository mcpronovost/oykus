function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToRgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255;
  };
  return { r: f(0), g: f(8), b: f(4) };
}

function shiftHex(hex, ds, dl) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const next = hslToRgb(
    h,
    Math.min(1, Math.max(0, s + ds)),
    Math.min(1, Math.max(0, l + dl)),
  );
  return rgbToHex(next.r, next.g, next.b);
}

/** Same deltas as theme.css: +10/+10, -10/-10, -20/-25, -30/-35 */
export function accentScale(hex, opa = false) {
  if (opa) {
    return {
      default: hex,
      hover: `${shiftHex(hex, 0.15, 0.15)}`,
      subtle: `${hex}90`,
      muted: `${hex}60`,
      faint: `${hex}40`,
    };
  }
  return {
    default: hex,
    hover: shiftHex(hex, 0.1, 0.1),
    subtle: shiftHex(hex, -0.1, -0.1),
    muted: shiftHex(hex, -0.2, -0.25),
    faint: shiftHex(hex, -0.3, -0.35),
  };
}