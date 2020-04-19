import { put, takeEvery } from 'redux-saga/effects';
import { noteActions, characterActions } from '../actions';
import * as note from '../../api/note.api';

function* editNote(action: noteActions.specificTypes['editNote']) {
    try {
        yield note.edit(action.payload);
        yield put(characterActions.actions.fetchNotes(String(action.payload.characterId)));
    } catch (e) {
        console.error('Unable to edit note. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(noteActions.names.editNote, editNote);
}
