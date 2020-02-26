import { combineReducers } from 'redux';
import application, { ApplicationState } from './application.reducers';
import campaign, { CampaignState } from './campaign.reducers';
import character, { CharacterState } from './character.reducers';

export interface RootState {
    application: ApplicationState;
    campaign: CampaignState;
    character: CharacterState;
}

const rootReducer = combineReducers<RootState>({
    application,
    campaign,
    character,
});

export default rootReducer;
