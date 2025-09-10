/* eslint-disable */
import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
 
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('DYNAMO_CLIENT')
    private readonly dynamoClient: DynamoDBDocumentClient,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userId = uuidv4();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.senha, saltRounds);

    const params = {
      TableName: 'Users',
      Item: {
        id: userId,
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: hashedPassword,
      },
    };

    await this.dynamoClient.send(new PutCommand(params));

    const { senha, ...result } = createUserDto;
    return { id: userId, ...result };
  }

  async findAll() {
    const params = {
      TableName: 'Users',
    };
    const result = await this.dynamoClient.send(new ScanCommand(params));

    if (result.Items) {
      return result.Items.map((item) => {
        const { senha, ...user } = item;
        return user;
      });
    }
    return [];
  }

  async findOneByEmail(email: string): Promise<any | undefined> {

    const params = {
      TableName: 'Users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    try {
      const result = await this.dynamoClient.send(new ScanCommand(params));
      if (result.Items && result.Items.length > 0) {
        return result.Items[0];
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }
}
