import { Injectable } from '@angular/core';
import { Usuario } from './Usuario';

@Injectable({
    providedIn: 'root'
  })
  
export class AppComponentService {
    
    private usuarios: Usuario [] = [
        {id:1, nombre: 'Pablo', apellidos:'Muñoz', rol:true},
        {id:2, nombre: 'Victor', apellidos:'Rueda', rol:false}
    ];

    getUsuarios(): Usuario [] {
        return this.usuarios;
    }
}