import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Невірний формат email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  pass: string;
}