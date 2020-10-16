import { combineReducers } from 'redux';

import { Character, CharacterRelation } from '../../types/character.types';
import { Note } from '../../types/note.types';
import { applicationActions, characterActions } from '../actions';
import { createReducer } from './base';

export interface CharacterState {
    loading: boolean;
    character: Character | null;
    relations: CharacterRelation[];
    relationsLoading: boolean;
    notes: Note[];
    notesLoading: boolean;
    sharedNotes: Note[];
    sharedNotesLoading: boolean;
}

const characterReducers = combineReducers<CharacterState>({
    character: createReducer(null, characterActions.names.setCharacter, applicationActions.names.clearStore),
    loading: createReducer(false, characterActions.names.setCharacterLoading, applicationActions.names.clearStore),
    relations: createReducer([], characterActions.names.setRelations, applicationActions.names.clearStore),
    relationsLoading: createReducer(
        false,
        characterActions.names.setRelationsLoading,
        applicationActions.names.clearStore
    ),
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
