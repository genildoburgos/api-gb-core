/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../s3.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';

const mockSend = jest.fn();
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => ({
      send: mockSend,
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;

  const mockConfig = {
    AWS_REGION: 'us-east-1',
    PROVIDER_BUCKET: 'mock-bucket',
    PROVIDER_ACCESS_KEY_ID: 'mock-key-id',
    PROVIDER_SECRET_ACCESS_KEY: 'mock-secret',
    AWS_SESSION_TOKEN: 'mock-token',
  };

  beforeEach(async () => {
    mockSend.mockClear();
    (PutObjectCommand as jest.Mock).mockClear();
    (DeleteObjectCommand as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => mockConfig[key]),
          },
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      buffer: Buffer.from('mock file content'),
      stream: null,
      destination: null,
      filename: null,
      path: null,
    };
    const pathPrefix = 'images/user-123';

    it('should upload a file successfully and return its URL and key', async () => {
      mockSend.mockResolvedValue({});
      const result = await service.uploadFile(mockFile, pathPrefix);
      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: mockConfig.PROVIDER_BUCKET,
          Body: mockFile.buffer,
          ContentType: mockFile.mimetype,
        }),
      );
      expect(result.url).toContain(`https://${mockConfig.PROVIDER_BUCKET}.s3.${mockConfig.AWS_REGION}.amazonaws.com`);
      expect(result.key).toContain(`${pathPrefix}/`);
      expect(result.key).toContain('.jpg');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if the S3 upload fails', async () => {
      // =================================================================
      // CORREÇÃO AQUI: Silenciar o console.error para este teste
      // =================================================================
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSend.mockRejectedValue(new Error('S3 Error'));

      await expect(service.uploadFile(mockFile, pathPrefix)).rejects.toThrow(
        new InternalServerErrorException('Error uploading file'),
      );
        
      // Restaura a função original do console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteFile', () => {
    const fileKey = 'images/user-123/some-uuid.jpg';

    it('should delete a file successfully', async () => {
      mockSend.mockResolvedValue({});
      await service.deleteFile(fileKey);
      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: mockConfig.PROVIDER_BUCKET,
        Key: fileKey,
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if the S3 delete fails', async () => {
      // =================================================================
      // CORREÇÃO AQUI: Silenciar o console.error para este teste
      // =================================================================
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSend.mockRejectedValue(new Error('S3 Error'));
      
      await expect(service.deleteFile(fileKey)).rejects.toThrow(
        new InternalServerErrorException('Error deleting file'),
      );
      
      // Restaura a função original do console.error
      consoleErrorSpy.mockRestore();
    });
  });
});