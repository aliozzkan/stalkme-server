import { Module } from '@nestjs/common';
import { AuthUseCases } from './auth.usecases';
import { IdendityService } from '../services/identity.service';
import { RepositoryModule } from 'src/infrastructure/repositories/repository.module';
import { ServiceModule } from 'src/infrastructure/services/service.module';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { TestUseCases } from './test.usecases';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';

@Module({
  imports: [
    RepositoryModule,
    ServiceModule,
    CacheModule,
    ExceptionsModule,
    JwtModule,
  ],
  providers: [AuthUseCases, IdendityService, TestUseCases],
  exports: [AuthUseCases, TestUseCases],
})
export class UsecaseModule {}
