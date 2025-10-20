import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GoalContribution } from './goal-contribution.entity';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  
  @Column({ name: 'target_amount', type: 'numeric', precision: 14, scale: 2 })
  targetAmount: string; 

  @Column({ name: 'current_amount', type: 'numeric', precision: 14, scale: 2, default: 0 })
  currentAmount: string;

  @Column({ type: 'date', nullable: true })
  deadline: string | null;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'COMPLETED', 'PAUSED'],
    default: 'ACTIVE',
  })
  status: GoalStatus;

  @OneToMany(() => GoalContribution, (c) => c.goal, { cascade: true })
  contributions: GoalContribution[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}

