import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageRequestDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export type SendMessageResponseDto = void;
