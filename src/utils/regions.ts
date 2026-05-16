export const REGION_FLAGS: Record<string, string> = {
  "Canada": "🇨🇦",
  "United States": "🇺🇸",
  "India": "🇮🇳",
  "United Kingdom": "🇬🇧",
  "Australia": "🇦🇺",
  "Germany": "🇩🇪",
};

export const REGION_TIMEZONE: Record<string, string> = {
  "Canada": "America/Toronto",
  "United States": "America/New_York",
  "India": "Asia/Kolkata",
  "United Kingdom": "Europe/London",
  "Australia": "Australia/Sydney",
  "Germany": "Europe/Berlin",
};

export function getFlag(region: string): string {
  return REGION_FLAGS[region] ?? "🌐";
}

export function getTimezoneAbbr(region: string): string {
  const tz = REGION_TIMEZONE[region];
  if (!tz) return "";
  const parts = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date());
  return parts.find(p => p.type === "timeZoneName")?.value ?? "";
}

export function formatDateWithRegion(isoString: string, region?: string): string {
  if (!isoString) return "—";
  const tz = region ? REGION_TIMEZONE[region] : undefined;
  return new Date(isoString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
  });
}
