import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Goal, GoalStatus } from './entities/goal.entity';
import { GoalContribution } from './entities/goal-contribution.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeDto } from './dto/contribute.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalsRepo: Repository<Goal>,
    @InjectRepository(GoalContribution) private contribRepo: Repository<GoalContribution>,
  ) {}

  async findAll(userId: string, status?: GoalStatus, q?: string, skip = 0, take = 100) {
    const where: FindOptionsWhere<Goal> = { userId, ...(status ? { status } : {}) };
    if (q) (where as any).title = () => `title ILIKE '%${q}%'`; // búsqueda simple
    return this.goalsRepo.find({ where, order: { createdAt: 'DESC' }, skip, take });
  }

  async findOne(userId: string, id: string) {
    const goal = await this.goalsRepo.findOne({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async create(userId: string, dto: CreateGoalDto) {
    const goal = this.goalsRepo.create({
      userId,
      title: dto.title,
      targetAmount: dto.targetAmount,
      currentAmount: '0',
      deadline: dto.deadline ?? null,
      status: (dto.status ?? 'ACTIVE') as GoalStatus,
    });
    return this.goalsRepo.save(goal);
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    const goal = await this.findOne(userId, id);
    Object.assign(goal, dto);
    return this.goalsRepo.save(goal);
  }

  async remove(userId: string, id: string) {
    const goal = await this.findOne(userId, id);
    await this.goalsRepo.remove(goal);
    return { message: 'Meta eliminada con éxito.' };
  }

  async contribute(userId: string, id: string, dto: ContributeDto) {
    const goal = await this.findOne(userId, id);

    
    const c = this.contribRepo.create({
      goalId: goal.id,
      amount: dto.amount,
      notes: dto.notes ?? null,
    });
    await this.contribRepo.save(c);

    
    const current = parseFloat(goal.currentAmount || '0');
    const next = (current + parseFloat(dto.amount)).toFixed(2);
    goal.currentAmount = String(next);
    if (parseFloat(goal.currentAmount) >= parseFloat(goal.targetAmount)) {
      goal.status = 'COMPLETED';
    }
    const updated = await this.goalsRepo.save(goal);

    return { contribution: c, goal: updated };
  }

  async contributions(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.contribRepo.find({ where: { goalId: id }, order: { date: 'DESC' } });
  }
}

