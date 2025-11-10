import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AhorrosController } from './ahorros.controller';
import { AhorrosService } from './ahorros.service';

import { Goal } from '../goals/entities/goal.entity'; 
import { GoalContribution } from '../goals/entities/goal-contribution.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, GoalContribution, Transaction, User])],
  controllers: [AhorrosController],
  providers: [AhorrosService],
})
export class AhorrosModule {}
