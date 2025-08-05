import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateMurmurDto {
  @IsString()
  @MaxLength(280)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}