import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: 'User', schema: UserSchema },
      ])],
  controllers: [UsersController],
  providers: [UsersService , JwtService],
})
export class UsersModule {}
