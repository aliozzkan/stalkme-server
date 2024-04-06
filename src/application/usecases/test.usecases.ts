import { Injectable } from '@nestjs/common';
import { IdendityService } from '../services/identity.service';

@Injectable()
export class TestUseCases {
  constructor(private readonly identityService: IdendityService) {}
}
