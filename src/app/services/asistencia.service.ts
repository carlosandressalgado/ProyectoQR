import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  constructor(private storage: Storage) {}

  // Guardar asistencia con la fecha y hora actual
  async registrarAsistencia(claseId: string, usuarioId: string, nombreClase: string): Promise<void> {
    const fechaHora = new Date();
    const fechaHoraLocal = fechaHora.toLocaleString('es-CL', {
        timeZone: 'America/Santiago', // Zona horaria de Chile
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Formato de 24 horas
    });
    const asistencia = { claseId, usuarioId, nombreClase, fechaHora : fechaHoraLocal };

    // Obtener las asistencias actuales
    let asistencias = await this.storage.get('asistencias') || [];
    asistencias.push(asistencia);

    // Guardar la lista actualizada de asistencias
    await this.storage.set('asistencias', asistencias);
  }

  // Obtener todas las asistencias registradas
  async obtenerAsistencias(): Promise<any[]> {
    return await this.storage.get('asistencias') || [];
  }
}
