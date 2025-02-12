import { InventoryDAO } from "@/DAO/inventory";
import { UsersDAO } from "@/DAO/users";
import { IndicationsDAO } from "@/DAO/indications";
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { FinancialDAO } from "@/DAO/financial";
import { calculateComissioning } from "@/utils/calculateComissioning";
import { formatCurrencyToNumber } from "@/utils/format-currency-to-number";

const addInventorySaleSchema = z.object({
  clientId: z.string(),
  saleValue: z.number().positive({ message: "Sale value must be a positive number." }),
  sellerId: z.string().min(1, { message: "Seller id is required." }),
  indicationCode: z.string().optional(),
});

export const addInventorySale = async (req: any, res: any) => {
  try {
    const parsedData = addInventorySaleSchema.parse(req.body);
    const inventoryId = req.params.id;
    const sub = req.userState.sub;

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

    if (!inventory) {
      throw new Error("Estoque não encontrado.")
    }

    await inventoryDAO.updateOne({
      id: (id) => id === inventoryId
    }, {
      soldAt: new Date(),
      sold: true,
      client,
      accountValue: parsedData.saleValue.toString(),
      soldById: parsedData.sellerId,
    })

    if (parsedData.indicationCode) {
      const indicationsDAO = new IndicationsDAO();
      const indicatorUser = await usersDAO.findOne({
        code: (code) => code === parsedData.indicationCode
      })

      if (!indicatorUser) {
        throw new Error("Código inválido. Usuário não encontrado.")
      }

      if (indicatorUser.id === client.id) {
        throw new Error("O cliente não pode usar o próprio código.")
      }

      await indicationsDAO.createOne({
        userId: indicatorUser.id,
        inventoryId: inventoryId,
      });
    }

    const financialDAO = new FinancialDAO();
    await financialDAO.createOne({
      clientNumber: client.phone,
      createdById: sub,
      obs: "",
      paidOrRefunded: true,
      productName: inventory.game,
      commissioning: await calculateComissioning(parsedData.sellerId, parsedData.saleValue) || 0,
      productType: inventory.gameVersion,
      productValue: ["PS4", "PS5"].includes(inventory.gameVersion) ? formatCurrencyToNumber(inventory.purchaseValue) / 3 : formatCurrencyToNumber(inventory.purchaseValue) / 4,
      saleValue: parsedData.saleValue,
      sellerId: parsedData.sellerId,
    })

    return res.status(200).send({ data: "Adicionado!" });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
}
