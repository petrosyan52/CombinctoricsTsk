import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';

@Injectable()
export class CombinationRepository {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Pool) {}
  public async addCombination(combinations: string[][]) {
    if (combinations.length === 0) return; // No combinations to insert

    // Prepare the SQL query
    const placeholders = combinations.map(() => '(?)').join(', ');
    const sql = `INSERT INTO combinations (combination) VALUES ${placeholders} 
               ON DUPLICATE KEY UPDATE combination = VALUES(combination);`;

    // Stringify each nested array
    const stringifiedCombinations = combinations.map((combination) =>
      JSON.stringify(combination),
    );

    // Execute the query
    const [result] = await this.db.query(sql, stringifiedCombinations);
    return result;
  }
}
