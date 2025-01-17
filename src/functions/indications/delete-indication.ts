import { IndicationsDAO } from "../../DAO/indications";
import { handleErrors } from "../../utils/handle-errors";

export const deleteIndication = async (req: any, res: any) => {
  try {
    const indicationId = req.params.id;
    const dao = new IndicationsDAO();

    const existingIndication = await dao.findOne({ id: (id: string) => id === indicationId });

    if (!existingIndication) {
      return res.status(404).send({ message: "Indication not found" });
    }

    await dao.deleteOne({
      id: (id: string) => indicationId === id
    });

    return res.status(200).send({ message: "Indication deleted successfully" });
  } catch (err) {
    console.log(err);
    const errorMessage = handleErrors(err);
    return res.status(500).send({ message: errorMessage });
  }
};
