import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";
import { Request, Response } from "express";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "client"]),
  email: z.string().email("Invalid email format"),
  cpf: z.string().min(11, "CPF must be at least 11 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  passwordHash: z.string().min(4, "Password hash must be at least 4 characters"),
  createdAt: z.union([z.date(), z.string().transform((val) => new Date(val))]),
});

export const createUser = async (req: any, res: any) => {
  try {
    const parsedData = userSchema.parse(req.body);

    const dao = new UsersDAO();
    const data = await dao.createOne(parsedData);

    return res.status(200).send({ data: data });
  } catch (err) {
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
}
