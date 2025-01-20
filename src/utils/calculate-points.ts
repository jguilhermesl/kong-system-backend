export const calculatePoints = (value: string, isIndication: boolean) => {
  if (!value) return "R$ 0,00";

  const numericValue = parseInt(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  console.log(numericValue)

  const points = numericValue * (isIndication ? 0.15 : 0.10);

  return points;
};
