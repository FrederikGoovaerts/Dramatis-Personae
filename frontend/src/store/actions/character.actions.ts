import {
    Character,
    CharacterEditPayload,
    CharacterRelation,
    CreateRelationPayload,
    MergeCharacterPayload
} from '../../types/character.types';
import { AddLabelPayload, RemoveLabelPayload } from '../../types/label.types';
import { CreateNotePayload, Note } from '../../types/note.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    fetchCharacter = 'FETCH_CHARACTER',
    mergeCharacter = 'MERGE_CHARACTER',
    setCharacterLoading = 'SET_CHARACTER_LOADING',
    setCharacter = 'SET_CHARACTER',
    fetchRelations = 'FETCH_CHARACTER_RELATIONS',
    setRelationsLoading = 'SET_CHARACTER_RELATIONS_LOADING',
    setRelations = 'SET_CHARACTER_RELATIONS',
    fetchNotes = 'FETCH_CHARACTER_NOTES',
    setNotesLoading = 'SET_CHARACTER_NOTES_LOADING',
    setNotes = 'SET_CHARACTER_NOTES',
    fetchSharedNotes = 'FETCH_SHARED_CHARACTER_NOTES',
    setSharedNotesLoading = 'SET_SHARED_CHARACTER_NOTES_LOADING',
    setSharedNotes = 'SET_SHARED_CHARACTER_NOTES',
    createRelation = 'CREATE_CHARACTER_RELATION',
    createNote = 'CREATE_CHARACTER_NOTE',
    editCharacter = 'EDIT_CHARACTER',
    deleteCharacter = 'DELETE_CHARACTER',
    addLabel = 'ADD_CHARACTER_LABEL',
    removeLabel = 'REMOVE_CHARACTER_LABEL'
}

export const actions = {
    fetchCharacter: (id: string) => createAction(names.fetchCharacter, id),
    mergeCharacter: (p: MergeCharacterPayload) => createAction(names.mergeCharacter, p),
    setCharacterLoading: (p: boolean) => createAction(names.setCharacterLoading, p),
    setCharacter: (p: Character) => createAction(names.setCharacter, p),
    fetchRelations: (id: string) => createAction(names.fetchRelations, id),
    setRelationsLoading: (p: boolean) => createAction(names.setRelationsLoading, p),
    setRelations: (p: CharacterRelation[]) => createAction(names.setRelations, p),
    fetchNotes: (id: string) => createAction(names.fetchNotes, id),
    setNotesLoading: (p: boolean) => createAction(names.setNotesLoading, p),
    setNotes: (p: Note[]) => createAction(names.setNotes, p),
    fetchSharedNotes: (id: string) => createAction(names.fetchSharedNotes, id),
    setSharedNotesLoading: (p: boolean) => createAction(names.setSharedNotesLoading, p),
    setSharedNotes: (p: Note[]) => createAction(names.setSharedNotes, p),
    createRelation: (p: CreateRelationPayload) => createAction(names.createRelation, p),
    createNote: (p: CreateNotePayload) => createAction(names.createNote, p),
    editCharacter: (p: CharacterEditPayload) => createAction(names.editCharacter, p),
    deleteCharacter: (p: string) => createAction(names.deleteCharacter, p),
    addLabel: (p: AddLabelPayload) => createAction(names.addLabel, p),
    removeLabel: (p: RemoveLabelPayload) => createAction(names.removeLabel, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
