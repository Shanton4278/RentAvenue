
import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  town: string;
}
