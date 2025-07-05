import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrLoginUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateOrLoginUserResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
  };
}
