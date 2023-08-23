import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ConfirmSignUpRequestDto {
  @IsString()
  name: string;

  @IsString()
  code: string;
}