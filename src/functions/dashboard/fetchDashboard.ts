import { UsersDAO } from "@/DAO/users";
import { FinancialDAO } from "@/DAO/financial";
import { handleErrors } from "@/utils/handle-errors";

export const fetchDashboard = async (req: any, res: any) => {
  const userDAO = new UsersDAO();
  const financialDAO = new FinancialDAO();

  try {
    const users = await userDAO.findMany({});
    const latestUsers = users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    const activeUsers = users.filter((user) => user.passwordHash);
    const adminUsers = activeUsers.filter(
      (user) => user.role === "admin"
    ).length;
    const clientUsers = activeUsers.filter(
      (user) => user.role !== "admin"
    ).length;
    const activeUsersCount = { adminUsers, clientUsers };

    const sales = await financialDAO.findMany({});
    const latestSales = sales
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    res.status(200).json({
      data: {
        latestUsers,
        activeUsersCount,
        latestSales,
      },
    });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
