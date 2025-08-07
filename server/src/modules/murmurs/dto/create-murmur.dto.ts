import { IsString, MaxLength, IsOptional } from 'class-validator';
import { Column } from "typeorm";

export class CreateMurmurDto {
  @IsString()
  @MaxLength(280)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Column()
  authorId: number;
}