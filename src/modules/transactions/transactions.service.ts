import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TxType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
  ) {}

  async findAll(
    userId: string,
    query: { type?: string; category?: string; q?: string; skip?: number; limit?: number },
  ) {
    const qb = this.txRepo.createQueryBuilder('tx').where('tx.userId = :userId', { userId });

    if (query.type) qb.andWhere('tx.type = :type', { type: query.type });
    if (query.category) qb.andWhere('tx.category = :category', { category: query.category });
    if (query.q) qb.andWhere('tx.description ILIKE :q', { q: `%${query.q}%` });

    qb.orderBy('tx.date', 'DESC').skip(query.skip || 0).take(query.limit || 100);
    return qb.getMany();
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const tx = this.txRepo.create({
      ...dto,
      userId,
      amount: dto.amount,
      date: dto.date ? new Date(dto.date) : new Date(),
    });
    return this.txRepo.save(tx);
  }

  async findOne(userId: string, id: string) {
    const tx = await this.txRepo.findOne({ where: { id, userId } });
    if (!tx) throw new NotFoundException('Transacción no encontrada');
    return tx;
  }

  // 🔄 Actualizado para seguir el patrón del ejemplo Prisma
  async update(userId: string, id: string, data: UpdateTransactionDto) {
    const transaction = await this.txRepo.findOne({ where: { id, userId } });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    const updated = this.txRepo.merge(transaction, data); // mezcla valores actuales y nuevos
    return this.txRepo.save(updated);
  }

  async remove(userId: string, id: string) {
    const tx = await this.findOne(userId, id);
    await this.txRepo.remove(tx);
    return { message: 'Transacción eliminada con éxito.' };
  }
}
