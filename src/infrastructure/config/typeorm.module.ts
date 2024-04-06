import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'administrator',
  password: '12345!',
  database: 'stalkme_db',
  entities: [__dirname + '../../../**/*.{model,entity}{.ts,.js}'],
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: getTypeOrmModuleOptions }),
  ],
})
export class TypeOrmConfigModule {}
