import { FinancialDAO } from "@/DAO/financial";
import { UsersDAO } from "@/DAO/users";
import { handleErrors } from "@/utils/handle-errors";
import { z } from "zod";

const financialSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  productName: z.string().min(1, "Product name is required"),
  saleValue: z.number().positive("Sale value must be positive"),
  productValue: z.number().positive("Product value must be positive"),
  clientId: z.string().min(1, "Client id is required").optional(),
});

export const addFinancial = async (req: any, res: any) => {
  try {
    const usersDAO = new UsersDAO();
    const dao = new FinancialDAO();
    const parsedData = financialSchema.parse(req.body);
    const sub = req.userState.sub;

    const client = await usersDAO.findOne({
      id: (id) => id === parsedData.clientId
    })

    const data = await dao.createOne({
      commissioning: 0,
      clientNumber: client?.phone || "",
      createdById: sub,
      obs: "",
      paidOrRefunded: false,
      productName: parsedData.productName,
      productType: parsedData.productType,
      productValue: parsedData.productValue,
      saleValue: parsedData.saleValue,
      sellerId: ""
    });

    return res.status(200).send({ data: data });
  } catch (err) {
    console.log(err);
    const errorMessage = handleErrors(err);

    return res.status(500).send({ message: errorMessage });
  }
};
