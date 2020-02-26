import { combineReducers } from 'redux';
import { applicationActions } from '../actions';
import { createReducer } from './base';

export interface ApplicationState {
    initialized: boolean;
    authorized: boolean;
}

const applicationReducers = combineReducers<ApplicationState>({
    authorized: createReducer(false, applicationActions.names.setAuthorized),
    initialized: createReducer(false, applicationActions.names.setInitialized),
});

export default applicationReducers;
