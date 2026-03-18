import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY', // В ідеалі взяти з .env
      signOptions: { expiresIn: '1h' }, // Токен діє 1 годину
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
