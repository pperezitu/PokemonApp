import { Ability } from './Ability';
import { PokemonStat } from './PokemonStat';
import { PokemonTypeName } from './PokemonType';

export interface PokemonDetail {
    readonly id: number;
    readonly name: string;
    readonly imageUrl: string;
    readonly types: PokemonTypeName[];
    readonly abilities: Ability[];
    readonly stats: PokemonStat[];
    readonly height: number;
    readonly weight: number;
    readonly baseExperience: number;
}