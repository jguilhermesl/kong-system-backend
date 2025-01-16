import "dotenv/config";
import express from "express"
import cors from "cors";
import { env } from "./env";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { routerUser } from "./functions/users/routes";
import { routerAuth } from "./functions/auth/routes";
import { routerInventory } from "./functions/inventory/routes";
import { routerClient } from "./functions/clients/routes";

const PORT = env.PORT;
const app = express();

app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routerUser);
app.use(routerInventory);
app.use(routerAuth);
app.use(routerClient);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!!!`));