import { IndicationsDAO } from "@/DAO/indications";
import { InventoryDAO } from "@/DAO/inventory";
import { PointsUsageDAO } from "@/DAO/points-usage";
import { calculatePoints } from "@/utils/calculate-points";
import { handleErrors } from "@/utils/handle-errors";

export const fetchStatement = async (req: any, res: any) => {
  try {
    const { id: userId } = req.params;

    const indicationsDAO = new IndicationsDAO();
    const pointsUsageDAO = new PointsUsageDAO();
    const inventoryDAO = new InventoryDAO();

    const [dataIndications, pointsUsages, userPurchases] = await Promise.all([
      indicationsDAO.findMany({ user: (user) => user.id === userId }),
      pointsUsageDAO.findMany({ user: (user) => user.id === userId }),
      inventoryDAO.findMany({
        client: (client) => client.id === userId,
        soldAt: (soldAt) => new Date(soldAt) > new Date("01/16/2024"),
      }),
    ]);

    const indications = dataIndications.map((indication) => ({
      ...indication,
      points: calculatePoints(indication.inventory?.accountValue.toString() || "0"),
      type: "indication"
    }));

    const userPurchasesMapped = userPurchases.map((purchase) => ({
      inventory: purchase,
      client: purchase.client,
      createdAt: new Date(purchase.soldAt || ""),
      points: calculatePoints(purchase.accountValue.toString()),
      type: "purchase"
    }));

    const statement = [...indications, ...pointsUsages, ...userPurchasesMapped].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return res.status(200).send({ data: statement });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
