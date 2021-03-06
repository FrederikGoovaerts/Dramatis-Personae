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

function* editEventOrdinal(action: eventActions.specificTypes['editEventOrdinal']) {
    yield call(event.editEventOrdinal, action.payload.id, action.payload.newOrdinal);
    const campaignId: string | undefined = yield select((state: RootState) => state.campaign.campaign?.id);
    if (campaignId) {
        yield put(eventActions.actions.fetchEvents(campaignId));
    }
}

function* addEventCharacter(action: eventActions.specificTypes['addEventCharacter']) {
    yield call(event.addEventCharacter, action.payload.id, action.payload.characterId);
    const campaignId: string | undefined = yield select((state: RootState) => state.campaign.campaign?.id);
    if (campaignId) {
        yield put(eventActions.actions.fetchEvents(campaignId));
    }
}

function* removeEventCharacter(action: eventActions.specificTypes['removeEventCharacter']) {
    yield call(event.removeEventCharacter, action.payload.id, action.payload.characterId);
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
    yield takeEvery(eventActions.names.editEventOrdinal, editEventOrdinal);
    yield takeEvery(eventActions.names.addEventCharacter, addEventCharacter);
    yield takeEvery(eventActions.names.removeEventCharacter, removeEventCharacter);
}
