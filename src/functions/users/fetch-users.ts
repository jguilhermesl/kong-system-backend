import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";

export const fetchUsers = async (req: any, res: any) => {
  try {
    const dao = new UsersDAO();
    const data = await dao.findMany({
      createdAt: (createdAt) => !!createdAt,
    });

    return res.status(200).send({ data: data });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}