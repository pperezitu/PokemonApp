import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { IApiClient } from '../../domain/ports/IApiClient';
import { IPokemonRepository } from '../../domain/ports/IPokemonRepository';
import { IStorage } from '../../domain/ports/IStorage';
import { endpoints } from '../api/endpoints';
import { PokemonDetailDTO } from '../dto/PokemonDetailDTO';
import { PokemonListDTO } from '../dto/PokemonListDTO';
import { toPokemonDetail, toPokemonSummary } from '../mappers/pokemonMapper';

const listCacheKey = (limit: number, offset: number): string => `pokemon:list:${limit}:${offset}`;
const detailCacheKey = (id: number): string => `pokemon:detail:${id}`;

export class PokemonRepository implements IPokemonRepository {
  constructor(
    private readonly apiClient: IApiClient,
    private readonly storage: IStorage,
  ) {}

  async getPokemonList(limit: number, offset: number): Promise<PokemonSummary[]> {
    const cacheKey = listCacheKey(limit, offset);
    const cached = await this.readCache<PokemonSummary[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const dto = await this.apiClient.get<PokemonListDTO>(endpoints.pokemonList(limit, offset));
    const summaries = dto.results.map(toPokemonSummary);
    await this.writeCache(cacheKey, summaries);
    return summaries;
  }

  async getPokemonDetail(id: number): Promise<PokemonDetail> {
    const cacheKey = detailCacheKey(id);
    const cached = await this.readCache<PokemonDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    const dto = await this.apiClient.get<PokemonDetailDTO>(endpoints.pokemonDetail(id));
    const detail = toPokemonDetail(dto);
    await this.writeCache(cacheKey, detail);
    return detail;
  }

  private async readCache<TValue>(key: string): Promise<TValue | null> {
    try {
      return await this.storage.getItem<TValue>(key);
    } catch {
      return null; // una caché fallida no debe bloquear el dato fresco
    }
  }

  private async writeCache<TValue>(key: string, value: TValue): Promise<void> {
    try {
      await this.storage.setItem(key, value);
    } catch {
      // persistir es una mejora, no un requisito crítico del flujo
    }
  }
}