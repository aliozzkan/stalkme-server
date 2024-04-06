import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RepositoryModule } from './infrastructure/repositories/repository.module';

@Module({
  imports: [
    ApplicationModule,
    PresentationModule,
    ExceptionsModule,
    LoggerModule,
    RepositoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
