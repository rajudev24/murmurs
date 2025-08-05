import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Murmur } from './murmur.entity';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmursRepository: Repository<Murmur>,
  ) {}

  async create(createMurmurDto: CreateMurmurDto, authorId: number): Promise<Murmur> {
    const murmur = this.murmursRepository.create({
      ...createMurmurDto,
      authorId,
    });
    return this.murmursRepository.save(murmur);
  }

  async findAll(userId?: number): Promise<MurmurResponseDto[]> {
    const murmurs = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.author', 'author')
      .leftJoinAndSelect('murmur.likes', 'like', userId ? 'like.userId = :userId' : '1=0', { userId })
      .orderBy('murmur.createdAt', 'DESC')
      .getMany();

    return murmurs.map(murmur => this.transformToResponseDto(murmur, userId));
  }

  async findTimeline(userId: number): Promise<MurmurResponseDto[]> {
    const murmurs = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.author', 'author')
      .leftJoinAndSelect('murmur.likes', 'like', 'like.userId = :userId', { userId })
      .leftJoin('follows', 'follow', 'follow.followedId = murmur.authorId AND follow.followerId = :userId', { userId })
      .where('follow.id IS NOT NULL OR murmur.authorId = :userId', { userId })
      .orderBy('murmur.createdAt', 'DESC')
      .getMany();

    return murmurs.map(murmur => this.transformToResponseDto(murmur, userId));
  }

  async findById(id: number, userId?: number): Promise<MurmurResponseDto> {
    const murmur = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.author', 'author')
      .leftJoinAndSelect('murmur.likes', 'like', userId ? 'like.userId = :userId' : '1=0', { userId })
      .where('murmur.id = :id', { id })
      .getOne();

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    return this.transformToResponseDto(murmur, userId);
  }

  async delete(id: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id } });

    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }

    if (murmur.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own murmurs');
    }

    await this.murmursRepository.delete(id);
  }

  private transformToResponseDto(murmur: Murmur, userId?: number): MurmurResponseDto {
    return {
      id: murmur.id,
      content: murmur.content,
      imageUrl: murmur.imageUrl,
      createdAt: murmur.createdAt,
      likesCount: murmur.likesCount,
      isLiked: userId ? murmur.likes.some(like => like.userId === userId) : false,
      author: {
        id: murmur.author.id,
        username: murmur.author.username,
        displayName: murmur.author.displayName || murmur.author.username,
        avatar: murmur.author.avatar,
      },
    };
  }
}