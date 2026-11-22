import { InMemoryStorage } from '../../../src/data/storage/InMemoryStorage';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  it('guarda y recupera un valor', async () => {
    await storage.setItem('pokemon:detail:25', {
      id: 25,
      name: 'pikachu',
    });

    await expect(
      storage.getItem<{ id: number; name: string }>('pokemon:detail:25'),
    ).resolves.toEqual({
      id: 25,
      name: 'pikachu',
    });
  });

  it('devuelve null cuando la clave no existe', async () => {
    await expect(
      storage.getItem('pokemon:detail:999'),
    ).resolves.toBeNull();
  });

  it('reemplaza el valor existente al usar la misma clave', async () => {
    await storage.setItem('pokemon:detail:25', 'pikachu');
    await storage.setItem('pokemon:detail:25', 'raichu');

    await expect(
      storage.getItem<string>('pokemon:detail:25'),
    ).resolves.toBe('raichu');
  });

  it('mantiene los valores asociados a claves distintas', async () => {
    await storage.setItem('pokemon:detail:25', 'pikachu');
    await storage.setItem('pokemon:detail:26', 'raichu');

    await expect(
      storage.getItem<string>('pokemon:detail:25'),
    ).resolves.toBe('pikachu');
    await expect(
      storage.getItem<string>('pokemon:detail:26'),
    ).resolves.toBe('raichu');
  });

  it('elimina un valor almacenado', async () => {
    await storage.setItem('pokemon:detail:25', 'pikachu');
    await storage.removeItem('pokemon:detail:25');

    await expect(
      storage.getItem('pokemon:detail:25'),
    ).resolves.toBeNull();
  });

  it('no modifica otras claves al eliminar una clave', async () => {
    await storage.setItem('pokemon:detail:25', 'pikachu');
    await storage.setItem('pokemon:detail:26', 'raichu');

    await storage.removeItem('pokemon:detail:25');

    await expect(
      storage.getItem<string>('pokemon:detail:26'),
    ).resolves.toBe('raichu');
  });

  it('permite eliminar una clave inexistente', async () => {
    await expect(
      storage.removeItem('pokemon:detail:999'),
    ).resolves.toBeUndefined();
  });
});