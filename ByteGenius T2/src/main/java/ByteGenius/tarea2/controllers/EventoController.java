package ByteGenius.tarea2.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.dtos.EventoNuevoDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.services.LogicaEventos;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@CrossOrigin
@RequestMapping({ "/calendario" })
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
    public void eliminarEvento(@PathVariable Long idEntrenador, @PathVariable Long idElemento) throws BadRequestException {
        if(idEntrenador  < 0 || idElemento < 0) throw new BadRequestException("ID entrenador o elemento no puede ser negativo");
        this.logicaEventos.eliminarEvento(idEntrenador, idElemento);

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
