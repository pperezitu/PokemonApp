import { PokemonDetail } from '../../../src/domain/entities/PokemonDetail';
import { PokemonStatName } from '../../../src/domain/entities/PokemonStat';
import { IPokemonRepository } from '../../../src/domain/ports/IPokemonRepository';
import { GetPokemonDetailUseCase } from '../../../src/domain/usecases/GetPokemonDetailUseCase';

describe('GetPokemonDetailUseCase', () => {
  let pokemonRepository: jest.Mocked<IPokemonRepository>;
  let useCase: GetPokemonDetailUseCase;

  beforeEach(() => {
    pokemonRepository = {
      getPokemonList: jest.fn(),
      getPokemonDetail: jest.fn(),
    };
    useCase = new GetPokemonDetailUseCase(pokemonRepository);
  });

  it('solicita al repositorio el detalle del Pokémon indicado', async () => {
    const detail: PokemonDetail = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'pikachu.png',
      types: ['electric'],
      abilities: [
        { name: 'static', isHidden: false },
      ],
      stats: [
        { name: PokemonStatName.HP, value: 35 },
      ],
      height: 40,
      weight: 6,
      baseExperience: 112,
    };
    pokemonRepository.getPokemonDetail.mockResolvedValue(detail);

    await expect(useCase.execute(25)).resolves.toBe(detail);

    expect(pokemonRepository.getPokemonDetail).toHaveBeenCalledTimes(1);
    expect(pokemonRepository.getPokemonDetail).toHaveBeenCalledWith(25);
  });

  it('propaga el error devuelto por el repositorio', async () => {
    const repositoryError = new Error('Pokémon no encontrado');
    pokemonRepository.getPokemonDetail.mockRejectedValue(repositoryError);

    await expect(useCase.execute(999)).rejects.toBe(repositoryError);

    expect(pokemonRepository.getPokemonDetail).toHaveBeenCalledWith(999);
  });
});