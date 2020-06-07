export interface CampaignSettings {
    autoAcceptProposedCharacter: boolean;
}

export interface Campaign {
    id: string;
    name: string;
    owner: boolean;
    ownerName: string;
    settings: CampaignSettings;
    inviteCode?: string;
}

export interface CampaignPrototype {
    name: string;
}

export interface CampaignMember {
    name: string;
    id: string;
    owner: boolean;
}

export interface CampaignEditPayload {
    id: string;
    name: string;
    autoAcceptProposedCharacter: boolean;
}

export interface CampaignSettings {
    autoAcceptProposedCharacter: boolean;
    allowPlayerLabelManagement: boolean;
    allowPlayerCharacterLabelManagement: boolean;
}
