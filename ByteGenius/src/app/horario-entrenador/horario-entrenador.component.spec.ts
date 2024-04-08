import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorarioEntrenadorComponent } from './horario-entrenador.component';

describe('HorarioClienteComponent', () => {
  let component: HorarioEntrenadorComponent;
  let fixture: ComponentFixture<HorarioEntrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioEntrenadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioEntrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
