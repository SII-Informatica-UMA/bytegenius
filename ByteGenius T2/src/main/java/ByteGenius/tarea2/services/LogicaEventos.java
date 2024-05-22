package ByteGenius.tarea2.services;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import ByteGenius.tarea2.dtos.EntrenadorDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.entities.Tipo;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.exceptions.HaySolapamientoException;
import ByteGenius.tarea2.exceptions.NoDisponibleException;
import ByteGenius.tarea2.repositories.EventoRepository;
import ByteGenius.tarea2.security.JwtUtil;

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
    public Optional<Evento> getEvento(Long idEntrenador, Long idEvento,String token) {
        //Llamada al servicio de entrenadores con Rest Template
        String url = "http://localhost:8080/entrenador/" + idEntrenador;
        org.springframework.http.HttpHeaders header = new org.springframework.http.HttpHeaders();
        header.set("Authoritation",token);
        HttpEntity<String> entity = new HttpEntity<>(header);
        ResponseEntity<EntrenadorDTO> respuesta = rt.exchange(url, HttpMethod.GET,entity,EntrenadorDTO.class);
        if(respuesta.getStatusCode() != HttpStatus.OK){
            throw new ElementoNoExisteException("No existe dicho entrenador");
        }
        else{

            if(!jwt.getUsernameFromToken(token).equals(respuesta.getBody().getIdUsuario())){
                throw new NoDisponibleException("No coincide el id del token con el del entrenador");
            }
        }
        return this.eventoRepository.findById(idEntrenador);
    }

    public Evento Crear_Actualizar_Evento(Evento evento) {
        validarDatosEvento(evento);
        comprobarSolapamiento(evento);
        if (evento.getTipo() == Tipo.CITA)
            comprobarEventoEnFranjaDisponibilidad(evento);
        return (Evento) this.eventoRepository.save(evento);
    }

    // Delete /calendario/idEntrenador/idElemento
    public void eliminarEvento(Long idEntrenador, Long idEvento) {
        var evento = eventoRepository.findById(idEntrenador);
        if (evento.isPresent()) {
            eventoRepository.deleteById(idEntrenador);
        } else {
            throw new ElementoNoExisteException("Evento no existente");
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
