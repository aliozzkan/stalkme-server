import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionM } from './session.model';

@Entity({
  name: 'session_info',
})
export class SessionInfoM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @JoinColumn({ name: 'session_id' })
  @OneToOne(() => SessionM, (sessionM) => sessionM.sessionInfo)
  session: SessionM;

  @Column({ nullable: true })
  title: string;

  @Column()
  ip: string;

  constructor(partial: Partial<SessionInfoM>) {
    Object.assign(this, partial);
  }
}
