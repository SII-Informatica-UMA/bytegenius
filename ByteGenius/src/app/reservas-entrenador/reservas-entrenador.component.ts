import { Component } from '@angular/core';
import { UsuarioService } from '../horario-entrenador/horario-entrenador.service';
import { HorarioEntrenadorComponent } from '../horario-entrenador/horario-entrenador.component';
import { HashMap } from '../HashMap';
import { CommonModule } from '@angular/common';


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
  constructor(private usuariosService:UsuarioService){
    this.id = usuariosService.getId();
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
