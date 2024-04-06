import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisOptions } from './redis-options';

@Module({
  imports: [NestCacheModule.registerAsync(RedisOptions)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
