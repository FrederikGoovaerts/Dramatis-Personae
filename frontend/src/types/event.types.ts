export interface Event {
    id: string;
    name: string;
    description: string;
    characters: EventRelation[];
    ordinal: number;
}

export interface EventRelation {
    name: string;
    id: string;
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
