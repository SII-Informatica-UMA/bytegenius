package ByteGenius.tarea2.controllers;

import java.net.URI;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.dtos.EventoNuevoDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.exceptions.ElementoYaExistenteException;
import ByteGenius.tarea2.services.LogicaEventos;

import java.net.URI;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/calendario")
public class EventoController {

    private LogicaEventos logicaEventos;

    public EventoController(LogicaEventos logicaEventos) {
        this.logicaEventos = logicaEventos;
    }

    @GetMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<EventoDTO> getEvento(@PathVariable Long idEntrenador, @PathVariable Long idElemento) {
        return ResponseEntity.of(this.logicaEventos.getEvento(idEntrenador, idElemento).map(Mapper::toEventoDTO));
    }

    @PutMapping("/{idEntrenador}/{idElemento}")
    public EventoDTO actualizarEvento(@PathVariable Long idEntrenador,
            @PathVariable Long idElemento,
            @RequestBody EventoDTO evento) {

        this.logicaEventos.getEvento(idEntrenador, idElemento).orElseThrow(ElementoNoExisteException::new);
        Evento e = Mapper.toEventoId(evento);
        e.setId(idElemento);
        e.setIdEntrenador(idEntrenador);
        return Mapper.toEventoDTO(this.logicaEventos.Crear_Actualizar_Evento(e));
    }

    @DeleteMapping("/{idEntrenador}/{idElemento}")
    public void eliminarEvento(@PathVariable Long idEntrenador, @PathVariable Long idElemento) {
        this.logicaEventos.getEvento(idEntrenador, idElemento).orElseThrow(ElementoNoExisteException::new);

    }

    @GetMapping("/{idEntrenador}")
    public List<EventoDTO> getDisponibilidad(@PathVariable(value = "idEntrenador", required = true) Long idEntrenador) {
        List<Evento> disponibilidad = logicaEventos.getDisponibilidad(idEntrenador).get();
        return disponibilidad.stream().map(Mapper::toEventoDTO).collect(Collectors.toList());
    }

    @PostMapping("/{idEntrenador}")
    public ResponseEntity<EventoDTO> crearEvento(@PathVariable Long idEntrenador,
            @RequestBody EventoNuevoDTO eventoNuevoDTO, UriComponentsBuilder uriBuilder) {

        Evento evento = Mapper.toEvento(eventoNuevoDTO);
        evento.setIdEntrenador(idEntrenador);
        evento = this.logicaEventos.Crear_Actualizar_Evento(evento);
        EventoDTO e = Mapper.toEventoDTO(evento);

        return ResponseEntity.created(uriBuilder.path("/calendario/{idEntrenador}")
                .buildAndExpand(idEntrenador, e.getId()).toUri()).body(e);

    }

}
