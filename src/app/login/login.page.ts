import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController, ToastController, LoadingController} from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importar el servicio
import { Usuario } from '../usuario.interface'; //importar interfaz de usuario
import { Router } from '@angular/router';

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
    public loadingController: LoadingController,
    private storageService: StorageService, // implementar para poder utilizar atorage
    private router: Router
  ) { 
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }

  ngOnInit() { }

  async mostrarLoading(mensaje: string = 'Cargando...') {
    const loading = await this.loadingController.create({
      message: mensaje,
      spinner: 'crescent', // Estilo del spinner
    });
    await loading.present();
    return loading; // Devuelve la referencia al Loading
  }
  

  // buscar y Validar usuario en Ionic Storage e ingresar
  async ingresar() {
    const loading = await this.mostrarLoading('Verificando datos...');
    try {
      const f = this.formularioLogin.value;
      let usuarios: Usuario[] = await this.storageService.get('usuarios') || [];
      const usuario = usuarios.find(u => u.nombre === f.nombre && u.password === f.password);
  
      if (usuario) {
        await this.storageService.set('ingresado', 'true');
        await this.storageService.set('currentUser', usuario.nombre);
        await this.storageService.set('tipoUsuario', 'alumno');
        this.router.navigateByUrl('/inicio');
        console.log(await this.storageService.get('ingresado'));
        console.log(await this.storageService.get('tipoUsuario'));  
  } else {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: 'Los datos que ingresaste son incorrectos.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}finally {
  loading.dismiss(); // Cierra el Loading, incluso si ocurre un error
}
}
async registrarUsuario() {
  const alert = await this.alertController.create({
    header: 'Registro de Usuario',
    inputs: [
      { name: 'nombre', type: 'text', placeholder: 'Nombre de Usuario' },
      { name: 'password', type: 'password', placeholder: 'Contraseña' }
    ],
    buttons: [
      'Cancelar',
      {
        text: 'Registrar',
        handler: async (data) => {
          const nombre = data.nombre.trim();
          const password = data.password.trim();
          
          if (!nombre || !password) {
            const errorAlert = await this.alertController.create({
              header: 'Error',
              message: 'Tienes que llenar todos los datos',
              buttons: ['Aceptar']
            });
            await errorAlert.present();
            return false;
          }

          if (!/^[a-zA-Z\s]{3,15}$/.test(nombre)) {
            await this.mostrarError(
              'El nombre debe tener entre 3 y 15 caracteres, solo letras y espacios.'
            );
            return false;
          }

          if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(password)) {
            await this.mostrarError(
              'La contraseña debe tener entre 6 y 20 caracteres y al menos una letra y un número.'
            );
            return false;
          }

          const loading = await this.mostrarLoading('Registrando usuario...');
          try {
            let usuarios = await this.storageService.get('usuarios') || [];

            const usuarioExistente = usuarios.find(
              (u: any) => u.nombre.toLowerCase() === nombre.toLowerCase()
            );
            if (usuarioExistente) {
              await this.mostrarError(
                'El nombre de usuario ya está en uso. Elige otro.'
              );
              return false;
            }

            usuarios.push({ nombre: data.nombre, password: data.password });
            await this.storageService.set('usuarios', usuarios);

            const successAlert = await this.alertController.create({
              header: 'Registro Exitoso',
              message: 'Te has registrado exitosamente',
              buttons: ['Aceptar']
            });
            await successAlert.present();
          } finally {
            loading.dismiss(); // Cierra el Loading al finalizar
          }
          return true;
        }
      }
    ]
  });

  await alert.present();
}

private async mostrarError(mensaje: string) {
  const errorAlert = await this.alertController.create({
    header: 'Error',
    message: mensaje,
    buttons: ['Aceptar'],
  });
  await errorAlert.present();
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
          handler: async (data) => {
            if (!data.nombre || !data.password) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'Tienes que llenar todos los datos',
                buttons: ['Aceptar']
              });
              await errorAlert.present();
              return;
            }
  
            const loading = await this.mostrarLoading('Verificando datos...');
            try {
              const profesores = [
                { nombre: 'juan carlos', password: 'juca123' },
                { nombre: 'felipe perez', password: 'fepe123' },
                { nombre: 'julieta venegas', password: 'juve123' }
              ];
              const profesor = profesores.find(p => p.nombre === data.nombre && p.password === data.password);
  
              if (profesor) {
                // Almacenar que un profesor ha iniciado sesión
                await this.storageService.set('ingresado', 'true');
                await this.storageService.set('tipoUsuario', 'profesor'); // Almacenar el tipo de usuario
                await this.storageService.set('currentUser', profesor.nombre);
                console.log(await this.storageService.get('ingresado'));
                console.log(await this.storageService.get('tipoUsuario')); 
                this.navCtrl.navigateRoot('profesor-inicio');
              } else {
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Nombre o contraseña incorrectos.',
                  buttons: ['Aceptar']
                });
                await errorAlert.present();
              }
            } finally {
              loading.dismiss(); // Asegurar que el Loading se cierra
            }
          }
        }
      ]
    });
    await alert.present();
  }  
  }