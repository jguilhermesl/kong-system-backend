import { InventoryDAO } from "@/DAO/inventory";
import { handleErrors } from "@/utils/handle-errors";

export const getInventoryDetail = async (req: any, res: any) => {
  try {
    const dao = new InventoryDAO();
    const inventoryId = req.params.id;

    const data = await dao.findOne({
      id: (id) => id === inventoryId
    });

    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err)
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}
