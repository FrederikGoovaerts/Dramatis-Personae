import { fork } from 'redux-saga/effects';
import applicationSagas from './application.sagas';
import campaignSagas from './campaign.sagas';
import characterSagas from './character.sagas';
import proposedCharacterSagas from './proposedcharacter.sagas';
import noteSagas from './note.sagas';

export function* rootSaga() {
    yield fork(applicationSagas);
    yield fork(campaignSagas);
    yield fork(characterSagas);
    yield fork(proposedCharacterSagas);
    yield fork(noteSagas);
}
