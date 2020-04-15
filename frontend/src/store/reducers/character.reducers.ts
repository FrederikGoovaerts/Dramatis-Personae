import { combineReducers } from 'redux';
import { Character, Note } from '../../types';
import { applicationActions, characterActions } from '../actions';
import { createReducer } from './base';

export interface CharacterState {
    loading: boolean;
    character: Character | null;
    notes: Note[];
    notesLoading: boolean;
}

const characterReducers = combineReducers<CharacterState>({
    character: createReducer(null, characterActions.names.setCharacter, applicationActions.names.clearStore),
    loading: createReducer(false, characterActions.names.setCharacterLoading, applicationActions.names.clearStore),
    notes: createReducer([], characterActions.names.setNotes, applicationActions.names.clearStore),
    notesLoading: createReducer(false, characterActions.names.setNotesLoading, applicationActions.names.clearStore)
});

export default characterReducers;
