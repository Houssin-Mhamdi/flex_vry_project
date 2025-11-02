// reservation/dto/update-reservation-status.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsOptional()
  notes?: string;
}
