export interface Character {
    id: string;
    name: string;
    description: string;
    visible: boolean;
}

export interface ListCharacter {
    id: string;
    name: string;
    visible: boolean;
}

export interface CharacterPrototype {
    name: string;
    description: string;
}

export interface CharacterUpdatePayload {
    characterId: string;
    update: CharacterPrototype;
}

export interface CharacterDeletePayload {
    campaignId: string;
    characterId: string;
}

export interface VisibilityUpdatePayload {
    characterId: string;
    visible: boolean;
}
