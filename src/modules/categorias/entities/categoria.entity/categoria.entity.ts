import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryScope {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
  INVESTMENT = 'INVESTMENT',
  GENERAL = 'GENERAL',
}

@Entity('categories')
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'enum', enum: CategoryScope, default: CategoryScope.GENERAL })
  scope: CategoryScope;

  @Column({ type: 'varchar', length: 16, nullable: true })
  color?: string | null;      // ej. "#4F46E5"

  @Column({ type: 'varchar', length: 40, nullable: true })
  icon?: string | null;       // ej. "wallet", "coffee"

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}
