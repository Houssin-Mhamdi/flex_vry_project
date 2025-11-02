import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { email, name, lastName } = createReservationDto;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourcompany.com';
    try {
      await this.mailService.sendDriverConfirmation(email, name, lastName);
      await this.mailService.sendAdminNotification(adminEmail, name, lastName);
      const reservation =
        this.reservationRepository.create(createReservationDto);
      return await this.reservationRepository.save(reservation);
      
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    date?: string, // filter by date
  ): Promise<{
    data: Reservation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const where: any[] = [];

    if (search) {
      where.push(
        { name: ILike(`%${search}%`) },
        { phone: ILike(`%${search}%`) },
        { trailerNumber: ILike(`%${search}%`) },
        { truckNumber: ILike(`%${search}%`) },
        { references: Raw((alias) => `${alias} LIKE '%${search}%'`) },
      );
    }

    if (date) {
      // Filter by exact date
      where.push({ date }); // because column type is 'date', no need for Between
    }

    const [data, total] = await this.reservationRepository.findAndCount({
      where: where.length ? where : {},
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    const updatedReservation = Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(updatedReservation);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }

  async findByEmail(email: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { email },
      order: { createdAt: 'DESC' },
    });
  }
}
