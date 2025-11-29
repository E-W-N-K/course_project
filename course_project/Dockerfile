# Этап 1: Сборка
FROM maven:3.8.1-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# Этап 2: Runtime
FROM openjdk:17.0.1-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/course_project-0.0.1-SNAPSHOT.jar app.jar

RUN mkdir -p /app/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
