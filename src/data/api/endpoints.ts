const API_BASE_URL = 'https://pokeapi.co/api/v2';
const OFFICIAL_ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const endpoints = {
    pokemonList: (limit: number, offset: number): string => `/pokemon?limit=${limit}&offset=${offset}`,
    pokemonDetail: (id: number): string => `/pokemon/${id}`,
    officialArtwork: (id: number): string => `${OFFICIAL_ARTWORK_BASE_URL}/${id}.png`,
} as const;

export { API_BASE_URL };