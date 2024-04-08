import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Login } from '../entities/login';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginInfo: Login = {email: '', password: ''};
  error: string = '';

  constructor(private usuarioService: UsuariosService, private router: Router) {}

  login() {
    this.usuarioService.doLogin(this.loginInfo).subscribe({
      next: (usuario) => {
        if (usuario.roles[0].rol === 'administrador') {
;          this.router.navigateByUrl('/');
        } else if (usuario.roles[0].rol === 'cliente') {
          this.router.navigateByUrl('cliente');
        } else if (usuario.roles[0].rol === 'entrenador') {
          this.router.navigateByUrl('entrenador');
        }
      },
      error: (error) => {
        this.loginInfo = {email: '', password: ''};
        if (error.status === 401) {
          this.error = 'Usuario o contraseña incorrectos';
        } else {
          this.error = error.statusText;
        }
      }
    });
  }

  get usuario() {
    return this.usuarioService.getUsuarioSesion();
  }
  

}
