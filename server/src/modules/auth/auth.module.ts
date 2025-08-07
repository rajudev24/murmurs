import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User]),JwtModule.register({
    secret: 'murmur-secret',
    signOptions: { expiresIn: '1d' },
  }), ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})

export class AuthModule {}