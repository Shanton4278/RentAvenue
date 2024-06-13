import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { loginDto } from './dto/User-login.dto';
import { JwtRefreshAuthGuard } from 'src/authentication/jwt/jwt-refresh-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }





  @Post('creat-account')
  async createAccount(
    @Body() payload: CreateAccountDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const account = await this.usersService.createAccount(payload, req, res);
      return res.status(HttpStatus.CREATED).json(account);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating account',
        error: error.message,
      });
    }

  }


  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'logged in succesfully' })
  async login(
    @Body() payload: loginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const login = await this.usersService.login(payload)
      return res.status(HttpStatus.OK).json(login);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error logging in',
        error: error.message,
      });
    }

  }


  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh-token')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Token updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid Client Credentials' })
  @ApiBearerAuth()
  async getRefreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.usersService.getRefreshToken(req);
      return res.status(HttpStatus.OK).json(token);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error refreshing token',
        error: error.message,
      });
    }
  }

}
