import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import application, { ApplicationState } from './application.reducers';
import campaign, { CampaignState } from './campaign.reducers';
import character, { CharacterState } from './character.reducers';
import events, { EventState } from './event.reducers';

export const campaignLoadingSelector = (state: RootState) => state.campaign.loading;
export const campaignCharactersLoadingSelector = (state: RootState) => state.campaign.charactersLoading;
const campaignNotesLoadingSelector = (state: RootState) => state.campaign.notesLoading;
const campaignSharedNotesLoadingSelector = (state: RootState) => state.campaign.sharedNotesLoading;

export const campaignAllNotesLoadingSelector = createSelector(
    campaignNotesLoadingSelector,
    campaignSharedNotesLoadingSelector,
    (notesLoading, sharedNotesLoading) => notesLoading || sharedNotesLoading
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
