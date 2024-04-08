import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-datepicker-basic',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker.component.html',
})
export class NgbdDatepickerBasic {
	today = inject(NgbCalendar).getToday();

	model: NgbDateStruct;
	date: { year: number; month: number };

  constructor() {
    // Inicialización de las propiedades
    this.model = { year: this.today.year, month: this.today.month, day: this.today.day };
    this.date = { year: this.today.year, month: this.today.month };
  }
}
