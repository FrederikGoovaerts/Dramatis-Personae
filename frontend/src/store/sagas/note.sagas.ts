import { call, put, takeEvery } from 'redux-saga/effects';

import * as note from '../../api/note.api';
import { campaignActions, characterActions, noteActions } from '../actions';

function* editCharacterNote(action: noteActions.specificTypes['editCharacterNote']) {
    try {
        yield call(note.editCharacterNote, action.payload);
        yield put(characterActions.actions.fetchNotes(String(action.payload.id)));
        yield put(characterActions.actions.fetchSharedNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to edit note. Please try again later.');
    }
}

function* deleteCharacterNote(action: noteActions.specificTypes['deleteCharacterNote']) {
    try {
        yield call(note.deleteCharacterNote, action.payload.noteId);
        yield put(characterActions.actions.fetchNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to delete note. Please try again later.');
    }
}

function* editCampaignNote(action: noteActions.specificTypes['editCampaignNote']) {
    try {
        yield call(note.editCampaignNote, action.payload);
        yield put(campaignActions.actions.fetchNotes(String(action.payload.id)));
        yield put(campaignActions.actions.fetchSharedNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to edit note. Please try again later.');
    }
}

function* deleteCampaignNote(action: noteActions.specificTypes['deleteCampaignNote']) {
    try {
        yield call(note.deleteCampaignNote, action.payload.noteId);
        yield put(campaignActions.actions.fetchNotes(String(action.payload.id)));
    } catch (e) {
        console.error('Unable to delete note. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(noteActions.names.editCharacterNote, editCharacterNote);
    yield takeEvery(noteActions.names.deleteCharacterNote, deleteCharacterNote);
    yield takeEvery(noteActions.names.editCampaignNote, editCampaignNote);
    yield takeEvery(noteActions.names.deleteCampaignNote, deleteCampaignNote);
}
