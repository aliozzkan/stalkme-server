import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserM } from './user.model';
import { AbstractModel } from '../interfaces/abstractModel';

@Entity({
  name: 'user_tfa',
})
export class UserTfaM extends AbstractModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => UserM, (user) => user.tfa)
  @JoinColumn({ name: 'user_id' })
  user: UserM;

  @Column()
  secret: string;

  @Column()
  otpAuthUri: string;

  @Column({ default: true, type: 'boolean' })
  enabled: boolean;

  constructor(partial: Partial<UserTfaM>) {
    super();
    Object.assign(this, partial);
  }
}
