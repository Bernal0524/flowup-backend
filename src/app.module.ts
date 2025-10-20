import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { User } from './modules/users/entities/user.entity';
import { Transaction } from './modules/transactions/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'flowup',
      password: process.env.DATABASE_PASSWORD || 'flowup',
      database: process.env.DATABASE_NAME || 'flowup',
      entities: [User, Transaction],
      synchronize: true, // DEV ONLY: usar migraciones en prod
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
