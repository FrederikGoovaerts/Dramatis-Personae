import { put, takeEvery } from 'redux-saga/effects';
import { proposedCharacterActions, campaignActions } from '../actions';
import * as proposedCharacter from '../../api/proposedcharacter.api';

function* acceptProposedCharacter(action: proposedCharacterActions.specificTypes['acceptProposedCharacter']) {
    try {
        yield proposedCharacter.accept(action.payload.characterId);
        yield put(campaignActions.actions.fetchCharacters(action.payload.campaignId));
        yield put(campaignActions.actions.fetchProposedCharacters(action.payload.campaignId));
    } catch (e) {
        console.error('Unable to accept proposed character. Please try again later.');
    }
}

function* deleteProposedCharacter(action: proposedCharacterActions.specificTypes['deleteProposedCharacter']) {
    try {
        yield proposedCharacter.deletePermanently(action.payload.characterId);
        yield put(campaignActions.actions.fetchProposedCharacters(action.payload.campaignId));
    } catch (e) {
        console.error('Unable to delete proposed character. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(proposedCharacterActions.names.acceptProposedCharacter, acceptProposedCharacter);
    yield takeEvery(proposedCharacterActions.names.deleteProposedCharacter, deleteProposedCharacter);
}
