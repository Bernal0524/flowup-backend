import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateGastoDto {
  @IsNotEmpty()
  @IsNumberString()
  amount!: string; // "12.50" (compatible con NUMERIC)

  @IsOptional() @IsString()
  currency?: string;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsDateString()
  date?: string;
}
