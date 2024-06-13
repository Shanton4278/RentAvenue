import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { compareData, hashData } from 'src/utils/common';
import { loginDto } from './dto/User-login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(payload: CreateAccountDto, req, res) {
    try {
      // Comparing password to confirm password
      if (payload.password !== payload.confirmPassword) {
        throw new HttpException(
          { message: 'Passwords do not match' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Adding security to the password by hashing and salting
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(payload.password, saltRounds);

      const newAccount = new this.userModel({
        ...payload,
        password: hashPassword,
      });
      await newAccount.save();
      return newAccount;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          { message: 'User with this email or username already exists' },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { message: 'An error occurred while creating the account' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(payload: loginDto) {
    try {
      // Find the user by email or username
      const user = await this.userModel.findOne({
        $or: [{ email: payload.email }, { userName: payload.userName }],
      });

      // If user is not found, throw an error
      if (!user) {
        throw new HttpException(
          { message: 'Login Credentials Incorrect' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Compare provided password with the stored hashed password
      const isValidPassword = await compareData(
        payload.password,
        user.password,
      );

      // If the password is invalid, throw an error
      if (!isValidPassword) {
        throw new HttpException(
          { message: 'Login Credentials Incorrect' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generate tokens
      const { token, refreshToken } = await this.getAccessToken({
        uid: user._id,
      });

      // Hash the refresh token before saving it
      user.refreshToken = await hashData(refreshToken);
      await user.save();

      // Remove sensitive information before returning the user object
      user.password = undefined;
      user.refreshToken = undefined;

      return { ...user.toObject(), token, refreshToken };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Login failed. Please check your credentials and try again.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAccessToken(
    payload: any,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return { token, refreshToken };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to generate access token' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRefreshToken(req) {
    try {
      const user = await this.userModel
        .findById(req.user.uid)
        .orFail(
          new HttpException(
            { message: 'User not found' },
            HttpStatus.NOT_FOUND,
          ),
        );

      const isRefreshTokenValid = await compareData(
        req.user?.refreshToken,
        user.refreshToken,
      );
      if (isRefreshTokenValid) {
        const { token, refreshToken } = await this.getAccessToken({
          uid: user._id,
          cls: user.userRole,
        });

        user.refreshToken = await hashData(refreshToken);
        await user.save();
        return { token, refreshToken };
      }

      throw new HttpException(
        { message: 'Invalid refresh token' },
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'An error occurred while refreshing token' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
