import { Store } from "./Store";
import { User } from "./User";

export interface PointsUsage {
  id: string,
  userId: string,
  user?: User,
  createdAt: string,
  points: number,
  status: "pending" | "approved",
  storeItemId: string,
  storeItem?: Store
}