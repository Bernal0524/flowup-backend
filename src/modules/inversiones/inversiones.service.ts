import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Transaction, TxType } from '../transactions/entities/transaction.entity';
import { CreateInversionDto } from './dto/create-inversion.dto';
import { UpdateInversionDto } from './dto/update-inversion.dto';

type ListQuery = {
  q?: string;
  category?: string;
  skip?: number;
  limit?: number;
  from?: string;
  to?: string;
};

@Injectable()
export class InversionesService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  private baseQB(userId: string) {
    // Fallback por si el enum aún no tiene INVESTMENT (no rompe)
    const type = (TxType as any).INVESTMENT ?? TxType.EXPENSE;
    return this.txRepo
      .createQueryBuilder('tx')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.type = :type', { type });
  }

  async findAll(userId: string, query: ListQuery) {
    const qb = this.baseQB(userId);

    if (query.category) qb.andWhere('tx.category = :category', { category: query.category });
    if (query.q) qb.andWhere('tx.description ILIKE :q', { q: `%${query.q}%` });
    if (query.from) qb.andWhere('tx.date >= :from', { from: query.from });
    if (query.to) qb.andWhere('tx.date <= :to', { to: query.to });

    return qb
      .orderBy('tx.date', 'DESC')
      .skip(query.skip ?? 0)
      .take(query.limit ?? 100)
      .getMany();
  }

  async search(userId: string, query: string) {
    return this.baseQB(userId)
      .andWhere(
        new Brackets((qb) => {
          qb.where('tx.description ILIKE :q', { q: `%${query}%` })
            .orWhere('tx.category ILIKE :q', { q: `%${query}%` })
            .orWhere('tx.broker ILIKE :q', { q: `%${query}%` })       // si tu entidad tiene columna broker
            .orWhere('tx.instrument ILIKE :q', { q: `%${query}%` });  // si agregaste instrument
        }),
      )
      .orderBy('tx.date', 'DESC')
      .take(20)
      .getMany();
  }

  async total(userId: string, from?: string, to?: string) {
    const qb = this.baseQB(userId).select('COALESCE(SUM(tx.amount), 0)', 'total');
    if (from) qb.andWhere('tx.date >= :from', { from });
    if (to) qb.andWhere('tx.date <= :to', { to });

    const row = await qb.getRawOne<{ total?: string }>();
    const total = row?.total ?? '0';
    return { total: Number(total) };
  }

  async create(userId: string, dto: CreateInversionDto) {
    const type = (TxType as any).INVESTMENT ?? TxType.EXPENSE;

    const tx = this.txRepo.create({
      ...dto,
      userId,
      type: type as TxType,
      amount: String(dto.amount),
      date: dto.date ? new Date(dto.date) : new Date(),
    } as any);

    return this.txRepo.save(tx);
  }

  async findOne(userId: string, id: string) {
    const type = (TxType as any).INVESTMENT ?? TxType.EXPENSE;
    const tx = await this.txRepo.findOne({ where: { id, userId, type } });
    if (!tx) throw new NotFoundException('Inversión no encontrada');
    return tx;
  }

  async update(userId: string, id: string, data: UpdateInversionDto) {
    const current = await this.findOne(userId, id);
    const type = (TxType as any).INVESTMENT ?? current.type;

    const merged = this.txRepo.merge(current, {
      ...data,
      type, // protegemos tipo
      amount: data.amount !== undefined ? String(data.amount) : current.amount,
    });

    return this.txRepo.save(merged);
  }

  async remove(userId: string, id: string) {
    const tx = await this.findOne(userId, id);
    await this.txRepo.remove(tx);
    return { message: 'Inversión eliminada con éxito.' };
  }
}

