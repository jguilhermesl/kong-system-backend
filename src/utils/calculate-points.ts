export const calculatePoints = (value?: string) => {
  if (!value) return "R$ 0,00";

  const numericValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));

  const points = numericValue * 10;

  return points;
};
