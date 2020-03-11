export interface Note {
    id: string;
    contents: string;
}

export interface CreateNotePayload {
    characterId: string;
    note: string;
}
