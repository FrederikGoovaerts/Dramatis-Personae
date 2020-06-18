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
    campaignSettings: CampaignSettings;
}

export interface CampaignSettings {
    allowPlayerCharacterManagement: boolean;
    allowPlayerLabelManagement: boolean;
    allowPlayerCharacterLabelManagement: boolean;
}
