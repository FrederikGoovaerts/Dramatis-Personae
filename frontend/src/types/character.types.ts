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

export interface CharacterPrototype {
    name: string;
    description: string;
    visible: boolean;
}

export interface CharacterEditPayload {
    characterId: string;
    name: string;
    description: string;
    visible: boolean;
}
