import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text, View } from 'react-native';
import { TypeBadge } from '../../../src/presentation/components/TypeBadge';
import { colors, TYPE_COLORS } from '../../../src/presentation/theme/tokens';

describe('TypeBadge', () => {
  it('muestra el tipo con la primera letra en mayúscula', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<TypeBadge type="electric" />);
    });

    const text = renderer!.root.findByType(Text);
    expect(text.props.children).toBe('Electric');
  });

  it('expone la etiqueta de accesibilidad capitalizada', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<TypeBadge type="grass" />);
    });

    const badge = renderer!.root.findByProps({
      accessibilityLabel: 'Tipo Grass',
    });
    expect(badge.props.accessibilityLabel).toBe('Tipo Grass');
  });

  it('usa el color asociado al tipo conocido', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<TypeBadge type="fire" />);
    });

    const badge = renderer!.root.findByProps({
      accessibilityLabel: 'Tipo Fire',
    });
    expect(badge.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: TYPE_COLORS.fire,
        }),
      ]),
    );
  });

  it('usa el color secundario como fallback para tipos desconocidos', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<TypeBadge type="unknown" />);
    });

    const badge = renderer!.root.findAllByType(View).find(
      node => node.props.accessibilityLabel === 'Tipo Unknown',
    );
    expect(badge?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: colors.textSecondary,
        }),
      ]),
    );
  });
});