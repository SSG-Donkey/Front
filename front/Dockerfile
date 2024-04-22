# 빌드 단계
FROM openjdk:17-jdk-slim as build
WORKDIR /app
COPY gradle gradle  
COPY gradlew .      
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build --stacktrace

# 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]