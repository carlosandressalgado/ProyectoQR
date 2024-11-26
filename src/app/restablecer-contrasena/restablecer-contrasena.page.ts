import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController, LoadingController} from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importar el servicio 


@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage implements OnInit {

  formularioRecuperar: FormGroup;
  nombreUsuario: string = '';
  nuevaPassword: string = ''; 
  confirmarPassword: string = '';

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private storageService: StorageService, // implementar para poder utilizar storage igual que en login.page.ts
    private loadingController: LoadingController
  ) {
    this.formularioRecuperar = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
    });
  }

  ngOnInit() { }

  async cambiarContrasena() {
    const nombre = this.nombreUsuario.trim();
    const nuevaPassword = this.nuevaPassword.trim();
    const confirmarPassword = this.confirmarPassword.trim();
    

    // Verificar que los campos no estén vacíos
    if (!nombre || !nuevaPassword || !confirmarPassword) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Debes llenar todos los campos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      await this.mostrarError('Las contraseñas no coinciden.');
      return;
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(nuevaPassword)) {
      await this.mostrarError(
        'La contraseña debe tener entre 6 y 20 caracteres y al menos una letra y un número.'
      );
      return;
    }

    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Cambio',
      message: `¿Estás seguro de que deseas cambiar la contraseña para el usuario: ${nombre}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cambio de contraseña cancelado.');
          }
        },
        {
          text: 'Sí',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Actualizando contraseña...',
            });
            await loading.present();

            try {
              let usuarios = await this.storageService.get('usuarios') || [];
              const usuario = usuarios.find((u: any) => u.nombre.toLowerCase() === nombre.toLowerCase());

              if (!usuario) {
                await this.mostrarError('Usuario no encontrado.');
                return;
              }
          
              usuario.password = nuevaPassword;
              await this.storageService.set('usuarios', usuarios);
          
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: '¡Contraseña actualizada exitosamente!',
                buttons: ['Aceptar'],
              });
              await successAlert.present();
              console.log(`Contraseña cambiada para ${nombre}`);
              this.navCtrl.navigateRoot('login');
            } catch (error : any) {
              await this.mostrarError(error.message || 'Error al actualizar la contraseña.');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
    });
    await confirmAlert.present();
  }
          

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}