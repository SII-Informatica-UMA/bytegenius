package es.uma.informatica.sii.spring.jpa.ByteGenius;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Evento;
import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Entrenador;
import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Cliente;
import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Usuario;
import es.uma.informatica.sii.spring.jpa.ByteGenius.repositories.EventoRepository;
import es.uma.informatica.sii.spring.jpa.ByteGenius.repositories.EntrenadorRepository;
import es.uma.informatica.sii.spring.jpa.ByteGenius.repositories.ClienteRepository;
import es.uma.informatica.sii.spring.jpa.ByteGenius.repositories.UsuarioRepository;

@Component
public class LineaComandos implements CommandLineRunner {
    private EventoRepository eventoRepository;
    private EntrenadorRepository entrenadorRepository;
    private ClienteRepository clienteRepository;
    private UsuarioRepository usuarioRepository;

    public LineaComandos(EventoRepository eventoRepository, EntrenadorRepository entrenadorRepository, ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {
        this.eventoRepository = eventoRepository;
        this.entrenadorRepository = entrenadorRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        for (String s: args) {
            System.out.println(s);
        }

        if (args.length > 0) {
         	for (Evento e: eventoRepository.findByNombre(args[0])) {
         		System.out.println(e);
         	}
         	for (Entrenador e: entrenadorRepository.findByDni(args[0])) {
         		System.out.println(e);
         	}
         	for (Cliente c: clienteRepository.findByDni(args[0])) {
         		System.out.println(c);
         	}
         	for (Usuario u: usuarioRepository.findByNombre(args[0])) {
         		System.out.println(u);
         	}
         }
    }

}
