import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const loggedIn = await this.storageService.get('ingresado');
    const tipoUsuario = await this.storageService.get('tipoUsuario');

    if (loggedIn && tipoUsuario === 'alumno') {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}