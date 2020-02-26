import { Campaign, CampaignDetail } from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCampaigns = 'FETCH_CAMPAIGNS',
    fetchCampaign = 'FETCH_CAMPAIGN',
    setCampaignsLoading = 'SET_CAMPAIGNS_LOADING',
    setCampaigns = 'SET_CAMPAIGNS',
    setCampaignLoading = 'SET_CAMPAIGN_LOADING',
    setCampaign = 'SET_CAMPAIGN',
    newCampaign = 'NEW_CAMPAIGN',
    joinCampaign = 'JOIN_CAMPAIGN',
    deleteCampaign = 'DELETE_CAMPAIGN',
}

export const actions = {
    fetchCampaigns: () => createAction(names.fetchCampaigns),
    fetchCampaign: (id: string) => createAction(names.fetchCampaign, id),
    setCampaignsLoading: (p: boolean) => createAction(names.setCampaignsLoading, p),
    setCampaigns: (p: Campaign[]) => createAction(names.setCampaigns, p),
    setCampaignLoading: (p: boolean) => createAction(names.setCampaignLoading, p),
    setCampaign: (p: CampaignDetail) => createAction(names.setCampaign, p),
    newCampaign: (p: string) => createAction(names.newCampaign, p),
    joinCampaign: (p: string) => createAction(names.joinCampaign, p),
    deleteCampaign: (p: number) => createAction(names.deleteCampaign, p),
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
