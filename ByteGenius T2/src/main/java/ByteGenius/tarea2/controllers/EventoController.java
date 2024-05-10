
import es.uma.informatica.sii.nivelesinstituto.exceptions.ElementoNoExisteException;
import es.uma.informatica.sii.nivelesinstituto.exceptions.ElementoYaExistenteException;
import es.uma.informatica.sii.nivelesinstituto.exceptions.NivelNoVacioException;
import es.uma.informatica.sii.nivelesinstituto.services.LogicaNiveles;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/niveles")
public class EventoController {

    private LogicaEventos logicaNiveles;

    public EventoController(LogicaEventos logicaNiveles) {
        this.logicaNiveles = logicaNiveles;
    }

    @GetMapping
    public List<Nivel> getNiveles() {
        return logicaNiveles.getNiveles();
    }
    

    @PostMapping()
    public ResponseEntity<Nivel> addNivel(@RequestBody Nombre nivel, UriComponentsBuilder uriBuilder) {
        var nivelEntity = Nivel.builder().nombre(nivel.getNombre()).build();
        nivelEntity = logicaNiveles.addNivel(nivelEntity);
        return ResponseEntity.created(uriBuilder
                .path("/niveles/{id}")
                .buildAndExpand(nivelEntity.getId())
                .toUri())
            .body(nivelEntity);
    }

    @GetMapping("/{id}")
    public Nivel getNivel(@PathVariable Long id) {
        return logicaNiveles.getNivel(id);
    }

    @PutMapping("/{id}")
    public Nivel updateNivel(@PathVariable Long id, @RequestBody Nombre nivel) {
        var nivelEntity = Nivel.builder().nombre(nivel.getNombre()).build();
        nivelEntity.setId(id);
        return logicaNiveles.updateNivel(nivelEntity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteNivel(@PathVariable Long id) {
        logicaNiveles.deleteNivel(id);
    }

    @PostMapping("/{id}/grupos")
    public ResponseEntity<Grupo> addGrupo(@PathVariable Long id, @RequestBody Nombre grupo, UriComponentsBuilder uriBuilder) {
        var grupoEntity = Grupo.builder()
            .nombre(grupo.getNombre())
            .build();
        grupoEntity = logicaNiveles.addGrupo(id, grupoEntity);
        return ResponseEntity.created(uriBuilder
                .path("/niveles/{id}/grupos/{idGrupo}")
                .buildAndExpand(id, grupoEntity.getId())
                .toUri())
            .body(grupoEntity);
    }

    @DeleteMapping("/{id}/grupos/{idGrupo}")
    public void deleteGrupo(@PathVariable Long id, @PathVariable Long idGrupo) {
        logicaNiveles.deleteGrupo(id, idGrupo);
    }

    @PutMapping("/{idNivel}/grupos/{idGrupo}")
    public Grupo updateGrupo(@PathVariable Long idNivel, @PathVariable Long idGrupo, @RequestBody Nombre grupo) {
        var grupoEntity = Grupo.builder()
            .nombre(grupo.getNombre())
            .id(idGrupo)
            .build();
        return logicaNiveles.updateGrupo(idNivel, grupoEntity);
    }

    @ExceptionHandler(ElementoNoExisteException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleElementoNoExisteException() {
    }

    @ExceptionHandler({ElementoYaExistenteException.class, NivelNoVacioException.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public void handleElementoYaExistenteException() {
    }







}
