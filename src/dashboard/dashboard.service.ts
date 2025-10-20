import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TxType } from '../modules/transactions/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
  ) {}

  async getSummary(userId: string) {
    const { totalIncome } = await this.txRepo
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'totalIncome')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.type = :type', { type: TxType.INCOME })
      .getRawOne();

    const { totalExpenses } = await this.txRepo
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'totalExpenses')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.type = :type', { type: TxType.EXPENSE })
      .getRawOne();

    const income = parseFloat(totalIncome) || 0;
    const expenses = parseFloat(totalExpenses) || 0;
    const balance = income - expenses;

    return {
      income,
      expenses,
      balance,
    };
  }

  async getChartData(userId: string) {
    // Obtener transacciones de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await this.txRepo
      .createQueryBuilder('tx')
      .select("DATE_TRUNC('day', tx.date)", 'day')
      .addSelect('tx.type', 'type')
      .addSelect('SUM(tx.amount)', 'total')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.date >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy("DATE_TRUNC('day', tx.date), tx.type")
      .orderBy('day', 'ASC')
      .getRawMany();

    // Formatear datos para el gráfico
    const chartData = results.reduce((acc, item) => {
      const day = new Date(item.day).toISOString().split('T')[0]; // Formato YYYY-MM-DD
      if (!acc[day]) {
        acc[day] = { day, income: 0, expense: 0 };
      }
      if (item.type === TxType.INCOME) {
        acc[day].income += parseFloat(item.total);
      } else if (item.type === TxType.EXPENSE) {
        acc[day].expense += parseFloat(item.total);
      }
      return acc;
    }, {});

    return Object.values(chartData);
  }
}