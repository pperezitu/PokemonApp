import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AppContainer } from '../../../src/app/container';
import { PokemonDetail } from '../../../src/domain/entities/PokemonDetail';
import { PokemonStatName } from '../../../src/domain/entities/PokemonStat';
import {
  usePokemonDetail,
} from '../../../src/presentation/hooks/usePokemonDetail';
import { UseAsyncResult } from '../../../src/presentation/hooks/useAsync';

const mockUseDependencies = jest.fn();

jest.mock('../../../src/app/DependencyProvider', () => ({
  useDependencies: () => mockUseDependencies(),
}));

interface ProbeProps {
  readonly id: number;
  readonly onResult: (result: UseAsyncResult<PokemonDetail>) => void;
}

const HookProbe = ({ id, onResult }: ProbeProps) => {
  const result = usePokemonDetail(id);
  onResult(result);
  return null;
};

const detail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'pikachu.png',
  types: ['electric'],
  abilities: [{ name: 'static', isHidden: false }],
  stats: [{ name: PokemonStatName.HP, value: 35 }],
  height: 40,
  weight: 6,
  baseExperience: 112,
};

const deferred = <TData,>() => {
  let resolve!: (value: TData) => void;
  const promise = new Promise<TData>(promiseResolve => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
};

describe('usePokemonDetail', () => {
  const execute = jest.fn();

  beforeEach(() => {
    execute.mockReset();
    mockUseDependencies.mockReset();
    mockUseDependencies.mockReturnValue({
      getPokemonDetail: { execute },
    } as unknown as AppContainer);
  });

  it('solicita el detalle con el ID recibido', async () => {
    const request = deferred<PokemonDetail>();
    execute.mockReturnValue(request.promise);
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe, { id: 25, onResult }),
      );
      await Promise.resolve();
    });

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(25);
    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('propaga el detalle obtenido por useAsync', async () => {
    const request = deferred<PokemonDetail>();
    execute.mockReturnValue(request.promise);
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe, { id: 25, onResult }),
      );
    });

    await ReactTestRenderer.act(async () => {
      request.resolve(detail);
      await request.promise;
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: detail,
        error: null,
        isLoading: false,
      }),
    );
    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('solicita nuevamente el detalle al cambiar el ID', async () => {
    const firstRequest = deferred<PokemonDetail>();
    const secondRequest = deferred<PokemonDetail>();
    execute
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe, { id: 25, onResult }),
      );
    });

    await ReactTestRenderer.act(async () => {
      firstRequest.resolve({ ...detail, id: 25 });
      await firstRequest.promise;
    });

    await ReactTestRenderer.act(() => {
      renderer!.update(
        React.createElement(HookProbe, { id: 26, onResult }),
      );
    });

    expect(execute).toHaveBeenCalledTimes(2);
    expect(execute).toHaveBeenNthCalledWith(1, 25);
    expect(execute).toHaveBeenNthCalledWith(2, 26);

    await ReactTestRenderer.act(async () => {
      secondRequest.resolve({ ...detail, id: 26 });
      await secondRequest.promise;
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ id: 26 }),
        isLoading: false,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('vuelve a ejecutar el caso de uso al llamar reload', async () => {
    const firstRequest = deferred<PokemonDetail>();
    const secondRequest = deferred<PokemonDetail>();
    execute
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe, { id: 25, onResult }),
      );
    });

    await ReactTestRenderer.act(async () => {
      firstRequest.resolve(detail);
      await firstRequest.promise;
    });

    await ReactTestRenderer.act(() => {
      const latestResult = onResult.mock.calls.at(-1)?.[0] as
        UseAsyncResult<PokemonDetail>;
      latestResult.reload();
    });

    await ReactTestRenderer.act(async () => {
      secondRequest.resolve(detail);
      await secondRequest.promise;
    });

    expect(execute).toHaveBeenCalledTimes(2);
    expect(execute).toHaveBeenLastCalledWith(25);

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });
});