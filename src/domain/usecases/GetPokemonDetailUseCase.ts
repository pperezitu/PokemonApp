import { PokemonDetail } from '../entities/PokemonDetail';
import { IPokemonRepository } from '../ports/IPokemonRepository';

export class GetPokemonDetailUseCase {
    constructor(private readonly pokemonRepository: IPokemonRepository) {}

    execute(id: number): Promise<PokemonDetail> {
        return this.pokemonRepository.getPokemonDetail(id);
    }
}