import { Component,Input, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-asistencias',
  templateUrl: './historial-asistencias.component.html',
  styleUrls: ['./historial-asistencias.component.scss'],
})
export class HistorialAsistenciasComponent implements OnInit {
  @Input() asistencias: any[] = [];
  @Input() usuarioId: string = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    // Obtener el historial de asistencias del servicio
    if (this.usuarioId) {
      this.asistenciaService.obtenerAsistencias(this.usuarioId).then(asistencias => {
        this.asistencias = asistencias;
      });
    }
  }  
  // Cerrar el modal
  close() {
    this.modalController.dismiss();
  }
}
