import { google } from 'googleapis';
import { env } from '../env';
import { randomUUID } from 'crypto';
import { Store } from '@/models/Store';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DEFAULT_SPREADSHEET_ID = '1h3g41fvcJQUH4WEjjizqDC2pzCuGYgwrGG4APlmm9Ls';
const DEFAULT_SHEET_NAME = 'store_kg_system';
const VALUE_INPUT_OPTION = 'RAW';
const DATA_STARTS_AT_LINE = 2;

type DaoType = Store;

const base64EncodedServiceAccount = env.GOOGLE_ENCODED_BASE;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

export class StoreDAO {
  private spreadsheetId: string;
  private cachedData: DaoType[] = [];

  constructor(spreadsheetId: string = DEFAULT_SPREADSHEET_ID) {
    this.spreadsheetId = spreadsheetId;
  }

  private async getData() {
    if (this.cachedData.length > 0) {
      return this.cachedData;
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${DEFAULT_SHEET_NAME}!A${DATA_STARTS_AT_LINE}:Z`,
      });

      const data =
        response.data.values?.map((item) => {
          return {
            id: item[0],
            price: item[1],
            category: item[2],
            game: item[3],
            photoUrl: item[4],
            type: item[5],
            createdAt: item[6],
            gameVersion: item[7],
            isActive: item[8] === 'TRUE'
          };
        }
        ).filter((item) => !!item && !!item) as DaoType[];

      this.cachedData = data;

      return data || [];
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      return [];
    }
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
    const row = this.getRow({ ...values, createdAt: new Date().toISOString() });
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

    const values = this.getRow({
      ...item,
      ...updatedValues
    });

    const range = this.getRange(rowIndex);

    await sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: {
        values: [values],
      },
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
      data.id || randomUUID(),
      data.price,
      data.category,
      data.game,
      data.photoUrl,
      data.type,
      data.createdAt,
      data.gameVersion,
      data.isActive
    ].map((item, idx) => {
      return item || originalRow?.[idx];
    });
  }

  private getRange(rowIndex: number): string {
    return `${DEFAULT_SHEET_NAME}!A${rowIndex + DATA_STARTS_AT_LINE}:Z${rowIndex + DATA_STARTS_AT_LINE}`;
  }
}
