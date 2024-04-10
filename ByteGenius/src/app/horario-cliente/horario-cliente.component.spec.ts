import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorarioClienteComponent } from './horario-cliente.component';
import { UsuarioServiceCliente } from './horario-cliente.service';
import { UsuariosService } from '../services/usuarios.service';

describe('HorarioClienteComponent', () => {
  let component: HorarioClienteComponent;
  let fixture: ComponentFixture<HorarioClienteComponent>;
  let usuarioServiceClienteSpy: jasmine.SpyObj<UsuarioServiceCliente>;
  let usuariosServiceLoginSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(async () => {
    const usuarioServiceClienteSpyObj = jasmine.createSpyObj('UsuarioServiceCliente', ['getHoras', 'getReservasUsuarios', 'obtenerSemana']);
    const usuariosServiceLoginSpyObj = jasmine.createSpyObj('UsuariosService', ['getArrayEntrenadores', 'getSesionID']);

    await TestBed.configureTestingModule({
      declarations: [HorarioClienteComponent],
      providers: [
        { provide: UsuarioServiceCliente, useValue: usuarioServiceClienteSpyObj },
        { provide: UsuariosService, useValue: usuariosServiceLoginSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioClienteComponent);
    component = fixture.componentInstance;
    usuarioServiceClienteSpy = TestBed.inject(UsuarioServiceCliente) as jasmine.SpyObj<UsuarioServiceCliente>;
    usuariosServiceLoginSpy = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Prueba para el método cancelarReserva
  it('should cancel reservation', () => {
    component.aniadirReserva(1, 1, 1, 1, 1);
    expect(component.reservas[1][1][1][1]).toBeDefined();

    component.cancelarReserva(1, 1, 1, 1);
    expect(component.reservas[1][1][1][1]).toBeUndefined();
  });

  // Prueba para el método aniadirReserva
  it('should add reservation', () => {
    component.aniadirReserva(1, 1, 1, 1, 1);
    expect(component.reservas[1][1][1][1]).toBeDefined();
  });

  // Prueba para el método existeReserva
  it('should check if reservation exists', () => {
    component.aniadirReserva(1, 1, 1, 1, 1);
    expect(component.existeReserva(1, 1, 1, 1)).toBeTrue();
    expect(component.existeReserva(1, 1, 1, 2)).toBeFalse();
  });
});