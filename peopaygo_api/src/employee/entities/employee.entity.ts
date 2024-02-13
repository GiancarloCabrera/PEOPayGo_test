import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PAY_TYPES } from 'src/constants/pay_types';
import User from 'src/users/entities/user.entity';

@Entity()
export default class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PAY_TYPES })
  payType: PAY_TYPES;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  payRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hours: number;

  @ManyToOne(() => User, user => user.employees)
  company: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
