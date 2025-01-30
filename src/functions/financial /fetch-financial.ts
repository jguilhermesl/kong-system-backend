import { FinancialDAO } from '@/DAO/financial';
import { handleErrors } from '@/utils/handle-errors';

export const fetchFinancial = async (req: any, res: any) => {
  const financialDAO = new FinancialDAO();

  try {
    const financial = await financialDAO.findMany({});

    res.status(200).json({ data: financial });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
