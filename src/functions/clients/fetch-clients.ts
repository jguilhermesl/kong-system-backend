import { UsersDAO } from "@/DAO/users";
import { flexibleSearch } from "@/utils/flexible-search";
import { handleErrors } from "@/utils/handle-errors";

export const fetchClients = async (req: any, res: any) => {
  try {
    const { search } = req.query;

    const dao = new UsersDAO();
    const data = await dao.findMany({
      role: (role) => role === "client",
    });

    if (search) {
      const clients = data.filter((item) => {
        return flexibleSearch(search, item.name) || flexibleSearch(search, item.phone) || flexibleSearch(search, item.email) || flexibleSearch(search, item.cpf || "")
      })
      return res.status(200).send({ data: clients });
    }

    return res.status(200).send({ data: data });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}