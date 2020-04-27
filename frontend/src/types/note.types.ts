export interface Note {
    id: string;
    contents: string;
}

export interface CreateNotePayload {
    characterId: string;
    contents: string;
}

export interface EditNotePayload {
    characterId: string;
    noteId: string;
    contents: string;
}

export interface DeleteNotePayload {
    characterId: string;
    noteId: string;
}
