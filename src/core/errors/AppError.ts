export enum AppErrorType {
  Network = 'NETWORK',
  Timeout = 'TIMEOUT',
  NotFound = 'NOT_FOUND',
  Server = 'SERVER',
  Storage = 'STORAGE',
  Unknown = 'UNKNOWN',
}

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly originalError?: unknown;

  constructor(type: AppErrorType, message: string, originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;