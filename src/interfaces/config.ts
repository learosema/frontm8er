export const config = {
  env: process.env.NODE_ENV || 'development',
  logLevel: (process.env.LOG_LEVEL as string) || 'info',
};
