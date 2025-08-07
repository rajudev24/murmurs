import { Controller, Get, Put, Body, Param, UseGuards, Request, ForbiddenException } from "@nestjs/common";
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getProfile(@Param('id') id: number) {
    return this.usersService.getProfile(id);
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }
}