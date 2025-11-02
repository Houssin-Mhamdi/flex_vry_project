import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly mailService: MailService,
  ) {}

async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
  const { email, name, lastName } = createReservationDto;
  const adminEmail = process.env.ADMIN_EMAIL || 'houssinmhamdi123@gmail.com';

  try {
    // Create and save the reservation
    const reservation = this.reservationRepository.create(createReservationDto);
    const savedReservation = await this.reservationRepository.save(reservation);

    // Send emails asynchronously without blocking the main operation
    console.log('🔄 About to call sendEmailsAsync...');
    console.log(`Parameters: email=${email}, name=${name}, lastName=${lastName}, adminEmail=${adminEmail}, id=${savedReservation.id}`);
    
    this.sendEmailsAsync(email, name, lastName, adminEmail, savedReservation.id);
    
    console.log('📧 sendEmailsAsync called (async, not awaited)');
    console.log(`✅ Reservation created successfully for: ${email}`);
    return savedReservation;
  } catch (error) {
    console.error(`❌ Error creating reservation for ${email}:`, error.message);
    throw new Error('Failed to create reservation');
  }
}

  private async sendEmailsAsync(
    email: string,
    name: string,
    lastName: string,
    adminEmail: string,
    reservationId: string,
  ): Promise<void> {
    try {
      // Use Promise.allSettled to ensure one email failure doesn't affect the other
      const results = await Promise.allSettled([
        this.mailService.sendDriverConfirmation(email, name, lastName),
        this.mailService.sendAdminNotification(adminEmail, name, lastName),
      ]);

      // Log results
      results.forEach((result, index) => {
        const emailType = index === 0 ? 'Driver Confirmation' : 'Admin Notification';
        if (result.status === 'fulfilled') {
          console.log(`✅ ${emailType} email sent successfully`);
        } else {
        console.error(`❌ ${emailType} email failed:`, result.reason);
        }
      });
    } catch (error) {
     console.error('Error in email sending process:', error);
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
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

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

    return { data, total, page: pageNumber, limit: limitNumber };
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateReservationStatusDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    // Store the old status to check if we need to send email
    const oldStatus = reservation.status;
    const newStatus = updateStatusDto.status;

    // Update the status
    reservation.status = newStatus;

    const updatedReservation =
      await this.reservationRepository.save(reservation);

    // Send email notification if status changed to COLLECT or ISSUE
    if (
      oldStatus !== newStatus &&
      (newStatus === ReservationStatus.COLLECT ||
        newStatus === ReservationStatus.ISSUE)
    ) {
      try {
        await this.mailService.sendStatusUpdate(
          reservation.email,
          reservation.name,
          reservation.lastName,
          newStatus,
        );
      } catch (error) {
        // Log the error but don't fail the request
        console.error('Failed to send status update email:', error);
      }
    }

    return updatedReservation;
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
