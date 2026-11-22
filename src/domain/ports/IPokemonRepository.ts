import { PokemonDetail } from '../entities/PokemonDetail';
import { PokemonSummary } from '../entities/PokemonSummary';

export interface IPokemonRepository {
    getPokemonList(limit: number, offset: number): Promise<PokemonSummary[]>;
    getPokemonDetail(id: number): Promise<PokemonDetail>;
}