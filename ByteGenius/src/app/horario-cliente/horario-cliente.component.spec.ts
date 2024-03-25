import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioClienteComponent } from './horario-cliente.component';

describe('HorarioClienteComponent', () => {
  let component: HorarioClienteComponent;
  let fixture: ComponentFixture<HorarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
