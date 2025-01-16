import { IndicationsDAO } from "@/DAO/indications";
import { handleErrors } from "@/utils/handle-errors";

export const fetchUserIndications = async (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const dao = new IndicationsDAO();
    const data = userId
      ? await dao.findMany({ user: (user) => user.id === userId })
      : await dao.findMany({});

    return res.status(200).send({ data: data });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
