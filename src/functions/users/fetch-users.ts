import { UsersDAO } from "@/DAO/users";
import { getUserStatement } from "@/utils/get-user-statement";
import { handleErrors } from "@/utils/handle-errors";

export const fetchUsers = async (req: any, res: any) => {
  try {
    const dao = new UsersDAO();
    const data = await dao.findMany({
      createdAt: (createdAt) => !!createdAt,
    });

    const users = await Promise.all(
      data.map(async (user) => ({
        ...user,
        points: (await getUserStatement(user.id)).balance,
      }))
    );

    return res.status(200).send({ data: users });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}