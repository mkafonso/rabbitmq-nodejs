import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AccountsModule],
})
export class AppModule {}
