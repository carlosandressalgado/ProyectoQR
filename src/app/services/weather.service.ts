import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = '9666b984b6c3efd53575bceea7ac64fc'; // Reemplaza con tu API Key de OpenWeatherMap
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Método para obtener el clima por ciudad
  getWeatherByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    return this.http.get(url);
  }
}

