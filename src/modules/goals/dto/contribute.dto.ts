import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class ContributeDto {
  @IsNotEmpty() @IsNumberString()
  amount: string;

  @IsOptional() @IsString() @MaxLength(200)
  notes?: string;
}
