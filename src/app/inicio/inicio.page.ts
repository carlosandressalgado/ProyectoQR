import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { WeatherService } from '../services/weather.service';
import { AsistenciaService } from '../services/asistencia.service';
import { HistorialAsistenciasComponent } from '../historial-asistencias/historial-asistencias.component'; // Ajusta la ruta según la estructura
import { ModalController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { QrScannerService } from '../services/qr-scanner.service'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';
  weatherData: any; // Variable para los datos del clima
  city: string = 'Santiago'; // Ciudad para la búsqueda del clima
  qrResult: string = '';
  escaneando: boolean = false;
  asignaturaSeleccionada: string = '';
  seccionSeleccionada: string = '';
  salaSeleccionada: string = '';
  fechaSeleccionada: string = ''; 
  
  constructor(private storageService: StorageService, private weatherService: WeatherService, private asistenciaService: AsistenciaService,
     private modalController: ModalController, private alertController: AlertController, private loadingController: LoadingController, public navCtrl: NavController, private qrScannerService: QrScannerService) { }

  async ngOnInit() {
    // Recuperar el nombre del usuario que inició sesión o el usuario actual
    const currentUser = await this.storageService.get('currentUser');
    
    // Almacenar nombre en variable nombreUsuario para mostrarlo en saludo
    if (currentUser) {
      this.nombreUsuario = currentUser;
    }

    // Llamada al servicio del clima por ciudad
    this.weatherService.getWeatherByCity(this.city).subscribe(
      data => {
        this.weatherData = data;
        console.log(this.weatherData); // Mostrar los datos en la consola
      },
      error => {
        console.error('Error al obtener los datos del clima', error);
      }
    );

  }
  // Función para abrir el modal de historial de asistencias
  async mostrarHistorial() {
  try {
    const currentUser = await this.storageService.get('currentUser');  
    if (currentUser) {
      const loading = await this.loadingController.create({
        message: 'Cargando historial de asistencias...',
      });
      await loading.present();

      const asistencias = await this.asistenciaService.obtenerAsistencias(currentUser);
  
      console.log('Historial de asistencias para', currentUser, ':', asistencias);

      const modal = await this.modalController.create({
        component: HistorialAsistenciasComponent,
        componentProps: { usuarioId: currentUser } 
      });
      await modal.present();
      loading.dismiss();
    } else {
      alert('No hay usuario logueado');
    }
  }catch (error) {
      console.error('Error al mostrar el historial:', error);
    }
  }

  async iniciarEscaneo() {
    this.escaneando = true;
    
    // Verificar permisos antes de intentar escanear
    const hasPermission = await this.qrScannerService.requestPermissions();
    if (!hasPermission) {
      const alert = await this.alertController.create({
        header: 'Permisos necesarios',
        message: 'Se requiere acceso a la cámara para escanear el código QR.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.escaneando = false;
      return;
    }
    
    // Iniciar el escaneo
    const barcodes = await this.qrScannerService.scan();
    
    if (barcodes.length > 0) {
      const qrData = barcodes[0];
      const [claseId, seccion, sala, fecha] = qrData.split('|');
      const dia = fecha.substring(0, 2);
      const mes = fecha.substring(2, 4); 
      const anio = fecha.substring(4, 8);
      
      this.fechaSeleccionada = `${anio}/${mes}/${dia}`;
      this.asignaturaSeleccionada = claseId;
      this.seccionSeleccionada = seccion;
      this.salaSeleccionada = sala;

      const usuarioId = this.nombreUsuario;
      const nombreClase = `Clase: ${claseId}, Sección: ${seccion}, Sala: ${sala}`;
      
      await this.asistenciaService.registrarAsistencia(claseId, usuarioId, nombreClase, this.fechaSeleccionada);
      console.log('Asistencia registrada para:', nombreClase);
    } else {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'No se detectó un código QR válido.',
        buttons: ['Aceptar'],
      });
      await errorAlert.present();
    }
    
    this.escaneando = false;
  }

  async guardarAsistencia() {
    const asignaturasValidas = ['PGY4121', 'ASY4131', 'CSY4111'];
    if (!asignaturasValidas.includes(this.asignaturaSeleccionada)) {
      const errorAlert = await this.alertController.create({
        header: 'Asignatura inválida',
        message: `La asignatura ${this.asignaturaSeleccionada} no está permitida para registrar asistencia.`,
        buttons: ['Aceptar'],
      });
      await errorAlert.present();
      return;
    }

    if (this.asignaturaSeleccionada && this.seccionSeleccionada && this.salaSeleccionada) {
      const usuarioId = this.nombreUsuario;
      const nombreClase = `Clase: ${this.asignaturaSeleccionada}, Sección: ${this.seccionSeleccionada}, Sala: ${this.salaSeleccionada}`;
      
      const fecha = this.fechaSeleccionada || this.obtenerFechaActual();
      
      try {
        const asistencias = await this.asistenciaService.obtenerAsistencias(usuarioId);
  
        // Validar si la asistencia ya existe
        const existeAsistencia = asistencias.some(
          (asistencia: any) =>
            asistencia.claseId === this.asignaturaSeleccionada && asistencia.fechaQR === fecha
        );
  
        if (existeAsistencia) {
          const duplicadoAlert = await this.alertController.create({
            header: 'Asistencia Duplicada',
            message: 'Ya existe una asistencia registrada para esta asignatura en la fecha indicada.',
            buttons: ['Aceptar'],
          });
          await duplicadoAlert.present();
          return;
        }
      
      const alert = await this.alertController.create({
        header: 'Confirmar Asistencia',
        message: `¿Está seguro de que desea guardar esta asistencia?
        ${nombreClase}
        Fecha: ${fecha}`,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('El usuario canceló el guardado de la asistencia.');
            },
          },
          {
            text: 'Sí',
            handler: async () => {
              await this.asistenciaService.registrarAsistencia(this.asignaturaSeleccionada, usuarioId, nombreClase, fecha);

              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: '¡Asistencia guardada correctamente!',
                buttons: ['Aceptar'],
              });
              await successAlert.present();

              console.log('Asistencia guardada:', nombreClase, 'Fecha:', fecha);
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al intentar guardar la asistencia. Intenta nuevamente.',
        buttons: ['Aceptar'],
      });
      await errorAlert.present();
    }
    } else {
      alert('Por favor, ingresa todos los datos manualmente o escanea un QR.');
    }
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
  
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');
  
    return `${anio}-${mes}-${dia}`;
  }

  async salir() {
    const confirmalert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro de que desea cerrar sesión y volver al inicio de sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló cerrar sesión.');
          },
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cerrando sesión...',
            });
            await loading.present();

            try {
              // Limpiar el almacenamiento del usuario actual
              await this.storageService.remove('currentUser');
            
              console.log('El usuario ha cerrado sesión.');
            }catch (error) {
              console.error('Error al cerrar la sesión:', error);
            } finally {
              await loading.dismiss();
              this.navCtrl.navigateRoot('/login');
            }
          },
        },
      ],
    });
  
    await confirmalert.present();
  }

}
