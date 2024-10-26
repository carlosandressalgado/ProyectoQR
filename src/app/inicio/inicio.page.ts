
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { WeatherService } from '../services/weather.service'; // Importa el servicio del clima si lo has creado

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  nombreUsuario: string = '';

  weatherData: any; // Variable para los datos del clima
  city: string = 'Santiago'; // Ciudad para la búsqueda del clima, puedes cambiarla o hacerlo dinámico
      
  constructor(private storageService: StorageService, private weatherService: WeatherService ) { }

  async ionViewWillEnter() {
    // Recuperar el nombre del usuario que inicioó sesión o el usuario actual
    const currentUser = await this.storageService.get('currentUser');
  
    // almacenar nombre en variable nombreUsuario para mostrarlo en saludo
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
}