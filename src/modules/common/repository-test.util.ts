import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import dynamoose from 'dynamoose';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';

export async function startExternalDependencies(): Promise<StartedDockerComposeEnvironment> {
  const composeFile = '../../../test/docker-compose.yml';
  return new DockerComposeEnvironment(__dirname, composeFile).up();
}

export function initConnectionForLocalDynamoDB() {
  process.env.AWS_REGION = 'localhost';
  process.env.AWS_ACCESS_KEY_ID = 'localhost';
  process.env.AWS_SECRET_ACCESS_KEY = 'localhost';
  dynamoose.aws.ddb.local();
}

export async function createTestingModule(provider: Provider) {
  return Test.createTestingModule({
    providers: [
      provider,
      {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            if (key === 'DYNAMODB_TABLE_PREFIX') {
              return 'test-ohzig';
            }
            if (key === 'DYNAMODB_CREATE_DROP_TABLE') {
              return 'true';
            }
            return null;
          }),
        },
      },
    ],
  }).compile();
}

export async function createProvider(provider: Provider) {
  const module = await createTestingModule(provider);
  return module.get(provider as any);
}
