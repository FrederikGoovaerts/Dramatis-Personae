export const oauth = {
    AUTH_NOT_REQUIRED: (process.env.AUTH_NOT_REQUIRED ?? 'AUTH_NOT_REQUIRED_PLACEHOLDER') === 'true',
    CLIENT_ID: process.env.OAUTH_CLIENT_ID ?? 'OAUTH_CLIENT_ID_PLACEHOLDER',
    REDIRECT_URI: process.env.OAUTH_REDIRECT_URI ?? 'OAUTH_REDIRECT_URI_PLACEHOLDER'
};

export const api = {
    API_HOST: process.env.API_HOST ?? 'API_HOST_PLACEHOLDER',
    API_PROTOCOL: process.env.API_PROTOCOL ?? 'API_PROTOCOL_PLACEHOLDER',
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
        SUBPATH_ROTATE_INVITE_CODE: '/rotatecode',
        SUBPATH_KICK: '/kick',
        SUBPATH_MEMBERS: '/members',
        SUBPATH_PROPOSED_CHARACTER: '/proposedcharacter',
        SUBPATH_NOTE: '/note',
        SUBPATH_SHARED_NOTES: '/sharednotes',
        SUBPATH_LABEL: '/label'
    },
    CHARACTER: {
        PATH: '/character',
        SUBPATH_NOTE: '/note',
        SUBPATH_MERGE: '/merge',
        SUBPATH_SHARED_NOTES: '/sharednotes',
        SUBPATH_VISIBLE: '/visible',
        SUBPATH_LABEL: '/label'
    },
    CHARACTER_NOTE: '/characternote',
    CHARACTER_RELATION: '/charrelation',
    CAMPAIGN_NOTE: '/campaignnote',
    LABEL: '/label',
    EVENT: '/event'
};

export const rootRoute = () => '/';
export const joinRoute = (joinId: string) => `/join/${joinId}`;
export const campaignRoute = (campaignId: string) => `/campaign/${campaignId}`;
export const campaignCharactersRoute = (campaignId: string) => `/campaign/${campaignId}/characters`;
export const campaignEventsRoute = (campaignId: string) => `/campaign/${campaignId}/events`;
export const campaignNotesRoute = (campaignId: string) => `/campaign/${campaignId}/notes`;
export const campaignLabelsRoute = (campaignId: string) => `/campaign/${campaignId}/labels`;
export const campaignMgmtRoute = (campaignId: string) => `/campaign/${campaignId}/mgmt`;
export const characterRoute = (campaignId: string, characterId: string) =>
    `/campaign/${campaignId}/character/${characterId}`;

export const storage = {
    idToken: 'idToken',
    refreshToken: 'refreshToken',
    preRedirectPath: 'preRedirectPath'
};
