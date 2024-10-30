import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';

@Injectable()
export class ItemRepository {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Pool) {}
  public async addItems(items: string[]) {
    if (items.length === 0) return; // No items to insert
    // Create placeholders for the query
    const placeholders = items.map(() => '(?)').join(', ');
    const sql = `INSERT INTO items (item) VALUES ${placeholders} 
               ON DUPLICATE KEY UPDATE item = VALUES(item);`;

    const [result] = await this.db.query(sql, items);
    return result;
  }
}
