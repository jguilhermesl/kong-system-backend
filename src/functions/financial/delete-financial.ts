import { FinancialDAO } from "../../DAO/financial";
import { handleErrors } from "../../utils/handle-errors";

export const deleteFinancial = async (req: any, res: any) => {
  try {
    const dao = new FinancialDAO();
    const { id } = req.params;

    const deletedItem = await dao.deleteOne({
      id: (itemId) => itemId === id
    });

    if (!deletedItem) {
      return res.status(404).send({ message: "Financial record not found" });
    }

    return res.status(200).send({ message: "Financial record deleted successfully" });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
