import { FinancialDAO } from '@/DAO/financial';
import { handleErrors } from '@/utils/handle-errors';

export const fetchFinancial = async (req: any, res: any) => {
  const financialDAO = new FinancialDAO();

  // Função auxiliar para converter valores para number de forma segura
  const safeParseFloat = (value: number | string | undefined): number => {
    if (value === undefined || value === null) return 0;
    const strValue = value.toString();
    // Remove o "R$" e espaços, e substitui a vírgula pelo ponto
    const cleaned = strValue.replace("R$", "").trim().replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  try {
    const financial = await financialDAO.findMany({});
    const sortedFinancial = financial.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // Para vendas da semana, considere apenas os produtos PS4, PS5 ou PS4 E PS5
    const validSaleProducts = ["PS4", "PS5", "PS4 E PS5"];

    const weeklySales = sortedFinancial.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate >= oneWeekAgo &&
        itemDate <= now &&
        validSaleProducts.includes(item.productType)
      );
    });

    const weeklySalesRevenue = weeklySales.reduce(
      (acc, item) => acc + safeParseFloat(item.saleValue),
      0
    );
    const weeklySalesCount = weeklySales.length;

    // Valor total de lucro: soma de todos os saleValue menos a soma de todos os productValue
    const totalProfit = sortedFinancial.reduce(
      (acc, item) =>
        acc + (safeParseFloat(item.saleValue) - safeParseFloat(item.productValue)),
      0
    );

    // Faturamento total: soma de todos os saleValue
    const totalRevenue = sortedFinancial.reduce(
      (acc, item) => acc + safeParseFloat(item.saleValue),
      0
    );

    // Valor pendente: soma de productValue dos itens que NÃO são PS4, PS5 ou PS4 E PS5 e que não foram pagos/reembolsados
    const pendingPayments = sortedFinancial.filter(
      (item) =>
        !validSaleProducts.includes(item.productType) && item.paidOrRefunded === false
    );
    const pendingPaymentValue = pendingPayments.reduce(
      (acc, item) => acc + safeParseFloat(item.productValue),
      0
    );

    // Vendas por mês: agrupe por ano/mês e calcule a quantidade de vendas, faturamento e lucro mensal
    type MonthlyData = {
      year: number;
      month: number;
      salesCount: number;
      monthlyRevenue: number;
      monthlyProfit: number;
    };

    const monthlyDataMap: Record<string, MonthlyData> = {};

    sortedFinancial.forEach((item) => {
      const date = new Date(item.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() retorna 0-11
      const key = `${year}-${month}`;

      if (!monthlyDataMap[key]) {
        monthlyDataMap[key] = {
          year,
          month,
          salesCount: 0,
          monthlyRevenue: 0,
          monthlyProfit: 0,
        };
      }

      monthlyDataMap[key].salesCount += 1;
      monthlyDataMap[key].monthlyRevenue += safeParseFloat(item.saleValue);
      monthlyDataMap[key].monthlyProfit += safeParseFloat(item.saleValue) - safeParseFloat(item.productValue);
    });

    const monthlyMetrics = Object.values(monthlyDataMap);

    // Organiza os metrics com nomes descritivos
    const metrics = {
      weeklySalesRevenue,    // Faturamento das vendas da semana (PS4, PS5, PS4 E PS5)
      weeklySalesCount,      // Quantidade de vendas da semana (PS4, PS5, PS4 E PS5)
      totalProfit,           // Lucro total (soma de saleValue - productValue)
      totalRevenue,          // Faturamento total (soma de saleValue)
      pendingPaymentValue,   // Valor pendente de pagamento/reembolso (itens que não são PS4/PS5/PS4 E PS5 e ainda não foram pagos)
      monthlyMetrics,        // Array de métricas mensais (ano, mês, quantidade de vendas, faturamento e lucro)
    };

    res.status(200).json({ data: sortedFinancial, metrics });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
