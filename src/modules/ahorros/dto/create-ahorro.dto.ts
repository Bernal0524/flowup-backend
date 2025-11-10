import { IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateAhorroDto {
  @IsNotEmpty() @IsString()
  title!: string;

  @IsNotEmpty() @IsNumberString()
  targetAmount!: string; // "1000.00"

  @IsOptional() @IsDateString()
  deadline?: string;      // "2025-12-31"
}
