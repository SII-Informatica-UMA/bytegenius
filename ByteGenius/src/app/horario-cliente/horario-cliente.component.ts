import { Component, OnInit } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})
export class HorarioClienteComponent implements OnInit {
  currentDay!: number;
  mostrarCalendarioFlag: boolean = false;
  constructor() { }
  ngOnInit(): void {
    this.currentDay = new Date().getDate();
  }
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  trainers = [
  {name: 'Entrenador 1'},
  {name: 'Entrenador 2'},
  {name: 'Entrenador 3'},
  // ...
];

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

}
