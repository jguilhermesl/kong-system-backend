import { InventoryDAO } from "@/DAO/inventory";
import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";

export const fetchClientPurchases = async (req: any, res: any) => {
  try {
    const { id: userId } = req.params;

    const usersDAO = new UsersDAO();
    const user = await usersDAO.findOne({
      id: (id) => id === userId
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const inventoryDAO = new InventoryDAO();

    const userPurchases = await inventoryDAO.findMany({
      client: (client) => client.phone === user.phone,
    });

    const userPurchasesMapped = userPurchases.map((purchase) => ({
      inventory: {
        game: purchase.game,
        gameVersion: purchase.gameVersion,
        accountType: purchase.accountType,
        accountValue: purchase.accountValue,
        email: purchase.email,
        password: purchase.psnPassword
      },
      createdAt: new Date(purchase.soldAt || "")
    }));

    return res.status(200).send({ data: userPurchasesMapped });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
