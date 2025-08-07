import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
  ) {}

  async follow(followerId: number, followedId: number): Promise<void> {
    if (followerId === followedId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const existingFollow = await this.followsRepository.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    const follow = this.followsRepository.create({ followerId, followedId });
    await this.followsRepository.save(follow);
  }

  async unfollow(followerId: number, followedId: number): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followedId },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followsRepository.delete(follow.id);
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followedId },
    });
    return !!follow;
  }
}