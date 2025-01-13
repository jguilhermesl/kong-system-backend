import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";

export const deleteUser = async (req: any, res: any) => {
  try {
    const userId = req.params.id;
    const dao = new UsersDAO();

    const existingUser = await dao.findOne({ id: (id) => id === userId });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    await dao.deleteOne({
      id: (id) => userId === id
    });

    return res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err)
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
