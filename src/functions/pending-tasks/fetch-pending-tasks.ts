import { PointsUsageDAO } from '@/DAO/points-usage';
import { handleErrors } from '@/utils/handle-errors';

export const fetchPendingTasks = async (req: any, res: any) => {
  const pointsUsageDAO = new PointsUsageDAO();

  try {
    const pointsUsages = await pointsUsageDAO.findMany({
      status: (status) => status === "pending",
    });

    const data = pointsUsages.map((pU) => {
      return {
        id: pU.id,
        userId: pU.userId,
        user: pU.user,
        type: "point-usage",
        gameId: pU.storeItemId,
        game: pU.storeItem,
        createdAt: pU.createdAt
      }
    })

    res.status(200).json({ data });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
