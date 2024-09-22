import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';

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
    public toastController: ToastController) { 

    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("",Validators.required),
      'password': new FormControl("",Validators.required)
    })

  }

  ngOnInit() {
  }
  //Validar usuario en localstorage e ingresar
  async ingresar(){
    var f = this.formularioLogin.value;

    var usuarioJSON = localStorage.getItem('usuario');
    var usuario = usuarioJSON !== null ? JSON.parse(usuarioJSON) : null;
    
    
    if(usuario.nombre == f.nombre && usuario.password == f.password){
      console.log('Ingresado');
      localStorage.setItem('ingresado','true');
      this.navCtrl.navigateRoot('inicio');
      
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos que ingresaste son incorrectos.',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
  }
  //Formulario de alerta para registrar usuario
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
  
            // Guardar usuario en localStorage
            const usuario = {
              nombre: data.nombre,
              password: data.password
            };
            localStorage.setItem('usuario', JSON.stringify(usuario));
  
            // Alerta de registro existoso
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
  
}
