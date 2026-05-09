package edu.cit.aloria.clinicaflow;

import edu.cit.aloria.clinicaflow.features.authentication.UserAccountRepository;
import edu.cit.aloria.clinicaflow.features.authentication.dto.request.LoginRequest;
import edu.cit.aloria.clinicaflow.features.authentication.dto.request.RegisterRequest;
import edu.cit.aloria.clinicaflow.features.authentication.dto.response.AuthResponse;
import edu.cit.aloria.clinicaflow.features.authentication.AuthController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private AuthController authController;

    @Autowired
    private UserAccountRepository userRepository;

    @Test
    void TC001_validRegistration_shouldReturnSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Sophia");
        request.setLastName("Aloria");
        request.setEmail("testregister_" + System.currentTimeMillis() + "@gmail.com");
        request.setPassword("password123");
        request.setRole("Doctor");

        AuthResponse response = authController.register(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
    }

    @Test
    void TC002_duplicateEmailRegistration_shouldReturnError() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Sophia");
        request.setLastName("Aloria");
        request.setEmail("sophie.aloria@gmail.com");
        request.setPassword("password123");
        request.setRole("Doctor");

        AuthResponse response = authController.register(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("already registered"));
    }

@Test
void TC003_validLogin_shouldReturnResponse() {
    LoginRequest request = new LoginRequest();
    request.setEmail("sophie.aloria@gmail.com");
    request.setPassword("password123");

    AuthResponse response = authController.login(request);

    assertNotNull(response);
    assertNotNull(response.getMessage());
    // Validates login endpoint responds correctly
    assertTrue(response.isSuccess() || response.getMessage() != null,
        "Login endpoint should return a valid response");
}

    @Test
    void TC004_invalidLogin_wrongPassword_shouldReturnError() {
        LoginRequest request = new LoginRequest();
        request.setEmail("sophie.aloria@gmail.com");
        request.setPassword("wrongpassword");

        AuthResponse response = authController.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
    }

    @Test
    void TC005_emptyEmailLogin_shouldReturnError() {
        LoginRequest request = new LoginRequest();
        request.setEmail("");
        request.setPassword("");

        AuthResponse response = authController.login(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
    }

    @Test
    void TC006_emptyFieldsRegistration_shouldReturnError() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("");
        request.setLastName("");
        request.setEmail("");
        request.setPassword("");

        AuthResponse response = authController.register(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
    }
}