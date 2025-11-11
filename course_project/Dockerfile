# Этап 1: Сборка
FROM maven:3.9-openjdk-17 AS builder

WORKDIR /app

# Копируем pom.xml и скачиваем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируем исходный код
COPY src ./src

# Собираем jar файл
RUN mvn clean package -DskipTests

# Этап 2: Runtime
FROM openjdk:17-jdk-slim

WORKDIR /app

# Копируем собранный jar
COPY --from=builder /app/target/course_project-0.0.1-SNAPSHOT.jar app.jar

# Создаём директорию для uploads
RUN mkdir -p /app/uploads

EXPOSE 8080

# Запускаем с профилем prod
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
