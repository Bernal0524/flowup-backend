import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateIngresoDto {
  @IsNotEmpty()
  @IsNumberString()
  amount!: string; 

  @IsOptional() @IsString()
  currency?: string;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsDateString()
  date?: string;
}
