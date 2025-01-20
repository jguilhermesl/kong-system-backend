import { IndicationsDAO } from "@/DAO/indications";
import { calculatePoints } from "@/utils/calculate-points";
import { handleErrors } from "@/utils/handle-errors";

export const fetchIndications = async (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const dao = new IndicationsDAO();
    const data = userId
      ? await dao.findMany({ user: (user) => user?.id === userId })
      : await dao.findMany({});

    const indications = data.map((i) => {
      return {
        ...i,
        points: calculatePoints(i.inventory?.accountValue.toString())
      }
    })

    return res.status(200).send({ data: indications });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
