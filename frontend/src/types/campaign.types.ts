export interface Campaign {
    id: string;
    name: string;
    owner: boolean;
    ownerName: string;
}

export interface CampaignPrototype {
    name: string;
}

export interface CampaignMember {
    name: string;
    owner: boolean;
}

export interface CampaignEditPayload {
    id: string;
    name: string;
}
