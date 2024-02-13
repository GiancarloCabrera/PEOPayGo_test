import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLES } from 'src/constants/roles';
import { Exclude } from 'class-transformer';
import Employee from 'src/employee/entities/employee.entity';
import Timesheet from 'src/timesheet/entities/timesheet.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @Column({ nullable: true })
  company: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @OneToMany(() => Employee, employee => employee.company)
  employees: Employee[];

  @OneToMany(() => Timesheet, timesheet => timesheet.user)
  timesheets: Timesheet[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
