import type { ILogger } from '../../application/ports/ILogger';

export const ConsoleLogger: ILogger = {
  info(message: string, ...meta: any[]) {
    // keep minimal and compatible with node execution
    // eslint-disable-next-line no-console
    console.info(message, ...meta);
  },
  warn(message: string, ...meta: any[]) {
    // eslint-disable-next-line no-console
    console.warn(message, ...meta);
  },
  error(message: string, ...meta: any[]) {
    // eslint-disable-next-line no-console
    console.error(message, ...meta);
  },
};
