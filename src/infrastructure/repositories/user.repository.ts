import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserM } from 'src/domain/models/user.model';
import { Equal, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { UserTfaM } from 'src/domain/models/user_tfa.model';

type UserWhereType = Pick<UserM, 'email' | 'id' | 'username' | 'verifiedAt'>;

type UserOptionsType = { withRelations?: boolean };

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserM)
    private readonly userEntityRepo: Repository<UserM>,
    @InjectRepository(UserTfaM)
    private readonly userTfaEntityRepo: Repository<UserTfaM>,
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

  async getOneById(id: number, options?: UserOptionsType) {
    return await this.userEntityRepo.findOneOrFail({
      where: { id, deletedAt: IsNull() },
      relations: Boolean(options?.withRelations) ? ['tfa'] : [],
    });
  }

  async getOne(
    where: FindOptionsWhere<UserWhereType> | FindOptionsWhere<UserWhereType>[],
  ) {
    return await this.userEntityRepo.findOneOrFail({
      where: { ...where, deletedAt: IsNull() },
      relations: ['tfa'],
    });
  }

  async updateOne(
    where: FindOptionsWhere<UserWhereType>,
    update: Partial<UserM>,
  ) {
    return await this.userEntityRepo.update(where, update);
  }

  async createTfa(userId: number, variables: Partial<UserTfaM>) {
    const newTfa = new UserTfaM({ userId, ...variables });
    await this.userTfaEntityRepo.save(newTfa);

    if (!newTfa.id) {
      throw new Error('TFA not created');
    }

    return newTfa;
  }

  async getTfaByUserId(userId: number) {
    return await this.userTfaEntityRepo.findOneOrFail({
      where: { userId: Equal(userId) },
    });
  }

  async updateTfaByUserId(userId: number, update: Partial<UserTfaM>) {
    return await this.userTfaEntityRepo.update(
      { userId: Equal(userId) },
      update,
    );
  }

  async deleteTfaByUserId(userId: number) {
    return await this.userTfaEntityRepo.softDelete({ userId: Equal(userId) });
  }
}
