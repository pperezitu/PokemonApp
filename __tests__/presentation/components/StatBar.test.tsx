import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Animated, Text, View } from 'react-native';
import { StatBar } from '../../../src/presentation/components/StatBar';

describe('StatBar', () => {
  let timingSpy: jest.SpyInstance;
  let startMock: jest.Mock;

  beforeEach(() => {
    startMock = jest.fn();
    timingSpy = jest
      .spyOn(Animated, 'timing')
      .mockImplementation(() => ({ start: startMock }) as never);
  });

  afterEach(() => {
    timingSpy.mockRestore();
  });

  it('renderiza la etiqueta, el valor y la etiqueta de accesibilidad por defecto', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <StatBar label="Ataque" value={127} />,
      );
    });

    const container = renderer!.root.findAllByType(View).find(
      node => node.props.accessibilityLabel === 'Ataque: 127 de 255',
    );
    const texts = renderer!.root.findAllByType(Text);

    expect(container).toBeDefined();
    expect(texts.map(node => node.props.children)).toEqual(
      expect.arrayContaining(['Ataque', 127]),
    );
  });

  it('usa el valor máximo personalizado en la accesibilidad', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <StatBar label="Velocidad" value={75} maxValue={100} />,
      );
    });

    expect(
      renderer!.root.findAllByType(View).some(
        node =>
          node.props.accessibilityLabel === 'Velocidad: 75 de 100',
      ),
    ).toBe(true);
  });

  it('anima el progreso según el máximo por defecto', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<StatBar label="Defensa" value={127} />);
    });

    expect(timingSpy).toHaveBeenCalledWith(
      expect.any(Animated.Value),
      expect.objectContaining({
        toValue: 127 / 255,
        duration: 600,
        useNativeDriver: true,
      }),
    );
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it('limita el progreso a uno cuando el valor supera el máximo', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <StatBar label="Ataque" value={300} maxValue={200} />,
      );
    });

    expect(timingSpy).toHaveBeenCalledWith(
      expect.any(Animated.Value),
      expect.objectContaining({
        toValue: 1,
      }),
    );
  });

  it('recalcula la animación al cambiar el valor o el máximo', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <StatBar label="HP" value={50} maxValue={200} />,
      );
    });

    await ReactTestRenderer.act(() => {
      renderer!.update(
        <StatBar label="HP" value={150} maxValue={200} />,
      );
    });

    expect(timingSpy).toHaveBeenLastCalledWith(
      expect.any(Animated.Value),
      expect.objectContaining({
        toValue: 0.75,
      }),
    );
  });
});