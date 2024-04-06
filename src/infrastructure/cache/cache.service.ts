import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: any) {}

  async set(key: string, value: any, ttl: number = 0) {
    await this.cacheManager.set(key, value, { ttl });
  }

  async get(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
