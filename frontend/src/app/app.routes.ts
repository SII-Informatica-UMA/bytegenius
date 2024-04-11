import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ListadoUsuarioComponent } from './listado-usuario/listado-usuario.component';
import { PrincipalComponent } from './principal/principal.component';
import { HorarioEntrenadorComponent } from './horario-entrenador/horario-entrenador.component';
import { HorarioClienteComponent } from './horario-cliente/horario-cliente.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgotten-password',
    component: ForgottenPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'usuarios',
    component: ListadoUsuarioComponent
  },
  {
    path: '',
    component: PrincipalComponent
  },
  {
    path: 'entrenador',
    component: HorarioEntrenadorComponent
  },
  {
    path: 'cliente',
    component: HorarioClienteComponent
  }
];
