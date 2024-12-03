import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HistorialAsistenciasComponent } from './historial-asistencias/historial-asistencias.component';
import { QrScannerService } from './services/qr-scanner.service';

export function initQrScannerService(qrScannerService: QrScannerService) {
  return () => qrScannerService.init();
}
 
export function qrScannerService() {
  return {
    provide: APP_INITIALIZER,
    useFactory: initQrScannerService,
    deps: [QrScannerService],
    multi: true,
  };
}

@NgModule({
  declarations: [AppComponent, HistorialAsistenciasComponent  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, qrScannerService()],
  bootstrap: [AppComponent],
})
export class AppModule {}   
