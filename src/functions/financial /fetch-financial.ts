import { FinancialDAO } from '@/DAO/financial';
import { handleErrors } from '@/utils/handle-errors';

export const fetchFinancial = async (req: any, res: any) => {
  const financialDAO = new FinancialDAO();

  try {
    const financial = await financialDAO.findMany({});

    const sortedFinancial = financial.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.status(200).json({ data: sortedFinancial });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
