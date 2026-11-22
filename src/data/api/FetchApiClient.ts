import { AppError, AppErrorType } from '../../core/errors/AppError';
import { ApiRequestOptions, IApiClient } from '../../domain/ports/IApiClient';
import { API_BASE_URL } from './endpoints';

const DEFAULT_TIMEOUT_MS = 10_000;

const isAbortError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name: unknown }).name === 'AbortError';

export class FetchApiClient implements IApiClient {
  constructor(private readonly timeoutMs: number = DEFAULT_TIMEOUT_MS) {}

  async get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
    const onExternalAbort = () => controller.abort();
    options?.signal?.addEventListener('abort', onExternalAbort);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const type = response.status === 404 ? AppErrorType.NotFound : AppErrorType.Server;
        throw new AppError(type, `PokéAPI respondió ${response.status} en ${path}`, response);
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      throw this.normalizeError(error, options?.signal);
    } finally {
      clearTimeout(timeoutId);
      options?.signal?.removeEventListener('abort', onExternalAbort);
    }
  }

  private normalizeError(error: unknown, externalSignal?: AbortSignal): AppError {
    if (error instanceof AppError) {
      return error;
    }
    if (isAbortError(error)) {
      return externalSignal?.aborted
        ? new AppError(AppErrorType.Network, 'Petición cancelada', error)
        : new AppError(AppErrorType.Timeout, `Timeout tras ${this.timeoutMs}ms`, error);
    }
    return new AppError(AppErrorType.Network, 'Fallo de red al contactar PokéAPI', error);
  }
}