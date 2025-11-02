package course_project.course_project.controller;

import course_project.course_project.dto.request.LoginRequestDTO;
import course_project.course_project.dto.request.RegisterRequestDTO;
import course_project.course_project.dto.response.AuthResponseDTO;
import course_project.course_project.model.User;
import course_project.course_project.repository.UserRepository;
import course_project.course_project.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;


    //регистрация
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDTO request) {
        //проверяем на существование
        if(userRepository.existsByName(request.getName())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        //проверка на зарегистрированный email
        if(userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponseDTO("User registered successfully", user.getName(), user.getEmail()));

    }

    //логин
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO request,
                                       HttpServletResponse response) {
        try {
            // Аутентификация через Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword())
            );

            // Если аутентификация успешна, получаем пользователя
            User user = userRepository.findByName(request.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Генерируем JWT токен
            String jwt = jwtUtil.generateToken(user.getName(), user.getRole());

            // Создаем HttpOnly cookie
            Cookie cookie = new Cookie("jwt", jwt);
            cookie.setHttpOnly(true);  // ВАЖНО: защита от XSS
            cookie.setSecure(false);   // Установить true для HTTPS в продакшене
            cookie.setPath("/");       // Доступен для всех путей
            cookie.setMaxAge(15 * 60); // 15 минут (как время жизни токена)

            // Добавляем cookie в ответ
            response.addCookie(cookie);

            return ResponseEntity.ok(new AuthResponseDTO("Login successful", user.getName(), user.getRole()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

    }

    //logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Удаляем cookie, устанавливая MaxAge = 0
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Удаляем cookie

        response.addCookie(cookie);

        return ResponseEntity.ok("Logout successful");
    }

    //проверка текущего статуса аутентификации
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new AuthResponseDTO("Authenticated", user.getName(), user.getRole()));
    }
}
