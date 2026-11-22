import { AppErrorType } from '../../../src/core/errors/AppError';
import {
  extractPokemonIdFromUrl,
  toPokemonDetail,
  toPokemonSummary,
} from '../../../src/data/mappers/pokemonMapper';
import { PokemonDetailDTO } from '../../../src/data/dto/PokemonDetailDTO';
import { PokemonStatName } from '../../../src/domain/entities/PokemonStat';

describe('extractPokemonIdFromUrl', () => {
  it.each([
    ['https://pokeapi.co/api/v2/pokemon/25/', 25],
    ['https://pokeapi.co/api/v2/pokemon/1025', 1025],
  ])('extrae el id de %p', (url, expected) => {
    expect(extractPokemonIdFromUrl(url)).toBe(expected);
  });

  it('rechaza URLs que no pertenecen al recurso pokemon', () => {
    expect(() =>
      extractPokemonIdFromUrl('https://pokeapi.co/api/v2/type/10/'),
    ).toThrow(
      expect.objectContaining({
        type: AppErrorType.Unknown,
        message: 'URL de Pokémon inválida: https://pokeapi.co/api/v2/type/10/',
        originalError: 'https://pokeapi.co/api/v2/type/10/',
      }),
    );
  });
});

describe('toPokemonSummary', () => {
  it('convierte un elemento de listado en un resumen', () => {
    expect(
      toPokemonSummary({
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      }),
    ).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    });
  });
});

describe('toPokemonDetail', () => {
  const createDto = (
    overrides: Partial<PokemonDetailDTO> = {},
  ): PokemonDetailDTO => ({
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    base_experience: 112,
    types: [
      { slot: 2, type: { name: 'electric' } },
      { slot: 1, type: { name: 'mouse' } },
    ],
    abilities: [
      { ability: { name: 'static' }, is_hidden: false },
      { ability: { name: 'lightning-rod' }, is_hidden: true },
    ],
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
    ],
    sprites: {
      front_default: 'pikachu-front.png',
      other: {
        'official-artwork': {
          front_default: 'pikachu-official.png',
        },
      },
    },
    ...overrides,
  });

  it('convierte todas las propiedades conocidas del detalle', () => {
    expect(toPokemonDetail(createDto())).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl: 'pikachu-official.png',
      types: ['mouse', 'electric'],
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
    });
  });

  it('ordena los tipos según su slot', () => {
    const dto = createDto({
      types: [
        { slot: 3, type: { name: 'second' } },
        { slot: 1, type: { name: 'first' } },
        { slot: 2, type: { name: 'middle' } },
      ],
    });

    expect(toPokemonDetail(dto).types).toEqual([
      'first',
      'middle',
      'second',
    ]);
  });

  it('usa front_default cuando no existe artwork oficial', () => {
    const dto = createDto({
      sprites: {
        front_default: 'pikachu-front.png',
        other: {
          'official-artwork': { front_default: null },
        },
      },
    });

    expect(toPokemonDetail(dto).imageUrl).toBe('pikachu-front.png');
  });

  it('usa el artwork generado como último recurso', () => {
    const dto = createDto({
      sprites: {
        front_default: null,
        other: {
          'official-artwork': { front_default: null },
        },
      },
    });

    expect(toPokemonDetail(dto).imageUrl).toContain('/25.png');
  });

  it('usa cero cuando base_experience es null', () => {
    expect(
      toPokemonDetail(createDto({ base_experience: null })).baseExperience,
    ).toBe(0);
  });

  it('filtra estadísticas que no pertenecen al modelo conocido', () => {
    const dto = createDto({
      stats: [
        { base_stat: 70, stat: { name: 'defense' } },
        { base_stat: 999, stat: { name: 'accuracy' } },
      ],
    });

    expect(toPokemonDetail(dto).stats).toEqual([
      { name: PokemonStatName.Defense, value: 70 },
    ]);
  });
});