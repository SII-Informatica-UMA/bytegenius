package ByteGenius.tarea2.services;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;

import ByteGenius.tarea2.dtos.EntrenadorDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.entities.Tipo;
import ByteGenius.tarea2.repositories.EventoRepository;
import ByteGenius.tarea2.security.JwtUtil;
import ByteGenius.tarea2.security.SecurityConfguration;
import ByteGenius.tarea2.exceptions.*;

import java.net.http.HttpHeaders;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class LogicaEventos {
    private EventoRepository eventoRepository;

    @Autowired
    private RestTemplate rt;
    @Autowired
    private JwtUtil jwt;

    public LogicaEventos(EventoRepository repo) {
        this.eventoRepository = repo;
    }

    // get /calendario/idEntrenador/idElemento
    public Optional<Evento> getEvento(Long idEntrenador, Long idEvento) {
        try {
            // Llamada al servicio de entrenadores con Rest Template
            String url = "http://localhost:8080/entrenador/" + idEntrenador;
            HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
            ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET, entity, EntrenadorDTO.class);
            if (respuesta.getBody().getIdUsuario().toString()
                    .equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())) {
                return this.eventoRepository.findById(idEvento);
            } else {
                throw new AccesoNoAutorizadoException("No coinciden los idUsuarios");
            }
        } catch (HttpClientErrorException e) {
            throw new HttpError("No existe dicho entrenador");

        }
    }

    public Evento Crear_Actualizar_Evento(Evento evento) {
        Evento eventoP = eventoRepository.save(evento);

        try {
            validarDatosEvento(evento);
        } catch (IllegalArgumentException e) {
            eventoRepository.delete(evento);
            throw new IllegalArgumentException("Los datos del evento no son válidos", e);
        }

        try {
            comprobarSolapamientoONoDisponibilidad(evento);
        } catch (HaySolapamientoException e) {
            eventoRepository.delete(evento);

            throw new HaySolapamientoException("El evento se solapa con otro evento existente");
        } catch (NoDisponibleException e) {
            eventoRepository.delete(evento);

            throw new NoDisponibleException("El evento está fuera de la franja de disponibilidad");
        }

        try {
            String url = "http://localhost:8080/entrenador/" + evento.getIdEntrenador();
            HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
            ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET, entity, EntrenadorDTO.class);

            if (respuesta.getBody().getIdUsuario().toString()
                    .equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())) {
                return eventoP;
            } else {
                eventoRepository.delete(eventoP);
                throw new AccesoNoAutorizadoException("No coinciden los idUsuarios");
            }
        } catch (HttpClientErrorException e) {
            eventoRepository.delete(eventoP);

            throw new HttpError("No existe dicho entrenador");
        }
    }

    public void eliminarEvento(Long idEntrenador, Long idEvento) {
        try {
            String url = "http://localhost:8080/entrenador/" + idEntrenador;
            HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
            ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET, entity, EntrenadorDTO.class);

            if (respuesta.getBody().getIdUsuario().toString()
                    .equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())) {
                Optional<Evento> evento = this.eventoRepository.findById(idEvento);
                if (evento.isPresent()) {
                    this.eventoRepository.deleteById(idEvento);
                } else {
                    throw new ElementoNoExisteException("Evento no existente");
                }
            } else {
                throw new AccesoNoAutorizadoException("No coinciden los idUsuarios");
            }
        } catch (HttpClientErrorException e) {
            throw new HttpError("No existe dicho entrenador");
        }
    }

    public Optional<List<Evento>> getDisponibilidad(Long idEntrenador) {

        try {
            String url = "http://localhost:8080/entrenador/" + idEntrenador;
            HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
            ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET, entity, EntrenadorDTO.class);

            if (respuesta.getBody().getIdUsuario().toString()
                    .equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())) {
                return eventoRepository.findAllByIdEntrenador(idEntrenador);
            } else {
                throw new AccesoNoAutorizadoException("No coinciden los idUsuarios");
            }
        } catch (HttpClientErrorException e) {
            throw new HttpError("No existe dicho entrenador");
        }
    }

    private void validarDatosEvento(Evento evento) {
        if (evento.getTipo() == null || evento.getInicio() == null || evento.getDuracionMinutos() == null)
            throw new IllegalArgumentException("Faltan datos al evento");
        if (evento.getTipo() == Tipo.CITA) {
            if (evento.getIdCliente() == null)
                throw new IllegalArgumentException("Para una cita, tiene que tener idCliente");
        }
    }

    private void comprobarSolapamientoONoDisponibilidad(Evento evento) {
        Objects.requireNonNull(evento);
        if (evento.getTipo() == Tipo.CITA) {
            Optional<List<Evento>> disponibilidad = getDisponibilidad(evento.getIdEntrenador());
            for (Evento e : disponibilidad.get()) {
                if (e.getTipo() == Tipo.CITA && !e.getId().equals(evento.getId()) && evento.solapa(e)) {
                    throw new HaySolapamientoException("El evento se solapa con otro evento");
                }
                if (evento.getTipo() == Tipo.CITA && e.getTipo() == Tipo.DISPONIBILIDAD && !e.contiene(evento)) {
                    throw new NoDisponibleException("Evento no disponbile");
                }
            }
        }
    }

}
