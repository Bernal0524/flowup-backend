import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryScope } from '../entities/categoria.entity/categoria.entity';

export class CreateCategoriaDto {
  @IsNotEmpty() @IsString() @MaxLength(80)
  name!: string;

  @IsEnum(CategoryScope)
  scope!: CategoryScope; // INCOME | EXPENSE | SAVING | INVESTMENT | GENERAL

  @IsOptional() @IsString() @MaxLength(16)
  color?: string;

  @IsOptional() @IsString() @MaxLength(40)
  icon?: string;
}
