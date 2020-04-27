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

function* deleteNote(action: noteActions.specificTypes['deleteNote']) {
    try {
        yield note.deletePermanently(action.payload.noteId);
        yield put(characterActions.actions.fetchNotes(String(action.payload.characterId)));
    } catch (e) {
        console.error('Unable to delete note. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(noteActions.names.editNote, editNote);
    yield takeEvery(noteActions.names.deleteNote, deleteNote);
}
