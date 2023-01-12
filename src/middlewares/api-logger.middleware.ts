import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { toBoolean } from '@utils/cast.util';
import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import sizeof from 'object-sizeof';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  public use(req: Request, res: Response, next: NextFunction) {
    if (!toBoolean(this.configService.get('API_LOGGING'))) {
      next();
      return;
    }

    const date = new Date();
    res.on('finish', () => {
      try {
        const log = {
          logCreated: new Date().toISOString(),
          serverIP: getServerIP(req),
          clientIP: getClientIP(req),
          duration: new Date().getTime() - date.getTime(),
          request: getRequest(req),
          response: getResponse(res),
        };

        this.logger.info(`${req.method} ${req.path}`, log);
      } catch (error) {
        this.logger.error('ApiLoggerMiddleware :: Failed to log', error);
      }
    });

    next();
  }
}

function getServerIP(req: http.IncomingMessage): string {
  const ip = req.socket.localAddress || req?.connection.localAddress || '';

  if (ip.includes('::ffff:')) {
    return ip.split(':').reverse()[0];
  }

  return ip;
}

function getClientIP(req: http.IncomingMessage): string {
  const xForwardedFor = (
    (req.headers['x-forwarded-for'] as string) || ''
  ).replace(/:\d+$/, '');
  const ip =
    xForwardedFor || req.socket.remoteAddress || req?.connection.remoteAddress;

  if (ip.includes('::ffff:')) {
    return ip.split(':').reverse()[0];
  }

  return ip;
}

function getRequest(req: Request) {
  const httpVersion = `HTTP/${req.httpVersion}`;
  const bodySize = sizeof(req.body);
  const MAX_BODY_SIZE = 500;
  return {
    httpVersion,
    method: req.method,
    url: req.path,
    headers: req.headers,
    queryString: req.query,
    postData: truncate(req.body, bodySize, MAX_BODY_SIZE),
    headersSize: sizeof(req.headers),
    bodySize: bodySize,
  };
}

function truncate(
  postData: Record<string, unknown>,
  bodySize: number,
  maxSize: number,
): string {
  const bodyData = JSON.stringify(postData);
  if (bodySize <= maxSize) {
    return bodyData;
  }
  return bodyData.substring(0, maxSize) + '...';
}

function getResponse(res: Response) {
  const httpVersion = `HTTP/${res.req.httpVersion}`;

  return {
    status: res.statusCode,
    statusText: res.statusMessage,
    httpVersion,
    headers: res.getHeaders(),
    headersSize: sizeof(res.getHeaders()),
  };
}
