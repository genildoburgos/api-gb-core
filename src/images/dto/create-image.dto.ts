import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    description: 'Original filename uploaded by the user',
    example: 'photo.png',
  })
  fileName?: string;

  @ApiProperty({
    description: 'S3 URL for the uploaded file',
    example: 'https://s3.amazonaws.com/.../photo.png',
  })
  url?: string;
}
