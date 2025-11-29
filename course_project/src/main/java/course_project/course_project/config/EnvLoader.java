package course_project.course_project.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvLoader {
    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("../")  // ← Ищет .env на уровень выше (в корне проекта)
                .ignoreIfMissing()
                .load();

        // Загрузить переменные из .env
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}
