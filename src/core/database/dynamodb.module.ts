import { Module } from '@nestjs/common';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  providers: [
    {
      provide: 'DYNAMO_CLIENT',
      useFactory: () => {
        // 1. Verificando se as variáveis de ambiente essenciais existem
        const accessKeyId = process.env.PROVIDER_ACCESS_KEY_ID;
        const secretAccessKey = process.env.PROVIDER_SECRET_ACCESS_KEY;
        const sessionToken = process.env.AWS_SESSION_TOKEN;
        const region = process.env.AWS_REGION;

        if (!accessKeyId || !secretAccessKey || !region) {
          throw new Error(
            'Variáveis de ambiente AWS não estão definidas corretamente.',
          );
        }

        // 2. Crie o objeto de configuração, passando as credenciais manualmente
        const config: DynamoDBClientConfig = {
          region: region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
          },
        };

        const client = new DynamoDBClient(config);
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: ['DYNAMO_CLIENT'],
})
export class DynamoDBModule {}
