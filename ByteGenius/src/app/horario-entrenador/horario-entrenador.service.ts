import { Usuario } from "../Usuario";

export class UsuarioService {
    private usuarios: Usuario [] = [
        {id:1, nombre: 'Pablo', apellidos:'Muñoz', rol:'Entrenador'},
        {id:2, nombre: 'Victor', apellidos:'Rueda', rol:'Cliente'}
    ];
    constructor() { }

    getUsuarios(): Usuario [] {
      return this.usuarios;
    }

    
}
