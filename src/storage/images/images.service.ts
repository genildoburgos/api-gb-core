/* eslint-disable */
import { Injectable, Inject, Logger, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../../aws/s3/s3.service';


@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly tableName = 'Images';

  constructor(
    @Inject('DYNAMO_CLIENT')
    private readonly dynamoClient: DynamoDBDocumentClient,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(userId: string, file: Express.Multer.File) {
    const pathPrefix = `images/${userId}`;
    const { url, key } = await this.s3Service.uploadFile(file, pathPrefix);

    const imageId = uuidv4();
    const newItem = {
      id: imageId,
      userId: userId,
      s3Key: key,
      url: url,
      fileName: file.originalname,
      createdAt: Date.now(),
    };

    const params = {
      TableName: this.tableName,
      Item: newItem,
    };

    try {
      await this.dynamoClient.send(new PutCommand(params));
      return newItem;
    } catch (error) {
      this.logger.error('Failed to save image metadata to DynamoDB', error.stack);
      await this.s3Service.deleteFile(key);
      throw new InternalServerErrorException('Error saving image metadata');
    }
  }

  async findUserImages(userId: string, search?: string, page: number = 1, limit: number = 10) {
    const params: any = {
      TableName: this.tableName,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
    };

    if (search) {
      params.FilterExpression = 'contains(fileName, :search)';
      params.ExpressionAttributeValues[':search'] = search;
    }

    const command = new QueryCommand(params);
    const result = await this.dynamoClient.send(command);

    const items = result.Items || [];
    const total = items.length;
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteUserImage(userId: string, imageId: string) {
    const getParams = {
      TableName: this.tableName,
      Key: { id: imageId },
    };
    
    const { Item } = await this.dynamoClient.send(new GetCommand(getParams));

    if (!Item) {
      throw new NotFoundException(`Image with ID "${imageId}" not found.`);
    }

    if (Item.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this image.');
    }

    await this.s3Service.deleteFile(Item.s3Key);

    const deleteParams = {
      TableName: this.tableName,
      Key: { id: imageId },
    };
    await this.dynamoClient.send(new DeleteCommand(deleteParams));

    return { message: 'Image deleted successfully.' };
  }


  async exportUserImagesToCsv(userId: string): Promise<string> {
    const allImages = await this.findAllUserImages(userId);

    if (allImages.length === 0) {
      return '"nome","URL remota","data de criação"\n';
    }

    const headers = ['nome', 'URL remota', 'data de criação'];
    
    const rows = allImages.map(image => [
      `"${image.fileName.replace(/"/g, '""')}"`, 
      image.url,
      new Date(image.createdAt).toISOString(),
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    return csvContent;
  }

  private async findAllUserImages(userId: string): Promise<any[]> {
    const allItems: any[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
      const params: any = {
        TableName: this.tableName,
        IndexName: 'UserIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const command = new QueryCommand(params);
      const result = await this.dynamoClient.send(command);

      if (result.Items) {
        allItems.push(...result.Items);
      }
      
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allItems;
}
}