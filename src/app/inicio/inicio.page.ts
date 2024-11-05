import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { WeatherService } from '../services/weather.service';
import { AsistenciaService } from '../services/asistencia.service';
import { HistorialAsistenciasComponent } from '../historial-asistencias/historial-asistencias.component'; // Ajusta la ruta según la estructura
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';
  weatherData: any; // Variable para los datos del clima
  city: string = 'Santiago'; // Ciudad para la búsqueda del clima
  clases = [
    { id: '1', nombre: 'Programacion de aplicaciones moviles' },
    { id: '2', nombre: 'Arquitectura' },
    { id: '3', nombre: 'Calidad de software' }
  ];

  constructor(private storageService: StorageService, private weatherService: WeatherService, private asistenciaService: AsistenciaService, private modalController: ModalController ) { }

  async ngOnInit() {
    // Recuperar el nombre del usuario que inició sesión o el usuario actual
    const currentUser = await this.storageService.get('currentUser');
    
    // Almacenar nombre en variable nombreUsuario para mostrarlo en saludo
    if (currentUser) {
      this.nombreUsuario = currentUser;
    }

    // Llamada al servicio del clima por ciudad
    this.weatherService.getWeatherByCity(this.city).subscribe(
      data => {
        this.weatherData = data;
        console.log(this.weatherData); // Mostrar los datos en la consola
      },
      error => {
        console.error('Error al obtener los datos del clima', error);
      }
    );
  }
  // Función para abrir el modal de historial de asistencias
  async mostrarHistorial() {
    const modal = await this.modalController.create({
      component: HistorialAsistenciasComponent
    });
    await modal.present();
  }

  async marcarAsistencia(claseId: string) {
    const usuarioId = this.nombreUsuario;
    const clase = this.clases.find(c => c.id === claseId);
  
    if (clase) {
      await this.asistenciaService.registrarAsistencia(clase.id, usuarioId, clase.nombre);
      alert(`Asistencia marcada para la clase ${clase.nombre}`);
    }
  }
}
