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
    sender_id: string;
    sender_username: string;
    created_at: Date;
  }>;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
