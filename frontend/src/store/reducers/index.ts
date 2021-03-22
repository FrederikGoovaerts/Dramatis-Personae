import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import application, { ApplicationState } from './application.reducers';
import campaign, { CampaignState } from './campaign.reducers';
import character, { CharacterState } from './character.reducers';
import events, { EventState } from './event.reducers';

export const campaignLoadingSelector = (state: RootState) => state.campaign.loading;
export const campaignCharactersLoadingSelector = (state: RootState) => state.campaign.charactersLoading;
export const eventsLoadingSelector = (state: RootState) => state.events.loading;
const campaignNotesLoadingSelector = (state: RootState) => state.campaign.notesLoading;
const campaignSharedNotesLoadingSelector = (state: RootState) => state.campaign.sharedNotesLoading;
const characterNotesLoadingSelector = (state: RootState) => state.character.notesLoading;
const characterSharedNotesLoadingSelector = (state: RootState) => state.character.sharedNotesLoading;
export const campaignLabelsLoadingSelector = (state: RootState) => state.campaign.labelsLoading;

export const campaignAllNotesLoadingSelector = createSelector(
    campaignNotesLoadingSelector,
    campaignSharedNotesLoadingSelector,
    (notesLoading, sharedNotesLoading) => notesLoading || sharedNotesLoading
);

export const characterAllNotesLoadingSelector = createSelector(
    characterNotesLoadingSelector,
    characterSharedNotesLoadingSelector,
    (notesLoading, sharedNotesLoading) => notesLoading || sharedNotesLoading
);

export const campaignCharacterListLoadingSelector = createSelector(
    campaignCharactersLoadingSelector,
    campaignLabelsLoadingSelector,
    (chars, labels) => chars || labels
);

export interface RootState {
    application: ApplicationState;
    campaign: CampaignState;
    character: CharacterState;
    events: EventState;
}

const rootReducer = combineReducers<RootState>({
    application,
    campaign,
    character,
    events
});

export default rootReducer;
