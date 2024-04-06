import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserM } from 'src/domain/models/user.model';
import { TypeOrmConfigModule } from '../config/typeorm.module';
import { ServiceModule } from '../services/service.module';
import { UserRepository } from './user.repository';
import { SessionM } from 'src/domain/models/session.model';
import { SessionRepository } from './session.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([UserM, SessionM]),
    ServiceModule,
  ],
  providers: [UserRepository, SessionRepository],
  exports: [UserRepository, SessionRepository],
})
export class RepositoryModule {}
