import { Moment } from 'moment';
import { Label, ListLabel } from './label.types';

export interface Character {
    id: string;
    name: string;
    description: string;
    labels: Label[];
    visible: boolean;
}

export interface ListCharacter {
    id: string;
    name: string;
    description: string;
    labels: ListLabel[];
    visible: boolean;
}

export interface ProposedCharacter {
    id: string;
    name: string;
    description: string;
    proposedOn: Moment;
    proposedBy: string;
}

export function isProposedCharacter(character: ListCharacter | ProposedCharacter): character is ProposedCharacter {
    return (character as ProposedCharacter).proposedBy !== undefined;
}

export interface CharacterPrototype {
    name: string;
    description: string;
}

export interface CharacterEditPayload {
    characterId: string;
    name: string;
    description: string;
}

export interface ProposedCharacterEditPayload {
    campaignId: string;
    characterId: string;
    name: string;
    description: string;
}

export interface VisibilityUpdatePayload {
    characterId: string;
    visible: boolean;
}
