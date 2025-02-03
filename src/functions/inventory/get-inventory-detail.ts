import { InventoryDAO } from "@/DAO/inventory";
import { handleErrors } from "@/utils/handle-errors";

export const getInventoryDetail = async (req: any, res: any) => {
  try {
    const dao = new InventoryDAO();
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "Inventory ID is required" });
    }

    const item = await dao.findOne({ id });

    if (!item) {
      return res.status(404).send({ message: "Inventory item not found" });
    }

    return res.status(200).send({ data: item });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
