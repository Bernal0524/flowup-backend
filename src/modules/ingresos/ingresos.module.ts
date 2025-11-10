import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  providers: [IngresosService],
  controllers: [IngresosController],
})
export class IngresosModule {}
