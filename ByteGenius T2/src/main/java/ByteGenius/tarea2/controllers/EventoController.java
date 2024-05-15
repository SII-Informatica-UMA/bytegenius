package ByteGenius.tarea2.controllers;

import java.net.URI;
import java.util.List;
import java.util.function.Function;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.dtos.EventoNuevoDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.exceptions.ElementoYaExistenteException;
import ByteGenius.tarea2.services.LogicaEventos;

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
    public EventoDTO getEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {
        return Mapper.toEventoDTO(logicaEventos.getEvento(idEntrenador, idElemento).get());
    }

    @PutMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<EventoDTO> actualizarEvento(@PathVariable Integer idEntrenador,
            @PathVariable Integer idElemento,
            @RequestBody EventoDTO evento) {
        try {
            logicaEventos.updateEvento(idEntrenador, idElemento, Mapper.toEventoId(evento));
            return ResponseEntity.ok().build();
        } catch (ElementoYaExistenteException e) {
            return ResponseEntity.badRequest().build();
        } catch (ElementoNoExisteException e) {
            return ResponseEntity.notFound().build();
        }

    }

    @DeleteMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {
        try {
            logicaEventos.eliminarEvento(idEntrenador, idElemento);
            return ResponseEntity.ok().build();
        } catch (ElementoNoExisteException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{idEntrenador}")
    public List<EventoDTO> getDisponibilidad(@PathVariable Integer idEntrenador) {
        return logicaEventos.getDisponibilidad(idEntrenador).stream().map(Mapper::toEventoDTO).toList();
    }

    @PostMapping("/{idEntrenador}")
    public ResponseEntity<EventoDTO> crearEvento(@PathVariable Integer idEntrenador,
            @RequestBody EventoNuevoDTO eventoNuevo,
            UriComponentsBuilder uriBuilder) {

        Evento evento = Mapper.toEvento(eventoNuevo);
        evento = logicaEventos.addEvento(evento, idEntrenador);
        EventoDTO e = Mapper.toEventoDTO(evento);

        return ResponseEntity.created(e
                .path("/dieta/{id}")
                .buildAndExpand(String.format("/%d", e.getId()))
                .toUri())
                .body(e);
    }

}
