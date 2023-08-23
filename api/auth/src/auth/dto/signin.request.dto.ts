import { IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}