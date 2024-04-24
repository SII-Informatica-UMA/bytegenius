package ByteGenius.tarea2;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class Tarea2ApplicationTests {

	
	private AccesoDatos ad;

    @BeforeEach
    public void setup() {
        ad = new AccesoDatos();
    }

    @AfterEach
    public void teardown() {
        ad.close();
    }

    @Test
    public void testNada() {
        // Nada que hacer, está simplemente para abrir y cerrar el contexto de persistencia
    }

}
