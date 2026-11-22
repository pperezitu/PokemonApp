import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, Text, View } from 'react-native';
import { PokemonCard } from '../../../src/presentation/components/PokemonCard';

describe('PokemonCard', () => {
  const pokemon = {
    id: 25,
    name: 'pikachu',
    imageUrl: 'https://example.com/pikachu.png',
  };

  it('renderiza el Pokémon y su etiqueta de accesibilidad', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PokemonCard pokemon={pokemon} onPress={jest.fn()} />,
      );
    });

    const pressable = renderer!.root.findByProps({
      accessibilityRole: 'button',
    });
    const image = renderer!.root.findByType(Image);
    const texts = renderer!.root.findAllByType(Text);

    expect(pressable.props.accessibilityRole).toBe('button');
    expect(pressable.props.accessibilityLabel).toBe(
      'Ver detalle de pikachu',
    );
    expect(image.props.source).toEqual({
      uri: 'https://example.com/pikachu.png',
    });
    expect(image.props.accessibilityLabel).toBe('Imagen de pikachu');
    expect(
      texts.map(text =>
        Array.isArray(text.props.children)
          ? text.props.children.join('')
          : text.props.children,
      ),
    ).toEqual(expect.arrayContaining(['#025', 'Pikachu']));
  });

  it('llama a onPress con el Pokémon seleccionado', async () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PokemonCard pokemon={pokemon} onPress={onPress} />,
      );
    });

    await ReactTestRenderer.act(() => {
      renderer!.root
        .findByProps({ accessibilityRole: 'button' })
        .props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(pokemon);
  });

  it('muestra el fallback cuando falla la carga de la imagen', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PokemonCard pokemon={pokemon} onPress={jest.fn()} />,
      );
    });

    await ReactTestRenderer.act(() => {
      renderer!.root.findByType(Image).props.onError();
    });

    const fallback = renderer!.root.findAllByType(View).find(
      view => view.props.accessibilityLabel === 'Imagen no disponible',
    );

    expect(fallback).toBeDefined();
    expect(renderer!.root.findAllByType(Image)).toHaveLength(0);
    expect(renderer!.root.findAllByType(Text).some(
      text => text.props.children === '?',
    )).toBe(true);
  });
});