import { Controller, Post, Delete, Param, UseGuards, Request, Body } from "@nestjs/common";
import { FollowsService } from './follows.service';


@Controller('api/users')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post(':id/follow')
  async follow(@Param('id') followedId: number,  @Body() body: { authorId: number }) {
    return this.followsService.follow(body.authorId, followedId);
  }

  @Delete(':id/follow')
  async unfollow(@Param('id') followedId: number, @Request() req) {
    return this.followsService.unfollow(req.user.userId, followedId);
  }
}