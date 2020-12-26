import { combineReducers } from 'redux';

import application, { ApplicationState } from './application.reducers';
import campaign, { CampaignState } from './campaign.reducers';
import character, { CharacterState } from './character.reducers';
import events, { EventState } from './event.reducers';

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
