import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsuarioService } from './horario-entrenador.service';
import { Dia } from '../Dia';
import { Hora } from '../Hora';
import { HashMap } from '../HashMap';
import { Usuario } from '../Usuario';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-horario-entrenador',
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './horario-entrenador.component.html',
  styleUrl: './horario-entrenador.component.css'
})

export class HorarioEntrenadorComponent {
  dias: Dia [] = [];
  horas: Hora [] = [];
  asignaciones: HashMap = [];
  usuarios: Usuario [] = [];
  id:number = 1;

  // Variables necesarias para el selector de los días en el formulario
  selectedItems = []
  dropdownSettings: IDropdownSettings = {};

  //Propiedades para controlar que los checkbox (cb -> checkbox).
  numCbMarcados: number = 0; // Contador de checkboxes marcados
  todosDesmarcados: boolean = true; // Indica si todos los checkboxes están desmarcados
  sinCbMarcado: boolean = true; // Indica si no hay ninguna checkbox marcada

  constructor(private usuariosservice: UsuarioService) {}

  ngOnInit(): void {
    this.dias = this.usuariosservice.getDias();
    this.horas = this.usuariosservice.getHoras();
    this.asignaciones = this.usuariosservice.getasignaciones();
    this.usuarios = this.usuariosservice.getUsuarios();
    
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

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  obtenerIdTrainer(hashMap: HashMap, idDia: number, idHora: number): number[] {
    if (this.asignaciones[idDia] && this.asignaciones[idDia][idHora] && this.asignaciones[idDia][idHora].idTrainers) {
        return this.asignaciones[idDia][idHora].idTrainers;
    } else {
        return [];
    }
  }

  obtenerNombres(ids: number[]): string[] {
    return ids.map(id => {
        const usuario = this.usuarios.find(u => u.id === id);
        return usuario ? usuario.nombre : '';
    });
  }
    
  estaId(ids:number[],id:number){
    return ids.includes(id);
  }
    
  eliminarHora(dia: number, hora: number): void {
    const index = this.asignaciones[dia][hora].idTrainers.indexOf(this.id);
    if (index !== -1) {
      this.asignaciones[dia][hora].idTrainers.splice(index, 1);
    }
  }

  agregarHora(dia: number, hora: number): void {
    if (!this.asignaciones[dia]) {
      this.asignaciones[dia] = {};
    }
    if (!this.asignaciones[dia][hora]) {
      this.asignaciones[dia][hora] = { idTrainers: [] };
    }
      this.asignaciones[dia][hora].idTrainers.push(this.id);
  }
    
    // Método para el evento (click) del botón "Guardar Disponibilidad"
  guardarDisponibilidad(): void {
    // Obtener los días seleccionados del dropdown
    const diasSeleccionados = this.selectedItems.map((item: Dia) => item.id);

    // Obtener las horas seleccionadas desde y hasta
    const desde = parseInt((<HTMLSelectElement>document.getElementById("desde")).value);
    const hasta = parseInt((<HTMLSelectElement>document.getElementById("hasta")).value);

    // Validar que haya días seleccionados y que la hora de inicio sea menor a la hora de fin
    if (diasSeleccionados.length > 0 && desde < hasta) {
      // Iterar sobre los días seleccionados
      diasSeleccionados.forEach((dia: number) => {
        // Iterar sobre las horas dentro del rango seleccionado
        for (let i = desde; i <= hasta; i++) {
          // Verificar si el entrenador ya tiene asignada esa hora en ese día
          const idTrainers = this.obtenerIdTrainer(this.asignaciones, dia, i);
          if (!this.estaId(idTrainers, this.id)) {
            // Si el entrenador no tiene asignada esa hora, agregarla
            this.agregarHora(dia, i);
          }
        }
      });

      // Limpiar la selección de días y horas en el formulario
      this.selectedItems = [];
      (<HTMLSelectElement>document.getElementById("desde")).selectedIndex = 0;
      (<HTMLSelectElement>document.getElementById("hasta")).selectedIndex = 0;

      // Notificar al usuario que la disponibilidad se ha guardado correctamente.
      alert('La disponibilidad se ha guardado correctamente.');
    } else {
      // Si no hay días seleccionados o la hora de inicio es mayor o igual a la hora de fin, mostrar un mensaje de error.
      alert('Por favor, seleccione al menos un día y asegúrese de que la hora de inicio sea menor a la hora de fin.');
    }
  }

  // Método para mostrar el botón "eliminar disponibilidad" cuando se hace click sobre un checkbox u ocultarlo cuando se quita el check.
  mostrarBoton(event: any): void {
    // Obtener el estado de verificación del checkbox
    const isChecked = event.target.checked;

    // Incrementar o decrementar el contador según el estado del checkbox
    if (isChecked) {
      this.numCbMarcados++;
    } else {
      this.numCbMarcados--;
    }

    // Verificar si todos los checkboxes están desmarcados
    this.todosDesmarcados = this.numCbMarcados === 0;

    // Verificar si no hay ninguna checkbox marcado
    this.sinCbMarcado = this.numCbMarcados === 0;
  }

  /*
  limpiarDisponibilidad(): void {
    // Obtener los días seleccionados del dropdown
    const diasSeleccionados = this.selectedItems.map((item: Dia) => item.id);

    // Verificar si hay días seleccionados
    if (diasSeleccionados.length > 0) {
      // Iterar sobre los días seleccionados
      diasSeleccionados.forEach((dia: number) => {
        // Iterar sobre las horas
        this.horas.forEach((hora: Hora) => {
          // Verificar si el entrenador está asignado en esa hora y día
          if (this.estaId(this.asignaciones[dia][hora.id]?.idTrainers, this.id)) {
            // Marcar la celda correspondiente para eliminar la disponibilidad
            this.asignaciones[dia][hora.id].eliminarDisponibilidad = true;
          }
        });
      });
    } else {
      // Si no hay días seleccionados, mostrar un mensaje de advertencia
      alert('Por favor, seleccione al menos un día para limpiar la disponibilidad.');
    }
  }
  */

  /*
  eliminarDisponibilidad(dia: number, hora: number): void {
    // Eliminar al entrenador de la asignación en esa hora y día
    const index = this.asignaciones[dia][hora].idTrainers.indexOf(this.id);
    if (index !== -1) {
      this.asignaciones[dia][hora].idTrainers.splice(index, 1); // splice(start, deleteCount) -> modificar el contenido de asignaciones reemplzando, eliminando o agregando elementos en las posiciones especificadas.
      // Desmarcar la celda correspondiente para eliminar la disponibilidad
      this.asignaciones[dia][hora].eliminarDisponibilidad = false;
    }
  }
  */

  /*
  seleccionarTodos(): void {
    // Iterar sobre los días seleccionados
    this.selectedItems.forEach((dia: Dia) => {
      // Iterar sobre las horas
      this.horas.forEach((hora: Hora) => {
        // Marcar todas las celdas correspondientes como disponibles para eliminar la disponibilidad
        this.asignaciones[dia.id][hora.id].eliminarDisponibilidad = true;
      });
    });
  }
  */

}


