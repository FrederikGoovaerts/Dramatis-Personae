import { DeleteNotePayload, EditNotePayload } from '../../types/note.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    editCharacterNote = 'EDIT_CHARACTER_NOTE',
    deleteCharacterNote = 'DELETE_CHARACTER_NOTE',
    editCampaignNote = 'EDIT_CAMPAIGN_NOTE',
    deleteCampaignNote = 'DELETE_CAMPAIGN_NOTE'
}

export const actions = {
    editCharacterNote: (p: EditNotePayload) => createAction(names.editCharacterNote, p),
    deleteCharacterNote: (p: DeleteNotePayload) => createAction(names.deleteCharacterNote, p),
    editCampaignNote: (p: EditNotePayload) => createAction(names.editCampaignNote, p),
    deleteCampaignNote: (p: DeleteNotePayload) => createAction(names.deleteCampaignNote, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
