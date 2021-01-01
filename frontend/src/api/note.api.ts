import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { EditNotePayload, NoteVisibility } from '../types/note.types';
import { buildPath } from './base.api';

export interface RawNote {
    id: string;
    contents: string;
    authorName: string;
    editedOn: string;
    visibility: NoteVisibility;
    owned: boolean;
}

export async function editCharacterNote(payload: EditNotePayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER_NOTE}/${payload.noteId}`);
    await axiosInstance.put(url, { contents: payload.contents, visibility: payload.visibility });
}

export async function deleteCharacterNote(id: string): Promise<void> {
    const url = buildPath(`${api.CHARACTER_NOTE}/${id}`);
    await axiosInstance.delete(url);
}

export async function editCampaignNote(payload: EditNotePayload): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN_NOTE}/${payload.noteId}`);
    await axiosInstance.put(url, { contents: payload.contents, visibility: payload.visibility });
}

export async function deleteCampaignNote(id: string): Promise<void> {
    const url = buildPath(`${api.CAMPAIGN_NOTE}/${id}`);
    await axiosInstance.delete(url);
}
