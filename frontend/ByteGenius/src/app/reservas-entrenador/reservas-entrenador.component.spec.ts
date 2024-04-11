import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasEntrenadorComponent } from './reservas-entrenador.component';

describe('ReservasEntrenadorComponent', () => {
  let component: ReservasEntrenadorComponent;
  let fixture: ComponentFixture<ReservasEntrenadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasEntrenadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasEntrenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
