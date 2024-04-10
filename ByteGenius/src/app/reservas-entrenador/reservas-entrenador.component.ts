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
import { Hora } from '../Hora';



@Component({
  selector: 'app-reservas-entrenador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-entrenador.component.html',
  styleUrl: './reservas-entrenador.component.css'
})
export class ReservasEntrenadorComponent {
  asignaciones = this.usuariosService.getasignaciones();
  reservas:HashMapReservas = {}
  id:number = 1;
  private usuarios:Usuario[] = []
  private horas: Hora[] = [];


  constructor(private usuariosService:UsuarioServiceEntrenador, private usuariosServiceLogin:UsuariosService, private clienteService:UsuarioServiceCliente, private usr:BackendFakeService){
    this.id = usuariosServiceLogin.getSesionID() as number;
    this.horas = usuariosService.getHoras();
    usr.getUsuarios().subscribe(usrs=>{this.usuarios = usrs})
    this.cargarDatos();

  }
  cargarDatos(): void {
    const datosGuardadosReservas = localStorage.getItem('reservasRealizadas');
    if (datosGuardadosReservas) {
      this.reservas = JSON.parse(datosGuardadosReservas);
    }

  }


 

obtenerNombre(id: number): string | undefined {
  const usuarioEncontrado = this.usuarios.find(usuario => usuario.id === id);
  return usuarioEncontrado ? usuarioEncontrado.nombre : undefined;
}

cancelarReserva(idUsuario: number,  idMes: number, idDia: number, idHora: number) {
  if (this.reservas[idUsuario] && this.reservas[idUsuario][idMes] && this.reservas[idUsuario][idMes][idDia] && this.reservas[idUsuario][idMes][idDia][idHora]) {
  
      delete this.reservas[idUsuario][idMes][idDia][idHora];
 
      if (Object.keys(this.reservas[idUsuario][idMes][idDia]).length === 0) {
   
          delete this.reservas[idUsuario][idMes][idDia];
      }

      if (Object.keys(this.reservas[idUsuario][idMes]).length === 0) {

          delete this.reservas[idUsuario][idMes];
      }

      localStorage.setItem('reservasRealizadas', JSON.stringify(this.reservas));
  }
}


obtenerFranjaHoraria(idHora: number): string {
  const horaEncontrada = this.horas.find(hora => hora.id === idHora);
  
  if (!horaEncontrada) {
    console.error(`No se encontró la hora con el ID ${idHora}`);
    return 'Hora no encontrada';
  }

  return horaEncontrada.franjaHoraria;
}

encontrarReservasPorEntrenador(reservas: HashMapReservas, idEntrenadorBuscado: number): {idUsuario:number,idMes:number,idDia:number,idHora:number}[] {
  const reservasEncontradas: {idUsuario:number,idMes:number,idDia:number,idHora:number}[] = [];

  // Iterar sobre cada usuario en las reservas
  for (const idUsuario in reservas) {
    // Iterar sobre cada mes para el usuario actual
    for (const idMes in reservas[idUsuario]) {
      // Iterar sobre cada día para el mes actual
      for (const idDia in reservas[idUsuario][idMes]) {
        // Iterar sobre cada hora para el día actual
        for (const idHora in reservas[idUsuario][idMes][idDia]) {
          // Verificar si el idEntrenador coincide con el buscado
          if (reservas[idUsuario][idMes][idDia][idHora].idEntrenador === idEntrenadorBuscado) {
            // Agregar la reserva a la lista de reservas encontradas
            reservasEncontradas.push({
              idUsuario: parseInt(idUsuario),
              idMes: parseInt(idMes),
              idDia: parseInt(idDia),
              idHora: parseInt(idHora)
            });
          }
        }
      }
    }
  }




  return reservasEncontradas;
}






}
