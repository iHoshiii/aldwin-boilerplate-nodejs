import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (name: string, defaultValue = ''): string => {
  return process.env[name] || defaultValue;
};

export interface AppConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  database: {
    url: string;
  };
  security: {
    rateLimitWindowMs: number;
    rateLimitMax: number;
  };
  cors: {
    origin: string;
  };
}

const nodeEnv = getEnv('NODE_ENV', 'development');

const config: AppConfig = {
  port: parseInt(getEnv('PORT', '8081'), 10),
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  database: {
    url: getEnv('DATABASE_URL'),
  },
  security: {
    rateLimitWindowMs: 15 * 60 * 1000,
    rateLimitMax: 100,
  },
  cors: {
    origin: getEnv('CORS_ORIGIN', '*'),
  },
};

export default config;
