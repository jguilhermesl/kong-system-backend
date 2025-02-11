import { handleErrors } from "@/utils/handle-errors";
import { getUserStatement } from "@/utils/get-user-statement";

export const fetchStatement = async (req: any, res: any) => {
  try {
    const { id: userId } = req.params;

    const { statement, balance } = await getUserStatement(userId);

    return res.status(200).send({ data: statement, balance });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
