import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service'; // Importa el servicio del clima si lo has creado

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';
  weatherData: any; // Variable para los datos del clima
  city: string = 'Santiago'; // Ciudad para la búsqueda del clima, puedes cambiarla o hacerlo dinámico
  constructor(private weatherService: WeatherService) { } // Inyecta el servicio del clima

  ngOnInit() {
    const usuarioJSON = localStorage.getItem('usuario');
    const usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;
    if (usuario && usuario.nombre) {
      this.nombreUsuario = usuario.nombre;
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
