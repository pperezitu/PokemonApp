export interface PokemonStatDTO {
    readonly base_stat: number;
    readonly stat: { readonly name: string };
}

export interface PokemonAbilityDTO {
    readonly ability: { readonly name: string };
    readonly is_hidden: boolean;
}

export interface PokemonTypeDTO {
    readonly slot: number;
    readonly type: { readonly name: string };
}

export interface PokemonSpritesDTO {
    readonly front_default: string | null;
    readonly other?: {
        readonly 'official-artwork'?: { readonly front_default: string | null };
    };
}

export interface PokemonDetailDTO {
    readonly id: number;
    readonly name: string;
    readonly height: number; // decímetros
    readonly weight: number; // hectogramos
    readonly base_experience: number | null;
    readonly types: readonly PokemonTypeDTO[];
    readonly abilities: readonly PokemonAbilityDTO[];
    readonly stats: readonly PokemonStatDTO[];
    readonly sprites: PokemonSpritesDTO;
}