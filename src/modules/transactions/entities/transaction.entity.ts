import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TxType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: TxType })
  type: TxType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string; // TypeORM numeric returns string

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
