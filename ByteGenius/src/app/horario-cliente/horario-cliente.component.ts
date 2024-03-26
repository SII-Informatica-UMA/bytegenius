import { Component } from '@angular/core';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-horario-cliente',
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService],
  templateUrl: './horario-cliente.component.html',
  styleUrl: './horario-cliente.component.css'
})
export class HorarioClienteComponent {

}
