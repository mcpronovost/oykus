export function oykClass(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function oykTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "Hello";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Hello";
}

function zonedDayKey(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function calendarDayDiff(from, to, timezone) {
  const [fromYear, fromMonth, fromDay] = zonedDayKey(from, timezone).split("-").map(Number);
  const [toYear, toMonth, toDay] = zonedDayKey(to, timezone).split("-").map(Number);
  const fromUtc = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const toUtc = Date.UTC(toYear, toMonth - 1, toDay);
  return Math.round((fromUtc - toUtc) / 86_400_000);
}

function resolveTimezone(timezone) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return "UTC";
  }
}

export function oykDateTimeFormatter(lang, timezone, show = "full") {
  const formatLang = lang == "fr" ? "fr-FR" : "en-CA";
  return new Intl.DateTimeFormat(`${formatLang}`, {
    hour12: false,
    year: (["full","date"].includes(show) ? "numeric" : undefined),
    month: (["full","date"].includes(show) ? "short" : undefined),
    day: (["full","date"].includes(show) ? "numeric" : undefined),
    hour: (["full","time"].includes(show) ? "2-digit" : undefined),
    minute: (["full","time"].includes(show) ? "2-digit" : undefined),
    timeZone: resolveTimezone(timezone || "UTC"),
  });
}

export function oykDate(date, lang = "en", timezone = "UTC") {
  if (date == null || date === "") return "";

  const then = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(then.getTime())) return "";

  const formatter = oykDateTimeFormatter(lang, timezone);
  return formatter.format(then);
}

export function oykTimeAgo(date, lang = "en", timezone = "UTC") {
  if (date == null || date === "") return "";

  const then = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(then.getTime())) return "";

  const now = new Date();
  const resolvedTimezone = resolveTimezone(timezone || "UTC");
  const rtf = new Intl.RelativeTimeFormat(lang || "en", { numeric: "auto" });

  const diffSeconds = Math.round((then.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) {
    return rtf.format(0, "second");
  }

  if (absSeconds < 45 * 60) {
    return rtf.format(Math.round(diffSeconds / 60), "minute");
  }

  const dayDiff = calendarDayDiff(then, now, resolvedTimezone);

  if (dayDiff === 0) {
    return rtf.format(Math.round(diffSeconds / 3600), "hour");
  }

  if (Math.abs(dayDiff) < 7) {
    return rtf.format(dayDiff, "day");
  }

  if (Math.abs(dayDiff) < 30) {
    return rtf.format(Math.round(dayDiff / 7), "week");
  }

  if (Math.abs(dayDiff) < 365) {
    return rtf.format(Math.round(dayDiff / 30), "month");
  }

  return rtf.format(Math.round(dayDiff / 365), "year");
}
