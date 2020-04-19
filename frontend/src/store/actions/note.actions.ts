import { EditNotePayload } from '../../types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    editNote = 'EDIT_NOTE'
}

export const actions = {
    editNote: (p: EditNotePayload) => createAction(names.editNote, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
