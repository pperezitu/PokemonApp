import { IApiClient } from '../../../src/domain/ports/IApiClient';
import { IStorage } from '../../../src/domain/ports/IStorage';
import { PokemonRepository } from '../../../src/data/repositories/PokemonRepository';
import { PokemonDetailDTO } from '../../../src/data/dto/PokemonDetailDTO';
import { PokemonListDTO } from '../../../src/data/dto/PokemonListDTO';

describe('PokemonRepository', () => {
  let apiClient: jest.Mocked<IApiClient>;
  let storage: jest.Mocked<IStorage>;
  let repository: PokemonRepository;

  beforeEach(() => {
    apiClient = {
      get: jest.fn(),
    };
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    repository = new PokemonRepository(apiClient, storage);
  });

  describe('getPokemonList', () => {
    it('devuelve datos de caché sin consultar la API', async () => {
      const cached = [
        {
          id: 25,
          name: 'pikachu',
          imageUrl: 'pikachu.png',
        },
      ];
      storage.getItem.mockResolvedValue(cached);

      await expect(repository.getPokemonList(20, 0)).resolves.toEqual(cached);

      expect(storage.getItem).toHaveBeenCalledWith('pokemon:list:20:0');
      expect(apiClient.get).not.toHaveBeenCalled();
      expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('consulta y almacena la lista cuando no hay caché', async () => {
      const dto: PokemonListDTO = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/25/',
          },
        ],
      };
      storage.getItem.mockResolvedValue(null);
      apiClient.get.mockResolvedValue(dto);
      storage.setItem.mockResolvedValue();

      await expect(repository.getPokemonList(20, 0)).resolves.toEqual([
        {
          id: 25,
          name: 'pikachu',
          imageUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        },
      ]);

      expect(apiClient.get).toHaveBeenCalledWith('/pokemon?limit=20&offset=0');
      expect(storage.setItem).toHaveBeenCalledWith(
        'pokemon:list:20:0',
        expect.arrayContaining([
          expect.objectContaining({
            id: 25,
            name: 'pikachu',
          }),
        ]),
      );
    });

    it('continúa usando la API si la lectura de caché falla', async () => {
      storage.getItem.mockRejectedValue(new Error('cache unavailable'));
      apiClient.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });

      await expect(repository.getPokemonList(20, 20)).resolves.toEqual([]);
      expect(apiClient.get).toHaveBeenCalledWith('/pokemon?limit=20&offset=20');
    });

    it('no falla si no puede guardar la lista en caché', async () => {
      storage.getItem.mockResolvedValue(null);
      storage.setItem.mockRejectedValue(new Error('cache unavailable'));
      apiClient.get.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });

      await expect(repository.getPokemonList(20, 0)).resolves.toEqual([]);
    });
  });

  describe('getPokemonDetail', () => {
    const createDetailDto = (): PokemonDetailDTO => ({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [
        { slot: 1, type: { name: 'electric' } },
      ],
      abilities: [
        { ability: { name: 'static' }, is_hidden: false },
      ],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
      ],
      sprites: {
        front_default: 'pikachu-front.png',
        other: {
          'official-artwork': {
            front_default: 'pikachu-official.png',
          },
        },
      },
    });

    it('devuelve datos de caché sin consultar la API', async () => {
      const cached = {
        id: 25,
        name: 'pikachu',
        imageUrl: 'pikachu-official.png',
      };
      storage.getItem.mockResolvedValue(cached);

      await expect(repository.getPokemonDetail(25)).resolves.toEqual(cached);

      expect(storage.getItem).toHaveBeenCalledWith('pokemon:detail:25');
      expect(apiClient.get).not.toHaveBeenCalled();
      expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('consulta, convierte y almacena el detalle', async () => {
      storage.getItem.mockResolvedValue(null);
      storage.setItem.mockResolvedValue();
      apiClient.get.mockResolvedValue(createDetailDto());

      await expect(repository.getPokemonDetail(25)).resolves.toEqual({
        id: 25,
        name: 'pikachu',
        imageUrl: 'pikachu-official.png',
        types: ['electric'],
        abilities: [
          { name: 'static', isHidden: false },
        ],
        stats: [
          { name: 'hp', value: 35 },
        ],
        height: 40,
        weight: 6,
        baseExperience: 112,
      });

      expect(apiClient.get).toHaveBeenCalledWith('/pokemon/25');
      expect(storage.setItem).toHaveBeenCalledWith(
        'pokemon:detail:25',
        expect.objectContaining({
          id: 25,
          name: 'pikachu',
          height: 40,
          weight: 6,
        }),
      );
    });

    it('continúa usando la API si la lectura de caché falla', async () => {
      storage.getItem.mockRejectedValue(new Error('cache unavailable'));
      apiClient.get.mockResolvedValue(createDetailDto());

      await expect(repository.getPokemonDetail(25)).resolves.toMatchObject({
        id: 25,
        name: 'pikachu',
      });
      expect(apiClient.get).toHaveBeenCalledWith('/pokemon/25');
    });

    it('propaga los errores de la API', async () => {
      storage.getItem.mockResolvedValue(null);
      const apiError = new Error('API unavailable');
      apiClient.get.mockRejectedValue(apiError);

      await expect(repository.getPokemonDetail(25)).rejects.toBe(apiError);
    });
  });
});