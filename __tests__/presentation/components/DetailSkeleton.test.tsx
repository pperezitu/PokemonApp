import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { View } from 'react-native';
import { DetailSkeleton } from '../../../src/presentation/components/DetailSkeleton';
import { Skeleton } from '../../../src/presentation/components/Skeleton';

jest.mock('../../../src/presentation/components/Skeleton', () => {
  const React = require('react');
  const { View: MockView } = require('react-native');

  return {
    Skeleton: (props: Record<string, unknown>) =>
      React.createElement(MockView, props),
  };
});

describe('DetailSkeleton', () => {
  it('muestra el contenedor con su etiqueta de carga', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailSkeleton />);
    });

    const containers = renderer!.root.findAllByType(View);
    expect(
      containers.some(
        node =>
          node.props.accessibilityLabel ===
          'Cargando información del Pokémon',
      ),
    ).toBe(true);
  });

  it('renderiza dos placeholders de tipos y tres de información', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailSkeleton />);
    });

    const skeletons = renderer!.root.findAllByType(Skeleton);
    const typeSkeletons = skeletons.filter(
      skeleton =>
        skeleton.props.width === 84 &&
        skeleton.props.height === 30 &&
        skeleton.props.borderRadius === 12,
    );
    const infoSkeletons = skeletons.filter(
      skeleton =>
        skeleton.props.width === '31%' &&
        skeleton.props.height === 60 &&
        skeleton.props.borderRadius === 12,
    );

    expect(typeSkeletons).toHaveLength(2);
    expect(infoSkeletons).toHaveLength(3);
  });

  it('renderiza las secciones y las seis líneas de estadísticas', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailSkeleton />);
    });

    const skeletons = renderer!.root.findAllByType(Skeleton);

    expect(
      skeletons.filter(
        skeleton =>
          skeleton.props.width === 120 &&
          skeleton.props.height === 20,
      ),
    ).toHaveLength(1);
    expect(
      skeletons.filter(
        skeleton =>
          skeleton.props.width === 160 &&
          skeleton.props.height === 20,
      ),
    ).toHaveLength(1);
    expect(
      skeletons.filter(
        skeleton =>
          skeleton.props.width === '100%' &&
          skeleton.props.height === 14,
      ),
    ).toHaveLength(6);
  });

  it('renderiza un total de quince placeholders', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailSkeleton />);
    });

    expect(renderer!.root.findAllByType(Skeleton)).toHaveLength(15);
  });
});