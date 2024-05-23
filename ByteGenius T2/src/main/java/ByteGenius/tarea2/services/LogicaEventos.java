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

    public List<Evento> getEventos() {
        return eventoRepository.findAll();
    }

    // get /calendario/idEntrenador/idElemento
    public Optional<Evento> getEvento(Long idEntrenador, Long idEvento) {
        try{
//Llamada al servicio de entrenadores con Rest Template
            String url = "http://localhost:8080/entrenador/" + idEntrenador;
            HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
            ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET,entity,EntrenadorDTO.class);
            if(respuesta.getBody().getIdUsuario().toString().equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())){
                return this.eventoRepository.findById(idEvento);
           }else{
            throw new AccesoNoAutorizadoException("No coinciden los idUsuarios");
           }
        }catch(HttpClientErrorException e){
            throw new HttpError("No existe dicho entrenador");

        }
    }

    public Evento Crear_Actualizar_Evento(Evento evento) {
        validarDatosEvento(evento);
        comprobarSolapamiento(evento);
        if (evento.getTipo() == Tipo.CITA)
            comprobarEventoEnFranjaDisponibilidad(evento);
        return (Evento) this.eventoRepository.save(evento);
    }

    public void eliminarEvento(Long idEntrenador, Long idEvento) {
    try {
        // Llamada al servicio de entrenadores con Rest Template
        String url = "http://localhost:8080/entrenador/" + idEntrenador;
        HttpEntity<String> entity = new HttpEntity<>(new org.springframework.http.HttpHeaders());
        ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET, entity, EntrenadorDTO.class);
        
        if (respuesta.getBody().getIdUsuario().toString().equals(SecurityConfguration.getAuthenticatedUser().get().getUsername())) {
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
        return eventoRepository.findAllByIdEntrenador(idEntrenador);
    }

    private void validarDatosEvento(Evento evento) {
        if (evento.getTipo() == null || evento.getInicio() == null || evento.getDuracionMinutos() == null)
            throw new IllegalArgumentException("Faltan datos al evento");
        if (evento.getTipo() == Tipo.CITA) {
            if (evento.getIdCliente() == null)
                throw new IllegalArgumentException(
                        "Para una cita, tiene que tener idCliente, duraciy momento de inicio");
            if (evento.getReglaRecurrencia() != null)
                throw new IllegalArgumentException("Una cita no puede tener recurrencia");
        }
    }

    private void comprobarEventoEnFranjaDisponibilidad(Evento evento) {
        getDisponibilidad(evento.getIdEntrenador()).stream()
                .filter(e -> (((Evento) e).getTipo() == Tipo.DISPONIBILIDAD))
                .filter(e -> ((Evento) e).contiene(evento))
                .findAny()
                .orElseThrow(() -> new NoDisponibleException("El evento no estdentro de una franja de disponibilidad"));
    }

    private void comprobarSolapamiento(Evento evento) {
        Objects.requireNonNull(evento);
        if (evento.getTipo() == Tipo.CITA && getDisponibilidad(evento.getIdEntrenador()).stream()
                .filter(e -> (((Evento) e).getTipo() == Tipo.CITA))
                .filter(e -> (evento.getId() == null || !((Evento) e).getId().equals(evento.getId())))
                .map(e -> (Evento) e)
                .anyMatch(evento::solapa))
            throw new HaySolapamientoException("El evento se solapa con otro evento");
    }

}
