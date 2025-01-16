import { google } from 'googleapis';
import { env } from '../env';
import { InventoryItem } from '@/models/Inventory';
import { UsersDAO } from './users';
import { formatCurrencyToNumber } from '@/utils/format-currency-to-number';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DEFAULT_SPREADSHEET_ID = '1h3g41fvcJQUH4WEjjizqDC2pzCuGYgwrGG4APlmm9Ls';
const DEFAULT_SHEET_NAME = 'TABELA DE JOGOS';
const VALUE_INPUT_OPTION = 'RAW';
const DATA_STARTS_AT_LINE = 16;

type DaoType = InventoryItem;

const base64EncodedServiceAccount = env.GOOGLE_ENCODED_BASE;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });
const usersDao = new UsersDAO();

export class InventoryDAO {
  private spreadsheetId: string;
  private cachedData: DaoType[] = [];

  constructor(spreadsheetId: string = DEFAULT_SPREADSHEET_ID) {
    this.spreadsheetId = spreadsheetId;
  }

  private async getData() {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${DEFAULT_SHEET_NAME}!A${DATA_STARTS_AT_LINE}:AB`,
    });

    const clients = await usersDao.findMany({});

    const data =
      response.data.values?.map((item) => {

        const client = clients.find((c) => c.phone === item[19]) || {
          name: item[18],
          phone: item[19],
          email: item[20],
          console: item[22]
        };

        return {
          id: item[27],
          soldAt: item[0],
          game: item[1],
          email: item[2],
          recoverEmail: item[3],
          emailPassword: item[4],
          recoverPhone: item[5],
          psnUser: item[6],
          psnPassword: item[7],
          gameVersion: item[8],
          accountType: item[9],
          gameValue: item[10],
          purchaseValue: item[11],
          accountValue: item[12],
          sold: item[13],
          client,
          soldBy: item[21]
        };
      }
      ).filter((item) => !!item.game) as DaoType[];

    this.cachedData = data;

    return data || [];
  }

  async findOne(where: Partial<Record<keyof DaoType, (value: any) => boolean>>) {
    const data = await this.getData();
    if (Object.keys(where).length === 0) {
      return data[0] || null;
    }

    return data.find((row) => {
      return Object.keys(where).every((key) => {
        const condition = where[key as keyof DaoType];

        if (typeof condition === 'function') {
          return condition(row[key as keyof DaoType]);
        }

        return row[key as keyof DaoType] === condition;
      });
    }) || null;
  }

  async findMany(where: Partial<Record<keyof DaoType, (value: any) => boolean>>) {
    const data = await this.getData();

    if (Object.keys(where).length === 0) {
      return data;
    }

    return data.filter((row) => {
      return Object.keys(where).every((key) => {
        const condition = where[key as keyof DaoType];

        if (typeof condition === 'function') {
          return condition(row[key as keyof DaoType]);
        }

        return row[key as keyof DaoType] === condition;
      });
    });
  }

  async createOne(values: Omit<DaoType, "id" | "createdAt">) {
    const row = this.getRow(values);
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${DEFAULT_SHEET_NAME}`,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: {
        values: [[...row]],
      },
    });
  }

  async createMany(dataValues: DaoType[]) {
    const rows = dataValues.map((item) => this.getRow(item));
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${DEFAULT_SHEET_NAME}`,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: {
        values: rows,
      },
    });
  }

  async updateOne(where: Partial<Record<keyof DaoType, (value: any) => boolean>>, updatedValues: Partial<DaoType>) {
    const item = await this.findOne(where);

    if (!item) {
      return null;
    }

    const rowIndex = (await this.getData()).findIndex((i) => JSON.stringify(i) === JSON.stringify(item));

    if (rowIndex === -1) {
      return null;
    }

    const originalRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.getRange(rowIndex)
    });

    const originalRow = originalRowResponse.data.values?.[0] ?? [];

    const values = this.getRow({ ...item, ...updatedValues }, originalRow);

    const range = this.getRange(rowIndex);

    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: {
        values: [values],
      },
      responseValueRenderOption: "UNFORMATTED_VALUE",
    });
  }

  async deleteOne(where: Partial<Record<keyof DaoType, (value: any) => boolean>>) {
    const item = await this.findOne(where);

    if (!item) {
      return null;
    }

    const data = await this.getData();
    const rowIndex = data.findIndex((i) => JSON.stringify(i) === JSON.stringify(item));

    if (rowIndex === -1) {
      return null;
    }

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = sheetInfo.data.sheets?.find(sheet => sheet.properties?.title === DEFAULT_SHEET_NAME);
    if (!sheet) {
      return null;
    }

    const sheetId = sheet.properties?.sheetId;

    const requests = [
      {
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex + 1,
            endIndex: rowIndex + 2,
          }
        }
      }
    ];

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests,
      },
    });

    return item;
  }



  private getRow(data: Partial<DaoType>, originalRow?: string[]): (string | boolean | number | undefined)[] {
    return [
      '',
      data.game,
      data.email,
      data.recoverEmail,
      data.emailPassword,
      data.recoverPhone,
      data.psnUser,
      '',
      '',
      '',
      '',
      formatCurrencyToNumber(data.purchaseValue || ""),
      data.accountValue,
      data.sold,
      '',
      '',
      '',
      '',
      data.client?.name,
      data.client?.phone,
      data.client?.email,
      data.soldBy,
      '',
      '',
      '',
      '',
      'Pendente',
      data.id,
    ].map((item, idx) => {
      return item || originalRow[idx]
    });
  }


  private getRange(rowIndex: number): string {
    return `${DEFAULT_SHEET_NAME}!A${rowIndex + DATA_STARTS_AT_LINE}:AB${rowIndex + DATA_STARTS_AT_LINE}`;
  }
}

