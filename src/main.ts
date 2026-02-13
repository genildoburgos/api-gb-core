import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('api-gb-core')
    .setDescription('My personal API with NestJs And AWS')
    .setVersion('1.0')
    .setContact(
      'Genildo Burgos',
      'https://github.com/genildoburgos',
      'gnldburgos@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('tags')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

void bootstrap();
