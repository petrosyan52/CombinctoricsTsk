import { Inject, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class ResponseRepository {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Pool) {}
  async addResponse(response: string): Promise<number> {
    const [result] = await this.db.query<ResultSetHeader>(
      'INSERT INTO responses (response) VALUES (?)',
      [response],
    );
    return result.insertId;
  }
}
