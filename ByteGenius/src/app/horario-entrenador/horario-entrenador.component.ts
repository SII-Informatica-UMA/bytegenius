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

  // Función para el evento (click) del botón "Guardar Disponibilidad"
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

      // Notificar al usuario que la disponibilidad se ha guardado correctamente (puedes implementar una notificación específica aquí)
      alert('La disponibilidad se ha guardado correctamente.');
    } else {
      // Si no hay días seleccionados o la hora de inicio es mayor o igual a la hora de fin, mostrar un mensaje de error
      alert('Por favor, seleccione al menos un día y asegúrese de que la hora de inicio sea menor a la hora de fin.');
    }
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
}


