export enum PokemonStatName {
    HP = 'hp',
    Attack = 'attack',
    Defense = 'defense',
    SpecialAttack = 'special-attack',
    SpecialDefense = 'special-defense',
    Speed = 'speed',
}

export interface PokemonStat {
    readonly name: PokemonStatName;
    readonly value: number;
}