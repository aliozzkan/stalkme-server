import { Controller } from '@nestjs/common';
import { TestUseCases } from 'src/application/usecases/test.usecases';

@Controller('test')
export class TestController {
  constructor(private readonly testUseCases: TestUseCases) {}
}
