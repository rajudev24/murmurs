import { Module } from "@nestjs/common";
import { FollowsService } from "./follows.service";
import { FollowsController } from "./follows.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Follow } from "./follow.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [],
})

export class FollowsModule {}