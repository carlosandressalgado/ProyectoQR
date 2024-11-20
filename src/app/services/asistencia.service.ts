import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  constructor(private storage: Storage) {}

  // Guardar asistencia con la fecha y hora actual
  async registrarAsistencia(claseId: string, usuarioId: string, nombreClase: string, fechaQR: string): Promise<void> {
    
    const asistencia = { claseId, usuarioId, nombreClase, fechaQR };

    // Obtener las asistencias actuales
    let asistencias = await this.storage.get(`asistencias_${usuarioId}`) || [];
    asistencias.push(asistencia);

    // Guardar la lista actualizada de asistencias
    await this.storage.set(`asistencias_${usuarioId}`, asistencias);
    console.log('Asistencia registrada para:',usuarioId, ':', asistencia);
  }

  // Obtener todas las asistencias registradas
  async obtenerAsistencias(usuarioId: string): Promise<any[]> {
    return await this.storage.get(`asistencias_${usuarioId}`) || [];
  }
}
