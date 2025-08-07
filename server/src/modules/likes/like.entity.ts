import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Murmur } from '../murmurs/murmur.entity';

@Entity('likes')
@Unique(['userId', 'murmurId'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Murmur, murmur => murmur.likes, { onDelete: 'CASCADE' })
  murmur: Murmur;

  @Column()
  murmurId: number;

  @CreateDateColumn()
  createdAt: Date;
}