import { Component } from '@angular/core';
import { UsuarioServiceEntrenador } from '../horario-entrenador/horario-entrenador.service';
import { HorarioEntrenadorComponent } from '../horario-entrenador/horario-entrenador.component';
import { HashMap } from '../HashMap';
import { CommonModule } from '@angular/common';
import {UsuariosService} from '../services/usuarios.service';
import { UsuarioServiceCliente } from '../horario-cliente/horario-cliente.service';
import { HashMapReservas } from '../HashMapReservas';
import { Usuario } from '../entities/usuario';
import { BackendFakeService } from '../services/backend.fake.service';
import { Observable, map } from 'rxjs';



@Component({
  selector: 'app-reservas-entrenador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-entrenador.component.html',
  styleUrl: './reservas-entrenador.component.css'
})
export class ReservasEntrenadorComponent {
  asignaciones = this.usuariosService.getasignaciones();
  reservas = {}
  id:number = 1;
  private usuarios:Usuario[] = []
  constructor(private usuariosService:UsuarioServiceEntrenador, private usuariosServiceLogin:UsuariosService, private clienteService:UsuarioServiceCliente, private usr:BackendFakeService){
    this.id = usuariosServiceLogin.getSesionID() as number;
    usr.getUsuarios().subscribe(usrs=>{this.usuarios = usrs})
    this.cargarDatos();
  }
  cargarDatos(): void {
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }

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

  obtenerHorasYDiaPorEntrenador(reservas: HashMapReservas, idEntrenadorBuscado: number): { idUsuario: number, idDia: number, idHora: number }[] {
    const horasYDia: { idUsuario: number, idDia: number, idHora: number }[] = [];
    for (const idUsuario in reservas) {
        const usuario = reservas[idUsuario];
        for (const idDia in usuario) {
            const dia = usuario[idDia];
            for (const idHora in dia) {
                const asignacion = dia[idHora];
                if (asignacion.idEntrenador === idEntrenadorBuscado) {
                    horasYDia.push({ idUsuario: Number(idUsuario), idDia: Number(idDia), idHora: Number(idHora) });
                }
            }
        }
    }
    return horasYDia;
}



obtenerNombre(id: number): string | undefined {
  const usuarioEncontrado = this.usuarios.find(usuario => usuario.id === id);
  return usuarioEncontrado ? usuarioEncontrado.nombre : undefined;
}


encontrarReservasPorEntrenador(reservas: HashMapReservas, idEntrenadorBuscado: number): {idUsuario:number,idDia:number,idHora:number}[] {
  const reservasEncontradas: {idUsuario:number,idDia:number,idHora:number}[] = [];

  // Iterar sobre cada usuario en las reservas
  for (const idUsuario in reservas) {
      // Iterar sobre cada día para el usuario actual
      for (const idDia in reservas[idUsuario]) {
          // Iterar sobre cada hora para el día actual
          for (const idHora in reservas[idUsuario][idDia]) {
              // Verificar si el idEntrenador coincide con el buscado
              if (reservas[idUsuario][idDia][idHora].idEntrenador === idEntrenadorBuscado) {
                  // Agregar la reserva a la lista de reservas encontradas
                  reservasEncontradas.push({
                      idUsuario: parseInt(idUsuario),
                      idDia: parseInt(idDia),
                      idHora: parseInt(idHora)
                  });
              }
          }
      }
  }
  
  return reservasEncontradas;
}

}
