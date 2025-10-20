import { IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';

export class CreateGoalDto {
  @IsString() @IsNotEmpty() @MaxLength(100)
  title: string;

  // string numérica para ser compatible con NUMERIC de Postgres
  @IsNotEmpty() @IsNumberString()
  targetAmount: string;

  @IsOptional() @IsDateString()
  deadline?: string;

  @IsOptional() @IsIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}
