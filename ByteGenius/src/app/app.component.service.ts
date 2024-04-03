import { Injectable } from '@angular/core';
import { Usuario } from './Usuario';

@Injectable({
    providedIn: 'root'
  })
  
export class AppComponentService {
    
    private usuarios: Usuario [] = [
        {id:1, nombre: 'Pablo', apellidos:'Muñoz', rol:true},
        {id:2, nombre: 'Victor', apellidos:'Rueda', rol:false},
        {id:3, nombre: 'Juan', apellidos:'Cantero', rol:true},
        {id:4, nombre: 'Jaime', apellidos:'Gar', rol:true}
    ];

    getUsuarios(): Usuario [] {
        return this.usuarios;
    }
}