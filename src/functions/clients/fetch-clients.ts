import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";

export const fetchClients = async (req: any, res: any) => {
  try {
    const dao = new UsersDAO();
    const data = await dao.findMany({
      role: (role) => role === "client"
    });

    return res.status(200).send({ data: data });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}