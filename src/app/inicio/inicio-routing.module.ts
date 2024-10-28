import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: InicioPage, canActivate: [AngularFireAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
