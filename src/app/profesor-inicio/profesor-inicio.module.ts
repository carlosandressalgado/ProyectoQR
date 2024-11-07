import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorInicioPageRoutingModule } from './profesor-inicio-routing.module';

import { ProfesorInicioPage } from './profesor-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorInicioPageRoutingModule
  ],
  declarations: [ProfesorInicioPage]
})
export class ProfesorInicioPageModule {}
