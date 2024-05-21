package es.uma.informatica.practica3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriBuilderFactory;

import ByteGenius.tarea2.Application;
import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.repositories.EventoRepository;
import ByteGenius.tarea2.security.JwtUtil;

import java.net.URI;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = Application.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("En el servicio de calendario")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class EventosApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Value(value = "${local.server.port}")
    private int port;

    @Autowired
    private JwtUtil jwtUtil;
    private String token;

    @Autowired
    private EventoRepository eventoRepository;

    @BeforeEach
    public void initialize() {
        UserDetails userDetails = jwtUtil.createUserDetails("1", "", Collections.emptyList());
        token = jwtUtil.generateToken(userDetails);
        eventoRepository.deleteAll();
    }

    private URI uri(String scheme, String host, int port, String... paths) {
        UriBuilderFactory ubf = new DefaultUriBuilderFactory();
        UriBuilder ub = ubf.builder()
                .scheme(scheme)
                .host(host).port(port);
        for (String path : paths) {
            ub = ub.path(path);
        }
        return ub.build();
    }

    private RequestEntity<Void> get(String scheme, String host, int port, String path) {
        URI uri = uri(scheme, host, port, path);
        return RequestEntity.get(uri)
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .build();
    }

    private RequestEntity<Void> delete(String scheme, String host, int port, String path) {
        URI uri = uri(scheme, host, port, path);
        return RequestEntity.delete(uri)
                .header("Authorization", "Bearer " + token)
                .build();
    }

    private <T> RequestEntity<T> post(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        return RequestEntity.post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }

    private <T> RequestEntity<T> put(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        return RequestEntity.put(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }

    @Nested
    @DisplayName("cuando no hay Eventos")
    public class EventosVacias {

        @Test
        @DisplayName("devuelve una lista vacia de eventos")
        public void testGetEventosVacios() {
            var peticion = get("http", "localhost", port, "/calendario/1");
            var respuesta = restTemplate.exchange(peticion, new ParameterizedTypeReference<List<EventoDTO>>() {
            });
            assertThat(respuesta.getBody()).isEmpty();
        }

        @Test
        @DisplayName("Devuelve error al obtener un evento concreto")
        public void errorConEventoConcreto() {
            var peticion = get("http", "localhost", port, "/calendario/1/1");
            var respuesta = restTemplate.exchange(peticion, new ParameterizedTypeReference<EventoDTO>() {
            });
            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }

        @Test
        @DisplayName("devuelve error al eliminar un evento que no existe")
        public void eliminarEventoInexistente() {
            var peticion = delete("http", "localhost", port, "/calendario/1/1");
            var respuesta = restTemplate.exchange(peticion, Void.class);
            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }
        @Test
        @DisplayName("devuelve error al intentar borrar un Evento con un IdEntrenador o IDElemento negativos")
        public void eliminarEventoConMalId() {
            var peticion = delete("http", "localhost", port, "/calendario/-1/1");
            var respuesta = restTemplate.exchange(peticion, Void.class);
            assertThat(respuesta.getStatusCode().value()).isEqualTo(400);
        }
    }


}

