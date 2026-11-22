import { PokemonSummary } from '../entities/PokemonSummary';
import { IPokemonRepository } from '../ports/IPokemonRepository';

export class GetPokemonListUseCase {
    constructor(private readonly pokemonRepository: IPokemonRepository) {}

    execute(limit: number = 20, offset: number = 0): Promise<PokemonSummary[]> {
        return this.pokemonRepository.getPokemonList(limit, offset);
    }
}