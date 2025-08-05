
import { Controller, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';


@Controller('api/murmurs')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post(':id/like')
  async like(@Param('id') murmurId: number, @Request() req) {
    return this.likesService.like(req.user.userId, murmurId);
  }


  @Delete(':id/like')
  async unlike(@Param('id') murmurId: number, @Request() req) {
    return this.likesService.unlike(req.user.userId, murmurId);
  }
}