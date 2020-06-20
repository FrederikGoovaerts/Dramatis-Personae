import { call, put, takeEvery } from 'redux-saga/effects';

import * as campaign from '../../api/campaign.api';
import { Campaign, CampaignMember, CampaignPrototype } from '../../types/campaign.types';
import { ListCharacter } from '../../types/character.types';
import { campaignActions } from '../actions';

function* fetchCampaigns() {
    yield put(campaignActions.actions.setCampaignsLoading(true));
    try {
        const result: Campaign[] = yield call(campaign.getAll);
        yield put(campaignActions.actions.setCampaigns(result));
    } catch (e) {
        console.error('Unable to fetch campaigns. Please try again later.');
    }
    yield put(campaignActions.actions.setCampaignsLoading(false));
}

function* fetchCampaign(action: campaignActions.specificTypes['fetchCampaign']) {
    yield put(campaignActions.actions.setCampaignLoading(true));
    try {
        const result: Campaign = yield call(campaign.get, action.payload);
        yield put(campaignActions.actions.setCampaign(result));
    } catch (e) {
        console.error('Unable to fetch campaigns. Please try again later.');
    }
    yield put(campaignActions.actions.setCampaignLoading(false));
}

function* fetchCharacters(action: campaignActions.specificTypes['fetchCharacters']) {
    yield put(campaignActions.actions.setCharactersLoading(true));
    try {
        const result: ListCharacter[] = yield call(campaign.getCharacters, action.payload);
        yield put(campaignActions.actions.setCharacters(result));
    } catch (e) {
        console.error('Unable to fetch characters. Please try again later.');
    }
    yield put(campaignActions.actions.setCharactersLoading(false));
}

function* fetchMembers(action: campaignActions.specificTypes['fetchMembers']) {
    yield put(campaignActions.actions.setMembersLoading(true));
    try {
        const result: CampaignMember[] = yield call(campaign.getMembers, action.payload);
        yield put(campaignActions.actions.setMembers(result));
    } catch (e) {
        console.error('Unable to fetch members. Please try again later.');
    }
    yield put(campaignActions.actions.setMembersLoading(false));
}

function* createCharacter(action: campaignActions.specificTypes['createCharacter']) {
    try {
        yield campaign.createCharacter(action.payload.campaignId, action.payload.character);
        yield put(campaignActions.actions.fetchCharacters(action.payload.campaignId));
    } catch (e) {
        console.error('Unable to create character. Please try again later.');
    }
}

function* joinCampaign(action: campaignActions.specificTypes['joinCampaign']) {
    try {
        yield campaign.join(action.payload);
        yield put(campaignActions.actions.fetchCampaigns());
    } catch (e) {
        console.error('Unable to join campaign. Please try again later or check if the code is correct.');
    }
}

function* rotateInviteCode(action: campaignActions.specificTypes['rotateInviteCode']) {
    try {
        yield campaign.rotateInviteCode(action.payload);
        yield put(campaignActions.actions.fetchCampaign(action.payload));
    } catch (e) {
        console.error('Unable to rotate invite code. Please try again later.');
    }
}

function* leaveCampaign(action: campaignActions.specificTypes['leaveCampaign']) {
    try {
        yield campaign.leave(action.payload);
        yield put(campaignActions.actions.fetchCampaigns());
    } catch (e) {
        console.error('Unable to leave campaign. Please try again later.');
    }
}

function* kickFromCampaign(action: campaignActions.specificTypes['kickFromCampaign']) {
    try {
        yield campaign.kick(action.payload.campaignId, action.payload.userId);
        yield put(campaignActions.actions.fetchMembers(action.payload.campaignId));
    } catch (e) {
        console.error('Unable to kick user from campaign. Please try again later.');
    }
}

function* newCampaign(action: campaignActions.specificTypes['newCampaign']) {
    try {
        const prototype: CampaignPrototype = { name: action.payload };
        yield call(campaign.create, prototype);
        yield put(campaignActions.actions.fetchCampaigns());
    } catch (e) {
        console.error('Unable to create campaign. Please try again later.');
    }
}

function* editCampaign(action: campaignActions.specificTypes['editCampaign']) {
    try {
        yield campaign.update(action.payload.id, action.payload.name, action.payload.campaignSettings);
        yield put(campaignActions.actions.fetchCampaign(action.payload.id));
    } catch (e) {
        console.error('Unable to delete campaign. Please try again later.');
    }
}

function* deleteCampaign(action: campaignActions.specificTypes['deleteCampaign']) {
    try {
        yield campaign.deletePermanently(action.payload);
        yield put(campaignActions.actions.fetchCampaigns());
    } catch (e) {
        console.error('Unable to delete campaign. Please try again later.');
    }
}

function* fetchNotes(action: campaignActions.specificTypes['fetchNotes']) {
    yield put(campaignActions.actions.setNotesLoading(true));
    try {
        const result = yield campaign.getNotes(action.payload);
        yield put(campaignActions.actions.setNotes(result));
    } catch (e) {
        console.error('Unable to fetch notes. Please try again later.');
    }
    yield put(campaignActions.actions.setNotesLoading(false));
}

function* fetchSharedNotes(action: campaignActions.specificTypes['fetchSharedNotes']) {
    yield put(campaignActions.actions.setSharedNotesLoading(true));
    try {
        const result = yield campaign.getSharedNotes(action.payload);
        yield put(campaignActions.actions.setSharedNotes(result));
    } catch (e) {
        console.error('Unable to fetch shared notes. Please try again later.');
    }
    yield put(campaignActions.actions.setSharedNotesLoading(false));
}

function* createNote(action: campaignActions.specificTypes['createNote']) {
    try {
        yield campaign.createNote(action.payload);
        yield put(campaignActions.actions.fetchNotes(action.payload.id));
    } catch (e) {
        console.error('Unable to create note. Please try again later.');
    }
}

function* createLabel(action: campaignActions.specificTypes['createLabel']) {
    try {
        yield campaign.createLabel(action.payload);
        yield put(campaignActions.actions.fetchLabels(action.payload.id));
    } catch (e) {
        console.error('Unable to create label. Please try again later.');
    }
}

function* fetchLabels(action: campaignActions.specificTypes['fetchLabels']) {
    yield put(campaignActions.actions.setLabelsLoading(true));
    try {
        const result = yield campaign.getLabels(action.payload);
        yield put(campaignActions.actions.setLabels(result));
    } catch (e) {
        console.error('Unable to fetch labels. Please try again later.');
    }
    yield put(campaignActions.actions.setLabelsLoading(false));
}

export default function* watcher() {
    yield takeEvery(campaignActions.names.fetchCampaigns, fetchCampaigns);
    yield takeEvery(campaignActions.names.fetchCampaign, fetchCampaign);
    yield takeEvery(campaignActions.names.fetchCharacters, fetchCharacters);
    yield takeEvery(campaignActions.names.fetchMembers, fetchMembers);
    yield takeEvery(campaignActions.names.createCharacter, createCharacter);
    yield takeEvery(campaignActions.names.joinCampaign, joinCampaign);
    yield takeEvery(campaignActions.names.rotateInviteCode, rotateInviteCode);
    yield takeEvery(campaignActions.names.leaveCampaign, leaveCampaign);
    yield takeEvery(campaignActions.names.kickFromCampaign, kickFromCampaign);
    yield takeEvery(campaignActions.names.newCampaign, newCampaign);
    yield takeEvery(campaignActions.names.editCampaign, editCampaign);
    yield takeEvery(campaignActions.names.deleteCampaign, deleteCampaign);
    yield takeEvery(campaignActions.names.fetchNotes, fetchNotes);
    yield takeEvery(campaignActions.names.fetchSharedNotes, fetchSharedNotes);
    yield takeEvery(campaignActions.names.createNote, createNote);
    yield takeEvery(campaignActions.names.fetchLabels, fetchLabels);
    yield takeEvery(campaignActions.names.createLabel, createLabel);
}
