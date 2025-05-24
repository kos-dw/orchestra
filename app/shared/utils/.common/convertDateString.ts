export function convertDateString(
  date?: Date | null,
  isDateOnly?: boolean,
): string | null {
  if (!date) return null;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: !isDateOnly ? "2-digit" : undefined,
    minute: !isDateOnly ? "2-digit" : undefined,
    second: !isDateOnly ? "2-digit" : undefined,
  };
  const formater = new Intl.DateTimeFormat("ja-JP", options);

  return formater.format(date).replace(/\//g, "-");
}
