# Dramatis Personae API backend

The backend is written in [Kotlin](https://kotlinlang.org/) and uses the [Spring Boot](https://spring.io/projects/spring-boot) framework. It uses a [PostgreSQL](https://www.postgresql.org/) database for persistent storage.

The application is available as automatically built [Docker](https://docs.docker.com/) images on [Docker Hub](https://hub.docker.com/r/frederikgoovaerts/dramatis-personae-backend). The application can be run by spinning up one of these images, or by downloading the source code and using [Gradle](https://gradle.org/) with the command `./gradlew bootRun`. Alternatively, run `./gradlew bootJar` to create a runnable `.jar` file. In each case, the necessary environment variables must be provided to the application, as detailed below.

## Environment variables

### The Spring profile

Running the application can be done in two modes, `dev` and `production` mode, complemented by Spring Profiles with those respective names. The environment variable to set the active profile is `spring_profiles_active`, with those values, `dev` and `production` as possible values.

In `dev` mode, the application does not perform any authentication, starts with an in-memory database (H2) and is provided with some example data for testing during development. The OAuth and Database environment variables are not necessary in this case.

In `production` mode, the application uses Google OpenID tokens for authentication and connects to a running PosgreSQL database for storage.

### Google OAuth Client details

The application uses [Google OpenID](https://developers.google.com/identity/protocols/oauth2/openid-connect) tokens for authentication. It is necessary to create a [Google Cloud Platform](https://console.cloud.google.com) project to create an OAuth client and get a Client ID and Client Secret.

These last two should be assigned to the `spring_googleAuth_clientId` and `spring_googleAuth_clientSecret` environment variables respectively.

### PostgreSQL connection details

Connection to the database is configured through the following variables, for which the names should be self-explanatory:

- `spring_datasource_url`
- `spring_datasource_username`
- `spring_datasource_password`

The application will perform the necessary table creation and migration on startup.
