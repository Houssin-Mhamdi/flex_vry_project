import { IsEmail, IsPhoneNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  driverLicense: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  trailerNumber: string;

  @IsNotEmpty()
  truckNumber: string;

  @IsArray()
  references: string[];

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;
}
