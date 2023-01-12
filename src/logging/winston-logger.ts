import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { toBoolean } from '@utils/cast.util';

export function loggerOptions(): winston.LoggerOptions {
  return {
    transports: [consoleFormatter()],
  };
}

function consoleFormatter() {
  const timeFormat = winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  });
  const options: ConsoleTransportOptions = {
    level: 'info',
    format: timeFormat,
  };

  const logFormat = nestWinstonModuleUtilities.format.nestLike('App', {
    colors: true,
    prettyPrint: true,
  });

  if (toBoolean(process.env.CONSOLE_LOGGING)) {
    options.format = winston.format.combine(timeFormat, logFormat);
  }

  return new winston.transports.Console(options);
}
