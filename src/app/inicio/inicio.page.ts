import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  nombreUsuario: string = '';

  constructor(private storageService: StorageService) { }

  async ionViewWillEnter() {
    // Recuperar el nombre del usuario que inicioó sesión o el usuario actual
    const currentUser = await this.storageService.get('currentUser');
  
    // almacenar nombre en variable nombreUsuario para mostrarlo en saludo
    if (currentUser) {
      this.nombreUsuario = currentUser;
    }
  }
}