import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service'; // Asegúrate de tener este import correcto

@Injectable({
  providedIn: 'root'
})
export class DbService implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) { }

  async canActivate() {
    const loggedIn = await this.storageService.get('ingresado');
    if (loggedIn) {
      return true; // Permitir acceso si el usuario existe en el storage
    } else {
      console.log('Accesso denegado - Redireccionando a inicio de sesion');
      this.router.navigate(['login']);
      return false;
    }
  }
}
