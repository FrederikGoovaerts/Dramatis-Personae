import { CreateNotePayload, Note } from '../../types/note.types';
import { Character, CharacterEditPayload, VisibilityUpdatePayload } from '../../types/character.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCharacter = 'FETCH_CHARACTER',
    setCharacterLoading = 'SET_CHARACTER_LOADING',
    setCharacter = 'SET_CHARACTER',
    fetchNotes = 'FETCH_NOTES',
    setNotesLoading = 'SET_NOTES_LOADING',
    setNotes = 'SET_NOTES',
    fetchSharedNotes = 'FETCH_SHARED_NOTES',
    setSharedNotesLoading = 'SET_SHARED_NOTES_LOADING',
    setSharedNotes = 'SET_SHARED_NOTES',
    editCharacter = 'EDIT_CHARACTER',
    deleteCharacter = 'DELETE_CHARACTER',
    acceptProposedCharacter = 'ACCEPT_PROPOSED_CHARACTER',
    deleteProposedCharacter = 'DELETE_PROPOSED_CHARACTER',
    createNote = 'CREATE_NOTE',
    setVisibility = 'SET_CHARACTER_VISIBILITY'
}

export const actions = {
    fetchCharacter: (id: string) => createAction(names.fetchCharacter, id),
    setCharacterLoading: (p: boolean) => createAction(names.setCharacterLoading, p),
    setCharacter: (p: Character) => createAction(names.setCharacter, p),
    fetchNotes: (id: string) => createAction(names.fetchNotes, id),
    setNotesLoading: (p: boolean) => createAction(names.setNotesLoading, p),
    setNotes: (p: Note[]) => createAction(names.setNotes, p),
    fetchSharedNotes: (id: string) => createAction(names.fetchSharedNotes, id),
    setSharedNotesLoading: (p: boolean) => createAction(names.setSharedNotesLoading, p),
    setSharedNotes: (p: Note[]) => createAction(names.setSharedNotes, p),
    editCharacter: (p: CharacterEditPayload) => createAction(names.editCharacter, p),
    deleteCharacter: (p: string) => createAction(names.deleteCharacter, p),
    acceptProposedCharacter: (id: string) => createAction(names.acceptProposedCharacter, id),
    deleteProposedCharacter: (p: string) => createAction(names.deleteProposedCharacter, p),
    createNote: (p: CreateNotePayload) => createAction(names.createNote, p),
    setVisible: (p: VisibilityUpdatePayload) => createAction(names.setVisibility, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
