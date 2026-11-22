import {
  AppError,
  AppErrorType,
  isAppError,
} from '../../../src/core/errors/AppError';

describe('AppError', () => {
  it('creates an error with type and message', () => {
    const error = new AppError(
      AppErrorType.Network,
      'No fue posible conectarse',
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('No fue posible conectarse');
    expect(error.type).toBe(AppErrorType.Network);
  });

  it('preserves the original error', () => {
    const originalError = new Error('Network request failed');

    const error = new AppError(
      AppErrorType.Network,
      'No fue posible conectarse',
      originalError,
    );

    expect(error.originalError).toBe(originalError);
  });

  it('allows creating an error without an original error', () => {
    const error = new AppError(
      AppErrorType.Unknown,
      'Error desconocido',
    );

    expect(error.originalError).toBeUndefined();
  });
});

describe('isAppError', () => {
  it('returns true for an AppError', () => {
    const error = new AppError(
      AppErrorType.NotFound,
      'Recurso no encontrado',
    );

    expect(isAppError(error)).toBe(true);
  });

  it('returns false for regular values', () => {
    expect(isAppError(new Error('Error común'))).toBe(false);
    expect(isAppError('error')).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});