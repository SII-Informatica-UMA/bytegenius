package es.uma.informatica.practica3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.reactive.server.MockServerClientHttpResponse;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriBuilderFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ByteGenius.tarea2.Application;
import ByteGenius.tarea2.dtos.EntrenadorDTO;
import ByteGenius.tarea2.dtos.EventoDTO;
import ByteGenius.tarea2.entities.Evento;
import ByteGenius.tarea2.entities.Tipo;
import ByteGenius.tarea2.repositories.EventoRepository;
import ByteGenius.tarea2.security.JwtUtil;
import ByteGenius.tarea2.services.LogicaEventos;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = Application.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("En el servicio de calendario")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class EventosApplicationTests {

    private MockRestServiceServer mockserver;
    private ObjectMapper mapper = new ObjectMapper();
    @Autowired
    private RestTemplate restTemplate;

    @Value(value = "${local.server.port}")
    private int port;

    @Autowired
    private TestRestTemplate rt;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private LogicaEventos logEv;

    @BeforeEach
    public void initialize() {

        eventoRepository.deleteAll();

        mockserver = MockRestServiceServer.createServer(restTemplate);
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
        UserDetails userDetails = jwtUtil.createUserDetails("2", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.get(uri)
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .build();
    }

    private RequestEntity<Void> delete(String scheme, String host, int port, String path) {
        URI uri = uri(scheme, host, port, path);
        UserDetails userDetails = jwtUtil.createUserDetails("2", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.delete(uri)
                .header("Authorization", "Bearer " + token)
                .build();
    }

    private <T> RequestEntity<T> post(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        UserDetails userDetails = jwtUtil.createUserDetails("2", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }

    private <T> RequestEntity<T> put(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        UserDetails userDetails = jwtUtil.createUserDetails("2", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.put(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }

    @Nested
    @DisplayName("cuando no hay Eventos")
    public class EventosVacias {

        @Test
        @DisplayName("Devuelve null cuando la base de datos está vacía al intentar acceder a un evento")
        public void obtenerEventoConcretoBaseDatosVacia() {
            EntrenadorDTO engr = new EntrenadorDTO();
            engr.setIdUsuario(2L);
            try {
                mockserver
                        .expect(ExpectedCount.once(),
                                requestTo(new URI("http://localhost:8080/entrenador/" + engr.getIdUsuario())))
                        .andExpect(method(HttpMethod.GET))
                        .andRespond(withStatus(HttpStatus.OK)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(mapper.writeValueAsString(engr)));
                        
                                mockserver
                                .expect(ExpectedCount.once(),
                                        requestTo(new URI("http://localhost:8080/calendario/" + engr.getIdUsuario())))
                                .andExpect(method(HttpMethod.POST))
                                .andRespond(withStatus(HttpStatus.CREATED));
            } catch (URISyntaxException e) {
                e.printStackTrace();
            } catch (JsonProcessingException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            var peticion = get("http", "localhost", port, "/calendario/" + engr.getIdUsuario() + "/" + 1);
            var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<EventoDTO>() {
            });

            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }

        @Test
        @DisplayName("No elimina evento cuando la base de datos está vacía")
        public void eliminarEventoNoExistenteBaseDatosVacia() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);

            try {
                mockserver
                        .expect(ExpectedCount.once(),
                                requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
                        .andExpect(method(HttpMethod.GET))
                        .andRespond(withStatus(HttpStatus.CREATED));

            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            var peticion = delete("http", "localhost", port, "/calendario/" + entr.getIdUsuario() + "/" + 2);

            ResponseEntity<Void> respuesta = rt.exchange(peticion, new ParameterizedTypeReference<Void>() {
            });

            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }

        @Test
        @DisplayName("Inserta correctamente un evento")
        public void insertarEvento() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);

            Evento evento = Evento.builder()
                    .nombre("Prueba de evento")
                    .inicio(new Date())
                    .id(2L)
                    .tipo(Tipo.DISPONIBILIDAD)
                    .lugar("Pepe")
                    .duracionMinutos(120)
                    .idCliente(2L)
                    .build();

            // Configuramos el mock para la llamada al servicio de entrenador
            try {
                mockserver
                .expect(ExpectedCount.once(),
                        requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(entr)));

            } catch (URISyntaxException | JsonProcessingException e) {
                e.printStackTrace();
            }

            // Realizamos la solicitud para insertar el evento
            var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

            // Realizamos la llamada al servicio
            var respuesta = rt.exchange(request, Void.class);

            // Verificamos que la respuesta sea exitosa
            assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
            assertThat(respuesta.getHeaders().get("Location").get(0))
                    .startsWith("http://localhost:" + port + "/calendario");

            // Verificamos que el evento se haya insertado correctamente en la base de datos
            List<Evento> eventosBD = eventoRepository.findAll();
            assertThat(eventosBD.get(0).getNombre()).isEqualTo(evento.getNombre());
            // Agrega más aserciones según sea necesario para verificar otros campos del
            // evento
        }

    }

    @Nested
    @DisplayName("cuando hay Eventos")
    public class EventosNoVacios {
        private Evento evento;
        private Evento evento2;

        @BeforeEach
        public void insertarDatos() {
            evento = Evento.builder()
                    .nombre("Reunión de equipo")
                    .inicio(new Date())
                    .tipo(Tipo.CITA)
                    .build();

            evento2 = Evento.builder()
                    .nombre("Entrenamiento de fútbol")
                    .descripcion("Entrenamiento táctico para mejorar la defensa")
                    .lugar("Campo de fútbol municipal")
                    .inicio(new Date())
                    .duracionMinutos(90)
                    .tipo(Tipo.DISPONIBILIDAD)
                    .build();
            evento2.setId(2L);
            evento2.setIdEntrenador(2L);
            evento2.setIdCliente(2L);

            evento = eventoRepository.save(evento);
            evento2 = eventoRepository.save(evento2);
        }

        @Test
        @DisplayName("Devuelve evento concreto")
        public void obtenerEventoConcreto() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);
            try {
                mockserver
                        .expect(ExpectedCount.once(),
                                requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
                        .andExpect(method(HttpMethod.GET))
                        .andRespond(withStatus(HttpStatus.OK)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(mapper.writeValueAsString(entr)));

            } catch (JsonProcessingException | URISyntaxException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            var peticion = get("http", "localhost", port, "/calendario/" + entr.getIdUsuario() + "/" + evento2.getId());
            var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<EventoDTO>() {
            });

            assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
        }

        @Test
        @DisplayName("Elimina evento existente")
        public void eliminarEventoExistente() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);

            try {
                mockserver
                        .expect(ExpectedCount.once(),
                                requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
                        .andExpect(method(HttpMethod.GET))
                        .andRespond(withStatus(HttpStatus.OK)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(mapper.writeValueAsString(entr)));
            } catch (JsonProcessingException | URISyntaxException e) {
                e.printStackTrace();
            }
            var peticion = delete("http", "localhost", port,
                    "/calendario/" + entr.getIdUsuario() + "/" + evento2.getId());

            ResponseEntity<Void> respuesta = rt.exchange(peticion, new ParameterizedTypeReference<Void>() {

            });
            System.out.println("Aqui llego: " + respuesta + " Peticion: " + peticion);

            assertThat(respuesta.getStatusCode().value()).isEqualTo(200);

            assertThat(eventoRepository.findById(evento2.getId()).isPresent()).isFalse();
        }
        @Test
        @DisplayName("Modifica evento concreto")
        public void modificarEvento() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);

            Evento evento = Evento.builder()
                    .nombre("Prueba de evento2")
                    .inicio(new Date())
                    .id(2L)
                    .tipo(Tipo.DISPONIBILIDAD)
                    .lugar("Pe")
                    .duracionMinutos(120)
                    .idCliente(3L)
                    .build();

            // Configuramos el mock para la llamada al servicio de entrenador
            try {
                mockserver
                .expect(ExpectedCount.once(),
                        requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(mapper.writeValueAsString(entr)));

            } catch (URISyntaxException | JsonProcessingException e) {
                e.printStackTrace();
            }

            // Realizamos la solicitud para insertar el evento
            var request = put("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

            // Realizamos la llamada al servicio
            var respuesta = rt.exchange(request, Void.class);

            // Verificamos que la respuesta sea exitosa
            assertThat(respuesta.getStatusCode().value()).isEqualTo(200);


            // Verificamos que el evento se haya insertado correctamente en la base de datos
            List<Evento> eventosBD = eventoRepository.findAll();
            assertThat(eventosBD.get(2).getNombre()).isEqualTo(evento.getNombre());
            // Agrega más aserciones según sea necesario para verificar otros campos del
            // evento
        }

    }

}
