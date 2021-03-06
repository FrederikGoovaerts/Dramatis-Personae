import { DeleteLabelPayload, EditLabelPayload } from '../../types/label.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    editLabel = 'EDIT_LABEL',
    deleteLabel = 'DELETE_LABEL'
}

export const actions = {
    editLabel: (p: EditLabelPayload) => createAction(names.editLabel, p),
    deleteLabel: (p: DeleteLabelPayload) => createAction(names.deleteLabel, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
