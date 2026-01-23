/**
 * Logging port used by application code to emit structured messages.
 * Implementations adapt to the environment (console, file, structured logger).
 */
export interface ILogger {
  /** Log informational message. */
  info(message: string, ...meta: any[]): void;
  /** Log a warning message. */
  warn(message: string, ...meta: any[]): void;
  /** Log an error message. */
  error(message: string, ...meta: any[]): void;
}
