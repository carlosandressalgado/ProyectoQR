import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController} from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importar el servicio 
import { Usuario } from '../usuario.interface'; // importar interfaz usuario


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
    public navCtrl: NavController,
    private storageService: StorageService // implementar para poder utilizar storage igual que en login.page.ts
  ) {
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

    // Obtener la lista de usuarios
    let usuarios: Usuario[] = await this.storageService.get('usuarios');
    if (!usuarios) {
      usuarios = []; // Inicializar vacío si no hay usuarios registrados
    }

    // Buscar si el usuario existe en la lista de usuarios
    const usuario = usuarios.find(u => u.nombre === f.nombre);

    if (usuario) {
      // Actualizar la contraseña del usuario
      usuario.password = f.password;

      // Guardar la lista de usuarios actualizada
      await this.storageService.set('usuarios', usuarios);

      const alert = await this.alertController.create({
        header: 'Contraseña restablecida',
        message: 'Tu contraseña ha sido actualizada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();

      //Volver ala página de login
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