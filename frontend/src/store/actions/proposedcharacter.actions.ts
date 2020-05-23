import { ProposedCharacterEditPayload } from '../../types/character.types';
import { ActionTypeMapping, ActionUnion, createAction } from './base';

export enum names {
    acceptProposedCharacter = 'ACCEPT_PROPOSED_CHARACTER',
    deleteProposedCharacter = 'DELETE_PROPOSED_CHARACTER',
    editProposedCharacter = 'EDIT_PROPOSED_CHARACTER'
}

export const actions = {
    acceptProposedCharacter: (p: { campaignId: string; characterId: string }) =>
        createAction(names.acceptProposedCharacter, p),
    deleteProposedCharacter: (p: { campaignId: string; characterId: string }) =>
        createAction(names.deleteProposedCharacter, p),
    editProposedCharacter: (p: ProposedCharacterEditPayload) => createAction(names.editProposedCharacter, p)
};

export type allTypes = ActionUnion<typeof actions>;
export type specificTypes = ActionTypeMapping<typeof actions>;
