import { Module } from "@nestjs/common";
import { MurmursController } from "./murmurs.controller";
import { MurmursService } from "./murmurs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Murmur } from "./murmur.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur])],
  controllers: [MurmursController],
  providers: [MurmursService],
  exports: [],
})

export class MurmursModule{}