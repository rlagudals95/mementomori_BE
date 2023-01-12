import axios, { Method } from 'axios';
import { backOff } from 'exponential-backoff';

export interface RetryOptions {
  minDelay: number;
  maxDelay: number;
  retryAttemptCount: number;
  retryCallback: (e: any, retryCount: number) => Promise<boolean> | boolean;
}

function isNetworkError(error) {
  return (
    !error.response &&
    Boolean(error.code) && // Prevents retrying cancelled requests
    error.code !== 'ECONNABORTED'
  ); // Prevents retrying timed out requests
  // (0, _isRetryAllowed.default)(error); // Prevents retrying unsafe errors
}

function isRetryableError(error) {
  return (
    error.code !== 'ECONNABORTED' &&
    (!error.response ||
      (error.response.status >= 500 && error.response.status <= 599))
  );
}

function canRetry(e: any) {
  return isNetworkError(e) || isRetryableError(e);
}

function parseEnvAsInt(envVar: string, defaultValue: number): number {
  return envVar ? parseInt(envVar) : defaultValue;
}

function defaultOptions(): RetryOptions {
  return {
    minDelay: parseEnvAsInt(process.env.REST_CLIENT_RETRY_MIN_DELAY, 1000),
    maxDelay: parseEnvAsInt(process.env.REST_CLIENT_RETRY_MAX_DELAY, 16000),
    retryAttemptCount: parseEnvAsInt(
      process.env.REST_CLIENT_RETRY_ATTEMPT_COUNT,
      5,
    ),
    retryCallback: canRetry,
  };
}

export default function retryIf<T>(
  method: Method,
  url: string,
  data?: Record<string, any>,
  options?: RetryOptions,
): Promise<T> {
  const retryOptions: RetryOptions = {
    ...defaultOptions(),
    ...options,
  };
  return backOff(
    async () => {
      try {
        const result = await axios({
          method,
          url,
          data,
        });

        return result.data;
      } catch (e) {
        throw new Error(
          `Request failed after ${
            retryOptions.retryAttemptCount
          } trials. url: ${url}, body: ${JSON.stringify(data)}`,
        );
      }
    },
    {
      numOfAttempts: retryOptions.retryAttemptCount,
      startingDelay: retryOptions.minDelay,
      maxDelay: retryOptions.maxDelay,
      retry: retryOptions.retryCallback,
    },
  );
}
