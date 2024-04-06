import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionM } from 'src/domain/models/session.model';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionM)
    private readonly sessionRepository: Repository<SessionM>,
  ) {}

  async create(variables: Pick<SessionM, 'token' | 'userId' | 'expiredAt'>) {
    const newSession = new SessionM(variables);
    await this.sessionRepository.save(newSession);
    if (!newSession.id) {
      throw new Error('Session not created');
    }
    return newSession;
  }

  async getOneByToken(token: string) {
    const session = await this.sessionRepository.findOneOrFail({
      where: { token, revokedAt: IsNull() },
      relations: ['user'],
    });
    if (session.isExpired()) {
      throw new Error('Session expired');
    }
    return session;
  }

  async revoke(token: string) {
    const session = await this.sessionRepository.findOneOrFail({
      where: { token, revokedAt: IsNull() },
    });
    session.revokedAt = new Date();
    await this.sessionRepository.save(session);
  }

  async delete(token: string) {
    await this.sessionRepository
      .createQueryBuilder()
      .softDelete()
      .where('token = :token', { token })
      .execute();
  }

  async deleteAllByUserId(userId: number) {
    await this.sessionRepository
      .createQueryBuilder()
      .softDelete()
      .where('userId = :userId', { userId })
      .execute();
  }
}
