import { combineReducers } from 'redux';
import { Character } from '../../types/character.types';
import { applicationActions, characterActions } from '../actions';
import { createReducer } from './base';
import { Note } from '../../types/note.types';

export interface CharacterState {
    loading: boolean;
    character: Character | null;
    notes: Note[];
    notesLoading: boolean;
    sharedNotes: Note[];
    sharedNotesLoading: boolean;
}

const characterReducers = combineReducers<CharacterState>({
    character: createReducer(null, characterActions.names.setCharacter, applicationActions.names.clearStore),
    loading: createReducer(false, characterActions.names.setCharacterLoading, applicationActions.names.clearStore),
    notes: createReducer([], characterActions.names.setNotes, applicationActions.names.clearStore),
    notesLoading: createReducer(false, characterActions.names.setNotesLoading, applicationActions.names.clearStore),
    sharedNotes: createReducer([], characterActions.names.setSharedNotes, applicationActions.names.clearStore),
    sharedNotesLoading: createReducer(
        false,
        characterActions.names.setSharedNotesLoading,
        applicationActions.names.clearStore
    )
});

export default characterReducers;
