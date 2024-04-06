import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserM } from 'src/domain/models/user.model';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { BcryptService } from '../services/bcrypt/bcrypt.service';

type UserWhereType = Pick<UserM, 'email' | 'id' | 'username' | 'verifiedAt'>;

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserM)
    private readonly userEntityRepo: Repository<UserM>,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(variables: Partial<UserM>) {
    const newUser = new UserM(variables);
    if (newUser.password) {
      newUser.password = await this.bcryptService.hash(newUser.password);
    }
    await this.userEntityRepo.save(newUser);

    if (!newUser.id) {
      throw new Error('User not created');
    }

    return newUser;
  }

  async getOneById(id: number) {
    return await this.userEntityRepo.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
  }

  async getOne(
    where: FindOptionsWhere<UserWhereType> | FindOptionsWhere<UserWhereType>[],
  ) {
    return await this.userEntityRepo.findOneOrFail({
      where: { ...where, deletedAt: IsNull() },
    });
  }

  async updateOne(
    where: FindOptionsWhere<UserWhereType>,
    update: Partial<UserM>,
  ) {
    return await this.userEntityRepo.update(where, update);
  }
}
