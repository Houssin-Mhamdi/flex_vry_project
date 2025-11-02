import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsArray } from 'class-validator';

export enum ReservationStatus {
  PENDING = 'pending',
  COLLECT = 'collect',
  ISSUE = 'issue',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ name: 'driver_license' })
  driverLicense: string;

  @Column()
  phone: string;

  @Column({ name: 'trailer_number' })
  trailerNumber: string;

  @Column({ name: 'truck_number' })
  truckNumber: string;

  @Column('simple-array')
  @IsArray()
  references: string[];

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
