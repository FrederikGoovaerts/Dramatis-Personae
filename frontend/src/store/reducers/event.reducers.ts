import { combineReducers } from 'redux';

import { Event } from '../../types/event.types';
import { applicationActions, eventActions } from '../actions';
import { createReducer } from './base';

export interface EventState {
    loading: boolean;
    events: Event[];
}

const eventReducers = combineReducers<EventState>({
    loading: createReducer(false, eventActions.names.setLoading, applicationActions.names.clearStore),
    events: createReducer([], eventActions.names.setEvents, applicationActions.names.clearStore)
});

export default eventReducers;
