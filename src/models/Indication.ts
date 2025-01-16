import { InventoryItem } from "./Inventory";
import { User } from "./User";

export interface Indication {
  id: string,
  userId: string,
  user?: User,
  inventoryId: string,
  inventory?: InventoryItem,
  createdAt: string,
}