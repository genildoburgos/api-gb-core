/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Mock das dependências externas
jest.mock('bcryptjs');
jest.mock('uuid');

const mockDynamoClient = {
  send: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DYNAMO_CLIENT',
          useValue: mockDynamoClient,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =================================================================
  // Testes para o método create
  // =================================================================
  describe('create', () => {
    const createUserDto: CreateUserDto = {
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'password123',
    };

    it('should hash password, create a user, and return user data without the password', async () => {
      // Arrange
      const mockUserId = 'test-uuid';
      const mockHashedPassword = 'hashed_password';
      (uuidv4 as jest.Mock).mockReturnValue(mockUserId);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      mockDynamoClient.send.mockResolvedValue({});

      // Act
      const result = await service.create(createUserDto);

      // Assert
      // 1. Verifica se as dependências foram chamadas corretamente
      expect(uuidv4).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.senha, 10);
      expect(mockDynamoClient.send).toHaveBeenCalled();
      
      // 2. Verifica se o item salvo no DB está correto
      const putCommand = (mockDynamoClient.send.mock.calls[0][0] as PutCommand).input;
      expect(putCommand.TableName).toBe('Users');
      expect(putCommand.Item).toEqual({
        id: mockUserId,
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: mockHashedPassword,
      });

      // 3. Verifica o objeto retornado
      expect(result).toEqual({
        id: mockUserId,
        nome: createUserDto.nome,
        email: createUserDto.email,
      });
      expect(result).not.toHaveProperty('senha');
    });
  });

  // =================================================================
  // Testes para o método findAll
  // =================================================================
  describe('findAll', () => {
    it('should return an array of users without their passwords', async () => {
      // Arrange
      const mockUsersFromDb = [
        { id: '1', nome: 'User One', email: 'one@test.com', senha: 'hash1' },
        { id: '2', nome: 'User Two', email: 'two@test.com', senha: 'hash2' },
      ];
      mockDynamoClient.send.mockResolvedValue({ Items: mockUsersFromDb });
      
      // Act
      const result = await service.findAll();

      // Assert
      expect(mockDynamoClient.send).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', nome: 'User One', email: 'one@test.com' });
      expect(result[0]).not.toHaveProperty('senha');
      expect(result[1]).not.toHaveProperty('senha');
    });

    it('should return an empty array if no users are found', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValue({ Items: [] });

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // =================================================================
  // Testes para o método findOneByEmail
  // =================================================================
  describe('findOneByEmail', () => {
    const email = 'found@example.com';
    const mockUserFromDb = { id: 'user-found-id', nome: 'Found User', email, senha: 'hashed_password' };
    
    it('should return a user when found by email', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValue({ Items: [mockUserFromDb] });

      // Act
      const result = await service.findOneByEmail(email);

      // Assert
      const scanCommand = (mockDynamoClient.send.mock.calls[0][0] as ScanCommand).input;
      expect(scanCommand.FilterExpression).toBe('email = :email');
      expect(scanCommand.ExpressionAttributeValues).toEqual({ ':email': email });
      expect(result).toEqual(mockUserFromDb);
    });

    it('should return undefined when no user is found', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValue({ Items: [] });

      // Act
      const result = await service.findOneByEmail(email);
      
      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined if the database call fails', async () => {
        // Arrange
        mockDynamoClient.send.mockRejectedValue(new Error('DB Error'));

        // Act
        const result = await service.findOneByEmail(email);

        // Assert
        expect(result).toBeUndefined();
    });
  });
});