import { AppErrorType, isAppError } from './AppError';

const FRIENDLY_MESSAGES: Record<AppErrorType, string> = {
  [AppErrorType.Network]: 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
  [AppErrorType.Timeout]: 'La conexión tardó demasiado. Inténtalo de nuevo.',
  [AppErrorType.NotFound]: 'No encontramos ese Pokémon.',
  [AppErrorType.Server]: 'PokéAPI no responde correctamente. Inténtalo más tarde.',
  [AppErrorType.Storage]: 'No pudimos guardar la información localmente.',
  [AppErrorType.Unknown]: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
};

export const getFriendlyMessage = (error: unknown): string =>
  isAppError(error) ? FRIENDLY_MESSAGES[error.type] : FRIENDLY_MESSAGES[AppErrorType.Unknown];