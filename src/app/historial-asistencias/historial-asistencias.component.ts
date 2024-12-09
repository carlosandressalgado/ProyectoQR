import { Component,Input, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-asistencias',
  templateUrl: './historial-asistencias.component.html',
  styleUrls: ['./historial-asistencias.component.scss'],
})
export class HistorialAsistenciasComponent implements OnInit {
  @Input() usuarioId: string = '';
  asistenciasPorAsignatura: any[] = [];

  constructor(
    private asistenciaService: AsistenciaService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    // Obtener el historial de asistencias del servicio
    if (this.usuarioId) {
      const asistencias = await this.asistenciaService.obtenerAsistencias(this.usuarioId);

      // Agrupar asistencias por asignatura
      const grupos = asistencias.reduce((acc: any, asistencia: any) => {
        const { claseId } = asistencia;
        if (!acc[claseId]) {
          acc[claseId] = [];
        }
        acc[claseId].push(asistencia);
        return acc;
      }, {});
      this.asistenciasPorAsignatura = Object.keys(grupos).map((asignatura) => ({
        asignatura,
        asistencias: grupos[asignatura],
      }));
    }
  }  

  // Cerrar el modal
  close() {
    this.modalController.dismiss();
  }
}
