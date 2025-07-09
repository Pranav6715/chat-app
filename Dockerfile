# ---------- Stage 1: Build frontend ----------
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY chat-app-frontend/ .
RUN npm install
RUN npm run build

# ---------- Stage 2: Build backend ----------
FROM eclipse-temurin:17-jdk AS backend-build
WORKDIR /backend
COPY chat-app-backend/ .
RUN ./mvnw package -DskipTests

# ---------- Stage 3: Final image ----------
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy backend JAR
COPY --from=backend-build /backend/target/*.jar backend.jar

# Copy built frontend into static folder
COPY --from=frontend-build /frontend/dist /app/public

# Set environment
ENV SERVER_PORT=8080
EXPOSE 8080

# Start Spring Boot server
CMD ["java", "-jar", "backend.jar"]
