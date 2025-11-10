import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversionesController } from './inversiones.controller';
import { InversionesService } from './inversiones.service';
import { Transaction } from '../transactions/entities/transaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  controllers: [InversionesController],
  providers: [InversionesService],
})
export class InversionesModule {}
