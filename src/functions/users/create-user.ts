import { UsersDAO } from "@/DAO/users";
import { generateRandomCode } from "@/utils/generate-6-random-code";
import { handleErrors } from "@/utils/handle-errors";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "client"]).default("client"),
  email: z.string().email("Invalid email format"),
  cpf: z.string().min(11, "CPF must be at least 11 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  password: z.string().min(4, "Password must be at least 4 characters").optional(),
  console: z.enum(["PS4", "PS5"]).optional()
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = userSchema.parse(req.body);
    let passwordHash = ''

    if (parsedData.password) {
      passwordHash = await hash(parsedData.password, 8);
    }

    const dao = new UsersDAO();
    const userAlreadyExists = await dao.findOne({
      email: (email) => email === parsedData.email
    })

    if (userAlreadyExists) {
      return res.status(401).send({ message: "Usuário já existe." })
    }

    const code = generateRandomCode();
    const data = await dao.createOne({ ...parsedData, passwordHash, code });

    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err)
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
}
