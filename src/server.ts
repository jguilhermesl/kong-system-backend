import "dotenv/config";
import express from "express"
import cors from "cors";
import { env } from "./env";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { routerUser } from "./functions/users/routes";
import { routerAuth } from "./functions/auth/routes";
import { routerInventory } from "./functions/inventory/routes";
import { routerClient } from "./functions/clients/routes";
import { routerIndications } from "./functions/indications/routes";
import { routerStatement } from "./functions/statement/routes";
import { routerStore } from "./functions/store/routes";
import { routerPendingTasks } from "./functions/pending-tasks/routes";
import { routerPointsUsage } from "./functions/points-usage/routes";
import { routerFinancial } from "./functions/financial /routes";
import { routerSellers } from "./functions/sellers/routes";

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
app.use(routerIndications);
app.use(routerStatement);
app.use(routerStore);
app.use(routerPendingTasks);
app.use(routerPointsUsage);
app.use(routerFinancial);
app.use(routerSellers);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!!!`));
