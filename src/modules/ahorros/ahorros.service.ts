import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Goal } from '../goals/entities/goal.entity';
import { GoalContribution } from '../goals/entities/goal-contribution.entity';
import { Transaction, TxType } from '../transactions/entities/transaction.entity';

import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';
import { CreateAporteDto } from './dto/create-aporte.dto';

@Injectable()
export class AhorrosService {
  constructor(
    @InjectRepository(Goal) private readonly goalRepo: Repository<Goal>,
    @InjectRepository(GoalContribution)
    private readonly contribRepo: Repository<GoalContribution>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  // ----------------- helpers -----------------

  private ensureOwner(entity: any, userId: string) {
    if (!entity || entity.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a este recurso');
    }
  }

  private extractTxIdFromNotes(notes?: string | null): string | null {
    if (!notes) return null;
    const m = notes.match(/\btx:([0-9a-fA-F-]{36})\b/);
    return m ? m[1] : null;
  }

  // ----------------- metas (ahorros) -----------------

  async findAll(userId: string) {
    return this.goalRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' as any },
    });
  }

  async findOne(userId: string, id: string) {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Meta de ahorro no encontrada');
    this.ensureOwner(goal as any, userId);
    return goal;
  }

  async create(userId: string, dto: CreateAhorroDto) {
    const goal = this.goalRepo.create({
      title: dto.title,
      targetAmount: dto.targetAmount,
      deadline: dto.deadline ? new Date(dto.deadline) : null,
      userId,
    } as any);
    return this.goalRepo.save(goal);
  }

  async update(userId: string, id: string, dto: UpdateAhorroDto) {
    const goal = await this.findOne(userId, id);
    const merged = this.goalRepo.merge(goal, {
      title: dto.title ?? goal.title,
      targetAmount: dto.targetAmount ?? goal.targetAmount,
      deadline: dto.deadline ? new Date(dto.deadline) : goal.deadline,
    } as any);
    return this.goalRepo.save(merged);
  }

  async remove(userId: string, id: string) {
    const goal = await this.findOne(userId, id);
    await this.goalRepo.remove(goal);
    return { message: 'Meta de ahorro eliminada con éxito.' };
  }

  // ----------------- aportes -----------------

  /**
   * Crea un aporte para una meta:
   * 1) Registra una Transaction (type SAVING si existe; fallback INCOME)
   * 2) Crea GoalContribution vinculado de forma suave en notes: "tx:<uuid>"
   */
  async addContribution(userId: string, goalId: string, dto: CreateAporteDto) {
    // Validar meta y ownership
    const goal = await this.goalRepo.findOne({ where: { id: goalId } });
    if (!goal) throw new NotFoundException('Meta de ahorro no encontrada');
    this.ensureOwner(goal as any, userId);

    // Determinar tipo de transacción (compatible si el enum aún no tiene SAVING)
    const txType = (TxType as any).SAVING ?? TxType.INCOME;

    // Crear Transaction para que aparezca en Recientes/Dashboard
    const tx = this.txRepo.create({
      userId,
      type: txType as TxType,
      amount: String(dto.amount),
      date: dto.date ? new Date(dto.date) : new Date(),
      description: dto.description ?? 'Aporte a ahorro',
      category: dto.category ?? 'ahorro',
    } as any);

    
const savedTxRaw = await this.txRepo.save(tx as any);
const savedTx = (Array.isArray(savedTxRaw) ? savedTxRaw[0] : savedTxRaw) as Transaction;

const contrib = this.contribRepo.create({
  goalId,
  amount: String(dto.amount),
  date: dto.date ? new Date(dto.date) : savedTx.date,  
  notes: `tx:${savedTx.id}`,                            
} as any);


    const savedContrib = await this.contribRepo.save(contrib);

    return {
      contribution: savedContrib,
      transaction: savedTx,
    };
  }

  async listContributions(userId: string, goalId: string) {
    const goal = await this.findOne(userId, goalId);
    return this.contribRepo.find({
      where: { goalId: goal.id },
      order: { date: 'DESC' as any },
    });
  }

  async progress(userId: string, goalId: string) {
    const goal = await this.findOne(userId, goalId);

    // SUM de aportes
    const row =
      (await this.contribRepo
        .createQueryBuilder('c')
        .select('COALESCE(SUM(c.amount), 0)', 'total')
        .where('c.goalId = :goalId', { goalId })
        .getRawOne<{ total?: string }>()) ?? {};
    const saved = Number(row?.total ?? 0);

    const target = Number(goal.targetAmount);
    const percent = target > 0 ? Math.min(100, +(saved * 100 / target).toFixed(2)) : 0;
    const remaining = Math.max(0, +(target - saved).toFixed(2));

    return {
      goal: {
        id: goal.id,
        title: goal.title,
        targetAmount: Number(goal.targetAmount),
        deadline: goal.deadline,
      },
      progress: {
        saved,
        percent,
        remaining,
      },
    };
  }
}

