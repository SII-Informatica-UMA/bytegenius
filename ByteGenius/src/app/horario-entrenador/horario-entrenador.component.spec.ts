import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorarioEntrenadorComponent } from './horario-entrenador.component';
import { UsuarioServiceEntrenador } from './horario-entrenador.service';
import { UsuariosService } from '../services/usuarios.service';

describe('HorarioEntrenadorComponent', () => {
  let component: HorarioEntrenadorComponent;
  let fixture: ComponentFixture<HorarioEntrenadorComponent>;
  let usuarioServiceEntrenadorSpy: jasmine.SpyObj<UsuarioServiceEntrenador>;
  let usuariosServiceLoginSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(async () => {
    const usuarioServiceEntrenadorSpyObj = jasmine.createSpyObj('UsuarioServiceEntrenador', ['getDias', 'getHoras', 'getUsuarios']);
    const usuariosServiceLoginSpyObj = jasmine.createSpyObj('UsuariosService', ['getSesionID']);

    await TestBed.configureTestingModule({
      declarations: [HorarioEntrenadorComponent],
      providers: [
        { provide: UsuarioServiceEntrenador, useValue: usuarioServiceEntrenadorSpyObj },
        { provide: UsuariosService, useValue: usuariosServiceLoginSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioEntrenadorComponent);
    component = fixture.componentInstance;
    usuarioServiceEntrenadorSpy = TestBed.inject(UsuarioServiceEntrenador) as jasmine.SpyObj<UsuarioServiceEntrenador>;
    usuariosServiceLoginSpy = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba para el método ngOnInit
  it('should initialize properties', () => {
    usuarioServiceEntrenadorSpy.getDias.and.returnValue([{id: 1, nombre: 'Lunes'}]);
    usuarioServiceEntrenadorSpy.getHoras.and.returnValue([{id: 1, franjaHoraria: '9:00'}]);
    usuarioServiceEntrenadorSpy.getUsuarios.and.returnValue([{id: 1, nombre:'Admin',apellido1: 'Admin',apellido2:'Admin', email:'admin@uma.es',administrador:true ,password: '1234'}]);
    usuariosServiceLoginSpy.getSesionID.and.returnValue(1);

    component.ngOnInit();

    expect(component.dias).toEqual([{id: 1, nombre: 'Lunes'}]);
    expect(component.horas).toEqual([{id: 1, franjaHoraria: '9:00'}]);
    expect(component.usuarios).toEqual([{id: 1, nombre:'Admin',apellido1: 'Admin',apellido2:'Admin', email:'admin@uma.es',administrador:true ,password: '1234'}]);
    expect(component.id).toEqual(1);
  });

  // Prueba para el método guardarDisponibilidad
  it('should save availability', () => {
    spyOn(window, 'alert');
    spyOn(component, 'agregarHora');
    spyOn(component, 'guardarDatos');

    component.asignaciones = {1: {1: {1: {idTrainers: [1]}}}};
    component.guardarDisponibilidad();

    expect(component.agregarHora).toHaveBeenCalled();
    expect(component.guardarDatos).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('La disponibilidad se ha guardado correctamente.');
  });

  // Prueba para el método eliminarHora
  it('should remove hour', () => {
    component.asignaciones = {1: {1: {1: {idTrainers: [1]}}}};
    spyOn(component, 'guardarDatos');

    component.eliminarHora(1, 1, 1);

    expect(component.asignaciones[1][1][1]).toBeUndefined();
    expect(component.guardarDatos).toHaveBeenCalled();
  });

  // Prueba para el método agregarHora
  it('should add hour', () => {
    spyOn(component, 'guardarDatos');

    component.agregarHora(1, 1, 1);

    expect(component.asignaciones[1][1][1]).toBeDefined();
    expect(component.guardarDatos).toHaveBeenCalled();
  });

  // Prueba para el método cargarDatos
  it('should load data', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({1: {1: {1: {idTrainers: [1]}}}}));

    component.cargarDatos();

    expect(component.asignaciones).toEqual({1: {1: {1: {idTrainers: [1]}}}});
  });
});