export const calculateCashback = (value?: string) => {
  if (!value) return "R$ 0,00";

  const numericValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));

  const cashback = numericValue * 0.10;

  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cashback);
};
