import { StoreDAO } from "@/DAO/store";
import { handleErrors } from "@/utils/handle-errors";

type GroupedData = {
  [key: string]: {
    category: string;
    items: any[];
  };
};

export const fetchStore = async (req: any, res: any) => {
  try {
    const dao = new StoreDAO();
    const data = await dao.findMany({
      isActive: (isActive) => isActive
    });

    const groupedData: GroupedData = data.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = { category, items: [] };
      }
      acc[category].items.push(item);
      return acc;
    }, {} as GroupedData);

    return res.status(200).send({ data: Object.values(groupedData) });
  } catch (err) {
    const errorMessage = handleErrors(err)

    return res.status(500).send({ message: errorMessage });
  }
}
