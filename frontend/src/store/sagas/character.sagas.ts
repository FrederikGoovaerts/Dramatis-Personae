import { put, takeEvery } from 'redux-saga/effects';

import * as character from '../../api/character.api';
import { characterActions } from '../actions';

function* fetchCharacter(action: characterActions.specificTypes['fetchCharacter']) {
    yield put(characterActions.actions.setCharacterLoading(true));
    try {
        const result = yield character.get(action.payload);
        yield put(characterActions.actions.setCharacter(result));
    } catch (e) {
        console.error('Unable to fetch character. Please try again later.');
    }
    yield put(characterActions.actions.setCharacterLoading(false));
}

function* mergeCharacter(action: characterActions.specificTypes['mergeCharacter']) {
    try {
        yield character.merge(action.payload.id, action.payload.target);
    } catch (e) {
        console.error('Unable to merge character. Please try again later.');
    }
}

function* fetchNotes(action: characterActions.specificTypes['fetchNotes']) {
    yield put(characterActions.actions.setNotesLoading(true));
    try {
        const result = yield character.getNotes(action.payload);
        yield put(characterActions.actions.setNotes(result));
    } catch (e) {
        console.error('Unable to fetch notes. Please try again later.');
    }
    yield put(characterActions.actions.setNotesLoading(false));
}

function* fetchSharedNotes(action: characterActions.specificTypes['fetchSharedNotes']) {
    yield put(characterActions.actions.setSharedNotesLoading(true));
    try {
        const result = yield character.getSharedNotes(action.payload);
        yield put(characterActions.actions.setSharedNotes(result));
    } catch (e) {
        console.error('Unable to fetch shared notes. Please try again later.');
    }
    yield put(characterActions.actions.setSharedNotesLoading(false));
}

function* createNote(action: characterActions.specificTypes['createNote']) {
    try {
        yield character.createNote(action.payload);
        yield put(characterActions.actions.fetchNotes(action.payload.id));
    } catch (e) {
        console.error('Unable to create note. Please try again later.');
    }
}

function* editCharacter(action: characterActions.specificTypes['editCharacter']) {
    try {
        const { characterId, name, description, visible } = action.payload;
        yield character.update(characterId, name, description, visible);
        yield put(characterActions.actions.fetchCharacter(action.payload.characterId));
    } catch (e) {
        console.error('Unable to update character. Please try again later.');
    }
}

function* deleteCharacter(action: characterActions.specificTypes['deleteCharacter']) {
    try {
        yield character.deletePermanently(action.payload);
    } catch (e) {
        console.error('Unable to delete character. Please try again later.');
    }
}

function* addLabel(action: characterActions.specificTypes['addLabel']) {
    try {
        yield character.addLabel(action.payload);
        yield put(characterActions.actions.fetchCharacter(action.payload.characterId));
    } catch (e) {
        console.error('Unable to add label. Please try again later.');
    }
}

function* removeLabel(action: characterActions.specificTypes['removeLabel']) {
    try {
        yield character.removeLabel(action.payload);
        yield put(characterActions.actions.fetchCharacter(action.payload.characterId));
    } catch (e) {
        console.error('Unable to remove label. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(characterActions.names.fetchCharacter, fetchCharacter);
    yield takeEvery(characterActions.names.mergeCharacter, mergeCharacter);
    yield takeEvery(characterActions.names.fetchNotes, fetchNotes);
    yield takeEvery(characterActions.names.fetchSharedNotes, fetchSharedNotes);
    yield takeEvery(characterActions.names.createNote, createNote);
    yield takeEvery(characterActions.names.editCharacter, editCharacter);
    yield takeEvery(characterActions.names.deleteCharacter, deleteCharacter);
    yield takeEvery(characterActions.names.addLabel, addLabel);
    yield takeEvery(characterActions.names.removeLabel, removeLabel);
}
