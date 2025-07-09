# ---------- Stage 1: Build frontend ----------
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY chat-app-frontend/ .
RUN npm install
RUN npm run build

# ---------- Stage 2: Build backend (using Maven image) ----------
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY chat-app-backend/ .
RUN mvn clean package -DskipTests

# ---------- Stage 3: Final image ----------
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /backend/target/*.jar backend.jar

# Copy built frontend into Spring Boot public folder
COPY --from=frontend-build /frontend/dist /app/public

# Spring Boot config
ENV SERVER_PORT=8080
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "backend.jar"]
