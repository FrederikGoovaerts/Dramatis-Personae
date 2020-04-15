import {
    Character,
    CharacterDeletePayload,
    CharacterUpdatePayload,
    CreateNotePayload,
    VisibilityUpdatePayload,
    Note
} from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCharacter = 'FETCH_CHARACTER',
    setCharacterLoading = 'SET_CHARACTER_LOADING',
    setCharacter = 'SET_CHARACTER',
    fetchNotes = 'FETCH_NOTES',
    setNotesLoading = 'SET_NOTES_LOADING',
    setNotes = 'SET_NOTES',
    updateCharacter = 'UPDATE_CHARACTER',
    deleteCharacter = 'DELETE_CHARACTER',
    setVisibility = 'SET_CHARACTER_VISIBILITY'
}

export const actions = {
    fetchCharacter: (id: string) => createAction(names.fetchCharacter, id),
    setCharacterLoading: (p: boolean) => createAction(names.setCharacterLoading, p),
    setCharacter: (p: Character) => createAction(names.setCharacter, p),
    fetchNotes: (id: string) => createAction(names.fetchNotes, id),
    setNotesLoading: (p: boolean) => createAction(names.setNotesLoading, p),
    setNotes: (p: Note[]) => createAction(names.setNotes, p),
    updateCharacter: (p: CharacterUpdatePayload) => createAction(names.updateCharacter, p),
    deleteCharacter: (p: CharacterDeletePayload) => createAction(names.deleteCharacter, p),
    setVisible: (p: VisibilityUpdatePayload) => createAction(names.setVisibility, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
