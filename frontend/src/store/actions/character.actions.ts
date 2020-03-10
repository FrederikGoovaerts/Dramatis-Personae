import {
    Character,
    CharacterDeletePayload,
    CharacterPrototype,
    CharacterUpdatePayload,
    CreateNotePayload,
    VisibilityUpdatePayload
} from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCharacter = 'FETCH_CHARACTER',
    setCharacterLoading = 'SET_CHARACTER_LOADING',
    setCharacter = 'SET_CHARACTER',
    newCharacter = 'NEW_CHARACTER',
    updateCharacter = 'UPDATE_CHARACTER',
    deleteCharacter = 'DELETE_CHARACTER',
    setNote = 'SET_CHARACTER_NOTE',
    setVisibility = 'SET_CHARACTER_VISIBILITY'
}

export const actions = {
    fetchCharacter: (id: string) => createAction(names.fetchCharacter, id),
    setCharacterLoading: (p: boolean) => createAction(names.setCharacterLoading, p),
    setCharacter: (p: Character) => createAction(names.setCharacter, p),
    newCharacter: (p: CharacterPrototype) => createAction(names.newCharacter, p),
    updateCharacter: (p: CharacterUpdatePayload) => createAction(names.updateCharacter, p),
    deleteCharacter: (p: CharacterDeletePayload) => createAction(names.deleteCharacter, p),
    setNote: (p: CreateNotePayload) => createAction(names.setNote, p),
    setVisible: (p: VisibilityUpdatePayload) => createAction(names.setVisibility, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
