import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';
import { loadCredential } from './utils/aws.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import './logging/tracer';
import cookieParser from 'cookie-parser';
import { authSecretConfig } from './config/configuration';

async function bootstrap() {
  await loadCredential();
  const conf = await authSecretConfig();
  process.env.JWT_SECRET = conf.AUTH_SECRET;

  const app = await NestFactory.create(AppModule, {});
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.use(compression());
  app.setGlobalPrefix('ohzig', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());

  app.enableCors({
    origin: [
      /http:\/\/localhost:[0-9]*/,
      configService.get('FRONTEND_SITE_URL'),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  if (configService.get('swagger.enabled')) {
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(configService.get('port'));
  app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
  console.log(`Application is running on: ${await app.getUrl()}`);

  const signals = {
    SIGINT: 2,
    SIGTERM: 15,
  };
  Object.keys(signals).forEach(function (signal) {
    process.on(signal, function () {
      console.log('Application stopped by ' + signal);
    });
  });
}
bootstrap();
