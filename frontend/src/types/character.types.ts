import { Label, ListLabel } from './label.types';
import { Relation } from './relation.types';

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

export interface CharacterRelation extends Relation {
    id: string;
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

export interface MergeCharacterPayload {
    id: string;
    target: string;
}

export interface CreateRelationPayload {
    orig: string;
    dest: string;
    relation: string;
}

export interface DeleteRelationPayload {
    charId: string;
    relationId: string;
}
