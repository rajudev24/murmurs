import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';

@Controller('api')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

  @Get('murmurs')
  async findAll(
    @Query('userId') userId?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.murmursService.findAll({
      userId,
      page: Number(page),
      limit: Number(limit),
    });
  }


  @Get('timeline')
  async getTimeline(@Body() body: { userId: number },
                    @Query('page') page = 1,
                    @Query('limit') limit = 10,) {
    return this.murmursService.findTimeline({
      userId: body.userId,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('murmurs/:id')
  async findOne(@Param('id') id: number, @Query('userId') userId?: number) {
    return this.murmursService.findById(id, userId);
  }


  @Post('me/murmurs')
  async create(@Body() createMurmurDto: CreateMurmurDto) {
    return this.murmursService.create(createMurmurDto, createMurmurDto.authorId);
  }

  @Delete('me/murmurs/:id')
  async delete(@Param('id') id: number, @Request() req) {
    return this.murmursService.delete(id, req.user.userId);
  }
}