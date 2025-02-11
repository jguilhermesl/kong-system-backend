import { InventoryDAO } from "@/DAO/inventory";
import { InventoryItem } from "@/models/Inventory";
import { flexibleSearch } from "@/utils/flexible-search";
import { handleErrors } from "@/utils/handle-errors";

export const fetchInventory = async (req: any, res: any) => {
  try {
    const dao = new InventoryDAO();
    const { search, sold: soldQuery } = req.query;
    const filters: Partial<Record<keyof InventoryItem, (value: any) => boolean>> = {};

    if (search) {
      filters.game = (game) => flexibleSearch(search, game)
    }

    if (soldQuery) {
      filters.sold = (sold) => soldQuery === "true" ? sold === "TRUE" : sold === "FALSE"
    }

    const data = await dao.findMany(filters);

    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err)
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}
