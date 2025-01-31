import { GamesDAO } from "@/DAO/games";
import { handleErrors } from "@/utils/handle-errors";

export const fetchGames = async (req: any, res: any) => {
  try {
    const dao = new GamesDAO();
    const games = await dao.findMany({})

    return res.status(200).send({ data: games });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
