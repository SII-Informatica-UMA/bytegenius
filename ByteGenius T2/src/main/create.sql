create table evento (duracion_minutos integer, id_cliente integer, id_entrenador integer, id_evento integer not null, inicio date, descripcion varchar(255), lugar varchar(255), nombre varchar(255) not null, observaciones varchar(255), regla_recurrencia varchar(255), tipo varchar(255) check (tipo in ('DISPONIBILIDAD','CITA')), primary key (id_evento));
 