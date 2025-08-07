import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Murmur } from './murmur.entity';
import { CreateMurmurDto } from './dto/create-murmur.dto';
import { MurmurResponseDto } from './dto/murmur-response.dto';

export interface PaginationOptions {
  userId?: number;
  page: number;
  limit: number;
}

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

  async findAll(options: PaginationOptions): Promise<{
    items: MurmurResponseDto[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { userId, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.author', 'author')
      .leftJoinAndSelect('murmur.likes', 'like', userId ? 'like.userId = :userId' : '1=0', { userId })
      .orderBy('murmur.createdAt', 'DESC');

    const [murmurs, totalItems] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = murmurs.map(murmur => this.transformToResponseDto(murmur, userId));

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findTimeline(options: PaginationOptions): Promise<{
    items: MurmurResponseDto[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { userId, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const murmurs = await this.murmursRepository
      .createQueryBuilder('murmur')
      .leftJoinAndSelect('murmur.author', 'author')
      .leftJoinAndSelect('murmur.likes', 'like', 'like.userId = :userId', { userId })
      .leftJoin('follows', 'follow', 'follow.followedId = murmur.authorId AND follow.followerId = :userId', { userId })
      .where('follow.id IS NOT NULL OR murmur.authorId = :userId', { userId })
      .orderBy('murmur.createdAt', 'DESC')
      .getMany();

    const totalItems = murmurs.length;
    const items = murmurs.slice(skip, skip + limit).map(murmur => this.transformToResponseDto(murmur, userId));

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };

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
    if (!murmur) {
      throw new NotFoundException('Murmur not found');
    }
    return {
      id: murmur.id,
      content: murmur.content,
      createdAt: murmur.createdAt,
      author: {
        id: murmur.author.id,
        displayName: murmur.author.displayName,
      },
      isLiked: murmur.likes?.length > 0,
      likesCount: murmur.likesCount || 0,
    };
  }

}