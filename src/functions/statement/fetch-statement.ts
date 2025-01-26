import { IndicationsDAO } from "@/DAO/indications";
import { InventoryDAO } from "@/DAO/inventory";
import { PointsUsageDAO } from "@/DAO/points-usage";
import { UsersDAO } from "@/DAO/users";
import { calculatePoints } from "@/utils/calculate-points";
import { handleErrors } from "@/utils/handle-errors";

export const fetchStatement = async (req: any, res: any) => {
  try {
    const { id: userId } = req.params;

    const indicationsDAO = new IndicationsDAO();
    const pointsUsageDAO = new PointsUsageDAO();
    const inventoryDAO = new InventoryDAO();
    const usersDAO = new UsersDAO();

    const user = await usersDAO.findOne({
      id: (id) => id === userId
    })

    const [dataIndications, pointsUsages, userPurchases] = await Promise.all([
      indicationsDAO.findMany({ user: (user) => user?.id === userId }),
      pointsUsageDAO.findMany({ user: (user) => user?.id === userId }),
      inventoryDAO.findMany({
        client: (client) => client.phone === user?.phone,
        soldAt: (soldAt) => new Date(soldAt) > new Date("01/01/2025"),
      }),
    ]);

    const indications = dataIndications.map((indication) => ({
      ...indication,
      points: calculatePoints(indication.inventory?.accountValue.toString() || "0", true),
      type: "indication"
    }));

    const userPurchasesMapped = userPurchases.map((purchase) => ({
      inventory: purchase,
      client: purchase.client,
      createdAt: new Date(purchase.soldAt || ""),
      points: calculatePoints(purchase.accountValue.toString(), false),
      type: "purchase"
    }));

    const statement = [...indications, ...pointsUsages, ...userPurchasesMapped].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Calculate the balance
    let balance = 0;
    statement.forEach((entry: any) => {
      if (entry.type === "indication" || entry.type === "purchase") {
        balance += entry.points;
      } else {
        balance -= entry.points;
      }
    });

    return res.status(200).send({ data: statement, balance });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
