import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { loadSecret } from '../utils/secret.util';
import * as dotenv from 'dotenv';
import { toBoolean } from '@utils/cast.util';

export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10),
  swagger: {
    enabled: toBoolean(process.env.ENABLE_SWAGGER),
  },
});

let authSecretCache;
export async function authSecretConfig() {
  if (!authSecretCache) {
    const secret = await loadSecret(process.env.JWT_SECRET_NAME);
    authSecretCache = dotenv.parse(secret);
  }
  return authSecretCache;
}

export async function socialLoginConfig() {
  const socialLoginSecret = await loadSecret(
    process.env.SOCIAL_LOGIN_SECRET_NAME,
  );
  return dotenv.parse(socialLoginSecret);
}

export function configOptions(): ConfigModuleOptions {
  const appEnvPath = generateEnvFilePath(process.env.NODE_ENV);

  return {
    isGlobal: true,
    cache: true,
    envFilePath: [appEnvPath],
    load: [appConfig, authSecretConfig, socialLoginConfig],
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
      ENABLE_SWAGGER: Joi.boolean().required(),
      DYNAMODB_TABLE_PREFIX: Joi.string().required(),
      DYNAMODB_CREATE_DROP_TABLE: Joi.boolean().default(false),
      JWT_EXPIRATION_TIME: Joi.string().required(),
      REDIS_HOST: Joi.string().default('127.0.0.1'),
      REDIS_PORT: Joi.number().default(6379),
    }),
  };
}

/**
 * 배포 환경별로 달라지는 동작을 다루기 위해 사용되는 if문을 막기 위해서
 * 설정을 통해서 환경별 동작을 제어하도록 하고
 * NODE_ENV 환경변수는 설정파일(.env)을 결정하기 위한 용도로 이 함수 안에서만 사용합니다.
 */
function validateNodeEnv(NODE_ENV: string) {
  if (!['local', 'development', 'production'].includes(NODE_ENV)) {
    throw new Error(`Not allowed value for NODE_ENV: '${NODE_ENV}'`);
  }
}

function getEnvDirectory(NODE_ENV: string): string {
  validateNodeEnv(NODE_ENV);
  return NODE_ENV == 'production'
    ? `${process.cwd()}/env`
    : `${process.cwd()}/src/config/env`;
}

export function generateEnvFilePath(
  nodeEnv: string,
  fileNamePostfix?: string,
): string {
  const envDir = getEnvDirectory(nodeEnv);
  return fileNamePostfix
    ? `${envDir}/${nodeEnv}-${fileNamePostfix}.env`
    : `${envDir}/${nodeEnv}.env`;
}
