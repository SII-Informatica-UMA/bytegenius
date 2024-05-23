package es.uma.informatica.practica3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
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
        UserDetails userDetails = jwtUtil.createUserDetails("1", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.delete(uri)
                .header("Authorization", "Bearer " + token)
                .build();
    }

    private <T> RequestEntity<T> post(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        UserDetails userDetails = jwtUtil.createUserDetails("1", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }

    private <T> RequestEntity<T> put(String scheme, String host, int port, String path, T object) {
        URI uri = uri(scheme, host, port, path);
        UserDetails userDetails = jwtUtil.createUserDetails("1", "", Collections.emptyList());
        String token = jwtUtil.generateToken(userDetails);
        return RequestEntity.put(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .body(object);
    }
/* 
    @Nested
    @DisplayName("cuando no hay Eventos")
    public class EventosVacias {

        @Test
        @DisplayName("devuelve una lista vacia de eventos")
        public void testGetEventosVacios() {
            var peticion = get("http", "localhost", port, "/calendario/1");
            var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<List<EventoDTO>>() {
            });
            assertThat(respuesta.getBody()).isEmpty();
        }

        @Test
        @DisplayName("Devuelve error al obtener un evento concreto")
        public void errorConEventoConcreto() {
            var peticion = get("http", "localhost", port, "/calendario/1/1");
            var respuesta = rt.exchange(peticion, new ParameterizedTypeReference<EventoDTO>() {
            });
            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }

        @Test
        @DisplayName("devuelve error al eliminar un evento que no existe")
        public void eliminarEventoInexistente() {
            var peticion = delete("http", "localhost", port, "/calendario/1/1");
            var respuesta = rt.exchange(peticion, Void.class);
            assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
        }
        @Test
        @DisplayName("devuelve error al intentar borrar un Evento con un IdEntrenador o IDElemento negativos")
        public void eliminarEventoConMalId() {
            var peticion = delete("http", "localhost", port, "/calendario/-1/1");
            var respuesta = rt.exchange(peticion, Void.class);
            assertThat(respuesta.getStatusCode().value()).isEqualTo(400);
        }
    }
*/
    @Nested
    @DisplayName("cuando hay Eventos")
    public class EventosNoVacios {
        private Evento evento;
        private Evento evento2;
        @BeforeEach
        public void insertarDatos(){
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

            evento=eventoRepository.save(evento);
            evento2=eventoRepository.save(evento2);
        }

        @Test
        @DisplayName("Devuelve evento concreto")
        public void obtenerEventoConcreto() {
            EntrenadorDTO entr = new EntrenadorDTO();
            entr.setIdUsuario(2L);
                    try {
                        mockserver.expect(ExpectedCount.once(), requestTo(new URI("http://localhost:8080/entrenador/" + entr.getIdUsuario())))
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

        

    }


}

