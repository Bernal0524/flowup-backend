import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @IsOptional() @IsIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}
