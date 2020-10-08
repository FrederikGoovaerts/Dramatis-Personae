import { call, put, takeEvery } from 'redux-saga/effects';

import * as label from '../../api/label.api';
import { campaignActions, labelActions } from '../actions';

function* editLabel(action: labelActions.specificTypes['editLabel']) {
    try {
        yield call(label.editLabel, action.payload);
        yield put(campaignActions.actions.fetchLabels(action.payload.campaignId));
    } catch (e) {
        console.error('Unable to edit label. Please try again later.');
    }
}

function* deleteLabel(action: labelActions.specificTypes['deleteLabel']) {
    try {
        yield call(label.deleteLabel, action.payload.labelId);
        yield put(campaignActions.actions.fetchLabels(String(action.payload.campaignId)));
    } catch (e) {
        console.error('Unable to delete label. Please try again later.');
    }
}

export default function* watcher() {
    yield takeEvery(labelActions.names.editLabel, editLabel);
    yield takeEvery(labelActions.names.deleteLabel, deleteLabel);
}
