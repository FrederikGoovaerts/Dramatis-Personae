import { axiosInstance } from '../config/axios';
import { api } from '../config/constants';
import { buildPath } from './base.api';
import { EditNotePayload } from '../types/note.types';

export async function editCharacterNote(payload: EditNotePayload): Promise<void> {
    const url = buildPath(`${api.CHARACTER_NOTE.PATH}/${payload.noteId}`);
    await axiosInstance.put(url, { contents: payload.contents, visibility: payload.visibility });
}

export async function deleteCharacterNote(id: string): Promise<void> {
    const url = buildPath(`${api.CHARACTER_NOTE.PATH}/${id}`);
    await axiosInstance.delete(url);
}
