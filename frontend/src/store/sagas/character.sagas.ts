import { put, takeEvery } from 'redux-saga/effects';
import { Character } from '../../types';
import { campaignActions, characterActions } from '../actions';
import * as character from '../../api/character.api';

function* fetchCharacter(action: characterActions.specificTypes['fetchCharacter']) {
    yield put(characterActions.actions.setCharacterLoading(true));
    try {
        const result = yield character.get(action.payload);
        const c: Character = result.data;
        yield put(characterActions.actions.setCharacter(c));
    } catch (e) {
        console.error('Unable to fetch campaign. Please try again later.');
    }
    yield put(characterActions.actions.setCharacterLoading(false));
}

function* newCharacter(action: characterActions.specificTypes['newCharacter']) {
    try {
        yield character.create(action.payload);
        yield put(campaignActions.actions.fetchCampaign(String(action.payload.campaignId)));
    } catch (e) {
        console.error('Unable to create character. Please try again later.');
    }
}

function* updateCharacter(action: characterActions.specificTypes['updateCharacter']) {
    try {
        yield character.update(action.payload.characterId, action.payload.update);
        yield put(characterActions.actions.fetchCharacter(String(action.payload.characterId)));
    } catch (e) {
        console.error('Unable to update character. Please try again later.');
    }
}

function* deleteCharacter(action: characterActions.specificTypes['deleteCharacter']) {
    try {
        yield character.deletePermanently(action.payload.characterId);
        yield put(campaignActions.actions.fetchCampaign(String(action.payload.campaignId)));
    } catch (e) {
        console.error('Unable to delete character. Please try again later.');
    }
}

function* setNote(action: characterActions.specificTypes['setNote']) {
    try {
        console.warn('payload', action.payload);
        yield character.setNote(action.payload);
        yield put(characterActions.actions.fetchCharacter(String(action.payload.characterId)));
    } catch (e) {
        console.error('Unable to update note. Please try again later.');
    }
}

function* setVisibility(action: characterActions.specificTypes['setVisible']) {
    try {
        yield character.setVisible(action.payload);
        yield put(characterActions.actions.fetchCharacter(String(action.payload.characterId)));
    } catch (e) {
        console.error('Unable to update note. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(characterActions.names.fetchCharacter, fetchCharacter);
    yield takeEvery(characterActions.names.newCharacter, newCharacter);
    yield takeEvery(characterActions.names.updateCharacter, updateCharacter);
    yield takeEvery(characterActions.names.deleteCharacter, deleteCharacter);
    yield takeEvery(characterActions.names.setNote, setNote);
    yield takeEvery(characterActions.names.setVisibility, setVisibility);
}
