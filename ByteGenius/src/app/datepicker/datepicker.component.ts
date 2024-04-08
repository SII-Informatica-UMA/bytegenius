import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { setYear } from 'date-fns';

@Component({
	selector: 'app-datepicker',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker.component.html',
})
export class NgbdDatepickerBasic {
	today: NgbDate;
	di: String = '';
  
	model: NgbDateStruct;
	date: { year: number; month: number };
  
	constructor(private calendar: NgbCalendar, private parserFormatter: NgbDateParserFormatter) {
		// Inicialización de las propiedades
		this.today = this.calendar.getToday();
		this.model = { year: this.today.year, month: this.today.month, day: this.today.day };
		this.date = { year: this.today.year, month: this.today.month };
	  }
	
	  rellenarSemana() {
		const dia: NgbDate = new NgbDate(this.date.year, this.date.month, this.today.day);
		// Hacer algo con 'dia'
	  }

	  ngMode(){

	  }
	
	  onDateSelection(event: any) {
		// Extrae la fecha del evento
		const selectedDate: NgbDate = event;
		// Asigna el día seleccionado a 'di'
		this.di = selectedDate.day.toString() + selectedDate.month; 
	  }

}
