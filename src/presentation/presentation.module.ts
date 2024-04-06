import { Module } from '@nestjs/common';
import { UsecaseModule } from 'src/application/usecases/usecase.module';
import { AuthController } from './api/controllers/auth-controllers/auth.controller';
import { TestController } from './api/controllers/test-controllers/test.controller';

@Module({
  imports: [UsecaseModule],
  controllers: [AuthController, TestController],
})
export class PresentationModule {}
