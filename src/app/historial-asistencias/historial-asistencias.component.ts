import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-asistencias',
  templateUrl: './historial-asistencias.component.html',
  styleUrls: ['./historial-asistencias.component.scss'],
})
export class HistorialAsistenciasComponent implements OnInit {
  asistencias: any[] = [];

  constructor(
    private asistenciaService: AsistenciaService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    // Obtener el historial de asistencias del servicio
    this.asistencias = await this.asistenciaService.obtenerAsistencias();
  }

  // Cerrar el modal
  close() {
    this.modalController.dismiss();
  }
}
