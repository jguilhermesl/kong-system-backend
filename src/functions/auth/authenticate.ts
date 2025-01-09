
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { compare } from "bcrypt";
import { generateJwt } from "@/utils/generate-jwt";
import { UsersDAO } from "@/DAO/users";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["admin", "client"])
});

export const authenticate = async (req: any, res: any) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);

    const dao = new UsersDAO();
    const user = await dao.findOne({ email: (em) => em === email });

    if (!user) {
      return res.status(401).send({ message: "Login/senha incorretos." });
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Login/senha incorretos." });
    }

    const payloadJwt = { id: user.id, role, name: user.name };

    const token = generateJwt(payloadJwt, "default");
    const refreshToken = generateJwt(payloadJwt, "refreshToken");

    return res.status(200).send({ token, refreshToken });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
