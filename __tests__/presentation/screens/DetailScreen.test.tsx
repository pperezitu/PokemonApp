import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, Pressable, Text } from 'react-native';
import { PokemonDetail } from '../../../src/domain/entities/PokemonDetail';
import { PokemonStatName } from '../../../src/domain/entities/PokemonStat';
import { PokemonSummary } from '../../../src/domain/entities/PokemonSummary';
import { DetailSkeleton } from '../../../src/presentation/components/DetailSkeleton';
import { StatBar } from '../../../src/presentation/components/StatBar';
import { EmptyState } from '../../../src/presentation/components/states/EmptyState';
import { ErrorState } from '../../../src/presentation/components/states/ErrorState';
import { TypeBadge } from '../../../src/presentation/components/TypeBadge';
import { DetailScreen } from '../../../src/presentation/screens/DetailScreen';

let mockDetailState: {
  data: PokemonDetail | null;
  error: unknown;
  isLoading: boolean;
  reload: jest.Mock;
};
const mockGoBack = jest.fn();

jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn().mockImplementation(() => ({
      __mockAnimatedValue: true,
    })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    View: 'Animated.View',
  },
  Image: 'Image',
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  Text: 'Text',
  View: 'View',
}));

jest.mock('../../../src/presentation/hooks/usePokemonDetail', () => ({
  usePokemonDetail: () => mockDetailState,
}));

jest.mock('../../../src/presentation/navigation/NavigationProvider', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('../../../src/presentation/components/SafeScreen', () => ({
  SafeScreen: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../src/presentation/components/DetailSkeleton', () => ({
  DetailSkeleton: () => null,
}));

jest.mock('../../../src/presentation/components/states/EmptyState', () => ({
  EmptyState: () => null,
}));

jest.mock('../../../src/presentation/components/states/ErrorState', () => ({
  ErrorState: () => null,
}));

jest.mock('../../../src/presentation/components/TypeBadge', () => ({
  TypeBadge: () => null,
}));

jest.mock('../../../src/presentation/components/StatBar', () => ({
  StatBar: () => null,
}));

const pokemon: PokemonSummary = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'pikachu.png',
};

const detail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'pikachu.png',
  types: ['electric'],
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  stats: [
    { name: PokemonStatName.HP, value: 35 },
    { name: PokemonStatName.Attack, value: 55 },
  ],
  height: 40,
  weight: 6,
  baseExperience: 112,
};

describe('DetailScreen', () => {
  beforeEach(() => {
    mockGoBack.mockReset();
    mockDetailState = {
      data: null,
      error: null,
      isLoading: false,
      reload: jest.fn(),
    };
  });

  it('muestra los datos inmediatos de la ruta', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    const texts = renderer!.root.findAllByType(Text);
    const renderedText = texts.map(node => node.props.children);
    expect(renderedText).toContain('Pikachu');
    expect(renderedText).toContainEqual(['#', '025']);

    const image = renderer!.root.findByType(Image);
    expect(image.props.source).toEqual({ uri: 'pikachu.png' });
  });

  it('vuelve al listado al presionar el botón', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    await ReactTestRenderer.act(() => {
      renderer!.root
        .findByProps({ accessibilityLabel: 'Volver al listado' })
        .props.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('muestra el skeleton mientras carga', async () => {
    mockDetailState.isLoading = true;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    expect(renderer!.root.findAllByType(DetailSkeleton)).toHaveLength(1);
  });

  it('muestra el estado de error y permite reintentar', async () => {
    const error = new Error('No disponible');
    mockDetailState.error = error;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    const errorState = renderer!.root.findByType(ErrorState);
    expect(errorState.props.error).toBe(error);

    await ReactTestRenderer.act(() => {
      errorState.props.onRetry();
    });

    expect(mockDetailState.reload).toHaveBeenCalledTimes(1);
  });

  it('muestra tipos, información, habilidades y estadísticas', async () => {
    mockDetailState.data = detail;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    expect(renderer!.root.findAllByType(TypeBadge)).toHaveLength(1);
    expect(renderer!.root.findAllByType(StatBar)).toHaveLength(2);

    const texts = renderer!.root.findAllByType(Text);
    expect(texts.map(node => node.props.children)).toEqual(
      expect.arrayContaining([
        '40 cm',
        '6 kg',
        '112',
        'Habilidades',
        'Estadísticas base',
        'Static',
        'Lightning Rod',
        'Oculta',
      ]),
    );
  });

  it('muestra skeleton cuando no hay detalle aunque termine la carga', async () => {
    mockDetailState.data = null;
    mockDetailState.isLoading = false;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<DetailScreen pokemon={pokemon} />);
    });

    expect(renderer!.root.findAllByType(DetailSkeleton)).toHaveLength(1);
  });
});
