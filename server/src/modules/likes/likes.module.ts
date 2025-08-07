import { Module } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./like.entity";
import { Murmur } from "../murmurs/murmur.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Like, Murmur])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [],
})

export class LikesModule {}