import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profesor-inicio',
  templateUrl: './profesor-inicio.page.html',
  styleUrls: ['./profesor-inicio.page.scss'],
})
export class ProfesorInicioPage implements OnInit {

  // Almacenar datos
  nombreProfesor: string = ''; //pendiente
  asignaturaSeleccionada: string = '';
  seccionSeleccionada: string = ''; 
  salaSeleccionada: string = ''; 
  qrData: string = ''; 

  asignaturas = [
    { id: 'PGY4121', nombre: 'Programación de Apps Móviles' },
    { id: 'ASY4131', nombre: 'Arquitectura' },
    { id: 'CSY4111', nombre: 'Calidad de software' }
  ];
  secciones = ['001D', '002D', '003D', '004D', '001V', '002V', '003V'];
  salas = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'];

  constructor(private alertController: AlertController,) {}

  async ngOnInit() {
    // Saludo al profesor al igual que el inicio alumno, pendiente
  }

  async generarQR() {
    if (!this.asignaturaSeleccionada || !this.seccionSeleccionada || !this.salaSeleccionada) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, selecciona todos los campos antes de generar el QR.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const fechaActual = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/[^0-9]/g, '');

    this.qrData = `${this.asignaturaSeleccionada}|${this.seccionSeleccionada}|${this.salaSeleccionada}|${fechaActual}`;

  alert(`Datos del QR: ${this.qrData}`);
}
}

