import { TIMESHEET_STATUS } from 'src/constants/timesheet-status';
import Employee from 'src/employee/entities/employee.entity';
import User from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Timesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  checkDate: Date;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalGrossPay: number;

  @Column()
  status: TIMESHEET_STATUS;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.timesheets)
  user: User;

  @ManyToMany(() => Employee)
  @JoinTable()
  employees: Employee[];

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
