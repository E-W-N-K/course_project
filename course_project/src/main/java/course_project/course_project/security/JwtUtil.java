package course_project.course_project.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Секретный ключ для подписи JWT (в продакшене хранить в переменных окружения!)
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "MyVerySecureSecretKeyForJWT12345678901234567890".getBytes()
    );

    // Время жизни access token (15 минут)
    private final long ACCESS_TOKEN_VALIDITY = 15 * 60 * 1000; // 15 минут

    // Генерация JWT токена
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Извлечение username из токена
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Извлечение роли из токена
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // Проверка истечения срока действия токена
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // Валидация токена
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    // Извлечение claims из токена
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
