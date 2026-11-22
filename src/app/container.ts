import { FetchApiClient } from '../data/api/FetchApiClient';
import { PokemonRepository } from '../data/repositories/PokemonRepository';
import { InMemoryStorage } from '../data/storage/InMemoryStorage';
import { GetPokemonDetailUseCase } from '../domain/usecases/GetPokemonDetailUseCase';
import { GetPokemonListUseCase } from '../domain/usecases/GetPokemonListUseCase';

export interface AppContainer {
    readonly getPokemonList: GetPokemonListUseCase;
    readonly getPokemonDetail: GetPokemonDetailUseCase;
}

export const createAppContainer = (): AppContainer => {
    const apiClient = new FetchApiClient();
    const storage = new InMemoryStorage();
    const pokemonRepository = new PokemonRepository(apiClient, storage);

    return {
        getPokemonList: new GetPokemonListUseCase(pokemonRepository),
        getPokemonDetail: new GetPokemonDetailUseCase(pokemonRepository),
    };
};