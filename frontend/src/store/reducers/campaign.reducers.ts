import { combineReducers } from 'redux';
import { Campaign, CampaignMember } from '../../types/campaign.types';
import { ListCharacter, ProposedCharacter } from '../../types/character.types';
import { applicationActions, campaignActions } from '../actions';
import { createReducer } from './base';
import { Note } from '../../types/note.types';
import { Label } from '../../types/label.types';

export interface CampaignState {
    loading: boolean;
    campaigns: Campaign[];
    campaignLoading: boolean;
    campaign: Campaign | null;
    charactersLoading: boolean;
    characters: ListCharacter[];
    proposedCharactersLoading: boolean;
    proposedCharacters: ProposedCharacter[];
    members: CampaignMember[];
    membersLoading: boolean;
    notes: Note[];
    notesLoading: boolean;
    sharedNotes: Note[];
    sharedNotesLoading: boolean;
    labels: Label[];
    labelsLoading: boolean;
}

const campaignReducers = combineReducers<CampaignState>({
    loading: createReducer(false, campaignActions.names.setCampaignsLoading, applicationActions.names.clearStore),
    campaigns: createReducer([], campaignActions.names.setCampaigns, applicationActions.names.clearStore),
    campaignLoading: createReducer(
        false,
        campaignActions.names.setCampaignLoading,
        applicationActions.names.clearStore
    ),
    campaign: createReducer(null, campaignActions.names.setCampaign, applicationActions.names.clearStore),
    charactersLoading: createReducer(
        false,
        campaignActions.names.setCharactersLoading,
        applicationActions.names.clearStore
    ),
    characters: createReducer([], campaignActions.names.setCharacters, applicationActions.names.clearStore),
    proposedCharactersLoading: createReducer(
        false,
        campaignActions.names.setProposedCharactersLoading,
        applicationActions.names.clearStore
    ),
    proposedCharacters: createReducer(
        [],
        campaignActions.names.setProposedCharacters,
        applicationActions.names.clearStore
    ),
    members: createReducer([], campaignActions.names.setMembers, applicationActions.names.clearStore),
    membersLoading: createReducer(false, campaignActions.names.setMembersLoading, applicationActions.names.clearStore),
    notes: createReducer([], campaignActions.names.setNotes, applicationActions.names.clearStore),
    notesLoading: createReducer(false, campaignActions.names.setNotesLoading, applicationActions.names.clearStore),
    sharedNotes: createReducer([], campaignActions.names.setSharedNotes, applicationActions.names.clearStore),
    sharedNotesLoading: createReducer(
        false,
        campaignActions.names.setSharedNotesLoading,
        applicationActions.names.clearStore
    ),
    labels: createReducer([], campaignActions.names.setLabels, applicationActions.names.clearStore),
    labelsLoading: createReducer(false, campaignActions.names.setLabelsLoading, applicationActions.names.clearStore)
});

export default campaignReducers;
