export interface User {
  id: string,
  name: string,
  role: "admin" | "client",
  email: string,
  cpf?: string,
  phone: string,
  passwordHash: string,
  createdAt: Date | string,
  console?: "PS4" | "PS5",
  code: string
}