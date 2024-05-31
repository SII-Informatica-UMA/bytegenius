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
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
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
import org.springframework.web.client.HttpClientErrorException;
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
import ByteGenius.tarea2.exceptions.AccesoNoAutorizadoException;
import ByteGenius.tarea2.exceptions.HttpError;
import ByteGenius.tarea2.repositories.EventoRepository;
import ByteGenius.tarea2.security.JwtUtil;
import ByteGenius.tarea2.services.LogicaEventos;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@AutoConfigureMockMvc
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
                @DisplayName("error al acceder a un evento concreto")
                public void obtenerEventoConcretoBaseDatosVacia() {
                        EntrenadorDTO engr = new EntrenadorDTO();
                        engr.setIdUsuario(2L);
                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + engr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(engr)));

                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/calendario/"
                                                                                + engr.getIdUsuario())))
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
                @DisplayName("error al eliminar evento inexistente")
                public void eliminarEventoNoExistenteBaseDatosVacia() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = delete("http", "localhost", port,
                                        "/calendario/" + entr.getIdUsuario() + "/" + 2);

                        ResponseEntity<Void> respuesta = rt.exchange(peticion, new ParameterizedTypeReference<Void>() {
                        });

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
                }

                @Test
                @DisplayName("error al no encontrar el entrenador al eliminar un evento")
                public void eliminarEventoEntrenadorNoEncontrado() {
                        Long idEntrenador = 1L;
                        Long idEvento = 1L;

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + idEntrenador)))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.NOT_FOUND));

                        } catch (URISyntaxException e) {
                                e.printStackTrace();
                        }

                        var peticion = delete("http", "localhost", port,
                                        "/calendario/" + idEntrenador + "/" + idEvento);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                }

                @Test
                @DisplayName("error al no tener acceso para eliminar un evento")
                public void eliminarEventoSinAcceso() {
                        Long idEntrenador = 1L;
                        Long idEvento = 1L;

                        EntrenadorDTO entrenadorDTO = new EntrenadorDTO();
                        entrenadorDTO.setIdUsuario(3L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + idEntrenador)))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entrenadorDTO)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = delete("http", "localhost", port,
                                        "/calendario/" + idEntrenador + "/" + idEvento);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
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

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
                        assertThat(respuesta.getHeaders().get("Location").get(0))
                                        .startsWith("http://localhost:" + port + "/calendario");

                        List<Evento> eventosBD = eventoRepository.findAll();
                        assertThat(eventosBD.get(0).getNombre()).isEqualTo(evento.getNombre());

                }

                @Test
                @DisplayName("error al insertar cita sin IdCliente")
                public void insertarCitaSinIdCliente() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento")
                                        .inicio(new Date())
                                        .id(2L)
                                        .tipo(Tipo.CITA)
                                        .lugar("Pepe")
                                        .duracionMinutos(120)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(400);

                }

                @Test
                @DisplayName("error al no encontrar el entrenador al obtener un evento")
                public void obtenerEventoConcretoEntrenadorNoEncontrado() {
                        Long idEntrenador = 1L;
                        Long idEvento = 1L;

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + idEntrenador)))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.NOT_FOUND));

                        } catch (URISyntaxException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + idEntrenador + "/" + idEvento);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

                }

                @Test
                @DisplayName("error al no tener acceso para obtener un evento")
                public void obtenerEventoConcretoSinAcceso() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(1L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + entr.getIdUsuario() + "/" + 1L);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

                }

                @Test
                @DisplayName("error al no encontrar el entrenador al crear un evento")
                public void crearActualizarEventoEntrenadorNoEncontrado() {
                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento2")
                                        .inicio(new Date())
                                        .id(2L)
                                        .idEntrenador(3L)
                                        .tipo(Tipo.DISPONIBILIDAD)
                                        .lugar("Pe")
                                        .duracionMinutos(120)
                                        .idCliente(3L)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + evento.getIdEntrenador())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.NOT_FOUND));
                        } catch (URISyntaxException e) {
                                e.printStackTrace();
                        }

                        var peticion = post("http", "localhost", port, "/calendario/" + evento.getIdEntrenador(),
                                        evento);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                }

                @Test
                @DisplayName("error al no tener acceso para crear un evento")
                public void crearActualizarEventoSinAcceso() {
                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento2")
                                        .inicio(new Date())
                                        .id(2L)
                                        .idEntrenador(3L)
                                        .tipo(Tipo.DISPONIBILIDAD)
                                        .lugar("Pe")
                                        .duracionMinutos(120)
                                        .idCliente(3L)
                                        .build();

                        EntrenadorDTO entrenadorDTO = new EntrenadorDTO();
                        entrenadorDTO.setIdUsuario(3L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + evento.getIdEntrenador())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entrenadorDTO)));
                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = post("http", "localhost", port, "/calendario/" + evento.getIdEntrenador(),
                                        evento);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                }

                @Test
                @DisplayName("error al insertar un evento con falta de datos")
                public void insertarEventoConFaltaDatos() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento")
                                        .inicio(new Date())
                                        .id(2L)
                                        .lugar("Pepe")
                                        .duracionMinutos(120)
                                        .idCliente(2L)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(400);

                }

                @Test
                @DisplayName("error al modificar evento inexistente")
                public void modificarEvento() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento2")
                                        .inicio(new Date())
                                        .id(2L)
                                        .idEntrenador(entr.getId())
                                        .tipo(Tipo.DISPONIBILIDAD)
                                        .lugar("Pe")
                                        .duracionMinutos(120)
                                        .idCliente(3L)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = put("http", "localhost", port, "/calendario/" + entr.getIdUsuario() + "/" + 2L,
                                        evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(404);

                }

                @Test
                @DisplayName("Devuelve correctamente la disponibilidad del entrenador")
                public void obtenerDisponibilidadEntrenador() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + entr.getIdUsuario());
                        var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<List<EventoDTO>>() {
                        });

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
                }

                @Test
                @DisplayName("error al no encontrar el entrenador al obtener disponibilidad")
                public void obtenerDisponibilidadEntrenadorNoEncontrado() {
                        Long idEntrenador = 1L;

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + idEntrenador)))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.NOT_FOUND));

                        } catch (URISyntaxException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + idEntrenador);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                }

                @Test
                @DisplayName("error al no tener acceso para obtener disponibilidad")
                public void obtenerDisponibilidadSinAcceso() {
                        Long idEntrenador = 1L;

                        EntrenadorDTO entrenadorDTO = new EntrenadorDTO();
                        entrenadorDTO.setIdUsuario(3L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + idEntrenador)))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entrenadorDTO)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + idEntrenador);
                        ResponseEntity<String> respuesta = rt.exchange(peticion, String.class);

                        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                }

        }

        @Nested
        @DisplayName("cuando hay Eventos")
        public class EventosNoVacios {
                private Evento evento2;
                private Evento evento1;

                @BeforeEach
                public void insertarDatos() {

                        evento2 = Evento.builder()
                                        .nombre("Entrenamiento de fútbol")
                                        .descripcion("Entrenamiento táctico para mejorar la defensa")
                                        .lugar("Campo de fútbol municipal")
                                        .inicio(new Date())
                                        .duracionMinutos(100)
                                        .tipo(Tipo.DISPONIBILIDAD)
                                        .build();
                        evento2.setId(2L);
                        evento2.setIdEntrenador(2L);

                        evento1 = Evento.builder()
                                        .nombre("Cita")
                                        .descripcion("prueba cita")
                                        .lugar("Campo de fútbol municipal")
                                        .inicio(new Date())
                                        .duracionMinutos(30)
                                        .tipo(Tipo.CITA)
                                        .build();
                        evento1.setId(1L);
                        evento1.setIdEntrenador(2L);
                        evento1.setIdCliente(2L);

                        evento2 = eventoRepository.save(evento2);
                        evento1 = eventoRepository.save(evento1);
                }

                @Test
                @DisplayName("Devuelve evento concreto")
                public void obtenerEventoConcreto() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);
                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (JsonProcessingException | URISyntaxException e) {
                                e.printStackTrace();
                        }
                        var peticion = get("http", "localhost", port,
                                        "/calendario/" + entr.getIdUsuario() + "/" + evento2.getId());
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
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
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

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(200);

                        assertThat(eventoRepository.findById(evento2.getId()).isPresent()).isFalse();
                }

                @Test
                @DisplayName("Modifica evento concreto")
                public void modificarEvento() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = new Evento();
                        evento.setNombre("Prueba de evento2");
                        evento.setInicio(new Date());
                        evento.setTipo(Tipo.DISPONIBILIDAD);
                        evento.setLugar("Pe");
                        evento.setDuracionMinutos(120);
                        evento.setIdCliente(3L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.manyTimes(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = put("http", "localhost", port,
                                        "/calendario/" + entr.getIdUsuario() + "/" + evento2.getId(),
                                        evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(200);

                        List<Evento> eventosBD = eventoRepository.findAll();
                        assertThat(eventosBD.get(0).getNombre()).isEqualTo(evento.getNombre());
                }

                @Test
                @DisplayName("Inserta correctamente un evento")
                public void insertarEvento() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento")
                                        .inicio(new Date())
                                        .id(3L)
                                        .tipo(Tipo.DISPONIBILIDAD)
                                        .lugar("Pepe")
                                        .duracionMinutos(120)
                                        .idCliente(2L)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
                        assertThat(respuesta.getHeaders().get("Location").get(0))
                                        .startsWith("http://localhost:" + port + "/calendario");

                        List<Evento> eventosBD = eventoRepository.findAll();
                        assertThat(eventosBD.get(2).getNombre()).isEqualTo(evento.getNombre());

                }

                @Test
                @DisplayName("obtiene correctamente una disponibilidad")
                public void obtieneDisponibilidad() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var peticion = get("http", "localhost", port, "/calendario/" + entr.getIdUsuario());
                        var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<List<EventoDTO>>() {
                        });

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
                }

                @Test
                @DisplayName("error al insertar una cita fuera de una disponibilidad")
                public void insertarCitaSinDisponibilidad() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Calendar cal = Calendar.getInstance();
                        cal.set(2024, Calendar.DECEMBER, 25, 10, 0, 0);
                        Date fechaInicio = cal.getTime();

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento")
                                        .inicio(fechaInicio)
                                        .idEntrenador(2L)
                                        .id(3L)
                                        .tipo(Tipo.CITA)
                                        .lugar("Pepe")
                                        .duracionMinutos(200)
                                        .idCliente(3L)
                                        .build();

                        try {
                                mockserver.expect(ExpectedCount.once(),
                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));
                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(400);
                }

                @Test
                @DisplayName("error al insertar un evento que solapa")
                public void insertarEventoSolapado() {
                        EntrenadorDTO entr = new EntrenadorDTO();
                        entr.setIdUsuario(2L);

                        Evento evento = Evento.builder()
                                        .nombre("Prueba de evento")
                                        .inicio(new Date())
                                        .idEntrenador(2L)
                                        .id(3L)
                                        .tipo(Tipo.CITA)
                                        .lugar("Pepe")
                                        .duracionMinutos(15)
                                        .idCliente(3L)
                                        .build();

                        try {
                                mockserver
                                                .expect(ExpectedCount.once(),
                                                                requestTo(new URI("http://localhost:8080/entrenador/"
                                                                                + entr.getIdUsuario())))
                                                .andExpect(method(HttpMethod.GET))
                                                .andRespond(withStatus(HttpStatus.OK)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .body(mapper.writeValueAsString(entr)));

                        } catch (URISyntaxException | JsonProcessingException e) {
                                e.printStackTrace();
                        }

                        var request = post("http", "localhost", port, "/calendario/" + entr.getIdUsuario(), evento);

                        var respuesta = rt.exchange(request, Void.class);

                        assertThat(respuesta.getStatusCode().value()).isEqualTo(400);

                }

        }

}
