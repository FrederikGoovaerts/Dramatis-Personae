# Backend

The backend is written in Kotlin and uses the Spring Boot framework.

Running the application can be done in two modes, dev and production mode, complimented by Spring Profiles with those respective names.

## `dev` mode

When specifying the active Spring profile as `'dev'`, the application starts in dev mode. The application does not perform any authentication, starts with an in-memory database (H2) and is provided with some example data for development testing.

## `production` mode

When specifying the active Spring profile as `'production'`, the application starts in production mode. The application uses Google OpenID tokens for authentication (configured with a project in GCP for OAuth management) and starts up expecting a PostgreSQL configuration. The application will perform the necessary table creation and migration on startup. Some configuration has to be passed to the application for succesful startup. An example where the configuration is passed as environment variables (an alternative being e.g. `application.yml`):

```
spring_profiles_active=production
spring_googleAuth_clientId=*GCP project OAuth client ID*
spring_googleAuth_clientSecret=*GCP project OAuth client secret*
spring_datasource_url=*jdbc connection URL to PostgreSQL database*
spring_datasource_username=*PostgreSQL database username*
spring_datasource_password=*PostgreSQL database password*
```
