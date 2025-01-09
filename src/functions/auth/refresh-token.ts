
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { generateJwt } from "@/utils/generate-jwt";
import { verify } from 'jsonwebtoken';
import { env } from "@/env";

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

export const refreshToken = async (req: any, res: any) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    let decodedRefreshToken: any = null;

    verify(refreshToken, env.JWT_SECRET, (error, decoded) => {
      if (error) throw new Error("Error")

      decodedRefreshToken = decoded;
    })

    const payloadJwt = { id: decodedRefreshToken.sub, email: decodedRefreshToken.email, name: decodedRefreshToken.name, role: decodedRefreshToken.role }


    return res.status(200).send({ accessToken: generateJwt(payloadJwt, "default"), role: decodedRefreshToken.role });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
