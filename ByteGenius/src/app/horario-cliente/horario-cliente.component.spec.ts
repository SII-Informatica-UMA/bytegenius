import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorarioClienteComponent } from './horario-cliente.component';
import { UsuarioServiceCliente } from './horario-cliente.service';

describe('HorarioClienteComponent', () => {
  let component: HorarioClienteComponent;
  let fixture: ComponentFixture<HorarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, HorarioClienteComponent],
      providers: [UsuarioServiceCliente, NgbModal] // Agrega NgbModal al providers
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update dates when calling updateDates method', () => {
    const currentDate = new Date();
    const startOfWeekExpected = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeekExpected = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 7);
    startOfWeekExpected.setHours(0, 0, 0, 0); // Establecer horas en 00:00:00
    endOfWeekExpected.setHours(0, 0, 0, 0); // Establecer horas en 00:00:00

    component.updateDates();

    const startOfWeekActual = component.startDateOfWeek;
    const endOfWeekActual = component.endDateOfWeek;
    startOfWeekActual.setHours(0, 0, 0, 0); // Establecer horas en 00:00:00
    endOfWeekActual.setHours(0, 0, 0, 0); // Establecer horas en 00:00:00

    expect(startOfWeekActual).toEqual(startOfWeekExpected);
    expect(endOfWeekActual).toEqual(endOfWeekExpected);
});


  it('should add a reservation when calling aniadirReserva method', () => {
    const usuario = 1;
    const mes = 4;
    const dia = 11;
    const hora = 10;
    const entrenador = 5;

    const initialReservasCount = Object.keys(component.reservas).length;
    
    component.aniadirReserva(usuario, mes, dia, hora, entrenador);

    expect(Object.keys(component.reservas).length).toEqual(initialReservasCount + 1);
    expect(component.reservas[usuario][mes][dia][hora].idEntrenador).toEqual(entrenador);
  });

  it('should cancel a reservation when calling cancelarReserva method', () => {
    const usuario = 1;
    const mes = 4;
    const dia = 11;
    const hora = 10;

    component.reservas = {
      [usuario]: {
        [mes]: {
          [dia]: {
            [hora]: { idEntrenador: 5 }
          }
        }
      }
    };

    const initialReservasCount = Object.keys(component.reservas).length;

    component.cancelarReserva(usuario, mes, dia, hora);

    expect(Object.keys(component.reservas).length).toEqual(initialReservasCount-1 );
  });

  it('should return true if a reservation exists for the specified user, day, and hour', () => {
    const usuario = 3;
    const mes = 4;
    const dia = 11;
    const hora = 10;
    const entrenador=5;
  
    // Agregar una reserva para el usuario, día y hora especificados
    component.aniadirReserva(usuario, mes, dia, hora, entrenador)
  
    // Verificar si existe una reserva para el usuario, día y hora especificados
    const exists = component.existeReserva(usuario, dia, hora, mes);
    console.log("Existe? : " +exists);
  
    expect(exists).toBeTruthy();
  });
  

  
});
