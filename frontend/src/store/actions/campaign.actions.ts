import { Campaign, CampaignEditPayload, CampaignMember } from '../../types/campaign.types';
import { CharacterPrototype, ListCharacter } from '../../types/character.types';
import { CreateLabelPayload, Label } from '../../types/label.types';
import { CreateNotePayload, Note } from '../../types/note.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCampaigns = 'FETCH_CAMPAIGNS',
    fetchCampaign = 'FETCH_CAMPAIGN',
    setCampaignsLoading = 'SET_CAMPAIGNS_LOADING',
    setCampaigns = 'SET_CAMPAIGNS',
    setCampaignLoading = 'SET_CAMPAIGN_LOADING',
    setCampaign = 'SET_CAMPAIGN',
    fetchCharacters = 'FETCH_CHARACTERS',
    createCharacter = 'CREATE_CHARACTER',
    setCharactersLoading = 'SET_CHARACTERS_LOADING',
    setCharacters = 'SET_CHARACTERS',
    setMembersLoading = 'SET_MEMBERS_LOADING',
    fetchMembers = 'FETCH_MEMBERS',
    setMembers = 'SET_MEMBERS',
    newCampaign = 'NEW_CAMPAIGN',
    joinCampaign = 'JOIN_CAMPAIGN',
    rotateInviteCode = 'ROTATE_INVITE_CODE',
    kickFromCampaign = 'KICK_FROM_CAMPAIGN',
    leaveCampaign = 'LEAVE_CAMPAIGN',
    editCampaign = 'EDIT_CAMPAIGN',
    deleteCampaign = 'DELETE_CAMPAIGN',
    fetchNotes = 'FETCH_CAMPAIGN_NOTES',
    setNotesLoading = 'SET_CAMPAIGN_NOTES_LOADING',
    setNotes = 'SET_CAMPAIGN_NOTES',
    fetchSharedNotes = 'FETCH_SHARED_CAMPAIGN_NOTES',
    setSharedNotesLoading = 'SET_SHARED_CAMPAIGN_NOTES_LOADING',
    setSharedNotes = 'SET_SHARED_CAMPAIGN_NOTES',
    createNote = 'CREATE_CAMPAIGN_NOTE',
    fetchLabels = 'FETCH_LABELS',
    setLabelsLoading = 'SET_LABELS_LOADING',
    setLabels = 'SET_LABELS',
    createLabel = 'CREATE_LABEL'
}

export const actions = {
    fetchCampaigns: () => createAction(names.fetchCampaigns),
    fetchCampaign: (id: string) => createAction(names.fetchCampaign, id),
    setCampaignsLoading: (p: boolean) => createAction(names.setCampaignsLoading, p),
    setCampaigns: (p: Campaign[]) => createAction(names.setCampaigns, p),
    setCampaignLoading: (p: boolean) => createAction(names.setCampaignLoading, p),
    setCampaign: (p: Campaign) => createAction(names.setCampaign, p),
    fetchCharacters: (campaignId: string) => createAction(names.fetchCharacters, campaignId),
    createCharacter: (p: { campaignId: string; character: CharacterPrototype }) =>
        createAction(names.createCharacter, p),
    setCharactersLoading: (p: boolean) => createAction(names.setCharactersLoading, p),
    setCharacters: (p: ListCharacter[]) => createAction(names.setCharacters, p),
    fetchMembers: (campaignId: string) => createAction(names.fetchMembers, campaignId),
    setMembersLoading: (p: boolean) => createAction(names.setMembersLoading, p),
    setMembers: (p: CampaignMember[]) => createAction(names.setMembers, p),
    newCampaign: (p: string) => createAction(names.newCampaign, p),
    joinCampaign: (p: string) => createAction(names.joinCampaign, p),
    rotateInviteCode: (p: string) => createAction(names.rotateInviteCode, p),
    leaveCampaign: (p: string) => createAction(names.leaveCampaign, p),
    kickFromCampaign: (p: { campaignId: string; userId: string }) => createAction(names.kickFromCampaign, p),
    editCampaign: (p: CampaignEditPayload) => createAction(names.editCampaign, p),
    deleteCampaign: (p: string) => createAction(names.deleteCampaign, p),
    fetchNotes: (id: string) => createAction(names.fetchNotes, id),
    setNotesLoading: (p: boolean) => createAction(names.setNotesLoading, p),
    setNotes: (p: Note[]) => createAction(names.setNotes, p),
    fetchSharedNotes: (id: string) => createAction(names.fetchSharedNotes, id),
    setSharedNotesLoading: (p: boolean) => createAction(names.setSharedNotesLoading, p),
    setSharedNotes: (p: Note[]) => createAction(names.setSharedNotes, p),
    createNote: (p: CreateNotePayload) => createAction(names.createNote, p),
    fetchLabels: (id: string) => createAction(names.fetchLabels, id),
    setLabelsLoading: (p: boolean) => createAction(names.setLabelsLoading, p),
    setLabels: (p: Label[]) => createAction(names.setLabels, p),
    createLabel: (p: CreateLabelPayload) => createAction(names.createLabel, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
