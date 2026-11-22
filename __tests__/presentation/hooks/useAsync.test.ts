import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useAsync, UseAsyncResult } from '../../../src/presentation/hooks/useAsync';

interface ProbeProps<TData> {
  readonly asyncFn: () => Promise<TData>;
  readonly onResult: (result: UseAsyncResult<TData>) => void;
}

const HookProbe = <TData,>({
  asyncFn,
  onResult,
}: ProbeProps<TData>) => {
  const result = useAsync(asyncFn);
  onResult(result);
  return null;
};

const deferred = <TData,>() => {
  let resolve!: (value: TData) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<TData>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, resolve, reject };
};

describe('useAsync', () => {
  it('inicia en estado de carga', async () => {
    const request = deferred<string>();
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe<string>, {
          asyncFn: () => request.promise,
          onResult,
        }),
      );
    });

    expect(onResult).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
        error: null,
        isLoading: true,
        reload: expect.any(Function),
      }),
    );
  });

  it('guarda los datos y termina la carga al resolver', async () => {
    const request = deferred<string>();
    const onResult = jest.fn();

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        React.createElement(HookProbe<string>, {
          asyncFn: () => request.promise,
          onResult,
        }),
      );
    });

    await ReactTestRenderer.act(async () => {
      request.resolve('Pikachu');
      await request.promise;
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: 'Pikachu',
        error: null,
        isLoading: false,
      }),
    );
  });

  it('guarda el error y termina la carga al rechazar', async () => {
    const request = deferred<string>();
    const onResult = jest.fn();
    const error = new Error('Falló la petición');

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        React.createElement(HookProbe<string>, {
          asyncFn: () => request.promise,
          onResult,
        }),
      );
    });

    await ReactTestRenderer.act(async () => {
      request.reject(error);
      await request.promise.catch(() => undefined);
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: null,
        error,
        isLoading: false,
      }),
    );
  });

  it('vuelve a ejecutar la función al llamar reload', async () => {
    const firstRequest = deferred<string>();
    const secondRequest = deferred<string>();
    const asyncFn = jest
      .fn<Promise<string>, []>()
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(secondRequest.promise);
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe<string>, {
          asyncFn,
          onResult,
        }),
      );
    });

    await ReactTestRenderer.act(async () => {
      firstRequest.resolve('Primera');
      await firstRequest.promise;
    });

    await ReactTestRenderer.act(() => {
      const latestResult = onResult.mock.calls.at(-1)?.[0] as
        UseAsyncResult<string>;
      latestResult.reload();
    });

    expect(asyncFn).toHaveBeenCalledTimes(2);
    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: 'Primera',
        isLoading: true,
        error: null,
      }),
    );

    await ReactTestRenderer.act(async () => {
      secondRequest.resolve('Segunda');
      await secondRequest.promise;
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: 'Segunda',
        isLoading: false,
        error: null,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('ignora el resultado de una petición reemplazada', async () => {
    const firstRequest = deferred<string>();
    const secondRequest = deferred<string>();
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(HookProbe<string>, {
          asyncFn: () => firstRequest.promise,
          onResult,
        }),
      );
    });

    await ReactTestRenderer.act(() => {
      renderer!.update(
        React.createElement(HookProbe<string>, {
          asyncFn: () => secondRequest.promise,
          onResult,
        }),
      );
    });

    await ReactTestRenderer.act(async () => {
      secondRequest.resolve('Más reciente');
      await secondRequest.promise;
    });

    await ReactTestRenderer.act(async () => {
      firstRequest.resolve('Petición antigua');
      await firstRequest.promise;
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: 'Más reciente',
        isLoading: false,
        error: null,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });
});