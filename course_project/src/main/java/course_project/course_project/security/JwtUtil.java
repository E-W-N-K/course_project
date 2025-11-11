package course_project.course_project.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Получаем секретный ключ из переменных окружения
    @Value("${app.jwt.secret}")
    private String jwtSecretString;

    // Получаем время жизни токена из переменных окружения
    @Value("${app.jwt.expiration}")
    private long accessTokenValidity;

    // Кэшируем SecretKey (чтобы не создавать каждый раз)
    private SecretKey secretKey;

    // Инициализируем SecretKey при первом доступе
    private SecretKey getSecretKey() {
        if (secretKey == null) {
            secretKey = Keys.hmacShaKeyFor(jwtSecretString.getBytes());
        }
        return secretKey;
    }

    // Генерация JWT токена
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(getSecretKey())
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
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
