import { Request, Response } from 'express';
import { PointsUsageDAO } from '@/DAO/points-usage';
import { handleErrors } from '@/utils/handle-errors';

export const fetchPointsUsage = async (req: Request, res: Response) => {
  const pointsUsageDAO = new PointsUsageDAO();
  const { status } = req.query;

  try {
    const pointsUsages = await pointsUsageDAO.findMany({
      status: (value) => (status ? value === status : true),
    });
    res.status(200).json(pointsUsages);
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
