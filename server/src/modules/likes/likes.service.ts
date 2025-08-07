import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Murmur } from '../murmurs/murmur.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
  ) {}

  async like(userId: number, murmurId: number): Promise<void> {
    const existingLike = await this.likesRepository.findOne({
      where: { userId, murmurId },
    });

    if (existingLike) {
      throw new ConflictException('Already liked this murmur');
    }

    const like = this.likesRepository.create({ userId, murmurId });
    await this.likesRepository.save(like);

    await this.murmursRepository.increment({ id: murmurId }, 'likesCount', 1);
  }

  async unlike(userId: number, murmurId: number): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { userId, murmurId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.delete(like.id);


    await this.murmursRepository.decrement({ id: murmurId }, 'likesCount', 1);
  }
}