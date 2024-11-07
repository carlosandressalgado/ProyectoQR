import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorInicioPage } from './profesor-inicio.page';

describe('ProfesorInicioPage', () => {
  let component: ProfesorInicioPage;
  let fixture: ComponentFixture<ProfesorInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
