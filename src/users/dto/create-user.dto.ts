import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,

} from 'class-validator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Bright Honya' })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: '@Brightselasie' })
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'honyabright4278@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: '0547141237' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.PROPERTY_SEAKER })
  userRole: UserRoleEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'G.Accra' })
  region: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Accra' })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Mallam' })
  town: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: 'Accra' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: 'Accra' })
  confirmPassword: string;
}
