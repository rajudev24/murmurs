export class MurmurResponseDto {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likesCount: number;
  isLiked: boolean;
  author: {
    id: number;
    username?: string;
    displayName?: string;
    avatar?: string;
  };
}