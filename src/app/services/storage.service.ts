import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
   }
   async init() {
    const storage = await this.storage.create();
    this._storage = storage;  
  }

  // Guardar datos
  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Obtener datos
  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  // Eliminar datos
  public async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }
}
