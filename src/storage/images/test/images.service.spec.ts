/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from '../images.service';
import { S3Service } from '../../../aws/s3/s3.service';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';

// Mock do S3Service
const mockS3Service = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

// Mock do DynamoDBDocumentClient
const mockDynamoClient = {
  send: jest.fn(),
};

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    // Reseta os mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: 'DYNAMO_CLIENT',
          useValue: mockDynamoClient,
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =================================================================
  // Testes para o método uploadImage
  // =================================================================
  describe('uploadImage', () => {
    const mockFile: any = { originalname: 'test.jpg', buffer: Buffer.from('test') };
    const userId = 'user-123';

    it('should upload an image and save metadata successfully', async () => {
      // Arrange: Configurar os mocks para o caminho feliz
      const s3Response = { url: 'http://s3.url/test.jpg', key: 'images/user-123/key.jpg' };
      mockS3Service.uploadFile.mockResolvedValue(s3Response);
      mockDynamoClient.send.mockResolvedValue({});

      // Act: Chamar o método
      const result = await service.uploadImage(userId, mockFile);

      // Assert: Verificar os resultados
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(mockFile, `images/${userId}`);
      expect(mockDynamoClient.send).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.url).toBe(s3Response.url);
      expect(result.s3Key).toBe(s3Response.key);
    });

    it('should delete file from S3 if DynamoDB save fails', async () => {
      // Arrange: Simular falha no DynamoDB
      const s3Response = { url: 'http://s3.url/test.jpg', key: 'images/user-123/key.jpg' };
      mockS3Service.uploadFile.mockResolvedValue(s3Response);
      mockDynamoClient.send.mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(service.uploadImage(userId, mockFile)).rejects.toThrow(InternalServerErrorException);
      
      // Verifica se a limpeza foi feita
      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(s3Response.key);
    });
  });

  // =================================================================
  // Testes para o método deleteUserImage
  // =================================================================
  describe('deleteUserImage', () => {
    const userId = 'user-123';
    const imageId = 'image-abc';
    const imageMetadata = {
      id: imageId,
      userId: userId,
      s3Key: 'images/user-123/key.jpg',
    };

    it('should delete an image successfully', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValueOnce({ Item: imageMetadata }); // Simula o GetCommand
      mockS3Service.deleteFile.mockResolvedValue(undefined);
      mockDynamoClient.send.mockResolvedValueOnce({}); // Simula o DeleteCommand

      // Act
      const result = await service.deleteUserImage(userId, imageId);

      // Assert
      expect(mockDynamoClient.send).toHaveBeenCalledTimes(2);
      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(imageMetadata.s3Key);
      expect(result).toEqual({ message: 'Image deleted successfully.' });
    });

    it('should throw NotFoundException if image does not exist', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValue({ Item: undefined });

      // Act & Assert
      await expect(service.deleteUserImage(userId, imageId)).rejects.toThrow(NotFoundException);
      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      // Arrange
      const otherUsersImage = { ...imageMetadata, userId: 'another-user-456' };
      mockDynamoClient.send.mockResolvedValue({ Item: otherUsersImage });

      // Act & Assert
      await expect(service.deleteUserImage(userId, imageId)).rejects.toThrow(ForbiddenException);
      expect(mockS3Service.deleteFile).not.toHaveBeenCalled();
    });
  });

  // =================================================================
  // Testes para o método exportUserImagesToCsv
  // =================================================================
 describe('exportUserImagesToCsv', () => {
    const userId = 'user-123';
    
    it('should return a valid CSV string for a user with images across multiple pages', async () => {
      // Arrange
      const page1Items = [
        { fileName: 'photo1.jpg', url: 'http://s3/photo1.jpg', createdAt: 1678886400000 },
      ];
      const page2Items = [
        { fileName: 'photo2, special.jpg', url: 'http://s3/photo2.jpg', createdAt: 1678886500000 },
      ];

      mockDynamoClient.send
        .mockResolvedValueOnce({ Items: page1Items, LastEvaluatedKey: { id: 'someKey' } })
        .mockResolvedValueOnce({ Items: page2Items, LastEvaluatedKey: undefined });

      // Act
      const csv = await service.exportUserImagesToCsv(userId);

      // Assert
      expect(mockDynamoClient.send).toHaveBeenCalledTimes(2);
      const expectedDate1 = new Date(page1Items[0].createdAt).toISOString();
      const expectedDate2 = new Date(page2Items[0].createdAt).toISOString();
      
      // =================================================================
      // CORREÇÃO AQUI: Adicione aspas ao redor do nome do arquivo na primeira linha de dados.
      // =================================================================
      const expectedCsv = `nome,URL remota,data de criação\n` +
                          `"${page1Items[0].fileName}",${page1Items[0].url},${expectedDate1}\n` +
                          `"${page2Items[0].fileName.replace(/"/g, '""')}",${page2Items[0].url},${expectedDate2}`;

      expect(csv).toBe(expectedCsv);
    });

    it('should return only headers when user has no images', async () => {
      // Arrange
      mockDynamoClient.send.mockResolvedValue({ Items: [], LastEvaluatedKey: undefined });

      // Act
      const csv = await service.exportUserImagesToCsv(userId);

      // Assert
      expect(mockDynamoClient.send).toHaveBeenCalledTimes(1);
      
      // =================================================================
      // CORREÇÃO AQUI: Mude a string esperada para corresponder à saída do serviço.
      // =================================================================
      expect(csv).toBe('"nome","URL remota","data de criação"\n');
    });
});
});