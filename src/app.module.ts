import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GoalsModule } from './modules/goals/goals.module';
import { User } from './modules/users/entities/user.entity';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { Goal } from './modules/goals/entities/goal.entity';
import { GoalContribution } from './modules/goals/entities/goal-contribution.entity';
import { IngresosModule } from './modules/ingresos/ingresos.module';
import { GastosModule } from './modules/gastos/gastos.module';
import { AhorrosModule } from './modules/ahorros/ahorros.module';
import { CategoriasModule } from './modules/categorias/categorias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
      username: process.env.DATABASE_USER || 'flowup',
      password: process.env.DATABASE_PASSWORD || 'flowup',
      database: process.env.DATABASE_NAME || 'flowup',
      entities: [User, Transaction, Goal, GoalContribution],
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    TransactionsModule,
    DashboardModule,
    GoalsModule,
    IngresosModule,
    GastosModule,
    AhorrosModule,
    CategoriasModule,
  ],
})
export class AppModule {}

