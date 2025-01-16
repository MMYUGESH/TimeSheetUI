export type FormatDateTimeParams = {
  datetime: Date;
  format?: Intl.DateTimeFormatOptions;
  locales?: Parameters<typeof Intl.DateTimeFormat>[0];
};

export const formatDateTime = ({
  datetime,
  format = { dateStyle: "medium", timeStyle: "short" },
  locales = navigator.language || "en-US",
}: FormatDateTimeParams) => {
  return new Intl.DateTimeFormat(locales, format).format(datetime);
};
