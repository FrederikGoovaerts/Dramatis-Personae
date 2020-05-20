import { Moment } from 'moment';

export type NoteVisibility = 'PRIVATE' | 'DM_SHARED' | 'PUBLIC';

export interface Note {
    id: string;
    contents: string;
    authorName: string;
    addedOn: Moment;
    editedOn: Moment;
    visibility: NoteVisibility;
}

export interface CreateNotePayload {
    characterId: string;
    contents: string;
    visibility: NoteVisibility;
}

export interface EditNotePayload {
    characterId: string;
    noteId: string;
    contents: string;
    visibility: NoteVisibility;
}

export interface DeleteNotePayload {
    characterId: string;
    noteId: string;
}
