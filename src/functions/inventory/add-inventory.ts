import { z } from "zod";
import { handleErrors } from '@/utils/handle-errors';
import { env } from "@/env";
import { google } from "googleapis";
import { FinancialDAO } from "@/DAO/financial";

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
  gameValue: z.number(),
  purchaseValue: z.number(),
  primaryValue: z.number(),
  secondaryValue: z.number(),
});

export const addInventory = async (req: any, res: any) => {
  try {
    // Valida os dados recebidos no request
    const validatedData = addInventorySchema.parse(req.body);
    const sub = req.userState.sub;

    const range = `${DEFAULT_SHEET_NAME}!B7:O7`;
    const values = [
      [
        validatedData.game,
        validatedData.email,
        '',
        validatedData.emailPassword,
        '',
        validatedData.psnUser || '',
        validatedData.psnPassword,
        validatedData.gameVersion,
        'Primaria',
        validatedData.gameValue,
        validatedData.purchaseValue,
        validatedData.primaryValue,
        validatedData.secondaryValue,
        sub,
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
    await fetch('https://script.google.com/macros/s/AKfycbxcgtgpnn5s8uegW34hGCN2YpodciXvt2gLoDBzlh8Lzn0eG2dm2GGggBiV9Ck6q4Be/exec')
      .then(response => response.json())
      .then(data => console.log('Google Script executed successfully:', data))
      .catch(error => console.error('Error executing Google Script:', error));

    const financialDAO = new FinancialDAO();
    await financialDAO.createOne({
      createdById: sub,
      commissioning: 0,
      productName: validatedData.game,
      productType: "COMPRA DE JOGO",
      productValue: validatedData.purchaseValue,
    })

    res.status(201).json({
      message: 'Inventory added successfully and data set in the spreadsheet.',
    });
  } catch (validationError) {
    const errorMessage = handleErrors(validationError);
    console.error('Erro na validação:', validationError);
    return res.status(400).json({ message: errorMessage });
  }
};
