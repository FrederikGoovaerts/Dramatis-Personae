export interface Event {
    id: string;
    name: string;
    description: string;
    ordinal: number;
}

export interface CreateEventPayload {
    campaignId: string;
    name: string;
    description: string;
}

export interface EditEventPayload {
    id: string;
    name: string;
    description: string;
}

export interface EditEventOrdinalPayload {
    id: string;
    newOrdinal: number;
}
