import { Module, forwardRef } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { DynamoDBModule } from '../database/dynamodb.module';
import { S3Service } from '../aws/s3.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), DynamoDBModule],
  controllers: [ImagesController],
  providers: [ImagesService, S3Service],
})
export class ImagesModule {}
