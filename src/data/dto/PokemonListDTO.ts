export interface PokemonListItemDTO {
    readonly name: string;
    readonly url: string;
}

export interface PokemonListDTO {
    readonly count: number;
    readonly next: string | null;
    readonly previous: string | null;
    readonly results: readonly PokemonListItemDTO[];
}