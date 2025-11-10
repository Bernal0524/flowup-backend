import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Transaction, TxType } from '../transactions/entities/transaction.entity';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

type ListQuery = {
  q?: string;
  category?: string;
  skip?: number;
  limit?: number;
  from?: string;
  to?: string;
};

@Injectable()
export class IngresosService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  
  private baseQB(userId: string) {
    return this.txRepo
      .createQueryBuilder('tx')
      .where('tx.userId = :userId', { userId })
      .andWhere('tx.type = :type', { type: TxType.INCOME });
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
            .orWhere('tx.category ILIKE :q', { q: `%${query}%` });
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

    
    const row = await qb.getRawOne<{ total: string }>();
    const total = row?.total ?? '0';
    return { total: Number(total) };
  }

 
  async create(userId: string, dto: CreateIngresoDto) {
    const tx = this.txRepo.create({
      ...dto,
      userId,
      type: TxType.INCOME,                           // forzamos tipo ingreso
      amount: String(dto.amount),                    // normalizamos por si llega number
      date: dto.date ? new Date(dto.date) : new Date(),
    });
    return this.txRepo.save(tx);
  }

  /** GET /api/ingresos/:id */
  async findOne(userId: string, id: string) {
    const tx = await this.txRepo.findOne({ where: { id, userId, type: TxType.INCOME } });
    if (!tx) throw new NotFoundException('Ingreso no encontrado');
    return tx;
  }

 
  async update(userId: string, id: string, data: UpdateIngresoDto) {
  // 1) Asegura que existe y pertenece al usuario
  await this.findOne(userId, id);

  // 2) Construye PATCH solo con campos definidos
  const patch: any = { type: TxType.INCOME }; // protegemos el tipo

  if (data.description !== undefined) patch.description = data.description;
  if (data.category !== undefined)    patch.category = data.category;
  if (data.currency !== undefined)    patch.currency = data.currency;
  if (data.amount !== undefined)      patch.amount   = String(data.amount);
  if (data.date !== undefined)        patch.date     = new Date(data.date);

  // 3) Actualiza por filtro (id + userId + type)
  await this.txRepo.update(
    { id, userId, type: TxType.INCOME },
    patch,
  );

  // 4) Devuelve la fila ya persistida desde DB
  return this.findOne(userId, id);
}

 
  async remove(userId: string, id: string) {
    const tx = await this.findOne(userId, id);
    await this.txRepo.remove(tx);
    return { message: 'Ingreso eliminado con éxito.' };
  }
}
