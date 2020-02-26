import { fork } from 'redux-saga/effects';
import applicationSagas from './application.sagas';
import campaignSagas from './campaign.sagas';
import characterSagas from './character.sagas';

export function* rootSaga() {
    yield fork(applicationSagas);
    yield fork(campaignSagas);
    yield fork(characterSagas);
}
