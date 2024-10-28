import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestablecerContrasenaPage } from './restablecer-contrasena.page';
import { DbService } from '../services/db.service';

const routes: Routes = [
  {
    path: '',
    component: RestablecerContrasenaPage, canActivate: [DbService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestablecerContrasenaPageRoutingModule {}
