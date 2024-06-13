import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt-strategy';
import { AuthenticationService } from './authentication.service';


@Module({
  imports: [JwtModule.register({}), PassportModule],
  providers: [AuthenticationService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
