import { IStorage } from '../../domain/ports/IStorage';

/**
 * Trade-off documentado: React Native core no incluye almacenamiento
 * persistente y el reto prohíbe librerías externas, así que esta caché
 * vive en memoria mientras la app esté activa. Al estar detrás del
 * puerto IStorage, puede sustituirse por AsyncStorage/MMKV sin tocar
 * dominio ni presentación (Dependency Inversion).
 */
export class InMemoryStorage implements IStorage {
  private readonly store = new Map<string, unknown>();

  async getItem<TValue>(key: string): Promise<TValue | null> {
    return (this.store.get(key) as TValue | undefined) ?? null;
  }

  async setItem<TValue>(key: string, value: TValue): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}