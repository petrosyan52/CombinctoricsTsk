import { Module } from '@nestjs/common';
import { CombinationService } from './combination.service';
import { CombinationController } from './combination.controller';
import { ItemRepository } from '../database/repositories/item.repository';
import { CombinationRepository } from '../database/repositories/combination.repository';
import { ResponseRepository } from '../database/repositories/response.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [
    CombinationService,
    ItemRepository,
    CombinationRepository,
    ResponseRepository,
  ],
  imports: [DatabaseModule],
  controllers: [CombinationController],
})
export class CombinationModule {}
