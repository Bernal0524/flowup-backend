import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { Goal } from './entities/goal.entity';
import { GoalContribution } from './entities/goal-contribution.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, GoalContribution]),
    UsersModule, 
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}

