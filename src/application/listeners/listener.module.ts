import { Module } from '@nestjs/common';
import { MailListener } from './mail/mail.listener';
import { ServiceModule } from 'src/infrastructure/services/service.module';
import { AuthListeners } from './auth/auth.listener';
import { CacheModule } from 'src/infrastructure/cache/cache.module';

@Module({
  imports: [ServiceModule, CacheModule],
  providers: [MailListener, AuthListeners],
  exports: [MailListener, AuthListeners],
})
export class ListenerModule {}
