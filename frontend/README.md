# Dramatis Personae web frontend

The frontend is an [npm](https://www.npmjs.com/) project written in [TypeScript](https://www.typescriptlang.org/) and uses the [React](https://reactjs.org/) framework and [Redux](https://redux.js.org/) state store library.

The application is available as automatically built [Docker](https://docs.docker.com/) images on [Docker Hub](https://hub.docker.com/r/frederikgoovaerts/dramatis-personae-frontend). The application can be run by spinning up one of these images, or by downloading the source code, performing an `npm install`, and running `npm run start`, which will start [Webpack](https://webpack.js.org/) Dev Server. Alternatively, run `npm run build` to create a JavaScript bundle, along with a minimal HTML page, to host the application as a Single Page Application. In each case, the necessary environment variables must be provided to the application, as detailed below. When running through `npm`, provide the environment variables by creating a `.env` file, which is picked up by `dot-env`.

## Environment variables

### The API host

The frontend should be able to contact an API backend. To this end, set the `API_HOST` (e.g. `"localhost:8080/api"` ) and the `API_PROTOCOL` (e.g. `"http"`) variables.

### Google OAuth Client details

The application uses [Google OpenID](https://developers.google.com/identity/protocols/oauth2/openid-connect) tokens for authentication. It is necessary to create a [Google Cloud Platform](https://console.cloud.google.com) project to create an OAuth client and get a Client ID and set the desired redirect URI.

These last two should be assigned to the `OAUTH_CLIENT_ID` and `OAUTH_REDIRECT_URI` environment variables respectively.

The Client ID should match the one used in the API backend contacted by the frontend.

### Disabling authentication

While developing, when the backend is running in `dev` mode, set the `AUTH_NOT_REQUIRED` environment variable to the value `"true"` to disable all authentication logic. This makes local development a lot easier.
