// src/combination/combination.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CombinationService } from './combination.service';

@Controller('generate')
export class CombinationController {
  constructor(private readonly combinationService: CombinationService) {}

  @Post()
  async generateCombinations(
    @Body() body: { items: number[]; length: number },
  ) {
    if (body.items.length < body.length)
      throw new BadRequestException({
        code: 400,
        message: 'Combination length will be bigger then items count',
        error: 'Bad Request',
      });
    const groups = this.combinationService.getGroups(body.items);
    const items = this.combinationService.getGroupItems(groups);
    const combinations = [];
    for (const combination of this.combinationService.generateCombinations(
      body.length,
      groups,
    )) {
      combinations.push(combination);
    }
    const id = await this.combinationService.saveCombinations(
      items,
      combinations,
    );
    return { status: 'Success', id, combinations: combinations, Code: 200 };
  }
}
