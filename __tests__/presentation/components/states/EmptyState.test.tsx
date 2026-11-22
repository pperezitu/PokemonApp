import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { EmptyState } from '../../../../src/presentation/components/states/EmptyState';

describe('EmptyState', () => {
  it('renderiza el título', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <EmptyState title="No hay resultados" />,
      );
    });

    expect(
      renderer!.root.findAllByType(Text).map(node => node.props.children),
    ).toContain('No hay resultados');
  });

  it('renderiza el mensaje cuando se proporciona', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <EmptyState
          title="Sin Pokémon"
          message="Prueba con otro nombre"
        />,
      );
    });

    const texts = renderer!.root.findAllByType(Text);
    expect(texts.map(node => node.props.children)).toEqual([
      'Sin Pokémon',
      'Prueba con otro nombre',
    ]);
  });

  it.each([undefined, ''])(
    'no renderiza el mensaje cuando su valor es %p',
    async message => {
      let renderer: ReactTestRenderer.ReactTestRenderer;

      await ReactTestRenderer.act(() => {
        renderer = ReactTestRenderer.create(
          <EmptyState title="Lista vacía" message={message} />,
        );
      });

      expect(renderer!.root.findAllByType(Text)).toHaveLength(1);
    },
  );
});