import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { DatabaseModule } from './database/database.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [DatabaseModule, AccountsModule, MessagesModule],
})
export class AppModule {}
