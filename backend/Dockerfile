FROM openjdk:11-jdk-slim as builder
ADD . /dramatis
WORKDIR /dramatis
RUN ./gradlew bootJar

FROM openjdk:11-jre-slim
COPY --from=builder /dramatis/build/libs/dramatis-personae.jar /app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
