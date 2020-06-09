import { Moment } from 'moment';
import { Label } from './label.types';

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
    labels: string[];
    visible: boolean;
}

export interface ProposedCharacter {
    id: string;
    name: string;
    description: string;
    proposedOn: Moment;
    proposedBy: string;
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
