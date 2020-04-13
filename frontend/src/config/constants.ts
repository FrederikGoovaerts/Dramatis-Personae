export const hosting = {
    BASE_URL: process.env.BASE_URL ?? ''
};

export const oauth = {
    AUTH_NOT_REQUIRED: process.env.AUTH_NOT_REQUIRED === 'true' ? true : false,
    CLIENT_ID: process.env.OAUTH_CLIENT_ID ?? '',
    REDIRECT_URI: process.env.OAUTH_REDIRECT_URI ?? ''
};

export const api = {
    API_HOST: process.env.API_HOST ?? '',
    API_PROTOCOL: process.env.API_PROTOCOL ?? '',
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