import { call, put, select, takeEvery } from 'redux-saga/effects';

import * as event from '../../api/event.api';
import { Event } from '../../types/event.types';
import { eventActions } from '../actions';
import { RootState } from '../reducers';

function* fetchEvents(action: eventActions.specificTypes['fetchEvents']) {
    yield put(eventActions.actions.setLoading(true));
    const events: Event[] = yield call(event.fetchEvents, action.payload);
    yield put(eventActions.actions.setEvents(events));
    yield put(eventActions.actions.setLoading(false));
}

function* createEvent(action: eventActions.specificTypes['createEvent']) {
    yield call(event.createEvent, action.payload);
    yield put(eventActions.actions.fetchEvents(String(action.payload.campaignId)));
}

function* editEvent(action: eventActions.specificTypes['editEvent']) {
    yield call(event.editEvent, action.payload);
    const campaignId: string | undefined = yield select((state: RootState) => state.campaign.campaign?.id);
    if (campaignId) {
        yield put(eventActions.actions.fetchEvents(campaignId));
    }
}

function* deleteEvent(action: eventActions.specificTypes['deleteEvent']) {
    yield call(event.deleteEvent, action.payload);
    const campaignId: string | undefined = yield select((state: RootState) => state.campaign.campaign?.id);
    if (campaignId) {
        yield put(eventActions.actions.fetchEvents(campaignId));
    }
}

export default function* watcher() {
    yield takeEvery(eventActions.names.fetchEvents, fetchEvents);
    yield takeEvery(eventActions.names.createEvent, createEvent);
    yield takeEvery(eventActions.names.editEvent, editEvent);
    yield takeEvery(eventActions.names.deleteEvent, deleteEvent);
}
