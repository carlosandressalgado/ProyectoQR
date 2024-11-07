import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importar el servicio
import { Usuario } from '../usuario.interface'; //importar interfaz de usuario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    public toastController: ToastController,
    private storageService: StorageService // implementar para poder utilizar atorage
  ) { 
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }

  ngOnInit() { }

  // buscar y Validar usuario en Ionic Storage e ingresar
  async ingresar() {
  var f = this.formularioLogin.value;

  // Obtener la lista de usuarios
  let usuarios: Usuario[] = await this.storageService.get('usuarios');
  if (!usuarios) {
    usuarios = []; // Inicializar vacío el array en caso de no haber usuarios
  }

  // Buscar si el nombre y contraseña coinciden con algún usuario
  const usuario = usuarios.find(u => u.nombre === f.nombre && u.password === f.password);

  if (usuario) {
    console.log('Ingresado');
    await this.storageService.set('ingresado', 'true');
    await this.storageService.set('currentUser', usuario.nombre);
    this.navCtrl.navigateRoot('inicio');
  } else {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: 'Los datos que ingresaste son incorrectos.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}

  async registrarUsuario() {
    const alert = await this.alertController.create({
      header: 'Registro de Usuario',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de Usuario'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Registrar',
          handler: async (data) => {
            // Validar los campos
            if (!data.nombre || !data.password) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Tienes que llenar todos los datos',
                buttons: ['Aceptar']
              });
              await errorAlert.present();
              return;
            }
  
            // Obtener la lista de usuarios
            let usuarios = await this.storageService.get('usuarios');
            if (!usuarios) {
              usuarios = []; // lo mismo Inicializar vacío el array en caso de no haber usuarios
            }
  
            // Agregar el nuevo usuario al array
            usuarios.push({
              nombre: data.nombre,
              password: data.password
            });
            
  
            // Guardar el array actualizado de usuarios en Storage
            await this.storageService.set('usuarios', usuarios);
  
            // Alerta de registro exitoso
            const successAlert = await this.alertController.create({
              header: 'Registro Exitoso',
              message: 'Te has registrado exitosamente',
              buttons: ['Aceptar']
            });
            await successAlert.present();
          }
        }
      ]
    });
  
    await alert.present();
  }
  // Función para mostrar alerta de "Inicio profesor"
  async mostrarMensajeInicioProfesor() {
    const alert = await this.alertController.create({
      header: 'Inicio Profesor',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ingresar',
          handler: (data) => {
            // Aquí puedes manejar los datos ingresados, como validarlos o hacer alguna acción
            console.log('Nombre:', data.nombre);
            console.log('Contraseña:', data.password);
          }
        }
      ]
    });
    await alert.present();
  }
}
