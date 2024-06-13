import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, MinLength, ValidateIf } from "class-validator";

export class loginDto{
    

    @IsNotEmpty()
    @IsString()
    @ValidateIf((o) => !o.email)
    @ApiProperty({ default: '@Brightselasie' })
    userName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ValidateIf((o) => !o.userName)
    @ApiProperty({ default: 'honyabright4278@gmail.com' })
    email: string;


    @IsNotEmpty()
    @IsString()
    @ApiProperty({ default: 'Accra' })
    password: string;
}