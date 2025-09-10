/* eslint-disable */
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service{
    private readonly s3Client: S3Client;
    private readonly bucketName: string | undefined;
    private readonly region: string;

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.getOrThrow<string>('AWS_REGION');
        this.bucketName = this.configService.getOrThrow<string>('PROVIDER_BUCKET');
        
        const accessKeyId = this.configService.getOrThrow<string>('PROVIDER_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.getOrThrow<string>('PROVIDER_SECRET_ACCESS_KEY');

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: this.configService.getOrThrow<string>('AWS_SESSION_TOKEN'),
            },
        });
    }

    async uploadFile(file: Express.Multer.File, pathPrefix: string): Promise<{ url: string, key: string }> {
        const fileExtension = file.originalname.split('.').pop();
        const key = `${pathPrefix}/${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        })

        try{
            await this.s3Client.send(command);
            //contruir a URL do arquivo
            const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
            return { url: fileUrl, key };
        } catch (error){
            console.error('Error uploading file to S3:', error);
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            throw new InternalServerErrorException('Error deleting file');
        }
    }

}
