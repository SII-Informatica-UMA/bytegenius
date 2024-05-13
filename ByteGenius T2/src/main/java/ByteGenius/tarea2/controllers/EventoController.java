package ByteGenius.tarea2.controllers;

import java.net.URI;
import java.util.List;
import java.util.function.Function;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
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
    public Evento getEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {

        return logicaEventos.getEvento(idEntrenador, idElemento);

    }

    @PutMapping("/{idEntrenador}/{idElemento}")
    public void actualizarEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento,
            @RequestBody Evento evento) {
        var eventoEntity = Evento.builder()
                .nombre(evento.getNombre())
                .descripción(evento.getDescripción())
                .lugar(evento.getLugar())
                .duracionMinutos(evento.getDuracionMinutos())
                .inicio(evento.getInicio())
                .IdEntrenador(idEntrenador)
                .reglaRecurrencia(evento.getReglaRecurrencia())
                .build();
        eventoEntity.setId(idElemento);
        logicaEventos.updateEvento(idEntrenador, idElemento, eventoEntity);
    }

    @DeleteMapping("/{idEntrenador}/{idElemento}")
    public void eliminarEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {
        logicaEventos.eliminarEvento(idEntrenador, idElemento);
    }

    @GetMapping("/{idEntrenador}")
    public List<Evento> getDisponibilidad(@PathVariable Integer idEntrador) {
        return logicaEventos.getDisponibilidad(idEntrador);
    }

    @PostMapping("/{idEntrenador}")
    public ResponseEntity<Evento> crearEvento(@PathVariable Integer idEntrenador, @RequestBody Evento evento) {
        var eventoEntity = Evento.builder()
                .descripción(evento.getDescripción())
                .duracionMinutos(evento.getDuracionMinutos())
                .inicio(evento.getInicio())
                .nombre(evento.getNombre())
                .observaciones(evento.getObservaciones())
                .lugar(evento.getLugar())
                .reglaRecurrencia(evento.getReglaRecurrencia())
                .tipo(evento.getTipo())
                .idCliente(evento.getIdCliente())
                .IdEntrenador(idEntrenador).build();

        eventoEntity = logicaEventos.addEvento(eventoEntity, idEntrenador);
    }

}
