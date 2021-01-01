import { Moment } from 'moment';

export type NoteVisibility = 'PRIVATE' | 'DM_SHARED' | 'PUBLIC';

export interface Note {
    id: string;
    contents: string;
    authorName: string;
    editedOn: Moment;
    visibility: NoteVisibility;
    owned: boolean;
}

export interface CreateNotePayload {
    id: string;
    contents: string;
    visibility: NoteVisibility;
}

export interface EditNotePayload {
    id: string;
    noteId: string;
    contents: string;
    visibility: NoteVisibility;
}

export interface DeleteNotePayload {
    id: string;
    noteId: string;
}
