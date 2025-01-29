import { PointsUsageDAO } from '@/DAO/points-usage';
import { StoreDAO } from '@/DAO/store';
import { handleErrors } from '@/utils/handle-errors';

export const requestGame = async (req: any, res: any) => {
  const { storeItemId } = req.body;
  const { sub } = req.userState;
  const storeDAO = new StoreDAO();
  const pointsUsageDAO = new PointsUsageDAO();

  try {
    const storeItem = await storeDAO.findOne({ id: (id) => id === storeItemId });
    if (!storeItem) {
      throw new Error('Store item not found.');
    }

    const points = storeItem.price;

    const alreadyRequestThisStore = await pointsUsageDAO.findOne({
      storeItemId,
      userId: sub,
      status: (status) => ["pending", "accepted"].includes(status)
    })

    if (alreadyRequestThisStore) {
      throw new Error('Você já resgatou esse item.');
    }

    await pointsUsageDAO.createOne({ userId: sub, storeItemId, points, status: 'pending' });
    res.status(201).json({ message: 'Game request recorded successfully.' });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
};
