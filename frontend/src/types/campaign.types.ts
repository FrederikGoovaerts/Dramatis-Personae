import { ListCharacter } from './character.types';

export interface Campaign {
    id: number;
    owner: string;
    name: string;
    ownedByMe: boolean;
}

export interface CampaignDetail {
    id: number;
    owner: string;
    members: string[];
    name: string;
    characters: ListCharacter[];
    ownedByMe: boolean;
    inviteCode: string | null;
}

export interface CampaignPrototype {
    name: string;
}
