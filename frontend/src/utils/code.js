function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeText(value) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function isSafeHref(url) {
  const value = String(url).trim();
  if (!value || /[\s<>"']/.test(value) || value.startsWith("//")) return false;
  if (value.startsWith("/") || value.startsWith("#") || value.startsWith("?")) return true;
  try {
    const protocol = new URL(value).protocol.toLowerCase();
    return protocol === "http:" || protocol === "https:" || protocol === "mailto:";
  } catch {
    return false;
  }
}

function isSafeImgSrc(url) {
  const value = String(url).trim();
  if (!value || /[\s<>"']/.test(value) || value.startsWith("//")) return false;
  if (value.startsWith("/")) return true;
  try {
    const protocol = new URL(value).protocol.toLowerCase();
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function resolveColour(value) {
  const colour = String(value).trim();
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colour)) {
    return colour;
  }
  if (/^[a-zA-Z0-9_]+$/.test(colour)) {
    return `var(--oyk-c-${colour})`;
  }
  return null;
}

const OYK_CODE_TAGS = {
  g: { open: '<span class="oyk-code-g">', close: "</span>" },
  i: { open: '<span class="oyk-code-i">', close: "</span>" },
  s: { open: '<span class="oyk-code-s">', close: "</span>" },
  b: { open: '<span class="oyk-code-b">', close: "</span>" },
  ag: { open: '<span class="oyk-code-ag">', close: "</span>", block: true },
  ac: { open: '<span class="oyk-code-ac">', close: "</span>", block: true },
  ad: { open: '<span class="oyk-code-ad">', close: "</span>", block: true },
};

const OYK_CODE_TAG_PATTERN = /\[(\/)?([a-zA-Z]+)(?:=([^\]]+))?\]/g;

function trimLeadingNewlines(value, count) {
  let text = value;
  let remaining = count;
  while (remaining > 0 && text.startsWith("\n")) {
    text = text.slice(1);
    remaining -= 1;
  }
  return { text, remaining };
}

export function oykCode(text) {
  if (text == null || text === "") return "";

  const source = String(text).replace(/\r\n?/g, "\n");
  let result = "";
  const stack = [];
  let lastIndex = 0;
  let skipLeadingNewlines = 0;

  const appendText = (value) => {
    const trimmed = trimLeadingNewlines(value, skipLeadingNewlines);
    skipLeadingNewlines = trimmed.remaining;
    result += escapeText(trimmed.text);
  };

  for (const match of source.matchAll(OYK_CODE_TAG_PATTERN)) {
    const [full, isClose, rawName, rawValue] = match;
    const index = match.index;
    const name = rawName.toLowerCase();

    appendText(source.slice(lastIndex, index));
    lastIndex = index + full.length;

    if (isClose) {
      let stackIndex = -1;
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i].name === name) {
          stackIndex = i;
          break;
        }
      }
      if (stackIndex === -1) {
        result += escapeHtml(full);
        continue;
      }
      while (stack.length > stackIndex) {
        const closed = stack.pop();
        result += closed.close;
        if (closed.block) skipLeadingNewlines += 1;
      }
      continue;
    }

    if (name === "img") {
      if (rawValue == null || !isSafeImgSrc(rawValue)) {
        result += escapeHtml(full);
        continue;
      }
      result += `<img class="oyk-code-img" src="${escapeHtml(rawValue.trim())}" alt="" />`;
      skipLeadingNewlines += 1;
      continue;
    }

    if (name === "url" || name === "urlo") {
      if (rawValue == null || !isSafeHref(rawValue)) {
        result += escapeHtml(full);
        continue;
      }
      const href = escapeHtml(rawValue.trim());
      const open =
        name === "urlo"
          ? `<a class="oyk-code-url oyk-code-urlo" href="${href}" target="_blank" rel="noopener noreferrer">`
          : `<a class="oyk-code-url" href="${href}">`;
      result += open;
      stack.push({ name, close: "</a>" });
      continue;
    }

    if (name === "c") {
      const colour = rawValue == null ? null : resolveColour(rawValue);
      if (!colour) {
        result += escapeHtml(full);
        continue;
      }
      result += `<span class="oyk-code-c" style="color:${escapeHtml(colour)};">`;
      stack.push({ name, close: "</span>" });
      continue;
    }

    const tag = OYK_CODE_TAGS[name];
    if (!tag || rawValue != null) {
      result += escapeHtml(full);
      continue;
    }

    result += tag.open;
    stack.push({ name, close: tag.close, block: Boolean(tag.block) });
  }

  appendText(source.slice(lastIndex));

  while (stack.length > 0) {
    result += stack.pop().close;
  }

  return result;
}
