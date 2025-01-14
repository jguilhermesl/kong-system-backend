export function formatCurrencyToNumber(value: string | undefined): number {
  if (!value) return 0;
  const formattedValue = value
    .replace(/[^\d,]/g, '')
    .replace(',', '.');

  return parseFloat(formattedValue);
}
