import { FetchApiClient } from '../../../src/data/api/FetchApiClient';
import { AppErrorType } from '../../../src/core/errors/AppError';

describe('FetchApiClient', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('detecta una respuesta exitosa', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ name: 'pikachu' }),
    });

    const client = new FetchApiClient();
    const result = await client.get<{ name: string }>('/pokemon/pikachu');

    expect(result).toEqual({ name: 'pikachu' });
  });

  it('clasifica AbortError como timeout', async () => {
    const abortError = Object.assign(new Error('Aborted'), {
      name: 'AbortError',
    });

    fetchMock.mockRejectedValue(abortError);

    const client = new FetchApiClient(500);

    await expect(client.get('/pokemon/pikachu')).rejects.toMatchObject({
      type: AppErrorType.Timeout,
      message: 'Timeout tras 500ms',
      originalError: abortError,
    });
  });

  it('clasifica una cancelación externa como network', async () => {
    const abortError = Object.assign(new Error('Aborted'), {
      name: 'AbortError',
    });

    fetchMock.mockRejectedValue(abortError);

    const externalController = new AbortController();
    externalController.abort();

    const client = new FetchApiClient();

    await expect(
      client.get('/pokemon/pikachu', {
        signal: externalController.signal,
      }),
    ).rejects.toMatchObject({
      type: AppErrorType.Network,
      message: 'Petición cancelada',
      originalError: abortError,
    });
  });

  it('clasifica un error de red como network', async () => {
    const networkError = new Error('No internet');

    fetchMock.mockRejectedValue(networkError);

    const client = new FetchApiClient();

    await expect(client.get('/pokemon/pikachu')).rejects.toMatchObject({
      type: AppErrorType.Network,
      message: 'Fallo de red al contactar PokéAPI',
      originalError: networkError,
    });
  });
});