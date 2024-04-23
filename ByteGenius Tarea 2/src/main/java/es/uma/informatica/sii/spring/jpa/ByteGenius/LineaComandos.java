package es.uma.informatica.sii.spring.jpa.ByteGenius;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import es.uma.informatica.sii.spring.jpa.ByteGenius.entities.Evento;
import es.uma.informatica.sii.spring.jpa.ByteGenius.repositories.EventoRepository;

@Component
public class LineaComandos implements CommandLineRunner {
	private EventoRepository repository;
	public LineaComandos(EventoRepository repository) {
		this.repository = repository;
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {

		for (String s: args) {
			System.out.println(s);
		}

		if (args.length > 0) {
			for (Evento b: repository.findByNombre(args[0])) {
				System.out.println(b);
			}
		}
	}

}
