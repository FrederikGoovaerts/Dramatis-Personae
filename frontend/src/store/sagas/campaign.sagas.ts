import { call, put, takeEvery } from 'redux-saga/effects';
import { Campaign, CampaignPrototype, ListCharacter } from '../../types';
import { campaignActions } from '../actions';
import * as campaign from '../../api/campaign.api';

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

function* newCampaign(action: campaignActions.specificTypes['newCampaign']) {
    try {
        const prototype: CampaignPrototype = { name: action.payload };
        yield call(campaign.create, prototype);
        yield put(campaignActions.actions.fetchCampaigns());
    } catch (e) {
        console.error('Unable to create campaign. Please try again later.');
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

export default function* watcher() {
    yield takeEvery(campaignActions.names.fetchCampaigns, fetchCampaigns);
    yield takeEvery(campaignActions.names.fetchCampaign, fetchCampaign);
    yield takeEvery(campaignActions.names.fetchCharacters, fetchCharacters);
    yield takeEvery(campaignActions.names.createCharacter, createCharacter);
    yield takeEvery(campaignActions.names.joinCampaign, joinCampaign);
    yield takeEvery(campaignActions.names.newCampaign, newCampaign);
    yield takeEvery(campaignActions.names.deleteCampaign, deleteCampaign);
}
