package ByteGenius.tarea2;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;

import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.repositories.EventoRepository;

@Component
public class LineaComandos implements CommandLineRunner {
    private EventoRepository eventoRepository;

    public LineaComandos(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        for (String s : args) {
            System.out.println(s);
        }

        if (args.length > 0) {
            for (Evento e : eventoRepository.findAllByNombre(args[0])) {
                System.out.println(e);
            }
        }
    }

}
