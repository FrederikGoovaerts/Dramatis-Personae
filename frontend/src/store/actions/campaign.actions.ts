import { Campaign, ListCharacter } from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCampaigns = 'FETCH_CAMPAIGNS',
    fetchCampaign = 'FETCH_CAMPAIGN',
    setCampaignsLoading = 'SET_CAMPAIGNS_LOADING',
    setCampaigns = 'SET_CAMPAIGNS',
    setCampaignLoading = 'SET_CAMPAIGN_LOADING',
    setCampaign = 'SET_CAMPAIGN',
    setCharactersLoading = 'SET_CHARACTERS_LOADING',
    setCharacters = 'SET_CHARACTERS',
    newCampaign = 'NEW_CAMPAIGN',
    joinCampaign = 'JOIN_CAMPAIGN',
    deleteCampaign = 'DELETE_CAMPAIGN'
}

export const actions = {
    fetchCampaigns: () => createAction(names.fetchCampaigns),
    fetchCampaign: (id: string) => createAction(names.fetchCampaign, id),
    setCampaignsLoading: (p: boolean) => createAction(names.setCampaignsLoading, p),
    setCampaigns: (p: Campaign[]) => createAction(names.setCampaigns, p),
    setCampaignLoading: (p: boolean) => createAction(names.setCampaignLoading, p),
    setCampaign: (p: Campaign) => createAction(names.setCampaign, p),
    setCharactersLoading: (p: boolean) => createAction(names.setCharactersLoading, p),
    setCharacters: (p: ListCharacter[]) => createAction(names.setCharacters, p),
    newCampaign: (p: string) => createAction(names.newCampaign, p),
    joinCampaign: (p: string) => createAction(names.joinCampaign, p),
    deleteCampaign: (p: string) => createAction(names.deleteCampaign, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
