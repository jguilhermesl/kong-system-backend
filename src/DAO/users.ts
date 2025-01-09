import { google } from 'googleapis';
import { env } from '../env';
import { User } from '@/models/User';
import { randomUUID } from 'crypto';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const DEFAULT_SPREADSHEET_ID = '1h3g41fvcJQUH4WEjjizqDC2pzCuGYgwrGG4APlmm9Ls';
const DEFAULT_SHEET_NAME = 'users_kg_system';
const VALUE_INPUT_OPTION = 'RAW';
const DATA_STARTS_AT_LINE = 2;

type DaoType = User;

const credentials = {
  client_email: env.GOOGLE_CLIENT_EMAIL,
  private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

export class UsersDAO {
  private spreadsheetId: string;

  constructor(spreadsheetId: string = DEFAULT_SPREADSHEET_ID) {
    this.spreadsheetId = spreadsheetId;
  }

  private async getData() {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${DEFAULT_SHEET_NAME}!A${DATA_STARTS_AT_LINE}:Z`,
    });

    const data = response.data.values?.map((item) => {
      return {
        id: item[0],
        name: item[1],
        phone: item[2],
        cpf: item[3],
        email: item[4],
        passwordHash: item[5],
        role: item[6],
        createdAt: item[7],
      };
    }) as DaoType[];

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

  async createOne(values: Omit<DaoType, "id">) {
    const row = this.getRow(values);
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${DEFAULT_SHEET_NAME}`,
      valueInputOption: VALUE_INPUT_OPTION,
      requestBody: {
        values: [[randomUUID(), ...row]],
      },
    });
  }

  async createMany(dataValues: DaoType[]) {
    const rows = dataValues.map(this.getRow);
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

    const rowIndex = (await this.getData()).findIndex((i) => JSON.stringify(i) === JSON.stringify(item));

    if (rowIndex === -1) {
      return null;
    }

    const range = this.getRange(rowIndex);

    await sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range,
    });
  }

  private getRow(data: DaoType | Partial<DaoType>) {
    return [
      data.id,
      data.name,
      data.phone,
      data.cpf,
      data.email,
      data.passwordHash,
      data.role,
      data.createdAt,
    ];
  }

  private getRange(rowIndex: number): string {
    return `${DEFAULT_SHEET_NAME}!A${rowIndex + DATA_STARTS_AT_LINE}:Z${rowIndex + DATA_STARTS_AT_LINE}`;
  }
}
