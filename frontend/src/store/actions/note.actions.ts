import { EditNotePayload, DeleteNotePayload } from '../../types/note.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    editCharacterNote = 'EDIT_CHARACTER_NOTE',
    deleteCharacterNote = 'DELETE_CHARACTER_NOTE'
}

export const actions = {
    editCharacterNote: (p: EditNotePayload) => createAction(names.editCharacterNote, p),
    deleteCharacterNote: (p: DeleteNotePayload) => createAction(names.deleteCharacterNote, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
