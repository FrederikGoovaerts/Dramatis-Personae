import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    initialize = 'INITIALIZE',
    setAuthorized = 'SET_AUTHORIZED',
    setInitialized = 'SET_INITIALIZED',
    logout = 'LOGOUT',
    clearStore = 'CLEAR_STORE'
}

export const actions = {
    initialize: () => createAction(names.initialize),
    setAuthorized: (p: boolean) => createAction(names.setAuthorized, p),
    setInitialized: (p: boolean) => createAction(names.setInitialized, p),
    logout: () => createAction(names.logout),
    clearStore: () => createAction(names.clearStore)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
