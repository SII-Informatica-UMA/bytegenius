import { Component } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { HorarioClienteComponent } from './horario-cliente/horario-cliente.component';

@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})
export class HorarioClienteComponent {
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  trainers = [
  {name: 'Entrenador 1'},
  {name: 'Entrenador 2'},
  {name: 'Entrenador 3'},
  // ...
];
}
