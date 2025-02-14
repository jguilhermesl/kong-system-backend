
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";
import { UsersDAO } from "@/DAO/users";
import { generate4DigitsRandomNumber } from "@/utils/generate-4digits-random-number";
import { add } from "date-fns";
import { getRecoverPasswordHtmlEmailTemplate } from "@/utils/email-templates/get-recover-password-html-email-template";
import { sendEmail } from "@/utils/send-email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const dao = new UsersDAO();
    const user = await dao.findOne({ email: (em) => em === email });

    if (!user) {
      return res.status(401).send({ message: "usuário não encontrado." });
    }

    const currentDate = new Date();
    const validUntil = add(currentDate, { minutes: 10 });
    const code = generate4DigitsRandomNumber()

    await dao.updateOne({
      id: (id) => user.id === id
    }, {
      recoverPasswordValidUntil: validUntil.toISOString(),
      recoverPasswordCode: code
    })

    const message = getRecoverPasswordHtmlEmailTemplate(user.name, code)

    await sendEmail({
      message,
      destination: user.email,
      subject: "Recupere sua senha"
    })



    return res.status(200).send({ message: "E-mail enviado para o processo de recuperação de senha." });
  } catch (err) {
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
