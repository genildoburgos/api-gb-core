import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DynamoDBModule } from '../database/dynamodb.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { AwsModule } from 'src/aws/s3/aws.module';

@Module({
  imports: [forwardRef(() => AuthModule), DynamoDBModule, AwsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
