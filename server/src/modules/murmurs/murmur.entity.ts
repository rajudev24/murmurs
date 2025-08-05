import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Like } from '../likes/like.entity';

@Entity('murmurs')
export class Murmur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 280 })
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.murmurs, { onDelete: 'CASCADE' })
  author: User;

  @Column()
  authorId: number;

  @OneToMany(() => Like, like => like.murmur)
  likes: Like[];

  @Column({ default: 0 })
  likesCount: number;
}