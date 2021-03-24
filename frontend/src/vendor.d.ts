declare namespace process {
    const env: Record<string, string | undefined>;
}

declare module 'url' {
    const format: (obj: { host: string; pathname: string; protocol: string; search: string }) => string;
}

declare const confEnv: {
    ENV_AUTH_NOT_REQUIRED: boolean;
    ENV_CLIENT_ID: string;
    ENV_REDIRECT_URI: string;
    ENV_API_HOST: string;
    ENV_API_PROTOCOL: string;
};
