import { Component } from '@angular/core';
import { UsuarioServiceEntrenador } from '../horario-entrenador/horario-entrenador.service';
import { HorarioEntrenadorComponent } from '../horario-entrenador/horario-entrenador.component';
import { HashMap } from '../HashMap';
import { CommonModule } from '@angular/common';
import {UsuariosService} from '../services/usuarios.service';


@Component({
  selector: 'app-reservas-entrenador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-entrenador.component.html',
  styleUrl: './reservas-entrenador.component.css'
})
export class ReservasEntrenadorComponent {
  asignaciones = this.usuariosService.getasignaciones();
  id:number = 1;
  constructor(private usuariosService:UsuarioServiceEntrenador, private usuariosServiceLogin:UsuariosService){
    this.id = usuariosServiceLogin.getSesionID() as number;
  }


  obtenerDiasYHoras(hashMap: HashMap, idTrainer: number): { dia: number, hora: number }[] {
    const diasYHoras: { dia: number, hora: number }[] = [];
    
    // Recorrer el HashMap
    for (const idDia in hashMap) {
      const horas = hashMap[idDia];
      for (const idHora in horas) {
        const trainers = horas[idHora].idTrainers;
        if (trainers.includes(idTrainer)) {
          diasYHoras.push({ dia: parseInt(idDia), hora: parseInt(idHora) });
        }
      }
    }
    
    return diasYHoras;
  }

}
