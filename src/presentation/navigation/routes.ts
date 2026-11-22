import { PokemonSummary } from '../../domain/entities/PokemonSummary';

export enum ScreenName {
    Home = 'HOME',
    Detail = 'DETAIL',
}

export interface HomeRoute {
    readonly name: ScreenName.Home;
}

export interface DetailRoute {
    readonly name: ScreenName.Detail;
    readonly params: {
        readonly pokemon: PokemonSummary;
    };
}

// Unión discriminada: el campo `name` permite a TypeScript
// estrechar el tipo en cada case del switch del navigator
export type Route = HomeRoute | DetailRoute;

// Factorías: evitan repetir la forma de cada ruta al navegar
export const homeRoute = (): HomeRoute => ({ name: ScreenName.Home });

export const detailRoute = (pokemon: PokemonSummary): DetailRoute => ({
    name: ScreenName.Detail,
    params: { pokemon },
});