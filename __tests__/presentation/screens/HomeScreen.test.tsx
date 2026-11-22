import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { FlatList, Text } from 'react-native';
import { PokemonSummary } from '../../../src/domain/entities/PokemonSummary';
import { PokemonCard } from '../../../src/presentation/components/PokemonCard';
import { PokemonCardSkeleton } from '../../../src/presentation/components/PokemonCardSkeleton';
import { EmptyState } from '../../../src/presentation/components/states/EmptyState';
import { ErrorState } from '../../../src/presentation/components/states/ErrorState';
import { HomeScreen } from '../../../src/presentation/screens/HomeScreen';
import { detailRoute } from '../../../src/presentation/navigation/routes';

let mockWidth = 400;
let mockPokemonListState: {
  data: PokemonSummary[] | null;
  error: unknown;
  isLoading: boolean;
  reload: jest.Mock;
};
const mockNavigate = jest.fn();

jest.mock('react-native', () => {
  return {
    FlatList: 'FlatList',
    Text: 'Text',
    View: 'View',
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
    },
    useWindowDimensions: () => ({ width: mockWidth }),
  };
});

jest.mock('../../../src/presentation/hooks/usePokemonList', () => ({
  usePokemonList: () => mockPokemonListState,
}));

jest.mock('../../../src/presentation/navigation/NavigationProvider', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../src/presentation/components/PokemonCard', () => ({
  PokemonCard: () => null,
}));

jest.mock('../../../src/presentation/components/PokemonCardSkeleton', () => ({
  PokemonCardSkeleton: () => null,
}));

jest.mock('../../../src/presentation/components/SafeScreen', () => ({
  SafeScreen: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../src/presentation/components/states/EmptyState', () => ({
  EmptyState: () => null,
}));

jest.mock('../../../src/presentation/components/states/ErrorState', () => ({
  ErrorState: () => null,
}));

const pikachu: PokemonSummary = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'pikachu.png',
};

describe('HomeScreen', () => {
  beforeEach(() => {
    mockWidth = 400;
    mockNavigate.mockReset();
    mockPokemonListState = {
      data: null,
      error: null,
      isLoading: false,
      reload: jest.fn(),
    };
  });

  it('muestra el encabezado de la Pokédex', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    const texts = renderer!.root.findAllByType(Text);
    expect(texts.map(node => node.props.children)).toEqual(
      expect.arrayContaining([
        'Pokédex',
        'Los primeros 20 Pokémon',
      ]),
    );
  });

  it('muestra ocho skeletons mientras carga', async () => {
    mockPokemonListState.isLoading = true;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    const list = renderer!.root.findByType(FlatList);
    expect(list.props.numColumns).toBe(2);
    expect(list.props.data).toHaveLength(8);
    expect(list.props.scrollEnabled).toBe(false);

    const skeleton = list.props.renderItem();
    expect(skeleton.type).toBe(PokemonCardSkeleton);
  });

  it('muestra el estado de error y ejecuta reload', async () => {
    const error = new Error('Falló la carga');
    mockPokemonListState.error = error;
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    const errorState = renderer!.root.findByType(ErrorState);
    expect(errorState.props.error).toBe(error);

    await ReactTestRenderer.act(() => {
      errorState.props.onRetry();
    });

    expect(mockPokemonListState.reload).toHaveBeenCalledTimes(1);
  });

  it('muestra EmptyState cuando no hay datos', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    const emptyState = renderer!.root.findByType(EmptyState);
    expect(emptyState.props.title).toBe('Sin Pokémon');
    expect(emptyState.props.message).toBe(
      'No se encontraron resultados en PokéAPI.',
    );
  });

  it('renderiza la lista y navega al seleccionar un Pokémon', async () => {
    mockPokemonListState.data = [pikachu];
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    const list = renderer!.root.findByType(FlatList);
    expect(list.props.data).toEqual([pikachu]);
    expect(list.props.numColumns).toBe(2);
    expect(list.props.initialNumToRender).toBe(10);
    expect(list.props.maxToRenderPerBatch).toBe(10);

    const card = list.props.renderItem({ item: pikachu });
    expect(card.type).toBe(PokemonCard);
    expect(card.props.pokemon).toBe(pikachu);

    await ReactTestRenderer.act(() => {
      card.props.onPress(pikachu);
    });

    expect(mockNavigate).toHaveBeenCalledWith(detailRoute(pikachu));
  });

  it.each([
    [599, 2],
    [600, 3],
    [899, 3],
    [900, 4],
  ])('usa %i px de ancho con %i columnas', async (width, columns) => {
    mockWidth = width;
    mockPokemonListState.data = [pikachu];
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<HomeScreen />);
    });

    expect(renderer!.root.findByType(FlatList).props.numColumns).toBe(columns);

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });
});
