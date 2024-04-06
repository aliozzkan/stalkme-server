import { Module } from '@nestjs/common';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { EventerModule } from 'src/infrastructure/config/eventer.module';
import { RepositoryModule } from 'src/infrastructure/repositories/repository.module';
import { ServiceModule } from 'src/infrastructure/services/service.module';
import { ListenerModule } from './listeners/listener.module';
import { IdendityService } from './services/identity.service';
import { UsecaseModule } from './usecases/usecase.module';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';

@Module({
  imports: [
    EventerModule,
    RepositoryModule,
    ServiceModule,
    UsecaseModule,
    ListenerModule,
    CacheModule,
    JwtModule,
  ],
  providers: [IdendityService, ListenerModule],
  exports: [IdendityService, ListenerModule],
})
export class ApplicationModule {}
