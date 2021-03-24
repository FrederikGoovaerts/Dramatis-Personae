export const oauth = {
    AUTH_NOT_REQUIRED: confEnv.ENV_AUTH_NOT_REQUIRED,
    CLIENT_ID: confEnv.ENV_CLIENT_ID,
    REDIRECT_URI: confEnv.ENV_REDIRECT_URI
};

export const api = {
    API_HOST: confEnv.ENV_API_HOST,
    API_PROTOCOL: confEnv.ENV_API_PROTOCOL,
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
export const campaignLocationsRoute = (campaignId: string) => `/campaign/${campaignId}/locations`;
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
