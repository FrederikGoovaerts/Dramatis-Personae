const ENV_AUTH_NOT_REQUIRED = process.env.AUTH_NOT_REQUIRED === 'true';
const ENV_CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? '';
const ENV_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI ?? '';
const ENV_API_HOST = process.env.API_HOST ?? '';
const ENV_API_PROTOCOL = process.env.API_PROTOCOL ?? '';

export { ENV_API_HOST, ENV_API_PROTOCOL, ENV_AUTH_NOT_REQUIRED, ENV_CLIENT_ID, ENV_REDIRECT_URI };
