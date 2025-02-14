import { FinancialDAO } from "../../DAO/financial";
import { handleErrors } from "../../utils/handle-errors";
import { z } from "zod";

const financialSchema = z.object({
  productType: z.string().min(1, "Product type is required").optional(),
  productName: z.string().min(1, "Product name is required").optional(),
  saleValue: z.number().positive("Sale value must be positive").optional(),
  paidOrRefunded: z.boolean().optional()
});

export const updateFinancial = async (req: any, res: any) => {
  try {
    const financialDAO = new FinancialDAO();
    const { id: financialId } = req.params;
    const parsedData = financialSchema.parse(req.body);

    const existsFinancial = await financialDAO.findOne({
      id: (itemId) => itemId === financialId
    })

    if (!existsFinancial) {
      return res.status(404).send({ message: "Financial record not found" });
    }

    const updatedItem = await financialDAO.updateOne({
      id: (itemId) => itemId === financialId
    }, {
      productName: parsedData.productName,
      productType: parsedData.productType,
      saleValue: parsedData.saleValue || 0,
      paidOrRefunded: parsedData.paidOrRefunded
    });



    return res.status(200).send({ message: "Financial record updated successfully" });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
