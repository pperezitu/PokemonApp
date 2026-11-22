import { AppError, AppErrorType } from '../../core/errors/AppError';
import { Ability } from '../../domain/entities/Ability';
import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonStat, PokemonStatName } from '../../domain/entities/PokemonStat';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { PokemonTypeName } from '../../domain/entities/PokemonType';
import { endpoints } from '../api/endpoints';
import { PokemonDetailDTO, PokemonStatDTO } from '../dto/PokemonDetailDTO';
import { PokemonListItemDTO } from '../dto/PokemonListDTO';

const KNOWN_STAT_NAMES = new Set<string>(Object.values(PokemonStatName));

export const extractPokemonIdFromUrl = (url: string): number => {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    if (!match) {
        throw new AppError(AppErrorType.Unknown, `URL de Pokémon inválida: ${url}`, url);
    }
    return Number(match[1]);
};

export const toPokemonSummary = (dto: PokemonListItemDTO): PokemonSummary => {
    const id = extractPokemonIdFromUrl(dto.url);
    return { id, name: dto.name, imageUrl: endpoints.officialArtwork(id) };
};

const toPokemonStat = (dto: PokemonStatDTO): PokemonStat | null =>
    KNOWN_STAT_NAMES.has(dto.stat.name)
        ? { name: dto.stat.name as PokemonStatName, value: dto.base_stat }
        : null;

const toAbility = (dto: PokemonDetailDTO['abilities'][number]): Ability => ({
    name: dto.ability.name,
    isHidden: dto.is_hidden,
});

export const toPokemonDetail = (dto: PokemonDetailDTO): PokemonDetail => {
    const types: PokemonTypeName[] = [...dto.types]
        .sort((a, b) => a.slot - b.slot)
        .map(entry => entry.type.name);

    const stats = dto.stats
        .map(toPokemonStat)
        .filter((stat): stat is PokemonStat => stat !== null);

    return {
        id: dto.id,
        name: dto.name,
        imageUrl:
        dto.sprites.other?.['official-artwork']?.front_default ??
        dto.sprites.front_default ??
        endpoints.officialArtwork(dto.id),
        types,
        abilities: dto.abilities.map(toAbility),
        stats,
        height: dto.height * 10, // dm → cm
        weight: dto.weight / 10, // hg → kg
        baseExperience: dto.base_experience ?? 0,
    };
};