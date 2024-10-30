// src/combination/combination.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ItemRepository } from '../database/repositories/item.repository';
import { CombinationRepository } from '../database/repositories/combination.repository';
import { ResponseRepository } from '../database/repositories/response.repository';
import { Pool } from 'mysql2/promise';

@Injectable()
export class CombinationService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly responseRepository: ResponseRepository,
    private readonly combinationRepository: CombinationRepository,
    @Inject('DATABASE_CONNECTION') private db: Pool,
  ) {}

  // Generate combinations of a given length from a list of items
  public *generateCombinations(
    length: number,
    groups: string[][],
  ): Generator<string[]> {
    // Step 1: Create labeled groups based on the position

    // Lazy combinatorics generator
    function* combinatorics(
      arr: string[][],
      len: number,
      start = 0,
      path: string[] = [],
    ): Generator<string[]> {
      if (path.length === len) {
        yield [...path];
        return;
      }
      for (let i = start; i < arr.length; i++) {
        for (const item of arr[i]) {
          yield* combinatorics(arr, len, i + 1, [...path, item]);
        }
      }
    }

    yield* combinatorics(groups, length);
  }
  //Example of second type
  public *combinatoricsIterative(
    arr: string[][],
    len: number,
  ): Generator<string[]> {
    const stack: { index: number; path: string[] }[] = [{ index: 0, path: [] }];

    while (stack.length > 0) {
      const { index, path } = stack.pop()!;
      if (path.length === len) {
        yield path;
        continue;
      }
      for (let i = index; i < arr.length; i++) {
        for (const item of arr[i]) {
          stack.push({ index: i + 1, path: [...path, item] });
        }
      }
    }
  }
  public getGroups(items: number[]): string[][] {
    return items.map((count, index) =>
      Array.from(
        { length: count },
        (_, i) => `${String.fromCharCode(65 + index)}${i + 1}`,
      ),
    );
  }
  public getGroupItems(items: string[][]): string[] {
    return items.flat();
  }
  async saveCombinations(
    items: string[],
    combinations: string[][],
  ): Promise<number> {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();
      // Insert into Items table
      await this.itemRepository.addItems(items);
      // Insert into Combinations table
      await this.combinationRepository.addCombination(combinations);
      // Insert into responses table
      const insertedId = await this.responseRepository.addResponse(
        JSON.stringify(combinations),
      );
      await connection.commit();
      return insertedId;
    } catch (error) {
      await connection.rollback();
      throw new Error('Transaction failed');
    } finally {
      connection.release();
    }
  }
}
