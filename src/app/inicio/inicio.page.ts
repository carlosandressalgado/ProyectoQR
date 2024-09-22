import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';

  constructor() { }

  ngOnInit() {
    //buscar usuario en localstorage
    const usuarioJSON = localStorage.getItem('usuario');
    const usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;

    // Si el usuario existe tomamos su nombre
    if (usuario && usuario.nombre) {
      this.nombreUsuario = usuario.nombre;
    }
  }

}
