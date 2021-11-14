/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { getConnection, QueryRunner, Table } from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

const csv = require('csv-parser');
const slug = require('slug');

@Injectable()
export class AppService {
  protected dateNow = Date.now();
  protected tableName = `CSV_data_${this.dateNow}`;
  protected queryRunner: QueryRunner;

  constructor() {
    this.queryRunner = getConnection('default').createQueryRunner();
  }

  public async readFile(file: Express.Multer.File) {
    const readableStream = new Readable({
      read() {
        this.push(file.buffer);
        this.push(null);
      },
    });

    const { data, headers } = await this.readStream(readableStream);

    const columns = this.returnColumns(headers);
    await this.createTable(columns);
    data.forEach(async (d: any) => await this.insertData(headers, d));

    return 'CSV File read and added to db. :)';
  }

  protected returnHeaderSlug(res: string[]): string[] {
    return res.map((r) => slug(r.toLowerCase(), '_'));
  }

  protected returnColumns(res: string[]): TableColumnOptions[] {
    return res.map((h) => {
      return { name: h, type: 'varchar' };
    });
  }

  protected async createTable(columns: TableColumnOptions[]) {
    await this.queryRunner
      .createTable(
        new Table({
          name: this.tableName,
          database: 'revenue',
          columns: columns,
        }),
      )
      .catch((err) => console.log(err));
  }

  protected async insertData(headers: string[], params: any) {
    const values = headers.map(() => '?').join(',');
    await this.queryRunner
      .query(
        `INSERT INTO ${this.tableName} (${headers.join(
          ',',
        )}) VALUES(${values})`,
        Object.values(params),
      )
      .catch((err) => console.log(err));
  }

  protected async readStream(readableStream: Readable): Promise<{
    headers: string[];
    data: any[];
  }> {
    let headers: string[] = [];
    const data: any[] = [];
    return new Promise((resolve, reject) => {
      readableStream
        .pipe(csv({ separator: ';' }))
        .on(
          'headers',
          (result: string[]) => (headers = this.returnHeaderSlug(result)),
        )
        .on('data', (result: any) => data.push(result))
        .on('end', async () => resolve({ data, headers }))
        .on('error', (err: Error) => reject(err));
    });
  }
}
