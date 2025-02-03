export const formatCurrency = (value: string): string => {
  const number = parseFloat(value);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
};
