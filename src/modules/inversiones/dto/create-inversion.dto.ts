import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateInversionDto {
  @IsNotEmpty()
  @IsNumberString()
  amount!: string;                 // "250.00"

  @IsOptional() @IsString()
  currency?: string;               // "USD"

  @IsOptional() @IsString()
  @MaxLength(60)
  category?: string;               // "inversión"

  @IsOptional() @IsString()
  @MaxLength(200)
  description?: string;            // "Compra ETF S&P500"

  @IsOptional() @IsString()
  @MaxLength(60)
  broker?: string;                 // "DeGiro", "Interactive Brokers"

  @IsOptional() @IsString()
  @MaxLength(60)
  instrument?: string;             // "ETF", "Acción", "Bono"

  @IsOptional() @IsDateString()
  date?: string;                   // ISO
}
