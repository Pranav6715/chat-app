# ---------- Stage 1: Build frontend ----------
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY chat-app-frontend/ .
RUN npm install
RUN npm run build

# ---------- Stage 2: Build backend (with Maven + JDK 21) ----------
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /backend
COPY chat-app-backend/ .
RUN mvn clean package -DskipTests

# ---------- Stage 3: Final runtime image (JDK 21) ----------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /backend/target/*.jar backend.jar

# Copy built frontend into static folder
COPY --from=frontend-build /frontend/dist /app/public

EXPOSE 8080
CMD ["java", "-jar", "backend.jar"]
