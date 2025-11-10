import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoDto } from './create-gasto.dto';

// No redefinimos amount: hereda como amount?: string
export class UpdateGastoDto extends PartialType(CreateGastoDto) {}
