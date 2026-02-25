import { Module } from '@nestjs/common';
import { UsersModule } from './core/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './core/database/dynamodb.module';
import { AuthModule } from './core/auth/auth.module';
import { AwsModule } from './aws/s3/aws.module';
import { ImagesModule } from './storage/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DynamoDBModule,
    AuthModule,
    AwsModule,
    ImagesModule,
  ],
})
export class AppModule {}
