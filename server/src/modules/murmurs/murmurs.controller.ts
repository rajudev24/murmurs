import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dto/create-murmur.dto';

@Controller('api')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

  @Get('murmurs')
  async findAll(@Query('userId') userId?: number) {
    return this.murmursService.findAll(userId);
  }


  @Get('timeline')
  async getTimeline(@Request() req) {
    return this.murmursService.findTimeline(req.user.userId);
  }

  @Get('murmurs/:id')
  async findOne(@Param('id') id: number, @Query('userId') userId?: number) {
    return this.murmursService.findById(id, userId);
  }


  @Post('me/murmurs')
  async create(@Body() createMurmurDto: CreateMurmurDto, @Request() req) {
    return this.murmursService.create(createMurmurDto, req.user.userId);
  }

  @Delete('me/murmurs/:id')
  async delete(@Param('id') id: number, @Request() req) {
    return this.murmursService.delete(id, req.user.userId);
  }
}