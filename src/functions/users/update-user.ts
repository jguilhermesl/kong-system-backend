import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["admin", "client"]).optional(),
  email: z.string().email("Invalid email format").optional(),
  cpf: z.string().min(11, "CPF must be at least 11 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
  console: z.enum(["PS4", "PS5"]).optional()
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

    if (parsedData.phone && parsedData.phone !== existingUser.phone) {
      const phoneExists = await dao.findOne({ phone: (phone) => phone === parsedData.phone });
      if (phoneExists) {
        return res.status(400).send({ message: "Phone number already exists" });
      }
    }

    if (parsedData.cpf && parsedData.cpf !== existingUser.cpf) {
      const cpfExists = await dao.findOne({ cpf: (cpf) => cpf === parsedData.cpf });
      if (cpfExists) {
        return res.status(400).send({ message: "CPF already exists" });
      }
    }

    if (parsedData.email && parsedData.email !== existingUser.email) {
      const emailExists = await dao.findOne({ email: (email) => email === parsedData.email });
      if (emailExists) {
        return res.status(400).send({ message: "Email already exists" });
      }
    }

    const updatedUser = await dao.updateOne({ id: (id) => id === userId }, parsedData);

    return res.status(200).send({ data: updatedUser });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
