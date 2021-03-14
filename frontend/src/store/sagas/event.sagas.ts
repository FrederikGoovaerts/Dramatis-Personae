import { call, put, takeEvery } from 'redux-saga/effects';

import * as event from '../../api/event.api';
import { Event } from '../../types/event.types';
import { eventActions } from '../actions';

function* getEvents(action: eventActions.specificTypes['getEvents']) {
    yield put(eventActions.actions.setLoading(true));
    const events: Event[] = yield call(event.getEvents, action.payload);
    yield put(eventActions.actions.setEvents(events));
    yield put(eventActions.actions.setLoading(false));
}

function* createEvent(action: eventActions.specificTypes['createEvent']) {
    yield call(event.createEvent, action.payload);
    yield put(eventActions.actions.getEvents(String(action.payload.campaignId)));
}

function* editEvent(action: eventActions.specificTypes['editEvent']) {
    yield call(event.editEvent, action.payload);
    // TODO refresh after cleaning up store (use selector to get current campaign instead of passing stuff around)
}

function* deleteEvent(action: eventActions.specificTypes['deleteEvent']) {
    yield call(event.deleteEvent, action.payload);
    // TODO refresh after cleaning up store (use selector to get current campaign instead of passing stuff around)
}

export default function* watcher() {
    yield takeEvery(eventActions.names.getEvents, getEvents);
    yield takeEvery(eventActions.names.createEvent, createEvent);
    yield takeEvery(eventActions.names.editEvent, editEvent);
    yield takeEvery(eventActions.names.deleteEvent, deleteEvent);
}
