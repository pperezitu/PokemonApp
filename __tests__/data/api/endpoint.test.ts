import { endpoints } from '../../../src/data/api/endpoints';

describe('endpoints', () => {
  describe('pokemonDetail', () => {
    it('genera la ruta del Pokémon solicitado', () => {
      expect(endpoints.pokemonDetail(25)).toBe('/pokemon/25');
    });

    it.each([1, 150, 1025])(
      'genera la ruta para el id %p',
      (id) => {
        expect(endpoints.pokemonDetail(id)).toBe(`/pokemon/${id}`);
      },
    );
  });

  describe('officialArtwork', () => {
    it('genera la URL del artwork oficial', () => {
      expect(endpoints.officialArtwork(25)).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      );
    });

    it.each([1, 150, 1025])(
      'genera la URL para el id %p',
      (id) => {
        expect(endpoints.officialArtwork(id)).toContain(`/${id}.png`);
      },
    );
  });
});