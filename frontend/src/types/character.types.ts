export interface Character {
    id: number;
    name: string;
    description: string;
    note: string;
    visible: boolean;
}

export interface CharacterPrototype {
    campaignId: number;
    name: string;
    description: string;
}

export interface CharacterUpdatePayload {
    characterId: number;
    update: CharacterUpdate;
}

export interface CharacterDeletePayload {
    campaignId: number;
    characterId: number;
}

export interface CharacterUpdate {
    name: string;
    description: string;
}

export interface NoteUpdatePayload {
    characterId: number;
    note: string;
}

export interface VisibilityUpdatePayload {
    characterId: number;
    visible: boolean;
}

export interface ListCharacter {
    id: number;
    name: string;
    visible: boolean;
}
