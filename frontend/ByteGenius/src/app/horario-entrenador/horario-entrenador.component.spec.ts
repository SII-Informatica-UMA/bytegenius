import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorarioEntrenadorComponent } from './horario-entrenador.component';
import { UsuarioServiceEntrenador } from './horario-entrenador.service';

describe('HorarioEntrenadorComponent', () => {
  let component: HorarioEntrenadorComponent;
  let fixture: ComponentFixture<HorarioEntrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, HorarioEntrenadorComponent],
      providers: [UsuarioServiceEntrenador, NgbModal]
    }).compileComponents();

    fixture = TestBed.createComponent(HorarioEntrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an assignment when calling agregarHora method', () => {
    const month = 4;
    const day = 11;
    const hour = 10;

    const initialAssignmentsCount = Object.keys(component.asignaciones).length;

    component.agregarHora(month, day, hour);

    expect(component.asignaciones[month][day][hour].idTrainers).toContain(component.id);
  });

  it('should remove an assignment when calling eliminarHora method', () => {
    const month = 4;
    const day = 11;
    const hour = 10;

    component.asignaciones = {
      [month]: {
        [day]: {
          [hour]: { idTrainers: [component.id] }
        }
      }
    };

    const initialAssignmentsCount = Object.keys(component.asignaciones).length;

    component.eliminarHora(month, day, hour);

    expect(Object.keys(component.asignaciones).length).toEqual(initialAssignmentsCount);
    expect(component.asignaciones[month][day][hour].idTrainers).not.toContain(component.id);
  });

  it('should obtain correct lunes closest to the selected date', () => {
    const date = { year: 2024, month: 4, day: 11 }; 
    const expectedLunes = new NgbDate( 2024,4, 8 ); 

    const lunesMasCercano = component.obtenerLunesMasCercano(date);

    expect(lunesMasCercano).toEqual(expectedLunes);
  });


});

