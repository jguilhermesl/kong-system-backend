import { User } from "./User"

export interface Financial {
  createdAt: string,
  productType: string,
  productName: string,
  saleValue: number,
  productValue: number,
  commissioning: number,
  paidOrRefunded: boolean,
  sellerId: string,
  seller: User,
  obs: string,
  clientNumber: string,
  client: User,
  createdById: string,
  createdBy: User,
  id: string,
  range?: number
}