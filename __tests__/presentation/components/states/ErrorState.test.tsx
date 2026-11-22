import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { ErrorState } from '../../../../src/presentation/components/states/ErrorState';
import { AppError, AppErrorType } from '../../../../src/core/errors/AppError';

describe('ErrorState', () => {
  it('renderiza el título y el mensaje amigable del error', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    const error = new AppError(AppErrorType.Network, 'fetch failed');

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ErrorState error={error} onRetry={jest.fn()} />,
      );
    });

    expect(
      renderer!.root.findAllByType(Text).map(node => node.props.children),
    ).toEqual([
      'Algo salió mal',
      'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
      'Reintentar',
    ]);
  });

  it('muestra el mensaje genérico para errores desconocidos', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ErrorState error={new Error('boom')} onRetry={jest.fn()} />,
      );
    });

    expect(
      renderer!.root.findAllByType(Text).map(node => node.props.children),
    ).toContain('Ocurrió un error inesperado. Inténtalo de nuevo.');
  });

  it('invoca onRetry al presionar el botón de reintentar', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    const onRetry = jest.fn();

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <ErrorState error={new AppError(AppErrorType.Server, '500')} onRetry={onRetry} />,
      );
    });

    const button = renderer!.root
      .findAllByProps({ accessibilityLabel: 'Reintentar carga' })
      .find(node => typeof node.props.onPress === 'function');
    expect(button).toBeDefined();

    await ReactTestRenderer.act(() => {
      button!.props.onPress();
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
