import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioServiceEntrenador } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { Hora } from '../Hora';
import { HashMap } from '../HashMap';
import { Usuario } from '../entities/usuario';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { JsonPipe } from '@angular/common';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDateStruct, NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ReservasEntrenadorComponent } from '../reservas-entrenador/reservas-entrenador.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UsuariosService} from '../services/usuarios.service';
import { HashMapReservas } from '../HashMapReservas';


@Component({
  selector: 'app-horario-entrenador',
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule,NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './horario-entrenador.component.html',
  styleUrl: './horario-entrenador.component.css'
})

export class HorarioEntrenadorComponent {
  dias: Dia [] = [];
  horas: Hora [] = [];
  asignaciones: HashMap = [];
  usuarios: Usuario [] = [];
  id:number = 1;
  semana:NgbDate [] = [];
  reservas:HashMapReservas = {}
  semanaSelected:NgbDateStruct [] = [];
  diaSiguienteSemana:NgbDate;

  private diasAqui: Dia [] = [
    {id:1, nombre:'Lunes'},
    {id:2, nombre:'Martes'},
    {id:3, nombre:'Miércoles'},
    {id:4, nombre:'Jueves'},
    {id:5, nombre:'Viernes'},
    {id:6, nombre:'Sábado'},
    {id:7, nombre:'Domingo'}
    ]

  today: NgbDate;
	dia: NgbDate;
  
	model: NgbDateStruct;
	date: { year: number; month: number };
  sol:String = "";

  // Variables necesarias para el selector de los días en el formulario
  selectedItems = []
  dropdownSettings: IDropdownSettings = {};
  
  //Constructor
  constructor(private usuariosservice: UsuarioServiceEntrenador, private calendar:NgbCalendar,private modalService: NgbModal, private usuarioServiceLogin: UsuariosService) {
    // Inicialización de las propiedades
		this.today = this.calendar.getToday();
		this.model = { year: this.today.year, month: this.today.month, day: this.today.day };
		this.date = { year: this.today.year, month: this.today.month };
    this.dia = this.today;
    this.id = usuarioServiceLogin.getSesionID() as number;
    this.diaSiguienteSemana = this.today; 
  }

  //Inicialización de variables y configuración para el selector múltiple.
  ngOnInit(): void {
    this.dias = this.usuariosservice.getDias();
    this.horas = this.usuariosservice.getHoras();
    this.usuarios = this.usuariosservice.getUsuarios();
    this.cargarDatos();
    
    // Configuración necesaria de la interfaz IDropdownSettings para el selector múltiple de la lista de días
    this.dropdownSettings= {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
    };
  }

  mostrarReservas():void{
    let ref = this.modalService.open(ReservasEntrenadorComponent);
  }

  getIdSesion(){
    return this.id;
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  obtenerIdTrainer(hashMap: HashMap, idMes: number, idDia: number, idHora: number): number[] {
    if (hashMap[idMes] && hashMap[idMes][idDia] && hashMap[idMes][idDia][idHora] && hashMap[idMes][idDia][idHora].idTrainers) {
      return hashMap[idMes][idDia][idHora].idTrainers;
    } else {
      return [];
    }
  }

  pertenece(lista:number[]):boolean{
    return lista.includes(this.id);
  }

  obtenerNombres(ids: number[]): string {
    if (this.pertenece(ids)) {
      const usuario = this.usuarios.find(u => u.id === this.id); // Busca el usuario por el id
      if (usuario) {
        return usuario.nombre; // Devuelve el nombre del usuario si se encuentra
      }
    }
    return ''; // Devuelve una cadena vacía si no se encuentra el usuario
  }
  
  estaId(ids:number[],id:number): boolean{
    return ids.includes(id);
  }
    
  eliminarHora(mes: number, dia: number, hora: number): void {
    if (this.asignaciones[mes] && this.asignaciones[mes][dia] && this.asignaciones[mes][dia][hora]) {
      const index = this.asignaciones[mes][dia][hora].idTrainers.indexOf(this.id);
      if (index !== -1) {
        this.asignaciones[mes][dia][hora].idTrainers.splice(index, 1);
      }
      this.cancelarReservaOpcional(this.id,mes,dia,hora);
      this.guardarDatos();
    }
  }

  agregarHora(mes: number, dia: number, hora: number): void {
    if (!this.asignaciones[mes]) {
      this.asignaciones[mes] = {};
    }
    if (!this.asignaciones[mes][dia]) {
      this.asignaciones[mes][dia] = {};
    }
    if (!this.asignaciones[mes][dia][hora]) {
      this.asignaciones[mes][dia][hora] = { idTrainers: [] };
    }
    this.asignaciones[mes][dia][hora].idTrainers.push(this.id);
    this.guardarDatos();
  }
   
  // Método para el evento (click) del botón "Guardar Disponibilidad"
  guardarDisponibilidad(): void {
    // Obtener los días seleccionados del dropdown
    const diasSeleccionados = this.selectedItems.map((item: Dia) => item.id);
    const stringDias:string[] = [];

    for(const di of diasSeleccionados){
      stringDias.push(this.diasAqui[di-1].nombre);
    }
    
    this.semanaSelected = this.obtenerSemana(this.today);

    // Obtener las horas seleccionadas desde y hasta
    const desde = parseInt((<HTMLSelectElement>document.getElementById("desde")).value);
    const hasta = parseInt((<HTMLSelectElement>document.getElementById("hasta")).value);
    const month = parseInt((<HTMLSelectElement>document.getElementById("month")).value);

    const diasdelmes:number = this.obtenerCantidadDiasMes(month,this.today.year);
    const nombres:String[] = [];
    
    for (let day = 1; day <= diasdelmes; day++) {
      // Verificar si el entrenador ya ha reservado en esa hora
      if(stringDias.includes(this.getDayOfWeek(new NgbDate(this.today.year,month,day)))){
        for (let i = desde; i <= hasta; i++) {
            // Si el entrenador no tiene asignada esa hora y no hay una reserva existente, agregarla
            this.agregarHora(month,day, i);
            // Guardar la disponibilidad en el localStorage
            this.guardarDatos(); 
        }
      }
    }
  }

  //Implementacion DATEPICKER
  rellenarSemana() {
		const dia: NgbDate = new NgbDate(this.date.year, this.date.month, this.today.day);
		// Hacer algo con 'dia'
	}

	ngMode(){}
	
	onDateSelection(event: any) {
		// Extrae la fecha del evento
		const selectedDate: NgbDate = event;
		// Asigna el día seleccionado a 'di'
		this.dia = selectedDate; 
    this.Semana();
	}

  Semana():void {
    const selectedDay = this.dia.day; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const startOfWeek = new Date(this.dia.day);
    const endOfWeek = new Date(selectedDay);
        
    // Calcular el inicio de la semana (lunes)
    startOfWeek.setDate(startOfWeek.getDate() - selectedDay + (selectedDay === 1 ? -7 : 1));
        
    // Calcular el final de la semana (domingo)
    endOfWeek.setDate(endOfWeek.getDate() - selectedDay + (selectedDay === 0 ? 1 : 8));
        
    this.sol = startOfWeek.getDay().toString() + " --> " + endOfWeek.getDay().toString();
  }

  getDayOfWeek(date: NgbDateStruct): string {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let d = new Date(date.year, date.month - 1, date.day);
    return dayNames[d.getDay()];
  }

  obtenerLunesMasCercano(date: NgbDateStruct): NgbDateStruct {
    // Convertir la fecha NgbDateStruct a un objeto Date de JavaScript
    const jsDate = new Date(date.year, date.month - 1, date.day);
    
    // Iterar hacia atrás desde la fecha dada hasta encontrar un lunes
    while (jsDate.getDay() !== 1) { // 1 representa el lunes en JavaScript
      jsDate.setDate(jsDate.getDate() - 1); // Restar un día
    }
  
    // Convertir el resultado de vuelta a NgbDateStruct
    const lunesMasCercano = new NgbDate(jsDate.getFullYear(),jsDate.getMonth()+1,jsDate.getDate());
    this.sol = lunesMasCercano.day.toString();
    this.dia = lunesMasCercano;
    return lunesMasCercano;
  }

  obtenerCantidadDiasMes(year: number, month: number): number {
    // Obtener el último día del mes
    const ultimoDiaMes = new Date(year, month, 0).getDate();
    return ultimoDiaMes;
  }
  
  obtenerSemana(date:NgbDate):NgbDateStruct[]{
    let primerLunes = this.obtenerLunesMasCercano(this.dia);
    let lista = [];
    var diaAct = primerLunes;
    lista.push(primerLunes);
    let cont = 0;
    let cambio = false;
    let cont2 = 0;
    while(cont < 6){
      if(this.obtenerCantidadDiasMes(diaAct.year,diaAct.month) > diaAct.day){
        if(!cambio)lista.push(new NgbDate(diaAct.year,diaAct.month,diaAct.day+1));
        else lista.push(new NgbDate(diaAct.year,diaAct.month,diaAct.day+1));
      }else{
        if(diaAct.month <= 12){
          lista.push(new NgbDate(diaAct.year,diaAct.month+1,1));
          cambio = true;
        }else{
          lista.push(new NgbDate(diaAct.year+1,1,1));
          cambio = true;
        }
      }
      cont = cont+1;
      if(cambio) cont2 = cont2+1;
      diaAct = lista[lista.length-1];
    }
    return lista;
  }

  cargarDatos(): void {
    const datosGuardados = localStorage.getItem('horarioEntrenadoresPD');
    if (datosGuardados) {
      this.asignaciones = JSON.parse(datosGuardados);
    }
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }
  }
  
  guardarDatos(): void {
    localStorage.setItem('horarioEntrenadoresPD', JSON.stringify(this.asignaciones));
  }

  cancelarReserva(idUsuario: number, idDia: number, idHora: number) {
    if (this.reservas[idUsuario] && this.reservas[idUsuario][idDia] && this.reservas[idUsuario][idDia][idHora]) {
      // Eliminar la reserva del HashMap
      delete this.reservas[idUsuario][idDia][idHora];
      // Verificar si ya no hay reservas para ese día y hora
      if (Object.keys(this.reservas[idUsuario][idDia]).length === 0) {
        // Si no hay más reservas para ese día, eliminar el día del HashMap
        delete this.reservas[idUsuario][idDia];
        // Verificar si ya no hay días reservados para ese usuario
        if (Object.keys(this.reservas[idUsuario]).length === 0) {
          // Si no hay más días reservados para ese usuario, eliminar la entrada del usuario del HashMap de reservas
          delete this.reservas[idUsuario];
        }
      }
      // Guardar los cambios en el almacenamiento local (opcional)
      localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas));
    }
  }
  
  cancelarReservaOpcional(idEntrenador: number, idMes: number, idDia: number, idHora: number) {
    for (const idUsuario in this.reservas) {
      if (this.reservas[idUsuario] && this.reservas[idUsuario][idMes] && this.reservas[idUsuario][idMes][idDia] && this.reservas[idUsuario][idMes][idDia][idHora] && this.reservas[idUsuario][idMes][idDia][idHora].idEntrenador === idEntrenador) {
        // Eliminar el idUsuario de la reserva del HashMap
        delete this.reservas[idUsuario][idMes][idDia][idHora];
        // Verificar si ya no hay reservas para ese día y hora
        if (Object.keys(this.reservas[idUsuario][idMes][idDia]).length === 0) {
          // Si no hay más reservas para ese día, eliminar el día del HashMap
          delete this.reservas[idUsuario][idMes][idDia];
          // Verificar si ya no hay días reservados para ese mes
          if (Object.keys(this.reservas[idUsuario][idMes]).length === 0) {
            // Si no hay más días reservados para ese mes, eliminar el mes del HashMap
            delete this.reservas[idUsuario][idMes];
            // Verificar si ya no hay meses reservados para ese usuario
            if (Object.keys(this.reservas[idUsuario]).length === 0) {
              // Si no hay más meses reservados para ese usuario, eliminar la entrada del usuario del HashMap de reservas
              delete this.reservas[idUsuario];
            }
          }
        }
      }
    }

    // Guardar los cambios en el almacenamiento local (opcional)
    localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas));
  }
}

