import { IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateAporteDto {
  @IsNotEmpty() @IsNumberString()
  amount!: string; // "75.00"

  @IsOptional() @IsDateString()
  date?: string;   // ISO

  // Campos opcionales para registrar Transaction
  @IsOptional() @IsString()
  description?: string;   // ej. "Aporte mensual"

  @IsOptional() @IsString()
  category?: string;      // ej. "ahorro"
}
