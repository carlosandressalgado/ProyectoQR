import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestablecerContrasenaPage } from './restablecer-contrasena.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: RestablecerContrasenaPage, canActivate: [AngularFireAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestablecerContrasenaPageRoutingModule {}
