declare namespace Express {
  export type Request = {
    userState: {
      sub: string,
      email: string,
      name: string,
      role: "admin" | "client"
    }
  };
}