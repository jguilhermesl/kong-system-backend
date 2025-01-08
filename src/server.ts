import "dotenv/config";
import express from "express"
import cors from "cors";
import { env } from "./env";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { routerUser } from "./functions/users/routes";

const PORT = env.PORT;
const app = express();

app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routerUser);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!!!`));