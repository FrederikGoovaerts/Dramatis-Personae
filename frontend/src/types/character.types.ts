import { Moment } from 'moment';

export interface Character {
    id: string;
    name: string;
    description: string;
    visible: boolean;
    addedOn: Moment;
}

export interface ListCharacter {
    id: string;
    name: string;
    description: string;
    addedOn: Moment;
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
