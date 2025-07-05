import { IsOptional, IsString } from 'class-validator';

export class GetFunnelStatusRequestDto {
  @IsOptional()
  @IsString()
  messageId?: string;

  @IsOptional()
  @IsString()
  senderId?: string;
}

export class FunnelStatusResponseDto {
  messageId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: Date;
  error?: string;
  content?: string;
  senderId: string;
  createdAt: Date;
}
