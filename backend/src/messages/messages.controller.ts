import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../accounts/decorators/current-user.decorator';
import { AuthGuard } from '../accounts/guards/auth.guard';
import { CurrentUser as CurrentUserType } from '../accounts/types/current-user.type';
import { ListMessagesRequestDto } from './dtos/list-messages.dto';
import { SendMessageRequestDto } from './dtos/send-message.dto';
import { ListMessagesService } from './services/list-messages.service';
import { SendMessageService } from './services/send-message.service';

@Controller('/api/v1/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    private readonly sendMessageService: SendMessageService,
    private readonly listMessagesService: ListMessagesService,
  ) {}

  @Post()
  async sendMessage(
    @Body() dto: SendMessageRequestDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.sendMessageService.execute({
      content: dto.content,
      senderId: user.id,
    });
  }

  @Get()
  async listMessages(@Query() query: ListMessagesRequestDto) {
    return this.listMessagesService.execute(query);
  }
}
