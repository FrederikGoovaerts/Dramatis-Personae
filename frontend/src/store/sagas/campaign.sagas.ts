import { call, put, takeEvery } from 'redux-saga/effects';
import { Campaign, CampaignPrototype } from '../../types';
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

// function* deleteCampaign(action: campaignActions.specificTypes['deleteCampaign']) {
//     try {
//         yield campaign.deletePermanently(action.payload);
//         yield put(campaignActions.actions.fetchCampaigns());
//     } catch (e) {
//         console.error('Unable to delete campaign. Please try again later.');
//     }
// }

export default function* watcher() {
    yield takeEvery(campaignActions.names.fetchCampaigns, fetchCampaigns);
    yield takeEvery(campaignActions.names.joinCampaign, joinCampaign);
    yield takeEvery(campaignActions.names.newCampaign, newCampaign);
    // yield takeEvery(campaignActions.names.deleteCampaign, deleteCampaign);
}
