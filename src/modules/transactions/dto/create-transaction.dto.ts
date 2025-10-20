import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { TxType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TxType)
  type: TxType;

  @IsNotEmpty()
  @IsNumberString()
  amount: string; // string numeric compatible with DB

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsDateString()
  date?: string;
}
