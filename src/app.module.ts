import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './database/dynamodb.module';

@Module({
  // Combine todos os módulos em um único array 'imports'
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Isso garante que as variáveis de ambiente fiquem disponíveis em todo o app
    }),
    UsersModule, // Seu módulo de usuários
    DynamoDBModule, // Seu módulo do DynamoDB
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
