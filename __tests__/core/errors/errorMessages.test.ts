import { AppError, AppErrorType } from '../../../src/core/errors/AppError';
import { getFriendlyMessage } from '../../../src/core/errors/errorMessages';

describe('getFriendlyMessage', () => {
  it.each([
    [
      AppErrorType.Network,
      'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
    ],
    [
      AppErrorType.Timeout,
      'La conexión tardó demasiado. Inténtalo de nuevo.',
    ],
    [AppErrorType.NotFound, 'No encontramos ese Pokémon.'],
    [
      AppErrorType.Server,
      'PokéAPI no responde correctamente. Inténtalo más tarde.',
    ],
    [
      AppErrorType.Storage,
      'No pudimos guardar la información localmente.',
    ],
    [
      AppErrorType.Unknown,
      'Ocurrió un error inesperado. Inténtalo de nuevo.',
    ],
  ])('returns the friendly message for %s', (type, expectedMessage) => {
    const error = new AppError(type, 'Technical error');

    expect(getFriendlyMessage(error)).toBe(expectedMessage);
  });

  it.each([
    new Error('Error común'),
    'error',
    null,
    undefined,
  ])('returns the unknown friendly message for %p', error => {
    expect(getFriendlyMessage(error)).toBe(
      'Ocurrió un error inesperado. Inténtalo de nuevo.',
    );
  });
});