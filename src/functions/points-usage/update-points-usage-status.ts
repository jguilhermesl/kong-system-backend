import { PointsUsageDAO } from '@/DAO/points-usage';
import { handleErrors } from '@/utils/handle-errors';

export const updatePointsUsageStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { action } = req.body;
  const pointsUsageDAO = new PointsUsageDAO();

  if (!['approved', 'rejected'].includes(action)) {
    throw new Error('Invalid action. Must be "approved" or "rejected".');
  }

  try {
    const pointsUsage = await pointsUsageDAO.findOne({ id: (usageId) => usageId === id });
    if (!pointsUsage) {
      throw new Error('Points usage not found.');
    }

    await pointsUsageDAO.updateOne({ id: (usageId) => usageId === id }, { status: action });
    res.status(200).json({ message: `Points usage ${action} successfully.` });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
