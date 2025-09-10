/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';

// Mock das dependências
jest.mock('bcryptjs');

const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =================================================================
  // Testes para o método login
  // =================================================================
  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      senha: 'password123',
    };

    const mockUser = {
      id: 'user-id-123',
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'hashed_password', // Senha "hasheada" que viria do DB
    };

    it('should return an access token when credentials are valid', async () => {
      // Arrange: Configurar mocks para o cenário de sucesso
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Senha correta
      const expectedToken = 'mock_jwt_token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act: Chamar o método de login
      const result = await service.login(loginDto);

      // Assert: Verificar se tudo foi chamado corretamente
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.senha, mockUser.senha);
      
      const expectedPayload = {
        username: mockUser.email,
        sub: mockUser.id,
        nome: mockUser.nome,
      };
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      
      expect(result).toEqual({ access_token: expectedToken });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange: Simular que o usuário não foi encontrado
      mockUsersService.findOneByEmail.mockResolvedValue(undefined);

      // Act & Assert: Verificar se a exceção é lançada
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      // Garantir que as outras funções não foram chamadas
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      // Arrange: Simular que a senha está incorreta
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Senha incorreta

      // Act & Assert: Verificar se a exceção é lançada
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      // Garantir que o serviço de JWT não foi chamado
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});