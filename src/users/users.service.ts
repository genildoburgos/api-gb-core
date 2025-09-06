import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DYNAMO_CLIENT')
    private readonly dynamoClient: DynamoDBDocumentClient,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userId = uuidv4();
    const params = {
      TableName: 'Users',
      Item: {
        id: userId,
        nome: createUserDto.nome,
        emial: createUserDto.email,
        senha: createUserDto.senha,
      },
    };

    await this.dynamoClient.send(new PutCommand(params));

    return { id: userId, ...createUserDto };
  }

  async findAll() {
    const params = {
      TableName: 'Users',
    };

    const result = await this.dynamoClient.send(new ScanCommand(params));

    return result.Items || [];
  }
}
