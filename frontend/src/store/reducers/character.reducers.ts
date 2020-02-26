import { combineReducers } from 'redux';
import { Character } from '../../types';
import { applicationActions, characterActions } from '../actions';
import { createReducer } from './base';

export interface CharacterState {
    loading: boolean;
    character: Character | null;
}

const characterReducers = combineReducers<CharacterState>({
    loading: createReducer(false, characterActions.names.setCharacterLoading, applicationActions.names.clearStore),
    character: createReducer(null, characterActions.names.setCharacter, applicationActions.names.clearStore)
});

export default characterReducers;
