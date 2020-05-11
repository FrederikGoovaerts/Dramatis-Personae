export const oauth = {
    AUTH_NOT_REQUIRED: (process.env.AUTH_NOT_REQUIRED ?? 'AUTH_NOT_REQUIRED_PLACEHOLDER') === 'true',
    CLIENT_ID: process.env.OAUTH_CLIENT_ID ?? 'OAUTH_CLIENT_ID_PLACEHOLDER',
    REDIRECT_URI: process.env.OAUTH_REDIRECT_URI ?? 'OAUTH_REDIRECT_URI_PLACEHOLDER'
};

export const api = {
    API_HOST: process.env.API_HOST ?? 'API_HOST_PLACEHOLDER',
    API_PROTOCOL: process.env.API_PROTOCOL ?? 'API_PROTOCOL_PLACEHOLDER',
    EXAMPLE_API: {
        PATH: '/example',
        SUBPATH_EXAMPLE: '/subexample'
    },
    AUTH: {
        PATH: '/auth',
        SUBPATH_CODE: '/code',
        SUBPATH_REFRESH: '/refresh'
    },
    CAMPAIGN: {
        PATH: '/campaign',
        SUBPATH_CHARACTER: '/character',
        SUBPATH_JOIN: '/join',
        SUBPATH_LEAVE: '/leave',
        SUBPATH_MEMBERS: '/members'
    },
    CHARACTER: {
        PATH: '/character',
        SUBPATH_NOTE: '/note',
        SUBPATH_VISIBLE: '/visible'
    },
    NOTE: {
        PATH: '/note'
    }
};

export const routes = {
    character: '/character/',
    campaign: '/campaign/',
    root: '/'
};

export const storage = {
    idToken: 'idToken',
    refreshToken: 'refreshToken'
};
