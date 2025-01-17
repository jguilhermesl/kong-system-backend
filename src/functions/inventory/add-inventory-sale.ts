import { InventoryDAO } from "@/DAO/inventory";
import { UsersDAO } from "@/DAO/users";
import { IndicationsDAO } from "@/DAO/indications";
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";

const addInventorySaleSchema = z.object({
  clientId: z.string(),
  saleValue: z.number().positive({ message: "Sale value must be a positive number." }),
  sellerName: z.string().min(1, { message: "Seller name is required." }),
  indicationCode: z.string().min(1, { message: "Indication code is required." }).optional(),
});

export const addInventorySale = async (req: any, res: any) => {
  try {
    const parsedData = addInventorySaleSchema.parse(req.body);
    const inventoryId = req.params.id;

    const inventoryDAO = new InventoryDAO();
    const inventory = await inventoryDAO.findOne({
      id: (id) => id === inventoryId
    })

    const usersDAO = new UsersDAO();
    const client = await usersDAO.findOne({
      id: (id) => id == parsedData.clientId
    })

    if (!client) {
      throw new Error("Cliente não encontrado.")
    }

    if (inventory) {
      await inventoryDAO.updateOne({
        id: (id) => id === inventoryId
      }, {
        soldAt: new Date(),
        sold: true,
        client,
        accountValue: parsedData.saleValue,
        soldBy: parsedData.sellerName
      })
    }

    if (parsedData.indicationCode) {
      const indicationsDAO = new IndicationsDAO();
      const indicatorUser = await usersDAO.findOne({
        code: (code) => code === parsedData.indicationCode
      })

      if (!indicatorUser) {
        throw new Error("Código inválido. Usuário não encontrado.")
      }

      await indicationsDAO.createOne({
        userId: indicatorUser.id,
        inventoryId: inventoryId,
      });
    }

    return res.status(200).send({ data: "Adicionado!" });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
}
