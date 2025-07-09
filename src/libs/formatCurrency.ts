export const formatCurrency = (
  value: number,
  currency = "USD",
  locale = "en-US"
) => {
  if (value == null) return "N/A";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
