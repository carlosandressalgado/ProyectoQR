import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesorInicioPage } from './profesor-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesorInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesorInicioPageRoutingModule {}
