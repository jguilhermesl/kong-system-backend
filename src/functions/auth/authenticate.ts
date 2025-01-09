
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { compare } from "bcrypt";
import { generateJwt } from "@/utils/generate-jwt";
import { UsersDAO } from "@/DAO/users";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const authenticate = async (req: any, res: any) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const dao = new UsersDAO();
    const user = await dao.findOne({ email: (em) => em === email });

    if (!user) {
      return res.status(401).send({ message: "Login/senha incorretos." });
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Login/senha incorretos." });
    }

    const payloadJwt = { id: user.id, role: user.role, name: user.name, email: user.email };

    const token = generateJwt(payloadJwt, "default");
    const refreshToken = generateJwt(payloadJwt, "refreshToken");

    return res.status(200).send({ data: { token, refreshToken, role: user.role } });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
