import { Injectable } from '@angular/core';
import { Usuario } from './Usuario';

@Injectable({
    providedIn: 'root'
  })
  
export class AppComponentService {
    
    private usuarios: Usuario [] = [
        {id:1, nombre: 'Pablo', apellidos:'Muñoz', rol:'Entrenador'},
        {id:2, nombre: 'Victor', apellidos:'Rueda', rol:'Cliente'}
    ];

    getUsuarios(): Usuario [] {
        return this.usuarios;
    }
}