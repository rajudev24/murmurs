
import { Controller, Post, Delete, Param, UseGuards, Request, Body } from "@nestjs/common";
import { LikesService } from './likes.service';


@Controller('api/murmurs')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post(':id/like')
  async like(@Param('id') murmurId: number,  @Body() body: { authorId: number }) {

    return this.likesService.like(body.authorId, murmurId);
  }


  @Delete(':id/like')
  async unlike(@Param('id') murmurId: number, @Body() body: { authorId: number }) {
    return this.likesService.unlike(body.authorId, murmurId);
  }
}