import { combineReducers } from 'redux';
import { Campaign, CampaignDetail } from '../../types';
import { applicationActions, campaignActions } from '../actions';
import { createReducer } from './base';

export interface CampaignState {
    loading: boolean;
    campaigns: Campaign[];
    campaignLoading: boolean;
    campaign: CampaignDetail | null;
}

const campaignReducers = combineReducers<CampaignState>({
    loading: createReducer(false, campaignActions.names.setCampaignsLoading, applicationActions.names.clearStore),
    campaigns: createReducer([], campaignActions.names.setCampaigns, applicationActions.names.clearStore),
    campaignLoading: createReducer(
        false,
        campaignActions.names.setCampaignLoading,
        applicationActions.names.clearStore
    ),
    campaign: createReducer(null, campaignActions.names.setCampaign, applicationActions.names.clearStore)
});

export default campaignReducers;
