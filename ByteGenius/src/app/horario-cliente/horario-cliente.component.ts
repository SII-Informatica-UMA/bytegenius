import { Component, OnInit } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { UsuariosService } from './horario-cliente.service'; 
import { Usuario } from "../Usuario";

@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule, NgFor, CommonModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService, UsuariosService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})

export class HorarioClienteComponent implements OnInit {
  currentDay!: number;
  mostrarCalendarioFlag: boolean = false;
  entrenadores: Usuario[] = [];
  constructor(private UsuariosService:UsuariosService) { }
  ngOnInit(): void {
    const currentDate = new Date();
    this.currentDay = currentDate.getDay();
    this.entrenadores = this.UsuariosService.getUsuarios().filter(usuario => usuario.rol === 'Entrenador');
  }


getDayClass(dayNumber: number): number {
  switch (dayNumber) {
    case 1: return this.currentDay-5;
    case 2: return this.currentDay-4;
    case 3: return this.currentDay-3;
    case 4: return this.currentDay-2;
    case 5: return this.currentDay-1;
    case 6: return this.currentDay;
    case 7: return this.currentDay+1;
    default: return 0;
  }
}

toggleCalendario(day: number): void {
  this.mostrarCalendarioFlag = !this.mostrarCalendarioFlag;
}

getCurrentDay(): number {
  const currentDate = new Date();
  return currentDate.getDay(); // Esto devuelve un número entre 0 (Domingo) y 6 (Sábado)
}



}
