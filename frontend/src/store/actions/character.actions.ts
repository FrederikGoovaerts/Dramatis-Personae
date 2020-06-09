import { CreateNotePayload, Note } from '../../types/note.types';
import { Character, CharacterEditPayload, VisibilityUpdatePayload } from '../../types/character.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';
import { AddLabelPayload, RemoveLabelPayload } from '../../types/label.types';

export enum names {
    fetchCharacter = 'FETCH_CHARACTER',
    setCharacterLoading = 'SET_CHARACTER_LOADING',
    setCharacter = 'SET_CHARACTER',
    fetchNotes = 'FETCH_CHARACTER_NOTES',
    setNotesLoading = 'SET_CHARACTER_NOTES_LOADING',
    setNotes = 'SET_CHARACTER_NOTES',
    fetchSharedNotes = 'FETCH_SHARED_CHARACTER_NOTES',
    setSharedNotesLoading = 'SET_SHARED_CHARACTER_NOTES_LOADING',
    setSharedNotes = 'SET_SHARED_CHARACTER_NOTES',
    createNote = 'CREATE_CHARACTER_NOTE',
    editCharacter = 'EDIT_CHARACTER',
    deleteCharacter = 'DELETE_CHARACTER',
    setVisibility = 'SET_CHARACTER_VISIBILITY',
    addLabel = 'ADD_CHARACTER_LABEL',
    removeLabel = 'REMOVE_CHARACTER_LABEL'
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
    createNote: (p: CreateNotePayload) => createAction(names.createNote, p),
    editCharacter: (p: CharacterEditPayload) => createAction(names.editCharacter, p),
    deleteCharacter: (p: string) => createAction(names.deleteCharacter, p),
    setVisible: (p: VisibilityUpdatePayload) => createAction(names.setVisibility, p),
    addLabel: (p: AddLabelPayload) => createAction(names.addLabel, p),
    removeLabel: (p: RemoveLabelPayload) => createAction(names.removeLabel, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
