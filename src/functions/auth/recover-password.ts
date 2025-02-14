
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { hash } from "bcrypt";
import { UsersDAO } from "@/DAO/users";
import { isAfter } from "date-fns";

const recoverPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  code: z.string(),
});

export const recoverPassword = async (req: any, res: any) => {
  try {
    const { email, password, code } = recoverPasswordSchema.parse(req.body);

    const dao = new UsersDAO();
    const user = await dao.findOne({ email: (em) => em === email });

    if (!user) {
      return res.status(401).send({ message: "Usuário não encontrado." });
    }

    const recoverPasswordData = { validUntil: user.recoverPasswordValidUntil || "", code: user.recoverPasswordCode }
    const passwordHash = await hash(password, 8)
    const dateIsValid = isAfter(new Date(recoverPasswordData.validUntil), new Date())

    if (!dateIsValid) {
      throw new Error("O código expirou.")
    }

    if (code !== recoverPasswordData.code) {
      throw new Error("O código está errado.")
    }

    await dao.updateOne({
      id: (id) => user.id === id
    }, {
      passwordHash,
      recoverPasswordValidUntil: '',
      recoverPasswordCode: ''
    })

    return res.status(200).send({ message: "Senha recuperada com sucesso." });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
