import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractModel } from '../interfaces/abstractModel';
import { UserM } from './user.model';
import { SessionInfoM } from './sessionInfo.model';

@Entity({
  name: 'session',
})
export class SessionM extends AbstractModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserM)
  user: UserM;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date;

  @OneToOne(() => SessionInfoM, (sessionInfoM) => sessionInfoM.session)
  sessionInfo: SessionInfoM;

  isRevoked() {
    return Boolean(this.revokedAt);
  }

  isExpired() {
    return this.expiredAt < new Date();
  }

  constructor(partial: Partial<SessionM>) {
    super();
    Object.assign(this, partial);
  }
}
