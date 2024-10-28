import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';
  weatherData: any; // Variable para los datos del clima
  city: string = 'Santiago'; // Ciudad para la búsqueda del clima

  constructor(private storageService: StorageService, private weatherService: WeatherService ) { }

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
}
