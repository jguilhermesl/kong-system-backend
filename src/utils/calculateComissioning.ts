import { UsersDAO } from "@/DAO/users";

export async function calculateComissioning(sellerId: string, saleValue: number): Promise<number | null> {
  const usersDAO = new UsersDAO();

  const validSellerIds = (await usersDAO.findMany({
    role: (role) => role === "seller"
  })).map((s) => s.id);

  if (!validSellerIds.includes(sellerId)) {
    return null;
  }

  let comissioning: number;

  if (saleValue <= 50) {
    comissioning = saleValue * 0.16;
  } else if (saleValue > 50 && saleValue <= 100) {
    comissioning = 10;
  } else if (saleValue > 100 && saleValue <= 200) {
    comissioning = 15;
  } else if (saleValue > 200) {
    comissioning = 20;
  } else {
    comissioning = 0;
  }

  return comissioning;
}
