import { Injectable } from "@angular/core";
import { Login, UsuarioSesion, Rol, RolCentro } from "../entities/login";
import { Observable, of, forkJoin, concatMap, lastValueFrom } from "rxjs";
import {map} from 'rxjs/operators';
import * as jose from 'jose';

import { Usuario } from "../entities/usuario";
import { BackendFakeService } from "./backend.fake.service";
import { BackendService } from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  _rolCentro?: RolCentro;
  entrenadores:Usuario[]=[];

  constructor(private backend: BackendFakeService) {}

  doLogin(login: Login): Observable<UsuarioSesion> {
    let jwtObs = this.backend.login(login.email, login.password);
    let usuarioObs = jwtObs.pipe(concatMap(jwt=>this.backend.getUsuario(this.getUsuarioIdFromJwt(jwt))));
    let join = forkJoin({jwt: jwtObs, usuario: usuarioObs});
    let usuarioSesion = join.pipe(map(obj => {
      return {
        id: obj.usuario.id,
        nombre: obj.usuario.nombre,
        apellido1: obj.usuario.apellido1,
        apellido2: obj.usuario.apellido2,
        email: obj.usuario.email,
        roles: obj.usuario.administrador?[{rol: Rol.ADMINISTRADOR}]:[],
        jwt: obj.jwt
      };
    }));
    return usuarioSesion
    .pipe(concatMap(usuarioSesion=>this.completarConRoles(usuarioSesion)))
    .pipe(map(usuarioSesion=>{
      localStorage.setItem('usuario', JSON.stringify(usuarioSesion));
      if (usuarioSesion.roles.length > 0) {
        this.rolCentro = usuarioSesion.roles[0];
      } else {
        this.rolCentro = undefined;
      }
      return usuarioSesion;
    }));

  }

  private completarConRoles(usuarioSesion: UsuarioSesion): Observable<UsuarioSesion> {
    if(usuarioSesion.id==2 || usuarioSesion.id==8){
      usuarioSesion.roles.push({rol:Rol.CLIENTE});
    }else if(usuarioSesion.id==3 || usuarioSesion.id==4 || usuarioSesion.id==5 || usuarioSesion.id==6 || usuarioSesion.id==7){
      usuarioSesion.roles.push({rol:Rol.ENTRENADOR});
      this.entrenadores.push({id: usuarioSesion.id, nombre: usuarioSesion.nombre, apellido1: usuarioSesion.apellido1,
        apellido2: usuarioSesion.apellido2, email:usuarioSesion.email, password:usuarioSesion.jwt, administrador:false
      })
    }
    return of(usuarioSesion);
  }


  private getUsuarioIdFromJwt(jwt: string): number {
    let payload = jose.decodeJwt(jwt);
    console.log("Payload: "+JSON.stringify(payload));
    let id = payload.sub;
    if (id == undefined) {
      return 0;
    } else {
      return parseInt(id);
    }
  }

  getSesionID(){
    return this.getUsuarioSesion()?.id;
  }

  get rolCentro(): RolCentro | undefined {
    return this._rolCentro;
  }

  set rolCentro(r: RolCentro | undefined) {
    this._rolCentro = r;
  }

  getUsuarioSesion(): UsuarioSesion | undefined {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : undefined;
  }

  doLogout() {
    localStorage.removeItem('usuario');
  }

  doForgottenPassword(email: string): Observable<void> {
    return this.backend.forgottenPassword(email);
  }

  doCambiarContrasenia(password: string, token: string): Promise<void> {
    return lastValueFrom(this.backend.resetPassword(token, password),{defaultValue:undefined});
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backend.getUsuarios();
  }

  editarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.backend.putUsuario(usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.backend.deleteUsuario(id);
  }

  aniadirUsuario(usuario: Usuario): Observable<Usuario> {
    return this.backend.postUsuario(usuario);
  }

  getArrayEntrenadores():Usuario[]{
    return this.entrenadores;
  }



}