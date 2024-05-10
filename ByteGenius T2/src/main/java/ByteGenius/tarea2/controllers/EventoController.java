package ByteGenius.tarea2.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.exceptions.ElementoNoExisteException;
import ByteGenius.tarea2.services.LogicaEventos;

@RestController
@RequestMapping("/calendario")
public class EventoController {

    private LogicaEventos logicaEventos;

    public EventoController(LogicaEventos logicaEventos) {
        this.logicaEventos = logicaEventos;
    }

     @GetMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<Evento> getEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {
       
        Evento evento = logicaEventos.getEvento(idEntrenador, idElemento);

        if (evento == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(evento);
    }

    @PutMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<Evento> actualizarEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento, @RequestBody Evento eventoActualizado) {
        try {
            logicaEventos.updateEvento(idEntrenador, idElemento, eventoActualizado);
            return ResponseEntity.noContent().build();
        } catch (ElementoNoExisteException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idEntrenador}/{idElemento}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Integer idEntrenador, @PathVariable Integer idElemento) {
        try {
            logicaEventos.eliminarEvento(idEntrenador, idElemento);
            return ResponseEntity.noContent().build();
        } catch (ElementoNoExisteException e) {
            return ResponseEntity.notFound().build();
        } 
    }




    




}
