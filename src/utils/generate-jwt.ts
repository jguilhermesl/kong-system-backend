import { sign } from 'jsonwebtoken';

export const generateJwt = (user: { name: string, role: "admin" | "client", id: string, email: string }, type: "default" | "refreshToken") => {
  const token = sign(
    {
      name: user?.name,
      role: user?.role,
      email: user?.email,
    },
    '' + process.env.JWT_SECRET,
    {
      subject: user?.id,
      expiresIn: type === "default" ? '7d' : '7d',
    }
  );

  return token;
}