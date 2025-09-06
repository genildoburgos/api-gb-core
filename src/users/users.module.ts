import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DynamoDBModule } from '../database/dynamodb.module';

@Module({
  imports: [DynamoDBModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
