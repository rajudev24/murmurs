import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique, Column } from "typeorm";
import { User } from '../users/user.entity';

@Entity('follows')
@Unique(['followerId', 'followedId'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @Column()
  followerId: number;

  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  followed: User;

  @Column()
  followedId: number;

  @CreateDateColumn()
  createdAt: Date;
}