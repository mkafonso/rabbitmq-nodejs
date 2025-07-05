import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageService } from './services/send-message.service';

@Controller('/api/v1/messages')
export class MessagesController {
  constructor(private readonly sendMessageService: SendMessageService) {}

  @Post()
  async sendMessage(@Body() dto: any) {
    return this.sendMessageService.execute(dto);
  }
}
