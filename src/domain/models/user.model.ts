import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractModel } from '../interfaces/abstractModel';
import { UserTfaM } from './user_tfa.model';

@Entity({
  name: 'user',
})
export class UserM extends AbstractModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  password: string;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  premiumAt: Date;

  @OneToOne(() => UserTfaM, (userTfa) => userTfa.user)
  tfa: UserTfaM;

  isPremium() {
    return Boolean(this.premiumAt);
  }

  isVerified() {
    return Boolean();
  }

  constructor(partial: Partial<UserM>) {
    super();
    Object.assign(this, partial);
  }
}
