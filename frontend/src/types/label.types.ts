export interface Label {
    id: string;
    name: string;
    visible: boolean;
}

export interface ListLabel {
    name: string;
    visible: boolean;
}

export interface CreateLabelPayload {
    id: string;
    name: string;
    visible: boolean;
}

export interface EditLabelPayload {
    campaignId: string;
    labelId: string;
    name: string;
    visible: boolean;
}

export interface DeleteLabelPayload {
    campaignId: string;
    labelId: string;
}

export interface AddLabelPayload {
    characterId: string;
    labelId: string;
}

export interface RemoveLabelPayload {
    characterId: string;
    labelId: string;
}
