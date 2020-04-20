import { EditNotePayload, DeleteNotePayload } from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    editNote = 'EDIT_NOTE',
    deleteNote = 'DELETE_NOTE'
}

export const actions = {
    editNote: (p: EditNotePayload) => createAction(names.editNote, p),
    deleteNote: (p: DeleteNotePayload) => createAction(names.deleteNote, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
