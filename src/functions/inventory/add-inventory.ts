import { z } from "zod";
import { handleErrors } from '@/utils/handle-errors';
import { env } from "@/env";
import { google } from "googleapis";

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DEFAULT_SPREADSHEET_ID = '1h3g41fvcJQUH4WEjjizqDC2pzCuGYgwrGG4APlmm9Ls';
const DEFAULT_SHEET_NAME = 'TABELA DE JOGOS';
const VALUE_INPUT_OPTION = 'RAW';

const base64EncodedServiceAccount = env.GOOGLE_ENCODED_BASE;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

const addInventorySchema = z.object({
  game: z.string(),
  email: z.string().email(),
  emailPassword: z.string(),
  psnPassword: z.string(),
  psnUser: z.string().optional(),
  gameVersion: z.enum(["PS4", "PS5", "PS4 E PS5"]),
  gameValue: z.string(),
  purchaseValue: z.string(),
  primaryValue: z.string(),
  secondaryValue: z.string(),
  createdById: z.string(),
});

export const addInventory = async (req: any, res: any) => {
  try {
    // Valida os dados recebidos no request
    const validatedData = addInventorySchema.parse(req.body);

    const range = `${DEFAULT_SHEET_NAME}!B7:O7`;
    const values = [
      [
        validatedData.game,
        validatedData.email,
        validatedData.emailPassword,
        validatedData.psnUser || '',
        validatedData.psnPassword,
        validatedData.gameVersion,
        validatedData.gameValue,
        validatedData.purchaseValue,
        validatedData.primaryValue,
        validatedData.secondaryValue,
        validatedData.createdById,
      ],
    ];

    // Atualiza a planilha
    await sheets.spreadsheets.values.update({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      range,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: { values },
    });

    // Executa o Google Script
    const scriptId = 'AKfycbw_F1gz5EdqEp_kjrKIG1v-1gFCmV-AwjoLHHIooM6D89nEA55HFWdTnJe-SK3KM6GxnQ';
    const script = google.script({ version: 'v1', auth });

    try {
      const scriptResponse = await script.scripts.run({
        scriptId,
        requestBody: {
          function: 'KONG2',
          parameters: [],
        },
      });

      const scriptResult = scriptResponse?.data?.response?.result;
      console.log('Resultado do script:', scriptResult);

      res.status(201).json({
        message: 'Inventory added successfully and data set in the spreadsheet.',
        scriptResult,
      });
    } catch (scriptError) {
      const errorMessage = handleErrors(scriptError);
      console.error('Erro ao executar o script:', scriptError);
      return res.status(500).json({ message: errorMessage });
    }
  } catch (validationError) {
    const errorMessage = handleErrors(validationError);
    console.error('Erro na validação:', validationError);
    return res.status(400).json({ message: errorMessage });
  }
};
