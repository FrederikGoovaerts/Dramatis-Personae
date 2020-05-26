import { put, takeEvery } from 'redux-saga/effects';
import { noteActions, characterActions } from '../actions';
import * as note from '../../api/note.api';

function* editCharacterNote(action: noteActions.specificTypes['editCharacterNote']) {
    try {
        yield note.editCharacterNote(action.payload);
        yield put(characterActions.actions.fetchNotes(String(action.payload.id)));
        yield put(characterActions.actions.fetchSharedNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to edit note. Please try again later.');
    }
}

function* deleteCharacterNote(action: noteActions.specificTypes['deleteCharacterNote']) {
    try {
        yield note.deleteCharacterNote(action.payload.noteId);
        yield put(characterActions.actions.fetchNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to delete note. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(noteActions.names.editCharacterNote, editCharacterNote);
    yield takeEvery(noteActions.names.deleteCharacterNote, deleteCharacterNote);
}
