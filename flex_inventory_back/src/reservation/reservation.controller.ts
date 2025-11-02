import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(@Query() paginationDto: any) {
    const { page, limit, search, date } = paginationDto;
    return this.reservationService.findAll(
      Number(page),
      Number(limit),
      search,
      date,
    );
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<Reservation[]> {
    return this.reservationService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReservationStatusDto,
  ): Promise<Reservation> {
    return this.reservationService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reservationService.remove(id);
  }
}
