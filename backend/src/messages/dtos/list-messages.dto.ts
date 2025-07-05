import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class ListMessagesRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  perPage?: number = 15;
}

export class ListMessagesResponseDto {
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    senderUsername: string;
    createdAt: Date;
  }>;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
