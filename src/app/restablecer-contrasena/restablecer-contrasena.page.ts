import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage implements OnInit {

  formularioRecuperar: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController
  ) {
    // Definir los controles del formulario
    this.formularioRecuperar = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    });
  }

  ngOnInit() { }

  async cambiarContrasena() {
    var f = this.formularioRecuperar.value;

    // Verificar que los campos no estén vacíos
    if (this.formularioRecuperar.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Debes llenar todos los campos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    var usuarioJSON = localStorage.getItem('usuario');
    var usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;

    // Verificar si el nombre de usuario existe
    if (usuario && usuario.nombre === f.nombre) {
      // Actualizar la contraseña en el localStorage
      usuario.password = f.password;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      const alert = await this.alertController.create({
        header: 'Contraseña restablecida',
        message: 'Tu contraseña ha sido actualizada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();

      // volver ala página de login
      this.navCtrl.navigateRoot('login');
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario no encontrado.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}