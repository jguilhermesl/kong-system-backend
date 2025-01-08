import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["admin", "client"]).optional(),
  email: z.string().email("Invalid email format").optional(),
  cpf: z.string().min(11, "CPF must be at least 11 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
});

export const updateUser = async (req: any, res: any) => {
  try {
    const parsedData = userUpdateSchema.parse(req.body);

    const userId = req.params.id;

    const dao = new UsersDAO();

    const existingUser = await dao.findOne({ id: (id) => id === userId });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedUser = await dao.updateOne({ id: (id) => id === userId }, parsedData);

    return res.status(200).send({ data: updatedUser });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
